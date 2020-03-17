import React from 'react'
import '@testing-library/jest-dom'
import { BN } from 'bn.js'
import { toCanonicalFet } from '../../../utils/toCanonicalFet'

describe.skip(':toCanonicalFetDisplay', () => {
  test('test zero regular FET converts to zero canonical FET', () => {
    const actual = toCanonicalFet("0")
    const expected_canonical = "0"
    expect(expected_canonical.toString()).toBe(actual.toString())
  })

  test('test small whole number converts to canonical FET', () => {
    const actual = toCanonicalFet("3")
    const canonical_string = 3 + "0".repeat(10)
    const expected =  new BN(canonical_string)
    expect(expected.toString()).toBe(actual.toString())
  })

  test('test number with trailing decimal point converts regardless', () => {
    const actual = toCanonicalFet("3.")
    const canonical_string = 3 + "0".repeat(10)
    const expected =  new BN(canonical_string)
    expect(expected.toString()).toBe(actual.toString())
  })

  test('test small decimal number converts to canonical FET', () => {
    const actual = toCanonicalFet("3.5")
    const canonical_string = 35 + "0".repeat(9)
    const expected =  new BN(canonical_string)
    console.log("actual is : " + actual.toString())
    expect(expected.toString()).toBe(actual.toString())
  })

  test('test smallest possible decimal to convert to single canonical fet', () => {
    const canonical_string = "0." + "0".repeat(9) + "1"
    const actual = toCanonicalFet(canonical_string)
    const canonical_amount = 1;
    const expected =  new BN(canonical_amount)
    expect(expected.toString()).toBe(actual.toString())
  })

  test('test one billion regular FET converts to correct amount of Canonical FET', () => {
    const five_billion = "5000000000";
    const actual = toCanonicalFet(five_billion)
    const canonical_string = five_billion + "0".repeat(10)
    const expected =  new BN(canonical_string)
    expect(expected.toString()).toBe(actual.toString())
  })

  test('test number with more than 10 decimal places throws error', () => {
    // since regular fet cannot have more than 10 dp, submitting an amount more than this should throw an error
    const long_decimal = "2." + "9".repeat(11)
            expect(() => {
            toCanonicalFet(long_decimal)
        }).toThrow(Error)
  })
})
