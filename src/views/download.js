import React, { Component } from 'react'
import qrCode from 'qrcode-generator'
import {
  ADDRESS,
  COPIED_MESSAGE,
  COPY_ADDRESS_TO_CLIPBOARD_MESSAGE,
  KEY_FILE,
  KEY_FILE_NAME, LOCALHOST, MAINNET, MAINNET_BLOCKEXPLORER, SELECTED_NETWORK, TESTNET, TESTNET_BLOCKEXPLORER,
  TRANSITION_DURATION_MS
} from '../constants'
import { goTo } from '../services/router'
import Account from './account'
import { Storage } from '../services/storage'
import { format } from '../utils/format'
import { getAssetURI } from '../utils/getAsset'
import Authentication from '../services/authentication'
import { copyToClipboard } from '../utils/copyAddressToClipboard'

/**
 * component corresponds to download view.
 *
 */
export default class Download extends Component {
  constructor (props) {
    super(props)
    this.download = this.download.bind(this)
    this.closeSelf = this.closeSelf.bind(this)
    this.make_QR = this.make_QR.bind(this)
    this.handleCopyToClipboard = this.handleCopyToClipboard.bind(this)
    this.blockExplorerURL = this.blockExplorerURL.bind(this)

    this.state = {
      block_explorer_url: this.blockExplorerURL(),
      address: Storage.getLocalStorage(ADDRESS),
      QR: '',
      hover_1: false,
      copied: false
    }
  }

  /**
   * return block explorer url (with accounts path) based on whichever network is users selected network.
   *
   * @returns {string}
   */
  blockExplorerURL(){
        const network = Storage.getLocalStorage(SELECTED_NETWORK);
        if(network === TESTNET)  return TESTNET_BLOCKEXPLORER;
        else if(network === MAINNET) return MAINNET_BLOCKEXPLORER;
        else if(network === LOCALHOST) return '';
        else throw new Error(`the network from storage : ${network} is not an expected network`)
  }


  async handleCopyToClipboard () {
    const copied_status = await copyToClipboard(this.state.address)
    this.setState({ copied: copied_status })
  }

  componentDidMount () {
    Authentication.Authenticate()
    this.make_QR()
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
    const json_str = Storage.getLocalStorage(KEY_FILE)
    const element = document.createElement('a')
    const file = new Blob([json_str], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = KEY_FILE_NAME
    document.body.appendChild(element)
    element.click()
  }

  closeSelf () {
    this.setState({ show_self: false })
    setTimeout(goTo.bind(null, Account), 500)
  }

  render () {
    return (
        <div id="my-extension-root-inner" className="OverlayMain"  data-testid="download">
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
              <img className='cross' src={getAssetURI('cross_icon.svg')} onClick={this.closeSelf}/>
            </div>
            <hr></hr>
            <div className="qr_container">
              {this.state.QR ? <img src={this.state.QR} className='qr'/> : ''}
              <span className='qr_caption' onClick={this.handleCopyToClipboard}>{format(this.state.address)} </span>
              <span
                className="tooltiptext tooltiptext-positioning">{this.state.copied ? COPIED_MESSAGE : COPY_ADDRESS_TO_CLIPBOARD_MESSAGE}</span>
              <a className='large-button fetch_link account-button'  target="_blank" rel="noopener noreferrer" href={`${this.state.block_explorer_url}${this.state.address}`}>
                View on Fetch.ai
              </a>
              <button className='large-button account-button download-button' onClick={this.download}>
                Export Private Key
              </button>
            </div>
          </div>
        </div>
    )
  }
}