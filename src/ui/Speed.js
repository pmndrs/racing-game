import { useEffect, useRef } from 'react'
import { useStore } from '../utils/store'
import SpeedmeterForeground from './svgs/speedmeter/foreground'
import SpeedmeterBackground from './svgs/speedmeter/background'

export function Speed() {
  const textRef = useRef()
  const gaugeRef = useRef()
  useEffect(() => {
    if (textRef.current !== null) {
      const interval = setInterval(() => {
        const { speed, config } = useStore.getState();
        const computedSpeed = speed * 1.5
        textRef.current.innerText = computedSpeed.toFixed()
        gaugeRef.current.setAttribute('offset', Math.max(1 - computedSpeed / config.maxSpeed, 0))
      }, 60)
      return () => clearInterval(interval)
    }
  }, [])
  return (
    <div className="speed">
      <span ref={textRef} /> mph
      <div className="speed-gauge">
        <SpeedmeterBackground className="speed-background" gaugeRef={gaugeRef} />
        <SpeedmeterForeground className="speed-foreground" />
      </div>
    </div>
  )
}
