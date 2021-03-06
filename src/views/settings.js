/*global chrome*/
/*global StorageArea*/
import React, { Component } from 'react'
import { goTo } from '../services/router'
import Account from './account'
import { Authentication } from '../services/authentication'
import { Storage } from '../services/storage'
import Expand from 'react-expand-animated'
import { Entity } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/entity'
import { NETWORKS_ENUM, STORAGE_ENUM, TRANSITION_DURATION_MS, VERSION } from '../constants'
import Login from './login'
import { getAssetURI } from '../utils/getAsset'
import { capitalise } from '../utils/capitalise'
import { download } from '../utils/download'
import Initial from './initial'


const PASSWORD_REQUIRED_ERROR_MESSAGE = 'Password required'
const NEW_PASSWORD_REQUIRED_ERROR_MESSAGE = 'New password required'
const INCORRECT_PASSWORD_ERROR_MESSAGE = 'Incorrect password'
const WEAK_PASSWORD_ERROR_MESSAGE = 'Weak password: password requires 14 characters including a number and an uppercase, lowercase and special character'
const PASSWORD_NOT_CHANGED_ERROR_MESSAGE = 'New password equals current password'
const PASSWORDS_DONT_MATCH_ERROR_MESSAGE = 'Passwords must match'
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
    this.wipeFormErrors = this.wipeFormErrors.bind(this)
    this.handleNetworkChange = this.handleNetworkChange.bind(this)
    this.hasError = this.hasError.bind(this)
    this.awaitState = this.awaitState.bind(this)
    this.clearHistory = this.clearHistory.bind(this)

    this.state = {
      // network:
      collapsible_1: false,
      collapsible_2: false,
      collapsible_3: false,
      collapsible_4: false,
      storage_cleared: false,
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

  async awaitState (state) {
   return new Promise(resolve => this.setState(state, resolve))
  }

  async wipeFormErrors (clear_output = false) {
    let password, new_password_confirm, new_password, output

    if (clear_output) {
      password = ''
      new_password_confirm = ''
      new_password = ''
      output = ''

      return new Promise(resolve => this.setState({
        password_confirm_error: false,
        password_error: false,
        new_password_error: false,
        output: output,
        password: password,
        new_password_confirm: new_password_confirm,
        new_password: new_password,
      }, resolve))

    } else {
      return new Promise(resolve => this.setState({
        password_confirm_error: false,
        password_error: false,
        new_password_error: false
      }, resolve))
    }

  }

  clearHistory() {
    chrome.storage.sync.clear()
    delete window.fetchai_history
    this.setState({storage_cleared: true})
    setTimeout(goTo.bind(null, Initial), 5000)
  }

  hasError () {
    return (this.state.password_confirm_error ||
      this.state.password_error ||
      this.state.new_password_error)
  }

  async componentDidMount () {
        const network =  await Storage.getItem(STORAGE_ENUM.SELECTED_NETWORK);
        this.setState({network: network})
        await Authentication.Authenticate()
  }

  async handleNetworkChange (event) {
    const selected_network = event.target.value
    await this.handleChange(event)
    // clear cached values on window object
    delete window.fetchai_history
    await Storage.setItem(STORAGE_ENUM.SELECTED_NETWORK, selected_network)
  }

  async handleChange (event) {
    let change = {}
    change[event.target.name] = event.target.value
    this.setState(change)
    await this.wipeFormErrors()
  }

  /**
   * Checks if password decrypts stored key file to the correct address, otherwise sets error message as side-effect and returns false.
   *
   * @returns {Promise<boolean>}
   */
  async correctPassword () {
    // for speedy UI just do quickly here just if empty.
    if (!this.state.password.length) {
      this.setState({ password_error: true, output: PASSWORD_REQUIRED_ERROR_MESSAGE })
      return false
    }

    if (!(await Authentication.correctPassword(this.state.password))) {
      this.setState({ password_error: true, output: INCORRECT_PASSWORD_ERROR_MESSAGE })

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
    if (!this.state.new_password.length) {
      this.setState({ new_password_error: true, output: NEW_PASSWORD_REQUIRED_ERROR_MESSAGE })
      return false
    }

    if (await Authentication.correctPassword(this.state.new_password)) {
      this.setState({ new_password_error: true, output: PASSWORD_NOT_CHANGED_ERROR_MESSAGE })
      return false
    }

    if (!Entity._strong_password(this.state.new_password)) {
      this.setState({
        new_password_error: true,
        output: WEAK_PASSWORD_ERROR_MESSAGE
      })
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

    if (!this.state.new_password || !this.state.new_password_confirm)
      return false

    if (this.state.new_password !== this.state.new_password_confirm) {
      this.setState({
        password_confirm_error: true,
        output: PASSWORDS_DONT_MATCH_ERROR_MESSAGE
      })
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
    if(index === 4)  {
     let collapsible_4 = !this.state.collapsible_4
      return this.setState({ collapsible_4: collapsible_4, collapsible_5: false }, this.wipeFormErrors.bind(null, true))
    }
    if(index === 5)  {
      let collapsible_5 = !this.state.collapsible_5
      return this.setState({ collapsible_5: collapsible_5, collapsible_4: false }, this.wipeFormErrors.bind(null, true))
    }

    // for the big 3 collapsibles
    for (let i = 1; i <= 5; i++) {
      let collapse = 'collapsible_' + i

      if (i === index) {
        // we toggle the settings button that was clicked on
        this.setState(prevState => ({ [collapse]: !prevState[collapse] }))
        continue
      }
      // but with the other ones we close them for better UI
      this.setState({ [collapse]: false }, this.wipeFormErrors.bind(null, true))
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
    await this.wipeFormErrors()

    if (!(await this.correctPassword())) return
    if (!(await this.newPasswordValidate())) return
    if (!this.passwordConfirmValidate()) return

    this.update_password()

  }

  /**
   * Password is updated by decrypting key-file with password, then re-encrypting with new password variable stored in state
   * and over-writing key file in local storage.
   *
   * @returns {Promise<void>}
   */
  async update_password () {
    //IMPORTANT NOTE: relies on original password being checked for correctness before invoking this, else it will lead to key loss
    const orig_key_file = await Storage.getItem(STORAGE_ENUM.KEY_FILE)
    const entity = await Entity._from_json_object(JSON.parse(orig_key_file), this.state.password)
    const key_file = await entity._to_json_object(this.state.new_password)
    await Storage.setItem(STORAGE_ENUM.KEY_FILE, JSON.stringify(key_file))
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

    const transitions = ['height', 'opacity', 'background']

    return (
      <div id="my-extension-root-inner" className="OverlayMain" data-testid="settings">
        <div className="OverlayMainInner">
          <div className='address_title'>
            <h1 className="settings-header">Settings</h1>
            <img className='cross settings-close' src={getAssetURI('cross_icon.svg')}
                 onClick={goTo.bind(null, Account)}/>
          </div>
          <hr className="settings-hr"></hr>
          <button className="settings_button" onClick={() => this.toggle(1)}>General</button>
          <Expand
            open={this.state.collapsible_1}
            duration={TRANSITION_DURATION_MS}

            transitions={transitions}
          >
            <form className="settings_form">
              <div className="input_container">
                <label htmlFor="conversion">Choose<br></br>Network</label>
                <div className="select_container">
                  {(this.state.network) ? [
                    <select key={1}  onChange={this.handleNetworkChange.bind(this)} id="network" className="custom_select"
                            name="network">
                      <option selected={this.state.network == NETWORKS_ENUM.TESTNET}
                              value={NETWORKS_ENUM.TESTNET}>{capitalise(NETWORKS_ENUM.TESTNET)}</option>
                      <option selected={this.state.network == NETWORKS_ENUM.MAINNET}
                              value={NETWORKS_ENUM.MAINNET}>{capitalise(NETWORKS_ENUM.MAINNET)}</option>
                    </select>]
                  : ""}
                </div>
              </div>
            </form>
          </Expand>
          <button className="settings_button" onClick={() => this.toggle(2)}>Security & Privacy</button>
          <Expand
            open={this.state.collapsible_2}
            duration={TRANSITION_DURATION_MS}
            transitions={transitions}
          >
            <form id="form">
              <legend className="change_password_legend settings_about" onClick={() => this.toggle(4)}>Change Password</legend>
               <Expand
                open={this.state.collapsible_4}
            duration={TRANSITION_DURATION_MS}
            transitions={transitions}>
              <input type="password" className={`change_password_input ${this.state.password_error ? 'red_error' : ''}`}
                     placeholder="Old Password"
                     data-testid="settings_password"
                     id="password" name="password" value={this.state.password}
                     onChange={this.handleChange.bind(this)}></input>
              <input type="password"
                     className={`change_password_input ${this.state.new_password_error ? 'red_error' : ''}`}
                     placeholder="New Password"
                     data-testid="settings_new_password"
                     id="new_password" name="new_password" value={this.state.new_password}
                     onChange={this.handleChange.bind(this)}></input>

              <input type="password"
                     className={`change_password_input ${this.state.password_confirm_error ? 'red_error' : ''}`}
                     placeholder="Confirm New Password"
                     id="new_password_confirm" name="new_password_confirm"
                     data-testid="settings_new_password_confirm"
                     value={this.state.new_password_confirm}
                     onChange={this.handleChange.bind(this)}></input>
              <button type="submit" className="update_button change_password_update_button"
                      data-testid="settings_submit"
                      onClick={this.handlePasswordUpdate}>Update
              </button>
               </Expand>
              <output type="text"
                      data-testid="settings_output"
                      className={`change_password_error ${this.hasError() ? 'red_error' : ''} ${this.state.collapsible_4 ? 'change_password_input change_password_output ' : ''}`}
                      id="output">{this.state.output}</output>
            </form>
             <button className={`clear-storage-header settings_about ${this.state.collapsible_4 ? "" : 'clear-storage-header-margin'}`} onClick={() => this.toggle(5)}>Delete Account</button>
             <Expand
                open={this.state.collapsible_5}
            duration={TRANSITION_DURATION_MS}
            transitions={transitions}>
               <button className="clear-storage" onClick={download}>Download Key</button>
               <button  disabled={this.state.storage_cleared} className="clear-storage disabled-pointer" onClick={this.clearHistory}>Delete Account</button>
               <output className={`deleted-output-message red ${this.state.storage_cleared ? '': "download-key-file-message"}`}>
                 {this.state.storage_cleared? "Deleted" : "Deleted Key file cannot be recovered" }</output>
             </Expand>
          </Expand>
          <button className="settings_button clear" onClick={() => this.toggle(3)}>About</button>
          <Expand
            open={this.state.collapsible_3}
            duration={TRANSITION_DURATION_MS}
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