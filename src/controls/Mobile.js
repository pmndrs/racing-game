import { useEffect } from 'react'
import { useStore } from '../store'

const pressed = []

function useTouch(target, event, up = true) {
  useEffect(() => {
    const downHandler = (e) => {
      if (target.indexOf(e.target.value) !== -1) {
        const isRepeating = !!pressed[e.target.value]
        pressed[e.target.value] = true
        if (up || !isRepeating) event(true)
      }
    }

    const upHandler = (e) => {
      if (target.indexOf(e.target.value) !== -1) {
        pressed[e.target.value] = false
        if (up) event(false)
      }
    }

    window.addEventListener('touchstart', downHandler, { passive: true })
    window.addEventListener('touchend', upHandler, { passive: true })
    return () => {
      window.removeEventListener('touchstart', downHandler)
      window.removeEventListener('touchend', upHandler)
    }
  }, [target, event, up, pressed])
}

export function TouchControls() {
  const set = useStore((state) => state.set)
  useTouch(['forward'], (forward) => set((state) => ({ ...state, controls: { ...state.controls, forward } })))
  useTouch(['backward'], (backward) => set((state) => ({ ...state, controls: { ...state.controls, backward } })))
  useTouch(['left'], (left) => set((state) => ({ ...state, controls: { ...state.controls, left } })))
  useTouch(['right'], (right) => set((state) => ({ ...state, controls: { ...state.controls, right } })))
  useTouch(['reset'], (reset) => set((state) => ({ ...state, controls: { ...state.controls, reset } })))
  useTouch(['boost'], (boost) => set((state) => ({ ...state, controls: { ...state.controls, boost, forward: boost } })))

  return null
}
