import chrome from  'sinon-chrome';

export const STRONG_PASSWORD = "STRONG_PASSWORD!!!!!p100"
export const STRONG_PASSWORD_2 = "STRONG_PASSWORD2!!!!!p100"
export const WEAK_PASSWORD = "a_weak_password"

// const local_storage = {};
// const localStorageMock = {
//   getItem: jest.fn(k => local_storage[k]),
//   setItem: jest.fn((k, v) => {local_storage[k] = v + "hello"; return }),
// };
// global.localStorage = localStorageMock;

// class LocalStorageMock {
//   constructor() {
//     this.store = {};
//   }
//   clear() {
//     this.store = {};
//   }
//   getItem(key) {
//     return this.store[key] || null;
//   }
//   setItem(key, value) {
//     this.store[key] = value.toString();
//   }
//   removeItem(key) {
//     delete this.store[key];
//   }
// }
//
// const localStorage = new LocalStorageMock();
// // jest test environment expects these to exist
// window.localStorage = localStorage