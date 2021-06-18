import { cameras, mutation, setState, reset as setReset } from '../store'

interface ControlsFunctions {
  [key: string]: (key: boolean) => void
}

export const controlConfig = [
  {
    actionValues: ['ArrowUp', 'w', 'W', 'forward'],
    actionType: 'forward',
  },
  {
    actionValues: ['ArrowDown', 's', 'S', 'backward'],
    actionType: 'backward',
  },
  {
    actionValues: ['ArrowLeft', 'a', 'A', 'left'],
    actionType: 'left',
  },
  {
    actionValues: ['ArrowRight', 'd', 'D', 'right'],
    actionType: 'right',
  },
  {
    actionValues: [' '],
    actionType: 'brake',
  },
  {
    actionValues: ['h', 'H'],
    actionType: 'honk',
  },
  {
    actionValues: ['Shift', 'boost'],
    actionType: 'boost',
  },
  {
    actionValues: ['r', 'R', 'reset'],
    actionType: 'reset',
    up: false,
  },
  {
    actionValues: ['.'],
    actionType: 'editor',
    up: false,
  },
  {
    actionValues: ['i', 'I'],
    actionType: 'help',
    up: false,
  },
  {
    actionValues: ['l', 'L'],
    actionType: 'leaderboard',
    up: false,
  },
  {
    actionValues: ['m', 'M'],
    actionType: 'map',
    up: false,
  },
  {
    actionValues: ['u', 'U'],
    actionType: 'sound',
    up: false,
  },
  {
    actionValues: ['c', 'C'],
    actionType: 'camera',
    up: false,
  },
]

export const controlFunctions: ControlsFunctions = {
  forward: (forward: boolean) => setState((state) => ({ reset: false, controls: { ...state.controls, forward } })),
  backward: (backward: boolean) => setState((state) => ({ controls: { ...state.controls, backward } })),
  left: (left: boolean) => setState((state) => ({ controls: { ...state.controls, left } })),
  right: (right: boolean) => setState((state) => ({ controls: { ...state.controls, right } })),
  brake: (brake: boolean) => setState((state) => ({ controls: { ...state.controls, brake } })),
  honk: (honk: boolean) => setState((state) => ({ controls: { ...state.controls, honk } })),
  boost: (boost: boolean) => {
    mutation.boostActive = boost
    setState((state) => ({ controls: { ...state.controls, forward: boost } }))
  },
  reset: () => setReset(setState),
  editor: () => setState((state) => ({ editor: !state.editor })),
  leaderboard: () => setState((state) => ({ help: false, leaderboard: !state.leaderboard })),
  help: () => setState((state) => ({ help: !state.help, leaderboard: false })),
  map: () => setState((state) => ({ map: !state.map })),
  sound: () => setState((state) => ({ sound: !state.sound })),
  camera: () => setState((state) => ({ camera: cameras[(cameras.indexOf(state.camera) + 1) % cameras.length] })),
}
