import { createRef } from 'react'
import create from 'zustand'
import shallow from 'zustand/shallow'
import type { MutableRefObject } from 'react'
import type { WorkerApi } from '@react-three/cannon'
import type { Session } from '@supabase/supabase-js'
import type { Mesh } from 'three'
<<<<<<< typescript
import type { GetState, SetState, StateSelector } from 'zustand'
=======
>>>>>>> Convert ui files to typescript

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

export const levelLayer = 1 as const
export const position = [-110, 0.75, 220] as const
export const rotation = [0, Math.PI / 2 + 0.35, 0] as const

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

type Camera = typeof cameras[number]
export type Controls = typeof controls

export interface CannonApi extends Mesh {
  api: WorkerApi
}
interface Raycast {
  chassisBody: MutableRefObject<CannonApi | null>
  wheels: [MutableRefObject<CannonApi | null>, MutableRefObject<CannonApi | null>, MutableRefObject<CannonApi | null>, MutableRefObject<CannonApi | null>]
  wheelInfos: WheelInfos
}

type WheelInfosInterface = typeof wheelInfo & { isFrontWheel: boolean }
export type WheelInfos = [WheelInfosInterface, WheelInfosInterface, WheelInfosInterface, WheelInfosInterface]

export type Setter = SetState<Store>
export type Getter = GetState<Store>

export interface Store {
  set: Setter
  get: Getter
  camera: Camera
  controls: Controls
  debug: boolean
  dpr: number
  editor: boolean
  finished: number
  help: boolean
  leaderboard: boolean
  level: MutableRefObject<unknown>
  map: boolean
  raycast: Raycast
  ready: boolean
  session: Session | null
  shadows: boolean
  sound: boolean
  stats: boolean
  vehicleConfig: typeof vehicleConfig
}

const useStoreImpl = create<Store>((set: SetState<Store>, get: GetState<Store>) => {
  return {
    set,
    get,
    camera: cameras[0],
    controls,
    debug: false,
    dpr: 1.5,
    editor: false,
    finished: 0,
    help: false,
    leaderboard: false,
    level: createRef(),
    map: true,
    raycast: {
      chassisBody: createRef(),
      wheels: [createRef(), createRef(), createRef(), createRef()],
      wheelInfos,
      indexForwardAxis: 2,
      indexRightAxis: 0,
      indexUpAxis: 1,
    },
    ready: false,
    session: null,
    shadows: true,
    sound: true,
    stats: false,
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

export const reset = (set: SetState<Store>) =>
  set((state) => {
    mutation.start = 0
    mutation.finish = 0

    state.raycast.chassisBody.current?.api.position.set(...position)
    state.raycast.chassisBody.current?.api.velocity.set(0, 0, 0)
    state.raycast.chassisBody.current?.api.angularVelocity.set(...angularVelocity)
    state.raycast.chassisBody.current?.api.rotation.set(...rotation)

    return { ...state, finished: 0 }
  })

// Make the store shallow compare by default
const useStore = <T>(sel: StateSelector<Store, T>) => useStoreImpl(sel, shallow)
Object.assign(useStore, useStoreImpl)

const { getState } = useStoreImpl

export { getState, useStore }
