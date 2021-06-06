function debounce(delay, fn) {
  let timeoutId = null
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      timeoutId = null
      fn(...args)
    }, delay)
  }
}

export function InactiveMouse({ INACTIVITY_DELAY = 3000 }) {
  let isIdle = true
  const hideMouse = debounce(INACTIVITY_DELAY, () => {
    isIdle = true
    document.documentElement.style = 'cursor: none'
  })

  window.addEventListener('mousemove', () => {
    if (isIdle) {
      isIdle = false
      document.documentElement.style = ''
    }
    hideMouse()
  })
  return null
}
