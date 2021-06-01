import { useEffect, useRef } from 'react'
import { useStore } from '../utils/store'

export function Speed() {
  const ref = useRef()
  useEffect(() => {
    const interval = setInterval(() => (ref.current.innerText = (useStore.getState().speed * 1.5).toFixed()), 60)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="speed">
      <span ref={ref} /> mph
    </div>
  )
}
