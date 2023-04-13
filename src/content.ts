import {
  INITIALIZE_SUBMIT_BLOCK_MESSAGE_NAME,
  TOGGLE_IME_SUBMIT_BLOCK_MESSAGE_NAME
} from "~lib/constants"
import { preventEnterOnIME } from "~lib/preventEnterOnIME"
import { isAutoApply, isBlackListed, log, wait } from "~lib/utils"

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

const initializeBlocker = async () => {
  if (!(await isAutoApply())) {
    return
  }
  if (await isBlackListed()) {
    log("[IMESubmitBlocker] Current url is registered black list 📝")
    return
  }
  // 即時実行
  enableBlocker()
  await wait()
  // wait後に再実行（SPA対応）
  enableBlocker()
}

chrome.runtime.onMessage.addListener(async (message) => {
  switch (message.name) {
    case TOGGLE_IME_SUBMIT_BLOCK_MESSAGE_NAME:
      if (message.body.isBlocked) {
        enableBlocker()
      } else {
        disableBlocker()
      }
      break
    case INITIALIZE_SUBMIT_BLOCK_MESSAGE_NAME:
      await initializeBlocker()
      break
    default:
      throw new Error("Unknown message name")
  }
})
;(async () => {
  await initializeBlocker()
})()
