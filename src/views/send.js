import React, { Component } from 'react'
import {
  BALANCE_CHECK_INTERVAL_MS,
  DOLLAR_PRICE_URI,
  STORAGE_ENUM
} from '../constants'
import { Entity } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/entity'
import { validAddress } from '../utils/validAddress'
import Authentication from '../services/authentication'
import Storage from '../services/storage'

import { goTo } from '../services/router'
import Account from './account'
import { getAssetURI } from '../utils/getAsset'
import { fetchResource } from '../utils/fetchRescource'
import { BN } from 'bn.js'
import { capitalise } from '../utils/capitalise'
import { toCanonicalFet } from '../utils/toCanonicalFet'

const INVALID_ADDRESS_ERROR_MESSAGE = 'Invalid address'
const INSUFFICIENT_FUNDS_ERROR_MESSAGE = 'Insufficient funds'
const INCORRECT_PASSWORD_ERROR_MESSAGE = 'Incorrect password'
const TRANSFER_FAILED_ERROR_MESSAGE = 'transfer failed'
const NETWORK_ERROR_MESSAGE = 'Network error'
const CONFIRM_PASSWORD_PLACEHOLDER = 'Confirm Password'
const TRANSFER_SUBMITTED = 'Transfer Submitted'
const TRANSFER_EXECUTED = 'Transfer Executed'

/**
 * Corresponds to the send view.
 */
export default class Send extends Component {

  constructor (props) {
    super(props)
    // eslint-disable-next-line react/prop-types
    this.api = props.api

    this.sufficientFunds = this.sufficientFunds.bind(this)
    this.transfer = this.transfer.bind(this)
    this.handleTransfer = this.handleTransfer.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.fetchDollarPrice = this.fetchDollarPrice.bind(this)
    this.wipeFormErrors = this.wipeFormErrors.bind(this)
    this.sync = this.sync.bind(this)
    this.setTransferMessage = this.setTransferMessage.bind(this)
    this.balance = this.balance.bind(this)
    this.trunc10DP = this.trunc10DP.bind(this)

    this.state = {
      balance: null,
      password: '',
      to_address: '',
      amount: '',
      copied: false,
      error: false,
      amount_error: false,
      password_error: false,
      address_error: false,
      amount_error_message: '',
      transfer_error: true,
      transfer_message: '',
      transfer_disabled: false
    }
  }

  async wipeFormErrors () {
    return new Promise(resolve => {
      this.setState({
        transfer_disabled: false,
        amount_error: false,
        password_error: false,
        amount_error_message: '',
        transfer_error: true,
        transfer_message: '',
        address_error: false
      }, resolve)
    })
  }

  async componentDidMount () {
    await Authentication.Authenticate()
    // this.fetchDollarPrice()
    this.balance()

    const network = await Storage.getItem(STORAGE_ENUM.SELECTED_NETWORK)
    this.setState({network: network})

    // this.dollar_price_fet_loop = setInterval(this.fetchDollarPrice, DOLLAR_PRICE_CHECK_INTERVAL_MS)
    this.balance_request_loop = setInterval(this.balance, BALANCE_CHECK_INTERVAL_MS)
  }

  /**
   * Fetch the account balance for address
   * stored in state. Upon result we also call method to recalculate the dollar display string.
   */

  async balance () {
    const address = await Storage.getItem(STORAGE_ENUM.ADDRESS)
    const balance = await this.api.balance(address)
    this.setState({ balance: balance })
  }

  componentWillUnmount () {
    clearInterval(this.dollar_price_fet_loop)
    clearInterval(this.balance_request_loop)
    if(typeof this.sync_loop !== "undefined") clearInterval(this.sync_loop)
  }

  /**
   * Fetches current dollar price of FET.
   */
  fetchDollarPrice () {
    fetchResource(DOLLAR_PRICE_URI).then((response) => this.handleDollarPriceResponse(response))
      .catch((err) => {
        console.log('Fetch Error :-S', err)
      })
  }

