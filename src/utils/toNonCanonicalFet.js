import { BN } from "bn.js"

const CANONICAL_DIFFERENCE = 10000000000
/**
 * Converts canonical fet to non canonical fet, as is used in display.
 *
 * it divides by
 *
 * @param canonical fet BN or string
 * @returns {BN}
 */
const toNonCanonicalFet = (fet) => {
   let amount  = new BN(fet)

    if(amount.isZero()){
      return amount;
    }

    if(amount.isNeg()){
      // we cannot divide with negs using library so we invert and do it then flip back.
      amount = amount.neg()
      amount.div(new BN(CANONICAL_DIFFERENCE))
      return  amount.neg()
    }

     return amount.div(new BN(CANONICAL_DIFFERENCE))
  }

  export { toNonCanonicalFet }