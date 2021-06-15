import { createRef } from 'react'
import create from 'zustand'
import shallow from 'zustand/shallow'
import type { MutableRefObject } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { Group, Object3D } from 'three'
import type { GetState, SetState, StateSelector } from 'zustand'

export const angularVelocity = [0, 0.5, 0] as const
export const cameras = ['DEFAULT', 'FIRST_PERSON', 'BIRD_EYE'] as const

const controls = {
  backward: false,
  brake: false,
  forward: false,
  honk: false,
  left: false,
  right: false,
}

const boost = {
  boostActive: false,
  boostRemaining: 100,
}

export const debug = false as const
export const dpr = 1.5 as const
export const levelLayer = 1 as const
export const position = [-110, 0.75, 220] as const
export const rotation = [0, Math.PI / 2 + 0.35, 0] as const
export const shadows = true as const
export const stats = false as const

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
  isFrontWheel: false,
  useCustomSlidingRotationalSpeed: true,
  customSlidingRotationalSpeed: -0.01,
  rollInfluence: 0,
  suspensionForce: 100,
  frictionSlip: 1.5,
  sideAcceleration: 3,
}

const wheelInfos: WheelInfos = [
  {
    ...wheelInfo,
    chassisConnectionPointLocal: [-vehicleConfig.width / 2, vehicleConfig.height, vehicleConfig.front],
    isFrontWheel: true,
  },
  {
    ...wheelInfo,
    chassisConnectionPointLocal: [vehicleConfig.width / 2, vehicleConfig.height, vehicleConfig.front],
    isFrontWheel: true,
  },
  {
    ...wheelInfo,
    chassisConnectionPointLocal: [-vehicleConfig.width / 2, vehicleConfig.height, vehicleConfig.back],
  },
  {
    ...wheelInfo,
    chassisConnectionPointLocal: [vehicleConfig.width / 2, vehicleConfig.height, vehicleConfig.back],
  },
]

type Camera = typeof cameras[number]
export type Controls = typeof controls
export type Boost = typeof boost

type Getter = GetState<IState>

interface Raycast {
  chassisBody: MutableRefObject<Object3D>
  wheels: [MutableRefObject<Object3D>, MutableRefObject<Object3D>, MutableRefObject<Object3D>, MutableRefObject<Object3D>]
  wheelInfos: WheelInfos
}

export type Setter = SetState<IState>

export type VehicleConfig = typeof vehicleConfig
type WheelInfo = typeof wheelInfo
export type WheelInfos = WheelInfo[]

interface IState {
  camera: Camera
  controls: Controls
  boost: Boost
  reset: boolean
  debug: boolean
  dpr: number
  editor: boolean
  finished: number
  get: Getter
  help: boolean
  leaderboard: boolean
  level: MutableRefObject<Group>
  map: boolean
  raycast: Raycast
  ready: boolean
  session: Session | null
  set: Setter
  shadows: boolean
  sound: boolean
  stats: boolean
  vehicleConfig: VehicleConfig
}

const useStoreImpl = create<IState>((set: SetState<IState>, get: GetState<IState>) => {
  return {
    camera: cameras[0],
    controls,
    boost,
    debug,
    dpr,
    reset: false,
    editor: false,
    finished: 0,
    get,
    help: false,
    leaderboard: false,
    level: createRef() as unknown as MutableRefObject<Group>,
    map: true,
    raycast: {
      chassisBody: createRef() as unknown as MutableRefObject<Object3D>,
      wheels: [
        createRef() as unknown as MutableRefObject<Object3D>,
        createRef() as unknown as MutableRefObject<Object3D>,
        createRef() as unknown as MutableRefObject<Object3D>,
        createRef() as unknown as MutableRefObject<Object3D>,
      ],
      wheelInfos,
      indexForwardAxis: 2,
      indexRightAxis: 0,
      indexUpAxis: 1,
    },
    ready: false,
    session: null,
    set,
    shadows,
    sound: true,
    stats,
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

export const reset = (set: SetState<IState>) =>
  set((state) => {
    mutation.start = 0
    mutation.finish = 0
    return { ...state, reset: true, finished: 0, boost }
  })

// Make the store shallow compare by default
const useStore = <T>(sel: StateSelector<IState, T>) => useStoreImpl(sel, shallow)
Object.assign(useStore, useStoreImpl)

const { getState } = useStoreImpl

export { getState, useStore }
