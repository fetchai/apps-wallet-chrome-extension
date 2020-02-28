import React, { Component } from 'react'
import { BALANCE_CHECK_INTERVAL_MS, DOLLAR_PRICE_CHECK_INTERVAL_MS, DOLLAR_PRICE_URI, NETWORK_NAME } from '../constants'
import { Entity } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/entity'
import { validAddress } from '../utils/validAddress'
import Authentication from '../services/authentication'
import Storage from '../services/storage'
import { format } from '../utils/format'
import { goTo } from '../services/router'
import Settings from './settings'
import Account from './account'
import { getAssetURI } from '../utils/getAsset'
import { fetchResource } from '../utils/fetchRescource'
import { copyToClipboard } from '../utils/copyAddressToClipboard'
import { API } from '../services/api'
import { BN } from "bn.js"

/**
 * Corresponds to the send view.
 */
export default class Send extends Component {

  constructor (props) {
    super(props)
    // eslint-disable-next-line react/prop-types
    this.api = props.api;
    this.address = Storage.getLocalStorage('address')
    this.sufficientFunds = this.sufficientFunds.bind(this)
    this.transferController = this.transferController.bind(this)
    this.handleTransfer = this.handleTransfer.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.fetchDollarPrice = this.fetchDollarPrice.bind(this)
    this.handleCopyToClipboard = this.handleCopyToClipboard.bind(this)
    this.reset_form_errors = this.reset_form_errors.bind(this)
    this.sync = this.sync.bind(this)
    this.setTransferMessage = this.setTransferMessage.bind(this)
    this.balance = this.balance.bind(this)

    this.state = {
      balance: null,
      password: '',
      to_address: '',
      percentage: Storage.getLocalStorage("dollar_price"),
      amount: null,
      address: Storage.getLocalStorage('address'),
      copied: false,
      error: false,
      amount_error: false,
      password_error: false,
      address_error: false,
      amount_error_message: '',
      transfer_error: true,
      transfer_message: '',
      host: null,
      port: null,
      transfer_disabled: false
    }
  }

  async reset_form_errors () {
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
    Authentication.Authenticate()

  if(NETWORK_NAME === 'localhost'){
        this.host = '127.0.0.1'
    this.port = 8000
    this.api = new API(this.host, this.port, 'http')
    } else {
      this.api = await API.fromBootstrap();
    }

    this.api = new API(this.host, this.port, 'http')
    this.fetchDollarPrice()
    this.balance()
    this.dollar_price_fet_loop = setInterval(this.fetchDollarPrice, DOLLAR_PRICE_CHECK_INTERVAL_MS)
    this.balance_request_loop = setInterval(this.balance, BALANCE_CHECK_INTERVAL_MS)
  }

    /**
   * Fetch the account balance for address
   * stored in state. Upon result we also call method to recalculate the dollar display string.
   */

  async balance () {
    const balance = await this.api.balance(this.state.address)
    this.setState({ balance: new BN(balance).toString(16) })
  }

  componentWillUnmount () {
    clearInterval(this.dollar_price_fet_loop)
    clearInterval(this.balance_request_loop)
  }

  async handleCopyToClipboard () {
    const copied_status = await copyToClipboard(this.state.address)
    this.setState({ copied: copied_status })
  }

