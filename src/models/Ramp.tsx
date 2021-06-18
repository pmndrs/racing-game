import type { BoxProps, Triplet } from '@react-three/cannon'
import { useBox } from '@react-three/cannon'
import type { BoxGeometryProps } from '@react-three/fiber'

interface RampProps extends BoxProps {
  args: Triplet
}

export function Ramp({ args, ...props }: RampProps) {
  // Ah nice, useBox uses boxProps but we will receive boxGeometryProps.
  // Which actually differ in expected type defintions :D
  const [ref] = useBox(() => ({ type: 'Static', args, ...props }), undefined, [args, props])
  return (
    <mesh castShadow receiveShadow ref={ref}>
      <boxGeometry args={args as BoxGeometryProps['args']} />
      <meshStandardMaterial color="indianred" />
    </mesh>
  )
}
