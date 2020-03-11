import { Address } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto'

/**
 * Determine if Address is valid fetch address ie a bs-58 string of correct length with correct checksum, using Fetch.ai's Javascript SDK
 *
 * @param address
 * @returns {boolean}
 */

const validAddress = (address) => {
  //todo swap to is_address when Ed updates public SDK
  try {
     new Address(address)
  } catch (e) {
    return false
  }
  return true
}

export { validAddress }