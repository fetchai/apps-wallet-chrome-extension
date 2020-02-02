import {Entity} from "fetchai-ledger-api/src/fetchai/ledger/crypto/entity";
import {Address} from "fetchai-ledger-api/src/fetchai/ledger/crypto/address";

export default class Authentication {

    static isLoggedIn() {
       const logged_in = localStorage.getItem('logged_in');
       return Boolean(JSON.parse(logged_in))
}

static logOut() {
    localStorage.setItem('logged_in', "false");
    }

    /**
     * Check if password decrypts to give entity corresponding to the correct address
     *
     * @param password
     * @returns {Promise<boolean>}
     */
    static async correctPassword(password){
         const key_file = localStorage.getItem('key_file');
          const address = localStorage.getItem('address');
          let valid_flag = true
          const entity = await Entity._from_json_object(JSON.parse(key_file), password).catch(() => valid_flag = false)
            // check it creates correct address from decryption.
          if (new Address(entity).toString() !== address) valid_flag = false
          return valid_flag;
}

}



export { Authentication }