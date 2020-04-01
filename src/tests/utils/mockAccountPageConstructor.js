import { Entity } from 'fetchai-ledger-api/dist/fetchai/ledger/crypto'
import { API } from '../../services/api'
import { digest } from '../../utils/digest'

jest.mock('fetchai-ledger-api/dist/fetchai/ledger/crypto/entity')
jest.genMockFromModule('fetchai-ledger-api/dist/fetchai/ledger/crypto/address')
jest.mock('fetchai-ledger-api/dist/fetchai/ledger/crypto/address')

/**
 * used when checking redirects to account page to mock construction of account page.
 */
export const mockAccountPageConstructor = () => {
  const mock_to_json_object = jest.fn()
  Entity.prototype._to_json_object = mock_to_json_object
  mock_to_json_object.mockReturnValue(Promise.resolve('expectedProduct'))

  const mock_public_key_bytes = jest.fn()
  Entity.prototype.public_key_bytes = mock_public_key_bytes
  mock_public_key_bytes.mockReturnValue(digest('random'))
  // we only care that the next page is loaded
  const mock_fetchAnotherPageOfHistory = jest.fn()
  History.prototype.fetchAnotherPageOfHistory = mock_fetchAnotherPageOfHistory
  mock_fetchAnotherPageOfHistory.mockReturnValue(Promise.resolve(undefined))

// mock out this network request also, since we don't care about it.
  const mock_bootstrap = jest.fn()
  API.fromBootstrap = mock_bootstrap
  mock_bootstrap.mockReturnValue(Promise.resolve(undefined))
}