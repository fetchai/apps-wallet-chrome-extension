/*global chrome*/
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Router, { Link, goBack } from 'route-lite';
import {isLoggedIn} from "./services/loggedIn";
import Account from "./stages/account";
import Initial from "./stages/initial";

  let opening_page;
// browser uses this
    if(isLoggedIn()) {
      opening_page = <Initial />
    } else {
      opening_page = <Account />
    }

ReactDOM.render(<Router>{opening_page}</Router>, document.getElementById("root"));
registerServiceWorker();
// chrome.extension.getBackgroundPage().console.log('foo');