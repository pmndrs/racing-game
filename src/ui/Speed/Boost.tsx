import { useEffect, useRef } from 'react'
import { addEffect } from '@react-three/fiber'

import { maxBoost, mutation } from '../../store'

const criticalLevel = 30
const warningLevel = 60

const getBlink = () => mutation.boost <= criticalLevel
const getColor = () => (mutation.boost > warningLevel ? '#00FF00' : mutation.boost > criticalLevel ? '#FFE600' : '#FF0000')
const getLength = () => `${(100 * (1 - mutation.boost / maxBoost)).toFixed()}%`

export const Boost = () => {
  const ref = useRef<SVGPathElement>(null)

  let blink = getBlink()
  let newBlink: boolean
  let stroke = getColor()
  let newStroke: string
  let strokeDashoffset = getLength()
  let newStrokeDashoffset: string

  useEffect(() =>
    addEffect(() => {
      if (!ref.current) return

      newBlink = getBlink()
      if (blink !== newBlink) {
        ref.current.classList.toggle('blink', newBlink)
        blink = newBlink
      }

      newStroke = getColor()
      if (stroke !== newStroke) {
        ref.current.style.stroke = newStroke
        stroke = newStroke
      }

      newStrokeDashoffset = getLength()
      if (strokeDashoffset !== newStrokeDashoffset) {
        ref.current.style.strokeDashoffset = newStrokeDashoffset
        strokeDashoffset = newStrokeDashoffset
      }
    }),
  )

  return (
    <div className="boost-bar">
      <svg width={289} height={55} viewBox="0 0 289 55" xmlns="http://www.w3.org/2000/svg">
        <path className="boost-bg-path" d="M13,12 L200,12" />
        <path className="boost-path" d="M15,12 L198,12" ref={ref} style={{ stroke, strokeDashoffset }} />
        <text className="boost-text" x="0" y="17px">
          <tspan>N</tspan>
        </text>
      </svg>
    </div>
  )
}
