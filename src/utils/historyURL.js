import {
  DEVNET_ACCOUNT_HISTORY_URI,
  MAINNET, MAINNET_ACCOUNT_HISTORY_URI,
   SELECTED_NETWORK,
  TESTNET, TESTNET_ACCOUNT_HISTORY_URI,

} from '../constants'

 import Storage from "../services/storage"
/**
 * return block explorer url (with accounts path) based on whichever network is users selected network.
 *
 * @returns {string}
 */

const historyURL = () => {
     const network = Storage.getLocalStorage(SELECTED_NETWORK)
let url;
        switch(network) {
  case TESTNET:
    url = TESTNET_ACCOUNT_HISTORY_URI
    break;
  case MAINNET:
   url = MAINNET_ACCOUNT_HISTORY_URI
    break;
  default:
    url = DEVNET_ACCOUNT_HISTORY_URI

        }

        url = MAINNET_ACCOUNT_HISTORY_URI
         return url;
  }

  export {historyURL}