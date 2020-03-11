import { BN } from 'bn.js'
// below const is 10000000000
import { CANONICAL_DIFFERENCE } from '../constants'

const numberOfSignificantDecimalPlaces = n => ((n % 1) != 0) ? n.toString().split('.')[1].length : 0

/**
 * Converts regular fet (allowing for up to ten DP) to canonical fet
 *
 * it divides by
 *
 * @param canonical fet BN or string
 * @returns {BN}
 */
const toCanonicalFet = (fet) => {
  if (fet === 0) return new BN(0)

  if (Number.isInteger(fet)) {
    if (!Number.isSafeInteger(fet)) throw new error('unsafe integer' + fet)
    return new BN(fet).mul(new BN(CANONICAL_DIFFERENCE))
  }
  const dps = numberOfSignificantDecimalPlaces(fet)
  if (dps > 10) throw new error('Fet cannot have more than 10 decimal places')

  //Just truncates the dps so take integer part direct from source
  const integer_part = new BN(fet).mul(new BN(CANONICAL_DIFFERENCE))

  // convert remainder to number, padded to length of 10
  const remainder = (fet % 1).toFixed(10).replace('.', '')
  return integer_part.add(new BN(remainder))

}

export { toCanonicalFet }