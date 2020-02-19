/*global chrome*/
import React, {Component} from "react";
import {goBack, goTo} from "../services/router";
import {Entity} from "fetchai-ledger-api/src/fetchai/ledger/crypto/entity";
import {Address} from "fetchai-ledger-api/src/fetchai/ledger/crypto/address";
import Account from "./account";
import {Storage} from "../services/storage"
import Authentication from "../services/authentication";

/**
 * corresponds to the create view of initial wireframes (v4) and handles view + associated logic for new account creation.
 *
 */
export default class Create extends Component {

    constructor(props) {
        super(props);
        this.state = {password: '', password_confirm: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change)
    }

    /**
     * Checks only if password provided, and if it is of adequate strength as per our javascript SDK.
     * Sets error message if not and returns. If true creates user, logs them in, and redirects to account page.
     *
     * @param event
     * @returns {Promise<void>}
     */
    async handleSubmit(event) {
        event.preventDefault();

        if (!Entity._strong_password(this.state.password)) {
            let password = document.getElementById("password");
            password.setCustomValidity("Weak Password: choose password with 14 characters including an uppercase, lowercase, number and special character");
            password.reportValidity();
            return
        }

        if (this.state.password !== this.state.password_confirm) {
            let confirm_password = document.getElementById("password_confirm");
            confirm_password.setCustomValidity("Passwords Don't Match");
            confirm_password.reportValidity();
            return
        }

        let entity = new Entity();
        const json_obj = await entity._to_json_object(this.state.password);
         Authentication.storeNewUser(entity, JSON.stringify(json_obj))
        goTo(Account)
    }


    render() {
        return (
            <div className="OverlayMain">
                <div className="OverlayMainInner">
                    <h1>Create account</h1>
                    <hr></hr>
                    <form id="form">
                        <input type="password" className="large-button" placeholder="Password" id="password"
                               name="password" value={this.state.password}
                               onChange={this.handleChange.bind(this)} required></input>
                        <input type="password" className="large-button" placeholder="Confirm Password"
                               id="password_confirm" name="password_confirm" value={this.state.password_confirm}
                               onChange={this.handleChange.bind(this)} required></input>
                        <div className="small-button-container">
                            <button type="button" className="small-button" onClick={event => {
                                event.preventDefault();
                                goBack()
                            }}>Back
                            </button>
                            <button type="submit" className="small-button" onClick={this.handleSubmit}>Next</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}