import { useBox } from '@react-three/cannon'

export function Ramp({ args, ...props }) {
  const [ref] = useBox(() => ({ type: 'Static', args, ...props }), undefined, [args, props])
  return (
    <mesh ref={ref}>
      <boxGeometry args={args} />
      <meshStandardMaterial color="indianred" />
    </mesh>
  )
}
