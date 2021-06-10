import { cameras, useStore, mutation } from '../store'

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
  },
  {
    actionValues: ['e', 'E'],
    actionType: 'editor',
    up: false,
  },
  {
    actionValues: ['i', 'I'],
    actionType: 'help',
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

export const controlFunctions = {
  forward: (forward) => useStore.setState((state) => ({ ...state, controls: { ...state.controls, forward } })),
  backward: (backward) => useStore.setState((state) => ({ ...state, controls: { ...state.controls, backward } })),
  left: (left) => useStore.setState((state) => ({ ...state, controls: { ...state.controls, left } })),
  right: (right) => useStore.setState((state) => ({ ...state, controls: { ...state.controls, right } })),
  brake: (brake) => useStore.setState((state) => ({ ...state, controls: { ...state.controls, brake } })),
  honk: (honk) => useStore.setState((state) => ({ ...state, controls: { ...state.controls, honk } })),
  boost: (boost) => useStore.setState((state) => ({ ...state, controls: { ...state.controls, boost, forward: boost } })),
  reset: (reset) => useStore.setState((state) => ((mutation.start = 0), (mutation.finish = 0), { ...state, controls: { ...state.controls, reset } })),
  editor: () => useStore.setState((state) => ({ ...state, editor: !state.editor })),
  help: () => useStore.setState((state) => ({ ...state, help: !state.help })),
  map: () => useStore.setState((state) => ({ ...state, map: !state.map })),
  sound: () => useStore.setState((state) => ({ ...state, map: !state.sound })),
  camera: () =>
    useStore.setState((state) => {
      const current = cameras.indexOf(state.camera)
      const next = (current + 1) % cameras.length
      const camera = cameras[next]
      return { ...state, camera }
    }),
}
