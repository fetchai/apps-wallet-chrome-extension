import { EXTENSION } from '../constants'

const getElementById = (id) => {

  if(!EXTENSION) return document.getElementById(id);

  let iframe = document.getElementById('my-frame');
           let content_window = (iframe.contentWindow || iframe.contentDocument);
            if (content_window.document) {
                content_window = content_window.document;
            }
            return content_window.getElementById(id)
}

export {getElementById}