/**
 * shows a hover error message form input element by id
 *
 * @param id
 * @param message
 */
const formErrorMessage = (id, message) => {
//     var selection = document.getElementsByTagName('iframe');
// var iframes = Array.prototype.slice.call(selection);
//
// iframes.forEach(function(iframe) {
//     var y = (iframe.contentWindow || iframe.contentDocument);
// if (y.document) {
//     y = y.document;
// }
// let password = y.getElementById(id)
//  password.setCustomValidity(message);
//     password.reportValidity();
// });


    let password = document.getElementById(id);
    password.setCustomValidity(message);
    password.reportValidity();
};

export {formErrorMessage}