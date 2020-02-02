/*global chrome*/
import React, { Component } from "react";
import {goBack, goTo} from "route-lite";
import {Entity} from "fetchai-ledger-api/src/fetchai/ledger/crypto/entity";
import {Address} from "fetchai-ledger-api/src/fetchai/ledger/crypto/address";
import Account from "./account";
import {formErrorMessage} from "../services/formErrorMessage";
import {handleChange} from "../utils/misc"


export default class Login extends Component {

    constructor(props) {
        super(props)
        this.state = { password: '', password_confirm: '' }
        this.handleChange = handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this)
    }

      handleFileChange(event)
      {
        this.setState({
            file: event.target.files[0],
            file_name: event.target.value
        });
    };

      async handleSubmit(event)
      {
 event.preventDefault()

         if(!Entity._strong_password(this.state.password)) {
             formErrorMessage("password", "Incorrect Password: password too weak")
             return
         }

          const key = localStorage.getItem('key_file');
          //todo assumption here that address will exist.
          const address = localStorage.getItem('address');


          const entity = await Entity._from_json_object(JSON.parse(key), this.state.password).catch(() => {
                           formErrorMessage("password", "Incorrect Password")
                           return
          })
          debugger;
          if (new Address(entity).toString() !== address) {
                formErrorMessage("password", "Incorrect Password");
                return
          }

           localStorage.setItem('logged_in', "true");
           goTo(Account, {address: new Address(entity).toString()})
       }


    render() {
        return (
            <div className="container">
                <h2>Login</h2>
                <form id="form">
                     <legend>Login with Password</legend>
                            <input type="text" placeholder="Password" id="password" name ="password" value={this.state.password}
                                   onChange={this.handleChange.bind(this)} required></input>
                    <button type="submit" className="pure-button pure-button-primary" onClick={this.handleSubmit}>Login</button>
                </form>
            </div>
        );
    }
}