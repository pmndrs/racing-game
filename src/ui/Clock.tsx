import { useEffect, useRef } from 'react'
import { mutation } from '../store'

export function Clock() {
  const textRef = useRef()
  useEffect(() => {
    const interval = setInterval(() => {
      if (textRef.current !== null) {
        const { start, finish } = mutation
        const time = !start && !finish ? 0 : finish ? finish - start : Date.now() - start
        textRef.current.innerText = (time / 1000).toFixed(2)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="clock">
      <span ref={textRef} />
    </div>
  )
}
