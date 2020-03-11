/* global chrome */
import React, { Component } from 'react'
import { BN } from 'bn.js'
import Expand from '../other_imported_modules/react-expand-animated-2/build/Expand'
import {
  BALANCE_CHECK_INTERVAL_MS, CANONICAL_DIFFERENCE, COPIED_MESSAGE, COPY_ADDRESS_TO_CLIPBOARD_MESSAGE,
  DOLLAR_PRICE_CHECK_INTERVAL_MS,
  DOLLAR_PRICE_URI, NETWORK_NAME, STORAGE_ENUM,
  TRANSITION_DURATION_MS,
} from '../constants'
import { goTo } from '../services/router'
import Download from './download'
import Send from './send'
import Settings from './settings'
import { format } from '../utils/format'
import History from './history'
import { getAssetURI } from '../utils/getAsset'
import { fetchResource } from '../utils/fetchRescource'
import Authentication from '../services/authentication'
import { getElementById } from '../utils/getElementById'
import { copyToClipboard } from '../utils/copyAddressToClipboard'
import { API } from '../services/api'
import Storage from '../services/storage'
import { capitalise } from '../utils/capitalise'
import { toNonCanonicalFetDisplay } from '../utils/toNonCanonicalFetDisplay'

/**
 * This corresponds to the account page. The account page comprises this component and the History component.
 *
 * this acts as two pages since to get a smooth transition between show and hide of history infinite scroll we have the container small in this page and expand it
 *  . If this.state.show_history is truthy then we hide various parts of the page, show various others and expand the container with the history elements,
 *  and change the properties
 *  of the container so it is clickable, scrollable ext. This is the most scrappy/messy part of the app since the html stands for two seperate pages based on this value.
 */

export default class Account extends Component {
  constructor (props) {
    super(props)
    this.balance = this.balance.bind(this)
    this.toggleHistory = this.toggleHistory.bind(this)
    this.setHistoryCount = this.setHistoryCount.bind(this)
    this.scrollHistoryTop = this.scrollHistoryTop.bind(this)
    this.handleCopyToClipboard = this.handleCopyToClipboard.bind(this)
    this.fetchDollarPrice = this.fetchDollarPrice.bind(this)
    this.state = {
      network: Storage.getLocalStorage(STORAGE_ENUM.SELECTED_NETWORK),
      balance: null,
      percentage: Storage.getLocalStorage(STORAGE_ENUM.DOLLAR_PRICE),
      dollar_balance: null,
      address: Storage.getLocalStorage(STORAGE_ENUM.ADDRESS),
      show_history: false,
      hover_2: false,
      history_first_page_count: 1,
      bootstrap_error: false
    }
  }

  /**
   * We want to know how many results on first page to decide whether to display "show more button"
   * so we get this variable from passing this function to History component.
   * @param history_first_page_count
   */
  setHistoryCount (history_first_page_count, page_number) {

    if(page_number !== 1) return

     this.setState({ history_first_page_count: history_first_page_count })

  }

  async componentDidMount () {
    Authentication.Authenticate()

    if(NETWORK_NAME === 'localhost'){
        this.host = '127.0.0.1'
    this.port = 8000
    this.api = new API(this.host, this.port, 'http')
    } else {

     this.api = await API.fromBootstrap(this.state.network);
    }

     this.setState({network: Storage.getLocalStorage(STORAGE_ENUM.SELECTED_NETWORK) })
     // this.balance()
    this.balance_request_loop = setInterval(this.balance, BALANCE_CHECK_INTERVAL_MS)
     // this.fetchDollarPrice()
    this.dollar_request_loop = setInterval(this.fetchDollarPrice, DOLLAR_PRICE_CHECK_INTERVAL_MS)
  }

  async handleCopyToClipboard () {
    const copied_status = await copyToClipboard(this.state.address)
    this.setState({ copied: copied_status })
  }

  componentWillUnmount () {
    clearInterval(this.balance_request_loop)
    clearInterval(this.dollar_request_loop)
  }

  /**
   * Fetch the current dollar price of FET and save in state.
   *
   */
  async fetchDollarPrice () {
   const response = await fetchResource(DOLLAR_PRICE_URI)

    if (response.status !== 200) return

    let error = false;

   const data = await response.json().catch(() => error = true)

   if(error || !data.percentage) return;

   this.setState({ percentage: data.percentage }, this.calculateDollarBalance)

    Storage.setLocalStorage(STORAGE_ENUM.DOLLAR_PRICE, data.percentage)
  }

  calculateDollarBalance () {
    // if don't have a balance and a dollar price then we do'nt calculate the dollar balance,
    if (this.state.balance === null || this.state.percentage === null) {
      return
    }

    const balance = this.state.balance
    let dollar_balance

    if (this.state.percentage === 0 || balance.isZero()) {
      dollar_balance = 0
    } else {
      // we multiply and then divide by 100 since BN cannot process ohterwise.
      dollar_balance = balance.mul(new BN(this.state.percentage*1000)).div(new BN(CANONICAL_DIFFERENCE)).toNumber()/1000.
    }
    this.setState({ dollar_balance: dollar_balance })
  }

