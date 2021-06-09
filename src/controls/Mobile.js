import { useEffect } from 'react'
import { isIOS } from 'react-device-detect'
import { useStore } from '../store'

function useTouch(touchConfig) {
  useEffect(() => {
    const touchMap = touchConfig.reduce((out, { buttonValue, fn, up = true }) => {
      buttonValue.forEach((value) => (out[value] = { fn, pressed: false, up }))
      return out
    }, {})

    const downHandler = (event) => {
      if (isIOS) event.preventDefault()
      if (!touchMap[event.target.value]) return

      const { fn, pressed, up } = touchMap[event.target.value]
      touchMap[event.target.value].pressed = true
      if (up || !pressed) fn(true)
    }

    const upHandler = (event) => {
      if (isIOS) event.preventDefault()
      if (!touchMap[event.target.value]) return

      const { fn, up } = touchMap[event.target.value]
      touchMap[event.target.value].pressed = false
      if (up) fn(false)
    }

    window.addEventListener('touchstart', downHandler, { passive: true })
    window.addEventListener('touchend', upHandler, { passive: true })
    return () => {
      window.removeEventListener('touchstart', downHandler)
      window.removeEventListener('touchend', upHandler)
    }
  }, [touchConfig])
}

export function TouchControls() {
  const set = useStore((state) => state.set)
  useTouch([
    {
      buttonValue: ['forward'],
      fn: (forward) => set((state) => ({ ...state, controls: { ...state.controls, forward } })),
    },
    {
      buttonValue: ['backward'],
      fn: (backward) => set((state) => ({ ...state, controls: { ...state.controls, backward } })),
    },
    {
      buttonValue: ['left'],
      fn: (left) => set((state) => ({ ...state, controls: { ...state.controls, left } })),
    },
    {
      buttonValue: ['right'],
      fn: (right) => set((state) => ({ ...state, controls: { ...state.controls, right } })),
    },
    {
      buttonValue: ['reset'],
      fn: (reset) => set((state) => ({ ...state, controls: { ...state.controls, reset } })),
    },
    {
      buttonValue: ['boost'],
      fn: (boost) => set((state) => ({ ...state, controls: { ...state.controls, boost, forward: boost } })),
    },
  ])
  return null
}
