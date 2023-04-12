import { INITIALIZE_SUBMIT_BLOCK_MESSAGE_NAME, TOGGLE_IME_SUBMIT_BLOCK_MESSAGE_NAME } from "~lib/constants"
import { preventEnterOnIME } from "~lib/preventEnterOnIME"
import { isBlackListed, isAutoApply, wait, log } from "~lib/utils"

let abortController: AbortController | null = null

const enableBlocker = () => {
  abortController?.abort()
  abortController = new AbortController()
  const signal = abortController.signal
  preventEnterOnIME(document, signal)
  log("[IMESubmitBlocker] Enabled IME submit block 🚀")
}

const disableBlocker = () => {
  abortController?.abort()
  log("[IMESubmitBlocker] Disabled IME submit block 🗑️")
}

chrome.runtime.onMessage.addListener(async (message) => {
  switch (message.name) {
    case TOGGLE_IME_SUBMIT_BLOCK_MESSAGE_NAME:
      if (message.body.isBlocked) {
        enableBlocker()
      } else{
        disableBlocker()
      }
      break
    case INITIALIZE_SUBMIT_BLOCK_MESSAGE_NAME:
      if (! await isBlackListed()) {
        await wait()
        enableBlocker()
      }
      break
    default:
      throw new Error("Unknown message name")
  }
})


;(async () => {
  if (await isBlackListed()) {
    log("[IMESubmitBlocker] Current url is registered black list 📝")
    return
  }
  if (!await isAutoApply()) {
    return
  }
  await wait()
  enableBlocker()
})()
