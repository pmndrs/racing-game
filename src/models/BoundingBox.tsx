import { usePlane } from '@react-three/cannon'
import { useStore } from '../store'

import type { Triplet } from '@react-three/cannon'

type Props = {
  depth: number
  height: number
  position: Triplet
  width: number
}

export const BoundingBox = ({ depth, height, position: [x, y, z], width }: Props) => {
  const [onCollide] = useStore(({ actions: { reset } }) => [reset])

  const sharedProps = {
    isTrigger: true,
    onCollide,
    userData: { trigger: true },
  }

  const halfDepth = depth / 2
  const halfHeight = height / 2
  const halfPi = Math.PI / 2
  const halfWidth = width / 2

  // negativeX
  usePlane(() => ({
    ...sharedProps,
    position: [x - halfWidth, y, z],
    rotation: [0, halfPi, 0],
    ...sharedProps,
  }))

  // negativeY
  usePlane(() => ({
    ...sharedProps,
    position: [x, y - halfHeight, z],
    rotation: [halfPi, 0, 0],
  }))

  // negativeZ
  usePlane(() => ({
    ...sharedProps,
    position: [x, y, z - halfDepth],
    rotation: [0, 0, 0],
  }))

  // positiveX
  usePlane(() => ({
    ...sharedProps,
    position: [x + halfWidth, y, z],
    rotation: [0, -halfPi, 0],
  }))

  // positiveY
  usePlane(() => ({
    ...sharedProps,
    position: [x, y + halfHeight, z],
    rotation: [-halfPi, 0, 0],
  }))

  // positiveZ
  usePlane(() => ({
    ...sharedProps,
    position: [x, y, z + halfDepth],
    rotation: [0, Math.PI, 0],
  }))

  return null
}
