import React from 'react'
import { Entity } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/entity'
import { Address } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/address'
import { Storage } from './storage'
import { goTo } from '../services/router'
import Login from '../views/login'
import Initial from '../views/initial'
import { digest } from '../utils/digest'
import { ADDRESS, KEY_FILE, LOGGED_IN } from '../constants'

export default class Authentication {

  static isLoggedIn () {
    const logged_in = Storage.getLocalStorage(LOGGED_IN)
    return Boolean(JSON.parse(logged_in))
  }

  /**
   * When user is created, or account recovered (uploaded), this method
   * saves the three relavent details in local storage (encrypted key-file-string, b58-encoded address
   * and logged_in flag, which we now set to true).
   *
   * @param entity
   * @param file_str
   */
  static storeNewUser (entity, file_str) {
    Storage.setLocalStorage(KEY_FILE, file_str)
    Storage.setLocalStorage(ADDRESS, new Address(digest(entity.public_key_bytes())).toString())
    Storage.setLocalStorage(LOGGED_IN, 'true')
  }

  static hasSavedKey () {
    return Storage.getLocalStorage(KEY_FILE) !== null
  }

  static logOut () {
    Storage.setLocalStorage(LOGGED_IN, 'false')
  }

  /**
   * Determines whether password decrypts key file to entity corresponding to address saved in local storage.
   * Key file is retrieved from local storage.
   *
   * @param password
   * @returns {Promise<boolean>}
   */
  static async correctPassword (password) {
    const key_file = Storage.getLocalStorage(KEY_FILE)
    const address = Storage.getLocalStorage(ADDRESS)

    let valid_flag = true
    let entity
    debugger
    entity = await Entity._from_json_object(JSON.parse(key_file), password).catch(() => valid_flag = false)

debugger
    const a = new Address(entity)

    const b = a.toString()
    debugger
    // check it creates correct address from decryption.
    if (!valid_flag || b !== address) valid_flag = false
    return valid_flag
  }

  /**
   * This is used to check if they are still logged in when new component is mounted.
   * If you clear history whilst app open in a different tab when you switch
   * to new view then it will detect you logged and redirect to correct logged out area,
   *
   */
  static Authenticate () {
    if (!Authentication.hasSavedKey()) {
      goTo(Initial)
    } else if (!Authentication.isLoggedIn()) {
      goTo(Login)
    }
  }

}
export { Authentication }