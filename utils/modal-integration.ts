/**
 * This utility ensures that our custom modal is properly integrated with the application.
 * It intercepts calls to open the text modal and redirects them to our custom implementation.
 */
export const integrateCustomTextModal = () => {
  if (typeof window === "undefined") return

  // Store the original implementation
  const originalOpenTextModal = window.openTextModal

  // Replace with our custom implementation
  window.openTextModal = () => {
    // Get the custom modal element
    const customModal = document.getElementById("text-modal-exact")

    if (customModal) {
      // If our custom modal exists, open it
      const event = new CustomEvent("open-text-modal-exact")
      document.dispatchEvent(event)
    } else {
      // Otherwise, fall back to the original implementation
      if (originalOpenTextModal) {
        originalOpenTextModal()
      }
    }
  }

  // Return a cleanup function
  return () => {
    window.openTextModal = originalOpenTextModal
  }
}
