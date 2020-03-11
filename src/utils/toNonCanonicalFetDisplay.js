import { BN } from "bn.js"
import { CANONICAL_DIFFERENCE } from '../constants'


const toDecimalScientificNotationDisplay = (amount, sign_string) => {
   const largest_sig_figure_position = amount.toString().length
  let number_of_sig_figs = amount.toString().length
       let decimal = (number_of_sig_figs >1) ?  "." + amount.toString().substring(1,2): "";
       return sign_string + amount.toString().substring(0,1) + decimal + "e-" + (11-largest_sig_figure_position)
}

const toDecimalDisplay = (amount, sign_string) => {
  debugger;
  const largest_sig_figure_position = amount.toString().length
    let zeros = "0".repeat(10-largest_sig_figure_position)
       // we only show to 6 d.p.
       const l = 6 - zeros.length
       return  sign_string + "0." + zeros + amount.toString().substring(0, l);
}

const CANONICAL_HUNDRED_DIFFERENCE = CANONICAL_DIFFERENCE/100
/**
 * Converts canonical fet to non canonical fet, as is used in display.
 *
 *
 * @param canonical fet BN or string
 * @returns {string} to display to user.
 */
const toNonCanonicalFetDisplay = fet => {
   let amount  = new BN(fet)

    if(amount.isZero()){
      return "0";
    }

    let sign = "";
    if(amount.isNeg()) {
      // we cannot divide with negs using BN library so we invert and do it then add sign afterwards.
      amount = amount.neg()
      sign = "-";
    }

     const largest_sig_figure_position = amount.toString().length

     // scientific notation for small amounts of FET less than can be shown with 6 decimal places.
     if (largest_sig_figure_position<5) return toDecimalScientificNotationDisplay(amount, sign)
    // put decimal point in correct point of display string for decimal amounts of regular FET
     if(largest_sig_figure_position<11) return toDecimalDisplay(amount, sign)

       // we must have regular of 1 FET or more.
       const hundred_times_greater_than_fet_amount = amount.div(new BN(CANONICAL_HUNDRED_DIFFERENCE))
       const  unformatted_display = hundred_times_greater_than_fet_amount.toString();
       // curently only 2 dp on a fet shown.
       return  sign + unformatted_display.substring(0, unformatted_display.length-2) + "." + unformatted_display.substring(unformatted_display.length-2)
  }

  export { toNonCanonicalFetDisplay }