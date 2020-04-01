import React from 'react'
import chrome from 'sinon-chrome'
import { cleanup, fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Router, { clear } from '../services/router'
import Settings from '../views/settings'
import {
  click_button,
  ENCRYPTED_KEY_FILE,
  EXAMPLE_ADDRESS,
  EXAMPLE_ADDRESS_2,
  form_write_value, STRONG_PASSWORD,
  STRONG_PASSWORD_2, TX_DIGEST,
  untilPromises,
  WEAK_PASSWORD
} from './utils/helper'

import { Entity } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/entity'
import { Address } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/address'
import * as fetchResource from '../utils/fetchRescource'
import {
  BOOTSTRAP_REQUEST_URI,
  DOLLAR_PRICE_URI,
  LOCALHOST_ENUM,
  NETWORKS_ENUM as NETWORK_ENUM,
  STORAGE_ENUM
} from '../constants'

import Send from '../views/send'
import { API } from '../services/api'
import { mockAccountPageConstructor } from './utils/mockAccountPageConstructor'

jest.mock('fetchai-ledger-api/dist/fetchai/ledger/crypto/entity')
jest.genMockFromModule('fetchai-ledger-api/dist/fetchai/ledger/crypto/address')

const INVALID_ADDRESS_ERROR_MESSAGE = 'Invalid address'
const INCORRECT_PASSWORD_ERROR_MESSAGE = 'Incorrect password'
const TRANSFER_SUBMITTED = 'Transfer Submitted'
const TRANSFER_EXECUTED = 'Transfer Executed'

function mockBasicChangePasswordEventHandlerMethods () {
  // we mock entity methods
  const mock_to_json_object = jest.fn()
  Entity.prototype._to_json_object = mock_to_json_object
  mock_to_json_object.mockReturnValue(Promise.resolve(undefined))

  const mock_from_json_object = jest.fn()
  Entity._from_json_object = mock_from_json_object
  mock_from_json_object.mockReturnValue(Promise.resolve(EXAMPLE_ADDRESS))
  jest.spyOn(Settings.prototype, 'wipeFormErrors').mockImplementation(() => {})

  //todo refactor
  jest.spyOn(fetchResource, 'fetchResource').mockImplementation((req) => {
    return new Promise((resolves) => {
        if (req.includes(BOOTSTRAP_REQUEST_URI)) {
          return resolves({
            status: 200, json: () =>
              new Promise(resolves => {
                return resolves([{
                  address: 'http://localhost:8000'
                }])
              })
          })
        }

        if (req === DOLLAR_PRICE_URI) {
          return resolves({
            status: 200, json: () =>
              new Promise(resolves => {
                return resolves([{
                  percentage: '.5'
                }])
              })
          })
        }

        if (req === `${LOCALHOST_ENUM.PROTOCOL}://${LOCALHOST_ENUM.IP}:${LOCALHOST_ENUM.PORT}/api/contract/fetch/token/balance`) {
          return resolves({
            status: 200, json: () =>
              new Promise(resolves => {
                return resolves({
                  balance: "5000000000000"
                })
              })
          })
        }

      if (req === `${LOCALHOST_ENUM.PROTOCOL}://${LOCALHOST_ENUM.IP}:${LOCALHOST_ENUM.PORT}/api/contract/fetch/token/transfer`) {
          return resolves({
            status: 200, json: () =>
              new Promise(resolves => {
                return resolves({
                  tsx: TX_DIGEST
                })
              })
          })
        }

      if (req === `${LOCALHOST_ENUM.PROTOCOL}://${LOCALHOST_ENUM.IP}:${LOCALHOST_ENUM.PORT}/api/status/chain`) {
          return resolves({
            status: 200, json: () =>
              new Promise(resolves => {
                return resolves({
                 chain: [{"blockNumber":5}]
                })
              })
          })
        }

      if (req === `${LOCALHOST_ENUM.PROTOCOL}://${LOCALHOST_ENUM.IP}:${LOCALHOST_ENUM.PORT}/api/status/tx/${TX_DIGEST}`) {
          return resolves({
            status: 200, json: () =>
              new Promise(resolves => {
                return resolves({
                  status: "EXECUTED"
                })
              })
          })
        }



      }
    )
  })

}

describe(':Send', () => {

  beforeAll(() => {
    global.chrome = chrome
  })

  beforeEach(() => {
    global.chrome = chrome
    localStorage.setItem(STORAGE_ENUM.KEY_FILE, ENCRYPTED_KEY_FILE)
    localStorage.setItem(STORAGE_ENUM.LOGGED_IN, 'true')
    localStorage.setItem(STORAGE_ENUM.ADDRESS, EXAMPLE_ADDRESS)
    localStorage.setItem(STORAGE_ENUM.SELECTED_NETWORK, NETWORK_ENUM.LOCALHOST)
    jest.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
    clear()
  })



  test.skip('test clicking cancel button redirects to account page', async () => {

    mockAccountPageConstructor()

    const { getByTestId, getAllByTestId } = render(<Router><Send/></Router>)

    const submit_button = getByTestId('cancel_button')

    await fireEvent(
      submit_button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))

     await untilPromises()
    // tests the account component is now mounted by router.
    const app = getAllByTestId('account')
    expect(app.length).toBe(1)
  })

  test.skip('test clicking cross button redirects to account page', async () => {

    mockAccountPageConstructor()

    const { getByTestId, getAllByTestId } = render(<Router><Send/></Router>)

    const submit_button = getByTestId('cross_image')

    await fireEvent(
      submit_button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))

     await untilPromises()
    // tests the account component is now mounted by router.
    const app = getAllByTestId('account')
    expect(app.length).toBe(1)
  })

  test.skip('test invalid address on sending funds shows invalid address message', async () => {
    mockBasicChangePasswordEventHandlerMethods()

    const { getByTestId } = render(<Send/>)
    form_write_value(getByTestId, 'send_address', STRONG_PASSWORD_2)
    await click_button(getByTestId, 'send_submit')
    await untilPromises()

    expect(getByTestId('address_error_output')).toHaveTextContent(INVALID_ADDRESS_ERROR_MESSAGE)
    expect(getByTestId('amount_error_output')).toHaveTextContent('')
    expect(getByTestId('password_error_output')).toHaveTextContent(INCORRECT_PASSWORD_ERROR_MESSAGE)
    expect(getByTestId('transfer_error_output')).toHaveTextContent('')
  })

  test.skip('test invalid password on sending funds shows invalid password message', async () => {
    mockBasicChangePasswordEventHandlerMethods()

    const mock_to_string = jest.fn()
    Address.prototype.toString = mock_to_string
    mock_to_string
      .mockReturnValue(EXAMPLE_ADDRESS_2)

    const { getByTestId } = render(<Send/>)
    form_write_value(getByTestId, 'send_address', EXAMPLE_ADDRESS)
    form_write_value(getByTestId, 'send_password', WEAK_PASSWORD)

    await click_button(getByTestId, 'send_submit')
    await untilPromises()

    expect(getByTestId('address_error_output')).toHaveTextContent('')
    expect(getByTestId('amount_error_output')).toHaveTextContent('')
    expect(getByTestId('password_error_output')).toHaveTextContent(INCORRECT_PASSWORD_ERROR_MESSAGE)
    expect(getByTestId('transfer_error_output')).toHaveTextContent('')
  })

  test.skip('test insufficient funds on submit', async () => {
    mockBasicChangePasswordEventHandlerMethods()

    const mock_to_string = jest.fn()
    Address.prototype.toString = mock_to_string
    mock_to_string
      .mockReturnValue(EXAMPLE_ADDRESS_2)

    const { getByTestId } = render(<Send/>)
    form_write_value(getByTestId, 'send_address', EXAMPLE_ADDRESS)
    form_write_value(getByTestId, 'send_password', WEAK_PASSWORD)

    await click_button(getByTestId, 'send_submit')
    await untilPromises()

    expect(getByTestId('address_error_output')).toHaveTextContent('')
    expect(getByTestId('amount_error_output')).toHaveTextContent('')
    expect(getByTestId('password_error_output')).toHaveTextContent(INCORRECT_PASSWORD_ERROR_MESSAGE)
    expect(getByTestId('transfer_error_output')).toHaveTextContent('')
  })

  test.skip('test valid transfer shows transfer submitted message', async () => {
    mockBasicChangePasswordEventHandlerMethods()

    const mock_to_string = jest.fn()
    Address.prototype.toString = mock_to_string
    mock_to_string
      .mockReturnValue(EXAMPLE_ADDRESS)

    const { getByTestId } = render(<Send api={new API(LOCALHOST_ENUM.IP, LOCALHOST_ENUM.PORT, LOCALHOST_ENUM.PROTOCOL)}/>)
    form_write_value(getByTestId, 'send_address', EXAMPLE_ADDRESS)
    form_write_value(getByTestId, 'send_amount', 200)
    form_write_value(getByTestId, 'send_password', STRONG_PASSWORD)
    await untilPromises()
    await click_button(getByTestId, 'send_submit')
    await untilPromises()

    // all error fields should be empty
    expect(getByTestId('address_error_output')).toHaveTextContent('')
    expect(getByTestId('amount_error_output')).toHaveTextContent('')
    expect(getByTestId('password_error_output')).toHaveTextContent('')
    expect(getByTestId('transfer_error_output')).toHaveTextContent(TRANSFER_SUBMITTED)
  })


  test.skip('test valid transfer shows transfer Executed message', async () => {

    jest.useFakeTimers();
    mockBasicChangePasswordEventHandlerMethods()

    const mock_to_string = jest.fn()
    Address.prototype.toString = mock_to_string
    mock_to_string
      .mockReturnValue(EXAMPLE_ADDRESS)

    const { getByTestId } = render(<Send api={new API(LOCALHOST_ENUM.IP, LOCALHOST_ENUM.PORT, LOCALHOST_ENUM.PROTOCOL)}/>)
    form_write_value(getByTestId, 'send_address', EXAMPLE_ADDRESS)
    form_write_value(getByTestId, 'send_amount', 200)
    form_write_value(getByTestId, 'send_password', STRONG_PASSWORD)

    await untilPromises()
    await click_button(getByTestId, 'send_submit')
    await untilPromises()
    jest.advanceTimersByTime(300);
    await untilPromises()

    // all error fields should be empty
    expect(getByTestId('address_error_output')).toHaveTextContent('')
    expect(getByTestId('amount_error_output')).toHaveTextContent('')
    expect(getByTestId('password_error_output')).toHaveTextContent('')
    expect(getByTestId('transfer_error_output')).toHaveTextContent(TRANSFER_EXECUTED)
  })


})