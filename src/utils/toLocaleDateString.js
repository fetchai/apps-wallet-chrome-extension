/**
 * Formats Date object to our preferred custom format for display.
 *
 * @param str {number | string}
 * @returns {string}
 */

const toLocaleDateString = (str) => {
  // see link for ref regarding construction of a locale date without a comma
  // https://stackoverflow.com/questions/49982572/how-to-remove-comma-between-date-and-time-on-tolocalestring-in-js
  const dateOptions = { day: '2-digit', month: 'short' }
  const timeOptions = { hour12: true, hour: '2-digit', minute: '2-digit' }
  return new Date(str).toLocaleString('en', dateOptions) + ' ' + new Date(str).toLocaleString('en', timeOptions)
}

export { toLocaleDateString }