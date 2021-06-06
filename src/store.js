import { createRef } from 'react'
import create from 'zustand'
import { camera } from './enums.js'

const vehicleConfig = {
  radius: 0.35,
  width: 1.7,
  height: -0.2,
  front: 1.35,
  back: -1.3,
  steer: 0.3,
  force: 1800,
  maxBrake: 65,
  maxSpeed: 128,
}

const wheelInfo = {
  radius: vehicleConfig.radius,
  directionLocal: [0, -1, 0],
  suspensionStiffness: 30,
  suspensionRestLength: 0.35,
  axleLocal: [-1, 0, 0],
  chassisConnectionPointLocal: [1, 0, 1],
  useCustomSlidingRotationalSpeed: true,
  customSlidingRotationalSpeed: -0.01,
  rollInfluence: 0,
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

const useStore = create((set, get) => {
  return {
    set,
    get,
    camera,
    ready: false,
    editor: false,
    help: false,
    debug: false,
    debug: stats,
    level: createRef(),
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
      reset: false,
      map: true,
    },
    vehicleConfig,
    velocity: [0, 0, 0],
    speed: 0,
  }
})

export { useStore, vehicleConfig, wheelInfo, wheelInfo1, wheelInfo2, wheelInfo3, wheelInfo4 }
