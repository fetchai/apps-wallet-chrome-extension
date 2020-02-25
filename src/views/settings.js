/*global chrome*/
import React, { Component } from 'react'
import { goTo } from '../services/router'
import Account from './account'
import { Authentication } from '../services/authentication'
import Expand from 'react-expand-animated'
import { formErrorMessage } from '../services/formErrorMessage'
import { Entity } from 'fetchai-ledger-api/src/fetchai/ledger/crypto/entity'
import { TRANSITION_DURATION_MS, VERSION } from '../constants'
import { Storage } from '../services/storage'
import Login from './login'
import { getAssetURI } from '../utils/getAsset'

/**
 * Corresponds to the settings page.
 *
 */
export default class Settings extends Component {

  constructor (props) {
    super(props)
    this.HandleLogOut = this.HandleLogOut.bind(this)
    this.toggle = this.toggle.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handlePasswordUpdate = this.handlePasswordUpdate.bind(this)
    this.update_password = this.update_password.bind(this)
    this.wipe_form_errors = this.wipe_form_errors.bind(this)

    this.state = {
      collapsible_1: false,
      collapsible_2: false,
      collapsible_3: false,
      password: '',
      new_password_confirm: '',
      new_password: '',
      output: '',
      // flags for errors on each of the fields.
     password_confirm_error: false,
     password_error: false,
     new_password_error: false
    }
  }


  async wipe_form_errors(){
    return new Promise(resolve => this.setState({     password_confirm_error: false,
     password_error: false,
     new_password_error: false}, resolve))
  }

    async componentDidMount () {
      Authentication.Authenticate()
    }

  async handleChange (event) {
    let change = {}
    change[event.target.name] = event.target.value
    this.setState(change)
    await this.wipe_form_errors()
  }

  /**
   * Checks if password decrypts stored key file to the correct address, otherwise sets error message.
   *
   * @returns {Promise<boolean>}
   */
  async correctPassword () {
    // for speedy UI just do quickly here just if empty.
    if(!this.state.password.length < 1) {
       this.setState({password_error: true, output: "Incorrect password"})
      return false
    }

    if (!(await Authentication.correctPassword(this.state.password))) {
       this.setState({password_error: true, output: "Incorrect password"})
      return false
    }
    return true
  }

  /**
   * Checks that a new password is acceptable (is not current pwd + is strong enough).
   *
   * @returns {Promise<boolean>}
   */
  async newPasswordValidate () {

    if(this.state.new_password.length < 1) return false;

    if (await Authentication.correctPassword(this.state.new_password)) {
             this.setState({new_password_error: true, output: "New password is the same as current password"})
      return false
    }

    if (!Entity._strong_password(this.state.new_password)) {
      this.setState({new_password_error: true,
        output: "Weak Password: choose password of at least 14 characters containing at least 1 uppercase, lowercase, number and special character"})
      return false
    }
    return true
  }


  /**
   * Checks password matches confirm password field.
   *
   * @returns {boolean}
   */
  passwordConfirmValidate () {

    if(!this.state.new_password || !this.state.new_password_confirm)
      return false

    if (this.state.new_password !== this.state.new_password_confirm) {
           this.setState({password_confirm_error: true,
        output: "Passwords must match"})
      return false
    }
    return true
  }



  /**
   * Not only a toggle collapsible_${index} but sets the other collapsibles to closed
   * to show false so hides other setting "expandables".
   *
   * @param index of collapsible to toggle
   */
  toggle (index) {
    for (let i = 1; i <= 3; i++) {
      let collapse = 'collapsible_' + i

      if (i === index) {
        // we toggle the settings button that was clicked on
        this.setState(prevState => ({ [collapse]: !prevState[collapse] }))
        continue
      }
      // but with the other ones we close them for better UI
      this.setState({ [collapse]: false })
    }
  };

  /**
   * Main controlling logic for updating one's password. Determines if password form is valid and calls update method if true, else we
   * display error message(s).
   *
   * @param event
   * @returns {Promise<void>}
   */
  async handlePasswordUpdate (event) {
        event.preventDefault()
    await this.wipe_form_errors()
    let error = false
    if (!this.passwordConfirmValidate())  error = true
    if (!(await this.newPasswordValidate()))  error = true
    if (!(await this.correctPassword())) error = true

    if(!error) this.update_password()

  }

