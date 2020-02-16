/*global chrome*/
import React, { Component } from "react";
import {goTo} from "../services/router";
import Create from "./create";
import Recover from "./recover";
import Authentication from "../services/authentication";
import Login from "./login";

export default class Initial extends Component {

    render() {
let welcome, logo;

      if(false) {
           welcome = chrome.runtime.getURL("welcome.mp4")
           logo = chrome.runtime.getURL("welcome.mp4")
      } else {
           welcome = "./assets/welcome.mp4"
            logo =  "./assets/fetchai_logo.svg"
      }

        return (
             <div>
                <video className="vid" playsInline="playsinline" autoPlay="autoplay" muted="muted" loop="loop">
                    <source src={welcome} type="video/mp4"/>
                </video>
                <div className="overlay1"><img src={logo} alt="Fetch.ai's Logo" className="logo"></img></div>
                <div className="overlay2">
                    <div className="overlay3">
                    <button className='button-free-standing' onClick={goTo.bind(null, Recover)}>
                        Recover
                    </button>
                         <button className='button-free-standing' onClick={goTo.bind(null, Create)}>
                        Create
                    </button>
                </div>
                </div>
            </div >
        );
    }
}