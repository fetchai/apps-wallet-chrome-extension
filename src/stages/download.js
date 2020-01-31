import React, { Component } from "react";
import qrCode from 'qrcode-generator'
import {KEY_FILE_NAME} from "../constants";

export default class Download extends Component {

    constructor(props) {
        super(props)
        this.download = this.download.bind(this)
        this.make_QR = this.make_QR.bind(this)
        this.state = {
            address: props.address
        }
    }

    componentDidMount() {
  this.make_QR()
    }

    make_QR() {
        let qr = qrCode(4, 'M')
        debugger;
        const a = this.state.address
        console.log("THIS IS A : " + a);
        qr.addData(a)
        qr.make()
        document.getElementById('qr').innerHTML = qr.createImgTag();
    }

   async download() {
      const json_str = localStorage.getItem('key_file');
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
                <div id="qr"></div>
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