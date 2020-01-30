import React, { Component } from "react";
import {Bootstrap, LedgerApi} from "fetchai-ledger-api/src/fetchai/ledger/api";
import {NETWORK_NAME} from "../constants";
import {form_error_message} from "../services/form_error_message";

export default class Send extends Component {

    constructor(props) {
        super(props)
        this.address = props.address;
        this.validate = this.validate.bind(this)
        this.transfer = this.transfer.bind(this)
        this.transfer_controller = this.transfer_controller.bind(this)
    }


    async componentDidMount() {
         const [host, port] = await Bootstrap.server_from_name(NETWORK_NAME)
        this.api = new LedgerApi(host, port)
    }

    async transfer_controller(event){
        event.preventDefault()
        let valid = await this.validate(event);

        if(valid){
             const to_address = event.target[0]
             const amount = event.target[1]
            await this.transfer(to_address, this.address, amount)
        }
    }

    async transfer(to, from, amount){
         const tx2 = await this.api.tokens.transfer(identity1, identity2, amount, 20).catch((error) => {
        console.log('error occured: ' + error)
        throw new Error()
    })

    await api.sync([tx2]).catch(errors => sync_error(errors))
    }

    /**
     *
     *
     * @param event
     * @returns {Promise<boolean>}
     */
    async validate(event){
        const to_address = event.target[0]
        const amount = event.target[1]

        //todo swap to is_address when Ed updates public SDK
        try {
              new Address(to_address)
        } catch(e){
         form_error_message("to_address", "Invalid Address")
            return false;
        }
        let balance
        try {
              balance = await this.api.tokens.balance(this.address)
        } catch (e) {
            // error handling logic in-case key is invalid, or network request fails.
          //  add logic here
          //form_error_message("to_address", "Network Error")
        }

        if (balance < amount) {
          form_error_message("amount", `Insufficient funds ( Balance: ${balance})`)
          return false;
        }
        return true;
    }







    render() {
        return (
            <form onSubmit={this.transfer_controller}>
                                    Recipient Address:<br>
                                    <input type="text" name="to_address" value="to_address">
                                    <input type="number" id="amount" name="amount" step='1'></input>
                                    <input type="password" id="password" name="password"></input>
                                        <output name="result" htmlFor="a b">60</output>
                                    <input type="submit" value="Transfer"></input>
                            </form>
        );
    }
}