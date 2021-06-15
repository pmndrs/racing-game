import { useEffect, useRef } from 'react'
import { mutation } from '../store'
import { readableTime } from './LeaderBoard'

export function Clock() {
  const ref = useRef<HTMLSpanElement>(null)

  let currentText = '0.00'

  useEffect(() => {
    let frame: number
    let lastTime = 0
    const onFrame: FrameRequestCallback = (time) => {
      if (ref.current && time - lastTime >= 100) {
        lastTime = time
        const { start, finish } = mutation
        const raceTime = start && !finish ? Date.now() - start : 0
        const newText = `${readableTime(raceTime)}`
        if (newText !== currentText) {
          ref.current.innerText = newText
          currentText = newText
        }
      }
      frame = requestAnimationFrame(onFrame)
    }
    frame = requestAnimationFrame(onFrame)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="clock">
      <span ref={ref}>{currentText}</span>
    </div>
  )
}
