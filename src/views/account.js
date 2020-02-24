/* global chrome */
import React, { Component } from 'react'
import { Bootstrap, LedgerApi } from 'fetchai-ledger-api'
import { BN } from 'bn.js'
import Expand from '../react-expand-animated-2/build/Expand'
// import Expand from 'react-expand-animated'
import {
  ACCOUNT_HISTORY_URI,
  BALANCE_CHECK_INTERVAL_MS, BOOTSTRAP_REQUEST_URI,
  DOLLAR_PRICE_CHECK_INTERVAL_MS,
  DOLLAR_PRICE_URI,
  EXTENSION,
  NETWORK_NAME,
  TRANSACTION_HISTORY_CHECK_INTERVAL_MS,
  TRANSITION_DURATION_MS,
} from '../constants'
import { goTo } from '../services/router'
import Download from './download'
import Send from './send'
import Settings from './settings'
import { Storage } from '../services/storage'
import { format } from '../utils/format'
import History from './history'
import { getAssetURI } from '../utils/getAsset'
import { fetchResource } from '../utils/fetchRescource'
import Authentication from '../services/authentication'
import { getElementById } from '../services/getElementById'

/**
 * This corresponds to the account page. The account page comprises this component and the History component.
 */

export default class Account extends Component {
  constructor (props) {
    super(props)
    this.balance = this.balance.bind(this)
    this.fetchHistory = this.fetchHistory.bind(this)
    this.toggleHover = this.toggleHover.bind(this)
    this.copyAddressToClipboard = this.copyAddressToClipboard.bind(this)
    this.toggleHistory = this.toggleHistory.bind(this)
    this.setHistoryCount = this.setHistoryCount.bind(this)
    this.scrollHistoryTop = this.scrollHistoryTop.bind(this)

    this.state = {
       show_self: false,
      balance: null,
      percentage: null,
      dollar_balance: null,
      address: Storage.getLocalStorage('address'),
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
  setHistoryCount(history_first_page_count) {
   this.setState({history_first_page_count: history_first_page_count })
  }

  // async bootstrap(){
  //   if(!this.bootstrap_error) clearInterval(this.balance_request_loop)
  //    const [host, port] = await Bootstrap.server_from_name(NETWORK_NAME).catch(()=>{
  //
  //      return;
  //   })
  //
  //
  // }

  async componentDidMount () {
  Authentication.Authenticate()
     this.setState({show_self: true})

       let address = await this.getBootstrapAddress()
  const [protocol, host_part, port] = Bootstrap.split_address(address);

    this.host = `${protocol}://${host_part}`;
    this.port = port
    this.balance()
    this.balance_request_loop = setInterval(this.balance, BALANCE_CHECK_INTERVAL_MS)
    this.fetchDollarPrice()
    this.fetchHistory()
    this.dollar_request_loop = setInterval(this.fetchDollarPrice, DOLLAR_PRICE_CHECK_INTERVAL_MS)
    this.history_request_loop = setInterval(this.fetchHistory.bind(null), TRANSACTION_HISTORY_CHECK_INTERVAL_MS)
  }


  async getBootstrapAddress(){
    const promise = new Promise((resolve, reject) => {
      fetchResource(BOOTSTRAP_REQUEST_URI).then((response) => {
        if (response.status !== 200) reject(null);
        response.json().then((data) => {
          resolve(data[0].address)
        }).catch(() => reject(null))
      })
    })
    return promise
  }

  componentWillUnmount () {
    clearInterval(this.balance_request_loop)
    clearInterval(this.dollar_request_loop)
    clearInterval(this.history_request_loop)
  }

  /**
   * Fetch first page of history which is shown on account page.
   *
   * @param page_number
   */
  fetchHistory (page_number) {
      // contentScript.js
      fetchResource(ACCOUNT_HISTORY_URI).then((response) => {
        this.processHistory(response)
      }).catch((error) => {

      })
  }

  /**
   * result of transaction history API call for account is processed here. We check if
   * the status code is 200, and the data exists, and save in state if true.
   *
   */
  processHistory (response) {
    if (response.status !== 200) {
      return
    }
    response.json().then((data) => {
      if (typeof data === 'undefined' || data.results.length === 0) {
        return
      }


      this.setState({ history: data.results.map(el => {
        el['clicked'] = false
        return el;
        }) })
    })
  }

  /**
   * Fetch the current dollar price of FET and save in state.
   *
   */
  fetchDollarPrice () {
      fetchResource(DOLLAR_PRICE_URI)
        .then((data) => {
          if (typeof data.percentage === 'number') {
            this.setState({ percentage: data.percentage }, this.calculateDollarBalance)
          }
        })
    }


  toggleHover(index) {
    const hover = `hover_${index}`
    const hover_2 = `hover_${2}`
    // const collapse = "hover_" + 1;
    this.setState((prevState) => ({ [hover]: !prevState[hover] }))
    // we also toggle visibility of the plus icon
    this.setState((prevState) => ({ [hover_2]: !prevState[hover_2] }))
  }

  calculateDollarBalance () {
    // if don't have a balance and a dollar price then we do'nt calculate the dollar balance,
    if (this.state.balance === 'null' || this.state.percentage === 'null') {
      return
    }

    const percentage = new BN(this.state.percentage)
    const balance = new BN(this.state.balance, 16)

    let dollar_balance

    // if either is zero then we set it to 0 manually as the BN.js library doesn't allow multiplication by zero
    if (percentage.isZero() || balance.isZero()) {
      dollar_balance = 0
    } else {
      dollar_balance = balance.mul(percentage)
    }
    this.setState({ dollar_balance: dollar_balance.toString(16) })
  }

  /**
   * toggle showing history infinite scrolling section
   */
  toggleHistory(){
    const t = this.state.show_history
    this.setState({show_history: !t})

    // after we finish transition to close infinite scrolling we also reset scroll to top of history.
    setTimeout(this.scrollHistoryTop,TRANSITION_DURATION_MS)
  }

  // scroll history item to the top when we show it or hide it.
  scrollHistoryTop(){
    getElementById('history-container').scrollTop = 0;
    // eslint-disable-next-line react/no-string-refs
     this.refs.history.hideAllLargeHistoryItems();
  }

  /**
   * Fetch the account balance for address stored in state. Upon result we also call method to recalculate the dollar display string.
   */

  async balance () {
    let protocol;
    let host = this.host

     if (this.host.includes('://')) {
            [protocol, host] = this.host.split('://')
        } else {
            protocol = 'http'
        }

     let request = {address: this.state.address}

     const body = {
    method: 'post',
    body: JSON.stringify(request)
  }

      const url =  `${protocol}://${host}:${this.port}/api/contract/fetch/token/balance`

     const response = await fetchResource(url, body).catch(() => {
         return;
      })

    const balance = await response.json();
    this.setState({ balance: new BN(balance.balance).toString(16) }, this.calculateDollarBalance)
  }

  copyAddressToClipboard () {
    navigator.clipboard.writeText(this.state.address).then(() => {
      console.log('Async: Copying to clipboard was successful!')
      // todo write response to this event.
    }, (err) => {
      console.error('Async: Could not copy text: ', err)
    })
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
            <img src={getAssetURI('account_icon.svg')} alt="Fetch.ai Account (ALT)" className="account"/>
            <div className="address_title_inner">
              <h1 className="account_address">Account address</h1>
              <br/>
              <span
                className="hoverable-address"
                onMouseOver={() => this.toggleHover(1)}
                onMouseOut={() => this.toggleHover(1)}
                onClick={this.copyAddressToClipboard}
              >
                {(this.state.hover_1) ? this.state.address : format(this.state.address)}
              </span>
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
                  </span> : ""
              }


              {this.state.balance !== null
                ? (
                  <span className="fet-balance">
                    {this.state.balance}
                    {' '}
                    FET
                  </span>
                ) : ''}
              {' '}
              <br/>
              {this.state.dollar_balance > 0 ? (
                <span>
                  {this.state.dollar_balance}
                  {' '}
                  USD
                </span>
              ) : ''}
            </div>
            <div className="small-button-container">
              <button className="small-button account-button" onClick={goTo.bind(null, Download)}>
                Download
              </button>
              <button className="small-button account-button" onClick={goTo.bind(null, Send)}>
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
                 <div id="history-container" className= {`${this.state.show_history ? 'history-container' : 'history-container-collapsed'}`}>
                {/*<div style={` height: '400px', ${this.state.show_history ? 'overflow: \'auto\' : 'overflow: \'auto\''}`}>*/}
                   {/* eslint-disable-next-line react/no-string-refs */}
                 <History ref= "history" setHistoryCount = {this.setHistoryCount}/>{' '}
                 </div>

              </Expand>
            )
            : ''}
            {(this.state.history_first_page_count  > 2)
                  ?
                    <button className="button-large-thin account-button toggle-history-button" onClick={this.toggleHistory}>
                      {(this.state.show_history) ? "Hide" : "View All"}
                    </button>
                  : ''}
        </div>
      </div>
        </Expand>
    )
  }
}
