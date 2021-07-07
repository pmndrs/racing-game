import { createRef } from 'react'
import create from 'zustand'
import shallow from 'zustand/shallow'
import type { RefObject } from 'react'
// TODO: Export PublicApi
import type { Api, WheelInfoOptions } from '@react-three/cannon'
import type { Session } from '@supabase/supabase-js'
import type { Group, Object3D } from 'three'
import type { GetState, SetState, StateSelector } from 'zustand'

export const angularVelocity = [0, 0.5, 0] as const
export const cameras = ['DEFAULT', 'FIRST_PERSON', 'BIRD_EYE'] as const

const controls = {
  backward: false,
  boost: false,
  brake: false,
  forward: false,
  honk: false,
  left: false,
  right: false,
}

export const debug = false as const
export const dpr = 1.5 as const
export const levelLayer = 1 as const
export const maxBoost = 100 as const
export const position = [-110, 0.75, 220] as const
export const rotation = [0, Math.PI / 2 + 0.35, 0] as const
export const shadows = true as const
export const stats = false as const

export const vehicleConfig = {
  width: 1.7,
  height: -0.3,
  front: 1.35,
  back: -1.3,
  steer: 0.3,
  force: 1800,
  maxBrake: 65,
  maxSpeed: 88,
} as const

export type WheelInfo = Required<
  Pick<
    WheelInfoOptions,
    | 'axleLocal'
    | 'customSlidingRotationalSpeed'
    | 'directionLocal'
    | 'frictionSlip'
    | 'radius'
    | 'rollInfluence'
    | 'sideAcceleration'
    | 'suspensionRestLength'
    | 'suspensionStiffness'
    | 'useCustomSlidingRotationalSpeed'
  >
>

export const wheelInfo: WheelInfo = {
  axleLocal: [-1, 0, 0],
  customSlidingRotationalSpeed: -0.01,
  directionLocal: [0, -1, 0],
  frictionSlip: 1.5,
  radius: 0.38,
  rollInfluence: 0,
  sideAcceleration: 3,
  suspensionRestLength: 0.35,
  suspensionStiffness: 30,
  useCustomSlidingRotationalSpeed: true,
}

const actionNames = ['onCheckpoint', 'onFinish', 'onStart', 'reset'] as const
export type ActionNames = typeof actionNames[number]

type Camera = typeof cameras[number]
export type Controls = typeof controls

type Getter = GetState<IState>
export type Setter = SetState<IState>

export type VehicleConfig = typeof vehicleConfig

const booleans = ['debug', 'editor', 'help', 'leaderboard', 'map', 'ready', 'shadows', 'sound', 'stats'] as const
type Booleans = typeof booleans[number]

type BaseState = {
  [K in Booleans]: boolean
}

export interface IState extends BaseState {
  actions: Record<ActionNames, () => void>
  // TODO: This should be PublicApi
  api: Api[1] | null
  bestCheckpoint: number
  camera: Camera
  chassisBody: RefObject<Object3D>
  checkpoint: number
  controls: Controls
  dpr: number
  finished: number
  get: Getter
  level: RefObject<Group>
  session: Session | null
  set: Setter
  vehicleConfig: VehicleConfig
  wheelInfo: WheelInfo
  wheels: [RefObject<Object3D>, RefObject<Object3D>, RefObject<Object3D>, RefObject<Object3D>]
}

const useStoreImpl = create<IState>((set: SetState<IState>, get: GetState<IState>) => {
  const actions = {
    onCheckpoint: () => {
      if (mutation.start) {
        const checkpoint = Date.now() - mutation.start
        set({ checkpoint })
      }
    },
    onFinish: () => {
      if (mutation.start && !mutation.finish) {
        mutation.finish = Date.now()
        set({ finished: mutation.finish - mutation.start })
      }
    },
    onStart: () => {
      mutation.finish = 0
      mutation.start = Date.now()
    },
    reset: () => {
      mutation.boost = maxBoost
      mutation.finish = 0
      mutation.start = 0

      set((state) => {
        state.api?.angularVelocity.set(...angularVelocity)
        state.api?.position.set(...position)
        state.api?.rotation.set(...rotation)
        state.api?.velocity.set(0, 0, 0)

        return { ...state, finished: 0 }
      })
    },
  }

  return {
    actions,
    api: null,
    bestCheckpoint: 0,
    camera: cameras[0],
    chassisBody: createRef<Object3D>(),
    checkpoint: 0,
    controls,
    debug,
    dpr,
    editor: false,
    finished: 0,
    get,
    help: false,
    leaderboard: false,
    level: createRef<Group>(),
    map: true,
    ready: false,
    session: null,
    set,
    shadows,
    sound: true,
    stats,
    vehicleConfig,
    wheelInfo,
    wheels: [createRef<Object3D>(), createRef<Object3D>(), createRef<Object3D>(), createRef<Object3D>()],
  }
})

interface Mutation {
  boost: number
  finish: number
  sliding: boolean
  speed: number
  start: number
  velocity: [number, number, number]
}

export const mutation: Mutation = {
  // Everything in here is mutated to avoid even slight overhead
  boost: maxBoost,
  finish: 0,
  sliding: false,
  speed: 0,
  start: 0,
  velocity: [0, 0, 0],
}

// Make the store shallow compare by default
const useStore = <T>(sel: StateSelector<IState, T>) => useStoreImpl(sel, shallow)
Object.assign(useStore, useStoreImpl)

const { getState, setState } = useStoreImpl

export { getState, setState, useStore }
