/*global chrome*/
/* src/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
import "./content.css";
import Router from './services/router';
import Initial from "./views/initial";
import Authentication from "./services/authentication";
import Login from "./views/login";
import Create from "./views/create";



class Main extends React.Component {
    render() {

        let opening_page;
// browser uses this.
        //if(Authentication.isLoggedIn()) {
        if (true) {
            opening_page = <Initial/>
        } else if (Authentication.hasSavedKey()) {
            opening_page = <Login/>
        } else {
            opening_page = <Initial/>
        }

        // return (
        //     <Frame head={[<link type="text/css" rel="stylesheet" href={chrome.runtime.getURL("/static/css/content.css")} ></link>]}>
        //        <FrameContextConsumer>
        //        {
        //            ({document, window}) => {
        //              return(<Router>{opening_page}</Router>)
        //             }
        //         }
        //         </FrameContextConsumer>
        //     </Frame>
        // )

        return (<Router>{opening_page}</Router>)

    }
}

console.log("QWERTTYYYYYYYYYY99999999999999999");
const app = document.createElement('div');
app.id = "my-extension-root";

document.body.appendChild(app);
ReactDOM.render(<Main/>, app);

app.style.display = "none";

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {
            toggle();
        }
    }
);

function toggle() {
    if (app.style.display === "none") {
        app.style.display = "block";
    } else {
        app.style.display = "none";
    }
}
