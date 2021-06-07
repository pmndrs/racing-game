import { useEffect } from 'react'
import debounce from 'lodash-es/debounce'

export function InactiveMouse({ delay = 3000 }) {
  useEffect(() => {
    let isIdle = true

    const hideMouse = debounce(() => {
      isIdle = true
      document.documentElement.style = 'cursor: none'
    }, delay)

    const onMouseMovement = () => {
      if (isIdle) {
        isIdle = false
        document.documentElement.style = ''
      }
      hideMouse()
    }

    window.addEventListener('mousemove', onMouseMovement, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMovement)
  }, [delay])
  return null
}
