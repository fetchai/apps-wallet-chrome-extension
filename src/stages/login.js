/*global chrome*/
import React, { Component } from "react";
import {goTo} from "../services/router";
import Account from "./account";
import {formErrorMessage} from "../services/formErrorMessage";
import Authentication from "../services/authentication";
import {Storage} from "../services/storage"

export default class Login extends Component {

    constructor(props) {
        super(props)
        this.state = { password: ''}
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

          if(!(await Authentication.correctPassword(this.state.password))){
               formErrorMessage("password", "Incorrect Password");
                return
          }

           Storage.setLocalStorage('logged_in', "true");
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