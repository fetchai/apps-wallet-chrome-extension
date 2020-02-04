/*global chrome*/
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Router, { Link, goBack } from './services/router';
import Account from "./stages/account";
import Initial from "./stages/initial";
import Authentication from "./services/authentication";
import Login from "./stages/login";

  let opening_page;
// browser uses this
    if(Authentication.isLoggedIn()) {
      opening_page = <Account />
    } else if(Authentication.hasSavedKey()) {
      opening_page = <Login />
    } else {
      opening_page = <Initial />
    }

ReactDOM.render(<Router>{opening_page}</Router>, document.getElementById("root"));
registerServiceWorker();
// chrome.extension.getBackgroundPage().console.log('foo');