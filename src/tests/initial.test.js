import React from 'react'
import  ReactDOM  from 'react-dom'
import Initial from '../views/initial'
import chrome from 'sinon-chrome';
import renderer from 'react-test-renderer'
import {render, cleanup, fireEvent, within} from '@testing-library/react'
import '@testing-library/jest-dom'
import Router, { clear } from '../services/router'

describe.skip(':Initial', () => {

  beforeAll(() => {
    global.chrome = chrome;
  })

  afterEach(() => {
    cleanup();
    clear()
  })

  //
  // test('initial renders without crashing', () => {
  //   const div = document.createElement('div')
  //   ReactDOM.render(<Router><Initial/></Router>, div)
  //   debugger
  //   ReactDOM.unmountComponentAtNode(div)
  // })
  //


  test.skip('initial renders without crashing', () => {
   const container = render(<Initial />)
  expect(container).toMatchSnapshot()
  })

  test.skip('initial snapshot test', () => {
    const component = renderer.create(<Initial/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })

  test(' create button renders correctly', () => {
    const { getByTestId } = render(<Initial/>);
    const appHeader = getByTestId('recover_button')
  })

  test('recover button renders correctly', () => {
    const { getByTestId } = render(<Initial/>);
    const button = getByTestId('recover_button')
    expect(button).toHaveTextContent("Recover")
  })

  test('clicking on recover button redirects to recover component', () => {
    const { getByTestId, getAllByTestId } = render(<Router><Initial/></Router>);
    const button = getByTestId('recover_button')
    fireEvent(
      button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))
    // tests the recover component is now mounted by router.
    const app = getAllByTestId('recover')
    expect(app.length).toBe(1);
  })

  test('clicking on create button redirects to create component', () => {
    const { getByTestId, getAllByTestId } = render(<Router><Initial/></Router>);
    const button = getByTestId('create_button')

    fireEvent(
      button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))

    // tests the create component is now mounted.
    const app = getAllByTestId('create')
    expect(app.length).toBe(1);
  })

  test.skip('try test redirection in oncomponent mount', () => {
  localStorage.setItem("x", "y")
  const x = localStorage.getItem("x")
    console.log(" x is about : " + x)
  })

})



