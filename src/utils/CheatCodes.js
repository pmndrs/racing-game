import { useEffect, useState } from 'react'
import { useStore } from '../store'

const CHEAT_CODE_BUFFER_SIZE = 20

function updateVehicleSize(scale) {
  useStore.setState((state) => ({ vehicleConfig: { ...state.vehicleConfig, scale } }))
}

const CHEAT_CODES = {
  SOBIG: () => {
    updateVehicleSize(3)
  },
  SONORMAL: () => {
    updateVehicleSize(1)
  },
  SOTINY: () => {
    updateVehicleSize(0.25)
  },
  LOWGRAVITY: () => {
    useStore.setState({ gravity: -5 })
  },
  NORMALGRAVITY: () => {
    useStore.setState({ gravity: -10 })
  },
}

function CheatCodes() {
  const [cheatCodeBuffer, setCheatCodeBuffer] = useState([])

  function handleKeyPress({ key }) {
    setCheatCodeBuffer((buffer) => {
      let newBuffer = [...buffer, key]
      if (buffer.length === CHEAT_CODE_BUFFER_SIZE) {
        newBuffer = newBuffer.slice(1)
      }
      return newBuffer
    })
  }

  useEffect(function () {
    window.addEventListener('keyup', handleKeyPress)

    return () => window.removeEventListener('keyup', handleKeyPress)
  }, [])

  useEffect(() => {
    const cheatCode = cheatCodeBuffer.join('')
    const cheatCodeKeys = Object.keys(CHEAT_CODES)
    const enabledCheatCode = cheatCodeKeys.find((key) => cheatCode.includes(key))
    if (enabledCheatCode) {
      CHEAT_CODES[enabledCheatCode]()
      setCheatCodeBuffer([])
    }
  }, [cheatCodeBuffer])

  return null
}

export { CheatCodes }
