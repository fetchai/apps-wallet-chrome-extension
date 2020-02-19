/**
 * Get substring of address with three appended dots, for UI display
 *
 * @param val
 * @param last
 * @returns {string}
 */
const format = (val, last = 12) => val.substring(0, last) + "...";

export {format}