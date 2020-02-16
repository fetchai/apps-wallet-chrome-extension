// name of network to connect to.
const NETWORK_NAME="devnet";
// name of downloadaed key file.
const KEY_FILE_NAME = "private_key.json"
const VERSION = "1.0.0"
const NOT_EXTENTION = false;
const DEFAULT_FEE_LIMIT = 20;
const DOLLAR_PRICE_URI = "https://blockexplorer.geuwe2a-devnet.fetch-ai.com/api/v1/get_price/";
export const ACCOUNT_HISTORY_URI = "https://blockexplorer.geuwe2a-devnet.fetch-ai.com/api/v1/transactions/?digest=0xfc7d871923f2d797eaf50ef7129976041ab3df4af9534ee39514f21c78431ef2";
const DOLLAR_PRICE_CHECK_INTERVAL_MS = 5000;
const BALANCE_CHECK_INTERVAL_MS = 1000;
const TRANSACTION_HISTORY_CHECK_INTERVAL_MS = 5000;

export {TRANSACTION_HISTORY_CHECK_INTERVAL_MS, NETWORK_NAME, KEY_FILE_NAME, VERSION, NOT_EXTENTION, DEFAULT_FEE_LIMIT, DOLLAR_PRICE_URI, DOLLAR_PRICE_CHECK_INTERVAL_MS, BALANCE_CHECK_INTERVAL_MS}