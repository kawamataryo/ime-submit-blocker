import { BLACK_LIST_STORAGE_KEY, DEFAULT_BEHAVIOR_STORAGE_KEY, DEFAULT_WAIT_TIME, WAIT_TIME_STORAGE_KEY } from "./constants"
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

export const isAutoApply = async () => {
  const defaultState = await storage.get<boolean | undefined>(
    DEFAULT_BEHAVIOR_STORAGE_KEY
  )
  if (defaultState === undefined) {
    storage.set(DEFAULT_BEHAVIOR_STORAGE_KEY, true)
    return true
  }
  return defaultState
}

export const isBlackListed = async () => {
  const storage = new Storage()
  const blackList = await storage.get<string>(BLACK_LIST_STORAGE_KEY) || ""
  const parsedBlackList = blackList.split("\n") || []
  const currentUrl = document.location.href
  return parsedBlackList.some((blackListedUrl) => {
    if (blackListedUrl === "") {
      return false
    }
    return currentUrl.startsWith(blackListedUrl)
  })
}

export const getWaitTime = async () => {
  const waitTime = await storage.get<number>(WAIT_TIME_STORAGE_KEY)
  if (waitTime === undefined) {
    storage.set(WAIT_TIME_STORAGE_KEY, DEFAULT_WAIT_TIME)
    return DEFAULT_WAIT_TIME
  }
  return waitTime
}

export const wait = () => new Promise(async (resolve) =>  {
  const waitTime = await getWaitTime()
  setTimeout(resolve, waitTime)
});

export const log = (message: string) => {
  if(process.env.NODE_ENV === "development") {
    console.log(`ℹ️ [IMESubmitBlocker] ${message}`)
  }
}
