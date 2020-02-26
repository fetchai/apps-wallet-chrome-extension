import { fetchResource } from '../utils/fetchRescource'
import { BOOTSTRAP_REQUEST_URI, DEFAULT_FEE_LIMIT } from '../constants'
import { Transaction } from 'fetchai-ledger-api/src/fetchai/ledger'
import { encode_transaction } from 'fetchai-ledger-api/src/fetchai/ledger/serialization'
import { BN } from 'bn.js'
import { Address } from 'fetchai-ledger-api/src/fetchai/ledger/crypto'
import { Bootstrap } from 'fetchai-ledger-api/src/fetchai/ledger/api/bootstrap'

/**
 *
 * An aside for Josh to delete: The reason for this rather than use javascript SDK is because to use javascript SDK as background script (needed for these requests) needed webpack to re-bundle
 * javascript sdk, and to webpack JS SDK for Chrome extension needs stronger set of webpack rules (eg no eval due to stronger CORS policy of background scripts)
 * (achieved by setting globals false in config in webpack)
 * One module ( a dependency) we used called Buffer ( An npm module allowing us to have same api for buffers in browser and client) had syntax errors in webpack
 * on that level of strictness meaning that I could not get javascript SDK into background script easily. I will try to fix this issue by fixing this module but I just did it this way
 * for this project to get it done. The point of this is that it is run in the content scripts which can use js sdk partially and creates requests which we then proxy to the background scripts.
 *
 * I regret doing it this way rather than spending more time trying to fix the webpack issues ( I spent a while and it seemed harder) to get the js sdk into background script but I have now done it this way.
 *
 * Its not very tough to refactor this out if needed at a later date.
 *
 */

export class API {

  constructor (host, port, protocol) {
    this.host = host
    this.port = port
    this.protocol = protocol
  }

  /**
   * Uses bootstrap url, and network name specified in constants and gets host and port from bootstrap
   * returning a promise that resolves to false if bootstrap fails or an API object.
   *
   * @returns {Promise<boolean|API>}
   */
  static async fromBootstrap () {
    let address = await API.getBootstrapAddress()
    if (address === false) return false
    const [protocol, host, port] = Bootstrap.split_address(address)
    return new API(host, port, protocol)
  }

  static getBootstrapAddress () {
    const promise = new Promise(async (resolve, reject) => {
      const response = await fetchResource(BOOTSTRAP_REQUEST_URI).catch(() => reject(false))
      if (response.status < 200 || response.status > 300) reject(false)
      const data = await response.json().catch(() => reject(false))
      resolve(data[0].address)
    })
    return promise
  }

  /**
   * Gets FEt Balance of account, or false if error.
   *
   * @param address
   * @returns {Promise<API.balance|TokenApi.balance|Account.balance|((address: AddressLike) => Promise<>)|*|null|boolean>}
   */
  async balance (address) {

    const body = {
      method: 'post',
      body: JSON.stringify({ address: address })
    }

    const url = `${this.protocol}://${this.host}:${this.port}/api/contract/fetch/token/balance`

    let error = false
    const response = await fetchResource(url, body).catch(() => error = true)

    if (error) return false

    if (200 < response.status || response.status > 300)
      return false

    const data = await response.json()
    return data.balance
  }

  /**
   * Gets block number.
   *
   * @returns {Promise<boolean|*>}
   */
  async getBlockNumber () {
    const url = `${this.protocol}://${this.host}:${this.port}/api/status/chain`
    let error = false

    const response = await fetchResource(url).catch(() => {
      error = true
    })

    if (error) return false

    if (200 < response.status || response.status > 300) {
      return false
    }

    const obj = await response.json()

    return obj['chain'][0].blockNumber
  }

  /**
   * Polls status of request, a transfer in this instance. Returns false on error or status string of status of request.
   *
   * @param tx_digest
   * @returns {Promise<string|boolean>}
   */

  async poll (tx_digest) {

    let error = false

    let url = `${this.protocol}://${this.host}:${this.port}/api/status/tx/${tx_digest}`

    const body = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await fetchResource(url, body).catch(() => {
      error = true
    })

    if (error || response.status !== 200) return false
    const data = await response.json().catch(() => error = true)
    if (error) return false

    return data.status
  }

  async transfer (from, to, amount) {

    const tx = await this.buildTransferTransaction(from, to, amount)
    if (tx === false) return false
debugger
    const encoded_tx = await encode_transaction(tx, [from])

    const body = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ver: '1.2',
        data: encoded_tx.toString('base64')
      })
    }
debugger
    const url = `${this.protocol}://${this.host}:${this.port}/api/contract/fetch/token/transfer`
    let error = false
    const response = await fetchResource(url, body).catch(() => error = true)
debugger
    if (error) return false

    if (200 < response.status || response.status > 300) return false
debugger
    const json = await response.json().catch(() => error = true)
debugger
    if (error || typeof json.txs === 'undefined') return false

    return json.txs[0]
  }

  async buildTransferTransaction (from, to, amount) {

    let current_block = await this.getBlockNumber()
    // build up the basic transaction information
    let tx = new Transaction()
    const DEFAULT_BLOCK_VALIDITY_PERIOD = 100
    tx.valid_until(new BN(current_block + DEFAULT_BLOCK_VALIDITY_PERIOD))
    tx.charge_rate(new BN(1))
    tx.charge_limit(new BN(DEFAULT_FEE_LIMIT))
    // build up the basic transaction information
    tx.from_address(from) //hex of address
    tx.add_transfer(new Address(to), new BN(amount))
    tx.add_signer(from.public_key_hex()) // hex of public key
    // debugger
    const encoded = Buffer.from(JSON.stringify({
      address: from.public_key(), //base64 encoded public key
      amount: amount
    }), 'ascii')

    tx.data(encoded)

    return tx
  }
}
