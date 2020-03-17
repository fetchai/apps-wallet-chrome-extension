import { BN } from 'bn.js'
// below const is 10000000000
import { CANONICAL_DIFFERENCE } from '../constants'

const numberOfSignificantDecimalPlaces = s => ((s % 1) != 0) ? s.split('.')[1].length : 0

/**
 * Calculates the amount of FET from mantissa of decimal number
 *
 * @param fet
 * @returns {BN}
 * @constructor
 */
const CanonicalFETofMantissa = (fet) => {
  const dps = numberOfSignificantDecimalPlaces(fet)
  if (dps > 10) throw new error('Fet cannot have more than 10 decimal places')
  let raw_remainder =  fet.split(".")[1]
  const multiple = 1 + "0".repeat(10 - dps)
  return new BN(raw_remainder).mul(new BN(multiple))
}

/**
 * Calculates the amount of FET from metaphor part of decimal number
 *
 * @param fet
 * @returns {BN}
 * @constructor
 */
const CanonicalFETofMetaphor = (fet) => {
   // https://stackoverflow.com/questions/9098776/how-to-split-a-decimal-by-its-dot-into-integers-using-javascript
  const integer = fet.split(".")[0]
  return new BN(integer).mul(new BN(CANONICAL_DIFFERENCE))
}

/**
 * Converts regular fet (allowing for up to ten DP) to canonical fet
 *
 * alpha numeric string with
 *
 * @param canonical fet BN or string
 * @returns {BN}
 */
const toCanonicalFet = (fet) => {
  if(typeof fet !== "string") throw new Error('requires string input')
  if (fet === "0") return new BN(0)
  if (!fet.includes('.')) return new BN(fet).mul(new BN(CANONICAL_DIFFERENCE))
  if(fet.charAt(fet.length-1) === ".") return new BN(fet.substring(0, fet.length-1)).mul(new BN(CANONICAL_DIFFERENCE))
  return CanonicalFETofMetaphor(fet).add(CanonicalFETofMantissa(fet))
}

export { toCanonicalFet }