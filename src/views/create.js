/*global chrome*/
import React, { Component } from 'react'
import { goBack, goTo } from '../services/router'
import { Entity } from 'fetchai-ledger-api/src/fetchai/ledger/crypto/entity'
import Account from './account'
import Authentication from '../services/authentication'
import { formErrorMessage } from '../services/formErrorMessage'

/**
 * corresponds to the create view of initial wireframes (v4) and handles view + associated logic for new account creation.
 *
 */
export default class Create extends Component {

  constructor (props) {
    super(props)
    this.state = { user_password: '', user_password_confirm: '' }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (event) {
    let change = {}
    change[event.target.name] = event.target.value
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
        formErrorMessage("user_password", 'Weak Password: choose user_password with 14 characters including an uppercase, lowercase, number and special character')
      return
    }

    if (this.state.user_password !== this.state.user_password_confirm) {
      formErrorMessage("user_password_confirm", 'Passwords Don\'t Match')
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
            <input type="user_password" className="large-button" placeholder="Password" id="user_password"
                   name="user_password" value={this.state.user_password}
                   onChange={this.handleChange.bind(this)} required></input>
            <input type="user_password" className="large-button" placeholder="Confirm Password"
                   id="user_password_confirm" name="user_password_confirm" value={this.state.user_password_confirm}
                   onChange={this.handleChange.bind(this)} required></input>
            <div className="small-button-container">
              <button type="button" className="small-button" onClick={event => {
                event.preventDefault()
                goBack()
              }}>Back
              </button>
              <button type="submit" className="small-button" onClick={this.handleSubmit}>Next</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}