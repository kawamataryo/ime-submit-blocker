import { Storage } from "@plasmohq/storage"
import {
  BLACK_LIST_STORAGE_KEY,
  DEFAULT_BEHAVIOR_STORAGE_KEY,
  WAIT_TIME_STORAGE_KEY
} from "~lib/constants"
import { preventEnterOnIME } from "~lib/preventEnterOnIME"
import { wait } from "~lib/wait"

let abortController: AbortController | null = null
const storage = new Storage()

const enableBlocker = () => {
  abortController = new AbortController()
  const signal = abortController.signal
  preventEnterOnIME(document, signal)
  console.log("[IMESubmitBlocker] Enabled IME submit block 🚀")
}

const disableBlocker = () => {
  abortController?.abort()
  console.log("[IMESubmitBlocker] Disabled IME submit block 🗑️")
}

const isDefaultBlock = async () => {
  const defaultState = await storage.get<boolean | undefined>(
    DEFAULT_BEHAVIOR_STORAGE_KEY
  )
  if (defaultState === undefined) {
    storage.set(DEFAULT_BEHAVIOR_STORAGE_KEY, true)
    return true
  }
  return defaultState
}

const isBlackListed = async () => {
  const storage = new Storage()
  const blackList = await storage.get<string>(BLACK_LIST_STORAGE_KEY)
  const parsedBlackList = blackList.split("\n") || []
  const currentUrl = document.location.href
  return parsedBlackList.some((blackListedUrl) => {
    if (blackListedUrl === "") {
      return false
    }
    return currentUrl.startsWith(blackListedUrl)
  })
}

const getWaitTime = async () => {
  const waitTime = await storage.get<number>(WAIT_TIME_STORAGE_KEY)
  if (waitTime === undefined) {
    storage.set(WAIT_TIME_STORAGE_KEY, 2500)
    return 2500
  }
  return waitTime
}

chrome.runtime.onMessage.addListener(function (message) {
  if (message.name === "toggle-ime-submit-block") {
    abortController?.abort()
    if (message.body.isBlocked) {
      enableBlocker()
    } else {
      disableBlocker()
    }
  }
})

;(async () => {
  if (await isBlackListed()) {
    console.log("[IMESubmitBlocker] Current url is registered black list 📝")
    return
  }
  if (await isDefaultBlock()) {
    const waitTime = await getWaitTime()
    await wait(waitTime)
    enableBlocker()
  }
})()
