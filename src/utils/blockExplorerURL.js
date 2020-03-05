import {
  LOCALHOST,
  MAINNET,
  MAINNET_BLOCKEXPLORER, SELECTED_NETWORK,
  TESTNET,
  TESTNET_BLOCKEXPLORER
} from '../constants'

 import Storage from "../services/storage"
/**
 * return block explorer url (with accounts path) based on whichever network is users selected network.
 *
 * @returns {string}
 */


const blockExplorerURL = () => {
     const network = Storage.getLocalStorage(SELECTED_NETWORK)
        if(network === TESTNET)  return TESTNET_BLOCKEXPLORER;
        else if(network === MAINNET) return MAINNET_BLOCKEXPLORER;
        else if(network === LOCALHOST) return '';
        else throw new Error(`the network from storage : ${network} is not an expected network`)
  }

  export {blockExplorerURL}