  /**
   * toggle showing history infinite scrolling section
   */
  toggleHistory () {
    this.setState({ show_history: !this.state.show_history })
    // after we finish transition to close infinite scrolling we also reset scroll to top of history.
    setTimeout(this.scrollHistoryTop, TRANSITION_DURATION_MS)
  }

  /**
   * scroll history item to the top when we show it or hide it.
   */
  scrollHistoryTop () {
    getElementById('history-container').scrollTop = 0
    // eslint-disable-next-line react/no-string-refs
    this.refs.history.hideAllLargeHistoryItems()
  }

  /**
   * Fetch the account balance for address
   * stored in state. Upon result we also call method to recalculate the dollar display string.
   */

  async balance () {

    if(this.api === false) return
    const balance = await this.api.balance(this.state.address)
    if(balance === false) return;
    this.setState({ balance: new BN(balance) }, this.calculateDollarBalance)
  }

  render () {

    const transitions = ['height', 'opacity', 'background']

    return (
        <div id="my-extension-root-inner" className="OverlayMain"  data-testid="account">

          <div className="OverlayMainInner">
             <img className="absolute-burger" src={getAssetURI('burger_icon.svg')}
                       onClick={goTo.bind(null, Settings)}/>
             <Expand
              open={!this.state.show_history}
              duration={TRANSITION_DURATION_MS}
              transitions={transitions}
            >
            <div className="settings_title">
              <div className="address_title_inner">
                <h1 className="account_address">Account address</h1>
                <br/>
                <span
                  className="hoverable-address"
                  onClick={this.handleCopyToClipboard}
                >
                {format(this.state.address)}
              </span>
                <span
                  className="tooltiptext tooltiptext-header-positioning">{this.state.copied ? COPIED_MESSAGE : COPY_ADDRESS_TO_CLIPBOARD_MESSAGE}</span>
              </div>

            </div>
            <hr/>

               <div className={'send-connected-to-network'}>
                Connected to {capitalise(this.state.network)}
              </div>
              <div className="balance_container">
                <img className="plus" alt="fetch circular logo"
                     src={getAssetURI('fetch_circular_icon.svg')}/>
                <br/>
                {this.state.bootstrap_error ?
                  <span className="bootstrap-error">
                   Failed to connect to network
                    {' '}
                    FET
                  </span> : ''
                }


                {BN.isBN(this.state.balance)
                  ? (
                    <span className="fet-balance">
                    {toNonCanonicalFetDisplay(this.state.balance)}
                      {'  FET'}
                  </span>
                  ) : ''}
                {' '}
                <br/>
                <span className='account-dollar-balance'>
                {(this.state.dollar_balance)  &&  this.state.dollar_balance !== 0 ?
                    [this.state.dollar_balance.toFixed(2).toLocaleString(),
                    ' USD']
                  : ''}</span>
              </div>
              <div className="small-button-container">
                {/*<button className="small-button account-button" onClick={goTo.bind(null, Download)}>*/}
                <button className="account-receive-button" onClick={goTo.bind(null, Download)}>
                  Receive
                </button>
                {/*<button className="small-button account-button" onClick={goTo.bind(null, Send, {api: this.api})}>*/}
                <button className="account-send-button" onClick={goTo.bind(null, Send, {api: this.api})}>
                  Send
                </button>
              </div>
            </Expand>
            {(this.state.history_first_page_count > 0)
              ? (
                <Expand
                  open={this.state.show_history}
                  duration={TRANSITION_DURATION_MS}
                  transitions={transitions}
                  partial={true}
                >
                    <h1 className={this.state.show_history ? 'history-header' : 'history-header-collapsed  account_address'}>History</h1>
                    <hr className="history-hr"/>
                  <div id="history-container"
                       className={`${this.state.show_history ? 'history-container' : 'history-container-collapsed'}`}>
                      {/* eslint-disable-next-line react/no-string-refs */}
                    <History ref="history" setHistoryCount={this.setHistoryCount} show_history = {this.state.show_history}/>{' '}
                  </div>
                </Expand>
              )
              : [<h1 key = {1} className="account_address history-header-collapsed">History</h1>,
                    <hr key = {2} className="history-hr"/>,
                <div key = {3} className="empty-history"><p>No Transactions</p></div>]}
            {(this.state.history_first_page_count > 2)
              ?
              <button className="account-toggle-history-button toggle-history-button" onClick={this.toggleHistory}>
                {(this.state.show_history) ? 'Hide' : 'View All'}
              </button>
              : ''}
          </div>
        </div>
    )
  }
}
