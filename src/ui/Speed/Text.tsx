import { addEffect } from '@react-three/fiber'
import { useEffect, useRef } from 'react'

import { mutation } from '../../store'

const getSpeed = () => `${mutation.speed.toFixed()}`

export const Text = (): JSX.Element => {
  const ref = useRef<HTMLSpanElement>(null)

  let currentSpeed = getSpeed()
  let newSpeed: string

  useEffect(() =>
    addEffect(() => {
      newSpeed = getSpeed()
      if (ref.current && newSpeed !== currentSpeed) {
        ref.current.innerText = newSpeed
        currentSpeed = newSpeed
      }
    }),
  )

  return (
    <div className="speed-text">
      <span ref={ref}>{currentSpeed}</span> mph
    </div>
  )
}
