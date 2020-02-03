/*global chrome*/
import React, { Component } from "react";
import {goBack, goTo} from "route-lite";
import {Entity} from "fetchai-ledger-api/src/fetchai/ledger/crypto/entity";
import {Address} from "fetchai-ledger-api/src/fetchai/ledger/crypto/address";
import Account from "./account";
import {Storage} from "../services/storage"

export default class Create extends Component {

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

         if(!Entity._strong_password(this.state.password)){
            let password = document.getElementById("password");
             password.setCustomValidity("Weak Password: choose password of at least 14 characters containing at least 1 uppercase, lowercase, number and special character");
             password.reportValidity();
             return
         }

         if(this.state.password !== this.state.password_confirm) {
             let confirm_password = document.getElementById("password_confirm");
             confirm_password.setCustomValidity("Passwords Don't Match");
             confirm_password.reportValidity();
             return
         }

         let entity = new Entity();
         const json_obj = await entity._to_json_object(this.state.password)
         Storage.setLocalStorage("key_file", JSON.stringify(json_obj))
         Storage.setLocalStorage("address", new Address(entity).toString())
         Storage.setLocalStorage('logged_in', "true");
            // chrome.storage.sync.set({'key': json_str}, function() {
            //      console.log('saved in local storage');
            // });
          goTo(Account)
       }


    render() {
        return (
            <div className="container">
                <h2>Create Account</h2>
                <form id="form">
                    <legend>Confirm password with HTML5</legend>
                            <input type="text" placeholder="Password" id="password" name ="password" value={this.state.password}
                                   onChange={this.handleChange.bind(this)} required></input>
                            <input type="text" placeholder="Confirm Password" id="password_confirm" name ="password_confirm" value={this.state.password_confirm}
                                   onChange={this.handleChange.bind(this)} required></input>
                    <button type="button" className="pure-button pure-button-primary" onClick={(event) => { event.preventDefault(); goBack()}}>Back</button>
                    <button type="submit" className="pure-button pure-button-primary" onClick={this.handleSubmit}>Next</button>
                </form>
            </div>
        );
    }
}