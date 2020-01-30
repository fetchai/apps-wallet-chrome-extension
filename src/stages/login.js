/*global chrome*/
import React, { Component } from "react";
import {goBack, goTo} from "route-lite";
import {Entity} from "fetchai-ledger-api/src/fetchai/ledger/crypto/entity";
import {Address} from "fetchai-ledger-api/src/fetchai/ledger/crypto/address";
import Account from "./account";

export default class Login extends Component {

    constructor(props) {
        super(props)
        this.state = { password: '', password_confirm: '' }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

      handleChange(event)
      {
    let change = {}
    change[event.target.name] = event.target.value
    this.setState(change)
      }

      async handleSubmit(event)
      {
 event.preventDefault()

         if(!Entity._strong_password(this.state.password)) {
            let password = document.getElementById("password");
             password.setCustomValidity("Incorrect Password: password too weak");
             // this.setCustomValidity("Merci d'indiquer votre adresse email!");
             password.reportValidity();
             return
         }

          const key = localStorage.getItem('key');
          const entity = Entity._from_json_object(JSON.parse(key), this.state.password)
            // chrome.storage.sync.set({'key': json_str}, function() {
            //      console.log('saved in local storage');
            // });
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