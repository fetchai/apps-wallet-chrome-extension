import React, { Component } from "react";
import {Bootstrap, LedgerApi} from "fetchai-ledger-api/src/fetchai/ledger/api";
import {NETWORK_NAME} from "../constants";
import {formErrorMessage} from "../services/formErrorMessage.js";
import {Address} from "fetchai-ledger-api/src/fetchai/ledger/crypto/address";
import {Entity} from "fetchai-ledger-api/src/fetchai/ledger/crypto/entity";

export default class Send extends Component {

    constructor(props) {
        super(props)
        this.address = props.address;
        this.validate = this.validate.bind(this)
        this.transfer = this.transfer.bind(this)
        this.transferController = this.transferController.bind(this)
    }

    async componentDidMount() {
         const [host, port] = await Bootstrap.server_from_name(NETWORK_NAME)
        this.api = new LedgerApi(host, port)
    }

    /**
     * Controls logic to decide if we can do transfer, then calls transfer method if we can.
     *
     * @param event
     * @returns {Promise<void>}
     */
    async transferController(event){
        event.preventDefault()
        let valid = await this.validate(event);

        if(valid){
             const to_address = event.target[0]
             const amount = event.target[1]
            await this.transfer(to_address, amount)
        }
    }

    async transfer(to, amount){
         const tx2 = await this.api.tokens.transfer(this.entity, to, amount, 20).catch((error) => {
        console.log('error occured: ' + error)
        throw new Error()
    })

    await this.api.sync([tx2]).catch(errors => console.log(errors))
    }


    validAddress(address){
                //todo swap to is_address when Ed updates public SDK
         try {
              new Address(address)
        } catch(e){
            return false;
        }
        return true;
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
        const password = event.target[1]

       if(!this.validAddress(to_address)){
                    formErrorMessage("to_address", "Invalid Address")
       }

        let balance
        try {
              balance = await this.api.tokens.balance(this.address)
        } catch (e) {
            // error handling logic in-case key is invalid, or network request fails.
          //  add logic here
          //form_error_message("to_address", "Network Error")
              console.log('error ossssssccured: ')
        }

        if (balance < amount) {
          formErrorMessage("amount", `Insufficient funds ( Balance: ${balance})`)
          return false;
        }

         const json_str = localStorage.getItem('key_file')

        this.entity = await Entity._from_json_object(JSON.parse(json_str, password)).catch(() => {
              formErrorMessage("password", `Password Incorrect`)
            return false;
        })

        return true;
    }

    render() {
        return (
            <form onSubmit={this.transferController}>
                Recipient Address:
                                    <input type="text" name="to_address" value="to_address"></input>
                                    <input type="number" id="amount" name="amount" step='1'></input>
                                    <input type="password" id="password" name="password"></input>
                                    <input type="submit" value="Transfer"></input>
                            </form>
        );
    }
}