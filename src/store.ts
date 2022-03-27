import { createRef } from 'react'
import create from 'zustand'
import shallow from 'zustand/shallow'
import type { RefObject } from 'react'
import type { PublicApi, WheelInfoOptions } from '@react-three/cannon'
import type { Session } from '@supabase/supabase-js'
import type { Group, Object3D } from 'three'
import type { StateSelector, GetState, SetState, StoreApi, Mutate } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

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

const actionNames = ['onCheckpoint', 'onFinish', 'onStart', 'reset', 'addKeyBinding', 'removeKeyBinding'] as const
export type ActionNames = typeof actionNames[number]

export type Camera = typeof cameras[number]
export type Controls = typeof controls

type Getter = GetState<IState>
export type Setter = SetState<IState>

export type VehicleConfig = typeof vehicleConfig

const booleans = ['debug', 'editor', 'help', 'leaderboard', 'map', 'pickcolor', 'ready', 'shadows', 'sound', 'stats'] as const
type Booleans = typeof booleans[number]

type BaseState = {
  [K in Booleans]: boolean
}

export interface Key {
  name: string
  values: string[]
}

export interface KeyMap {
  fn: (pressed: boolean) => void
  up?: boolean
  pressed?: boolean
}

export interface KeyConfig extends KeyMap {
  keys: Key[]
  action: string
}

export interface IState extends BaseState {
  // actions: Record<ActionNames, (() => void) | ((action: string, newKey: Key) => void) | ((action: string, name: string) => void)>
  actions: Record<ActionNames, any>
  api: PublicApi | null
  bestCheckpoint: number
  camera: Camera
  chassisBody: RefObject<Object3D>
  checkpoint: number
  color: string
  controls: Controls
  keyboardBindings: KeyConfig[]
  keyBindingsWithError: number[]
  dpr: number
  finished: number
  get: Getter
  level: RefObject<Group>
  session: Session | null
  set: Setter
  start: number
  vehicleConfig: VehicleConfig
  wheelInfo: WheelInfo
  wheels: [RefObject<Object3D>, RefObject<Object3D>, RefObject<Object3D>, RefObject<Object3D>]
  keyInput: string | null
}

function deduplicateKeys(newKey: Key, keysList: KeyConfig[]): KeyConfig[] {
  return keysList.map((key) => ({ ...key, keys: key.keys.filter((keyCode) => keyCode.name !== newKey.name) }))
}

function checkKeybindings(keysList: KeyConfig[]): number[] {
  return keysList.reduce<number[]>((akk, value, index) => {
    if (value.keys.length < 1) {
      akk.push(index)
    }
    return akk
  }, [])
}

function serializeKeys(keysList: KeyConfig[]): Record<string, Key[]> {
  return keysList.reduce((akk, { action, keys }) => ({ ...akk, [action]: keys }), {})
}

const localStorageKeyboardBindingsString = window.localStorage.getItem('pmndrs-racing-game-keybindings')

const setLocalStorageKeyboardBindingsString = (newValue: string) => {
  window.localStorage.setItem('pmndrs-racing-game-keybindings', newValue)
}

let localStorageKeyboardBindings: Record<string, Key[]> = {}

if (localStorageKeyboardBindingsString !== null) {
  try {
    localStorageKeyboardBindings = JSON.parse(localStorageKeyboardBindingsString)
  } catch (error) {
    console.error(error)
  }
}

