// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(function(tab) {
   // Send a message to the active tab
   chrome.tabs.query({active: true, currentWindow:true},function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
   });
});

// background.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  fetch(request.input).then(function(response) {
    return response.text().then(function(text) {
      sendResponse([{
        body: text,
        status: response.status,
        statusText: response.statusText,
      }, null]);
    });
  }, function(error) {
    sendResponse([null, error]);
  });
  return true;
});


// background.js
chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
    var requestHeaders = details.requestHeaders;
    for (var i=0; i<requestHeaders.length; ++i) {
        if (requestHeaders[i].name.toLowerCase() === 'referer') {
            // The request was certainly not initiated by a Chrome extension...
            return;
        }
    }
    // Set Referer
    requestHeaders.push({
        name: 'referer',
        // Host must match the domain in your Typekit kit settings
        value: 'https://edc7sbf/'
    });
    return {
        requestHeaders: requestHeaders
    };
}, {
    urls: ['*://use.typekit.net/*'],
    types: ['stylesheet']
}, ['requestHeaders','blocking']);