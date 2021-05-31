import create from 'zustand'

const useStore = create((set, get) => ({
  set,
  get,
  velocity: 0
}))

export { useStore }
