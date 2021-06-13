import { Object3D, Vector3, MathUtils } from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { getState } from '../store'
import type { InstancedMesh } from 'three'

const o = new Object3D()
const boostPositions = [new Vector3(-0.4, -0.5, -1.8), new Vector3(0.4, -0.5, -1.8)]

export function Boost({ opacity = 0.5, length = 12, size = 0.1 }) {
  const ref = useRef<InstancedMesh>(null)
  let n: number
  let j: number
  let controls: ReturnType<typeof getState>['controls']
  let progress: number
  useFrame((state) => {
    controls = getState().controls
    for (let i = 0; i < length; i += boostPositions.length) {
      n = MathUtils.randFloatSpread(0.05)
      for (j = 0; j < boostPositions.length; j++) {
        progress = (state.clock.getElapsedTime() + (i + j) * 0.2) % 1
        o.position.set(boostPositions[j].x + n, boostPositions[j].y, boostPositions[j].z - progress * 0.75)
        o.rotation.z += progress / 2
        o.scale.setScalar(controls.boost ? (1 - progress) * 2 : 0)
        o.matrixWorldNeedsUpdate = true
        o.updateMatrixWorld()
        ref.current.setMatrixAt(i + j, o.matrixWorld)
        ref.current.instanceMatrix.needsUpdate = true
      }
    }
  })

  return (
    <instancedMesh ref={ref} args={[null, null, length]}>
      <boxGeometry args={[size, size, size]} />
      <meshBasicMaterial color="#5ecfff" transparent opacity={opacity} depthWrite={true} />
    </instancedMesh>
  )
}
