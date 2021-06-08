import { useEffect } from 'react'
import { useStore } from '../store'

export function useOrientationChange() {
  const set = useStore((state) => state.set)
  const isMobilePortrait = useStore((state) => state.isMobilePortrait)
  useEffect(() => {
    const handler = () => {
      if (window.orientation === 0) {
        set({ isMobilePortrait: true })
      } else {
        set({ isMobilePortrait: false })
      }
    }
    window.addEventListener('orientationchange', handler)
    return () => {
      window.removeEventListener('orientationchange', handler)
    }
  }, [])

  return isMobilePortrait
}
