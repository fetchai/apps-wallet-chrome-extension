import {Entity} from "fetchai-ledger-api/src/fetchai/ledger/crypto/entity";
import {Address} from "fetchai-ledger-api/src/fetchai/ledger/crypto/address";
import {Storage} from "./storage"

export default class Authentication {

static isLoggedIn() {
       const logged_in = Storage.getLocalStorage('logged_in');
       return Boolean(JSON.parse(logged_in))
}

static hasSavedKey() {
        return Storage.getLocalStorage('key_file') !== null
}

static logOut() {
    Storage.setLocalStorage('logged_in', "false");
    }

    /**
     * Check if password decrypts to give entity corresponding to the correct address as saved in local storage
     * using key file also saved in local storage.
     *
     * @param password
     * @returns {Promise<boolean>}
     */
    static async correctPassword(password){
         const key_file = Storage.getLocalStorage('key_file');
          const address = Storage.getLocalStorage('address');
          let valid_flag = true
        let entity;

            entity = await Entity._from_json_object(JSON.parse(key_file), password).catch(() => valid_flag = false)

            // check it creates correct address from decryption.
        debugger;
          if (valid_flag && new Address(entity).toString() !== address) valid_flag = false
          return valid_flag;
}

}

export { Authentication }