import { useBox } from '@react-three/cannon'

import type { BoxProps } from '@react-three/cannon'

export function Ramp({ args, ...props }: BoxProps) {
  const [ref] = useBox(() => ({ type: 'Static', args, ...props }), undefined, [args, props])
  return (
    <mesh castShadow receiveShadow ref={ref}>
      <boxGeometry args={args} />
      <meshStandardMaterial color="indianred" />
    </mesh>
  )
}
