/*global chrome*/
import React, { Component } from "react";
import {goTo} from "route-lite";
import Create from "./create";
import Account from "./account";
import {Address} from "fetchai-ledger-api/src/fetchai/ledger/crypto";
import {logOut} from "../services/loggedIn";
import Initial from "./initial";

export default class Settings extends Component {

    constructor(props) {
        super(props)
                this.LogOut = this.LogOut.bind(this)
    }

    LogOut(){
        logOut();
        goTo(Initial)
    }

    render() {
        return (
            <div>
                <h1>Settings</h1>
                <hr></hr>
                <ul>
                    <li>Contacts</li>
                    <li>Contacts</li>
                    <li>Security & Privacy</li>
                    <li>About</li>
                </ul>
                <button className='btn btn-primary btn-block' onClick={this.LogOut}>
                        Log out
                </button>
            </div>
        );
    }
}