  /**
   * Password is updated by decrypting key-file with password, then re-encrypting with new password variable stored in state
   * and over-writing key file in local storage.
   *
   * @returns {Promise<void>}
   */
  async update_password () {
    //IMPORTANT NOTE: relies on original password being checked for correctness before invoking this, else it will lead to key loss
    const orig_key_file = Storage.getLocalStorage('key_file')
    const entity = await Entity._from_json_object(JSON.parse(orig_key_file), this.state.password)
    const key_file = await entity._to_json_object(this.state.new_password)
    Storage.setLocalStorage('key_file', JSON.stringify(key_file))
    this.setState({
        password: '',
        new_password_confirm: '',
        new_password: ''
      }, () => {
        this.setState({ output: 'Password successfully updated' })
      }
    )
  }

  /**
   * Logs user out and redirects to Login view.
   *
   * @constructor
   */
  HandleLogOut () {
    Authentication.logOut()
    goTo(Login)
  }

  render () {

    const styles = {
      open: { background: ' #1c2846' }
    }

    const transitions = ['height', 'opacity', 'background']

    return (
      <div id="my-extension-root-inner" className="OverlayMain">
        <div className="OverlayMainInner">
          <div className='address_title'>
            <h1>Settings</h1>
            <img className='cross settings-close' src={getAssetURI('cross_icon.svg')} onClick={goTo.bind(null, Account)}/>
          </div>
          <hr></hr>
          <button className="plain_button" onClick={() => this.toggle(1)}>General</button>
          <Expand
            open={this.state.collapsible_1}
            duration={TRANSITION_DURATION_MS}
            styles={styles}
            transitions={transitions}
          >
            <form className="settings_form">
              <div className="input_container">
                <label htmlFor="conversion">Conversion<br></br>Currency</label>
                <div className="select_container">
                  <select id="conversion" className="custom_select" name="dropdown">
                    <option value="USD">USD</option>
                    <option value="XBT">XBT</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
              <br></br>
              <div className="input_container form_label_single_line">
                <label htmlFor="conversion">Language</label>
                <div className="select_container">
                  <select id="conversion" className="custom_select" name="dropdown">
                    <option value="EN">English</option>
                    <option value="CN">Chinese</option>
                    <option value="ESN">Spanish</option>
                    <option value="FRN">French</option>
                  </select>
                </div>
              </div>
            </form>
          </Expand>
          <button className="plain_button" onClick={() => this.toggle(2)}>Security & Privacy</button>
          <Expand
            open={this.state.collapsible_2}
            duration={TRANSITION_DURATION_MS}
            styles={styles}
            transitions={transitions}
          >
            <form id="form">
              <legend className="change_password_legend">Change Password</legend>
              <input type="password" className={`change_password_input ${this.state.password_error ? 'red_error' : ''}`} placeholder="Old Password"
                     id="password" name="password" value={this.state.password}
                     onChange={this.handleChange.bind(this)}></input>

              <input type="password" className={`change_password_input ${this.state.new_password_error ? 'red_error' : ''}`} placeholder="New Password"
                     id="new_password" name="new_password" value={this.state.new_password}
                     onChange={this.handleChange.bind(this)}></input>

              <input type="password" className={`change_password_input ${this.state.password_confirm_error ? 'red_error' : ''}`} placeholder="Confirm New Password"
                     id="new_password_confirm" name="new_password_confirm"
                     value={this.state.new_password_confirm}
                     onChange={this.handleChange.bind(this)}></input>
              <output type="text" className={`change_password_input change_password_output change_password_error red_error`}
                      id="output">{this.state.output}</output>
              <button type="submit" className="update_button"
                      onClick={this.handlePasswordUpdate}>Update
              </button>
            </form>
          </Expand>
          <button className="plain_button clear" onClick={() => this.toggle(3)}>About</button>
          <Expand
            open={this.state.collapsible_3}
            duration={TRANSITION_DURATION_MS}
            styles={styles}
            transitions={transitions}
          >
            <p className="settings_about">FET Wallet Version {VERSION}</p>
            <p className="settings_about">Developed and Designed by Fetch.ai Cambridge</p>
          </Expand>
          <button className="logout_button" onClick={this.HandleLogOut}>
            Log out
          </button>
        </div>
      </div>
    )
  }
}