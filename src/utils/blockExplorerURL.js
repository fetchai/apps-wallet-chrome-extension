import { MAINNET_BLOCKEXPLORER, NETWORKS_ENUM, STORAGE_ENUM, TESTNET_BLOCKEXPLORER } from '../constants'


/**
 * return block explorer url (with accounts path) based on whichever network is users selected network.
 *
 * @returns {string}
 */


const blockExplorerURL = (url_bit = 'accounts/') => {
  const network = localStorage.getItem(STORAGE_ENUM.SELECTED_NETWORK)
  if (network === NETWORKS_ENUM.TESTNET) return TESTNET_BLOCKEXPLORER + url_bit
  else if (network === NETWORKS_ENUM.MAINNET) return MAINNET_BLOCKEXPLORER + url_bit
  else if (network === NETWORKS_ENUM.LOCALHOST) return ''
  else throw new Error(`the network from storage : ${network} is not an expected network`)
}

export { blockExplorerURL }