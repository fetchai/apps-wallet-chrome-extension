# Fetch.ai <todo name> Browser Extension

This extension allows one to send and receive funds on the Fetch.ai Blockchain, create a Wallet, store funds 
safely and check one's accounts balance. 

## Installation

### Instructions to run locally
### To install this browser extension see the installation section below


>Make sure you have latest **NodeJs** version installed

Clone repo

```
git clone <todo insert repo name>
```
Go to `<todo insert repo name>` directory run

```
npm install
```

In file `src/constants.js` set the value of const EXTENSION
to true to run this program locally as a Chrome extension, and false to run it directly in the browser. 

Build the extension

```
npm run build
```

Run in the browser

```
npm run start
```

To run as a chrome extension go to `chrome://extensions/` 

Select `Load unpacked` and in the subsequent file menu choose the `build` folder inside `[PROJECT_HOME]`


## Adding <app name>  to Chrome

todo

## Contributing

Bug reports and pull requests are welcome on GitHub at <todo insert repo name>. 
This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The repo is available as open source under the terms of the <todo verify liscence> [MIT License](http://opensource.org/licenses/MIT).
