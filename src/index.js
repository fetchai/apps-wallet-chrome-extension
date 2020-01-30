/*global chrome*/
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Router, { Link, goBack } from 'route-lite';
import Initial from "./stages/initial";

// const A = () => {
//   return (
//
//     <Link
//       component={B}
//       componentProps={{text: "!!!!!!!!!!!!!!!!!!!!Component B"}}
//     >
//       Component A
//     </Link>
//   );
// }
//
// const B = ({text}) => {
//   return <div onClick={() => goBack()}>{text} PPLLLELASE</div>
// }

ReactDOM.render(<Router><Initial /></Router>, document.getElementById("root"));
registerServiceWorker();
// chrome.extension.getBackgroundPage().console.log('foo');