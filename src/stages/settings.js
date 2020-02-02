/*global chrome*/
import React, { Component } from "react";
import {goBack, goTo} from "route-lite";
import Account from "./account";
import Initial from "./initial";
import {Authentication} from "../services/authentication";
import Expand from "react-expand-animated";
import {BoxExpand, BoxExpand1, BoxToggle, Button, ExpandBoxes} from "../css/main.styles";
import {handleChange} from "../utils/misc"

export default class Settings extends Component {

    constructor(props) {
        super(props)
                this.HandleLogOut = this.HandleLogOut.bind(this)
                this.toggle = this.toggle.bind(this)
                this.handleChange = handleChange.bind(this)

         this.state = {
    collapsable_1: false,
    collapsable_2: false,
    collapsable_3: false,
    password: '',
    password_confirm: '',
    new_password: ''
  };

    }

      toggle(index) {
    let collapse = "isOpen" + index;
    this.setState(prevState => ({ [collapse]: !prevState[collapse] }));
  };



    handlePasswordUpdate(){



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
                    <legend>Confirm password with HTML5</legend>
                            <input type="text" placeholder="Password" id="password" name ="password" value={this.state.password}
                                   onChange={this.handleChange.bind(this)} required></input>
                            <input type="text" placeholder="Confirm Password" id="password_confirm" name ="password_confirm" value={this.state.password_confirm}
                                   onChange={this.handleChange.bind(this)} required></input>
                            <input type="text" placeholder="Confirm Password" id="password_confirm" name ="password_confirm" value={this.state.new_password}
                                   onChange={this.handleChange.bind(this)} required></input>
                    <button type="submit" className="pure-button pure-button-primary" onClick={this.handlePasswordUpdate}>Update</button>
                </form>

                <BoxToggle>
            <Button onClick={() => this.toggle(3)}>About</Button>
          </BoxToggle>




                <button className='btn btn-primary btn-block' onClick={this.HandleLogOut}>
                        Log out
                </button>
            </div>
        );
    }
}