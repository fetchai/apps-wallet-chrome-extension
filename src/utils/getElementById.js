import { EXTENSION } from '../constants'

/**
 * since we are in an iframe we have no getElementbyid in extension so this finds our iframes content window first, allowing us to
 * get by id within our iframe. It also has switch to work regularly if not in extension context.
 *
 * @param id
 * @returns {HTMLElement}
 */
const getElementById = (id) => {

  if (!EXTENSION) return document.getElementById(id)

  let iframe = document.getElementById('my-frame')
  let content_window = (iframe.contentWindow || iframe.contentDocument)
  if (content_window.document) {
    content_window = content_window.document
  }
  return content_window.getElementById(id)
}

export { getElementById }