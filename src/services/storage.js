import { EXTENSION } from '../constants'

export default class Storage {

  static async getItem (key) {
    if(!EXTENSION){
      localStorage.getItem(key)
    } else {
      return new Promise((resolve, reject) =>
        chrome.storage.sync.get(key, result => {
             if(typeof result[key] === "undefined") resolve(null)
           else  resolve(result[key])
        }
          // chrome.runtime.lastError
          //   ? reject(Error(chrome.runtime.lastError.message))
          //   : resolve(result.key3)

        )
      )
    }
  }

  static async setItem (key, v) {
     if(!EXTENSION){
        localStorage.setItem(key, v)
    } else {
       return new Promise((resolve, reject) => {
         chrome.storage.sync.set({ [key]: v }, () => {
           // chrome.runtime.lastError
           //  ? reject(Error(chrome.runtime.lastError.message))
           //  : resolve()})
           resolve()
         })
       })
     }
  }


}
export { Storage }
// const { data } = await getStorageData('data')
//await setStorageData({ data: [someData] })
// await setStorageData({ data: [someData] })


