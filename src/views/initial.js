import React, { Component } from 'react'
import { goTo } from '../services/router'
import { getAssetURI } from '../utils/getAsset'
import Authentication from '../services/authentication'
import Terms from './terms'
import { VERSION } from '../constants'
import { Storage } from '../services/storage'

/**
 * Each stage corresponds to a page as per the original 8 pages of the wireframes, and this corresponds to the initial view.
 *
 * It should not be shown to a user with a key saved in memory.
 */

export default class Initial extends Component {

  constructor (props) {
    super(props)
  }

 async componentDidMount () {
await Storage.setItem ('key99', 'storagetest')
const r99 = await Storage.getItem ('key99')
    // if they have a saved key they should not be here so redirect them to Login.
    if (await Authentication.hasSavedKey()) await Authentication.Authenticate(true)
  }

  render () {
    return (
      <div id="my-extension-root-inner" data-testid="initial">
        <video className="vid" playsInline="playsinline" autoPlay="autoplay" muted="muted" loop="loop">
          <source src={getAssetURI('welcome.mp4')} type="video/mp4"/>
        </video>
        <div className="overlay1"><img src={getAssetURI('fetchai_logo.svg')} alt="Fetch.ai's Logo"
                                       className="logo"></img></div>
        <span className='preview-build'>Preview Build: {VERSION}</span>
        <div className="overlay2">
          <div className="overlay3">
            <button className='button-free-standing initial-recover-button' data-testid="recover_button"
                    onClick={goTo.bind(null, Terms, { next: 'recover' })}>
              Recover
            </button>
            <button className='button-free-standing initial-create-button' data-testid="create_button"
                    onClick={goTo.bind(null, Terms, { next: 'create' })}>
              Create
            </button>
            <span className='initial-terms-link' onClick={goTo.bind(null, Terms)}>View Terms and Conditions</span>
          </div>
        </div>
      </div>
    )
  }
}