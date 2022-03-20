import { useEffect } from 'react'
import { useStore } from '../store'
import type { KeyConfig, KeyMap } from '../store'

function useKeys(keyConfig: KeyConfig[]) {
  useEffect(() => {
    const keyMap = keyConfig.reduce<{ [key: string]: KeyMap }>((out, { keys, fn, up = true }) => {
      keys && keys.forEach((key) => key.values.forEach((value) => (out[value] = { fn, pressed: false, up })))
      return out
    }, {})

    const downHandler = ({ code, target }: KeyboardEvent) => {
      if (!keyMap[code] || (target as HTMLElement).nodeName === 'INPUT') return
      const { fn, pressed, up } = keyMap[code]
      keyMap[code].pressed = true
      if (up || !pressed) fn(true)
    }

    const upHandler = ({ code, target }: KeyboardEvent) => {
      if (!keyMap[code] || (target as HTMLElement).nodeName === 'INPUT') return
      const { fn, up } = keyMap[code]
      keyMap[code].pressed = false
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
  const keyboardBindings = useStore((state) => state.keyboardBindings)
  useKeys(keyboardBindings)
  return null
}
