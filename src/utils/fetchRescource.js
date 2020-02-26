/*global chrome*/
import { EXTENSION } from '../constants'

/**
 * Extensions cannot make CORs requests in content scripts therefore such requests are made in background script and results passed to content script.
 * This has same API as HTML5 Fetch Api https://www.chromium.org/Home/chromium-security/extension-content-script-fetches so we can easily switch to run in browser.
 *
 * @param input
 * @returns {Promise<unknown>}
 */

function proxyToBackground (input, init) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ input, init }, messageResponse => {
      const [response, error] = messageResponse
      if (response === null) {
        reject(null)
      } else {
        // Use undefined on a 204 - No Content
        const body = response.body ? new Blob([response.body]) : undefined
        resolve(new Response(body, {
          status: response.status,
          statusText: response.statusText,
        }))
      }
    })
  })
}

/**
 * This is the switch that allows us to run in browser making requests, or background script we pass them to background.
 *
 * @param input
 * @param init
 * @returns {*}
 */
function fetchResource (input, init) {
  return EXTENSION ? proxyToBackground(input, init) : fetch(input, init)
}

export { fetchResource }
