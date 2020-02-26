import React, { Component } from 'react'
import qrCode from 'qrcode-generator'
import { KEY_FILE_NAME, TRANSITION_DURATION_MS } from '../constants'
import { goTo } from '../services/router'
import Account from './account'
import { Storage } from '../services/storage'
import { format } from '../utils/format'
import { getAssetURI } from '../utils/getAsset'
import Authentication from '../services/authentication'
import Expand from 'react-expand-animated'
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

    this.state = {
      show_self: false,
      address: Storage.getLocalStorage('address'),
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

    this.setState({ show_self: true })
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

  toggleHover (index) {
    return
    const hover = 'hover_' + index
    this.setState(prevState => ({ [hover]: !prevState[hover] }))
  }

  /**
   * Causes download of encrypted key file as json file, taking key file from storage.
   *
   * @returns {Promise<void>}
   */

  async download () {
    const json_str = Storage.getLocalStorage('key_file')
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
    const styles = {
      open: { background: ' #1c2846' },
    }

    const transitions = ['height', 'opacity']

    return (
      <Expand
        open={this.state.show_self}
        duration={TRANSITION_DURATION_MS}
        styles={styles}
        transitions={transitions}
      >
        <div id="my-extension-root-inner" className="OverlayMain">
          <div className="OverlayMainInner">
            <div className='settings_title'>
              <img src={getAssetURI('account_icon.svg')} alt="Fetch.ai Account (ALT)" className='account'/>
              <div className='address_title_inner'>
                <h1 className="account_address">Account address</h1>
                <br></br>
                <span className="hoverable-address"
                      onClick={this.handleCopyToClipboard}>{format(this.state.address)}</span>
                <span
                  className="tooltiptext tooltiptext-header-positioning">{this.state.copied ? 'Copied!' : 'Copy Address to clipboard'}</span>
              </div>
              <img className='cross' src={getAssetURI('cross_icon.svg')} onClick={this.closeSelf}/>
            </div>
            <hr></hr>
            <div className="qr_container">
              {this.state.QR ? <img src={this.state.QR} className='qr'/> : ''}
              <span className='qr_caption' onClick={this.handleCopyToClipboard}>{format(this.state.address)} </span>
              <span
                className="tooltiptext tooltiptext-positioning">{this.state.copied ? 'Copied!' : 'Copy text to clipboard'}</span>
              <a className='large-button fetch_link account-button' href={'www.fetch.ai'}>
                View on Fetch.ai
              </a>
              <button className='large-button account-button download-button' onClick={this.download}>
                Export Private Key
              </button>
            </div>
          </div>
        </div>
      </Expand>
    )
  }
}