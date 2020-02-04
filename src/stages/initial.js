import React, { Component } from "react";
import {goTo, Link} from "../services/router";
import Create from "./create";
import Login from "./login";
import Recover from "./recover";
import {Storage} from "../services/storage"
import Authentication from "../services/authentication";

export default class Initial extends Component {

    constructor(props) {
        super(props)

    }


    render() {
        return (
            <div className="container">
                <div className="buttons">
                     { Authentication.hasSavedKey() ? <button className='btn btn-primary btn-block' onClick={goTo.bind(null, Login)}>
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