import React from 'react'
import  ReactDOM  from 'react-dom'
 import chrome from 'sinon-chrome';
import renderer from 'react-test-renderer'
import {render, cleanup, fireEvent, within} from '@testing-library/react'
import '@testing-library/jest-dom'
import Router, { clear } from '../services/router'
import Create from '../views/create'
import  Storage from 'dom-storage'
//import { Entity } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/entity'


// beforeEach(() => {
//   // Clear all instances and calls to constructor and all methods:
//   SoundPlayer.mockClear();
// });

 // import { mockWindowProperty } from './utils/mockWindowProperty.js'

import { click_button, form_write_value, STRONG_PASSWORD, STRONG_PASSWORD_2, WEAK_PASSWORD } from './utils/helper'
import { Address } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/address'
import { Entity } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto/entity'
import  History  from '../views/history'
import Initial from '../views/initial'
import { digest } from '../utils/digest'
import { API } from '../services/api'


jest.mock('fetchai-ledger-api/dist/fetchai/ledger/crypto/entity');
jest.mock('../views/history');
jest.mock('../services/api');

const WEAK_PASSWORD_ERROR_MESSAGE = "Weak password: password requires 14 characters including a number and an uppercase, lowercase and special character"
const PASSWORDS_DONT_MATCH_ERROR_MESSAGE = "Passwords Don't Match"
const PASSWORD_REQUIRED_ERROR_MESSAGE = "Password required"



// global.localStorage = new Storage(null, { strict: true });
// global.sessionStorage = new Storage(null, { strict: true });

describe.skip(':Initial', () => {

  //  mockWindowProperty('localStorage', {
  //   setItem: jest.fn(),
  //   getItem: jest.fn(),
  //   removeItem: jest.fn(),
  // });
 beforeAll(() => {
    global.chrome = chrome;
  })
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

  test('correctly filled in form induces correct local storage updates', async () => {

// we mock entity
     const mock_to_json_object = jest.fn();
  Entity.prototype._to_json_object = mock_to_json_object;
  mock_to_json_object.mockReturnValue(Promise.resolve("expectedProduct"));


   const mock_public_key_bytes = jest.fn();
  Entity.prototype.public_key_bytes = mock_public_key_bytes;
  mock_public_key_bytes.mockReturnValue(digest("random"));



// mock out this network request, since we don't care about it.
const mock_fetchAnotherPageOfHistory = jest.fn();
  History.prototype.fetchAnotherPageOfHistory = mock_fetchAnotherPageOfHistory;
  mock_fetchAnotherPageOfHistory.mockReturnValue(Promise.resolve(undefined));


// mock out this network request also, since we don't care about it.
const mock_bootstrap = jest.fn();
  API.fromBootstrap = mock_bootstrap;
  mock_bootstrap.mockReturnValue(Promise.resolve(undefined));


    const { getByTestId, getAllByTestId } = render(<Router><Create/></Router>);
   form_write_value(getByTestId, 'create_password', STRONG_PASSWORD)
   form_write_value(getByTestId, 'create_password_confirm', STRONG_PASSWORD)
  // click_button(getByTestId, 'create_submit')


     const submit_button = getByTestId("create_submit")
    await fireEvent(
      submit_button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))


     // tests the account component is now mounted by router.
    const app = getAllByTestId('account')
    expect(app.length).toBe(1);
debugger
    debugger
  })

})