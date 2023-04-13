import "./style.css"

import iconImageData from "data-base64:~assets/icon-min.png"
import { useState } from "react"

import { sendToContentScript } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import {
  BLACK_LIST_STORAGE_KEY,
  TOGGLE_IME_SUBMIT_BLOCK_MESSAGE_NAME
} from "~lib/constants"

function IndexPopup() {
  const toggleIMESubmitBlock = async (isBlocked: boolean) => {
    await sendToContentScript({
      name: TOGGLE_IME_SUBMIT_BLOCK_MESSAGE_NAME,
      body: {
        isBlocked,
        shouldWait: false
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
    }, 2500)
  }

  const addBlackList = async () => {
    const storage = new Storage()
    const blackList = (await storage.get<string>(BLACK_LIST_STORAGE_KEY)) || ""
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentUrl = new URL(tabs[0].url)
      if (blackList) {
        await storage.set(
          BLACK_LIST_STORAGE_KEY,
          `${blackList}\n${currentUrl.origin}`
        )
      } else {
        await storage.set(BLACK_LIST_STORAGE_KEY, currentUrl.origin)
      }
      await toggleIMESubmitBlock(false)
      showNotification(`Added \n${currentUrl.origin}\n to Black List`)
    })
  }

  return (
    <div className="w-[270px] p-3">
      <h1 className="text-sm font-bold flex gap-1 items-center">
        <img src={iconImageData} alt="" className="w-[26px] mr-1" />
        IME Submit Blocker
      </h1>
      <div className="border p-2 grid gap-2 grid-cols-2 rounded mt-2 border-base-content">
        <button
          className="btn btn-xs w-full btn-primary"
          onClick={() => {
            toggleIMESubmitBlock(true)
            showNotification("Blocker is enabled")
          }}>
          apply
        </button>
        <button
          className="btn btn-xs w-full btn-primary btn-outline hover:!bg-transparent hover:!text-primary"
          onClick={() => {
            toggleIMESubmitBlock(false)
            showNotification("Blocker is disabled")
          }}>
          cancel
        </button>
      </div>
      <div className="flex gap-2 mt-3 justify-between items-center">
        <button
          className="btn btn-xs btn-link text-base-content"
          onClick={() => addBlackList()}>
          + add black list
        </button>
        <p className="link text-right" onClick={openOptionPage}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="m9.25 22l-.4-3.2q-.325-.125-.613-.3t-.562-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.337v-.674q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2h-5.5Zm2.8-6.5q1.45 0 2.475-1.025T15.55 12q0-1.45-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12q0 1.45 1.012 2.475T12.05 15.5Z"></path>
          </svg>
        </p>
      </div>
      {notification && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(100,100,100,0.3)] p-3">
          <div className="text-base-content p-4 shadow-lg animate-fade-in-down font-bold bg-base-100 rounded">
            <p className="flex items-center gap-1">
              <svg
                className="w-[30px] text-primary"
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="m10 17l-5-5l1.41-1.42L10 14.17l7.59-7.59L19 8m-7-6A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2Z"></path>
              </svg>
              {notification}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default IndexPopup
