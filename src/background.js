/*global chrome*/




/**
 * This is used to make Cors requests, and is called by fetchResource method in content scripts.
 *
 */
chrome.runtime.onMessage.addListener(function (request, sender, send_response) {
  fetch(request.input, request.init).then(function (response) {
    return response.text().then(function (text) {
      send_response([{
        body: text,
        status: response.status,
        statusText: response.statusText,
      }, null])
    })
  }, function (error) {
    send_response([null, error])
  })
  return true
})