/*global chrome*/
import {EXTENSION} from "../constants";

/**
 * different URI depending on if we run as an extension or in browser.
 *
 * @param name
 * @returns {string}
 */
const getAssetURI = (name) => {
      return (EXTENSION) ? chrome.runtime.getURL("/assets/" + name) :  `./assets/${name}`;
}

export {getAssetURI}