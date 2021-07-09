import { addEffect } from '@react-three/fiber'
import { useEffect, useRef } from 'react'

import { mutation } from '../../store'

const getSpeed = () => `${mutation.speed.toFixed()}`

export const Text = (): JSX.Element => {
  const ref = useRef<HTMLSpanElement>(null)

  let speed = getSpeed()

  useEffect(() =>
    addEffect(() => {
      if (!ref.current) return
      speed = getSpeed()
      if (ref.current.innerText !== speed) {
        ref.current.innerText = speed
      }
    }),
  )

  return (
    <div className="speed-text">
      <span ref={ref}>{speed}</span> mph
    </div>
  )
}
