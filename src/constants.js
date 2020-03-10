
// const NETWORK_NAME = 'devnet'
// name to assign to downloadable key file on the end-users system.
const KEY_FILE_NAME = 'private_key.json'
const VERSION = '1.0.0'

// flag to change when running as extension or in browser.
const EXTENSION = true
// fee limit for transactions.
const DEFAULT_FEE_LIMIT = 20

// uris we use for requests for data
const DOLLAR_PRICE_URI = 'https://blockexplorer.geuwe2a-devnet.fetch-ai.com/api/v1/get_price/'

const ACCOUNT_HISTORY_URI = `https://blockexplorer.geuwe2a-NETWORKNAME.fetch-ai.com/api/v1/accounts/ACCOUNTADDRESS/transfers`

const BOOTSTRAP_REQUEST_URI = `https://bootstrap.fetch.ai/endpoints/?network=`

// the intervals in MS we poll for data at
const DOLLAR_PRICE_CHECK_INTERVAL_MS = 5000
const BALANCE_CHECK_INTERVAL_MS = 1000
const TRANSACTION_HISTORY_CHECK_INTERVAL_MS = 5000

// copy hover messages
const COPIED_MESSAGE = "Copied!";
const COPY_ADDRESS_TO_CLIPBOARD_MESSAGE = "Copy Address to clipboard";


// default time given to transition an element, usually the collapsables
const TRANSITION_DURATION_MS = 500


// exhaustive list of keys with which properties are saved in local storage
const STORAGE_ENUM = Object.freeze({"LOGGED_IN": 'logged_in',
  "ADDRESS": 'address',
  "KEY_FILE": 'key_file',
  "DOLLAR_PRICE": 'dollar_price',
  "SELECTED_NETWORK": 'selected_network'})

// urls for block explorers (/accounts dir)
const TESTNET_BLOCKEXPLORER = 'https://explore-testnet.fetch.ai/accounts/'
const MAINNET_BLOCKEXPLORER = 'https://explore.fetch.ai/accounts/'

// network names (must be same as strings returned by bootstraps list networks, other than localhost)
const NETWORKS_ENUM = Object.freeze({"TESTNET": 'testnet', "MAINNET": 'mainnet', "LOCALHOST": 'localhost'})

// default network to give to them use on create and recover.
const DEFAULT_NETWORK = NETWORKS_ENUM.TESTNET;

// name of network to connect to as an over-ride for development only. doesn't
// mater what this is set to unless is set to localhost.
const NETWORK_NAME = NETWORKS_ENUM.TESTNET;

export {
  STORAGE_ENUM,
  NETWORKS_ENUM,
  TESTNET_BLOCKEXPLORER, MAINNET_BLOCKEXPLORER,
  COPY_ADDRESS_TO_CLIPBOARD_MESSAGE, COPIED_MESSAGE,
  DEFAULT_NETWORK,
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