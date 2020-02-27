import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { ACCOUNT_HISTORY_URI, EXTENSION } from '../constants'
import { Storage } from '../services/storage'
import { getAssetURI } from '../utils/getAsset'
import { fetchResource } from '../utils/fetchRescource'
import RegularHistoryItem from '../dumb_components/regularHistoryItem'
import ExpandedHistoryItem from '../dumb_components/expandedHistoryItem'
import { getElementById } from '../utils/getElementById'
import { Address, Entity } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto'

/**
 * Whilst all other components in views map directly to a page in the original eight wire-frames this component does not. This component is the infinite scroll which
 * is displayed from the accounts page when "view all" button is clicked by expanding a div.
 */

export default class History extends Component {

  constructor (props) {
    super(props)
    this.toggleClicked = this.toggleClicked.bind(this)
    this.hideAllLargeHistoryItems = this.hideAllLargeHistoryItems.bind(this)

    // eslint-disable-next-line react/prop-types
    this.setHistoryCount = props.setHistoryCount

    this.state = {
      address: Storage.getLocalStorage('address'),
      items: 20,
      current_page: 1,
      has_more_items: true,
      results: []
    }
  }

  async componentDidMount () {

    if (typeof window.fetchai_history !== 'undefined') {
      debugger
      this.setState({ results: window.fetchai_history })
      this.setHistoryCount(window.fetchai_history.length)
    }
    // so we save and reload the first page, for quicker UI, but when we get data from request we show that instead.

    await this.fetchAnotherPageOfHistory(true)
  }

  unclick (element) {
    element.clicked = false
    return element
  }

  hideAllLargeHistoryItems () {
    this.setState({ results: this.state.results.map(this.unclick) })
  }

  /**
   * This is specific to our list of history items and at the index of the clicked history item it changes the clicked property,
   * of the history item at the given index in the state. This is used to show large history when clicked, and small item when not clicked.
   *
   * @param index
   */
  toggleClicked (event, index) {

    let results = this.state.results
    const clicked_status = results[index].clicked

    let already_open_above = false

    for (let i = 0; i < results.length; i++) {
      if (i >= index) break
      //todo maybe pull other loops into this one from below to increase speed.
      if (results[i].clicked) already_open_above = true
    }
    // remove clicked status from all history items (thereby showing small history item for all other items on every click so
    // only one larger history item is shown at any time for nicer UI)
    results = results.map(this.unclick)
    // toggle clicked history items clicked status.
    results[index].clicked = !clicked_status
    if (results[index].clicked) this.scrollCorrection(event, already_open_above)
    this.setState({ results: results })
  }

  /*
  * When we wish to click to view large history history item, if small history
  * item is at bottom of UI then large history item will only be partially displayed in view without this.
  * This method checks the position of the small item and if it is too low then it scrolls to put big history
  * item in correct position (otherwise would partially be obscured by overflowing bottom of div).
  *
  * @param already_open_above boolean - if we have one history item already open above our clicked then we must adjust shifting
  *                                     by scroll height since  we must factor in that it will close and adjust height further.
   */
  scrollCorrection (event, already_open_above) {
    const element = event.target
    const DESIRED_TOP = 342
    const bounding_client_rect = element.getBoundingClientRect()
// 171
    const DIFFERENCE_IN_HEIGHT_BETWEEN_SMALL_AND_LARGE_HISTORY_ITEM = 120
    // we have  a different calculation if one above it is already open.
    if (already_open_above && (bounding_client_rect.top > (DESIRED_TOP + DIFFERENCE_IN_HEIGHT_BETWEEN_SMALL_AND_LARGE_HISTORY_ITEM))) {
      const correction = bounding_client_rect.top - (DESIRED_TOP + DIFFERENCE_IN_HEIGHT_BETWEEN_SMALL_AND_LARGE_HISTORY_ITEM)
      const scroll_top = getElementById('history-container').scrollTop
      getElementById('history-container').scrollTop = scroll_top + correction
    } else if (bounding_client_rect.top > DESIRED_TOP) {
      const correction = bounding_client_rect.top - DESIRED_TOP
      const scroll_top = getElementById('history-container').scrollTop
      getElementById('history-container').scrollTop = scroll_top + correction
    }
  }

