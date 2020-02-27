/*global chrome*/
import React, { Component } from 'react'
import { goBack, goTo } from '../services/router'
import { Entity } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/entity'
import { Address } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/address'
import Account from './account'
import { validJSONstring } from '../utils/json'
import { validAddress } from '../utils/validAddress'
import Expand from 'react-expand-animated'
import { TRANSITION_DURATION_MS } from '../constants'
import Authentication from '../services/authentication'

export default class Recover extends Component {

  constructor (props) {
    super(props)
    this.handleFileChange = this.handleFileChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.validPassword = this.validPassword.bind(this)
    this.validFile = this.validFile.bind(this)
    this.validAddress = this.validAddress.bind(this)
    this.handleConfirmationSubmit = this.handleConfirmationSubmit.bind(this)
    this.hideConfirmation = this.hideConfirmation.bind(this)

    this.state = {
      file: null,
      password: '',
      address: '',
      file_name: '',
      collapsible_1: true,
      collapsible_2: false,
      error_message: '',
      password_error: false,
      file_error: false,
      address_error: false,
    }
  }

  async read_file (file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.readAsText(file, 'UTF-8')
      reader.onload = function (evt) {
        resolve(evt.target.result)
      }
      reader.onerror = function () {
        reject(null)
      }
    })
  }

  handleChange (event) {
    let change = {}
    change[event.target.name] = event.target.value
    this.setState(change)
  }

  handleFileChange (event) {
    this.setState({
      file: event.target.files[0],
      file_name: event.target.value
    })
  };

  /**
   * Check is password is "valid" (not whether correct) ie is not empty, and is "strong" as per javascript SDK.
   *
   * @returns {boolean}
   */
  validPassword () {
    if (this.state.password === null || typeof this.state.password !== 'string' || this.state.password.length === 0) {
      this.setState({
        error_message: 'Password required',
        password_error: true
      })
      return false
    } else if (!Entity._strong_password(this.state.password)) {
      this.setState({
        error_message: 'Incorrect Password: Password too weak',
        password_error: true
      })
      return false
    }
    return true
  }

  /**
   * Check if file exists in state, and if it is valid JSON and returns Promise<boolean>. Side-effect is setting appropriate
   * form error message.
   *
   * @returns {Promise<boolean>}
   */
  async validFile () {

    if(this.state.file === "" || this.state.file === null){
      this.setState({
        error_message: 'File required',
        file_error: true
      })
      return
    }

    const file_str = await this.read_file(this.state.file)

    if (file_str === null) {
      this.setState({
        error_message: 'Unable to read file',
        file_error: true
      })
      return false
    }

    if (!validJSONstring(file_str)) {
      this.setState({
        error_message: 'Incorrect file type',
        file_error: true
      })
      return false
    }

    return true
  }

  /**
   * Checks if Address is valid (ie correct bs58 ejcoding + format + length + valid checksum) and returns according boolean.
   * Side-effect is setting error message on address field if false.
   *
   * @returns {boolean}
   */
  validAddress () {
    if (!validAddress(this.state.address)) {
      this.setState({
        error_message: 'Invalid address',
        address_error: true
      })
      return false
    }
    return true
  }

  /**
   * Main logic processing of page. Checks if password is correct and file is of correct form and decrypts if true,
   * Setting error message(s) otherwise. If an Address is not provided it does not then log user in but shows dialog
   * to confirm issue regarding decryption without providing an address. If address is provided it checks if file decrypts
   * create private key corresponding to the given address. If this is the case it sets encrypted key_file and address in storage,
   * sets the logged_in flag and then redirects to the account page. If this is not the case then it displays an error message to that effect.
   *
   * @param event
   * @returns {Promise<void>}
   */
  async handleSubmit () {
    // event.preventDefault()
    let error_flag = false, entity, file_str

    if (!this.validPassword()) error_flag = true
    if (!(await this.validFile())) error_flag = true
    else {
      file_str = await this.read_file(this.state.file)
      entity = await Entity._from_json_object(JSON.parse(file_str), this.state.password).catch(() => {
        this.setState({
          error_message: 'Unable to decrypt',
          file_error: true
        })
        error_flag = true
      })
    }

    //todo refactor this block for readbility,
    if (this.state.address && entity instanceof Entity) {
      if (new Address(entity).toString() !== this.state.address) {
        this.setState({
          error_message: 'Incorrect Password or Address',
          address_error: true, password_error: true
        })
        error_flag = true
      }

      if (!error_flag) {
        Authentication.storeNewUser(entity, file_str)
        goTo(Account)
      }

    } else if (!error_flag) {
      // show the confirmation dialog. //
      this.setState({ collapsible_1: false, collapsible_2: true })

    }
  }

  /**
   * This is called when user confirms they are ok to login without providing an address.
   * We already have validated the user's input so can proceed at this point to merely log them in and
   * then redirect to account page.
   *
   * @returns {Promise<void>}
   */
  async handleConfirmationSubmit () {
    // we have already confirmed the values are correct earlier, so don't need to validate again.
    const file_str = await this.read_file(this.state.file)
    const entity = await Entity._from_json_object(JSON.parse(file_str), this.state.password)
    Authentication.storeNewUser(entity, file_str)
    goTo(Account)
  }

  hideConfirmation () {
    this.setState({ collapsible_1: true, collapsible_2: false })
  }

  render () {
    const styles = {
      open: { background: ' #1c2846' }
    }

    const transitions = ['height', 'opacity', 'background']

    return (
      <div id="my-extension-root-inner" className="OverlayMain">
        <div className="OverlayMainInner">
          <h2>Recover</h2>
          <hr></hr>
          <Expand
            open={this.state.collapsible_1}
            duration={TRANSITION_DURATION_MS / 2}
            styles={styles}
            transitions={transitions}
          >

            <form id="form" className={'recover-form'}>
              <legend className="recover-legend">Upload File with Password</legend>
              <input label='file' className={`recover-input ${this.state.file_error ? 'red_error red-lock-icon' : ''}`}
                     id="file" type="file" onChange={this.handleFileChange.bind(this)}></input>
              <input type="password"
                     className={`recover-input ${this.state.password_error ? 'red_error red-lock-icon' : ''}`}
                     placeholder="Password" id="password"
                     name="password" value={this.state.password}
                     onChange={this.handleChange.bind(this)} required></input>
              <input label='address'
                     className={`recover-input recover-address ${this.state.address_error ? 'red_error red-lock-icon' : ''}`}
                     id="address" type="text"
                     name="address" placeholder="Address (optional)"
                     value={this.state.address} onChange={this.handleChange.bind(this)}></input>
              <output type="text" className={`recover-output red_error`}
                      id="output">{this.state.error_message}</output>

              <div className="small-button-container">
                <button type="button" className="small-button recover-small-button" onClick={event => {
                  event.preventDefault()
                  goBack()
                }}>Back
                </button>
                <button type="submit" className="small-button recover-small-button"
                        onClick={event => {
                          event.preventDefault()
                          this.handleSubmit()
                        }}>Upload
                </button>
              </div>
            </form>
          </Expand>
          <Expand
            open={this.state.collapsible_2}
            duration={TRANSITION_DURATION_MS}
            styles={styles}
            transitions={transitions}
          >
            <div className={"recover-warning-container"}>
            <p>Warning! Not providing your public address means that recovery won&apos;t error if your password is
              incorrect. </p>

            <p>It will instead
              decrypt to a random incorrect address (probably without funds).</p>

            <p>If this happens don&apos;t panic but clear your local storage and try again.</p>

            <p>Click &quot;Next&quot; to proceed
              anyway or &quot;Back&quot; to return to the upload form.</p>
            </div>
            <div className="small-button-container">
              <button type="button" className="small-button recover-small-button"
                      onClick={this.hideConfirmation}>Back
              </button>
              <button type="submit" className="small-button recover-small-button"
                      onClick={this.handleConfirmationSubmit}>Next
              </button>
            </div>
          </Expand>
        </div>
      </div>
    )
  }
}
