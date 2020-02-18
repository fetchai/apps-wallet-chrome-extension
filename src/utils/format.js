/**
 * used to get substring of address with dots for display
 *
 * @param val
 * @param last
 * @returns {string}
 */
const format = (val, last = 12) => val.substring(0, last) + "...";

export {format}