/*global chrome*/
import {EXTENSION} from "../constants";

/**
 * Different is returned URI for asset stored in assets folder
 * depending on if we run as an extension or in browser. If this throws an error on compilation
 * check whether your EXTENSION flag is correct for the environment you are running in.
 *
 * @param name
 * @returns {string}
 */
const getAssetURI = name => EXTENSION ? chrome.runtime.getURL("/assets/" + name) :  `./assets/${name}`

export {getAssetURI}