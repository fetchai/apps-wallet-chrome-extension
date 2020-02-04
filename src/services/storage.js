/*global chrome*/
import {EXTENTION} from "../constants";

/**
 * The purose of this is that by centralising the get/sets to local storage it
 * means we can easily switch between chrome.storage.sync.set of extention and localStorage.setItem of chrome
 * during development.
 */
export default class Storage {

       static setLocalStorage(k, v) {
              if(EXTENTION){
                     chrome.storage.sync.set({k,v})
              } else {
                     localStorage.setItem(k, v);
              }
       }

       static getLocalStorage(k) {
               if(EXTENTION){
                       return chrome.storage.sync.get(k)
               } else {
                      return localStorage.getItem(k);
               }
       }
}
export { Storage }