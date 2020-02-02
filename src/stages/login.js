/*global chrome*/
import React, { Component } from "react";
import {goBack, goTo} from "route-lite";
import {Entity} from "fetchai-ledger-api/src/fetchai/ledger/crypto/entity";
import {Address} from "fetchai-ledger-api/src/fetchai/ledger/crypto/address";
import Account from "./account";
import {formErrorMessage} from "../services/formErrorMessage";
import Authentication from "../services/authentication";


export default class Login extends Component {

    constructor(props) {
        super(props)
        this.state = { password: '', password_confirm: '' }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this)
    }

     handleChange(event)
      {
    let change = {}
    change[event.target.name] = event.target.value
          debugger;
    this.setState(change)
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

          if(!(await Authentication.correctPassword(this.state.password))){
               formErrorMessage("password", "Incorrect Password");
                return
          }

           localStorage.setItem('logged_in', "true");
           goTo(Account)
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