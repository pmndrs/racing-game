import { useEffect, useRef } from 'react'
import { addEffect } from '@react-three/fiber'

import type { ForwardedRef, HTMLAttributes, SVGAttributes, SVGProps } from 'react'

import { useStore, mutation } from '../store'

interface BackgroundProps extends HTMLAttributes<SVGSVGElement> {
  gaugeRef: ForwardedRef<SVGStopElement>
  offset: SVGAttributes<SVGStopElement>['offset']
}

const Background = ({ offset, gaugeRef, ...props }: BackgroundProps): JSX.Element => (
  <svg width={289} height={55} viewBox="0 0 289 55" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="progress" x1="1" y1="0" x2="0" y2="0">
        <stop id="stop1" offset={offset} ref={gaugeRef} stopColor="#1B3049" />
        <stop id="stop2" stopColor="#3EB4C8" />
      </linearGradient>
    </defs>
    <path fillRule="evenodd" clipRule="evenodd" d="M0 40c175.256-2.308 227.867-13.823 289-40v55H0V40z" fill="url(#progress)" />
  </svg>
)

const Foreground = (props: SVGProps<SVGSVGElement>): JSX.Element => (
  <svg width={289} height={55} viewBox="0 0 289 55" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 40c175.256-2.308 227.867-13.823 289-40v55H0V40zm7.5 9.5v-5h9v5h-9zm24 0h-8v-5h8v5zm7-5v5h9v-5h-9zm16 0v5h9v-5h-9zm16-1v6h8v-6h-8zm16 0v6h8v-6h-8zm24 6h-9v-7h9v7zm15 0h-8v-8h8v8zm16 0h-9v-10h9v10zm16 0h-9v-11h9v11zm15 0h-9v-13l9-.5v13.5zm16 0h-9v-15l9-1v16zm15 0h-9v-17l9-1v18zm16 0h-10v-19l10-1v20zm16 0h-10v-21l10-2v23zm15.5 0h-9.5v-25L251 22v27.5zm16 0h-10v-29l10-3.5v32.5zm16 0h-10V15l10-4v38.5z"
      fill="#132237"
    />
  </svg>
)

export function Speed(): JSX.Element {
  const textRef = useRef<HTMLSpanElement>(null!)
  const gaugeRef = useRef<SVGStopElement>(null!)
  const boostRef = useRef<SVGPathElement>(null!)
  const maxSpeed = useStore((state) => state.vehicleConfig.maxSpeed)

  let t = 0
  let currentOffset = '1.00'
  let currentSpeed = '0'
  let computedSpeed: number
  let newOffset: string
  let newSpeed: string
  let boostRemaining: number
  let boostColor: string

  useEffect(() => {
    return addEffect((time) => {
      if (time - t > 200) {
        t = time

        computedSpeed = mutation.speed * 1.5
        newOffset = `${Math.max(1 - computedSpeed / maxSpeed, 0).toFixed(2)}`
        if (newOffset !== currentOffset) {
          gaugeRef.current.setAttribute('offset', newOffset)
          currentOffset = newOffset
        }

        newSpeed = `${computedSpeed.toFixed()}`
        if (newSpeed !== currentSpeed) {
          textRef.current.innerText = newSpeed
          currentSpeed = newSpeed
        }

        boostRemaining = mutation.boostRemaining
        boostColor = boostRemaining <= 80 && boostRemaining >= 65 ? '#FFE600' : boostRemaining < 65 ? '#FF0000' : ''
        boostRef.current.classList.toggle('nitro-path-blink', boostRemaining <= 65)
        boostRef.current.style.stroke = boostRemaining > 80 ? '#00ff00' : boostColor
        boostRef.current.style.strokeDasharray = `${boostRemaining * 3.9}px`
      }
    })
  }, [])

  return (
    <div className="speed">
      <div className="speed-gauge">
        <Background className="speed-background" offset={currentOffset} gaugeRef={gaugeRef} />
        <Foreground className="speed-foreground" />
      </div>
      <div className="speed-text">
        <span ref={textRef}>{currentSpeed}</span> mph
      </div>
      <div className="nitro-bar">
        <svg width={289} height={55} viewBox="0 0 289 55" xmlns="http://www.w3.org/2000/svg">
          <path className="nitro-bg-path" d="M13,12 L200,12" />
          <path ref={boostRef} className="nitro-path" d="M15,12 L198,12" />
          <text className="nitro-text" x="0" y="17px">
            <tspan>N</tspan>
          </text>
        </svg>
      </div>
    </div>
  )
}
