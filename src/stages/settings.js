/*global chrome*/
import React, { Component } from "react";
import {goBack, goTo} from "route-lite";
import Account from "./account";
import Initial from "./initial";
import {Authentication} from "../services/authentication";
import Expand from "react-expand-animated";
import {BoxExpand, BoxExpand1, BoxToggle, Button, ExpandBoxes} from "../css/main.styles";
import {handleChange} from "../utils/misc"
import {formErrorMessage} from "../services/formErrorMessage";
import {Entity} from "fetchai-ledger-api/src/fetchai/ledger/crypto/entity";
import {VERSION} from "../constants";

export default class Settings extends Component {

    constructor(props) {
        super(props)
                this.HandleLogOut = this.HandleLogOut.bind(this)
                this.toggle = this.toggle.bind(this)
                this.handleChange = this.handleChange.bind(this)
                this.validPassword = this.validPassword.bind(this)
                this.passwordConfirmValidate = this.passwordConfirmValidate.bind(this)
                this.newPasswordValidate = this.newPasswordValidate.bind(this)
                this.handlePasswordUpdate = this.handlePasswordUpdate.bind(this)
                this.update_password = this.update_password.bind(this)
            
         this.state = {
    collapsable_1: false,
    collapsable_2: false,
    collapsable_3: false,
    password: '',
    new_password_confirm: '',
    new_password: ''
  };

    }

      handleChange(event)
      {
    let change = {}
    change[event.target.name] = event.target.value
          debugger;
    this.setState(change)
      }

    passwordConfirmValidate(){
   if(this.state.new_password !== this.new_password_confirm) {
       formErrorMessage("password", "Incorrect Password")
       return false;
   } return true;
}

    async validPassword(){
        if(!(await Authentication.correctPassword(this.state.password))) {
            formErrorMessage("password", "Incorrect Password")
            return false
        }
        return true;
}

   async newPasswordValidate(){
        if(!(await Authentication.correctPassword(this.state.new_password))) {
            formErrorMessage("new_password", "New password is the same as current password")
            return false
        }
        else if(Entity._strong_password(this.state.new_password)) {
            formErrorMessage("new_password", "Weak Password: choose password of at least 14 characters containing at least 1 uppercase, lowercase, number and special character")
            return false
        }
        return true;
   }

      toggle(index) {
    let collapse = "collapsable_" + index;
    this.setState(prevState => ({ [collapse]: !prevState[collapse] }));
  };


   async handlePasswordUpdate(){
        let errors_flag = false;

        if(!(await this.validPassword())) errors_flag = true;
        if(!(await this.newPasswordValidate())) errors_flag = true;
        if(!this.passwordConfirmValidate()) errors_flag = true;
        if(!errors_flag) this.update_password()
}

async update_password(){
       //NOTE: assumes original password is checked for correctness before invoking this, else it will lead to key loss
      const orig_key_file = localStorage.getItem('key_file');
     const entity = Entity._from_json_object(orig_key_file, this.state.password)
     const key_file = entity._to_json_object(this.state.new_password)
      localStorage.setItem("key_file", JSON.stringify(key_file))
this.setState({
        password: '',
    new_password_confirm: '',
    new_password: ''
    }, () => formErrorMessage("output", "Password successfully updated")
    );
}

    HandleLogOut(){
        Authentication.logOut();
        goTo(Initial)
    }

    render() {
        const styles = {
      open: { background: "#ecf0f1" }
    };
    const transitions = ["height", "opacity", "background"];

        return (
            <div>
                <h1>Settings</h1> <button className='btn btn-primary btn-block' onClick={goTo.bind(null, Account)}>
                        X
                </button>
                <hr></hr>
            <button onClick={() => this.toggle(1)}>General</button>
          <Expand
            open={this.state.collapsable_1}
            duration={500}
            styles={styles}
            transitions={transitions}
          >
            <form>
                 <label for="conversion">Currency Conversion</label>
         <select  id="conversion" name = "dropdown">
            <option value = "USD" selected>USD</option>
            <option value = "XBT">XBT</option>
            <option value = "EUR">EUR</option>
            <option value = "GBP">GBP</option>
         </select>
                <br></br>
                <label htmlFor="conversion">Language</label>
                <select id="conversion" name="dropdown">
                    <option value="EN" selected>English</option>
                    <option value="CN">Chinese</option>
                    <option value="ESN">Spanish</option>
                    <option value="FRN">French</option>
                </select>

      </form>
          </Expand>
            <button onClick={() => this.toggle(2)}>Security & Privacy</button>
  <Expand
            open={this.state.collapsable_2}
            duration={500}
            styles={styles}
            transitions={transitions}
          >
 <form id="form">
                    <legend>Change Password</legend>
                            <input type="text" placeholder="Password" id="password" name ="password" value={this.state.password}
                                   onBlur = {this.validPassword.bind(this)} onChange={this.handleChange.bind(this)} required></input>
                            <input type="text" placeholder="Confirm Password" id="password_confirm" name ="password_confirm" value={this.state.new_password}
                                   onBlur = {this.newPasswordValidate.bind(this)} onChange={this.handleChange.bind(this)} required></input>
      <input type="text" placeholder="New Password" id="new_password" name ="new_password" value={this.state.new_password_confirm}
                                   onBlur = {this.passwordConfirmValidate.bind(this)} onChange={this.handleChange.bind(this)} required></input>
     <output type="text" id="output"></output>
                    <button type="submit" className="pure-button pure-button-primary" onClick={this.handlePasswordUpdate}>Update</button>
                </form>
        </Expand>
            <Button onClick={() => this.toggle(3)}>About</Button>
  <Expand
            open={this.state.collapsable_3}
            duration={500}
            styles={styles}
            transitions={transitions}
          >
      <p>FET Wallet Version {VERSION}</p>
      <p>Developed and Designed by Fetch.ai Cambridge</p>
  </Expand>



                <button className='btn btn-primary btn-block' onClick={this.HandleLogOut}>
                        Log out
                </button>
            </div>
        );
    }
}