import { useEffect } from 'react'
import { cameras, useStore } from '../store'

interface KeyConfig extends KeyMap {
  keys?: string[]
}

interface KeyMap {
  fn: (pressed: boolean) => void
  up?: boolean
  pressed?: boolean
}

function useKeys(keyConfig: KeyConfig[]) {
  useEffect(() => {
    const keyMap = keyConfig.reduce<{ [key: string]: KeyMap }>((out, { keys, fn, up = true }) => {
      keys && keys.forEach((key) => (out[key] = { fn, pressed: false, up }))
      return out
    }, {})

    const downHandler = ({ key, target }: KeyboardEvent) => {
      if (!keyMap[key] || (target as HTMLElement).nodeName === 'INPUT') return
      const { fn, pressed, up } = keyMap[key]
      keyMap[key].pressed = true
      if (up || !pressed) fn(true)
    }

    const upHandler = ({ key, target }: KeyboardEvent) => {
      if (!keyMap[key] || (target as HTMLElement).nodeName === 'INPUT') return
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

export function Keyboard() {
  const { reset, set } = useStore(({ actions: { reset }, set }) => ({ reset, set }))
  useKeys([
    { keys: ['ArrowUp', 'w', 'W', 'z', 'Z'], fn: (forward) => set((state) => ({ controls: { ...state.controls, forward } })) },
    { keys: ['ArrowDown', 's', 'S'], fn: (backward) => set((state) => ({ controls: { ...state.controls, backward } })) },
    { keys: ['ArrowLeft', 'a', 'A', 'q', 'Q'], fn: (left) => set((state) => ({ controls: { ...state.controls, left } })) },
    { keys: ['ArrowRight', 'd', 'D'], fn: (right) => set((state) => ({ controls: { ...state.controls, right } })) },
    { keys: [' '], fn: (brake) => set((state) => ({ controls: { ...state.controls, brake } })) },
    { keys: ['h', 'H'], fn: (honk) => set((state) => ({ controls: { ...state.controls, honk } })) },
    { keys: ['Shift'], fn: (boost) => set((state) => ({ controls: { ...state.controls, boost } })) },
    { keys: ['r', 'R'], fn: reset, up: false },
    { keys: ['.'], fn: () => set((state) => ({ editor: !state.editor })), up: false },
    { keys: ['i', 'I'], fn: () => set((state) => ({ help: !state.help, leaderboard: false })), up: false },
    { keys: ['l', 'L'], fn: () => set((state) => ({ help: false, leaderboard: !state.leaderboard })), up: false },
    { keys: ['m', 'M'], fn: () => set((state) => ({ map: !state.map })), up: false },
    { keys: ['u', 'U'], fn: () => set((state) => ({ sound: !state.sound })), up: false },
    {
      keys: ['c', 'C'],
      fn: () => set((state) => ({ camera: cameras[(cameras.indexOf(state.camera) + 1) % cameras.length] })),
      up: false,
    },
  ])
  return null
}
