# Fetch.AI Web Wallet Browser Extension

You can find the latest version of the Fetch.AI Web Wallet Browser Extension on [The Chrome Web Store](ht<chrome store uri here>>/). 

The Fetch.AI Web Wallet is a Chrome browser extension for interacting with the Fetch.ai Ledger. Functionality includes creating accounts on the Ledger, working with existing accounts, 
checking one's balance and transaction history on both Mainnet, and Testnet. It's functionality also includes the sending of funds, verifying the receipt of funds, and 
providing relavent links within our [Block Explorer](https://explore.fetch.ai/) to see further transaction information

### Running as a website locally yourself as a developer

$ git clone https://github.com/fetchai/apps-wallet-chrome-extension.git
In src/constants.js change `const EXTENSION = false` to true
$ npm run build && npm start

### Running as a website locally yourself as a developer

$ git clone https://github.com/fetchai/apps-wallet-chrome-extension.git
$ npm run build

navigate to chrome://extensions, select "developer mode"; select "Load unpacked"; choose <approotdir>/build 

### building from source files. 

$ git clone https://github.com/fetchai/apps-wallet-chrome-extension.git
$ cd apps-wallet-chrome-extension
$ npm install 
 change line 20 VERSION variable from 2 to 3 in  <approotdir>/node_modules/fetchai-ledger-api/src/fetchai/ledger/serialization/transaction.js
$ cd <approotdir>/node_modules/fetchai-ledger-api 
$ npm install && npm run build
$ cd <approotdir>/src/other_imported_modules/react-expand-animated-2
$ npm install && npm run build
$ cd <approotdir>
$ npm run build

## License

This application is licensed under the Apache software license (see LICENSE file). Unless required by
applicable law or agreed to in writing, software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

Fetch.AI makes no representation or guarantee that this software (including any third-party libraries)
will perform as intended or will be free of errors, bugs or faulty code. The software may fail which
could completely or partially limit functionality or compromise computer systems. If you use or
implement the ledger, you do so at your own risk. In no event will Fetch.ai be liable to any party
for any damages whatsoever, even if it had been advised of the possibility of damage.
  