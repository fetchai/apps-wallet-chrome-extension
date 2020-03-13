/*global chrome*/
import React, { Component } from 'react'
import { goTo } from '../services/router'
import { Entity } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/entity'
import Account from './account'
import Authentication from '../services/authentication'
import Terms from './terms'

const WEAK_PASSWORD_ERROR_MESSAGE = 'Weak password: password requires 14 characters including a number and an uppercase, lowercase and special character'
const PASSWORDS_DONT_MATCH_ERROR_MESSAGE = 'Passwords Don\'t Match'
const PASSWORD_REQUIRED_ERROR_MESSAGE = 'Password required'

/**
 * corresponds to the create view of initial wireframes (v4) and handles view + associated logic for new account creation.
 *
 */
export default class Create extends Component {

  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.wipeFormErrors = this.wipeFormErrors.bind(this)

    this.state = {
      error: false,
      output: '',
      user_password: '',
      user_password_confirm: ''
    }
  }

  async wipeFormErrors () {
    return new Promise(resolve => {
      this.setState({
        error: false
      }, resolve)
    })
  }

  async handleChange (event) {
    let change = {}
    change[event.target.name] = event.target.value
    change.error = false
    this.setState(change)
    await this.wipeFormErrors()
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
    if (!this.state.user_password) {
           this.setState({
        error: true,
        output: PASSWORD_REQUIRED_ERROR_MESSAGE
      })
return
    }
    if (!Entity._strong_password(this.state.user_password)) {
      this.setState({
        error: true,
        output: WEAK_PASSWORD_ERROR_MESSAGE
      })
      return
    }

    if (this.state.user_password !== this.state.user_password_confirm) {
      this.setState({ error: true, output: PASSWORDS_DONT_MATCH_ERROR_MESSAGE })
      return
    }

    await this.createNewUser()
    goTo(Account)
  }

 async createNewUser(){
        let entity = new Entity()
    const json_obj = await entity._to_json_object(this.state.user_password)
    Authentication.storeNewUser(entity, JSON.stringify(json_obj))
  }

  render () {
    return (
      <div id="my-extension-root-inner" className="OverlayMain" data-testid="create">
        <div className="OverlayMainInner">
          <h1>Create account</h1>
          <hr></hr>
          <form id="form">
            <input type="password" data-testid="create_password"
                   className={`create-password ${this.state.error ? 'red_error red-lock-icon' : ''}`}
                   placeholder="Password (min 14 chars)" id="user_password"
                   name="user_password" value={this.state.user_password}
                   onChange={this.handleChange}></input>
            <input type="password" data-testid="create_password_confirm"
                   className={`create-confirm-password ${this.state.error ? 'red_error red-lock-icon' : ''}`}
                   placeholder="Confirm Password"
                   id="user_password_confirm" name="user_password_confirm" value={this.state.user_password_confirm}
                   onChange={this.handleChange}></input>
            <output type="text" data-testid="create_output"
                    className={`create-output ${this.state.error ? 'red_error' : ''}`}
                    id="output">{this.state.output}</output>
            <div className="small-button-container">
              <button type="button" className="create-back-button" data-testid="create_back_button" onClick={event => {
                event.preventDefault()
                goTo(Terms, { next: 'create' })
              }}>Back
              </button>
              <button type="submit" className="create-next-button" data-testid="create_submit"
                      onClick={this.handleSubmit}>Next
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}