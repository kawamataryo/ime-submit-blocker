import { sendToContentScript } from "@plasmohq/messaging"
import { INITIALIZE_SUBMIT_BLOCK_MESSAGE_NAME } from "~lib/constants"

// SPAでのページ遷移への対応
(() => {
  chrome.history.onVisited.addListener(
    async () => {
      await sendToContentScript({
        name: INITIALIZE_SUBMIT_BLOCK_MESSAGE_NAME,
      })
    }
  )
})()
