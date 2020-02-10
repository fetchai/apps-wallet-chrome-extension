import React, { Component } from "react";
import {Bootstrap, LedgerApi} from "fetchai-ledger-api/src/fetchai/ledger/api";
import {DEFAULT_FEE_LIMIT, NETWORK_NAME} from "../constants";
import {formErrorMessage} from "../services/formErrorMessage.js";
import {Entity} from "fetchai-ledger-api/src/fetchai/ledger/crypto/entity";
import {validAddress} from "../utils/validAddress";
import Authentication from "../services/authentication";
import {Storage} from "../services/storage"

export default class Send extends Component {

    constructor(props) {
        super(props)
        this.address = Storage.getLocalStorage('address');
        this.sufficientFunds = this.sufficientFunds.bind(this)
        this.transfer = this.transfer.bind(this)
        this.transferController = this.transferController.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.state = {
            password: "",
            to_address: "",
            amount: 0
        }
    }

    async componentDidMount() {
         const [host, port] = await Bootstrap.server_from_name(NETWORK_NAME)
        const HOST = '127.0.0.1'
        const PORT = 8000
        this.api = new LedgerApi(HOST, PORT)
    }


         handleChange(event)
      {
    let change = {}
    change[event.target.name] = event.target.value
    this.setState(change)
      }

    /**
     * Controls logic to decide if we can do transfer, then calls transfer method if we can.
     *
     * @param event
     * @returns {Promise<void>}
     */
    async transferController(event){
        debugger;
        event.preventDefault()
        let error_flag = false;
          const to_address = event.target[0].value
         const amount = event.target[1].value
        const password = event.target[2].value
         if(!validAddress(to_address)){
             formErrorMessage("to_address", "Invalid Address")
             error_flag = true
       }

         if(!(await Authentication.correctPassword(password))) {
                                 formErrorMessage("password", "Incorrect Password")
                                 error_flag = true
         }

         if(!this.sufficientFunds(amount)){
             error_flag = true;
         }

        const json_str = Storage.getLocalStorage('key_file')

        if(error_flag) return;

        this.entity = await Entity._from_json_object(JSON.parse(json_str), password)
        await this.transfer(to_address, amount)
    }

    async transfer(to, amount){
         const tx2 = await this.api.tokens.transfer(this.entity, to, amount, DEFAULT_FEE_LIMIT).catch((error) => {
        console.log('error occured: ' + error)
        throw new Error()
    })

    await this.api.sync(tx2).catch(errors => console.log(errors))
    }


    /**
     * checks if we have sufficient funds
     *
     * @param event
     * @returns {Promise<boolean>}
     */
    async sufficientFunds(transfer_amount) {

        const balance = await this.api.tokens.balance(this.address).catch(() => {
            formErrorMessage("amount", `Network Error1`)
            return false;
        })

        if (balance < transfer_amount) {
            formErrorMessage("amount", `Insufficient funds ( Balance: ${balance})`)
            return false;
        }

        return true
    }


    render() {
        return (
            <form onSubmit={this.transferController}>
                Recipient Address:
                                    <input type="text" name="to_address"  id="to_address"  onChange={this.handleChange.bind(this)} value={this.state.to_address}></input>
                                    <input type="number" name="amount" id="amount"  onChange={this.handleChange.bind(this)} name="amount" value={this.state.amount} step='1'></input>
                                    <input type="text" name="password"  onChange={this.handleChange.bind(this)} value={this.state.password} id="password"></input>
                                    <span id ="send_error"></span>
                                    <input type="submit" value="Transfer"></input>
                            </form>
        );
    }
}