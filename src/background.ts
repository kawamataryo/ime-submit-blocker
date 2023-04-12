import { sendToContentScript } from "@plasmohq/messaging"
import { INITIALIZE_SUBMIT_BLOCK_MESSAGE_NAME } from "~lib/constants"
import { isAutoApply } from "~lib/utils"

// SPAでのページ遷移への対応
(async () => {
  if (!await isAutoApply()) {
    return
  }
  chrome.history.onVisited.addListener(
    async () => {
      await sendToContentScript({
        name: INITIALIZE_SUBMIT_BLOCK_MESSAGE_NAME,
      })
    }
  )
})()
