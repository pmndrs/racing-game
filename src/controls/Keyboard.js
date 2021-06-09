import { useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import { downHandler, parseActionConfig, upHandler } from '../lib'

const actionMap = parseActionConfig()

function useKeys() {
  useEffect(() => {
    window.addEventListener('keydown', (e) => downHandler(e, actionMap), { passive: true })
    window.addEventListener('keyup', (e) => upHandler(e, actionMap), { passive: true })

    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [])
}

function useTouch() {
  useEffect(() => {
    window.addEventListener('touchstart', (e) => downHandler(e, actionMap), { passive: true })
    window.addEventListener('touchend', (e) => upHandler(e, actionMap), { passive: true })
    return () => {
      window.removeEventListener('touchstart', downHandler)
      window.removeEventListener('touchend', upHandler)
    }
  }, [])
}

export function KeyboardControls() {
  useKeys()
  if (isMobile) {
    useTouch()
  }

  return null
}
