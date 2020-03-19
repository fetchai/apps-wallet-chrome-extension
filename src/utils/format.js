/**
 * Get substring of address with three appended dots; for UI display.
 *
 * @param val
 * @param last
 * @returns {string}
 */
const format = (val, number = 12) => {
  if(val === "") return ""
  return val.substring(0, number) + '.....' + val.substring(val.length - number)
}

export { format }