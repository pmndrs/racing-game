import { useEffect } from 'react'
import { useStore } from '../store'
import { isPortraitMode } from './isPortraitMode'

export function useOrientationChange() {
  const [isMobilePortrait, set] = useStore((state) => [state.isMobilePortrait, state.set])

  useEffect(() => {
    const handler = () => set({ isMobilePortrait: isPortraitMode.matches })

    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])

  return isMobilePortrait
}
