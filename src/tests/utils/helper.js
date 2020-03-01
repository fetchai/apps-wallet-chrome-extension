// import chrome from  'sinon-chrome';

import Storage from 'dom-storage'
import { fireEvent } from '@testing-library/react'

export const STRONG_PASSWORD = "STRONG_PASSWORD!!!!!p100"
export const STRONG_PASSWORD_2 = "STRONG_PASSWORD2!!!!!p100"
export const WEAK_PASSWORD = "a_weak_password"
export const EXAMPLE_ADDRESS = "dTSCNwHBPoDdESpxj6NQkPDvX3DN1DFKGsUPZNVWDVDrfur4z"
export const ENCRYPTED_KEY_FILE =  '{"key_length":32,"init_vector":"LAunDQSK0yh1ixYStfBLdw==","password_salt":"jwhnMpDMp3kW/og8pZbiwA==","privateKey":"2Vdl4fr8gLlnuHEgwZrmeOsp4y6QLmHRlBeEj6qXPd0="}'


export const form_write_value = (getByTestId, test_id, value ) => {
    const form_input = getByTestId(test_id)
    fireEvent.change(
      form_input,
      { target: { value: value } }
    )
}

export const click_button = async (getByTestId, test_id) => {
      const submit_button = getByTestId(test_id)
    await fireEvent(
      submit_button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))
}

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
//     debugger;
//     return this.store[key] || null;
//   }
//   setItem(key, value) {
//         debugger;
//     this.store[key] = value.toString();//global.localStorage = localStorage
//   }
//   removeItem(key) {
//     delete this.store[key];
//   }
// }

// global.localStorage = new Storage(null, { strict: true });
// global.sessionStorage = new Storage(null, { strict: true });

// const localStorage = new LocalStorageMock();
// jest test environment expects these to exist
