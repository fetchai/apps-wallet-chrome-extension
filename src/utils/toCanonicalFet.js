import { BN } from "bn.js"
import { CANONICAL_DIFFERENCE } from '../constants'

const numberOfSignificantDecimalPlaces = n => ((n % 1) != 0)? n.toString().split(".")[1].length : 0;


/**
 * Converts regular fet (allowing for up to ten DP to canonical fet
 *
 * it divides by
 *
 * @param canonical fet BN or string
 * @returns {BN}
 */
const toCanonicalFet = (fet) => {
  if (fet === 0) return new BN(0)
  if(Number.isInteger) return new BN(fet).mul(new BN(CANONICAL_DIFFERENCE))
  const dps = numberOfSignificantDecimalPlaces(fet)

  if(dps > 10) throw new error("Fet cannot have more than 10 decimal places")

  // just truncates the dps so take integer part direct from source
 const integer_part = new BN(fet).mul(new BN(CANONICAL_DIFFERENCE))

  const multiplier = CANONICAL_DIFFERENCE.toString().length - dps

  const remainder = (fet % 1).toFixed(10)
  const remainder_part= new BN(remainder).mul(new BN("0".repeat(multiplier)))
  const x =  integer_part.add(remainder_part)


  const y = x.toString()
  debugger;
  return x;
}

export { toCanonicalFet }