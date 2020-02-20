/**
 * shows a hover error message form input element by id
 *
 * @param id
 * @param message
 */
import { EXTENSION } from '../constants'

const formErrorMessage = (id, message) => {
    //todo isolate from other iframes by changing specificity.
// return
    if(EXTENSION) {
        let iframe = document.getElementById('my-frame');
        debugger;
           let y = (iframe.contentWindow || iframe.contentDocument);
            if (y.document) {
                y = y.document;
            }
            let password = y.getElementById(id)
            password.setCustomValidity(message);
            password.reportValidity();
        // debugger
        // const iframes = Array.prototype.slice.call(selection);
        //
        // iframes.forEach(function (iframe) {
        //     debugger;
        //     let y = (iframe.contentWindow || iframe.contentDocument);
        //     if (y.document) {
        //         y = y.document;
        //     }
        //
        //     let flag =  y.getElementById("my-extension-root-inner")
        //
        //      if(flag !== null){
        //     let password = y.getElementById(id)
        //     password.setCustomValidity(message);
        //     password.reportValidity();
        //     }
        // });
    } else {

    let password = document.getElementById(id);
    password.setCustomValidity(message);
    password.reportValidity();
    }

};

export {formErrorMessage}