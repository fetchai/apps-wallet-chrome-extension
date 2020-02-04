import React, { Component } from "react";
import qrCode from 'qrcode-generator'
import {KEY_FILE_NAME} from "../constants";
import {goTo} from "route-lite";
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
        return (
            <div>
                  <button className='btn btn-primary btn-block' onClick={goTo.bind(null, Account)}>
                        X
                </button>
                {this.state.QR ? <img src={this.state.QR} width="82" height="82"/>: ''}
                {/*<div id="qr">{this.state.QR}</div>*/}
            <span>{this.state.address}</span>
                 <a className='btn btn-primary btn-block' href={"www.fetch.ai"}>
                        View on Fetch.ai
                    </a>
                    <button className='btn btn-primary btn-block' onClick={this.download}>
                         Export Private Key
                    </button>
            </div >
        );
    }
}