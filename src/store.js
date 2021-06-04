import { createRef } from 'react'
import create from 'zustand'

const useStore = create((set, get) => {
  const cameraTypes = ['DEFAULT', 'FIRST_PERSON', 'BIRD_EYE']

  const vehicleConfig = {
    radius: 0.7,
    width: 1.2,
    height: -0.04,
    front: 1.5,
    back: -1.15,
    steer: 0.3,
    force: 1800,
    maxBrake: 65,
    maxSpeed: 128,
  }

  const wheelInfo = {
    radius: vehicleConfig.radius,
    directionLocal: [0, -1, 0],
    suspensionStiffness: 30,
    suspensionRestLength: 0.3,
    axleLocal: [-1, 0, 0],
    chassisConnectionPointLocal: [1, 0, 1],
    useCustomSlidingRotationalSpeed: true,
    customSlidingRotationalSpeed: -0.01,
    suspensionForce: 100,
    frictionSlip: 1.5,
    sideAcceleration: 3,
  }

  const wheelInfo1 = {
    ...wheelInfo,
    isFrontWheel: true,
    chassisConnectionPointLocal: [-vehicleConfig.width / 2, vehicleConfig.height, vehicleConfig.front],
  }

  const wheelInfo2 = {
    ...wheelInfo,
    isFrontWheel: true,
    chassisConnectionPointLocal: [vehicleConfig.width / 2, vehicleConfig.height, vehicleConfig.front],
  }

  const wheelInfo3 = {
    ...wheelInfo,
    isFrontWheel: false,
    chassisConnectionPointLocal: [-vehicleConfig.width / 2, vehicleConfig.height, vehicleConfig.back],
  }

  const wheelInfo4 = {
    ...wheelInfo,
    isFrontWheel: false,
    chassisConnectionPointLocal: [vehicleConfig.width / 2, vehicleConfig.height, vehicleConfig.back],
  }

  return {
    set,
    get,
    ready: false,
    editor: false,
    raycast: {
      chassisBody: createRef(),
      wheels: [createRef(), createRef(), createRef(), createRef()],
      wheelInfos: [wheelInfo1, wheelInfo2, wheelInfo3, wheelInfo4],
      indexForwardAxis: 2,
      indexRightAxis: 0,
      indexUpAxis: 1,
    },
    controls: {
      forward: false,
      backward: false,
      left: false,
      right: false,
      brake: false,
      honk: false,
      boost: false,
      cameraType: cameraTypes[0],
      reset: false,
    },
    velocity: [0, 0, 0],
    speed: 0,
    constants: {
      cameraTypes,
      vehicleConfig,
      vehicleStart: {
        rotation: [0, Math.PI / 2, 0],
        position: [0, 1, 0],
        angularVelocity: [0, 0.5, 0],
      },
    },
  }
})

export { useStore }
