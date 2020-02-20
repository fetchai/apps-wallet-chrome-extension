chrome.browserAction.onClicked.addListener(function(tab) {
   // Send a message to the active tab
   chrome.tabs.query({active: true, currentWindow:true},function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
   });
});

// // background.js
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   fetch(request.input).then(function(response) {
//     return response.text().then(function(text) {
//       sendResponse([{
//         body: text,
//         status: response.status,
//         statusText: response.statusText,
//       }, null]);
//     });
//   }, function(error) {
//     sendResponse([null, error]);
//   });
//   return true;
// });

// chrome.runtime.onMessage.addListener(async function (msg) {
//   if (msg.action === 'bootstrap')
//   {
//    // return await Bootstrap.server_from_name(NETWORK_NAME)
//     return {host: "hello", poort: 500}
//   }
//
// });



// background.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  fetch(request.input, request.init).then(function(response) {
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