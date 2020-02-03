/**
 * The purose of this is that by centralising the get/sets to local storage it
 * means we can easily switch between chrome.storage.sync.set of extention and localStorage.setItem of chrome
 * during development.
 */
export default class Storage {

static setLocalStorage(k,v) {
       localStorage.setItem(k,v);
}

static getLocalStorage(k) {
       return localStorage.getItem(k);
}

export { Storage }