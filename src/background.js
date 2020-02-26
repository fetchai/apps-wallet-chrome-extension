/*global chrome*/
/**
 * The background script.
 *
 * This is used to make Cors requests, and is called by fetchResource method in content scripts.
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  fetch(request.input, request.init).then(function (response) {
    return response.text().then(function (text) {
      sendResponse([{
        body: text,
        status: response.status,
        statusText: response.statusText,
      }, null])
    })
  }, function (error) {
    sendResponse([null, error])
  })
  return true
})