export const preventEnterOnIME = (
  dom: Document | ShadowRoot,
  signal: AbortSignal
) => {
  const webComponents = Array.from(dom.querySelectorAll("*")).filter((d) =>
    d.tagName.includes("-")
  )

  let lastKeyDownIsIME = false

  webComponents.forEach((d) => {
    if (d.shadowRoot) {
      preventEnterOnIME(d.shadowRoot, signal)
    }
  })

  dom.addEventListener(
    "keydown",
    (e: KeyboardEvent) => {
      if (!(e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement)) return
      if (e.key === "Enter") {
        if (e.isComposing) {
          e.preventDefault()
          e.stopPropagation()
          lastKeyDownIsIME = true
        } else {
          lastKeyDownIsIME = false
        }
      }
    },
    {
      capture: true,
      signal
    }
  )

  dom.addEventListener(
    "keyup",
    (e: KeyboardEvent) => {
      if (!(e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement)) return
      if (e.key === "Enter" && lastKeyDownIsIME) {
        e.preventDefault()
        e.stopPropagation()
        lastKeyDownIsIME = false
      }
    },
    {
      capture: true,
      signal
    }
  )
}
