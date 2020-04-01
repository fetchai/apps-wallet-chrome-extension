import Storage from '../services/storage'
import { KEY_FILE_NAME, STORAGE_ENUM } from '../constants'

/**
   * Causes download of encrypted key file as json file, taking key file from storage.
   *
   * @returns {Promise<void>}
   */

  const download = async () => {
    const json_str = await Storage.getItem(STORAGE_ENUM.KEY_FILE)
    const element = document.createElement('a')
    const file = new Blob([json_str], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = KEY_FILE_NAME
    document.body.appendChild(element)
    element.click()
  }

  export { download }