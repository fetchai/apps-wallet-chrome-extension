import React, { Component } from 'react'
import qrCode from 'qrcode-generator'
import { COPIED_MESSAGE, COPY_ADDRESS_TO_CLIPBOARD_MESSAGE, KEY_FILE_NAME, STORAGE_ENUM } from '../constants'
import { goTo } from '../services/router'
import Account from './account'
import { format } from '../utils/format'
import { getAssetURI } from '../utils/getAsset'
import Authentication from '../services/authentication'
import { copyToClipboard } from '../utils/copyAddressToClipboard'
import { blockExplorerURL } from '../utils/blockExplorerURL'
import { historyURL } from '../utils/historyURL'
import { fetchResource } from '../utils/fetchRescource'

/**
 * component corresponds to download view.
 *
 */
export default class Download extends Component {
  constructor (props) {
    super(props)
    this.download = this.download.bind(this)
    this.make_QR = this.make_QR.bind(this)
    this.handleCopyToClipboard = this.handleCopyToClipboard.bind(this)
    this.displayBlockExplorerLink = this.displayBlockExplorerLink.bind(this)

    this.state = {
      display_block_explorer_link: false,
      block_explorer_url: blockExplorerURL(),
      address: localStorage.getItem(STORAGE_ENUM.ADDRESS),
      QR: '',
      hover_1: false,
      copied: false
    }
  }

  async handleCopyToClipboard () {
    const copied_status = await copyToClipboard(this.state.address)
    this.setState({ copied: copied_status })
  }

  componentDidMount () {
    Authentication.Authenticate()
    this.make_QR()
    this.displayBlockExplorerLink()
  }

  async displayBlockExplorerLink(){
    const url = historyURL(this.state.address, 1)
    fetchResource(url).then((response) => {
      if (response.status !== 200) return;

       response.json().then((result) => {
         if(result !== "Account does not exist"){
        this.setState({ display_block_explorer_link: true })
         }
       })

    })
  }

  componentWillUnmount () {
    this.setState({ QR: '' })
  }

  /**
   * Create a QR code image from a users address and
   * stores it as a DataURI (string) in state
   */
  make_QR () {
    let qr = qrCode(4, 'M')
    qr.addData(this.state.address)
    qr.make()
    this.setState({ QR: qr.createDataURL(2, 0) })
  }

  /**
   * Causes download of encrypted key file as json file, taking key file from storage.
   *
   * @returns {Promise<void>}
   */

  async download () {
    const json_str = localStorage.getItem(STORAGE_ENUM.KEY_FILE)
    const element = document.createElement('a')
    const file = new Blob([json_str], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = KEY_FILE_NAME
    document.body.appendChild(element)
    element.click()
  }

  render () {
    return (
      <div id="my-extension-root-inner" className="OverlayMain" data-testid="download">
        <div className="OverlayMainInner">
          <div className='settings_title'>
            <div className='address_title_inner'>
              <h1 className="account_address">Account address</h1>
              <br></br>
              <span className="hoverable-address"
                    onClick={this.handleCopyToClipboard}>{format(this.state.address)}</span>
              <span
                className="tooltiptext tooltiptext-header-positioning">{this.state.copied ? COPIED_MESSAGE : COPY_ADDRESS_TO_CLIPBOARD_MESSAGE}</span>
            </div>
            <img className='cross' src={getAssetURI('cross_icon.svg')} data-testid="cross" onClick={goTo.bind(null, Account)}/>
          </div>
          <hr></hr>
          <div className="qr_container">
            {this.state.QR ? <img src={this.state.QR} className='qr'/> : ''}
            <span className='qr_caption' onClick={this.handleCopyToClipboard}>{format(this.state.address)} </span>
            <span
              className="tooltiptext tooltiptext-positioning">{this.state.copied ? COPIED_MESSAGE : COPY_ADDRESS_TO_CLIPBOARD_MESSAGE}</span>
            {this.state.display_block_explorer_link?[
            <a key={2} className='download-button fetch-link'
               data-testid="block_explorer_url"
               target="_blank" rel="noopener noreferrer"
               href={`${this.state.block_explorer_url}${this.state.address}`}>
              View on Block Explorer
            </a>] : ""}
            <button className='download-button download-private-key-button' data-testid="download_button" onClick={this.download}>
              Export Private Key
            </button>
          </div>
        </div>
      </div>
    )
  }
}