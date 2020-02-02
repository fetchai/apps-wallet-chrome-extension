import React, { Component } from "react";
import {Bootstrap, LedgerApi} from "fetchai-ledger-api/src/fetchai/ledger/api";
import {NETWORK_NAME} from "../constants";
import {goTo} from "route-lite";
import Download from "./download";
import Send from "./send";
import Settings from "./settings";

export default class Account extends Component {

    constructor(props) {
        super(props)
        debugger

        this.balance = this.balance.bind(this)
        this.address = localStorage.getItem("address");
        // account balance in hex
        this.state = {
            balance: 'eeee'
        }
    }

    async componentDidMount() {
        const [host, port] = await Bootstrap.server_from_name(NETWORK_NAME)
 this.api = new LedgerApi(host, port)
        debugger;
 setInterval(this.balance, 1000)
    }

    async balance(){
        let balance;
try {
   balance = await this.api.tokens.balance(this.address);
  } catch (e) {
   // throw new Error('The following error occurred checking the balance: ' + e);
  }
  this.setState({ balance: 44 })
    }

    render() {
        return (
            <div>
            <button className='btn btn-primary btn-block' onClick={goTo.bind(null, Settings)}>
                        Settings
                    </button>
            <span>{this.state.balance}</span>
                 <button className='btn btn-primary btn-block' onClick={goTo.bind(null, Download)}>
                        Download
                    </button>
                    <button className='btn btn-primary btn-block' onClick={goTo.bind(null, Send)}>
                         Send
                    </button>
            </div >
        );
    }
}