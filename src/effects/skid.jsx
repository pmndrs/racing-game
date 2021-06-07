import * as THREE from 'three'
import React, { useRef, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'

const o = new THREE.Object3D()

export function Skid({ opacity = 0.5, length = 500, size = 0.4 }) {
  let index = 0
  const ref = useRef()
  const { wheels, chassisBody } = useStore((state) => state.raycast)

  function setItemAt(obj, i) {
    o.position.set(obj.position.x, obj.position.y - 0, obj.position.z)
    o.rotation.copy(chassisBody.current.rotation)
    o.scale.setScalar(1)
    o.updateMatrix()
    ref.current.setMatrixAt(i, o.matrix)
    ref.current.instanceMatrix.needsUpdate = true
  }

  useFrame(() => {
    const { controls, speed } = useStore.getState()
    if (controls.brake && speed > 10) {
      setItemAt(wheels[2].current, index++)
      setItemAt(wheels[3].current, index++)
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
