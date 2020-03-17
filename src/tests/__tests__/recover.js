import React from 'react'
import ReactDOM from 'react-dom'
import chrome from 'sinon-chrome'
import { cleanup, fireEvent, render, wait } from '@testing-library/react'
import '@testing-library/jest-dom'
import Router, { clear } from '../../services/router'
import {
  click_button,
  form_write_value,
  STRONG_PASSWORD,
  untilPromises,
  WEAK_PASSWORD
} from './../utils/helper'

import Recover from '../../views/recover'
import {
  ENCRYPTED_KEY_FILE,
  EXAMPLE_ADDRESS,
  EXAMPLE_INVALID_ADDRESS,
  INVALID_ENCRYPTED_KEY_FILE
} from '../utils/helper'
import { mockAccountPageConstructor } from '../utils/mockAccountPageConstructor'

const FILE_REQUIRED_ERROR_MESSAGE = "File required";
const INCORRECT_PASSWORD_OR_ADDRESS_ERROR_MESSAGE = 'Incorrect Password or Address';
const UNDECRYPTABLE_ERROR_MESSAGE = 'Unable to decrypt';
const INVALID_ADDRESS_ERROR_MESSAGE = 'Invalid address';
const INCORRECT_FILE_TYPE_ERROR_MESSAGE = 'Incorrect file type';
const PASSWORD_REQUIRED_ERROR_MESSAGE = 'Password required';
const FILE_NAME = 'chucknorris.png'
const NON_JSON_FILE_CONTENTS = '(⌐□_□)';
const UNREADABLE_FILE_ERROR_MESSAGE = 'Unable to read file';
const WEAK_PASSWORD_ERROR_MESSAGE = 'Incorrect Password: Password too weak (14 chars including letter, number, special character and uppercase letter';

const add_file = (getByTestId, contents, name) => {
const file = new File([contents], name, { type: 'image/png', })
  const inputEl = getByTestId('file_input')
  //https://github.com/kentcdodds/react-testing-library-examples/pull/1/files
  Object.defineProperty(inputEl, 'files', {
    value: [file],
  })

  fireEvent.change(inputEl)
}


const submit_form = async ({getByTestId, file_name = null, file_contents = null, password = null, address = null }) => {

  if(file_name !== null || file_contents !== null) {
    await add_file(getByTestId, file_contents || file_name)
  }

  if(password !== null){
    await form_write_value(getByTestId, 'password_input', password)
  }

  if(address !== null){
      await form_write_value(getByTestId, 'address_input', EXAMPLE_INVALID_ADDRESS)
  }
 await untilPromises()
 await click_button(getByTestId, 'upload_button')
}

