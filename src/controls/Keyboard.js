import { useEffect } from 'react'
import { useStore, cameras } from '../store'

function useKeys(keyConfig) {
  useEffect(() => {
    const keyMap = keyConfig.reduce((out, { keys, fn, up = true }) => {
      keys.forEach((key) => (out[key] = { fn, pressed: false, up }))
      return out
    }, {})

    const downHandler = ({ key }) => {
      if (!keyMap[key]) return

      const { fn, pressed, up } = keyMap[key]
      keyMap[key].pressed = true
      if (up || !pressed) fn(true)
    }

    const upHandler = ({ key }) => {
      if (!keyMap[key]) return

      const { fn, up } = keyMap[key]
      keyMap[key].pressed = false
      if (up) fn(false)
    }

    window.addEventListener('keydown', downHandler, { passive: true })
    window.addEventListener('keyup', upHandler, { passive: true })

    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [keyConfig])
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
