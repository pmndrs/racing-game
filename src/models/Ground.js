import { usePlane } from '@react-three/cannon'

export function Ground(props) {
  usePlane(() => ({ type: 'Static', material: 'ground', ...props }))
  return null
}
