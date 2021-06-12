import { useEffect } from 'react'
import { cameras, reset, gameState } from '../store'

function useKeys(keyConfig) {
  useEffect(() => {
    const keyMap = keyConfig.reduce((out, { keys, fn, up = true }) => {
      keys.forEach((key) => (out[key] = { fn, pressed: false, up }))
      return out
    }, {})

    const downHandler = ({ key, target }) => {
      if (!keyMap[key] || target.nodeName === 'INPUT') return
      const { fn, pressed, up } = keyMap[key]
      keyMap[key].pressed = true
      if (up || !pressed) fn(true)
    }

    const upHandler = ({ key, target }) => {
      if (!keyMap[key] || target.nodeName === 'INPUT') return
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
  useKeys([
    { keys: ['ArrowUp', 'w', 'W'], fn: (forward) => void (gameState.controls.forward = forward) },
    { keys: ['ArrowDown', 's', 'S'], fn: (backward) => void (gameState.controls.backward = backward) },
    { keys: ['ArrowLeft', 'a', 'A'], fn: (left) => void (gameState.controls.left = left) },
    { keys: ['ArrowRight', 'd', 'D'], fn: (right) => void (gameState.controls.right = right) },
    { keys: [' '], fn: (brake) => void (gameState.controls.brake = brake) },
    { keys: ['h', 'H'], fn: (honk) => void (gameState.controls.honk = honk) },
    { keys: ['Shift'], fn: (boost) => void (gameState.controls.boost = boost) },
    { keys: ['r', 'R'], fn: () => reset(), up: false },
    { keys: ['e', 'E'], fn: () => void (gameState.editor = !gameState.editor), up: false },
    {
      keys: ['i', 'I'],
      fn: () => {
        gameState.help = !gameState.help
        gameState.leaderboard = false
      },
      up: false,
    },
    {
      keys: ['l', 'L'],
      fn: () => {
        gameState.help = false
        gameState.leaderboard = !gameState.leaderboard
      },
      up: false,
    },
    { keys: ['m', 'M'], fn: () => void (gameState.map = !gameState.map), up: false },
    { keys: ['u', 'U'], fn: () => void (gameState.sound = !gameState.sound), up: false },
    {
      keys: ['c', 'C'],
      fn: () => {
        gameState.camera = cameras[(cameras.indexOf(gameState.camera) + 1) % cameras.length]
      },
      up: false,
    },
  ])
  return null
}