  /**
   * Processes the result of fetching dollar price of FET. We save to it to state. If we have an a FET amount in state
   * then we look to recalculate the dollar display string and update the user.
   *
   * @param response
   */
  handleDollarPriceResponse (response) {

    if (response.status !== 200) return

    response.json().then((data) => {
      console.log(data)
      let dollar

      if (this.state.amount == '') {
        dollar = null
      } else if (this.state.amount === 0) {
        dollar = 0
      } else {
        dollar = this.calculateDollarDisplayAmount(this.state.amount, data.percentage)
      }

      this.setState({ percentage: data.percentage, dollar: dollar })
    })

  }

  /**
   * Returns the display string of number of dollars ( and 2 decimal places )
   * from the amount (FET) and the percentage price of FET as per API. If amount is over a thousand we only show to
   * nearest dollar
   *
   * @param amount
   * @param percentage
   * @returns {number | string}
   */
  calculateDollarDisplayAmount (amount, percentage) {
    if (amount === '') return ''
    const total = parseFloat(amount) * percentage
    const ret = total.toFixed(2)
    if (ret === "0.00") return "  <0.01"
    return ret;
  }

  /**
   * truncate input to 10 DP as decimal of only 10 decimals can be valid to convert to FET
   * @param amount
   * @returns {number}
   */
  trunc10DP (amount) {
    // ensure that only ten decimal places are allowed on inputs.
    if (!amount.includes('.')) return amount
    const decimal_length = amount.split(".")[1].length
    if(decimal_length <= 10) return amount
    return amount.split(".")[0] + "." + amount.split(".")[1].substring(0,10)
  }

  stripNonNumericChars(s) {
    return s.replace(/[^\d.-]/g, '');
  }

  stripMultipleDecimalPoints(s) {
    if (!s.includes('.') || s.split(".").length === 1) return s
    const arr = s.split(".")
    const first = arr.shift()
    return first + "." + arr.join('')
  }

  /**
   * When amount is changed by user in input (if we have a dollar price of FET from api) we update the dollar amount to show user.
   *
   * @param event
   */
  async handleAmountChange (event) {
    let amount = this.stripNonNumericChars(event.target.value)
        amount = this.stripMultipleDecimalPoints(amount)
        amount = this.trunc10DP(amount)

    const percentage = await Storage.getItem(STORAGE_ENUM.DOLLAR_PRICE);

    if (percentage === null) return this.setState({
      dollar: null,
      amount: event.target.value,
      amount_error_message: '',
      amount_error: false
    })

    await this.sufficientFunds(amount)
    //todo consider number overflow (53 byte) issue then delete this comment when addressed.
    if (parseFloat(amount) === 0) return this.setState({ dollar: 0, amount: 0 })


    this.setState({
      dollar: this.calculateDollarDisplayAmount(amount, percentage),
      amount: amount
    })
  }

  async handleChange (event) {
    let change = {}
    change[event.target.name] = event.target.value
    this.setState(change)
    await this.wipeFormErrors()
  }

  /**
   * Controls logic to decide if we can do transfer, then calls transfer method if requirements to transfer are met.
   *
   * @param event
   * @returns {Promise<void>}
   */
  async handleTransfer (event) {
    event.preventDefault()
    await this.wipeFormErrors()
    // error flags in state within individual validation methods are for displaying individual error messegaes only.
    // this flag is the actual one.
    let error = false

    if (!validAddress(this.state.to_address)) {
      this.setState({ address_error: true })
      error = true
    }

    if (this.state.amount !== '' && !(await this.sufficientFunds(this.state.amount))) {
      error = true
    }

    if (!this.state.password) {
      this.setState({ password_error: true })
      error = true
    } else if (!(await Authentication.correctPassword(this.state.password))) {
      this.setState({ password_error: true })
      error = true
    }

    if (error) return
    // now we send the transfer as no errors that cause us to not make transfer have occured.

    await this.setTransferMessage(TRANSFER_SUBMITTED, 'send_loading_loader.gif', false)
    await this.transfer()

  }

