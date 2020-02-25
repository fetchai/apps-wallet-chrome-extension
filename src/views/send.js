import React, { Component } from 'react'
import {
  DEFAULT_FEE_LIMIT,
  DOLLAR_PRICE_CHECK_INTERVAL_MS,
  DOLLAR_PRICE_URI
} from '../constants'
import { Entity } from 'fetchai-ledger-api/src/fetchai/ledger/crypto/entity'
import { validAddress } from '../utils/validAddress'
import Authentication from '../services/authentication'
import { Storage } from '../services/storage'
import { format } from '../utils/format'
import { goTo } from '../services/router'
import Settings from './settings'
import Account from './account'
import { getAssetURI } from '../utils/getAsset'
import { fetchResource } from '../utils/fetchRescource'
import { copyToClipboard } from '../utils/copyAddressToClipboard'
import { API } from '../services/api'

/**
 * Corresponds to the send view.
 */
export default class Send extends Component {

  constructor (props) {
    super(props)
    this.address = Storage.getLocalStorage('address')
    this.sufficientFunds = this.sufficientFunds.bind(this)
    this.transfer = this.transfer.bind(this)
    this.handleTransfer = this.handleTransfer.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.fetchDollarPrice = this.fetchDollarPrice.bind(this)
    this.handleCopyToClipboard = this.handleCopyToClipboard.bind(this)
    this.reset_form_errors = this.reset_form_errors.bind(this)
    this.sync = this.sync.bind(this)
    this.setTransferMessage = this.setTransferMessage.bind(this)

    this.state = {
      password: '',
      to_address: '',
      percentage: null,
      amount: null,
      address: Storage.getLocalStorage('address'),
      copied: false,
      error: false,
      amount_error: false,
      password_error: false,
      address_error: false,
      amount_error_message: "",
      transfer_error: true,
      transfer_message: "",
      host: null,
      port: null
    }
  }

  async reset_form_errors(){
    return new Promise(resolve => {
      this.setState({amount_error: false,
      password_error: false,
      amount_error_message: "",
        transfer_error: true,
        transfer_message: "",
      address_error: false}, resolve)
    })
  }

  async componentDidMount () {
    Authentication.Authenticate()


     // this.api = await API.fromBootstrap();
        this.host = '127.0.0.1'
        this.port = 8000

       this.API = new API(this.host, this.port, 'http')
       this.fetchDollarPrice()
    this.balance_request_loop = setInterval(this.fetchDollarPrice, DOLLAR_PRICE_CHECK_INTERVAL_MS)

  }

  componentWillUnmount () {
    clearInterval(this.balance_request_loop)
  }



async handleCopyToClipboard(){
    const copied_status = await copyToClipboard(this.state.address)
    this.setState({copied: copied_status})
  }

