/**
 * shows a hover error message form input element by id
 *
 * @param id
 * @param message
 */
import { EXTENSION } from '../constants'
import { getElementById } from '../utils/getElementById'

const formErrorMessage = (id, message) => {
  //todo isolate from other iframes by changing specificity.
// return
  if (EXTENSION) {

    let password = getElementById(id)
    password.setCustomValidity(message)
    password.reportValidity()
  } else {

    let password = document.getElementById(id)
    password.setCustomValidity(message)
    password.reportValidity()
  }

}

export { formErrorMessage }