import React, { Component } from "react";
import {goTo, Link} from "route-lite";
import Create from "./create";
import Login from "./login";

export default class Initial extends Component {

    constructor(props) {
        super(props)
        const d = localStorage.getItem('key')
        const key = d !== null
        debugger;
        this.state = {
            has_key: key
        }
    }

    render() {
        return (
            <div className="container">
                <div className="buttons">
                    <button className='btn btn-primary btn-block' onClick={goTo.bind(null, Create)}>
                        Create/Recover
                    </button>
                    { this.state.has_key ? <button className='btn btn-primary btn-block' onClick={goTo.bind(null, Login)}>
                        Login222!
                    </button> : null }

                </div>
            </div >
        );
    }
}