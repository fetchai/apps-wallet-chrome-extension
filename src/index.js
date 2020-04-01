/*global chrome*/
import React from 'react'
import './content.css'
import './index.css'
import Router from './services/router'
import Initial from './views/initial'

/**
 * used when run as website.
 * currently unused.
 */
class Main extends React.Component {
  render () {
     const opening_page = <Initial/>
    return (<Router>{opening_page}</Router>)
  }
}

const app = document.createElement('div')
app.id = 'my-extension-root'

// document.body.appendChild(app)
// ReactDOM.render(<Main/>, app)