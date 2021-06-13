import { createRef } from 'react'
import create from 'zustand'
import shallow from 'zustand/shallow'
import type { MutableRefObject } from 'react'
import type { WorkerApi } from '@react-three/cannon'
import type { GetState, SetState, StateSelector } from 'zustand'
import type { Session } from '@supabase/supabase-js'

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
} as const

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
} as const

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
] as const

type Camera = typeof cameras[number]
type Controls = typeof controls

interface CannonApi {
  api: WorkerApi
}

interface Raycast {
  chassisBody: MutableRefObject<CannonApi | null>
  wheels: [MutableRefObject<CannonApi | null>, MutableRefObject<CannonApi | null>, MutableRefObject<CannonApi | null>, MutableRefObject<CannonApi | null>]
}

export type Setter = SetState<Store>

export interface Store {
  camera: Camera;
  controls: Controls;
  debug: boolean;
  dpr: number;
  editor: boolean;
  finished: boolean;
  help: boolean;
  leaderboard: boolean;
  level: MutableRefObject<unknown>;
  map: boolean;
  raycast: Raycast;
  ready: boolean;
  session: Session | null;
  shadows: boolean;
  sound: boolean;
  stats: boolean;
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
    finished: false,
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

    return { ...state, finished: false }
  })

// Make the store shallow compare by default
const useStore = <T>(sel: StateSelector<Store, T>) => useStoreImpl(sel, shallow)
Object.assign(useStore, useStoreImpl)

const { getState } = useStoreImpl

export { getState, useStore }
