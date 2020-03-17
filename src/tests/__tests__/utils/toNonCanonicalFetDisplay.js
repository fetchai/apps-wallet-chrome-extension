import React from 'react'

import '@testing-library/jest-dom'
import { toNonCanonicalFetDisplay } from '../../../utils/toNonCanonicalFetDisplay'
import { BN } from 'bn.js'

describe(':toNonCanonicalFetDisplay', () => {

  test('one canonical fet to display in scientific notation', () => {
        const display = toNonCanonicalFetDisplay(new BN(1))
    const expected_display = "1e-10"
    expect(display).toBe(expected_display)
  })

  test('negative one canonical fet to display in scientific notation', () => {
    const display = toNonCanonicalFetDisplay("-1")
    const expected_display = "-1e-10"
    expect(display).toBe(expected_display)
  })

  test('one hundred canonical fet to display in scientific notation', () => {
  const display = toNonCanonicalFetDisplay(new BN(100))
    const expected_display = "1e-8"
     expect(display).toBe(expected_display)
  })

  test('one hundred canonical fet to display in scientific notation', () => {
  const display = toNonCanonicalFetDisplay(new BN(4400000))
    const expected_display = "0.00044"
        expect(display).toBe(expected_display)
  })

  test('two point four billion canonical FET to display as decimal', () => {
       const display = toNonCanonicalFetDisplay(new BN(2400000000))
       const expected_display = "0.24"
       expect(display).toBe(expected_display)
  })

  test('test two point nine thousand billion canonical FET to display as decimal', () => {
      const expected_display = "299"
   const canonical_amount = expected_display + "0".repeat(10)
    const display = toNonCanonicalFetDisplay(new BN(canonical_amount))
       expect(display).toBe(expected_display)
  })

  test('test decimals greater than hundred display only integer part of amount ', () => {
    const canonical_amount = "299 0 000 999 333".replace(" ", "")
    const display = toNonCanonicalFetDisplay(new BN(canonical_amount))
    const expected_display = "299"
    expect(display).toBe(expected_display)
  })

  test('test amount of regular FET greater than three figures cuts decimal places off', () => {
       const canonical_amount = "299 0 000 999 333".replace(" ", "")
       const display = toNonCanonicalFetDisplay(new BN(canonical_amount))
       const expected_display = "299"
       expect(display).toBe(expected_display)
  })

  test('test huge number of regular FET displays correctly', () => {
       const twenty_thousand_quadrillion = "2" + "0".repeat(20)
       const display = toNonCanonicalFetDisplay(new BN(twenty_thousand_quadrillion))
       const twenty_billion = "2" + "0".repeat(10)
       expect(display).toBe(twenty_billion)
  })

  test('test huge negative number of regular FET displays correctly', () => {
       const negative_twenty_thousand_quadrillion = "-2" + "0".repeat(20)
       const display = toNonCanonicalFetDisplay(new BN(negative_twenty_thousand_quadrillion))
       const twenty_billion = "-2" + "0".repeat(10)
       expect(display).toBe(twenty_billion)
  })
})