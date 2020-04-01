import React from 'react'
import ReactDOM from 'react-dom'
import chrome from 'sinon-chrome'
import renderer from 'react-test-renderer'
import { cleanup, fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Router, { clear } from '../services/router'
import Create from '../views/create'
import {
  click_button,
  form_write_value,
  STRONG_PASSWORD,
  STRONG_PASSWORD_2,
  untilPromises,
  WEAK_PASSWORD
} from './utils/helper'

import { mockAccountPageConstructor } from './utils/mockAccountPageConstructor'

const WEAK_PASSWORD_ERROR_MESSAGE = 'Weak password: password requires 14 characters including a number and an uppercase, lowercase and special character'
const PASSWORDS_DONT_MATCH_ERROR_MESSAGE = 'Passwords Don\'t Match'
const PASSWORD_REQUIRED_ERROR_MESSAGE = 'Password required'

describe.skip(':Initial', () => {

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
    ReactDOM.render(<Create/>, div)
    ReactDOM.unmountComponentAtNode(div)
  })

  test.skip('initial snapshot test', () => {
    const component = renderer.create(<Create/>)
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('test empty password field outputs password required error message', () => {
    const { getByTestId } = render(<Create/>)
    form_write_value(getByTestId, 'create_password', '')
    click_button(getByTestId, 'create_submit')
    expect(getByTestId('create_output')).toHaveTextContent(PASSWORD_REQUIRED_ERROR_MESSAGE)
  })

  test('test weak password shows weak password error message', () => {
    const { getByTestId } = render(<Create/>)
    form_write_value(getByTestId, 'create_password', WEAK_PASSWORD)
    click_button(getByTestId, 'create_submit')
    expect(getByTestId('create_output')).toHaveTextContent(WEAK_PASSWORD_ERROR_MESSAGE)
  })

  test('test not matching passwords outputs not matching passwords error message', async () => {
    const { getByTestId } = render(<Create/>)
    form_write_value(getByTestId, 'create_password', STRONG_PASSWORD)
    form_write_value(getByTestId, 'create_password_confirm', STRONG_PASSWORD_2)

    await click_button(getByTestId, 'create_submit')
    expect(getByTestId('create_output')).toHaveTextContent(PASSWORDS_DONT_MATCH_ERROR_MESSAGE)
  })

  test('test multiple incorrect form submissions overwrites form error message', () => {
    const { getByTestId } = render(<Create/>)
    // initially we give it a not matching one
    form_write_value(getByTestId, 'create_password', STRONG_PASSWORD)
    form_write_value(getByTestId, 'create_password_confirm', STRONG_PASSWORD_2)
    click_button(getByTestId, 'create_submit')
    expect(getByTestId('create_output')).toHaveTextContent(PASSWORDS_DONT_MATCH_ERROR_MESSAGE)
    // then secondly we give no password
    form_write_value(getByTestId, 'create_password', '')
    click_button(getByTestId, 'create_submit')
    expect(getByTestId('create_output')).toHaveTextContent(PASSWORD_REQUIRED_ERROR_MESSAGE)
  })

  test('correctly filled in and submitted form creates account and redirects to accounts page', async () => {

    mockAccountPageConstructor()
    const { getByTestId, getAllByTestId } = render(<Router><Create/></Router>)
    form_write_value(getByTestId, 'create_password', STRONG_PASSWORD)
    form_write_value(getByTestId, 'create_password_confirm', STRONG_PASSWORD)

    const submit_button = getByTestId('create_submit')

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

})