  /**
   * This fetches a page of history and adds relavent properties to results array of state.
   * If we recieve invalid page (result.detail "Invalid page") then we return early and set has_more_items to false to
   * quit loading more. If response is not 200 we just return unless flag is passed, in which case we loop until we get a http 200 we can parse.
   *
   * @returns {Promise<void>}
   */
  async fetchAnotherPageOfHistory (retry = false) {
   const address =  new Address(new Entity()).toString()
    console.log("address is : " + address)
    const url = ACCOUNT_HISTORY_URI + address + '&page=' + this.state.current_page;
    fetchResource(url).then((response) => this.handlePageFetchResponse(response, retry))
  }

  /**
   * Processes the response to the fetching of another page. Saves results in state.
   *
   * @param response
   * @param retry
   */
  handlePageFetchResponse (response, retry) {
    debugger;
    if (response.status !== 200) {
      if (retry === true) {
        // recursive set_timeout loop if we want to keep retrying. This is used on initialization to try get some data if network dodgy.
        // todo refactor since since not unmountable, probably a quasi leak
        setTimeout(this.fetchAnotherPageOfHistory.bind(null, retry), 1000)
      }
      return
    }

    response.json().then((result) => {
      // check for having gotten past last page page and terminate here if true
      if (typeof result.detail !== 'undefined' && result.detail === 'Invalid page.') {
        this.setState({ has_more_items: false })
        return
      }
      // reduce memory by only storing needed properties from api result
      const next = result.results.map(el => {
        return {
          status: el.status,
          digest: el.digest,
          fee: el.fee,
          created_date: el.created_date,
          clicked: false
        }
      })
      let updated_results
      // lets cache first page on window for quicker remounts of component.
      if (this.state.current_page === 1) {
        //todo maybe swap to iframe window from global window
        window.fetchai_history = next
        updated_results = next
        this.setHistoryCount(next.length)
      } else {
        updated_results = this.state.results.concat(next)
      }

      const next_page = this.state.current_page + 1

      this.setState({ results: updated_results, current_page: next_page })
    })
  }

  /**
   * Iterate over items and return list of history items to show in our infinitely scrolling div.
   *
   * @returns {[]}
   */
  showItems () {
    const items = []
    for (let i = 0; i < this.state.results.length; i++) {
      //Both large and regular history items are appended to list, but when we click on them we toggle between displaying regular and large.
      // note: This is because setting inner html is injection vunerability.

      items.push(<RegularHistoryItem clicked={this.state.results[i].clicked}
                                     digest={this.state.results[i].digest}
                                     status={this.state.results[i].status}
                                     created_date={this.state.results[i].created_date}
                                     toggle_clicked={this.toggleClicked}
                                     index={i}/>)

      items.push(<ExpandedHistoryItem clicked={this.state.results[i].clicked}
                                      digest={this.state.results[i].digest}
                                      status={this.state.results[i].status}
                                      fee={this.state.results[i].fee}
                                      created_date={this.state.results[i].created_date}
                                      toggle_clicked={this.toggleClicked}
                                      index={i}/>)
    }
    return items
  }

  render () {
    return (
      <InfiniteScroll
        loadMore={this.fetchAnotherPageOfHistory.bind(this)}
        hasMore={this.state.has_more_items}
        loader={<img src={getAssetURI('loading_Icon.gif')} alt="Fetch.ai Loading Icon" className='loader'/>}
        useWindow={false}
      >
        {this.showItems()}{' '}
      </InfiniteScroll>
    )
  }

}