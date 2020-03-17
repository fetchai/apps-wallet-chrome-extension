import React from 'react'
import ReactDOM from 'react-dom'
import chrome from 'sinon-chrome'
import { cleanup, render, wait } from '@testing-library/react'
import '@testing-library/jest-dom'
import Router, { clear } from '../services/router'
import { mockAccountPageConstructor } from './utils/mockAccountPageConstructor'
import Download from '../views/download'
import { KEY_FILE_NAME, MAINNET_BLOCKEXPLORER, NETWORKS_ENUM, STORAGE_ENUM, TESTNET_BLOCKEXPLORER } from '../constants'
import { click_button, ENCRYPTED_KEY_FILE, EXAMPLE_ADDRESS, untilPromises } from './utils/helper'

window.URL.createObjectURL = jest.fn();

describe(':download', () => {

  beforeAll(() => {
    global.chrome = chrome
    localStorage.setItem(STORAGE_ENUM.ADDRESS, EXAMPLE_ADDRESS)
    localStorage.setItem(STORAGE_ENUM.SELECTED_NETWORK, NETWORKS_ENUM.LOCALHOST)
    localStorage.setItem(STORAGE_ENUM.KEY_FILE, ENCRYPTED_KEY_FILE)
    localStorage.setItem(STORAGE_ENUM.LOGGED_IN, 'true')
  })

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
    clear()
  })

   test('Create renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Download/>, div)
    ReactDOM.unmountComponentAtNode(div)
  })


   test('test clicking cross returns user to account page', async () => {
    mockAccountPageConstructor()
    const { getByTestId, getAllByTestId } = render(<Router><Download/></Router>)
      await click_button(getByTestId, 'cross')
     await wait(() => {
      const app = getAllByTestId('account')
      expect(app.length).toBe(1)
    })
   })

  
  test('check mainnet blockexplorer link rendered when attached to mainnet', async () => {
       localStorage.setItem(STORAGE_ENUM.SELECTED_NETWORK, NETWORKS_ENUM.MAINNET)
     const { getByTestId } = render(<Router><Download/></Router>)
    const expected = MAINNET_BLOCKEXPLORER  +  'accounts/' + EXAMPLE_ADDRESS;
      const el =  getByTestId("block_explorer_url")
     expect(el.href).toBe(expected)
   })
  
  
  test('check testnet blockexplorer link rendered when attached to testnet', () => {
      localStorage.setItem(STORAGE_ENUM.SELECTED_NETWORK, NETWORKS_ENUM.TESTNET)
      const { getByTestId } = render(<Router><Download/></Router>)
      const expected = TESTNET_BLOCKEXPLORER  +  'accounts/' + EXAMPLE_ADDRESS;
      const el =  getByTestId("block_explorer_url")
      expect(el.href).toBe(expected)
   })

   test('test key file download', async () => {
      const { getByTestId } = render(<Router><Download/></Router>)
     const link = {
      click: jest.fn()
    };
    const createElement_spy = jest.spyOn(document, "createElement").mockImplementation(() => link);
    const createObjectURL_spy = jest.spyOn(URL, "createObjectURL").mockImplementation(() => new Blob());
    const appendChild_spy =  jest.spyOn(document.body, "appendChild").mockImplementation(() => {});
    await click_button(getByTestId, 'download_button')
    await untilPromises()
    expect(link.download).toBe(KEY_FILE_NAME);
    expect(link.href).toBeInstanceOf(Blob);
    createElement_spy.mockRestore();
    createObjectURL_spy.mockRestore();
    appendChild_spy.mockRestore();
   })
})