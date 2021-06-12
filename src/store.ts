import { Api } from '@react-three/cannon'
import { createRef, ForwardedRef, RefObject } from 'react'
import create, { GetState, SetState, StateSelector } from 'zustand'
import shallow from 'zustand/shallow'
import { ChassisRef, WheelRef } from './models/index'

export interface WheelInfo {
  radius: number;
  directionLocal: number[];
  suspensionStiffness: number;
  suspensionRestLength: number;
  axleLocal: number[];
  chassisConnectionPointLocal: number[];
  useCustomSlidingRotationalSpeed: boolean;
  customSlidingRotationalSpeed: number;
  rollInfluence: number;
  suspensionForce: number;
  frictionSlip: number;
  sideAcceleration: number;
}

export const angularVelocity = [0, 0.5, 0]
export const cameras = ['DEFAULT', 'FIRST_PERSON', 'BIRD_EYE']
export const levelLayer = 1
export const position = [-110, 0.75, 220]
export const rotation = [0, Math.PI / 2 + 0.35, 0]

export interface VehicleConfig {
  radius: number;
  width: number;
  height: number;
  front: number;
  back: number;
  steer: number;
  force: number;
  maxBrake: number;
  maxSpeed: number;
}

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

export const wheelInfo: WheelInfo = {
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

type WheelInfosInterface = WheelInfo & { isFrontWheel: boolean; }
type WheelInfos = [WheelInfosInterface, WheelInfosInterface, WheelInfosInterface, WheelInfosInterface]

const wheelInfos: WheelInfos = [
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

export type setState = SetState<StateInterface>
export type getState = GetState<StateInterface>

export interface StateInterface {
  set: setState
  get: getState
  dpr: number;
  shadows: boolean;
  camera: string;
  ready: boolean;
  editor: boolean;
  finished: boolean | number;
  help: boolean;
  leaderboard: boolean;
  debug: boolean;
  stats: boolean;
  sound: boolean;
  level: RefObject<unknown>;
  map: boolean;
  raycast: Raycast;
  controls: Controls;
  vehicleConfig: VehicleConfig;
}

export interface Raycast {
  chassisBody: RefObject<Api>;
  wheels: RefObject<WheelRef>[];
  wheelInfos: WheelInfos;
  indexForwardAxis: number;
  indexRightAxis: number;
  indexUpAxis: number;
}

export interface Controls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
  honk: boolean;
  boost: boolean;
}

const useStoreImpl = create<StateInterface>((set, get) => {
  return {
    set,
    get,
    dpr: 1.5,
    shadows: true,
    camera: cameras[0],
    ready: false,
    editor: false,
    finished: -1,
    help: false,
    leaderboard: false,
    debug: false,
    stats: false,
    sound: true,
    level: createRef(),
    map: true,
    raycast: {
      chassisBody: createRef(),
      wheels: [createRef<WheelRef>(), createRef<WheelRef>(), createRef<WheelRef>(), createRef<WheelRef>()],
      wheelInfos,
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
    },
    vehicleConfig,
  }
})

export const mutation = {
  // Everything in here is mutated to avoid even slight overhead
  velocity: [0, 0, 0],
  speed: 0,
  start: 0,
  finish: 0,
  sliding: false,
}

export const reset = (set: setState) =>
  set((state) => {
    mutation.start = 0
    mutation.finish = 0

    if (state.raycast.chassisBody && state.raycast.chassisBody.current) {
      state.raycast.chassisBody.current.api.position.set(...position)
      state.raycast.chassisBody.current.api.velocity.set(0, 0, 0)
      state.raycast.chassisBody.current.api.angularVelocity.set(...angularVelocity)
      state.raycast.chassisBody.current.api.rotation.set(...rotation)
    }

    return { ...state, finished: false }
  })

// Make the store shallow compare by default
const useStore = (sel: StateSelector<StateInterface, any>) => useStoreImpl(sel, shallow)
Object.assign(useStore, useStoreImpl)

export { useStore }
