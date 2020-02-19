/*global chrome*/

    /**
     * Extensions cannot make CORs requests in content scripts therefore such requests are made in background script and results passed to content script.
     * This has same API as HTML5 Fetch Api https://www.chromium.org/Home/chromium-security/extension-content-script-fetches so we can easily switch to run in browser.
     *
     * @param input
     * @returns {Promise<unknown>}
     */
   const fetchResource = (uri) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({uri}, messageResponse => {
      const [response, error] = messageResponse;
      if (response === null) {
        reject(error);
      } else {
        const body = (response.body) ? new Blob([response.body]) : undefined;
        resolve(new Response(body, {
          status: response.status,
          statusText: response.statusText,
        }));
      }
    });
  });
}

export {fetchResource}
