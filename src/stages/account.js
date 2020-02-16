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
import {format} from "../utils/format";
import Expand from "react-expand-animated";

export default class Account extends Component {

    constructor(props) {
        super(props)
        this.balance = this.balance.bind(this)
        this.fetchHistory = this.fetchHistory.bind(this)
        this.viewAll = this.viewAll.bind(this)
        this.hide = this.hide.bind(this)

        this.state = {
            balance: null,
            percentage: null,
            dollar_balance: null,
            address: Storage.getLocalStorage("address"),
            collapsable_1: true,
            collapsable_2: true,
            collapsable_3: false,
            history: null,
        }
    }

    async componentDidMount() {
        const [host, port] = await Bootstrap.server_from_name(NETWORK_NAME)
 this.api = new LedgerApi(host, port)
 setInterval(this.balance, BALANCE_CHECK_INTERVAL_MS)
 setInterval(this.fetchDollarPrice, DOLLAR_PRICE_CHECK_INTERVAL_MS)
 setInterval(this.fetchHistory.bind(null), TRANSACTION_HISTORY_CHECK_INTERVAL_MS)
    }

    /**
     * Fetch first page of history for first page.
     *
     * @param page_number
     */
    fetchHistory(page_number){
    fetch(ACCOUNT_HISTORY_URI)
      .then(response => {
          //debugger;
          this.processHistory(response)
      });
    }

    processHistory(response){
        if(response.status !== 200){
            return;
        }
        response.json().then(data => {
  // do something with your data

            if(response.detail === "Invalid page.") {
                console.log("Invalid page.")
                //debugger
                return;
            }

            if(typeof response.results !== "undefined" || response.results.length === 0) {
                //debugger
                console.log(" response.results !== \"undefined\" || response.results.length === 0")
                return;
            }

           this.setState({history: response.results})
debugger;
});
    }

    fetchDollarPrice(){
    fetch(DOLLAR_PRICE_URI)
      .then(data => {

          //debugger
          if(data.percentage === "number"){
               this.setState({ percentage: data.percentage }, this.calculateDollarBalance)
          }
      });
    }

   viewAll() {
                 this.setState({ collapsable_1: false,
    collapsable_2: false,
    collapsable_3: true});
  };

    hide(){
         this.setState({ collapsable_1: true,
    collapsable_2: true,
    collapsable_3: false});
  };



    calculateDollarBalance(){
       // if we have both a balance and a dollar price then we calculate the dollar balance,
        // otherwise we do not.
        if(this.state.balance === "null" || this.state.percentage === "null"){
            return;
        }

        const percentage = new BN(this.state.percentage)
        const balance =  new BN(this.state.balance, 16)

        let dollar_balance;
        if(!percentage.isZero() && !balance.isZero()){
             dollar_balance = balance.mul(percentage)
        } else {
            dollar_balance = 0;

        }
        this.setState({ dollar_balance: dollar_balance.toString(16) })
    }

    async balance(){
        let balance;
   try {
   balance = await this.api.tokens.balance(this.state.address);
  } catch {
      return;
  }
  this.setState({ balance: new BN(balance).toString(16) }, this.calculateDollarBalance)
    }

    render() {
         let account, plus, circle;

              const styles = {
      open: { background: " #1c2846" }
    };

    const transitions = ["height", "opacity", "background"];
      //   if(false) {
      //      account = chrome.runtime.getURL("account_icon.svg")
      // } else {
           account = "./assets/account_icon.svg"
           plus = "./assets/plus_icon.svg"
        circle = "./assets/fetch_circular_icon.svg"
     // }

        return (
          <div className="OverlayMain"><div className="OverlayMainInner">
                <div className='settings_title'>
                <img src={account} alt="Fetch.ai Account (ALT)" className='account'/>
                <div className='address_title_inner'>
                <h1 className="account_address">Account address</h1>
                    <br></br>
                <span>{format(this.state.address)}</span>
                         </div>
                <img className='cross' src={plus} onClick={goTo.bind(null, Settings)}/>
                     </div>
                <hr></hr>
          <Expand
            open={this.state.collapsable_1}
            duration={500}
            styles={styles}
            transitions={transitions}
          >
               <div className="balance_container">
               <img className='plus' alt="fetch circular logo" src={circle}/><br></br>
              {this.state.dollar_balance !== null ? <span>{this.state.balance} FET</span>: ""} <br></br>
              {this.state.dollar_balance > 0 ? <span>{this.state.dollar_balance} USD</span> : ""}
               </div>
                   <div className="small-button-container">
                     <button className="small-button" onClick={goTo.bind(null, Download)}>
                        Download
                    </button>
                    <button className="small-button" onClick={goTo.bind(null, Send)}>
                         Send
                    </button>
                   </div>
          </Expand>
    {Object.keys(this.state.history).length > 0 ?
    [<Expand
            open={this.state.collapsable_2}
            duration={500}
            styles={styles}
            transitions={transitions}
    >,

  <h1 className="account_address">History</h1>,
        <hr></hr>,
        <div>,
            <div className="history_item">,<span>{{this.state.history[0]}</span>,</div>,
            {Object.keys(this.state.history).length > 1 ? <div className="history_item"></div> : "" },
        </div>,
         <button className="large-button" onClick={this.viewAll}>
                        View All
          </button>,

    </Expand>] : ""}

           </div>
           </div>
        );
    }
}