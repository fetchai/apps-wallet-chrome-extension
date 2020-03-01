import React from 'react'
import  ReactDOM  from 'react-dom'
import Initial from '../views/initial'
import chrome from 'sinon-chrome';
import renderer from 'react-test-renderer'
import {render, cleanup, fireEvent, within} from '@testing-library/react'
import '@testing-library/jest-dom'
import Router, { clear } from '../services/router'
import Settings from '../views/settings'
import {
  click_button, ENCRYPTED_KEY_FILE,
  EXAMPLE_ADDRESS, EXAMPLE_ADDRESS_2,
  EXAMPLE_VALID_ADDRESS,
  form_write_value,
  STRONG_PASSWORD,
  WEAK_PASSWORD
} from './utils/helper'
import { Entity } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/entity'
import { Address } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/address'
jest.mock('fetchai-ledger-api/dist/fetchai/ledger/crypto/entity');
jest.mock('fetchai-ledger-api/dist/fetchai/ledger/crypto/address');
import { digest } from '../utils/digest'
import Create from '../views/create'
import { ADDRESS, KEY_FILE } from '../constants'

import flushPromises from 'flush-promises';


const PASSWORD_REQUIRED_ERROR_MESSAGE = 'Password required';
const NEW_PASSWORD_REQUIRED_ERROR_MESSAGE = 'New password required';
const INCORRECT_PASSWORD_ERROR_MESSAGE = 'Incorrect password';
const WEAK_PASSWORD_ERROR_MESSAGE = "Weak password: password requires 14 characters including a number and an uppercase, lowercase and special character";
const PASSWORD_NOT_CHANGED_ERROR_MESSAGE = 'New password equals current password';


function mockBasicChangePasswordEventHandlerMethods() {
  // we mock entity methods
  const mock_to_json_object = jest.fn();
  Entity.prototype._to_json_object = mock_to_json_object;
  mock_to_json_object.mockReturnValue(Promise.resolve(undefined));

  const mock_from_json_object = jest.fn();
  Entity._from_json_object = mock_from_json_object;
  mock_from_json_object.mockReturnValue(Promise.resolve(undefined));

  const mock_constructor = jest.fn();
  Address.constructor = mock_to_string;

  const mock_to_string = jest.fn();
  Address.prototype.toString = mock_to_string;
  mock_to_string.mockReturnValue(EXAMPLE_ADDRESS);


  jest.spyOn(Settings.prototype, 'wipe_form_errors').mockImplementation(() => {});
}


describe(':Settings', () => {

  beforeAll(() => {
    global.chrome = chrome;
  })

  afterEach(() => {
    cleanup();
    clear()
  })

  test.skip('initial renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Router><Settings/></Router>, div)
    ReactDOM.unmountComponentAtNode(div)
  })

  test.skip('test empty password field outputs password required error message', async () => {

    mockBasicChangePasswordEventHandlerMethods()
     const { getByTestId } = render(<Settings/>);
       const submit_button = getByTestId("settings_submit")
    await fireEvent(
      submit_button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))

    expect(getByTestId('settings_output')).toHaveTextContent(PASSWORD_REQUIRED_ERROR_MESSAGE)
  })


  test.skip('test empty new password field outputs new password required error message', async () => {

    localStorage.setItem(KEY_FILE, ENCRYPTED_KEY_FILE)
    localStorage.setItem(ADDRESS, EXAMPLE_ADDRESS)

    mockBasicChangePasswordEventHandlerMethods()
     const { getByTestId } = render(<Settings/>);


//todo get all error messages or most refactored to same test, but with different

       form_write_value(getByTestId, 'settings_password', STRONG_PASSWORD)
       const submit_button = getByTestId("settings_submit")
    debugger
    await fireEvent(
      submit_button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))
   // you have to flush promises to ensure we wait, since some mocks still async.
    await flushPromises();

    expect(getByTestId('settings_output')).toHaveTextContent(NEW_PASSWORD_REQUIRED_ERROR_MESSAGE)
  })


  test('test wrong password outputs wrong error message', async () => {

    localStorage.setItem(KEY_FILE, ENCRYPTED_KEY_FILE)
    localStorage.setItem(ADDRESS, EXAMPLE_ADDRESS_2)

    mockBasicChangePasswordEventHandlerMethods()
     const { getByTestId } = render(<Settings/>);
       form_write_value(getByTestId, 'settings_password', STRONG_PASSWORD)
       const submit_button = getByTestId("settings_submit")
    await fireEvent(
      submit_button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))
   // you have to flush promises to ensure we wait, since some mocks still async.
    await flushPromises();

    expect(getByTestId('settings_output')).toHaveTextContent(INCORRECT_PASSWORD_ERROR_MESSAGE)
  })


  test('test weak new  password outputs weak password error message', async () => {

    localStorage.setItem(KEY_FILE, ENCRYPTED_KEY_FILE)
    localStorage.setItem(ADDRESS, EXAMPLE_ADDRESS)

    mockBasicChangePasswordEventHandlerMethods()
     const { getByTestId } = render(<Settings/>);
       form_write_value(getByTestId, 'settings_password', STRONG_PASSWORD)
       form_write_value(getByTestId, 'settings_new_password', WEAK_PASSWORD)
       form_write_value(getByTestId, 'settings_new_password_confirm', WEAK_PASSWORD)
       const submit_button = getByTestId("settings_submit")
    await fireEvent(
      submit_button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))
   // you have to flush promises to ensure we wait, since some mocks still async.
    await flushPromises();

    expect(getByTestId('settings_output')).toHaveTextContent(WEAK_PASSWORD_ERROR_MESSAGE)
  })



})