/*global chrome*/
import React, {Component} from "react";
import {goTo} from "../services/router";
import Account from "./account";
import {formErrorMessage} from "../services/formErrorMessage";
import Authentication from "../services/authentication";
import {Storage} from "../services/storage"
import {getAssetURI} from "../utils/getAsset";

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {password: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change)
    }


    async handleSubmit(event) {
        event.preventDefault();

        if (!(await Authentication.correctPassword(this.state.password))) {
            formErrorMessage("password", "Incorrect Password");
            return
        }

        Storage.setLocalStorage('logged_in', "true");
        goTo(Account)
    }

    render() {
        return (
            <div>
                <video className="vid" playsInline="playsinline" autoPlay="autoplay" muted="muted" loop="loop">
                    <source src={getAssetURI("welcome.mp4")} type="video/mp4"></source>
                </video>
                <div className="overlay1"><img src={getAssetURI("fetchai_logo.svg")} alt="Fetch.ai's Logo" className="logo"></img></div>
                <div className="overlay2">
                    <div className="overlay3">
                        <form id="form">
                            <input type="password" className="button-free-standing " placeholder="Password"
                                   id="password" name="password" value={this.state.password}
                                   onChange={this.handleChange.bind(this)} required></input>
                            <button type="submit" className="button-free-standing"
                                    disabled={!this.state.password.length} onClick={this.handleSubmit}>Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}