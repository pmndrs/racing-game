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

const INACTIVITY_DELAY = 3000
let isIdle = true
const hideMouse = debounce(INACTIVITY_DELAY, () => {
  isIdle = true
  document.documentElement.style = 'cursor: none'
})
const onMouseMovement = () => {
    if (isIdle) {
      isIdle = false
      document.documentElement.style = ''
    }
    hideMouse()
}

export function InactiveMouse() {
  window.addEventListener('mousemove', onMouseMovement, {passive: true})
  return null
}
