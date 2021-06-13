import { createRef } from 'react'
import { proxy, ref } from 'valtio'

export const angularVelocity = [0, 0.5, 0]
export const cameras = ['DEFAULT', 'FIRST_PERSON', 'BIRD_EYE']
export const levelLayer = 1
export const position = [-110, 0.75, 220]
export const rotation = [0, Math.PI / 2 + 0.35, 0]

export const vehicleConfig = {
  radius: 0.38,
  width: 1.7,
  height: -0.3,
  front: 1.35,
  back: -1.3,
  steer: 0.3,
  force: 1800,
  maxBrake: 65,
  maxSpeed: 128,
}

export const wheelInfo = {
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

const wheelInfos = [
  {
    ...wheelInfo,
    isFrontWheel: true,
    chassisConnectionPointLocal: [-vehicleConfig.width / 2, vehicleConfig.height, vehicleConfig.front],
  },
  {
    ...wheelInfo,
    isFrontWheel: true,
    chassisConnectionPointLocal: [vehicleConfig.width / 2, vehicleConfig.height, vehicleConfig.front],
  },
  {
    ...wheelInfo,
    isFrontWheel: false,
    chassisConnectionPointLocal: [-vehicleConfig.width / 2, vehicleConfig.height, vehicleConfig.back],
  },
  {
    ...wheelInfo,
    isFrontWheel: false,
    chassisConnectionPointLocal: [vehicleConfig.width / 2, vehicleConfig.height, vehicleConfig.back],
  },
]

export const gameState = proxy({
  dpr: 1.5,
  shadows: true,
  camera: cameras[0],
  ready: false,
  editor: false,
  finished: false,
  help: false,
  leaderboard: false,
  debug: false,
  stats: false,
  sound: true,
  level: ref(createRef()),
  map: true,
  raycast: ref({
    chassisBody: createRef(),
    wheels: [createRef(), createRef(), createRef(), createRef()],
    wheelInfos,
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1,
  }),
  controls: {
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
    honk: false,
    boost: false,
  },
  vehicleConfig,
  session: null,
})

export const mutation = {
  // Everything in here is mutated to avoid even slight overhead
  velocity: [0, 0, 0],
  speed: 0,
  start: 0,
  finish: 0,
  sliding: false,
}

export const reset = () => {
  mutation.start = 0
  mutation.finish = 0

  gameState.raycast.chassisBody.current.api.position.set(...position)
  gameState.raycast.chassisBody.current.api.velocity.set(0, 0, 0)
  gameState.raycast.chassisBody.current.api.angularVelocity.set(...angularVelocity)
  gameState.raycast.chassisBody.current.api.rotation.set(...rotation)

  gameState.finished = false
}
