/*global chrome*/
/* src/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
import "./content.css";
import "./index.css";
import Router from './services/router';
import Initial from "./stages/initial";
import Authentication from "./services/authentication";
import Login from "./stages/login";
import Create from "./stages/create";
import Download from "./stages/download";
import Settings from "./stages/settings";

class Main extends React.Component {
    render() {

     let opening_page;
// browser uses this.
    //if(Authentication.isLoggedIn()) {
    if(true) {
      opening_page = <Settings />
    } else if(Authentication.hasSavedKey()) {
      opening_page = <Login />
    } else {
      opening_page = <Initial />
    }
      return(<Router>{opening_page}</Router>)

    }
}
console.log("QWERTTYYYYYYYYY222Y")
const app = document.createElement('div');
app.id = "my-extension-root";

document.body.appendChild(app);
ReactDOM.render(<Main />, app);

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
