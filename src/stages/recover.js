/*global chrome*/
import React, {Component} from "react";
import {goTo} from "route-lite";
import {Entity} from "fetchai-ledger-api/src/fetchai/ledger/crypto/entity";
import {Address} from "fetchai-ledger-api/src/fetchai/ledger/crypto/address";
import Account from "./account";
import {formErrorMessage} from "../services/formErrorMessage";
import {validJSONObject} from "../utils/json";

const CONFIRM_MESSAGE = "Decrypting without providing an Address means that if the password is wrong it will decrypt to the wrong address " +
            "rather than throw an error. Click yes to proceed or cancel and provide an address ";

export default class Recover extends Component {

    constructor(props) {
        super(props);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            file: "",
            password: "",
            address: ""
        }
    }

    async read_file(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                resolve(evt.target.result);
            };
            reader.onerror = function () {
                reject(null);
            }
        })
    }

    handleChange(event) {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change)
    }

    handleFileChange(event) {
        this.setState({
            file: event.target.files[0],
            file_name: event.target.value
        });
    };

    async handleSubmit(event) {
        event.preventDefault();
        // validate
        let errors_flag = false;
        let entity;
        let file_str;

        if (this.state.password === null || typeof this.state.password !== "string" || this.state.password.length === 0) {
            formErrorMessage("password", "Password required");
            errors_flag = true
        } else if (!Entity._strong_password(this.state.password)) {
            formErrorMessage("password", "Incorrect Password: password too weak");
            errors_flag = true
        }

        if (!(this.state.file instanceof Blob)) {
            formErrorMessage("file", "File required");
            errors_flag = true
        } else {
             file_str = await this.read_file(this.state.file);

            if (file_str === null) {
                formErrorMessage("file", "Unable to read file");
                errors_flag = true
            } else if (!validJSONObject(file_str)) {
                 formErrorMessage("file", "Incorrect file type");
                    errors_flag = true
            } else {
                debugger;
                entity = await Entity._from_json_object(file_str, this.state.password).catch(() => {
                    formErrorMessage("password", "Unable to decrypt");
                    errors_flag = true
                })
            }
        }

        if (this.state.address && entity instanceof Entity) {
            if (new Address(entity).toString() !== this.state.address) {
                formErrorMessage("address", "Incorrect Password or Address");
                errors_flag = true
            }
        } else if (!errors_flag && !window.confirm(CONFIRM_MESSAGE)) {
            errors_flag = true
        }

        // if no errors then we store the data.
        if (!errors_flag) {
            localStorage.setItem("key", file_str);
            localStorage.setItem("address", new Address(entity).toString());
            goTo(Account, {address: new Address(entity).toString()})
        }
    }

render()
{
    return (
        <div className="container">
            <h2>Login</h2>
            <form id="form">
                <legend>Upload File with Password</legend>
                <input label='file' id="file" type="file"
                       value={this.state.file_name} onChange={this.handleFileChange.bind(this)}></input>
                <input type="text" placeholder="Password" id="password" name="password" value={this.state.password}
                       onChange={this.handleChange.bind(this)} required></input>
                <label>Address: optional2</label>
                <input label='address' id="address" type="text" name="address"
                       value={this.state.address} onChange={this.handleChange.bind(this)}></input>
                <button type="submit" className="pure-button pure-button-primary"
                        onClick={this.handleSubmit.bind(this)}>Upload
                </button>
            </form>
        </div>
    );
}
}
