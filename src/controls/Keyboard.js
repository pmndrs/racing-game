import { useEffect } from 'react'
import { useStore, cameras } from '../store'

const pressed = []

function useKeys(target, event, up = true) {
  useEffect(() => {
    const downHandler = (e) => {
      if (target.indexOf(e.key) !== -1) {
        const isRepeating = !!pressed[e.keyCode]
        pressed[e.keyCode] = true
        if (up || !isRepeating) event(true)
      }
    }

    const upHandler = (e) => {
      if (target.indexOf(e.key) !== -1) {
        pressed[e.keyCode] = false
        if (up) event(false)
      }
    }

    window.addEventListener('keydown', downHandler, { passive: true })
    window.addEventListener('keyup', upHandler, { passive: true })
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [target, event, up, pressed])
}

export function KeyboardControls() {
  const set = useStore((state) => state.set)
  useKeys(['ArrowUp', 'w', 'W'], (forward) => set((state) => ({ ...state, controls: { ...state.controls, forward } })))
  useKeys(['ArrowDown', 's', 'S'], (backward) => set((state) => ({ ...state, controls: { ...state.controls, backward } })))
  useKeys(['ArrowLeft', 'a', 'A'], (left) => set((state) => ({ ...state, controls: { ...state.controls, left } })))
  useKeys(['ArrowRight', 'd', 'D'], (right) => set((state) => ({ ...state, controls: { ...state.controls, right } })))
  useKeys([' '], (brake) => set((state) => ({ ...state, controls: { ...state.controls, brake } })))
  useKeys(['h', 'H'], (honk) => set((state) => ({ ...state, controls: { ...state.controls, honk } })))
  useKeys(['Shift'], (boost) => set((state) => ({ ...state, controls: { ...state.controls, boost } })))
  useKeys(['r', 'R'], (reset) => set((state) => ({ ...state, controls: { ...state.controls, reset } })))
  useKeys(['e', 'E'], () => set((state) => ({ ...state, editor: !state.editor })), false)
  useKeys(['i', 'I'], () => set((state) => ({ ...state, help: !state.help })), false)
  useKeys(
    ['c', 'C'],
    () =>
      set((state) => {
        const current = cameras.indexOf(state.camera)
        const next = (current + 1) % cameras.length
        const camera = cameras[next]
        return { ...state, camera }
      }),
    false,
  )
  useKeys(['m', 'M'], (toggleMap) => set((state) => ({ ...state, controls: { ...state.controls, map: toggleMap ? !state.controls.map : state.controls.map } })))
  useKeys(['x', 'X'], (toggleSfx) => set((state) => ({ ...state, controls: { ...state.controls, sfx: toggleSfx ? !state.controls.sfx : state.controls.sfx } })))

  return null
}
