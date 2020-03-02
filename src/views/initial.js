import React, { Component } from 'react'
import { goTo } from '../services/router'
import Create from './create'
import Recover from './recover'
import { getAssetURI } from '../utils/getAsset'
import Authentication from '../services/authentication'
import Login from './login'

/**
 * Each stage corresponds to a page as per the original 8 pages of the wireframes, and this corresponds to the initial view.
 *
 * It should not be shown to a user with a key saved in memory.
 */

export default class Initial extends Component {

    constructor (props) {
    super(props)
    }

  componentDidMount () {

    // if they have a saved key they should not be here so redirect them to Login.
   if(!Authentication.hasSavedKey()) {
     goTo(Login)

   }
  }

  render () {
    return (
      <div id="my-extension-root-inner"  data-testid="initial">
        <video className="vid" playsInline="playsinline" autoPlay="autoplay" muted="muted" loop="loop">
          <source src={getAssetURI('welcome.mp4')} type="video/mp4"/>
        </video>
        <div className="overlay1"><img src={getAssetURI('fetchai_logo.svg')} alt="Fetch.ai's Logo"
                                       className="logo"></img></div>
        <div className="overlay2">
          <div className="overlay3">
            <button className='button-free-standing' data-testid="recover_button99" onClick={goTo.bind(null, Recover)}>
              Recover
            </button>
            <button className='button-free-standing' data-testid="create_button" onClick={goTo.bind(null, Create)}>
              Create
            </button>
          </div>
        </div>
      </div>
    )
  }
}