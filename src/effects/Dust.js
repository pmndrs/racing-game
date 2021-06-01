import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../utils/store'

const v = new THREE.Vector3()
const m = new THREE.Matrix4()
const o = new THREE.Object3D()
const q = new THREE.Quaternion()

export function Dust() {
  const { wheels } = useStore((state) => state.raycast)
  const trail = useRef()

  let index = 0
  let time = 0

  function setItemAt(target, obj, i) {
    const { controls, speed } = useStore.getState()
    o.position.set(obj.position.x, obj.position.y - 0.25, obj.position.z)
    o.scale.setScalar((Math.random() * controls.brake * speed) / 30)
    o.updateMatrix()
    target.setMatrixAt(i, o.matrix)
    trail.current.instanceMatrix.needsUpdate = true
  }

  useFrame((state) => {
    if (state.clock.getElapsedTime() - time > 0.04) {
      time = state.clock.getElapsedTime()
      // Set new trail
      setItemAt(trail.current, wheels[2].current, index++)
      setItemAt(trail.current, wheels[3].current, index++)
      if (index === 100) index = 0
    } else {
      // Shrink old one
      for (let i = 0; i < 100; i++) {
        trail.current.getMatrixAt(i, m)
        m.decompose(o.position, q, v)
        o.scale.setScalar(Math.max(0, v.x - 0.01))
        o.updateMatrix()
        trail.current.setMatrixAt(i, o.matrix)
        trail.current.instanceMatrix.needsUpdate = true
      }
    }
  })

  return (
    <instancedMesh ref={trail} args={[null, null, 100]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="white" transparent opacity={0.15} />
    </instancedMesh>
  )
}
