/**
 * Dispatches a custom event with the given name and detail
 */
export function dispatchCustomEvent(eventName: string, detail: any = {}) {
  const event = new CustomEvent(eventName, {
    bubbles: true,
    cancelable: true,
    detail,
  })

  document.dispatchEvent(event)
  window.dispatchEvent(event)

  // Log for debugging
  console.log(`Dispatched event: ${eventName}`, detail)

  return event
}

/**
 * Adds an event listener for a custom event
 */
export function addCustomEventListener(
  eventName: string,
  handler: (event: CustomEvent) => void,
  options?: boolean | AddEventListenerOptions,
) {
  const wrappedHandler = (e: Event) => handler(e as CustomEvent)

  document.addEventListener(eventName, wrappedHandler, options)
  window.addEventListener(eventName, wrappedHandler, options)

  // Return a function to remove the event listener
  return () => {
    document.removeEventListener(eventName, wrappedHandler, options)
    window.removeEventListener(eventName, wrappedHandler, options)
  }
}
