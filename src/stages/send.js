import React, {Component} from "react";
import {Bootstrap, LedgerApi} from "fetchai-ledger-api/src/fetchai/ledger/api";
import {
    DEFAULT_FEE_LIMIT,
    DOLLAR_PRICE_CHECK_INTERVAL_MS,
    DOLLAR_PRICE_URI,
    EXTENSION,
    NETWORK_NAME
} from "../constants";
import {formErrorMessage} from "../services/formErrorMessage.js";
import {Entity} from "fetchai-ledger-api/src/fetchai/ledger/crypto/entity";
import {validAddress} from "../utils/validAddress";
import Authentication from "../services/authentication";
import {Storage} from "../services/storage"
import {format} from "../utils/format";
import {goTo} from "../services/router";
import Settings from "./settings";
import Account from "./account";
import {getAssetURI} from "../utils/getAsset";
import {fetchResource} from "../utils/fetchRescource";

export default class Send extends Component {

    constructor(props) {
        super(props);
        this.address = Storage.getLocalStorage('address');
        this.sufficientFunds = this.sufficientFunds.bind(this);
        this.transfer = this.transfer.bind(this);
        this.transferController = this.transferController.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.fetchDollarPrice = this.fetchDollarPrice.bind(this);

        this.state = {
            password: "",
            to_address: "",
            percentage: null,
            amount: null,
            address: Storage.getLocalStorage("address"),
        }
    }

    async componentDidMount() {
        const [HOST, PORT] = await Bootstrap.server_from_name(NETWORK_NAME);
        // const HOST = '127.0.0.1'
        // const PORT = 8000
        this.api = new LedgerApi(HOST, PORT);
        this.fetchDollarPrice();
        this.balance_request_loop = setInterval(this.fetchDollarPrice, DOLLAR_PRICE_CHECK_INTERVAL_MS)

    }

    componentWillUnmount() {
        clearInterval(this.balance_request_loop)
    }

    fetchDollarPrice() {

        if(EXTENSION){
            fetchResource(DOLLAR_PRICE_URI).then((response) => this.handleDollarResponse(response))
                .catch((err) => {
                    console.log('Fetch Error :-S', err);
                });
        } else {
            fetch(DOLLAR_PRICE_URI).then((response) => this.handleDollarResponse(response))
                .catch((err) => {
                    console.log('Fetch Error :-S', err);
                });
        }
    }

    /**
     *
     *
     * @param response
     */
    handleDollarResponse(response){
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                response.json().then((data) => {
                    console.log(data);

                    // this indicates bad api call so rather then set to null we just leave pre-existing value in state.
                    if (typeof data.percentage !== "number") return

                        let dollar
                        if (this.state.amount === null) {
                            dollar = null;
                        } else if (this.state.amount === 0) {
                                dollar = 0;
                        } else {
                                dollar = this.calculateDollarDisplayAmount(this.state.amount, data.percentage)
                            }

                        this.setState({percentage: data.percentage, dollar: dollar})
                });

    }


    /**
     * returns the display string of number of dollars ( and 2 decimal places )
     * from the amount (FET) and the percentage returned by
     *
     * @param amount
     * @param percentage
     * @returns {string}
     */
    calculateDollarDisplayAmount(amount, percentage) {
        return Number.parseFloat(amount * percentage).toFixed(2);
    }


    handleAmountChange(event) {
        if (this.state.percentage === null) return this.setState({dollar: null, amount: event.target.value});
        debugger
        //todo 53 byte issue
        if (event.target.value == 0) return this.setState({dollar: 0});

        this.setState({
            dollar: this.calculateDollarDisplayAmount(event.target.value, this.state.percentage),
            amount: event.target.value
        })
    }


    handleChange(event) {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change)
    }

    /**
     * Controls logic to decide if we can do transfer, then calls transfer method if we can.
     *
     * @param event
     * @returns {Promise<void>}
     */
    async transferController(event) {
        event.preventDefault();
        const to_address = event.target[0].value;
        const amount = event.target[1].value;
        const password = event.target[2].value;

        let error_flag = false;

        if (!validAddress(to_address)) {
            formErrorMessage("to_address", "Invalid Address");
            error_flag = true
        }

        if (!(await Authentication.correctPassword(password))) {
            formErrorMessage("password", "Incorrect Password");
            error_flag = true
        }

        if (!this.sufficientFunds(amount)) {
            error_flag = true;
        }

        const json_str = Storage.getLocalStorage('key_file');

        if (error_flag) return;

        const entity = await Entity._from_json_object(JSON.parse(json_str), password);
        await this.transfer(entity, to_address, amount)
    }

    async transfer(entity, to, amount) {
        const tx2 = await this.api.tokens.transfer(entity, to, amount, DEFAULT_FEE_LIMIT).catch((error) => {
            console.log('error occured: ' + error);
            throw new Error()
        });

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
            formErrorMessage("amount", `Network Error1`);
            return false;
        });

        if (balance < transfer_amount) {
            formErrorMessage("amount", `Insufficient funds ( Balance: ${balance})`);
            return false;
        }

        return true
    }


    render() {
        return (
            <div className="OverlayMain">
                <div className="OverlayMainInner">
                    <div className='settings_title'>
                        <img src={getAssetURI("account_icon.svg")} alt="Fetch.ai Account (ALT)" className='account'/>
                        <div className='address_title_inner'>
                            <h1 className="account_address">Account address</h1>
                            <br></br>
                            <span>{format(this.state.address)}</span>
                        </div>
                        <img className='cross' src={getAssetURI("plus_icon.svg")} onClick={goTo.bind(null, Settings)}/>
                    </div>
                    <hr></hr>
                    <h3 className="send-title">Send</h3>
                    <form onSubmit={this.transferController}>
                        <div className="send_form_row">
                            <label htmlFor="to_address">Account<br></br> Number: </label>
                            <input className="send_form_input" type="text" name="to_address" id="to_address"
                                   onChange={this.handleChange.bind(this)} value={this.state.to_address}></input>
                        </div>
                        <div className="send_form_row">
                            <label htmlFor="amount">Amount: </label>
                            <div className="send_form_row_output_wrapper send_form_input">
                                <div className="amount_stack_wrapper">
                                    <input className="amount_input" type="number" placeholder="0 FET" name="amount"
                                           id="amount" onChange={this.handleAmountChange.bind(this)} name="amount"
                                           value={this.state.amount}></input>
                                    <br></br>
                                    <output>{typeof this.state.dollar !== "undefined" && this.state.dollar !== null ? '$' + this.state.dollar + " USD" : ""}</output>
                                </div>
                            </div>
                        </div>
                        <div className="send_form_row send_form_row_password">
                            <label htmlFor="password">Password: </label>
                            <input className="send_form_input" type="password" name="password"
                                   onChange={this.handleChange.bind(this)} value={this.state.password}
                                   id="password"></input>
                        </div>
                        <span id="send_error"></span>
                        <div className="small-button-container">
                            <button className="small-button send_buttons" onClick={goTo.bind(null, Account)}>
                                Cancel
                            </button>
                            <input className="small-button send_buttons" type="submit" value="Send"></input>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}