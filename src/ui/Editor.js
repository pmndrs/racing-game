import { useControls } from 'leva'
import { useStore } from '../utils/store'

export function Editor() {
  const config = useStore((state) => state.config)
  const set = useStore((state) => state.set)

  const [vehicleEditor, setVehicleEditor] = useControls(() => ({
    radius: {
      value: config.radius,
      min: 0.1,
      max: 2,
      step: 0.1,
      onChange: (value) => {
        set({ config: { ...config, radius: value } })
      },
    },
    width: {
      value: config.width,
      min: 0.1,
      max: 10,
      step: 0.1,
      onChange: (value) => {
        set({ config: { ...config, width: value } })
      },
    },
    height: {
      value: config.height,
      min: -5,
      max: 5,
      step: 0.01,
      onChange: (value) => {
        set({ config: { ...config, height: value } })
      },
    },
    front: {
      value: config.front,
      min: -10,
      max: 10,
      step: 0.05,
      onChange: (value) => {
        set({ config: { ...config, front: value } })
      },
    },
    back: {
      value: config.back,
      min: -10,
      max: 10,
      step: 0.05,
      onChange: (value) => {
        set({ config: { ...config, back: value } })
      },
    },
    steer: {
      value: config.steer,
      min: 0.1,
      max: 1,
      step: 0.01,
      onChange: (value) => {
        set({ config: { ...config, steer: value } })
      },
    },
    force: {
      value: config.force,
      min: 0,
      max: 3000,
      step: 1,
      onChange: (value) => {
        set({ config: { ...config, force: value } })
      },
    },
    maxBrake: {
      value: config.maxBrake,
      min: 0.1,
      max: 100,
      step: 0.1,
      onChange: (value) => {
        set({ config: { ...config, maxBrake: value } })
      },
    },
    maxSpeed: {
      value: config.maxSpeed,
      min: 1,
      max: 150,
      step: 1,
      onChange: (value) => {
        set({ config: { ...config, maxSpeed: value } })
      },
    },
    reset: {
      value: false,
      onChange: (value) => {
        setVehicleEditor({
          radius: 0.7,
          width: 1.2,
          height: -0.04,
          front: 1.5,
          back: -1.15,
          steer: 0.3,
          force: 1800,
          maxBrake: 65,
          maxSpeed: 128,
          reset: false,
        })
      },
    },
  }))

  return true
}
