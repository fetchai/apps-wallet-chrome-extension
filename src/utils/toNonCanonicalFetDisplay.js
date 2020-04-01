import { BN } from 'bn.js'
import { CANONICAL_DIFFERENCE } from '../constants'

const RIGHTWARDS_ZEROS = /^|0+$/

/**
 * Scientific e notation for very small amounts
 * this returns the formatted display string
 *
 * @param amount
 * @param sign
 * @returns {string}
 */
const toDecimalScientificNotationDisplay = (amount, sign) => {
  const largest_sig_figure_position = amount.toString().length
  let number_of_sig_figs =  stripRightwardZeros(amount.toString()).length
  let decimal = (number_of_sig_figs > 1) ? '.' + amount.toString().substring(1, 2) : ''
  return sign + amount.toString().substring(0, 1) + decimal + 'e-' + (11 - largest_sig_figure_position)
}


/**
 * Remove zeros to right of last non-zero character in string eg 499010000 becomes 49901
 *
 * @param string
 * @returns {*}
 *
 */
const stripRightwardZeros = (string) => {
  const regexp = RegExp(RIGHTWARDS_ZEROS, 'g')
  return string.replace(regexp, '')
}

/**
 * Most larger amounts of fractional fet (<1) are displayed as decimals. this returns the formatted display string
 *
 * @param amount
 * @param sign
 * @returns {string}
 */
const lessThanOnetoDecimalDisplayString = (amount, sign) => {
  const largest_sig_figure_position = amount.toString().length
  let zeros = '0'.repeat(10 - largest_sig_figure_position)
  // strip rightwards zeros
  let string = stripRightwardZeros(amount.toString())
  // we only show to 6 d.p.
  const len = 6 - zeros.length
  return sign + '0.' + zeros + string.substring(0, len)
}

const greaterThanOneDecimalDisplayString = (amount, sign) => {
  const hundred_times_greater_than_canonical_fet_amount = amount.div(new BN(CANONICAL_DIFFERENCE / 100))
  const string = hundred_times_greater_than_canonical_fet_amount.toString()

  const integer_fet = string.substring(0, string.length - 2)

  //For number of >= 100
  if(integer_fet.length >= 2){
    return sign + integer_fet
  } else {
    return sign + string.substring(0, string.length - 2) + '.' + string.substring(string.length - 2)
  }
}

const isInteger = amount => amount.mod(new BN(CANONICAL_DIFFERENCE)).isZero()

/**
 * Converts canonical fet to non canonical fet but as a string for displaying to user.
 *
 *
 * @param canonical fet BN or string
 * @returns {string} to display to user.
 */
const toNonCanonicalFetDisplay = fet => {
  let amount = new BN(fet)
  if (amount.isZero()) return '0'
  let sign = ''

  if (amount.isNeg()) {
    // we cannot divide with negs using BN library so we invert then do calc then add sign
    amount = amount.neg()
    sign = '-'
  }
  const largest_sig_figure_position = amount.toString().length

  // scientific notation for small amounts of FET, less than can be shown with 6 decimal places.
  if (largest_sig_figure_position < 5) return toDecimalScientificNotationDisplay(amount, sign)

  // put decimal point in correct point of display string for decimal amounts of regular FET
  if (largest_sig_figure_position < 11) return lessThanOnetoDecimalDisplayString(amount, sign)

  if(isInteger(amount)) return sign + amount.div(new BN(CANONICAL_DIFFERENCE)).toString()
  return greaterThanOneDecimalDisplayString(amount, sign);
}

export { toNonCanonicalFetDisplay }