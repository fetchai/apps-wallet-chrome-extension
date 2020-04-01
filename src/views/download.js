import React, { Component } from 'react'
import qrCode from 'qrcode-generator'
import { COPIED_MESSAGE, COPY_ADDRESS_TO_CLIPBOARD_MESSAGE, STORAGE_ENUM } from '../constants'
import { goTo } from '../services/router'
import Account from './account'
import { format } from '../utils/format'
import { getAssetURI } from '../utils/getAsset'
import Authentication from '../services/authentication'
import Storage from '../services/storage'
import { copyToClipboard } from '../utils/copyAddressToClipboard'
import { blockExplorerURL } from '../utils/blockExplorerURL'
import { historyURL } from '../utils/historyURL'
import { fetchResource } from '../utils/fetchRescource'
import { download } from '../utils/download'

/**
 * component corresponds to download view.
 *
 */
export default class Download extends Component {
  constructor (props) {
    super(props)

    this.make_QR = this.make_QR.bind(this)
    this.handleCopyToClipboard = this.handleCopyToClipboard.bind(this)
    this.displayBlockExplorerLink = this.displayBlockExplorerLink.bind(this)
    this.getAddressSingleton = this.getAddressSingleton.bind(this)

    this.state = {
      address: "",
      display_block_explorer_link: false,
      block_explorer_url: "",
      QR: '',
      hover_1: false,
      copied: false
    }
  }

    /**
   *
   *
   * @returns {string | Promise<string>}
   */
  async getAddressSingleton() {
    if(this.state.address !== "") return this.state.address
      let address = await Storage.getItem(STORAGE_ENUM.ADDRESS);
      this.setState({address: address})
      return address
  }


  async handleCopyToClipboard () {
    const copied_status = await copyToClipboard(this.state.address)
    this.setState({ copied: copied_status })
  }

  async componentDidMount () {
    await Authentication.Authenticate()
    await this.make_QR()
    this.displayBlockExplorerLink()
    this.getAddressSingleton()
  }

  async displayBlockExplorerLink(){

   const block_explorer_url = await blockExplorerURL();

    const address = await this.getAddressSingleton()
    const url = await historyURL(address, 1)
    fetchResource(url).then((response) => {
      if (response.status !== 200) return;

       response.json().then((result) => {
         if(result !== "Account does not exist"){
        this.setState({ display_block_explorer_link: true, block_explorer_url: block_explorer_url })
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
  async make_QR () {
      const address = await this.getAddressSingleton()
    let qr = qrCode(4, 'M')
    qr.addData(address)
    qr.make()
    this.setState({ QR: qr.createDataURL(2, 0) })
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
            <button className='download-button download-private-key-button' data-testid="download_button" onClick={download}>
              Export Private Key
            </button>
          </div>
        </div>
      </div>
    )
  }
}