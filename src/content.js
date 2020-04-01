/*global chrome*/
/* src/content.js */
import React from 'react'
import ReactDOM from 'react-dom'
import './content.css'
import Router from './services/router'
import Initial from './views/initial'
import Frame, { FrameContextConsumer } from 'react-frame-component'

/**
 * Add appropriate classes and Ids to Iframe
 *
 */

function setUpIframe(){
  const root = document.getElementById('my-extension-root')
const iframe = root.children[0]
iframe.id = 'my-frame'
iframe.style.overflow = 'hidden'
const html = iframe.contentWindow.document.getElementsByTagName('html')[0]
html.id = 'iframe-html'
app.style.display = 'block'
}


class Main extends React.Component {
  render () {
    let opening_page = <Initial/>

    return (
      <Frame head={[<link key={1} type="text/css" rel="stylesheet"
                          href={chrome.runtime.getURL('/static/css/content.css')}></link>]}
             initialContent='<!DOCTYPE html><html><head></head><body style="margin:0px; overflow:hidden"><div class="frame-root"></div></body></html>'>
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
app.style.overflow = 'hidden'
app.id = 'my-extension-root'
document.getElementById('root').appendChild(app)
ReactDOM.render(<Main/>, app)
setUpIframe()
