import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { ACCOUNT_HISTORY_URI, EXTENSION } from '../constants'
import { Storage } from '../services/storage'
import { getAssetURI } from '../utils/getAsset'
import { fetchResource } from '../utils/fetchRescource'
import RegularHistoryItem from '../dumb_components/regularHistoryItem'
import ExpandedHistoryItem from '../dumb_components/expandedHistoryItem'

/**
 * Whilst all other components in views map directly to a page in the original eight wire-frames this component does not. This component is the infinite scroll which
 * is displayed from the accounts page when "view all" button is clicked by expanding a div.
 */

export default class History extends Component {

  constructor (props) {
    super(props)
    this.toggleClicked = this.toggleClicked.bind(this)

    this.state = {
      address: Storage.getLocalStorage('address'),
      items: 20,
      current_page: 1,
      has_more_items: true,
      results: []
    }
  }

  async componentDidMount () {
     // Authentication.Authenticate()
    // start with one page of history.
    await this.fetchAnotherPageOfHistory(true)
  }

  /**
   * This is specific to our list of history items and at the index of the clicked history item it changes the clicked property,
   * of the history item at the given index in the state. This is used to show large history when clicked, and small item when not clicked.
   *
   * @param index
   */
  toggleClicked (index) {
    const results = this.state.results
    results[index].clicked = !this.state.results[index].clicked
    this.setState({ results: results })
  }

  /**
   * This fetches a page of history and adds relavent properties to results array of state.
   * If we recieve invalid page (result.detail "Invalid page") then we return early and set has_more_items to false to
   * quit loading more. If response is not 200 we just return unless flag is passed, in which case we loop until we get a http 200 we can parse.
   *
   * @returns {Promise<void>}
   */
  async fetchAnotherPageOfHistory (retry = false) {

    if (EXTENSION) {
      fetchResource(ACCOUNT_HISTORY_URI + '&page=' + this.state.current_page).then((response) => this.handlePageFetchResponse(response, retry))
    } else {
      fetch(ACCOUNT_HISTORY_URI + '&page=' + this.state.current_page).then((response) => this.handlePageFetchResponse(response, retry))
    }

  }

  /**
   * Processes the response to the fetching of another page. Saves results in state.
   *
   * @param response
   * @param retry
   */
  handlePageFetchResponse (response, retry) {
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
      const next_page = this.state.current_page + 1
      const updated_results = this.state.results.concat(next)
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


      items.push(<RegularHistoryItem clicked = {this.state.results[i].clicked}
        digest =  {this.state.results[i].digest}
        status =  {this.state.results[i].status}
        created_date =  {this.state.results[i].created_date}
         toggle_clicked = {this.toggleClicked}
        index = {i}/>)

       items.push(<ExpandedHistoryItem clicked = {this.state.results[i].clicked}
        digest =  {this.state.results[i].digest}
        status =  {this.state.results[i].status}
        fee =  {this.state.results[i].fee}
        created_date =  {this.state.results[i].created_date}
         toggle_clicked = {this.toggleClicked}
        index = {i}/>)
    }
    return items
  }

  render () {
    return (
      <div style={{ height: '400px', overflow: 'auto' }}>
        <InfiniteScroll
          loadMore={this.fetchAnotherPageOfHistory.bind(this)}
          hasMore={this.state.has_more_items}
          loader={<img src={getAssetURI('loading_Icon.gif')} alt="Fetch.ai Loading Icon" className='loader'/>}
          useWindow={false}
        >
          {this.showItems()}{' '}
        </InfiniteScroll>{' '}
      </div>
    )
  }

}