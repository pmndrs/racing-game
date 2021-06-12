import * as THREE from 'three'
import { useRef, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { gameState, mutation } from '../store'

const o = new THREE.Object3D()

export function Skid({ opacity = 0.5, length = 500, size = 0.4 }) {
  const ref = useRef()

  function setItemAt(obj, i) {
    o.position.set(obj.position.x, obj.position.y - 0, obj.position.z)
    o.rotation.copy(gameState.raycast.chassisBody.current.rotation)
    o.scale.setScalar(1)
    o.updateMatrix()
    ref.current.setMatrixAt(i, o.matrix)
    ref.current.instanceMatrix.needsUpdate = true
  }

  let ctrl
  let index = 0
  useFrame(() => {
    ctrl = gameState.controls
    if (ctrl.brake && mutation.speed > 10) {
      setItemAt(gameState.raycast.wheels[2].current, index++)
      setItemAt(gameState.raycast.wheels[3].current, index++)
      if (index === length) index = 0
    }
  })

  useLayoutEffect(() => void ref.current.geometry.rotateX(-Math.PI / 2), [])

  return (
    <instancedMesh ref={ref} args={[null, null, length]}>
      <planeGeometry args={[size, size * 2]} />
      <meshBasicMaterial color="black" transparent opacity={opacity} depthWrite={false} />
    </instancedMesh>
  )
}