  /**
   * Fetches current dollar price of FET.
   */
  fetchDollarPrice () {
      fetchResource(DOLLAR_PRICE_URI).then((response) => this.handleDollarResponse(response))
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
  handleDollarResponse (response) {
    if (response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' +
        response.status)
      return
    }

    response.json().then((data) => {
      console.log(data)

      // this indicates bad api call so rather then set to null we just leave pre-existing value in state.
      //todo check if this can ever occur, and remove if not.
      if (typeof data.percentage !== 'number') return

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
    const total = amount * percentage
    const dollar = Number.parseFloat(total)

    // if(dollar > 1000){
    //   return Number.parseInt(total)
    // }

    return Number.parseFloat(total).toFixed(2)
  }

  /**
   * When amount is changed (if we have a dollar price of FET from api) we update the dollar amount to show user.
   *
   * @param event
   */
  handleAmountChange (event) {
    if (this.state.percentage === null) return this.setState({ dollar: null, amount: event.target.value })

    //todo consider number overflow (53 byte) issue then delete this comment when addressed.
    if (event.target.value == 0) return this.setState({ dollar: 0 })

    this.setState({
      dollar: this.calculateDollarDisplayAmount(event.target.value, this.state.percentage),
      amount: event.target.value
    })
  }

  async handleChange (event) {
    let change = {}
    change[event.target.name] = event.target.value
    this.setState(change)
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
    let error = false

    if (!validAddress(this.state.to_address)) {
      this.setState({address_error: true})
      error = true
    } else if (!(await this.sufficientFunds())) {
       this.setState({amount_error: true})
      error = true
    }

    if (!(await Authentication.correctPassword(this.state.password))) {
      this.setState({password_error: true})
      error = true
    }

    if (error) return

    // now we send the transfer as no errors that cause us to not make transfer.
    const txs = await this.transfer()
    await this.sync(txs).catch(() =>  this.setState({transfer_error: true, transfer_message: "Transfer failed"}))
  }

  /*
*checks status of transaction by polling tx digest and sets the transfer state.status to display to user accordingly,
* so they can see when it is waiting, an then get quick response when it is done.
*
* Similar more genereic method in js SDK buts sets state as we poll.
 */

async sync(tx_digest) {
   const start = Date.now()
   const limit = 60 * 1000
   return new Promise((resolve, reject) => {
     const loop = setInterval(async () => {
       let status;
       try {
         status = await this.API.poll(tx_digest)
       } catch (e) {
         clearInterval(loop)
            await this.setTransferMessage(`API Error `, true)
         reject("API Error")
       }

        await this.setTransferMessage( `Transfer status: ${status} `)

       if (/Executed|Submitted/.test(status)) {
          clearInterval(loop)
            await this.setTransferMessage(`Success! Transaction status: ${status} `, true)
          resolve(status);
       }

       let elapsed_time = Date.now() - start

       if (elapsed_time > limit) {
          clearInterval(loop)
         await this.setTransferMessage( `Transaction timed out wth status: ${status} `, true)
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
 async setTransferMessage(transfer_message, transfer_error = false){
    return new Promise(resolve => {
      this.setState({transfer_message: transfer_message, transfer_error: transfer_error}, resolve)
    })
  }


  /**
   * Actual logic performing a transfer.
   *
   * @returns {Promise<void>}
   */
  async transfer () {
    const json_str = Storage.getLocalStorage('key_file')
    const entity = await Entity._from_json_object(JSON.parse(json_str), this.state.password)
    let error;
    const txs = await this.API.transfer(entity, this.state.to_address, this.state.amount).catch(() => error = true)
    if(error){
      this.setState({transfer_error: true, transfer_message: "Transfer failed"})
      return;
    }
   return txs
  }

  /**
   * Checks if we have sufficient funds to transfer transfer_amount + DEFAULT_FEE_LIMIT.
   *
   * @param event
   * @returns {Promise<boolean>}
   */
  async sufficientFunds () {

    if(this.API === false){
        this.setState({amount_error_message: "Network error"})
      return false
    }

    const balance =  await API.balance(this.address).catch(() => {
      this.setState({amount_error_message: "Network error"})
      return false
    })
    
    if(balance === false){
       this.setState({amount_error_message: "Network error"})
      return false
    }
    
debugger
    // is balance as much as desired transaction amount + fee limit.
    //todo : check if this should include fee limit or just be without since easer to understand for user without, and many transactions less than fee limit.
    //todo BN support and comparison.
    if (balance < (this.state.amount + DEFAULT_FEE_LIMIT)) {
      this.setState({amount_error_message: `Insufficient funds ( Balance: ${balance})`})
      return false
    }

    return true
  }

  render () {
    return (
      <div id="my-extension-root-inner" className="OverlayMain">
        <div className="OverlayMainInner">
          <div className='settings_title'>
            <img src={getAssetURI('account_icon.svg')} alt="Fetch.ai Account (ALT)" className='account'/>
            <div className='address_title_inner'>
              <h1 className="account_address">Account address</h1>
              <br></br>
              <span  className="hoverable-address"
                onClick={this.handleCopyToClipboard}>{format(this.state.address)}</span>
              <span className="tooltiptext tooltiptext-header-positioning" >{this.state.copied ? "Copied!" : "Copy Address to clipboard"  }</span>
            </div>
            <img className='cross' src={getAssetURI('burger_icon.svg')} onClick={goTo.bind(null, Settings)}/>
          </div>
          <hr></hr>
          <h3 className="send-title">Send</h3>
          <form onSubmit={this.handleTransfer} className="send-form" >
            <div className="send_form_row">
              <label htmlFor="to_address">Account<br></br> Number: </label>
              <input className={`send_form_input ${this.state.address_error ? 'red_error' : ''}`} type="text" name="to_address" id="to_address"
                     onChange={this.handleChange.bind(this)} value={this.state.to_address}></input>
            </div>
            <output type="text" className={`red_error account-number-error`}>{this.state.address_error ? "Invalid address" : ""}</output>
            <div className="send_form_row">
              <label htmlFor="amount">Amount: </label>
              <div className={`send_form_row_output_wrapper send_form_input ${this.state.amount_error ? 'red_error' : ''}`}>
                <div className="amount_stack_wrapper">
                  <input className="amount_input" type="number" placeholder="0 FET" name="amount"
                         id="amount" onChange={this.handleAmountChange.bind(this)}
                         value={this.state.amount}></input>
                  <br></br>
                  <output>{typeof this.state.dollar !== 'undefined' && this.state.dollar !== null ? '$' + this.state.dollar + ' USD' : ''}</output>
                </div>
              </div>

            </div>
            <output type="text" className={`red_error send-amount-error`}>{this.state.amount_error ? "Insufficient funds" : ""}</output>
            <div className="send_form_row send_form_row_password">
              <label htmlFor="password">Password: </label>
              <input className={`send_form_input ${this.state.password_error ? 'red_error' : ''}`} type="password" name="password"
                     onChange={this.handleChange.bind(this)} value={this.state.password}
                     id="password"></input>
            </div>
            <output type="text" className='red_error password-error'>{this.state.password_error ? "Incorrect password" : ""}</output>
            {/*<span id="send_error"></span>*/}
            <output type="text" className={`send-transfer-status ${this.state.transfer_error ? 'red_error' : ""}`}>{this.state.transfer_message}</output>
            <div className="small-button-container">
              <button className="small-button send_buttons" onClick={goTo.bind(null, Account)}>
                Cancel
              </button>
              <input className="small-button send_buttons" type="submit" value="Send"></input>
            </div>
          </form>
        </div>
      </div>
    )
  }
}