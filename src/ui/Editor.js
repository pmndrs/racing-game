import { useControls } from 'leva'
import { useStore } from '../store'

export function Editor() {
  const vehicleConfig = useStore((state) => state.constants.vehicleConfig)
  const get = useStore((state) => state.get)
  const set = useStore((state) => state.set)

  const [, setVehicleEditor] = useControls(() => ({
    radius: {
      value: vehicleConfig.radius,
      min: 0.1,
      max: 2,
      step: 0.1,
      onChange: (value) => {
        set({
          constants: { ...get().constants, vehicleConfig: { ...get().constants.vehicleConfig, radius: value } },
          raycast: { ...get().raycast, wheelInfos: get().raycast.wheelInfos.map((info) => ({ ...info, radius: value })) },
        })
      },
    },
    width: {
      value: vehicleConfig.width,
      min: 0.1,
      max: 10,
      step: 0.1,
      onChange: (value) => {
        set({
          constants: { ...get().constants, vehicleConfig: { ...get().constants.vehicleConfig, width: value } },
          raycast: {
            ...get().raycast,
            wheelInfos: get().raycast.wheelInfos.map((info) => ({
              ...info,
              chassisConnectionPointLocal: [
                info.chassisConnectionPointLocal[0] < 0 ? -value / 2 : value / 2,
                info.chassisConnectionPointLocal[1],
                info.chassisConnectionPointLocal[2],
              ],
            })),
          },
        })
      },
    },
    height: {
      value: vehicleConfig.height,
      min: -5,
      max: 5,
      step: 0.01,
      onChange: (value) => {
        set({
          constants: { ...get().constants, vehicleConfig: { ...get().constants.vehicleConfig, height: value } },
          raycast: {
            ...get().raycast,
            wheelInfos: get().raycast.wheelInfos.map((info) => ({
              ...info,
              chassisConnectionPointLocal: [info.chassisConnectionPointLocal[0], value, info.chassisConnectionPointLocal[2]],
            })),
          },
        })
      },
    },
    front: {
      value: vehicleConfig.front,
      min: -10,
      max: 10,
      step: 0.05,
      onChange: (value) => {
        set({
          constants: { ...get().constants, vehicleConfig: { ...get().constants.vehicleConfig, front: value } },
          raycast: {
            ...get().raycast,
            wheelInfos: get().raycast.wheelInfos.map((info, index) => ({
              ...info,
              chassisConnectionPointLocal: [
                info.chassisConnectionPointLocal[0],
                info.chassisConnectionPointLocal[1],
                index < 2 ? value : info.chassisConnectionPointLocal[2],
              ],
            })),
          },
        })
      },
    },
    back: {
      value: vehicleConfig.back,
      min: -10,
      max: 10,
      step: 0.05,
      onChange: (value) => {
        set({
          constants: { ...get().constants, vehicleConfig: { ...get().constants.vehicleConfig, back: value } },
          raycast: {
            ...get().raycast,
            wheelInfos: get().raycast.wheelInfos.map((info, index) => ({
              ...info,
              chassisConnectionPointLocal: [
                info.chassisConnectionPointLocal[0],
                info.chassisConnectionPointLocal[1],
                index < 2 ? info.chassisConnectionPointLocal[2] : value,
              ],
            })),
          },
        })
      },
    },
    steer: {
      value: vehicleConfig.steer,
      min: 0.1,
      max: 1,
      step: 0.01,
      onChange: (value) => {
        set({ constants: { ...get().constants, vehicleConfig: { ...get().constants.vehicleConfig, steer: value } } })
      },
    },
    force: {
      value: vehicleConfig.force,
      min: 0,
      max: 3000,
      step: 1,
      onChange: (value) => {
        set({ constants: { ...get().constants, vehicleConfig: { ...get().constants.vehicleConfig, force: value } } })
      },
    },
    maxBrake: {
      value: vehicleConfig.maxBrake,
      min: 0.1,
      max: 100,
      step: 0.1,
      onChange: (value) => {
        set({ constants: { ...get().constants, vehicleConfig: { ...get().constants.vehicleConfig, maxBrake: value } } })
      },
    },
    maxSpeed: {
      value: vehicleConfig.maxSpeed,
      min: 1,
      max: 150,
      step: 1,
      onChange: (value) => {
        set({ constants: { ...get().constants, vehicleConfig: { ...get().constants.vehicleConfig, maxSpeed: value } } })
      },
    },
    suspensionStiffness: {
      value: 30,
      min: 0,
      max: 500,
      step: 1,
      onChange: (value) => {
        set({
          raycast: {
            ...get().raycast,
            wheelInfos: get().raycast.wheelInfos.map((info) => ({
              ...info,
              suspensionStiffness: value,
            })),
          },
        })
      },
    },
    suspensionRestLength: {
      value: 0.3,
      min: -10,
      max: 10,
      step: 0.01,
      onChange: (value) => {
        set({
          raycast: {
            ...get().raycast,
            wheelInfos: get().raycast.wheelInfos.map((info) => ({
              ...info,
              suspensionRestLength: value,
            })),
          },
        })
      },
    },
    useCustomSlidingRotationalSpeed: {
      value: true,
      onChange: (value) => {
        set({
          raycast: {
            ...get().raycast,
            wheelInfos: get().raycast.wheelInfos.map((info) => ({
              ...info,
              useCustomSlidingRotationalSpeed: value,
            })),
          },
        })
      },
    },
    customSlidingRotationalSpeed: {
      value: -0.01,
      min: -10,
      max: 10,
      step: 0.01,
      onChange: (value) => {
        set({
          raycast: {
            ...get().raycast,
            wheelInfos: get().raycast.wheelInfos.map((info) => ({
              ...info,
              customSlidingRotationalSpeed: value,
            })),
          },
        })
      },
    },
    suspensionForce: {
      value: 100,
      min: 0,
      max: 500,
      step: 0.1,
      onChange: (value) => {
        set({
          raycast: {
            ...get().raycast,
            wheelInfos: get().raycast.wheelInfos.map((info) => ({
              ...info,
              suspensionForce: value,
            })),
          },
        })
      },
    },
    frictionSlip: {
      value: 1.5,
      min: -10,
      max: 10,
      step: 0.01,
      onChange: (value) => {
        set({
          raycast: {
            ...get().raycast,
            wheelInfos: get().raycast.wheelInfos.map((info) => ({
              ...info,
              frictionSlip: value,
            })),
          },
        })
      },
    },
    sideAcceleration: {
      value: 3,
      min: -10,
      max: 10,
      step: 0.01,
      onChange: (value) => {
        set({
          raycast: {
            ...get().raycast,
            wheelInfos: get().raycast.wheelInfos.map((info) => ({
              ...info,
              sideAcceleration: value,
            })),
          },
        })
      },
    },
    reset: {
      value: false,
      onChange: () => {
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
          suspensionStiffness: 30,
          suspensionRestLength: 0.3,
          useCustomSlidingRotationalSpeed: true,
          customSlidingRotationalSpeed: -0.01,
          suspensionForce: 100,
          frictionSlip: 1.5,
          sideAcceleration: 3,
          reset: false,
        })
      },
    },
  }))

  return (
    <button className="play-btn" onClick={() => set({ editor: false })}>
      Play
    </button>
  )
}
