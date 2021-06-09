import { useEffect } from 'react'
import { useStore } from '../store'
import { isPortraitMode } from './isPortraitMode'

export function useOrientationChange() {
  const set = useStore((state) => state.set)
  const isMobilePortrait = useStore((state) => state.isMobilePortrait)
  useEffect(() => {
    const handler = () => set({ isMobilePortrait: isPortraitMode.matches })

    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])

  return isMobilePortrait
}
