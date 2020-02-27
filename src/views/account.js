/* global chrome */
import React, { Component } from 'react'
import { BN } from 'bn.js'
import Expand from '../other_imported_modules/react-expand-animated-2/build/Expand'
import {
  BALANCE_CHECK_INTERVAL_MS,
  DOLLAR_PRICE_CHECK_INTERVAL_MS,
  DOLLAR_PRICE_URI, NETWORK_NAME,
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

/**
 * This corresponds to the account page. The account page comprises this component and the History component.
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
      show_self: false,
      balance: null,
      percentage: Storage.getLocalStorage("dollar_price"),
      dollar_balance: null,
       address: Storage.getLocalStorage('address'),
      //address: "2H7Csuaom7BUrC5YcUgJUExGPnApL8vQ5Wr9yGyzGWpRNqgWiJ",
      show_history: false,
      hover_1: false,
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
  setHistoryCount (history_first_page_count) {
    this.setState({ history_first_page_count: history_first_page_count })
  }

  async componentDidMount () {
    Authentication.Authenticate()
    this.setState({ show_self: true })

    if(NETWORK_NAME === 'localhost'){
        this.host = '127.0.0.1'
    this.port = 8000
    this.api = new API(this.host, this.port, 'http')
    } else {
      this.api = await API.fromBootstrap();
    }

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

debugger
   this.setState({ percentage: data.percentage*100 }, this.calculateDollarBalance)

    Storage.setLocalStorage("dollar_price", data.percentage)
  }

  calculateDollarBalance () {
    // if don't have a balance and a dollar price then we do'nt calculate the dollar balance,
    if (this.state.balance === null || this.state.percentage === null) {
      return
    }

    // do it at ten times percentage and then convert back since BN only deals with integers to reduce rounding imprecision.
    const percentage_times_ten = new BN(this.state.percentage*10)
    const balance = this.state.balance

    let dollar_balance

    // if either is zero then we set it to 0 manually as the BN.js library doesn't allow multiplication by zero
    if (percentage_times_ten.isZero() || balance.isZero()) {
      dollar_balance = new BN(0)
    } else {
      dollar_balance = balance.mul(percentage_times_ten).div(new BN(1000))
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
    const balance = await this.api.balance(this.state.address)
    this.setState({ balance: new BN(balance) }, this.calculateDollarBalance)
  }

  render () {
    const styles = {
      open: { background: ' #1c2846' },
    }

    const transitions = ['height', 'opacity', 'background']

    return (
      <Expand
        open={this.state.show_self}
        duration={TRANSITION_DURATION_MS}
        styles={styles}
        transitions={transitions}
      >
        <div id="my-extension-root-inner" className="OverlayMain">
          <div className="OverlayMainInner">
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
                  className="tooltiptext tooltiptext-header-positioning">{this.state.copied ? 'Copied!' : 'Copy Address to clipboard'}</span>
              </div>
              {(this.state.hover_1) ? ''
                : <img className="cross" src={getAssetURI('burger_icon.svg')}
                       onClick={goTo.bind(null, Settings)}/>}
            </div>
            <hr/>
            <Expand
              open={!this.state.show_history}
              duration={TRANSITION_DURATION_MS}
              styles={styles}
              transitions={transitions}
            >
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
                    {this.state.balance.toNumber().toLocaleString()}
                      {' '}

                      {this.state.balance.toNumber().toLocaleString().length < 14 ? "FET" : ""}
                  </span>
                  ) : ''}
                {' '}
                <br/>
                {BN.isBN(this.state.dollar_balance)  &&  !this.state.dollar_balance.isZero()? (
                  <span>
                  {this.state.dollar_balance.toNumber().toLocaleString()}
                    {' '}
                    USD
                </span>
                ) : ''}
              </div>
              <div className="small-button-container">
                <button className="small-button account-button" onClick={goTo.bind(null, Download)}>
                  Download
                </button>
                <button className="small-button account-button" onClick={goTo.bind(null, Send, {api: this.api})}>
                  Send
                </button>
              </div>
            </Expand>
            {(this.state.history_first_page_count > 0)
              ? (
                <Expand
                  open={this.state.show_history}
                  duration={TRANSITION_DURATION_MS}
                  styles={styles}
                  transitions={transitions}
                  partial={true}
                >
                  <Expand
                    open={!this.state.show_history}
                    duration={TRANSITION_DURATION_MS}
                    styles={styles}
                    transitions={transitions}

                  >
                    <h1 className="account_address history-header">History</h1>
                    <hr className="history-hr"/>
                  </Expand>
                  {/*{`history_item large_history_item history-pointer ${this.state.clicked ? '' : 'hide'}`}*/}
                  <div id="history-container"
                       className={`${this.state.show_history ? 'history-container' : 'history-container-collapsed'}`}>
                    {/*<div style={` height: '400px', ${this.state.show_history ? 'overflow: \'auto\' : 'overflow: \'auto\''}`}>*/}
                    {/* eslint-disable-next-line react/no-string-refs */}
                    <History ref="history" setHistoryCount={this.setHistoryCount}/>{' '}
                  </div>

                </Expand>
              )
              : '<p> No History to show </p>'}
            {(this.state.history_first_page_count > 2)
              ?
              <button className="button-large-thin account-button toggle-history-button" onClick={this.toggleHistory}>
                {(this.state.show_history) ? 'Hide' : 'View All'}
              </button>
              : ''}
          </div>
        </div>
      </Expand>
    )
  }
}
