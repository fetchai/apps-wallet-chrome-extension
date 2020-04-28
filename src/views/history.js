import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { EXTENSION, STORAGE_ENUM } from '../constants'
import { getAssetURI } from '../utils/getAsset'
import { fetchResource } from '../utils/fetchRescource'
import RegularHistoryItem from '../dumb_components/regularHistoryItem'
import ExpandedHistoryItem from '../dumb_components/expandedHistoryItem'
import { blockExplorerURL } from '../utils/blockExplorerURL'
import { historyURL } from '../utils/historyURL'
import { BN } from 'bn.js'
import Storage from '../services/storage'


/**
 * Whilst all other components in views map directly to a page in the original eight wire-frames this component does not. This component is the infinite scroll which
 * is displayed from the accounts page when "view all" button is clicked by expanding a div.
 */

export default class History extends Component {

  constructor (props) {
    super(props)
    this.toggleClicked = this.toggleClicked.bind(this)
    this.hideAllLargeHistoryItems = this.hideAllLargeHistoryItems.bind(this)
    this.fetchAnotherPageOfHistory = this.fetchAnotherPageOfHistory.bind(this)
    this.filterResults = this.filterResults.bind(this)
    this.merge_without_duplicates = this.merge_without_duplicates.bind(this)
    this.fetchFirstPage = this.fetchFirstPage.bind(this)
    this.getAddressSingleton = this.getAddressSingleton.bind(this)

    // eslint-disable-next-line react/prop-types
    this.setHistoryCount = props.setHistoryCount

    this.state = {
      // eslint-disable-next-line react/prop-types
      show_history: props.show_history,
      blockexplorer_url: "",
      items: 20,
      address: "",
      // an array containing page numbers of all fetched pages of transaction history
      loaded_page_numbers: [0],
      has_more_items: true,
      results: []
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    // eslint-disable-next-line react/prop-types
    if (nextProps.show_history !== this.props.show_history) {
      // eslint-disable-next-line react/prop-types
      this.setState({ show_history: nextProps.show_history })
    }
  }

  async componentDidMount () {
      const blockexplorer_url = await blockExplorerURL('transactions/');
    if (typeof window.fetchai_history !== 'undefined') {
      this.setState({ results: window.fetchai_history, blockexplorer_url: blockexplorer_url })
      this.setHistoryCount(window.fetchai_history.length)
    } else {
      this.setState({ blockexplorer_url: blockexplorer_url })
    }

    // poll the first page continually checking for new transactions.
    this.first_page_history_loop = setInterval(this.fetchFirstPage, 3000)
  }


    componentWillUnmount () {
    clearInterval(this.first_page_history_loop)
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

    // don't toggle between history items when closed
    if (!this.state.show_history) return

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
    // if (results[index].clicked) this.scrollCorrection(event, already_open_above)
    this.setState({ results: results })
  }

  /**
   *
   * @returns {address | Promise<address>}
   */
  async getAddressSingleton(){
    if(this.state.address !== "") return this.state.address
    let address = await Storage.getItem(STORAGE_ENUM.ADDRESS);
      this.setState({address: address})
      return address
  }

  /**
   * use this method to to get first page of history.
   * This is polled for so we can filter in new results.
   *
   * @returns {Promise<void>}
   */
  async fetchFirstPage () {
    const address = await this.getAddressSingleton()
    const url = await historyURL(address, 1)
    fetchResource(url).then((response) => { this.handlePageFetchResponse(response)})
  }

  /**
   * This fetches a page of history and adds relavent properties to results array of state.
   * If we recieve invalid page (result.detail "Invalid page") then we return early and set has_more_items to false to
   * quit loading more. If response is not 200 we just return unless flag is passed, in which case we loop until we get a http 200 we can parse.
   *
   * @returns {Promise<void>}
   */
  async fetchAnotherPageOfHistory () {
    const address = await this.getAddressSingleton()
    const url = await historyURL(address, Math.max(...this.state.loaded_page_numbers) + 1)
    fetchResource(url).then((response) => { this.handlePageFetchResponse(response)})
  }

  /**
   * Processes the response to the fetching of another page. Saves results in state.
   *
   * @param response
   * @param retry
   */
  handlePageFetchResponse (response, retry) {

    const loaded_page_number = (EXTENSION) ?
      parseInt(response.statusText.split('?page=')[1]) :
      parseInt(response.url.split('?page=')[1])

    // whilst api is buggy assuming 404 and 500 means no results
    if (response.status == 500 || response.status == 404) {
      this.setHistoryCount(0, loaded_page_number)
      this.setState({ has_more_items: false })
      return
    }

    response.json().then((result) => {

      if(result === "Account does not exist") {
         this.setHistoryCount(0, loaded_page_number)
         this.setState({ has_more_items: false })
         return
      }

      const next = this.filterResults(result)
      // lets cache first page on window for quicker remounts of component.
      if (loaded_page_number === 1) {
        //todo maybe swap to iframe window from global window
        window.fetchai_history = next
        this.setHistoryCount(next.length, loaded_page_number)
      }

      let updated_results = this.merge_without_duplicates(this.state.results, next)

      const loaded_page_numbers = this.state.loaded_page_numbers

      if (!loaded_page_numbers.includes(loaded_page_number)) loaded_page_numbers.push(loaded_page_number)

      this.setState({ results: updated_results, loaded_page_numbers: loaded_page_numbers })
    })
  }

  /**
   * merge but do not put in ones with hashes already in the list.
   *
   * @param results1
   * @param results2
   */
  merge_without_duplicates (results1, results2) {
    const res = results1

    results2.forEach((el) => {
      if (!results1.some(el2 => el2.id === el.id)) res.push(el)
    })

    return res
  }

  /**
   * we select the relevant results only.
   *
   * @param result
   * @returns {*}
   */
  filterResults (result) {
    return result.results.map(el => {
      let amount = new BN(el.amount)

      // we decide here if amount is positive or negative
      if (el.from_address === this.getAddressSingleton()) amount = amount.neg()
      const status = (amount === 0) ? 'unknown' : 'Executed';

      return {
        id: el.id,
        status: status,
        digest: el.tx,
        from_address: el.from_address,
        to_address: el.to_address,
        amount: amount,
        fee: el.fee,
        created_date: el.created_date,
        clicked: false
      }
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
                                     amount={this.state.results[i].amount}
                                     block_explorer_url={this.state.blockexplorer_url}
                                     created_date={this.state.results[i].created_date}
                                     toggle_clicked={this.toggleClicked}
                                     index={i}/>)

      items.push(<ExpandedHistoryItem clicked={this.state.results[i].clicked}
                                      digest={this.state.results[i].digest}
                                      status={this.state.results[i].status}
                                      from_address={this.state.results[i].from_address}
                                      address={this.getAddressSingleton()}
                                      to_address={this.state.results[i].to_address}
                                      amount={this.state.results[i].amount}
                                      block_explorer_url={this.state.blockexplorer_url}
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
        loader={<img key="loading_icon" src={getAssetURI('loading_Icon.gif')} alt="Fetch.ai Loading Icon"
                     className={this.state.results.length > 0 ? 'loader' : 'mini-loader'}/>}
        useWindow={false}
      >
        {this.showItems()}{' '}
      </InfiniteScroll>
    )
  }

}