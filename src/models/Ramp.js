import { useBox } from '@react-three/cannon'

export function Ramp({ args = [10, 2.5, 3], rotation = [0, 0.45, Math.PI / 11], ...props }) {
  const [ref] = useBox(() => ({ type: 'Static', args, rotation, ...props }))
  return (
    <mesh ref={ref}>
      <boxGeometry args={args} />
      <meshStandardMaterial color="indianred" />
    </mesh>
  )
}
