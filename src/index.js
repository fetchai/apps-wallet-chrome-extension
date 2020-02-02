/*global chrome*/
import React from 'react';
import ReactDOM from 'react-dom';


import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Router, { Link, goBack } from 'route-lite';
import Account from "./stages/account";
import Initial from "./stages/initial";
import Authentication from "./services/authentication";

  let opening_page;
// browser uses this
    if(Authentication.isLoggedIn()) {
      opening_page = <Account />
    } else {
      opening_page = <Initial />
    }

ReactDOM.render(<Router>{opening_page}</Router>, document.getElementById("root"));
registerServiceWorker();
// chrome.extension.getBackgroundPage().console.log('foo');