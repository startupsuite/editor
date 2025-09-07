/**
 * This utility ensures that our isolated text modal is properly registered with the application.
 */
export const registerIsolatedTextModal = () => {
  if (typeof window === "undefined") return

  // Create a global registry for modals if it doesn't exist
  if (!window.modalRegistry) {
    window.modalRegistry = {}
  }

  // Register our text modal
  window.modalRegistry.textModal = {
    type: "isolated",
    version: "1.0.0",
  }

  // Create a custom event to notify the application that the text modal is ready
  const event = new CustomEvent("text-modal-ready", {
    detail: {
      type: "isolated",
      version: "1.0.0",
    },
  })

  document.dispatchEvent(event)

  // Return a cleanup function
  return () => {
    if (window.modalRegistry) {
      delete window.modalRegistry.textModal
    }
  }
}

// Add TypeScript definitions
declare global {
  interface Window {
    modalRegistry?: {
      [key: string]: {
        type: string
        version: string
      }
    }
  }
}
