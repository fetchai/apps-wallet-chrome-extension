import { createHash } from 'crypto'

const digest = (address_raw) => {
  const hash_func = createHash('sha256')
  hash_func.update(address_raw)
  return hash_func.digest()
}

export { digest }
