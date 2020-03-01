/*global chrome*/
import React, { Component } from 'react'
import { goTo } from '../services/router'
import Account from './account'
import Authentication from '../services/authentication'
import { Storage } from '../services/storage'
import { getAssetURI } from '../utils/getAsset'
import { LOGGED_IN } from '../constants'

/**
 * Our login Page.
 *
 * Note: login page should only be shown if user can login ie if they have an account saved in memory.
 */
export default class Login extends Component {

  constructor (props) {
    super(props)
    debugger;

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      user_password: '',
      login_error: false,
      output: ''
    }
  }

  handleChange (event) {
    let change = {}
    change[event.target.name] = event.target.value
    change.login_error = false
    this.setState(change)
  }


  // async componentDidMount () {
  //   if(!) //todo add check for saved key else redirect to initial.
  // }
  /**
   * Processes login form submission. If the user_password is correct we set logged-in to true in local storage and redirect to account page.
   *
   */
  async handleSubmit (event) {
    event.preventDefault()

    if (!(await Authentication.correctPassword(this.state.user_password))) {
      this.setState({ output: `Incorrect password`, login_error: true })
      return
    }
    Storage.setLocalStorage(LOGGED_IN, 'true')
    goTo(Account)
  }

  render () {
    return (
      <div id="my-extension-root-inner"  data-testid="login">
        {/*Video is not background but attached to top div with other elements placed over it via absolute positioning*/}
        <video className="vid" playsInline="playsinline" autoPlay="autoplay" muted="muted" loop="loop">
          <source src={getAssetURI('welcome.mp4')} type="video/mp4"></source>
        </video>
        <div className="overlay1"><img src={getAssetURI('fetchai_logo.svg')} alt="Fetch.ai's Logo"
                                       className="logo"></img></div>
        <div className="overlay2">
          <div className="overlay3">
            <form id="form">
              <input type="password"
                     className={`button-free-standing login-password-field ${this.state.login_error ? 'red_error red-lock-icon' : ''}`}
                     placeholder="Password"
                     id="user_password" name="user_password" value={this.state.user_password}
                     onChange={this.handleChange.bind(this)} required></input>
              <output type="TEXT" className={`login-output ${this.state.login_error ? 'red_error' : ''}`}
                      id="output">{this.state.output}</output>
              <button type="submit" className="button-free-standing login-submit-field"
                      onClick={this.handleSubmit}>Login
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}