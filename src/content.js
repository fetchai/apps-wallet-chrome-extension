/*global chrome*/
/* src/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer }from 'react-frame-component';
import "./content.css";
import Router, {goBack, goTo, Link} from "route-lite";
import Initial from "./stages/initial";
import {isLoggedIn} from "./services/loggedIn";
import Create from "./stages/create";

// const A = () => {
//   return (
//     <Link
//       component={B}
//       componentProps={{text: "!!!!!!!!!!!!!!!!!!!!Component B"}}
//     >
//       Component A
//     </Link>
//   );
// }
// const B = ({text}) => {
//   return (<div>pppyukjfgfghffhg</div>, <div onClick={() => goBack()}>{text} PPLLLELASE</div>, <div onClick={() => goTo(A)}>{text} GO TO A</div>)
// }



class Main extends React.Component {
    render() {
         let opening_page;

    if(isLoggedIn()) {
      opening_page = <Initial />
    } else {
      opening_page = <Create />
    }

        return (
            <Frame head={[<link type="text/css" rel="stylesheet" href={chrome.runtime.getURL("/static/css/content.css")} ></link>]}> 
               <FrameContextConsumer>
               {
                   ({document, window}) => {
                     return(<Router>{opening_page}</Router>)
                    }
                }
                </FrameContextConsumer>
            </Frame>
        )
    }
}

const app = document.createElement('div');
app.id = "my-extension-root";

document.body.appendChild(app);
ReactDOM.render(<Main />, app);

app.style.display = "none";

chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action") {
        toggle();
      }
   }
);

function toggle(){
   if(app.style.display === "none"){
     app.style.display = "block";
   }else{
     app.style.display = "none";
   }
}