  /**
   *checks status of transaction by polling tx digest and sets the transfer state.status to display to user accordingly,
   * so they can see when it is waiting, an then get quick response when it is done.
   *
   * Similar more genereic method in js SDK buts sets state as we poll.
   */

  async sync (tx_digest) {
    const start = Date.now()
    const limit = 60 * 1000
    return new Promise((resolve, reject) => {
      this.sync_loop = setInterval(async () => {

        let status
        try {
          status = await this.api.poll(tx_digest)
        } catch (e) {
          clearInterval(this.sync_loop)
          await this.setTransferMessage(NETWORK_ERROR_MESSAGE, null,true)
          this.setState({ transfer_disabled: false })
           return reject('API Error')
        }

        await this.setTransferMessage('Transfer Pending', 'send_progress_loader.gif' , false)

        if (/Executed|Submitted/.test(status)) {
          clearInterval(this.sync_loop)
          await this.setTransferMessage(TRANSFER_EXECUTED, 'send_executed_loader.gif', false)
          setTimeout(this.setTransferMessage.bind(null, TRANSFER_EXECUTED, null, false), 2300)

          this.setState({ transfer_disabled: false, amount: '', password: '', dollar: null  })
          resolve(status)
        }

        let elapsed_time = Date.now() - start

        if (elapsed_time > limit) {
          clearInterval(this.sync_loop)
          await this.setTransferMessage(`Transaction timed-out, status: ${status} `, null, true)
          this.setState({ transfer_disabled: false })
          reject(status)
        }

      }, 2000)
    })
  }

  /**
   * awaits set state change of transfer error status
   * 
   * @param transfer_message
   * @param loader_name name of loading icon, which if passed is then added a loading icon gif. 
   * @param transfer_error
   * @returns {Promise<unknown>}
   */
  async setTransferMessage (transfer_message, loader_name = null,  transfer_error = false) {

     transfer_message = (loader_name !== null) ? [transfer_message,
          <img key={1} src={getAssetURI(loader_name)} className="sending-loading-icon"
               alt="Fetch.ai Loading Icon"/>] : transfer_message

    return new Promise(resolve => {
      this.setState({ transfer_message: transfer_message, transfer_error: transfer_error }, resolve)
    })
  }

  /**
   * Actual logic performing a transfer, including calling the syncs.
   *
   * @returns {false|Promise<string>}
   */
  async transfer () {
    this.setState({ transfer_disabled: true })
    const json_str = await Storage.getItem(STORAGE_ENUM.KEY_FILE)
    const entity = await Entity._from_json_object(JSON.parse(json_str), this.state.password)
    let error = false

    const txs = await this.api.transfer(entity, this.state.to_address, toCanonicalFet(this.state.amount)).catch((e) => {debugger; error = true})
    if (error || txs === false) {
      this.setState({ transfer_disabled: false, transfer_error: true, transfer_message: TRANSFER_FAILED_ERROR_MESSAGE })
      return
    }

    await this.sync(txs).catch(() => this.setState({
      transfer_error: true,
      transfer_message: TRANSFER_FAILED_ERROR_MESSAGE
    }))
  }

  /**
   * Checks if we have sufficient funds to transfer transfer_amount + 1
   *
   *
     * We check if a transaction is possible ie amount less than min fee (1) plus amount. The transacation still may fail
     * if fee for transaction hits (fee limit (DEFAULT_FEE_LIMT + amount > balance) but we still allow them to try at this stage
     * since we cannot tell how close actual fees on network are to fee limit so we just use value of 1 since there will always be a
     * fee
     *
   *
   * @returns {Promise<boolean>}
   */
  async sufficientFunds (amount) {
    // this suggests a bad network request

    if (this.state.balance === false || this.state.balance === null) {
      this.setState({ amount_error_message: NETWORK_ERROR_MESSAGE, amount_error: true })
      return false
    }

    const canonical_amount = toCanonicalFet(amount)
    const canonical_amount_plus_min_fee = canonical_amount.add(new BN(1))

    if (new BN(this.state.balance).lt(canonical_amount_plus_min_fee)) {
      this.setState({ amount_error_message: INSUFFICIENT_FUNDS_ERROR_MESSAGE, amount_error: true })
      return false
    }

    this.setState({ amount_error_message: '', amount_error: false })
    return true
  }

