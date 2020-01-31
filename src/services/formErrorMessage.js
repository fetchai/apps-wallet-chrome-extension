/**
 * shows a hover error message form input element by id
 *
 * @param id
 * @param message
 */
const formErrorMessage = (id, message) =>
{
    let password = document.getElementById(id);
    password.setCustomValidity(message);
    password.reportValidity();
}

export {formErrorMessage}