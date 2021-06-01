import create from 'zustand'

function registerKeys(target, event) {
  const downHandler = ({ key }) => target.indexOf(key) !== -1 && event(true)
  const upHandler = ({ key }) => target.indexOf(key) !== -1 && event(false)
  window.addEventListener('keydown', downHandler)
  window.addEventListener('keyup', upHandler)
}

const useStore = create((set, get) => {
  registerKeys(['ArrowUp', 'w'], (pressed) => set((state) => ({ ...state, controls: { ...state.controls, forward: pressed } })))
  registerKeys(['ArrowDown', 's'], (pressed) => set((state) => ({ ...state, controls: { ...state.controls, backward: pressed } })))
  registerKeys(['ArrowLeft', 'a'], (pressed) => set((state) => ({ ...state, controls: { ...state.controls, left: pressed } })))
  registerKeys(['ArrowRight', 'd'], (pressed) => set((state) => ({ ...state, controls: { ...state.controls, right: pressed } })))
  registerKeys([' '], (pressed) => set((state) => ({ ...state, controls: { ...state.controls, brake: pressed } })))
  registerKeys(['r'], (pressed) => set((state) => ({ ...state, controls: { ...state.controls, reset: pressed } })))

  return {
    set,
    get,
    controls: { forward: false, backward: false, left: false, right: false, brake: false, reset: false },
    velocity: [0, 0, 0],
    speed: 0,
    positions: [...Array(20).map(() => [0, 0, 0])]
  }
})

export { useStore }
