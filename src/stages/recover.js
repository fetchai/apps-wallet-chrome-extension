/*global chrome*/
import React, {Component} from "react";
import {goBack, goTo} from "../services/router";
import {Entity} from "fetchai-ledger-api/src/fetchai/ledger/crypto/entity";
import {Address} from "fetchai-ledger-api/src/fetchai/ledger/crypto/address";
import Account from "./account";
import {formErrorMessage} from "../services/formErrorMessage";
import {validJSONObject} from "../utils/json";
import {validAddress} from "../utils/validAddress";
import {Storage} from "../services/storage"
import Expand from "react-expand-animated";
import {TRANSITION_DURATION_MS} from "../constants";

export default class Recover extends Component {

    constructor(props) {
        super(props);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validPassword = this.validPassword.bind(this);
        this.validFile = this.validFile.bind(this);
        this.validAddress = this.validAddress.bind(this);
        this.handleConfirmation = this.handleConfirmation.bind(this);
        this.hideConfirmation = this.hideConfirmation.bind(this);

        this.state = {
            file: "",
            password: "",
            address: "",
            file_name: "",
            collapsable_1: true,
            collapsable_2: false
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
        debugger;
        this.setState(change)
    }

    handleFileChange(event) {
        debugger
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
    validPassword() {
        if (this.state.password === null || typeof this.state.password !== "string" || this.state.password.length === 0) {
            formErrorMessage("password", "Password required");
            return false
        } else if (!Entity._strong_password(this.state.password)) {
            formErrorMessage("password", "Incorrect Password: Password too weak");
            return false
        }
        return true
    }

    async validFile() {
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

    validAddress() {
        if (!validAddress(this.state.address)) {
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

        if (!this.validPassword()) error_flag = true;
        if (!(await this.validFile())) error_flag = true;
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

            if (!error_flag) {
                Storage.setLocalStorage("key_file", file_str);
                Storage.setLocalStorage("address", new Address(entity).toString());
                goTo(Account)
            }

        } else if (!error_flag) {
            // show the confirmation dialog. //
            this.setState({collapsable_1: false, collapsable_2: true})

        }
    }

    async handleConfirmation() {
        // we have already confirmed the values are correct earlier, so don't need to do this again.
        const file_str = await this.read_file(this.state.file);
        const entity = await Entity._from_json_object(JSON.parse(file_str), this.state.password);

        Storage.setLocalStorage("key_file", file_str);
        Storage.setLocalStorage("address", new Address(entity).toString());
        goTo(Account)
    }

    hideConfirmation() {
        this.setState({collapsable_1: true, collapsable_2: false})
    }

    render() {
        const styles = {
            open: {background: " #1c2846"}
        };

        const transitions = ["height", "opacity", "background"];

        return (
            <div className="OverlayMain">
                <div className="OverlayMainInner">
                    <h2>Recover</h2>
                    <hr></hr>
                    <Expand
                        open={this.state.collapsable_1}
                        duration={TRANSITION_DURATION_MS}
                        styles={styles}
                        transitions={transitions}
                    >

                        <form id="form">
                            <legend className="recover-legend">Upload File with Password</legend>
                            <input label='file' className="recover-input" id="file" type="file"
                                   value={this.state.file_name} onChange={this.handleFileChange.bind(this)}></input>
                            <input type="text" className="recover-input" placeholder="Password" id="password"
                                   name="password" value={this.state.password}
                                   onChange={this.handleChange.bind(this)} required></input>
                            <input label='address' className="recover-input recover-address" id="address" type="text"
                                   name="address" placeholder="Address (optional)"
                                   value={this.state.address} onChange={this.handleChange.bind(this)}></input>
                            <div className="small-button-container">
                                <button type="button" className="small-button recover-small-button" onClick={event => {
                                    event.preventDefault();
                                    goBack()
                                }}>Back
                                </button>
                                <button type="submit" className="small-button recover-small-button"
                                        onClick={this.handleSubmit}>Upload
                                </button>
                            </div>
                        </form>
                    </Expand>
                    <Expand
                        open={this.state.collapsable_2}
                        duration={TRANSITION_DURATION_MS}
                        styles={styles}
                        transitions={transitions}
                    >
                        <p>Decrypting without providing an Address means that if the password is wrong it will decrypt
                            to the wrong address rather than throw an error. Click yes to proceed or cancel and provide
                            an address </p>
                        <div className="small-button-container">
                            <button type="button" className="small-button recover-small-button"
                                    onClick={this.hideConfirmation}>Back
                            </button>
                            <button type="submit" className="small-button recover-small-button"
                                    onClick={this.handleConfirmation}>Next
                            </button>
                        </div>
                    </Expand>
                </div>
            </div>
        );
    }
}
