import { useEffect, useRef } from 'react'
import { addEffect } from '@react-three/fiber'
import { mutation } from '../store'
import { readableTime } from './LeaderBoard'

export function Clock() {
  const ref = useRef<HTMLSpanElement>(null)

  let currentText = '0.00'

  useEffect(() => {
    let lastTime = 0
    return addEffect((time) => {
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
    })
  }, [])

  return (
    <div className="clock">
      <span ref={ref}>{currentText}</span>
    </div>
  )
}
