import React, { Component } from "react";
import qrCode from 'qrcode-generator'
import {KEY_FILE_NAME} from "../constants";
import {goTo} from "../services/router";
import Account from "./account";
import {Storage} from "../services/storage"
import {format} from "../utils/format";

export default class Download extends Component {
    constructor(props) {
        super(props)
        this.download = this.download.bind(this)
        this.make_QR = this.make_QR.bind(this)

        this.state = {
            address: Storage.getLocalStorage('address'),
            QR:"",
            hover_1: false
        }
    }

    componentDidMount() {
  this.make_QR()
    }

make_QR() {
        let qr = qrCode(4, 'M')
        qr.addData(this.state.address)
        qr.make()
    this.setState({QR: qr.createDataURL(2, 0)});
    }

    toggleHover(index) {
             const hover = "hover_" + index;
             this.setState(prevState => ({ [hover]: !prevState[hover] }));
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
                <span>{format(this.state.address)}</span>
                         </div>
                <img className='cross' src={cross} onClick={goTo.bind(null, Account)}/>
                     </div>
                <hr></hr>
                <div className="qr_container">
                {this.state.QR ? <img src={this.state.QR} className='qr'/>: ''}
                <span className='qr_caption'  onMouseOver={() => this.toggleHover(1)}
                 onMouseOut={() => this.toggleHover(1)}>{(this.state.hover_1) ? this.state.address : format(this.state.address)}</span>

                 <a  className='large-button fetch_link account-button' href={"www.fetch.ai"}>
                        View on Fetch.ai
                    </a>
                    <button className='large-button account-button' onClick={this.download}>
                         Export Private Key
                    </button>
                     </div>
            </div >
            </div >
        );
    }
}