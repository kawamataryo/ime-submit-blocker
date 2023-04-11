import "./style.css"

import { useState } from "react"

import { sendToContentScript } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import ShieldIcon from "~components/shieldIcon"
import {
  BLACK_LIST_STORAGE_KEY,
  DEFAULT_BEHAVIOR_STORAGE_KEY
} from "~lib/constants"

function IndexPopup() {
  const toggleIMESubmitBlock = async (isBlocked: boolean) => {
    await sendToContentScript({
      name: "toggle-ime-submit-block",
      body: {
        isBlocked
      }
    })
  }

  const openOptionPage = async () => {
    chrome.runtime.openOptionsPage()
  }

  const [notification, setNotification] = useState("")
  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => {
      setNotification("")
    }, 2000)
  }

  const addBlackList = async () => {
    const storage = new Storage()
    const blackList = (await storage.get<string>(BLACK_LIST_STORAGE_KEY)) || ""
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentUrl = new URL(tabs[0].url)
      const currentUrlWithoutParams = `${currentUrl.origin}${currentUrl.pathname}`
      if (blackList) {
        await storage.set(
          BLACK_LIST_STORAGE_KEY,
          `${blackList}\n${currentUrlWithoutParams}`
        )
      } else {
        await storage.set(BLACK_LIST_STORAGE_KEY, currentUrlWithoutParams)
      }
      await toggleIMESubmitBlock(false)
      showNotification(`Added ${currentUrlWithoutParams} to Black List`)
    })
  }

  return (
    <div className="w-[270px] p-3">
      <h1 className="text-sm font-bold flex gap-1 items-center">
        <ShieldIcon />
        IME Submit Blocker
      </h1>
      <div className="border p-2 grid gap-2 grid-cols-2 rounded mt-2">
        <button
          className="btn btn-xs w-full btn-primary"
          onClick={() => {
            toggleIMESubmitBlock(true)
            showNotification("Blocker is enabled")
          }}>
          apply
        </button>
        <button
          className="btn btn-xs w-full"
          onClick={() => {
            toggleIMESubmitBlock(false)
            showNotification("Blocker is disabled")
          }}>
          cancel
        </button>
      </div>
      <div className="flex gap-2 mt-3 justify-between items-center">
        <button
          className="btn btn-xs btn-outline text-right btn-secondary"
          onClick={() => addBlackList()}>
          add black list
        </button>
        <p className="link text-right" onClick={openOptionPage}>
          open settings
        </p>
      </div>
      {notification && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.7)]">
          <div className="text-white p-4 shadow-lg animate-fade-in-down font-bold">
            <p>{notification}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default IndexPopup
