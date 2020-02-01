import React, { Component } from "react";
import {goTo, Link} from "route-lite";
import Create from "./create";
import Login from "./login";
import Recover from "./recover";
import {isLoggedIn} from "../services/loggedIn";
import Account from "./account";

export default class Initial extends Component {

    constructor(props) {
        super(props)

    }

    componentDidMount() {
        debugger;
           this.gaa()

    }

    gaa() {
         return goTo(Create)
    }

    hasSavedKey() {
        return localStorage.getItem('key_file') !== null
    }

    render() {
        return (
            <div className="container">
                <div className="buttons">
                     { this.hasSavedKey() ? <button className='btn btn-primary btn-block' onClick={goTo.bind(null, Login)}>
                       Login
                    </button>  :
                         [ <button className='btn btn-primary btn-block' onClick={goTo.bind(null, Recover)}>
                        Recover
                    </button>,
                         <button className='btn btn-primary btn-block' onClick={goTo.bind(null, Create)}>
                        Create
                    </button> ]
                     }
                </div>
            </div >
        );
    }
}