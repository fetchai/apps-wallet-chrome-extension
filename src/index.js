/*global chrome*/
/* src/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
import "./content.css";
import "./index.css";
import Router from './services/router';
import Initial from "./views/initial";
import Authentication from "./services/authentication";
import Login from "./views/login";
import Account from "./views/account";
import Create from './views/create'



class Main extends React.Component {
    render() {

        let opening_page;
// browser uses this.
        //if(Authentication.isLoggedIn()) {
        if (true) {
            opening_page = <Create/>
        } else if (Authentication.hasSavedKey()) {
            opening_page = <Login/>
        } else {
            opening_page = <Initial/>
        }
        return (<Router>{opening_page}</Router>)
    }
}

console.log("QWERTTYYYYYYYYY222Y");

const app = document.createElement('div');
app.id = "my-extension-root";

document.body.appendChild(app);
ReactDOM.render(<Main/>, app);


//
// let otherhead = frm.getElementsByTagName("head")[0];
// let link = frm.createElement("link");
// link.setAttribute("rel", "stylesheet");
// link.setAttribute("type", "text/css");
// link.setAttribute("href", "style.css");
//otherhead.appendChild(link);

/*
console.log("QWERTTYYYYYYYYY222Y");

const cssLink = document.createElement("link");

cssLink.href = "/index.css";
cssLink.rel = "stylesheet";
cssLink.type = "text/css";

const app = document.createElement('iframe');

app.id = "my-extension-root";

document.body.appendChild(app);

let www = document.getElementById("my-extension-root");
 */


//app.style.display = "none";

// chrome.runtime.onMessage.addListener(
//    function(request, sender, sendResponse) {
//       if( request.message === "clicked_browser_action") {
//         toggle();
//       }
//    }
// );
//
// function toggle(){
//    if(app.style.display === "none") {
//      app.style.display = "block";
//    } else {
//      app.style.display = "none";
//    }
// }
