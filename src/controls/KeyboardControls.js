import { useEffect } from 'react'
import { useStore } from '../store'

function useKeys(target, event, up = true) {
  useEffect(() => {
    const downHandler = ({ key }) => target.indexOf(key) !== -1 && event(true)
    const upHandler = ({ key }) => target.indexOf(key) !== -1 && event(false)
    window.addEventListener('keydown', downHandler)
    if (up) window.addEventListener('keyup', upHandler)
    return () => {
      window.removeEventListener('keydown', downHandler)
      if (up) window.removeEventListener('keyup', upHandler)
    }
  }, [target, event, up])
}

export function KeyboardControls() {
  const set = useStore((state) => state.set)
  const cameraTypes = useStore((state) => state.cameraTypes)
  useKeys(['ArrowUp', 'w', 'W'], (forward) => set((state) => ({ ...state, controls: { ...state.controls, forward } })))
  useKeys(['ArrowDown', 's', 'S'], (backward) => set((state) => ({ ...state, controls: { ...state.controls, backward } })))
  useKeys(['ArrowLeft', 'a', 'A'], (left) => set((state) => ({ ...state, controls: { ...state.controls, left } })))
  useKeys(['ArrowRight', 'd', 'D'], (right) => set((state) => ({ ...state, controls: { ...state.controls, right } })))
  useKeys([' '], (brake) => set((state) => ({ ...state, controls: { ...state.controls, brake } })))
  useKeys(['h', 'H'], (honk) => set((state) => ({ ...state, controls: { ...state.controls, honk } })))
  useKeys(['Shift'], (boost) => set((state) => ({ ...state, controls: { ...state.controls, boost } })))
  useKeys(['r', 'R'], (reset) => set((state) => ({ ...state, controls: { ...state.controls, reset } })))
  useKeys(['c', 'C'], (toggleCamera) =>
    set((state) => {
      const currentCameraIndex = cameraTypes.indexOf(state.controls.cameraType)
      const nextCameraIndex = (currentCameraIndex + 1) % cameraTypes.length
      const cameraType = toggleCamera ? cameraTypes[nextCameraIndex] : state.controls.cameraType
      return { ...state, controls: { ...state.controls, cameraType } }
    }),
  )
  return null
}
