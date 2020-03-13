import React, { Component } from 'react'
import { goTo } from '../services/router'
import Create from './create'
import Recover from './recover'
import Initial from './initial'

/**
 * Each stage corresponds to a page as per the original 8 pages of the wireframes, and this corresponds to the initial view.
 *
 * It should not be shown to a user with a key saved in memory.
 */

export default class Terms extends Component {

  constructor (props) {
    super(props)
    // eslint-disable-next-line react/prop-types
    const { next } = props
    this.next = this.next.bind(this)

    // accept ( a boolean) refers to if the terms must be accepted, otherwise we dont show accept link
    this.state = {
      next: next || null
    }

  }

  next () {
    if (this.state.next === 'recover') goTo(Recover)
    else if (this.state.next === 'create') goTo(Create)
    else throw new Error('can only go to create or recover after accepting terms. next must be one of these values.')
  }

  componentDidMount () {
  }

  render () {
    return (
      <div id="my-extension-root-inner" className="OverlayMain" data-testid="terms">
        <div className="OverlayMainInner">
          <h1 className="terms-header">Terms & Conditions</h1>
          <hr></hr>
          <div className={'terms-text custom-scrollbar'}>
            <b>This web application is provided with no warranty. </b>Whilst every effort has been made to ensure its
            reliability, security and performance, you use it at your own risk. Fetch.AI takes no responsibility for any
            loss of tokens that occur as a result of using this application. In particular:
            <ul>
              <li>
                <b>You are responsible for securely backing up your private keys: </b>we cannot recover any tokens lost
                as a result of their loss.
              </li>
              <br></br>
              <li>
                <b>Do not use this application for high-value use: </b> it is for holding and working with small amounts
                for utility use on Fetch.ai’s networks.
              </li>
              <br></br>
              <li>
                <b>This software is in constant development: </b> please ensure you’re using the latest version, and
                report all bugs to us on Fetch.ai’s developer Slack.
                <br></br></li>
            </ul>
            By accepting these terms and conditions, you are deemed to have accepted this. It will work with the
            Fetch.ai Mainnet, Testnet and a locally deployed network.
            It is open-source, and you can examine the source-code for yourself on <a href="https://github.com/fetchai/apps-wallet-chrome-extension/" target="_blank"
                                                      rel="noopener noreferrer">our Github</a> or for more
            information about Fetch.ai, please see <a href=" https://fetch.ai" target="_blank"
                                                      rel="noopener noreferrer">our website</a> and for legal
            information, see our <a target="_blank" rel="noopener noreferrer"
                               href="https://fetch.ai/legals/">legal section</a>

          </div>
          {this.state.next ? [<button key={1} className={'terms-back-button'}
                                      onClick={goTo.bind(null, Initial)}>Back</button>,
              <button key={2} className={'terms-accept-button'} onClick={this.next}>Accept</button>]
            : <button className={'terms-back'} onClick={goTo.bind(null, Initial)}>Back</button>}
        </div>
      </div>
    )
  }
}