export const preventEnterOnIME = (dom: Document | ShadowRoot, signal: AbortSignal) => {
  const webComponents = Array.from(dom.querySelectorAll('*')).filter((d) => d.tagName.includes('-'));

  let lastKeyDownIsIME = false;

  webComponents.forEach((d) =>  {
    if(d.shadowRoot) {
      preventEnterOnIME(d.shadowRoot, signal)
    }
  });

  const input = Array.from(dom.querySelectorAll('input'));
  const textarea = Array.from(dom.querySelectorAll('textarea'));

  [...input, ...textarea].forEach((d) => {
    d.addEventListener('keydown', (e: KeyboardEvent) => {
      if(e.key == 'Enter') {
        if (e.isComposing) {
          e.preventDefault();
          e.stopPropagation();
          lastKeyDownIsIME = true;
        } else {
          lastKeyDownIsIME = false;
        }
      }
    }, {
      capture: true,
      signal
    })

    d.addEventListener('keyup', (e: KeyboardEvent) => {
      if(e.key == 'Enter' && lastKeyDownIsIME) {
        e.preventDefault();
        e.stopPropagation();
        lastKeyDownIsIME = false;
      }
    }, {
      capture: true,
      signal
    })
  })
}
