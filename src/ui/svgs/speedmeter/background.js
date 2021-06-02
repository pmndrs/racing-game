import * as React from 'react'

function SvgComponent({ gaugeRef, ...props }) {
  return (
    <svg width={289} height={55} viewBox="0 0 289 55" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="progress" x1="1" y1="0" x2="0" y2="0">
          <stop id="stop1" ref={gaugeRef} stopColor="#1B3049" />
          <stop id="stop2" stopColor="#3EB4C8" />
        </linearGradient>
      </defs>
      <path fillRule="evenodd" clipRule="evenodd" d="M0 40c175.256-2.308 227.867-13.823 289-40v55H0V40z" fill="url(#progress)" />
    </svg>
  )
}

export default SvgComponent
