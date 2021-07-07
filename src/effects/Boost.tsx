import { MathUtils, Object3D, Vector3 } from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

import type { InstancedMesh } from 'three'

import { mutation, useStore } from '../store'

const o = new Object3D()
const positions = [new Vector3(-0.4, -0.5, -1.8), new Vector3(0.4, -0.5, -1.8)] as const

interface BoostProps {
  count?: number
  opacity?: number
  size?: number
}

export function Boost({ count = 12, opacity = 0.5, size = 0.1 }: BoostProps): JSX.Element {
  const ref = useRef<InstancedMesh>(null!)
  const boost = useStore((store) => store.controls.boost)

  let i: number
  let isBoosting = false
  let j: number
  let n: number
  let progress: number

  useFrame((state) => {
    isBoosting = boost && mutation.boost > 0
    for (i = 0; i < count; i += positions.length) {
      n = MathUtils.randFloatSpread(0.05)
      for (j = 0; j < positions.length; j++) {
        progress = (state.clock.getElapsedTime() + (i + j) * 0.2) % 1
        o.position.set(positions[j].x + n, positions[j].y, positions[j].z - progress * 0.75)
        o.rotation.z += progress / 2
        o.scale.setScalar(isBoosting ? (1 - progress) * 2 : 0)
        o.matrixWorldNeedsUpdate = true
        o.updateMatrixWorld()
        ref.current.setMatrixAt(i + j, o.matrixWorld)
        ref.current.instanceMatrix.needsUpdate = true
      }
    }
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry args={[size, size, size]} />
      <meshBasicMaterial color="#5ecfff" transparent opacity={opacity} depthWrite={true} />
    </instancedMesh>
  )
}