  /**
   * Fetches current dollar price of FET.
   */
  fetchDollarPrice () {
    fetchResource(DOLLAR_PRICE_URI).then((response) => this.handleDollarPriceResponse(response))
      .catch((err) => {
        debugger
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
    if (response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' +
        response.status)
      return
    }

    response.json().then((data) => {
      console.log(data)

      // Dollar variable (and therefore state.dollar) represents the display dollar amount to show the user when typing in a FET amount.
      let dollar

      if (this.state.amount === null) {
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

    if(amount === "")  return "";

    const total = amount * percentage
    const dollar = Number.parseFloat(total)

    //todo decide if to round to dollar (not cents) if high dollar amount egg > 1000
    // if(dollar > 1000){
    //   return Number.parseInt(total)
    // }

    return Number.parseFloat(total).toFixed(2)
  }

  /**
   * When amount is changed by user in input (if we have a dollar price of FET from api) we update the dollar amount to show user.
   *
   * @param event
   */
  handleAmountChange (event) {
    if (this.state.percentage === null) return this.setState({ dollar: null, amount: event.target.value })

    // we don't wait for sufficient funds method by choice.
    if(this.state.balance !== null) this.sufficientFunds()

    //todo consider number overflow (53 byte) issue then delete this comment when addressed.
    if (event.target.value == 0) return this.setState({ dollar: 0, amount: 0 })

    this.setState({
      dollar: this.calculateDollarDisplayAmount(event.target.value, this.state.percentage),
      amount: event.target.value
    })
  }

  /**
   *
   *
   * @param event
   * @returns {Promise<void>}
   */
  async handleChange (event) {
    let change = {}
    change[event.target.name] = event.target.value
    this.setState(change)
    // we don't bother async of these.
    await this.reset_form_errors()
  }

  /**
   * Controls logic to decide if we can do transfer, then calls transfer method if requirements to transfer are met.
   *
   * @param event
   * @returns {Promise<void>}
   */
  async handleTransfer (event) {
    event.preventDefault()
    await this.reset_form_errors()
    // we set this flag which we use to see if we'll make transaction.
    // error flags in state within individual validation methods are for display only.
    // this flag is the actual one.
    let error = false

    if (!validAddress(this.state.to_address)) {
      this.setState({ address_error: true })
      error = true
   } else if (!(await this.sufficientFunds())) {
      error = true
    }

    if (!(await Authentication.correctPassword(this.state.password))) {
      this.setState({ password_error: true })
      error = true
    }

    if (error) return
    // now we send the transfer as no errors that cause us to not make transfer have occured.
     await this.transferController()

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
      const loop = setInterval(async () => {
        let status
        try {
          status = await this.api.poll(tx_digest)
        } catch (e) {
          clearInterval(loop)
          await this.setTransferMessage(`API Error `, true)
          this.setState({transfer_disabled: false})
          reject('API Error')
        }

        await this.setTransferMessage(`Transfer status: ${status} `)

        if (/Executed|Submitted/.test(status)) {
          clearInterval(loop)
          await this.setTransferMessage(`Success! Transaction ${status} `, false)
          this.setState({transfer_disabled: false})
          resolve(status)
        }

        let elapsed_time = Date.now() - start

        if (elapsed_time > limit) {
          clearInterval(loop)
          await this.setTransferMessage(`Transaction timed-out, status: ${status} `, true)
          this.setState({transfer_disabled: false})
          reject(status)
        }

      }, 2000)
    })
  }

  /**
   * awaits set state change of transfer error status
   *
   * @param transfer_message
   * @param transfer_error
   * @returns {Promise<unknown>}
   */
  async setTransferMessage (transfer_message, transfer_error = false) {
    return new Promise(resolve => {
      this.setState({ transfer_message: transfer_message, transfer_error: transfer_error }, resolve)
    })
  }

  /**
   * Actual logic performing a transfer, including calling the syncs.
   *
   * @returns {false|Promise<string>}
   */
  async transferController () {
    // we only disabled this button after click until result shown. to stop somebody accidentally clicking twice quickly.
    this.setState({transfer_disabled: true})
    const json_str = Storage.getLocalStorage('key_file')
     const entity = await Entity._from_json_object(JSON.parse(json_str), this.state.password)
   // const entity = Entity.from_hex('6e8339a0c6d51fc58b4365bf2ce18ff2698d2b8c40bb13fcef7e1ba05df18e4b')
    let error = false
    const txs = await this.api.transfer(entity, this.state.to_address, this.state.amount).catch(() => error = true)
    if (error | txs === false) {
      this.setState({ transfer_disabled: false, transfer_error: true, transfer_message: 'Transfer failed' })
      return;
    }
          await this.sync(txs).catch(() => this.setState({ transfer_error: true, transfer_message: 'Transfer failed' }))
  }

  /**
   * Checks if we have sufficient funds to transfer transfer_amount + 1
   *
   *
   * @returns {Promise<boolean>}
   */
  async sufficientFunds () {

    if (this.state.balance === false) {
      this.setState({ amount_error_message: 'Network error', amount_error: true })
      return false
    }

    /**
     * We check if a transaction is possible ie amount less than min fee (1) plus amount. The transacation still may fail
     * if fee for transaction hits (fee limit (DEFAULT_FEE_LIMT + amount > balance) but we still allow them to try at this stage
     * since we cannot tell how close actual fees on network are to fee limit so we just use value of 1 since there will always be a
     * fee
     *
     */
    if (this.state.balance !== false && new BN(this.state.balance, 16).lt(new BN(new BN(this.state.amount).add(new BN(1))))) {
      this.setState({ amount_error_message: `Insufficient funds ( Balance: ${this.state.balance})` , amount_error: true})
      return false
    }

    return true
  }

  render () {
    return (
      <div id="my-extension-root-inner" className="OverlayMain"  data-testid="send">
        <div className="OverlayMainInner">
          <div className='settings_title'>
            <div className='address_title_inner'>
              <h1 className="account_address">Account address</h1>
              <br></br>
              <span className="hoverable-address"
                    onClick={this.handleCopyToClipboard}>{format(this.state.address)}</span>
              <span
                className="tooltiptext tooltiptext-header-positioning">{this.state.copied ? 'Copied!' : 'Copy Address to clipboard'}</span>
            </div>
            <img className='cross' src={getAssetURI('burger_icon.svg')} onClick={goTo.bind(null, Settings)}/>
          </div>
          <hr></hr>
          <h3 className="send-title">Send</h3>
          <form onSubmit={this.handleTransfer} className="send-form">
            <div className="send_form_row">
              <label htmlFor="to_address">Account<br></br> Number: </label>
              <input className={`send_form_input ${this.state.address_error ? 'red_error' : ''}`} type="text"
                     name="to_address" id="to_address"
                     onChange={this.handleChange.bind(this)} value={this.state.to_address}></input>
            </div>
            <output type="text"
                    className={`red_error account-number-error`}>{this.state.address_error ? 'Invalid address' : ''}</output>
            <div className="send_form_row">
              <label htmlFor="amount">Amount: </label>
              <div
                className={`send_form_row_output_wrapper send_form_input ${this.state.amount_error ? 'red_error' : ''}`}>
                <div className="amount_stack_wrapper">
                  <input className={`amount_input  ${this.state.amount_error ? 'red_error' : ''}`} type="number" placeholder="0 FET" name="amount"
                         id="amount" onChange={(event) => { debugger; this.handleAmountChange(event, this.sufficientFunds.bind(null, true));}}
                         value={this.state.amount}></input>
                  <br></br>
                  <output className={this.state.amount_error ? 'red_error' : ''}>{typeof this.state.dollar !== 'undefined' && this.state.dollar !== null ? '$' + this.state.dollar + ' USD' : ''}</output>
                </div>
              </div>

            </div>
            <output type="text"
                    className={`red_error send-amount-error`}>{this.state.amount_error ? 'Insufficient funds' : ''}</output>
            <div className="send_form_row send_form_row_password">
              <label htmlFor="password">Password: </label>
              <input className={`send_form_input ${this.state.password_error ? 'red_error' : ''}`} type="password"
                     name="password"
                     onChange={this.handleChange.bind(this)} value={this.state.password}
                     id="password"></input>
            </div>
            <output type="text"
                    className='red_error password-error'>{this.state.password_error ? 'Incorrect password' : ''}</output>
            <output type="text"
                    className={`send-transfer-status ${this.state.transfer_error ? 'red_error' : ''}`}>{this.state.transfer_message}</output>
            <div className="small-button-container">
              <button className="small-button send_buttons" onClick={goTo.bind(null, Account)}>
                Cancel
              </button>
              <input className="small-button send_buttons disabled-pointer" disabled={this.state.transfer_disabled} type="submit" value="Send"></input>
            </div>
          </form>
        </div>
      </div>
    )
  }
}