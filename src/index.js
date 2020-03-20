/*global chrome*/
import React from 'react'
import ReactDOM from 'react-dom'
import './content.css'
import './index.css'
import Router from './services/router'
import Initial from './views/initial'

class Main extends React.Component {



  render () {
let     opening_page = <Initial/>
    return (<Router>{opening_page}</Router>)
  }
}

const app = document.createElement('div')
app.id = 'my-extension-root'
document.body.appendChild(app)
ReactDOM.render(<Main/>, app)