describe(':Recover', () => {

  beforeAll(() => {
    global.chrome = chrome
  })

  beforeEach(() => {
     jest.resetAllMocks();
     jest.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
    clear()
  })

  test.skip('Create renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Recover/>, div)
    ReactDOM.unmountComponentAtNode(div)
  })

  test.skip('test initially does not show warning div', () => {
    const { getByTestId, } = render(<Router><Recover/></Router>)
    expect(getByTestId("warning_container")).not.toBeVisible()
  })

  test.skip('test back button redirects to terms', async () => {
    const { getByTestId, getAllByTestId } = render(<Router><Recover/></Router>)
    await click_button(getByTestId, 'back_button')
    // tests the account component is now mounted by router.
    const app = getAllByTestId('terms')
    expect(app.length).toBe(1)
  })

  test.skip('test empty upload form shows file required error message', async () => {
    const { getByTestId, } = render(<Recover/>)
    await click_button(getByTestId, 'upload_button')
    // tests the account component is now mounted by router.
      await untilPromises()
    expect(getByTestId('output_error')).toHaveTextContent(FILE_REQUIRED_ERROR_MESSAGE)
  })


  test.skip('test non json file type shows incorrect file type error message', async () => {
    const { getByTestId } = render(<Router><Recover/></Router>)
    await submit_form({getByTestId: getByTestId, file_name: FILE_NAME, file_contents: NON_JSON_FILE_CONTENTS, password: STRONG_PASSWORD})
    await untilPromises()
   // wait for appearance
    await wait(() => {
   expect(getByTestId('output_error')).toHaveTextContent(INCORRECT_FILE_TYPE_ERROR_MESSAGE)
  })
  })

  test('key file that cannot be decrypted by javascript api in otherwise valid form shows correct error message', async () => {
    const { getByTestId } = render(<Router><Recover/></Router>)
    await submit_form({getByTestId: getByTestId, file_name: FILE_NAME, file_contents: INVALID_ENCRYPTED_KEY_FILE, password: STRONG_PASSWORD})
    await untilPromises()
    await wait(() => {
   expect(getByTestId('output_error')).toHaveTextContent(UNDECRYPTABLE_ERROR_MESSAGE)
  })
  })

  test.skip('test invalid address shows invalid address error message', async () => {
    //todo reimplement valid address test
    const { getByTestId  } = render(<Router><Recover/></Router>)
    await submit_form({getByTestId: getByTestId, file_name: FILE_NAME, file_contents: ENCRYPTED_KEY_FILE, password: STRONG_PASSWORD, address: EXAMPLE_INVALID_ADDRESS})
    await untilPromises()
    await wait(() => {
   expect(getByTestId('output_error')).toHaveTextContent(INVALID_ADDRESS_ERROR_MESSAGE)
  })
  })

  test.skip('test file reader onerror shows correct error message', async () => {
    const { getByTestId, } = render(<Router><Recover/></Router>)
   const spy = jest.spyOn(FileReader.prototype, 'readAsText').mockImplementation(function(){
       this.onerror()
      })

     await submit_form({getByTestId: getByTestId, file_name: FILE_NAME, file_contents: ENCRYPTED_KEY_FILE, password: STRONG_PASSWORD, address: EXAMPLE_INVALID_ADDRESS})
    spy.mockClear()
      // wait for appearance
  await wait(() => {
   expect(getByTestId('output_error')).toHaveTextContent(UNREADABLE_FILE_ERROR_MESSAGE)
  })

spy.mockRestore();
  })

  test.skip('test file decrypts to wrong address shows correct error message', async () => {
    const { getByTestId } = render(<Router><Recover/></Router>)
      await submit_form({getByTestId: getByTestId, file_name: FILE_NAME, file_contents: ENCRYPTED_KEY_FILE, password: STRONG_PASSWORD, address: EXAMPLE_ADDRESS})
   await untilPromises()
      // wait for appearance
  await wait(() => {
   expect(getByTestId('output_error')).toHaveTextContent(INCORRECT_PASSWORD_OR_ADDRESS_ERROR_MESSAGE)
  })
  })

  test.skip('test weak password shows weak password error message', async () => {
 const { getByTestId } = render(<Router><Recover/></Router>)
   await submit_form({getByTestId: getByTestId, file_name: FILE_NAME, file_contents: ENCRYPTED_KEY_FILE, password: WEAK_PASSWORD, address: EXAMPLE_ADDRESS})
   await untilPromises()
      // wait for appearance
  await wait(() => {
   expect(getByTestId('output_error')).toHaveTextContent(INCORRECT_PASSWORD_OR_ADDRESS_ERROR_MESSAGE)
  })
  })

  test.skip('test submitting otherwise valid file and strong password but without providing your address shows you warning', async () => {
    const { getByTestId } = render(<Router><Recover/></Router>)
    await submit_form({getByTestId: getByTestId, file_name: FILE_NAME, file_contents: ENCRYPTED_KEY_FILE, password: STRONG_PASSWORD})
    await untilPromises()
      // wait for appearance
     await wait(async () => {
    // the warning container with warning message is shown
      expect(getByTestId("warning_container")).toBeVisible()
  })
  })

  test.skip('test no password in otherwise valid form shows password required error message', async () => {
    const { getByTestId } = render(<Router><Recover/></Router>)
    await submit_form({getByTestId: getByTestId, file_name: FILE_NAME, file_contents: ENCRYPTED_KEY_FILE, password: ""})
    await untilPromises()
    expect(getByTestId('output_error')).toHaveTextContent(PASSWORD_REQUIRED_ERROR_MESSAGE)
  })

  test.skip('test weak password in otherwise valid form shows weak password error message', async () => {
    const { getByTestId } = render(<Router><Recover/></Router>)
    await submit_form({getByTestId: getByTestId, file_name: FILE_NAME, file_contents: ENCRYPTED_KEY_FILE, password: WEAK_PASSWORD})
    await untilPromises()
     expect(getByTestId('output_error')).toHaveTextContent(WEAK_PASSWORD_ERROR_MESSAGE)
  })


  test.skip('test submitting otherwise valid file and strong password but without providing your address shows you warning', async () => {
    mockAccountPageConstructor()
    const { getByTestId, getAllByTestId } = render(<Router><Recover/></Router>)
    await submit_form({getByTestId: getByTestId, file_name: FILE_NAME, file_contents: ENCRYPTED_KEY_FILE, password: STRONG_PASSWORD})
    await untilPromises()
    await click_button(getByTestId, 'next_button')
    await untilPromises()
    await wait(async () => {
     // tests the account component is now mounted by router.
    const app = getAllByTestId('account')
    expect(app.length).toBe(1)
  })
  })


  test.skip('test back button on warning message shows you form again', async () => {
   const { getByTestId, getAllByTestId } = render(<Router><Recover/></Router>)
    await submit_form({getByTestId: getByTestId, file_name: FILE_NAME, file_contents: ENCRYPTED_KEY_FILE, password: STRONG_PASSWORD})
    await untilPromises()
    await click_button(getByTestId, 'second_back_button')
    await untilPromises()
    await wait(async () => {
     // tests the account component is now mounted by router.
    const app = getAllByTestId('recover')
    expect(app.length).toBe(1)
  })  })

  test.skip('test file decrypts to correct address logs in and redirects to accounts page', async () => {
    mockAccountPageConstructor()
    const { getByTestId, getAllByTestId } = render(<Router><Recover/></Router>)
    const CORRECT_ADDRESS = "AXPMC2wMWr3tjDBuSXi4FEsn8YU2ysMASZMpk7qTEBthWwSwn";

   add_file(getByTestId, ENCRYPTED_KEY_FILE, FILE_NAME)
   await form_write_value(getByTestId, 'password_input', STRONG_PASSWORD)
   await form_write_value(getByTestId, 'address_input', CORRECT_ADDRESS)
   await click_button(getByTestId, 'upload_button')
   await untilPromises()
    // tests the account component is now mounted by router.
   await wait(() => {
      const app = getAllByTestId('account')
      expect(app.length).toBe(1)
    })
  })


})