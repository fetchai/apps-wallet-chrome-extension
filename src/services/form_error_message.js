


const form_error_message = (id, message) =>
{
    let password = document.getElementById(id);
    password.setCustomValidity(message);
    password.reportValidity();
}

export {form_error_message}