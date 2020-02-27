import React from 'react'
import ReactDOM from 'react-dom'
import Initial from '../views/initial'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Initial/>, div)
  ReactDOM.unmountComponentAtNode(div)
})
