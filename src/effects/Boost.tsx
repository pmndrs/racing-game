import { Object3D, Vector3, MathUtils } from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { mutation } from '../store'
import type { InstancedMesh } from 'three'

const o = new Object3D()
const boostPositions = [new Vector3(-0.4, -0.5, -1.8), new Vector3(0.4, -0.5, -1.8)] as const

interface BoostProps {
  count?: number
  opacity?: number
  size?: number
}

export function Boost({ count = 12, opacity = 0.5, size = 0.1 }: BoostProps): JSX.Element {
  const ref = useRef<InstancedMesh>(null!)
  let i: number
  let n: number
  let j: number
  let progress: number
  let boostActive = false
  useFrame((state) => {
    boostActive = mutation.boostActive
    for (i = 0; i < count; i += boostPositions.length) {
      n = MathUtils.randFloatSpread(0.05)
      for (j = 0; j < boostPositions.length; j++) {
        progress = (state.clock.getElapsedTime() + (i + j) * 0.2) % 1
        o.position.set(boostPositions[j].x + n, boostPositions[j].y, boostPositions[j].z - progress * 0.75)
        o.rotation.z += progress / 2
        o.scale.setScalar(boostActive ? (1 - progress) * 2 : 0)
        o.matrixWorldNeedsUpdate = true
        o.updateMatrixWorld()
        ref.current.setMatrixAt(i + j, o.matrixWorld)
        ref.current.instanceMatrix.needsUpdate = true
      }
    }
  })

  return (
    // @ts-expect-error - https://github.com/three-types/three-ts-types/issues/92
    <instancedMesh ref={ref} args={[null, null, count]}>
      <boxGeometry args={[size, size, size]} />
      <meshBasicMaterial color="#5ecfff" transparent opacity={opacity} depthWrite={true} />
    </instancedMesh>
  )
}
