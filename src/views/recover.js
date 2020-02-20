/*global chrome*/
import React, { Component } from 'react'
import { goBack, goTo } from '../services/router'
import { Entity } from 'fetchai-ledger-api/src/fetchai/ledger/crypto/entity'
import { Address } from 'fetchai-ledger-api/src/fetchai/ledger/crypto/address'
import Account from './account'
import { formErrorMessage } from '../services/formErrorMessage'
import { validJSONObject } from '../utils/json'
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
      file: '',
      password: '',
      address: '',
      file_name: '',
      collapsible_1: true,
      collapsible_2: false
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
    debugger;
    this.setState(change)
  }

  handleFileChange (event) {

    debugger;

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
      formErrorMessage('password', 'Password required')
      return false
    } else if (!Entity._strong_password(this.state.password)) {
      formErrorMessage('password', 'Incorrect Password: Password too weak')
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
    debugger;

    // if (!(this.state.file instanceof Blob) && !(this.state.file instanceof File)) {
    //   formErrorMessage('file', 'File required')
    //   return false
    // }

    const file_str = await this.read_file(this.state.file)

    if (file_str === null) {
      formErrorMessage('file', 'Unable to read file')
      return false
    }

    if (!validJSONObject(file_str)) {
      formErrorMessage('file', 'Incorrect file type')
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
      formErrorMessage('address', 'Invalid address')
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

     console.log("store new qqqqqqqqqq")
    // event.preventDefault()
    // validate
    let error_flag = false
    let entity
    let file_str

    if (!this.validPassword()) error_flag = true
    if (!(await this.validFile())) error_flag = true
    else {
      file_str = await this.read_file(this.state.file)
      entity = await Entity._from_json_object(JSON.parse(file_str), this.state.password).catch(() => {
        formErrorMessage('password', 'Unable to decrypt')
        error_flag = true
      })
    }
 console.log("store new user11")
    if (this.state.address && entity instanceof Entity) {
      if (new Address(entity).toString() !== this.state.address) {
        formErrorMessage('address', 'Incorrect Password or Address')
        error_flag = true
      }

      if (!error_flag) {
         debugger
        console.log("store new user")
        Authentication.storeNewUser(entity, file_str)
        goTo(Account)
      }

    } else if (!error_flag) {
       debugger
              console.log("store new usedddsdsdsdsddsr")

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
            duration={TRANSITION_DURATION_MS/2}
            styles={styles}
            transitions={transitions}
          >

            <form id="form">
              <legend className="recover-legend">Upload File with Password</legend>
              <input label='file' className="recover-input" id="file" type="file"
                     value={this.state.file_name} onChange={this.handleFileChange.bind(this)}></input>
              <input type="text" className="recover-input" placeholder="Password" id="password"
                     name="password" value={this.state.password}
                     onChange={this.handleChange.bind(this)} required></input>
              <input label='address' className="recover-input recover-address" id="address" type="text"
                     name="address" placeholder="Address (optional)"
                     value={this.state.address} onChange={this.handleChange.bind(this)}></input>
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
            duration={TRANSITION_DURATION_MS/2}
            styles={styles}
            transitions={transitions}
          >
            <p>Decrypting without providing an Address means that if the password is wrong it will decrypt
              to the wrong address rather than throw an error. Click yes to proceed or cancel and provide
              an address </p>
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
