import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

//jest-environment-jsdom-global
//       "^.+\\.(js|jsx|mjs)$": "<rootDir>/node_modules/fetchai-ledger-api",

class App extends Component {

  render () {

    window.hello = 9

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save!!! to reload.
        </p>
      </div>
    )
  }
}

export default App
