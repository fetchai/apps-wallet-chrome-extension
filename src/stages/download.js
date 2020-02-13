import React, { Component } from "react";
import qrCode from 'qrcode-generator'
import {KEY_FILE_NAME} from "../constants";
import {goTo} from "../services/router";
import Account from "./account";
import {Storage} from "../services/storage"




export default class Download extends Component {

    constructor(props) {
        super(props)
        this.download = this.download.bind(this)
        this.make_QR = this.make_QR.bind(this)

        this.state = {
            address: Storage.getLocalStorage('address'),
            QR:""
        }
    }

    componentDidMount() {
  this.make_QR()
    }

    chop(val){
return val.substring(0, 12) + "..."
}

make_QR() {
        let qr = qrCode(4, 'M')
        qr.addData(this.state.address)
        qr.make()
    this.setState({QR: qr.createDataURL()});
    }

   async download() {
      const json_str = Storage.getLocalStorage('key_file');
    const element = document.createElement("a");
    const file = new Blob([json_str], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = KEY_FILE_NAME;
    document.body.appendChild(element);
    element.click();
}

    render() {

     let account, cross;

      //   if(false) {
      //      account = chrome.runtime.getURL("account_icon.svg")
      // } else {
           account = "./assets/account_icon.svg"
           cross = "./assets/cross_icon.svg"
     // }

        return (
            <div className="OverlayMain"><div className="OverlayMainInner">
                 <div className='settings_title'>
                <img src={account} alt="Fetch.ai Account (ALT)" className='account'/>
                <div className='address_title_inner'>
                <h1 className="account_address">Account address</h1>
                    <br></br>
                <span>{this.chop(this.state.address)}</span>
                         </div>
                <img className='cross' src={cross} onClick={goTo.bind(null, Account)}/>
                     </div>
                <hr></hr>
                <div className="qr_container">
                {this.state.QR ? <img src={this.state.QR} className='qr'/>: ''}
                <span className='qr_caption' >{this.chop(this.state.address)}</span>

                 <a  className='large-button fetch_link' href={"www.fetch.ai"}>
                        View on Fetch.ai
                    </a>
                    <button className='large-button' onClick={this.download}>
                         Export Private Key
                    </button>
                     </div>
            </div >
            </div >
        );
    }
}