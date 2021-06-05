import { useEffect } from 'react'
import { useStore } from '../store'

const Booster = ({ refBooster }) => {
  const raycast = useStore((state) => state.raycast)
  const set = useStore((state) => state.set)

  useEffect(() => {
    set({ raycast: { ...raycast, boosters: [refBooster.current] } })
  }, [])

  return null
}

export default Booster
