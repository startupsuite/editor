/**
 * Logs information about click events on the page
 */
export function setupClickDebugger() {
  if (typeof document === "undefined") return () => {}

  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    const path = getElementPath(target)

    console.log("Click event:", {
      target,
      path,
      x: event.clientX,
      y: event.clientY,
      timestamp: new Date().toISOString(),
    })
  }

  document.addEventListener("click", handleClick, true)

  return () => {
    document.removeEventListener("click", handleClick, true)
  }
}

/**
 * Gets a string representation of the element's path in the DOM
 */
function getElementPath(element: HTMLElement): string {
  const path: string[] = []
  let current: HTMLElement | null = element

  while (current) {
    let identifier = current.tagName.toLowerCase()

    if (current.id) {
      identifier += `#${current.id}`
    } else if (current.className && typeof current.className === "string") {
      const classes = current.className.split(" ").filter(Boolean).join(".")
      if (classes) {
        identifier += `.${classes}`
      }
    }

    path.unshift(identifier)
    current = current.parentElement
  }

  return path.join(" > ")
}

/**
 * Sets up a MutationObserver to log DOM changes
 */
export function setupDOMChangeDebugger(selector = "body") {
  if (typeof document === "undefined") return () => {}

  const targetNode = document.querySelector(selector)
  if (!targetNode) return () => {}

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      console.log("DOM Mutation:", {
        type: mutation.type,
        target: mutation.target,
        addedNodes: Array.from(mutation.addedNodes),
        removedNodes: Array.from(mutation.removedNodes),
        timestamp: new Date().toISOString(),
      })
    })
  })

  observer.observe(targetNode, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  })

  return () => {
    observer.disconnect()
  }
}
