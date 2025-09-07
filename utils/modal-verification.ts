/**
 * Utility to verify the text modal matches the design
 */
export const verifyTextModalDesign = () => {
  // This function would be used in development to verify the modal design
  const checkpoints = [
    { element: ".text-modal-exact", property: "background-color", expected: "#ffffff" },
    { element: ".text-modal-exact .bg-purple-50", property: "background-color", expected: "#f5f3ff" },
    { element: ".text-modal-exact .text-blue-600", property: "color", expected: "#2563eb" },
    { element: ".text-modal-exact .border-blue-600", property: "border-color", expected: "#2563eb" },
    // Add more checkpoints as needed
  ]

  const results = checkpoints.map((checkpoint) => {
    const elements = document.querySelectorAll(checkpoint.element)
    if (elements.length === 0) {
      return { checkpoint, status: "failed", message: "Element not found" }
    }

    const computedStyle = window.getComputedStyle(elements[0])
    const actualValue = computedStyle.getPropertyValue(checkpoint.property)
    const matches = actualValue === checkpoint.expected

    return {
      checkpoint,
      status: matches ? "passed" : "failed",
      actual: actualValue,
      expected: checkpoint.expected,
    }
  })

  console.table(results)

  return results.every((result) => result.status === "passed")
}
