/*global chrome*/

    /**
     * Extensions cannot make cors requests in content scripts so the requests are made in background script and results passed to our content script.
     * This has same API as Fetch Api
     *  https://www.chromium.org/Home/chromium-security/extension-content-script-fetches
     *
     *
     *
     * @param input
     * @returns {Promise<unknown>}
     */
   const fetchResource = (input) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({input}, messageResponse => {
      const [response, error] = messageResponse;
      if (response === null) {
        reject(error);
      } else {
        const body = response.body ? new Blob([response.body]) : undefined;
        resolve(new Response(body, {
          status: response.status,
          statusText: response.statusText,
        }));
      }
    });
  });
}

export {fetchResource}
