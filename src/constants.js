// name of network to connect to.
//const NETWORK_NAME = 'localhost'
 const NETWORK_NAME = 'devnet'
// name to assign to downloadable key file on the end-users system.
const KEY_FILE_NAME = 'private_key.json'
const VERSION = '1.0.0'
// flag to change when running as extension or in browser.
const EXTENSION = false
const DEFAULT_FEE_LIMIT = 20

// uris we use for requests for data
const DOLLAR_PRICE_URI = 'https://blockexplorer.geuwe2a-devnet.fetch-ai.com/api/v1/get_price/'
const ACCOUNT_HISTORY_URI = 'https://blockexplorer.geuwe2a-devnet.fetch-ai.com/api/v1/transactions/?digest=0x'
const BOOTSTRAP_REQUEST_URI = `https://bootstrap.fetch.ai/endpoints/?network=${NETWORK_NAME}`

// the intervals in MS we poll for data at
const DOLLAR_PRICE_CHECK_INTERVAL_MS = 5000
const BALANCE_CHECK_INTERVAL_MS = 1000
const TRANSACTION_HISTORY_CHECK_INTERVAL_MS = 5000

// default time given to transition an element, usually the collapsables
const TRANSITION_DURATION_MS = 500

// the names of the keys of the properties saved in local storage
const LOGGED_IN = 'logged_in'
const ADDRESS = 'address'
const KEY_FILE = 'key_file'
const DOLLAR_PRICE = 'dollar_price'

export {
  LOGGED_IN, ADDRESS, KEY_FILE, DOLLAR_PRICE,
  BOOTSTRAP_REQUEST_URI,
  ACCOUNT_HISTORY_URI,
  TRANSACTION_HISTORY_CHECK_INTERVAL_MS,
  TRANSITION_DURATION_MS,
  NETWORK_NAME,
  KEY_FILE_NAME,
  VERSION,
  EXTENSION,
  DEFAULT_FEE_LIMIT,
  DOLLAR_PRICE_URI,
  DOLLAR_PRICE_CHECK_INTERVAL_MS,
  BALANCE_CHECK_INTERVAL_MS
}