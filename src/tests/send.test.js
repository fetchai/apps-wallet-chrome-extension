import React from 'react'
import chrome from 'sinon-chrome'
import { cleanup, render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { clear } from '../services/router'
import Settings from '../views/settings'
import {
  click_button,
  ENCRYPTED_KEY_FILE,
  EXAMPLE_ADDRESS,
  EXAMPLE_ADDRESS_2,
  form_write_value,
  STRONG_PASSWORD_2,
  untilPromises,
  WEAK_PASSWORD
} from './utils/helper'
import { Entity } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/entity'
import { Address } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/address'
import * as fetchResource from '../utils/fetchRescource'
import { BOOTSTRAP_REQUEST_URI, DOLLAR_PRICE_URI, STORAGE_ENUM } from '../constants'
import Send from '../views/send'

jest.mock('fetchai-ledger-api/dist/fetchai/ledger/crypto/entity')
jest.genMockFromModule('fetchai-ledger-api/dist/fetchai/ledger/crypto/address')
jest.mock('fetchai-ledger-api/dist/fetchai/ledger/crypto/address')
//jest.mock('../utils/fetchRescource');

const INVALID_ADDRESS_ERROR_MESSAGE = 'Invalid address'
const INSUFFICIENT_FUNDS_ERROR_MESSAGE = 'Insufficient funds'
const INCORRECT_PASSWORD_ERROR_MESSAGE = 'Incorrect password'
const NETWORK_ERROR_MESSAGE = 'Network error'

function mockBasicChangePasswordEventHandlerMethods () {
  // we mock entity methods
  const mock_to_json_object = jest.fn()
  Entity.prototype._to_json_object = mock_to_json_object
  mock_to_json_object.mockReturnValue(Promise.resolve(undefined))

  const mock_from_json_object = jest.fn()
  Entity._from_json_object = mock_from_json_object
  mock_from_json_object.mockReturnValue(Promise.resolve(undefined))
  jest.spyOn(Settings.prototype, 'wipeFormErrors').mockImplementation(() => {})

  Address.mockImplementation((address) => { if (address === STRONG_PASSWORD_2) throw new Error()})

  jest.spyOn(fetchResource, 'fetchResource').mockImplementation((req) => {

    return new Promise((resolves) => {

//willbe refactored

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
    localStorage.setItem(STORAGE_ENUM.ADDRESS, EXAMPLE_ADDRESS)
    jest.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
    clear()
  })

  test.skip('test not being logged in redirects to login page', async () => {

  })

  test.skip('test clicking cancel button redirects to account page', async () => {

  })

  test('test invalid address on sending funds shows invalid address message', async () => {
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

  test('test invalid password on sending funds shows invalid password message', async () => {
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
    expect(getByTestId('amount_error_output')).toHaveTextContent(NETWORK_ERROR_MESSAGE)
    expect(getByTestId('password_error_output')).toHaveTextContent(INCORRECT_PASSWORD_ERROR_MESSAGE)
    expect(getByTestId('transfer_error_output')).toHaveTextContent('')
  })

  test('test insufficient funds on submit', async () => {
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
    expect(getByTestId('amount_error_output')).toHaveTextContent(NETWORK_ERROR_MESSAGE)
    expect(getByTestId('password_error_output')).toHaveTextContent(INCORRECT_PASSWORD_ERROR_MESSAGE)
    expect(getByTestId('transfer_error_output')).toHaveTextContent('')
  })

})