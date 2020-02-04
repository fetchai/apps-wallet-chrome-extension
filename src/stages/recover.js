/*global chrome*/
import React, {Component} from "react";
import {goTo} from "../services/router";
import {Entity} from "fetchai-ledger-api/src/fetchai/ledger/crypto/entity";
import {Address} from "fetchai-ledger-api/src/fetchai/ledger/crypto/address";
import Account from "./account";
import {formErrorMessage} from "../services/formErrorMessage";
import {validJSONObject} from "../utils/json";
import {validAddress} from "../utils/validAddress";
import {Storage} from "../services/storage"

const CONFIRM_MESSAGE = "Decrypting without providing an Address means that if the password is wrong it will decrypt to the wrong address " +
            "rather than throw an error. Click yes to proceed or cancel and provide an address ";

export default class Recover extends Component {

    constructor(props) {
        super(props);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validPassword = this.validPassword.bind(this);
        this.validFile = this.validFile.bind(this);
        this.validAddress = this.validAddress.bind(this);

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

     handleChange(event)
      {
    let change = {}
    change[event.target.name] = event.target.value
          debugger;
    this.setState(change)
      }

    handleFileChange(event) {
        this.setState({
            file: event.target.files[0],
            file_name: event.target.value
        });
    };

    /**
     *
     *
     * @returns {boolean}
     */
    validPassword(){
        if (this.state.password === null || typeof this.state.password !== "string" || this.state.password.length === 0) {
            formErrorMessage("password", "Password required");
            return false
        } else if (!Entity._strong_password(this.state.password)) {
            formErrorMessage("password", "Incorrect Password: Password too weak");
            return false
        }
        return true
    }

    async validFile(){
        if (!(this.state.file instanceof Blob)) {
            formErrorMessage("file", "File required");
            return false;
        }
            const file_str = await this.read_file(this.state.file);

            if (file_str === null) {
                formErrorMessage("file", "Unable to read file");
                return false;
            }

            if (!validJSONObject(file_str)) {
                 formErrorMessage("file", "Incorrect file type");
                     return false;
            }

            return true;
    }

    validAddress(){
       if(!validAddress(this.state.address)) {
           formErrorMessage("address", "invalid address");
                     return false;
       }
       return true;
    }



    async handleSubmit(event) {
        event.preventDefault();
        // validate
        let error_flag = false;
        let entity;
        let file_str;

        if(!this.validPassword())  error_flag = true
        if(!this.validFile())  error_flag = true
        else {
            file_str = await this.read_file(this.state.file);
            debugger;
            entity = await Entity._from_json_object(JSON.parse(file_str), this.state.password).catch(() => {
                formErrorMessage("password", "Unable to decrypt");
                error_flag = true
            })
        }

        if (this.state.address && entity instanceof Entity) {
            if (new Address(entity).toString() !== this.state.address) {
                formErrorMessage("address", "Incorrect Password or Address");
                error_flag = true
            }
        } else if (!error_flag && !window.confirm(CONFIRM_MESSAGE)) {
            error_flag = true
        }


        // if no errors then we store the data.
        if (!error_flag) {
            Storage.setLocalStorage("key_file", file_str);
            Storage.setLocalStorage("address", new Address(entity).toString());
            goTo(Account)
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
                       value={this.state.file_name} onBlur={this.validFile.bind(this)} onChange={this.handleFileChange.bind(this)}></input>
                <input type="text" placeholder="Password" id="password" name="password" value={this.state.password}
                        onChange={this.handleChange.bind(this)} required></input>
                <label>Address (optional)</label>
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
