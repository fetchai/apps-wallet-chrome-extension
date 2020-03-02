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
import Settings from './views/settings'
import Create from './views/create'

class Main extends React.Component {
  render () {
    let opening_page
// browser uses this.
    if (Authentication.isLoggedIn()) {
      // if (true) {
      opening_page = <Settings/>
    } else if (Authentication.hasSavedKey()) {
      opening_page = <Create/>
    } else {
      opening_page = <Create/>
    }
    return (<Router>{opening_page}</Router>)
  }
}

const app = document.createElement('div')
app.id = 'my-extension-root'

document.body.appendChild(app)
ReactDOM.render(<Main/>, app)