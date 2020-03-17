// import chrome from  'sinon-chrome';
import flushPromises from 'flush-promises'

import { fireEvent } from '@testing-library/react'

export const STRONG_PASSWORD = 'STRONG_PASSWORD!!!!!p100'
export const STRONG_PASSWORD_2 = 'STRONG_PASSWORD2!!!!!p100'
export const WEAK_PASSWORD = 'a_weak_password'
export const EXAMPLE_ADDRESS = 'dTSCNwHBPoDdESpxj6NQkPDvX3DN1DFKGsUPZNVWDVDrfur4z'
export const EXAMPLE_INVALID_ADDRESS = 'dTSCNwHBPoDdESpxj6NQkPDvX3DN1DFKGsUPZNVWDVDrfur4z9'
export const EXAMPLE_ADDRESS_2 = '27L4TKQ9Q32HmGTzA32V25xwSjvKoHEPCZG5cMJ41scGTqaSdW'
export const ENCRYPTED_KEY_FILE = '{"key_length":32,"init_vector":"LAunDQSK0yh1ixYStfBLdw==","password_salt":"jwhnMpDMp3kW/og8pZbiwA==","privateKey":"2Vdl4fr8gLlnuHEgwZrmeOsp4y6QLmHRlBeEj6qXPd0=2Vdl4fr8gLlnuHEgwZrmeOsp4y6QLmHRlBeEj6qXPd0="}'
export const INVALID_ENCRYPTED_KEY_FILE = '{"key_length":32,"init_vector":"","password_salt":"","privateKey":"2Vdl4fr8gLlnuHEgwZrmeOsp4y6QLmHRlBeEj6qXPd0=2Vdl4fr8gLlnuHEgwZrmeOsp4y6QLmHRlBeEj6qXPd0=(⌐□_□)"}'
export const TX_DIGEST = "68fa027aea39f85b09ef92cfc1cc13ceec706c6aadc0b908b549d2e57d611516"

/**
 * since sometimes jest doesn't wait for mocks, unsure why, this is accepted solution online to wait for all pending promises to flush
 * before continuing. This line is wrapped in function so anybody can click to here and see the explanation for the usage of this function.
 */

export const untilPromises = async () => await flushPromises()

export const form_write_value = (getByTestId, test_id, value) => {
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