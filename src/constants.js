// name of network to connect to.
const NETWORK_NAME = "devnet";
// name to assign to download key file.
const KEY_FILE_NAME = "private_key.json";
const VERSION = "1.0.0";
// flag to change when running as extension or in browser.
const EXTENSION = false;

const DEFAULT_FEE_LIMIT = 20;
const DOLLAR_PRICE_URI = "https://blockexplorer.geuwe2a-devnet.fetch-ai.com/api/v1/get_price/";
const ACCOUNT_HISTORY_URI = "https://blockexplorer.geuwe2a-devnet.fetch-ai.com/api/v1/transactions/?digest=0xfc7d871923f2d797eaf50ef7129976041ab3df4af9534ee39514f21c78431ef2";
const DOLLAR_PRICE_CHECK_INTERVAL_MS = 5000;
const BOOTSTRAP_REQUEST_URI = `https://bootstrap.fetch.ai/endpoints/?network=${NETWORK_NAME}`

const BALANCE_CHECK_INTERVAL_MS = 1000;
const TRANSACTION_HISTORY_CHECK_INTERVAL_MS = 5000;
// for all expanding and collapsing elements.
const TRANSITION_DURATION_MS = 500

export {
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