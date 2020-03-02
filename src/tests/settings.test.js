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
  form_write_value,
  STRONG_PASSWORD, untilPromises,
  WEAK_PASSWORD
} from './utils/helper'
import { Entity } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/entity'
import { Address } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/address'
jest.mock('fetchai-ledger-api/dist/fetchai/ledger/crypto/entity');
jest.mock('fetchai-ledger-api/dist/fetchai/ledger/crypto/address');
import { ADDRESS, KEY_FILE } from '../constants'
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
  jest.spyOn(Settings.prototype, 'wipe_form_errors').mockImplementation(() => {});
}


describe(':Settings', () => {

  beforeAll(() => {
    global.chrome = chrome;
  })

  beforeEach(() => {
    global.chrome = chrome;
    localStorage.setItem(KEY_FILE, ENCRYPTED_KEY_FILE)
    localStorage.setItem(ADDRESS, EXAMPLE_ADDRESS)
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



  test.skip('initial renders without crashing', () => {
   const { getByTestId } = render(<Router><Settings/></Router>);

   expect(getByTestId('background')).toHaveStyle(`background-image: url(${props.image})`)


  })

  test('test empty password field outputs password required error message', async () => {

    mockBasicChangePasswordEventHandlerMethods()
     const { getByTestId } = render(<Settings/>);
        await click_button(getByTestId, "settings_submit")

    expect(getByTestId('settings_output')).toHaveTextContent(PASSWORD_REQUIRED_ERROR_MESSAGE)
  })


  test('test empty new password field outputs new password required error message', async () => {
    mockBasicChangePasswordEventHandlerMethods()
  const mock_to_string = jest.fn();
  Address.prototype.toString = mock_to_string;
  mock_to_string
   .mockReturnValue(EXAMPLE_ADDRESS)

     const { getByTestId } = render(<Settings/>);

       form_write_value(getByTestId, 'settings_password', STRONG_PASSWORD)
        await click_button(getByTestId, "settings_submit")
    await untilPromises()

    expect(getByTestId('settings_output')).toHaveTextContent(NEW_PASSWORD_REQUIRED_ERROR_MESSAGE)
  })


  test('test wrong password outputs wrong error message', async () => {

    mockBasicChangePasswordEventHandlerMethods()

    const mock_to_string = jest.fn();
  Address.prototype.toString = mock_to_string;
  mock_to_string
   .mockReturnValue(EXAMPLE_ADDRESS_2)

     const { getByTestId } = render(<Settings/>);
       form_write_value(getByTestId, 'settings_password', STRONG_PASSWORD)
        await click_button(getByTestId, "settings_submit")
   await untilPromises()
    expect(getByTestId('settings_output')).toHaveTextContent(INCORRECT_PASSWORD_ERROR_MESSAGE)
  })

  test('test weak new  password outputs weak password error message', async () => {

    mockBasicChangePasswordEventHandlerMethods()

      const mock_to_string = jest.fn();
  Address.prototype.toString = mock_to_string;
  mock_to_string
   .mockReturnValueOnce(EXAMPLE_ADDRESS)
   .mockReturnValueOnce(EXAMPLE_ADDRESS_2)

     const { getByTestId } = render(<Settings/>);
       form_write_value(getByTestId, 'settings_password', STRONG_PASSWORD)
       form_write_value(getByTestId, 'settings_new_password', WEAK_PASSWORD)
       form_write_value(getByTestId, 'settings_new_password_confirm', WEAK_PASSWORD)
        await click_button(getByTestId, "settings_submit")
  await untilPromises()
    expect(getByTestId('settings_output')).toHaveTextContent(WEAK_PASSWORD_ERROR_MESSAGE)
  })


  test('test weak new  password outputs weak password error message', async () => {
    mockBasicChangePasswordEventHandlerMethods()
  const mock_to_string = jest.fn();
  Address.prototype.toString = mock_to_string;
  mock_to_string
   .mockReturnValueOnce(EXAMPLE_ADDRESS)
  .mockReturnValueOnce(EXAMPLE_ADDRESS_2)

     const { getByTestId } = render(<Settings/>);
       form_write_value(getByTestId, 'settings_password', STRONG_PASSWORD)
       form_write_value(getByTestId, 'settings_new_password', WEAK_PASSWORD)
       form_write_value(getByTestId, 'settings_new_password_confirm', WEAK_PASSWORD)
   await click_button(getByTestId, "settings_submit")
  await untilPromises()
    expect(getByTestId('settings_output')).toHaveTextContent(WEAK_PASSWORD_ERROR_MESSAGE)
  })

  test('test password not changed error message', async () => {
    mockBasicChangePasswordEventHandlerMethods()
  const mock_to_string = jest.fn();
  Address.prototype.toString = mock_to_string;
  mock_to_string
   .mockReturnValueOnce(EXAMPLE_ADDRESS)
  .mockReturnValueOnce(EXAMPLE_ADDRESS)

     const { getByTestId } = render(<Settings/>);
       form_write_value(getByTestId, 'settings_password', STRONG_PASSWORD)
       form_write_value(getByTestId, 'settings_new_password', STRONG_PASSWORD)
       form_write_value(getByTestId, 'settings_new_password_confirm', STRONG_PASSWORD)
   await click_button(getByTestId, "settings_submit")
   await untilPromises()
    expect(getByTestId('settings_output')).toHaveTextContent(PASSWORD_NOT_CHANGED_ERROR_MESSAGE)
  })





})