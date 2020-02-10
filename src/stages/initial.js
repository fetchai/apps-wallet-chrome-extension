/*global chrome*/
import React, { Component } from "react";
import {goTo} from "../services/router";
import Create from "./create";
import Recover from "./recover";

export default class Initial extends Component {

    constructor(props) {
        super(props)
    }

    render() {
let welcome;

      if(true) {
           welcome = chrome.runtime.getURL("welcome.mp4")
      } else {
           welcome = "./welcome.mp4"
      }


        return (
<video className="vid" playsinline="playsinline" autoPlay="autoplay" muted="muted" loop="loop">
                    <source src={welcome} type="video/mp4"></source>
                </video>
        );
    }
}