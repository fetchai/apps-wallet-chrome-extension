import { ACCOUNT_HISTORY_URI, NETWORKS_ENUM, STORAGE_ENUM } from '../constants'

import Storage from '../services/storage'

/**
 * return block explorer url (with accounts path) based on whichever network is users selected network.
 *
 * @returns {string}
 */


const historyURL = (address, page_number) => {
  const network = localStorage.getItem(STORAGE_ENUM.SELECTED_NETWORK)
  if (!Object.values(NETWORKS_ENUM).some(el => el === network)) throw new Error('selected network must be within networks enum')

  let url = ACCOUNT_HISTORY_URI.replace('NETWORKNAME', network).replace('ACCOUNTADDRESS', address)
    .replace('NETWORKNAME', network).replace('ACCOUNTADDRESS', '3bcm1Mi9mvvSCTwNdkz9tU2K6Yo2AdohYw2y2wimTJJ9eJZa1')
  return url + '?page=' + page_number
}
export { historyURL }