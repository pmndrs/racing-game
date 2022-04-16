import { createRef } from 'react'
import { useBox } from '@react-three/cannon'

import type { BoxProps } from '@react-three/cannon'
import type { Mesh } from 'three'

export function Ramp({ args, ...props }: BoxProps) {
  const ref = createRef<Mesh>()
  useBox(() => ({ type: 'Static', args, ...props }), ref, [args, props])

  return (
    <mesh castShadow receiveShadow ref={ref}>
      <boxGeometry args={args} />
      <meshStandardMaterial color="indianred" />
    </mesh>
  )
}
