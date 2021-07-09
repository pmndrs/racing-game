import { forwardRef, useEffect, useRef } from 'react'
import { addEffect } from '@react-three/fiber'

import type { SVGProps } from 'react'

import { useStore, mutation } from '../../store'

type BackgroundProps = Pick<SVGProps<SVGStopElement>, 'offset'>

const Background = forwardRef<SVGStopElement, BackgroundProps>(
  ({ offset }, ref): JSX.Element => (
    <svg className="speed-background" width={289} height={55} viewBox="0 0 289 55" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="progress" x1="1" y1="0" x2="0" y2="0">
          <stop id="stop1" offset={offset} ref={ref} stopColor="#1B3049" />
          <stop id="stop2" stopColor="#3EB4C8" />
        </linearGradient>
      </defs>
      <path fillRule="evenodd" clipRule="evenodd" d="M0 40c175.256-2.308 227.867-13.823 289-40v55H0V40z" fill="url(#progress)" />
    </svg>
  ),
)

const Foreground = (): JSX.Element => (
  <svg className="speed-foreground" width={289} height={55} viewBox="0 0 289 55" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 40c175.256-2.308 227.867-13.823 289-40v55H0V40zm7.5 9.5v-5h9v5h-9zm24 0h-8v-5h8v5zm7-5v5h9v-5h-9zm16 0v5h9v-5h-9zm16-1v6h8v-6h-8zm16 0v6h8v-6h-8zm24 6h-9v-7h9v7zm15 0h-8v-8h8v8zm16 0h-9v-10h9v10zm16 0h-9v-11h9v11zm15 0h-9v-13l9-.5v13.5zm16 0h-9v-15l9-1v16zm15 0h-9v-17l9-1v18zm16 0h-10v-19l10-1v20zm16 0h-10v-21l10-2v23zm15.5 0h-9.5v-25L251 22v27.5zm16 0h-10v-29l10-3.5v32.5zm16 0h-10V15l10-4v38.5z"
      fill="#132237"
    />
  </svg>
)

const getOffsetFactory = (maxSpeed: number) => () => `${Math.max(1 - mutation.speed / maxSpeed, 0).toFixed(2)}`

export const Gauge = () => {
  const ref = useRef<SVGStopElement>(null)
  const maxSpeed = useStore((state) => state.vehicleConfig.maxSpeed)

  const getOffset = getOffsetFactory(maxSpeed)

  let offset = getOffset()

  useEffect(() =>
    addEffect(() => {
      if (!ref.current) return
      offset = getOffset()
      if (ref.current.getAttribute('offset') !== offset) {
        ref.current.setAttribute('offset', offset)
      }
    }),
  )

  return (
    <div className="speed-gauge">
      <Background offset={offset} ref={ref} />
      <Foreground />
    </div>
  )
}
