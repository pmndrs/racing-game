import { usePlane } from '@react-three/cannon'

export function Ground(props) {
  const [ref] = usePlane(() => ({ type: 'Static', material: 'ground', ...props }))
  return null
}
