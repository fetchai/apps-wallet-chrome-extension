import React from 'react'
import  ReactDOM  from 'react-dom'
// import chrome from 'sinon-chrome';
import renderer from 'react-test-renderer'
import {render, cleanup, fireEvent, within} from '@testing-library/react'
import '@testing-library/jest-dom'
import Router, { clear } from '../services/router'
import Create from '../views/create'
import  Storage from 'dom-storage'

 // import { mockWindowProperty } from './utils/mockWindowProperty.js'

import { STRONG_PASSWORD, STRONG_PASSWORD_2, WEAK_PASSWORD } from './utils/helper'
import { Address } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/address'
import { Entity } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/entity'

const WEAK_PASSWORD_ERROR_MESSAGE = "Weak password: password requires 14 characters including a number and an uppercase, lowercase and special character"
const PASSWORDS_DONT_MATCH_ERROR_MESSAGE = "Passwords Don't Match"
const PASSWORD_REQUIRED_ERROR_MESSAGE = "Password required"

const form_write_value = (getByTestId, test_id, value ) => {
   // add a password
    const password_input = getByTestId(test_id)
    fireEvent.change(
      password_input,
      { target: { value: value } }
    )
}

const click_button = (getByTestId, test_id) => {
      const submit_button = getByTestId(test_id)
    fireEvent(
      submit_button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))
}

global.localStorage = new Storage(null, { strict: true });
global.sessionStorage = new Storage(null, { strict: true });

describe(':Initial', () => {

  //  mockWindowProperty('localStorage', {
  //   setItem: jest.fn(),
  //   getItem: jest.fn(),
  //   removeItem: jest.fn(),
  // });

  beforeEach(() => {
  // values stored in tests will also be available in other tests unless you run
  // localStorage.clear();
  // // or directly reset the storage
  // localStorage.__STORE__ = {};
  // you could also reset all mocks, but this could impact your other mocks
  // jest.resetAllMocks();
  // or individually reset a mock used
  // localStorage.setItem.mockClear();
});
  // beforeAll(() => {
  //   global.chrome = chrome;
  // })

  afterEach(() => {
    cleanup();
    clear()
  })
  //
  // test('Create renders without crashing', () => {
  //   const div = document.createElement('div')
  //   ReactDOM.render(<Create/>, div)
  //   ReactDOM.unmountComponentAtNode(div)
  // })
  //
  // test('initial snapshot test', () => {
  //   const component = renderer.create(<Create/>);
  //   let tree = component.toJSON();
  //   expect(tree).toMatchSnapshot();
  // })
  //
  // test('test empty password field outputs password required error message', () => {
  //   const { getByTestId } = render(<Create/>);
  //  form_write_value(getByTestId, 'create_password', "")
  //  click_button(getByTestId, 'create_submit')
  //   expect(getByTestId('create_output')).toHaveTextContent(PASSWORD_REQUIRED_ERROR_MESSAGE)
  // })
  //
  // test('test weak password shows weak password error message', () => {
  //   const { getByTestId } = render(<Create/>);
  //  form_write_value(getByTestId, 'create_password', WEAK_PASSWORD)
  //  click_button(getByTestId, 'create_submit')
  //   expect(getByTestId('create_output')).toHaveTextContent(WEAK_PASSWORD_ERROR_MESSAGE)
  // })
  //
  // test('test not matching passwords outputs not matching passwords error message', () => {
  //   const { getByTestId } = render(<Create/>);
  //  form_write_value(getByTestId, 'create_password', STRONG_PASSWORD )
  //  form_write_value(getByTestId, 'create_password_confirm',STRONG_PASSWORD_2 )
  //  click_button(getByTestId, 'create_submit')
  //   expect(getByTestId('create_output')).toHaveTextContent(PASSWORDS_DONT_MATCH_ERROR_MESSAGE)
  // })
  //
  // // test('test clicking on form with error message removes class responsible for red highlighting', () => {
  // //
  // // })
  //
  // test('test multiple incorrect form submissions overwrites form error message', () => {
  //   const { getByTestId } = render(<Create/>);
  //   // initially we give it a not matching one
  //  form_write_value(getByTestId, 'create_password', STRONG_PASSWORD )
  //  form_write_value(getByTestId, 'create_password_confirm',STRONG_PASSWORD_2 )
  //  click_button(getByTestId, 'create_submit')
  //   expect(getByTestId('create_output')).toHaveTextContent(PASSWORDS_DONT_MATCH_ERROR_MESSAGE)
  //
  //   // then secondly we give no password
  //  form_write_value(getByTestId, 'create_password', "")
  //  click_button(getByTestId, 'create_submit')
  //   expect(getByTestId('create_output')).toHaveTextContent(PASSWORD_REQUIRED_ERROR_MESSAGE)
  // })

  test('correctly filled in form induces correct local storage updates', () => {
   // expect(window.localStorage.setItem).toHaveBeenCalledWith('abc');
   // localStorage.clear()
    const { getByTestId } = render(<Create/>);
   form_write_value(getByTestId, 'create_password', STRONG_PASSWORD)
   form_write_value(getByTestId, 'create_password_confirm', STRONG_PASSWORD)
    debugger
   click_button(getByTestId, 'create_submit')

    // all three values should be in local storage
   // const key_file = localStorage.getItem('key_file')
   // const key_file = localStorage.__STORE__['key_file']
   //      console.log("key_file : " + key_file)
   //  const stored_address =  localStorage.__STORE__['address']
   // // const stored_address =  localStorage.getItem('address')
   //  console.log("stored_address : " + stored_address)
   //  // const logged_in = localStorage.getItem('logged_in')
   //  const logged_in = localStorage.__STORE__['logged_in']

    // expect(Boolean(JSON.parse(logged_in))).toBe(true)

    //lets we further check we can use password to decrypt to correct address
    // const recreated_entity = Entity._from_json_object(JSON.parse(key_file), STRONG_PASSWORD)

    // const recreated_address = new Address(recreated_entity).toString()
    // this was restored using strong_password furthermore verifying the encryption/decryption.
    //  expect(recreated_address).toBe(stored_address)

  })

  test('matching strong password submited causes correct local storage updates', () => {
    const { getByTestId } = render(<Create/>);
   form_write_value(getByTestId, 'create_password', STRONG_PASSWORD )
   form_write_value(getByTestId, 'create_password_confirm', "1_NOT_MATCHING_STRONG_PASSWORD" )
   click_button(getByTestId, 'create_submit')
  })


})