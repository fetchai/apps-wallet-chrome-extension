import React from 'react'
import { Entity } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/entity'
import { Address } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/address'
import { Storage } from './storage'
import { goTo } from '../services/router'
import Login from '../views/login'

export default class Authentication {

  static isLoggedIn () {
    const logged_in = Storage.getLocalStorage('logged_in')
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
    Storage.setLocalStorage('key_file', file_str)
    Storage.setLocalStorage('address', new Address(entity).toString())
    Storage.setLocalStorage('logged_in', 'true')
  }

  static hasSavedKey () {
    return Storage.getLocalStorage('key_file') !== null
  }

  static logOut () {
    Storage.setLocalStorage('logged_in', 'false')
  }

  /**
   * Determines whether password decrypts key file to entity corresponding to address saved in local storage.
   * Key file is retrieved from local storage.
   *
   * @param password
   * @returns {Promise<boolean>}
   */
  static async correctPassword (password) {
    const key_file = Storage.getLocalStorage('key_file')
    const address = Storage.getLocalStorage('address')
    let valid_flag = true
    let entity

    entity = await Entity._from_json_object(JSON.parse(key_file), password).catch(() => valid_flag = false)

    // check it creates correct address from decryption.
    if (valid_flag && new Address(entity).toString() !== address) valid_flag = false
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
      goTo(Download)
    } else if (!Authentication.isLoggedIn()) {
      goTo(Login)
    }

  }
}
export { Authentication }