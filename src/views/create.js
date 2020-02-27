/*global chrome*/
import React, { Component } from 'react'
import { goBack, goTo } from '../services/router'
import { Entity } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/entity'
import Account from './account'
import Authentication from '../services/authentication'

/**
 * corresponds to the create view of initial wireframes (v4) and handles view + associated logic for new account creation.
 *
 */
export default class Create extends Component {

  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      error: false,
      output: '',
      user_password: '',
      user_password_confirm: ''
    }
  }

  handleChange (event) {
    let change = {}
    change[event.target.name] = event.target.value
    change.error = false
    this.setState(change)
  }

  /**
   * Checks only if user_password provided, and if it is of adequate strength as per our javascript SDK.
   * Sets error message if not and returns. If true creates user, logs them in, and redirects to account page.
   *
   * @param event
   * @returns {Promise<void>}
   */
  async handleSubmit (event) {
    event.preventDefault()

    if (!Entity._strong_password(this.state.user_password)) {
      this.setState({
        error: true,
        output: 'Weak password: password requires 14 characters including a number and an uppercase, lowercase and special character'
      })
      return
    }

    if (this.state.user_password !== this.state.user_password_confirm) {
      this.setState({ error: true, output: 'Passwords Don\'t Match' })
      return
    }

    let entity = new Entity()
    const json_obj = await entity._to_json_object(this.state.user_password)
    Authentication.storeNewUser(entity, JSON.stringify(json_obj))
    goTo(Account)
  }

  render () {
    return (
      <div id="my-extension-root-inner" className="OverlayMain">
        <div className="OverlayMainInner">
          <h1>Create account</h1>
          <hr></hr>
          <form id="form">
            <input type="password" className={`large-button ${this.state.error ? 'red_error red-lock-icon' : ''}`}
                   placeholder="Password" id="user_password"
                   name="user_password" value={this.state.user_password}
                   onChange={this.handleChange} required></input>
            <input type="password"
                   className={` large-button create-confirm-password ${this.state.error ? 'red_error red-lock-icon' : ''}`}
                   placeholder="Confirm Password"
                   id="user_password_confirm" name="user_password_confirm" value={this.state.user_password_confirm}
                   onChange={this.handleChange} required></input>
            <output type="text"
                    className={`create-output ${this.state.error ? 'red_error' : ''}`}
                    id="output">{this.state.output}</output>
            <div className="small-button-container">
              <button type="button" className="small-button create-button" onClick={event => {
                event.preventDefault()
                goBack()
              }}>Back
              </button>
              <button type="submit" className="small-button create-button" onClick={this.handleSubmit}>Next</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}