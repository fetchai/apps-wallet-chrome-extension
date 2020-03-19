/*global chrome*/
import React from 'react'
import ReactDOM from 'react-dom'
import './content.css'
import './index.css'
import Router from './services/router'
import Authentication from './services/authentication'
import Login from './views/login'
import Account from './views/account'
import Initial from './views/initial'
import { STORAGE_ENUM } from './constants'

class Main extends React.Component {



  render () {
    // let logged_in, key_file;
    //
    //  chrome.storage.sync.get(STORAGE_ENUM.LOGGED_IN, result => {
    //          if(typeof result[STORAGE_ENUM.LOGGED_IN] === "undefined") logged_in = false;
    //          else logged_in = Boolean(JSON.parse(logged_in))
    //
    //     chrome.storage.sync.get(STORAGE_ENUM.KEY_FILE, result => {
    //          if(typeof result[STORAGE_ENUM.KEY_FILE] === "undefined") key_file = false;
    //          else key_file = Boolean(JSON.parse(logged_in))
    //     })
    //  })

// browser uses this.
//     if (await Authentication.isLoggedIn()) {
// //        if (true) {
//       // eslint-disable-next-line react/jsx-no-undef
//       opening_page = <Account/>
//     } else if (Authentication.hasSavedKey()) {
//       opening_page = <Login/>
//     } else {
//       opening_page = <Initial/>
//     }

     const opening_page = <Initial/>
    return (<Router>{opening_page}</Router>)
  }
}

const app = document.createElement('div')
app.id = 'my-extension-root'

// document.body.appendChild(app)
// ReactDOM.render(<Main/>, app)