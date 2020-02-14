import React, { Component } from "react";
import {Bootstrap, LedgerApi} from "fetchai-ledger-api";
import {NETWORK_NAME, DOLLAR_PRICE_URI, DOLLAR_PRICE_CHECK_INTERVAL_MS, BALANCE_CHECK_INTERVAL_MS,
ACCOUNT_HISTORY_URI, TRANSACTION_HISTORY_CHECK_INTERVAL_MS } from "../constants";
import {goTo} from "../services/router";
import {BN} from 'bn.js'
import Download from "./download";
import Send from "./send";
import Settings from "./settings";
import {Storage} from "../services/storage"

export default class Account extends Component {

    constructor(props) {
        super(props)
        this.balance = this.balance.bind(this)
        this.fetchHistory = this.fetchHistory.bind(this)

        this.state = {
            balance: null,
            percentage: null,
            dollar_balance: null,
            address: Storage.getLocalStorage("address")
        }
    }

    async componentDidMount() {



        const [host, port] = await Bootstrap.server_from_name(NETWORK_NAME)
 this.api = new LedgerApi(host, port)
// setInterval(this.balance, BALANCE_CHECK_INTERVAL_MS)
 setInterval(this.fetchDollarPrice, DOLLAR_PRICE_CHECK_INTERVAL_MS)
 setInterval(this.fetchHistory, TRANSACTION_HISTORY_CHECK_INTERVAL_MS)
    }


    // i will use this one to format it and then another afterwards.
    fetchHistory(page_number){
    fetch(ACCOUNT_HISTORY_URI)
     .then(response => response.json())
      .then(data => {
          debugger;
      });
    }


    fetchDollarPrice(){
    fetch(DOLLAR_PRICE_URI)
      .then(response => response.json())
      .then(data => {
          if(data.percentage === "number"){
               this.setState({ percentage: data.percentage }, this.calculateDollarBalance)
          }
      });
    }

    calculateDollarBalance(){
       // if we have both a balance and a dollar price then we calculate the dollar balance,
        // otherwise we do not.
        if(this.state.balance === "null" || this.state.percentage === "null"){
            return;
        }

        // const dollar_balance = new BN(this.state.balance, 16).mul(new BN(this.state.percentage))
        //
        // this.setState({ dollar_balance: dollar_balance.toString(16) })
    }

    async balance(){
        let balance;
   try {
   balance = await this.api.tokens.balance(this.state.address);
  } catch {
       //todo ask josh if this is ok correct then delete.
       // just leave balance as is if unable to query it over network.
  }
const d = new BN(balance).toString(16)
  debugger
 // this.setState({ balance: d }, this.calculateDollarBalance)
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
           </div>
        );
    }
}