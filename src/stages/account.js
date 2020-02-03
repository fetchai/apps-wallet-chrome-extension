import React, { Component } from "react";
import {Bootstrap, LedgerApi} from "fetchai-ledger-api/src/fetchai/ledger/api";
import {NETWORK_NAME} from "../constants";
import {goTo} from "route-lite";
import Download from "./download";
import Send from "./send";
import Settings from "./settings";
import {Storage} from "../services/storage"

export default class Account extends Component {

    constructor(props) {
        super(props)
        this.balance = this.balance.bind(this)
        this.address = localStorage.getItem("address");
        this.state = {
            balance: ''
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
      this.setState({ balance: "unavailable" })

   // throw new Error('The following error occurred checking the balance: ' + e);
  }
  this.setState({ balance: balance })
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