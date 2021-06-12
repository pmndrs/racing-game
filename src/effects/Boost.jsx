import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { gameState } from '../store'

const o = new THREE.Object3D()
let ctrl

const boostPositions = [new THREE.Vector3(-0.4, -0.5, -1.8), new THREE.Vector3(0.4, -0.5, -1.8)]

export function Boost({ opacity = 0.5, length = 12, size = 0.1 }) {
  const ref = useRef()
  let n
  let progress
  useFrame((state) => {
    for (let i = 0; i < length; i += boostPositions.length) {
      n = THREE.MathUtils.randFloatSpread(0.05)
      ctrl = gameState.controls
      for (let j = 0; j < boostPositions.length; j++) {
        progress = (state.clock.getElapsedTime() + (i + j) * 0.2) % 1
        o.position.set(boostPositions[j].x + n, boostPositions[j].y, boostPositions[j].z - progress * 0.75)
        o.rotation.z += progress / 2
        o.scale.setScalar(ctrl.boost ? (1 - progress) * 2 : 0)
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