  render () {
    return (
      <div id="my-extension-root-inner" className="OverlayMain" data-testid="send">
        <div className="OverlayMainInner">
          <div className='send_title'>
            <div className='address_title_inner'>
              <h3 className="send-title">Send</h3>
            </div>
            <img className='cross' src={getAssetURI('cross_icon.svg')}   data-testid="cross_image" onClick={goTo.bind(null, Account)}/>
          </div>
          <hr></hr>
          <div className={'send-connected-to-network'}>
            Connected to {capitalise(this.state.network)}
          </div>
          <form onSubmit={this.handleTransfer} className="send-form">
            <div className="send_form_row">
              <label htmlFor="to_address">Account<br></br> Number: </label>
              <input className={`send_form_input ${this.state.address_error ? 'red_error' : ''}`} type="text"
                     name="to_address" id="to_address"
                     data-testid="send_address"
                     onChange={this.handleChange.bind(this)} value={this.state.to_address}></input>
            </div>
            <output type="text"
                    data-testid="address_error_output"
                    className={`red_error account-number-error`}>{this.state.address_error ? INVALID_ADDRESS_ERROR_MESSAGE : ''}</output>
            <div className="send_form_row">
              <label htmlFor="amount">Amount: </label>
              <div
                className={`send_form_row_output_wrapper send_form_input ${this.state.amount_error ? 'red_error' : ''}`}>
                <div className="amount_stack_wrapper">
                  <input className={`amount_input  ${this.state.amount_error ? 'red_error' : ''}`} type="text"
                         placeholder="0 FET" name="amount"
                         data-testid="send_amount"
                         id="amount" onChange={this.handleAmountChange}
                         value={this.state.amount}
                         step="any"
                  ></input>
                  <br></br>
                  <output
                    className={this.state.amount_error ? 'red_error' : ''}>{typeof this.state.dollar !== 'undefined' && this.state.dollar !== null ? '$' + this.state.dollar + ' USD' : ''}</output>
                </div>
              </div>
            </div>
            <output type="text" data-testid="amount_error_output"
                    className={`red_error send-amount-error`}>{this.state.amount_error_message}</output>
            <div className="send_form_row send_form_row_password">
              <input
                className={`send_form_password_input ${this.state.password_error ? 'red_error red-lock-icon' : ''}`}
                type="password"
                name="password"
                placeholder={CONFIRM_PASSWORD_PLACEHOLDER}
                data-testid="send_password"
                onChange={this.handleChange.bind(this)} value={this.state.password}
                id="password"></input>
            </div>
            <output type="text"
                    className='red_error password-error'
                    data-testid="password_error_output"
            >{this.state.password_error ? INCORRECT_PASSWORD_ERROR_MESSAGE : ''}</output>
            <output type="text"
                    data-testid="transfer_error_output"
                    className={`send-transfer-status ${this.state.transfer_error ? 'red_error' : ''}`}>{this.state.transfer_message}</output>
            <div className="small-button-container">
              <button className={`send-left-button disabled-pointer ${this.state.transfer_disabled ? 'fade-send-buttons' : ''}`}
                      disabled={this.state.transfer_disabled}
                      data-testid="cancel_button"
                      onClick={goTo.bind(null, Account)}>
                Cancel
              </button>
              <button data-testid="send_submit"
                      className={`send-right-button disabled-pointer ${this.state.transfer_disabled ? 'fade-send-buttons' : ''}`}
                      disabled={this.state.transfer_disabled} type="submit" value="Send">Send
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}