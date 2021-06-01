import { useEffect, useRef } from 'react'
import { useStore } from '../utils/store'

export function Speed() {
  const ref = useRef()
  useEffect(() => {
    const interval = setInterval(() => (ref.current.innerText = `${useStore.getState().speed.toFixed()} mph`), 60)
    return () => clearInterval(interval)
  }, [])
  return <div ref={ref} className="speed" />
}
