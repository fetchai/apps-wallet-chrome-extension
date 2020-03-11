import React from 'react'
import { Entity } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/entity'
import { Address } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/address'
import { Storage } from './storage'
import { goTo } from '../services/router'
import Login from '../views/login'
import Initial from '../views/initial'
import { digest } from '../utils/digest'
import { DEFAULT_NETWORK, STORAGE_ENUM } from '../constants'

export default class Authentication {

  static isLoggedIn () {
    const logged_in = localStorage.getItem(STORAGE_ENUM.LOGGED_IN)
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
    localStorage.setItem(STORAGE_ENUM.KEY_FILE, file_str)
    localStorage.setItem(STORAGE_ENUM.ADDRESS, new Address(digest(entity.public_key_bytes())).toString())
    localStorage.setItem(STORAGE_ENUM.LOGGED_IN, 'true')
    localStorage.setItem(STORAGE_ENUM.SELECTED_NETWORK, DEFAULT_NETWORK)
  }

  static hasSavedKey () {
    return localStorage.getItem(STORAGE_ENUM.KEY_FILE) !== null
  }

  static logOut () {
    localStorage.setItem(STORAGE_ENUM.LOGGED_IN, 'false')
  }

  /**
   * Determines whether password decrypts key file to entity corresponding to address saved in local storage.
   * Key file is retrieved from local storage.
   *
   * @param password
   * @returns {Promise<boolean>}
   */
  static async correctPassword (password) {
    const key_file = localStorage.getItem(STORAGE_ENUM.KEY_FILE)
    const address = localStorage.getItem(STORAGE_ENUM.ADDRESS)

    let valid_flag = true
    let entity

    entity = await Entity._from_json_object(JSON.parse(key_file), password).catch(() => valid_flag = false)

    // check it creates correct address from decryption.
    if (!valid_flag || new Address(entity).toString() !== address) valid_flag = false
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