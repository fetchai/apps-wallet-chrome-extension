/*global chrome*/
/* src/content.js */
import React from 'react'
import ReactDOM from 'react-dom'
import './content.css'
import Router from './services/router'
import Initial from './views/initial'
import Authentication from './services/authentication'
import Login from './views/login'
import Frame, { FrameContextConsumer } from 'react-frame-component'
import Account from './views/account'

//side note: todo run install `npm install --ignore-scripts` before publication to stop npm worms

class Main extends React.Component {
  render () {

    let opening_page

    if (Authentication.isLoggedIn()) {
      opening_page = <Account/>
    } else if (Authentication.hasSavedKey()) {
      opening_page = <Login/>
    } else {
      opening_page = <Initial/>
    }

    return (
      <Frame head={[<link key={1} type="text/css" rel="stylesheet"
                          href={chrome.runtime.getURL('/static/css/content.css')}></link>]}
             initialContent='<!DOCTYPE html><html><head></head><body style="margin:0px"><div class="frame-root"></div></body></html>'>
        <FrameContextConsumer>
          {
            ({ document, window }) => {
              return (<Router>{opening_page}</Router>)
            }
          }
        </FrameContextConsumer>
      </Frame>
    )
  }
}

const app = document.createElement('div')
app.id = 'my-extension-root'

document.body.appendChild(app)
ReactDOM.render(<Main/>, app)

const x = document.getElementById('my-extension-root')

// we give our iframe an ID
const iframe = x.children[0]
iframe.id = 'my-frame'

const html = iframe.contentWindow.document.getElementsByTagName('html')[0]
debugger;

html.id = 'iframe-html'

app.style.display = 'none'

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === 'clicked_browser_action') {
      toggle()
    }
  }
)

function toggle () {
  if (app.style.display === 'none') {
    app.style.display = 'block'
  } else {
    app.style.display = 'none'
  }
}
