import { createRef } from 'react'
import create from 'zustand'

function registerKeys(target, event, up = true) {
  const downHandler = ({ key }) => target.indexOf(key) !== -1 && event(true)
  const upHandler = ({ key }) => target.indexOf(key) !== -1 && event(false)
  window.addEventListener('keydown', downHandler)
  if (up) window.addEventListener('keyup', upHandler)
}

const CAMERA_TYPES = ['DEFAULT', 'FIRST_PERSON', 'BIRD_EYE']

const useStore = create((set, get) => {
  // Register keys
  registerKeys(['ArrowUp', 'w', 'W'], (forward) => set((state) => ({ ...state, controls: { ...state.controls, forward } })))
  registerKeys(['ArrowDown', 's', 'S'], (backward) => set((state) => ({ ...state, controls: { ...state.controls, backward } })))
  registerKeys(['ArrowLeft', 'a', 'A'], (left) => set((state) => ({ ...state, controls: { ...state.controls, left } })))
  registerKeys(['ArrowRight', 'd', 'D'], (right) => set((state) => ({ ...state, controls: { ...state.controls, right } })))
  registerKeys([' '], (brake) => set((state) => ({ ...state, controls: { ...state.controls, brake } })))
  registerKeys(['h', 'H'], (honk) => set((state) => ({ ...state, controls: { ...state.controls, honk } })))
  registerKeys(['Shift'], (boost) => set((state) => ({ ...state, controls: { ...state.controls, boost } })))
  registerKeys(['r', 'R'], (reset) => set((state) => ({ ...state, controls: { ...state.controls, reset } })))
  registerKeys(['c', 'C'], (toggleCamera) => set((state) => {
    const currentCameraIndex = CAMERA_TYPES.indexOf(state.controls.cameraType)
    const nextCameraIndex = (currentCameraIndex + 1) % CAMERA_TYPES.length
    const cameraType = toggleCamera ? CAMERA_TYPES[nextCameraIndex]  : state.controls.cameraType
    return ({ ...state, controls: { ...state.controls, cameraType } })
  }))

  // Vehicle config
  const config = {
    radius: 0.7,
    width: 1.2,
    height: -0.04,
    front: 1.5,
    back: -1.15,
    steer: 0.3,
    force: 1800,
    maxBrake: 65,
  }

  const wheelInfo = {
    radius: config.radius,
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
    chassisConnectionPointLocal: [-config.width / 2, config.height, config.front],
  }
  const wheelInfo2 = {
    ...wheelInfo,
    isFrontWheel: true,
    chassisConnectionPointLocal: [config.width / 2, config.height, config.front],
  }
  const wheelInfo3 = {
    ...wheelInfo,
    isFrontWheel: false,
    chassisConnectionPointLocal: [-config.width / 2, config.height, config.back],
  }
  const wheelInfo4 = {
    ...wheelInfo,
    isFrontWheel: false,
    chassisConnectionPointLocal: [config.width / 2, config.height, config.back],
  }
  const raycast = {
    chassisBody: createRef(),
    wheels: [createRef(), createRef(), createRef(), createRef()],
    wheelInfos: [wheelInfo1, wheelInfo2, wheelInfo3, wheelInfo4],
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1,
  }

  return {
    set,
    get,
    config,
    raycast,
    controls: { forward: false, backward: false, left: false, right: false, brake: false, honk: false, boost: false, cameraType: CAMERA_TYPES[0], reset: false },
    velocity: [0, 0, 0],
    speed: 0,
    positions: [...Array(20).map(() => [0, 0, 0])],
    constants: {
      vehicleStart: {
        rotation: [0, Math.PI / 2, 0],
        position: [0, 1, 0],
        angularVelocity: [0, 0.5, 0],
        wheelRadius: 0.3,
      },
    },
  }
})

export { useStore }
