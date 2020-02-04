/*global chrome*/
import {NOT_EXTENTION} from "../constants";

/**
 * The purose of this is that by centralising the get/sets to local storage it
 * means we can easily switch between chrome.storage.sync.set of extention and localStorage.setItem if we want to run this in chrome or any other form
 * of storage eg cookies.
 */
export default class Storage {

       static setLocalStorage(k, v) {
              if(NOT_EXTENTION){
                     chrome.storage.sync.set({k,v})
              } else {
                     localStorage.setItem(k, v);
              }
       }

       static getLocalStorage(k) {
               if(NOT_EXTENTION){
                       return chrome.storage.sync.get(k)
               } else {
                      return localStorage.getItem(k);
               }
       }
}
export { Storage }