import { useControls } from 'leva'
import { useStore } from '../utils/store'

export function Editor() {
  const config = useStore((state) => state.config)
  const set = useStore((state) => state.set)
  const vehicleConfig = useControls({
    radius: {
      value: config.radius,
      min: 0.1,
      max: 5,
      step: 0.1,
      onChange: (value) => {
        set({config: {...config, radius: value}})
      }
    },
    width: {
      value: config.width,
      min: 0.1,
      max: 10,
      step: 0.1,
      onChange: (value) => {
        set({config: {...config, width: value}})
      }
    },
    height: {
      value: config.height,
      min: -5,
      max: 5,
      step: 0.01,
      onChange: (value) => {
        set({config: {...config, height: value}})
      }
    },
    front: {
      value: config.front,
      min: -10,
      max: 10,
      step: 0.05,
      onChange: (value) => {
        set({config: {...config, front: value}})
      }
    },
    back: {
      value: config.back,
      min: -10,
      max: 10,
      step: 0.05,
      onChange: (value) => {
        set({config: {...config, back: value}})
      }
    },
    steer: {
      value: config.steer,
      min: 0.1,
      max: 1,
      step: 0.01,
      onChange: (value) => {
        set({config: {...config, steer: value}})
      }
    },
    force: 1800,
    maxBrake: 65,
    maxSpeed: 128,
  })

  return true
}