import { createRef } from 'react'
import create from 'zustand'
import shallow from 'zustand/shallow'
import type { MutableRefObject } from 'react'
import type { WheelInfoOptions } from '@react-three/cannon'
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

export const debug = true as const
export const dpr = 1.5 as const
export const levelLayer = 1 as const
// export const position = [-110, 0.75, 220] as const
export const position = [-55, 1, -5] as const
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
} as const

type WheelInfo = Required<
  Pick<
    WheelInfoOptions,
    | 'radius'
    | 'directionLocal'
    | 'suspensionStiffness'
    | 'suspensionRestLength'
    | 'axleLocal'
    | 'chassisConnectionPointLocal'
    | 'useCustomSlidingRotationalSpeed'
    | 'customSlidingRotationalSpeed'
    | 'rollInfluence'
    | 'frictionSlip'
    | 'isFrontWheel'
  >
>

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
  frictionSlip: 1.5,
  isFrontWheel: false,
}

const wheelInfos: WheelInfo[] = [
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

type Getter = GetState<IState>

interface Raycast {
  chassisBody: MutableRefObject<Object3D>
  wheels: [MutableRefObject<Object3D>, MutableRefObject<Object3D>, MutableRefObject<Object3D>, MutableRefObject<Object3D>]
  wheelInfos: WheelInfo[]
}

export type Setter = SetState<IState>

export type VehicleConfig = typeof vehicleConfig

const booleans = ['debug', 'editor', 'help', 'leaderboard', 'map', 'ready', 'reset', 'shadows', 'sound', 'stats'] as const
const numbers = ['dpr', 'finished'] as const
export type Booleans = typeof booleans[number]
export type Numbers = typeof numbers[number]
export type BaseState = {
  [K in Booleans]: boolean
} &
  {
    [K in Numbers]: number
  }

interface IState extends BaseState {
  camera: Camera
  controls: Controls
  checkpoint1: number
  checkpointDifference: number
  checkpointRecord: number
  showCheckpoint: boolean
  get: Getter
  level: MutableRefObject<Group>
  raycast: Raycast
  session: Session | null
  set: Setter
  vehicleConfig: VehicleConfig
}

const useStoreImpl = create<IState>((set: SetState<IState>, get: GetState<IState>) => {
  return {
    camera: cameras[0],
    controls,
    debug,
    dpr,
    editor: false,
    checkpoint1: 0,
    checkpointRecord: 0,
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
    reset: false,
    session: null,
    set,
    shadows,
    showCheckpoint: false,
    sound: true,
    stats,
    vehicleConfig,
  }
})

interface Mutation {
  boostActive: boolean
  boostRemaining: number
  checkpoint1: number
  tempCheckpoint1: number
  checkpointDifference: number
  finish: number
  sliding: boolean
  speed: number
  start: number
  velocity: [number, number, number]
}

export const mutation: Mutation = {
  // Everything in here is mutated to avoid even slight overhead
  velocity: [0, 0, 0],
  speed: 0,
  start: 0,
  checkpoint1: 0,
  tempCheckpoint1: 0,
  checkpointDifference: 0,
  finish: 0,
  sliding: false,
  boostActive: false,
  boostRemaining: 100,
}

export const reset = (set: SetState<IState>) =>
  set((state) => {
    mutation.start = 0
    mutation.checkpoint1 = 0
    mutation.finish = 0
    mutation.boostActive = false
    mutation.boostRemaining = 100
    return { ...state, reset: true, finished: 0 }
  })

// Make the store shallow compare by default
const useStore = <T>(sel: StateSelector<IState, T>) => useStoreImpl(sel, shallow)
Object.assign(useStore, useStoreImpl)

const { getState } = useStoreImpl

export { getState, useStore }
