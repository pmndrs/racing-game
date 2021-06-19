import { useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import { downHandler, parseActionConfig, upHandler } from '../lib'

const actionMap = parseActionConfig()

function useKeys() {
  useEffect(() => {
    window.addEventListener('keydown', (e) => downHandler(e, actionMap), { passive: true })
    window.addEventListener('keyup', (e) => upHandler(e, actionMap), { passive: true })

    return () => {
      window.removeEventListener('keydown', (e) => downHandler(e, actionMap))
      window.removeEventListener('keyup', (e) => upHandler(e, actionMap))
    }
  }, [])
}

function useTouch() {
  useEffect(() => {
    window.addEventListener('touchstart', (e) => downHandler(e, actionMap), { passive: true })
    window.addEventListener('touchend', (e) => upHandler(e, actionMap), { passive: true })
    return () => {
      window.removeEventListener('touchstart', (e) => downHandler(e, actionMap))
      window.removeEventListener('touchend', (e) => upHandler(e, actionMap))
    }
  }, [])
}

export function Keyboard() {
  if (isMobile) {
    useTouch()
    return null
  }
  useKeys()
  return null
}