const useStoreImpl = create<IState, SetState<IState>, GetState<IState>, Mutate<StoreApi<IState>, [['zustand/subscribeWithSelector', never]]>>(
  subscribeWithSelector((set, get) => {
    const actions = {
      onCheckpoint: () => {
        const { start } = get()
        if (start) {
          const checkpoint = Date.now() - start
          set({ checkpoint })
        }
      },
      onFinish: () => {
        const { finished, start } = get()
        if (start && !finished) {
          set({ finished: Math.max(Date.now() - start, 0) })
        }
      },
      onStart: () => {
        set({ finished: 0, start: Date.now() })
      },
      reset: () => {
        mutation.boost = maxBoost

        set((state) => {
          state.api?.angularVelocity.set(...angularVelocity)
          state.api?.position.set(...position)
          state.api?.rotation.set(...rotation)
          state.api?.velocity.set(0, 0, 0)

          return { ...state, finished: 0, start: 0 }
        })
      },
      addKeyBinding: (action: string, newKey: Key) => {
        set((state) => {
          const index = state.keyboardBindings.findIndex(({ action: stateAction }) => action === stateAction)

          if (index === -1) {
            return state
          }

          const keyboardBindingsCopy = deduplicateKeys(newKey, state.keyboardBindings)

          keyboardBindingsCopy[index].keys.push(newKey)

          const keyBindingsWithError = checkKeybindings(keyboardBindingsCopy)

          return { ...state, keyboardBindings: keyboardBindingsCopy, keyBindingsWithError }
        })
      },
      removeKeyBinding: (action: string, name: string) => {
        set((state) => {
          const index = state.keyboardBindings.findIndex(({ action: stateAction }) => action === stateAction)

          if (index === -1) {
            return state
          }

          const keyIndex = state.keyboardBindings[index].keys.findIndex(({ name: stateName }) => name === stateName)

          const keyboardBindingsCopy = [...state.keyboardBindings]

          keyboardBindingsCopy[index].keys.splice(keyIndex, 1)

          const keyBindingsWithError = checkKeybindings(keyboardBindingsCopy)

          return { ...state, keyboardBindings: keyboardBindingsCopy, keyBindingsWithError }
        })
      },
    }

    const defaultKeyboardBindings: KeyConfig[] = [
      {
        action: 'Forward',
        keys: localStorageKeyboardBindings.Forward || [
          { name: '↑', values: ['ArrowUp'] },
          { name: 'W', values: ['KeyW'] },
          { name: 'Z', values: ['KeyZ'] },
        ],

        fn: (forward) => set((state) => ({ controls: { ...state.controls, forward } })),
      },
      {
        action: 'Backward',
        keys: localStorageKeyboardBindings.Backward || [
          { name: '↓', values: ['ArrowDown'] },
          { name: 'S', values: ['KeyS'] },
        ],
        fn: (backward) => set((state) => ({ controls: { ...state.controls, backward } })),
      },
      {
        action: 'Left',
        keys: localStorageKeyboardBindings.Left || [
          { name: '←', values: ['ArrowLeft'] },
          { name: 'A', values: ['KeyA'] },
          { name: 'Q', values: ['KeyQ'] },
        ],
        fn: (left) => set((state) => ({ controls: { ...state.controls, left } })),
      },
      {
        action: 'Right',
        keys: localStorageKeyboardBindings.Right || [
          { name: '→', values: ['ArrowRight'] },
          { name: 'D', values: ['KeyD'] },
        ],
        fn: (right) => set((state) => ({ controls: { ...state.controls, right } })),
      },
      {
        action: 'Drift',
        keys: localStorageKeyboardBindings.Drift || [{ name: 'Space ␣', values: ['Space'] }],
        fn: (brake) => set((state) => ({ controls: { ...state.controls, brake } })),
      },
      {
        action: 'Honk',
        keys: localStorageKeyboardBindings.Honk || [{ name: 'H', values: ['KeyH'] }],
        fn: (honk) => set((state) => ({ controls: { ...state.controls, honk } })),
      },
      {
        action: 'Turbo Boost',
        keys: localStorageKeyboardBindings['Turbo Boost'] || [{ name: 'Shift ⇧', values: ['ShiftLeft', 'ShiftRight'] }],
        fn: (boost) => set((state) => ({ controls: { ...state.controls, boost } })),
      },
      { action: 'Reset', keys: localStorageKeyboardBindings.Reset || [{ name: 'R', values: ['KeyR'] }], fn: actions.reset, up: false },
      {
        action: 'Editor',
        keys: localStorageKeyboardBindings.Editor || [{ name: '.', values: ['Period'] }],
        fn: () => set((state) => ({ editor: !state.editor })),
        up: false,
      },
      {
        action: 'Help',
        keys: localStorageKeyboardBindings.Help || [{ name: 'I', values: ['KeyI'] }],
        fn: () => set((state) => ({ help: !state.help, leaderboard: false, pickcolor: false })),
        up: false,
      },
      {
        action: 'Leaderboards',
        keys: localStorageKeyboardBindings.Leaderboards || [{ name: 'L', values: ['KeyL'] }],
        fn: () => set((state) => ({ help: false, leaderboard: !state.leaderboard, pickcolor: false })),
        up: false,
      },
      {
        action: 'Map',
        keys: localStorageKeyboardBindings.Map || [{ name: 'M', values: ['KeyM'] }],
        fn: () => set((state) => ({ map: !state.map })),
        up: false,
      },
      {
        action: 'Pick Car Color',
        keys: localStorageKeyboardBindings['Pick Car Color'] || [{ name: 'P', values: ['KeyP'] }],
        fn: () => set((state) => ({ help: false, pickcolor: !state.pickcolor, leaderboard: false })),
        up: false,
      },
      {
        action: 'Toggle Mute',
        keys: localStorageKeyboardBindings['Toggle Mute'] || [{ name: 'U', values: ['KeyU'] }],
        fn: () => set((state) => ({ sound: !state.sound })),
        up: false,
      },
      {
        action: 'Toggle Camera',
        keys: localStorageKeyboardBindings['Toggle Camera'] || [{ name: 'C', values: ['KeyC'] }],
        fn: () => set((state) => ({ camera: cameras[(cameras.indexOf(state.camera) + 1) % cameras.length] })),
        up: false,
      },
    ]

    const state: IState = {
      actions,
      api: null,
      bestCheckpoint: 0,
      camera: cameras[0],
      chassisBody: createRef<Object3D>(),
      checkpoint: 0,
      color: '#FFFF00',
      controls,
      keyboardBindings: defaultKeyboardBindings,
      keyBindingsWithError: [],
      debug,
      dpr,
      editor: false,
      finished: 0,
      get,
      keyInput: null,
      help: false,
      leaderboard: false,
      level: createRef<Group>(),
      map: true,
      pickcolor: false,
      ready: false,
      session: null,
      set,
      shadows,
      sound: true,
      start: 0,
      stats,
      vehicleConfig,
      wheelInfo,
      wheels: [createRef<Object3D>(), createRef<Object3D>(), createRef<Object3D>(), createRef<Object3D>()],
    }

    return state
  }),
)

interface Mutation {
  boost: number
  rpmTarget: number
  sliding: boolean
  speed: number
  velocity: [number, number, number]
}

export const mutation: Mutation = {
  // Everything in here is mutated to avoid even slight overhead
  boost: maxBoost,
  rpmTarget: 0,
  sliding: false,
  speed: 0,
  velocity: [0, 0, 0],
}

// Make the store shallow compare by default
const useStore = <T>(sel: StateSelector<IState, T>) => useStoreImpl(sel, shallow)
Object.assign(useStore, useStoreImpl)

const { getState, setState } = useStoreImpl

useStoreImpl.subscribe(
  (state) => state.keyboardBindings,
  (keyboardBindings) => {
    setLocalStorageKeyboardBindingsString(JSON.stringify(serializeKeys(keyboardBindings)))
  },
)

export { getState, setState, useStore }
