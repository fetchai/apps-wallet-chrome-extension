
Each file in views folder represents one  of 
8 original wireframes + history ( the infinite scroll )

utils, views, services and dumb_components 
are main folders

react-expanded-animated is a public module I changed a bit
and  must rename hence moving from node-modules

TO INSTALL

in serialization/transaction version flag in node modules
must be changed from 2 to 3 after running npm install, 
then cd into node_modules and run npm run build. This
is temp until I update which version of sdk it is running
on. When I started it the sdk on npm has since been updated
so i need to update which methods I am using.

It runs first index.js in browser or content.js in 
extension

all css is content.css



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


/home/douglas/react-chrome-extension/node_modules/babel-core/lib/transformation/file/index.js

  File.prototype.initOptions = function initOptions(opts) {
    console.log(opts)
    opts = {}
    opts = new _optionManager2.default(this.log, this.pipeline).init(opts);

  