import React, { Component } from 'react'
import { goTo } from '../services/router'
import Create from './create'
import Recover from './recover'
import { getAssetURI } from '../utils/getAsset'

/**
 * Each stage corresponds to a page as per the original 8 pages of the wireframes, and this corresponds to the initial view.
 *
 * It should not be shown to a user with a key saved in memory.
 */

export default class Initial extends Component {

  render () {
    return (
      <div>
        <video className="vid" playsInline="playsinline" autoPlay="autoplay" muted="muted" loop="loop">
          <source src={getAssetURI('welcome.mp4')} type="video/mp4"/>
        </video>
        <div className="overlay1"><img src={getAssetURI('fetchai_logo.svg')} alt="Fetch.ai's Logo"
                                       className="logo"></img></div>
        <div className="overlay2">
          <div className="overlay3">
            <button className='button-free-standing' onClick={goTo.bind(null, Recover)}>
              Recover
            </button>
            <button className='button-free-standing' onClick={goTo.bind(null, Create)}>
              Create
            </button>
          </div>
        </div>
      </div>
    )
  }
}