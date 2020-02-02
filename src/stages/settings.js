/*global chrome*/
import React, { Component } from "react";
import {goTo} from "route-lite";
import Account from "./account";
import Initial from "./initial";
import {Authentication} from "../services/authentication";
import {Collapsible} from 'react-collapsible';


export default class Settings extends Component {

    constructor(props) {
        super(props)
                this.HandleLogOut = this.HandleLogOut.bind(this)

    this.state = { open: false };
    }

  // toggle = () => {
  //   this.setState(prevState => ({ open: !prevState.open }));
  // };

    HandleLogOut(){
        Authentication.logOut();
        goTo(Initial)
    }

    render() {
        return (
            <div>
                <h1>Settings</h1> <button className='btn btn-primary btn-block' onClick={goTo.bind(null, Account)}>
                        X
                </button>
                <hr></hr>
                {/*<ul>*/}
                {/*    <li>Contacts</li>*/}
                {/*    <li>Security & Privacy</li>*/}
                {/*    <li>About</li>*/}
                {/*</ul>*/}

                <Collapsible trigger="Start here">
        <p>This is the collapsible content. It can be any element or React component you like.</p>
        <p>It can even be another Collapsible component. Check out the next section!</p>
      </Collapsible>

                <button className='btn btn-primary btn-block' onClick={this.HandleLogOut}>
                        Log out
                </button>
            </div>
        );
    }
}