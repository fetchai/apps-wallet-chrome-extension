/*global chrome*/
import React, { Component } from "react";
import {goTo} from "../services/router";
import Account from "./account";
import {Authentication} from "../services/authentication";
import Expand from "react-expand-animated";
import {formErrorMessage} from "../services/formErrorMessage";
import {Entity} from "fetchai-ledger-api/src/fetchai/ledger/crypto/entity";
import {VERSION} from "../constants";
import {Storage} from "../services/storage"
import Login from "./login";

export default class Settings extends Component {

    constructor(props) {
        super(props)
                this.HandleLogOut = this.HandleLogOut.bind(this)
                this.toggle = this.toggle.bind(this)
                this.handleChange = this.handleChange.bind(this)
                this.handlePasswordUpdate = this.handlePasswordUpdate.bind(this)
                this.update_password = this.update_password.bind(this)

         this.state = {
    collapsable_1: false,
    collapsable_2: false,
    collapsable_3: false,
    password: '',
    new_password_confirm: '',
    new_password: '',
             output: ''
  };

    }

      handleChange(event)
      {
    let change = {}
    change[event.target.name] = event.target.value
    this.setState(change)
      }

    passwordConfirmValidate(show_error, event){
   if(this.state.new_password !== this.state.new_password_confirm) {
       debugger;
        if(show_error) {
            formErrorMessage("new_password_confirm", "Passwords don't match!")
        }
       return false;
   } return true;
}

    async validPassword(show_error, event){

        if(!(await Authentication.correctPassword(this.state.password))) {
             if(show_error) {
                 formErrorMessage("password", "Incorrect Password1")
             }
           return false
        }
       return true;
}

   async newPasswordValidate(show_error, event){
        if(await Authentication.correctPassword(this.state.new_password)) {
            if(show_error) {
                formErrorMessage("new_password", "New password is the same as current password")
            }
            return false
        }

        if(!Entity._strong_password(this.state.new_password)) {
             if(show_error) {
                 formErrorMessage("new_password", "Weak Password: choose password of at least 14 characters containing at least 1 uppercase, lowercase, number and special character")
             }
            return false
        }
        return true;
   }

      toggle(index) {
          for(let i=1; i <= 3; i++) {
             let collapse = "collapsable_" + i;

             if(i === index) {
                 // we toggle the settings button that was clicked on
                 this.setState(prevState => ({ [collapse]: !prevState[collapse] }));
                 continue;
             }
            // but with the other ones we close them for better UI
              this.setState({[collapse]: false})
          }
  };

   async handlePasswordUpdate(event){
        event.preventDefault();
        if(!(await this.validPassword(true,event))) return
        if(!(await this.newPasswordValidate(true,event)))  return
        if(!this.passwordConfirmValidate(true, event))  return
        this.update_password()
}

async update_password(){
        this.setState({output: ""})
       //NOTE: assumes original password is checked for correctness before invoking this, else it will lead to key loss
      const orig_key_file = Storage.getLocalStorage('key_file');
      const entity = await Entity._from_json_object(JSON.parse(orig_key_file), this.state.password)
      const key_file = await entity._to_json_object(this.state.new_password)
      Storage.setLocalStorage("key_file", JSON.stringify(key_file))
      this.setState({
        password: '',
    new_password_confirm: '',
    new_password: ''
    }, () => {
  this.setState({output: "Password successfully updated"})
    }
    );
}

    HandleLogOut(){
        Authentication.logOut();
        goTo(Login)
    }

    render() {

            let cross;

          //   if(false) {
      //      account = chrome.runtime.getURL("account_icon.svg")
      // } else {
           cross = "./assets/cross_icon.svg"
     // }
        const styles = {
      open: { background: " #1c2846" }
    };

    const transitions = ["height", "opacity", "background"];

        return (
            <div className="OverlayMain"><div className="OverlayMainInner">
                 <div className='address_title'>
                <h1>Settings</h1>
                <img className='cross' src={cross} onClick={goTo.bind(null, Account)}/>
                 </div>
                <hr></hr>
            <button className="plain_button" onClick={() => this.toggle(1)}>General</button>
          <Expand
            open={this.state.collapsable_1}
            duration={500}
            styles={styles}
            transitions={transitions}
          >
            <form className="settings_form">
                <div className="input_container">
                <label for="conversion">Conversion<br></br>Currency</label>
                     <div className="select_container">
         <select  id="conversion" className="custom_select" name = "dropdown">
            <option value = "USD">USD</option>
            <option value = "XBT">XBT</option>
            <option value = "EUR">EUR</option>
            <option value = "GBP">GBP</option>
         </select>
                </div>
                </div>
                <br></br>
                 <div className="input_container form_label_single_line">
                <label htmlFor="conversion">Language</label>
                      <div className="select_container">
                <select id="conversion" className="custom_select" name="dropdown">
                    <option value="EN">English</option>
                    <option value="CN">Chinese</option>
                    <option value="ESN">Spanish</option>
                    <option value="FRN">French</option>
                </select>
                                     </div>
                                     </div>
      </form>
          </Expand>
            <button className="plain_button" onClick={() => this.toggle(2)}>Security & Privacy</button>
  <Expand
            open={this.state.collapsable_2}
            duration={500}
            styles={styles}
            transitions={transitions}
          >
 <form id="form">
                    <legend className="change_password_legend">Change Password</legend>
                    <input type="text" className="change_password_input" placeholder="Old Password" id="password" name ="password" value={this.state.password}
                                   onChange={this.handleChange.bind(this)}></input>

      <input type="text" className="change_password_input" placeholder="New Password" id="new_password" name ="new_password" value={this.state.new_password}
                                   onChange={this.handleChange.bind(this)}></input>


       <input type="text" className="change_password_input" placeholder="Confirm New Password" id="new_password_confirm" name ="new_password_confirm" value={this.state.new_password_confirm}
                                   onChange={this.handleChange.bind(this)}></input>

     <output type="text" className="change_password_input" id="output">{this.state.output}</output>
                    <button type="submit" className="update_button" onClick={this.handlePasswordUpdate.bind(this)}>Update</button>
                </form>
        </Expand>
            <button className="plain_button clear" onClick={() => this.toggle(3)}>About</button>
  <Expand
            open={this.state.collapsable_3}
            duration={500}
            styles={styles}
            transitions={transitions}
          >
      <p className="settings_about" >FET Wallet Version {VERSION}</p>
      <p className="settings_about" >Developed and Designed by Fetch.ai Cambridge</p>
  </Expand>

                <button className="large-button logout_button" onClick={this.HandleLogOut}>
                        Log out
                </button>
            </div>
            </div>
        );
    }
}