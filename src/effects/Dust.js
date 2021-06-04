import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'

const v = new THREE.Vector3()
const m = new THREE.Matrix4()
const o = new THREE.Object3D()
const q = new THREE.Quaternion()

export function Dust({ opacity = 0.1, length = 200, size = 1 }) {
  const { wheels } = useStore((state) => state.raycast)
  const trail = useRef()

  let index = 0
  let time = 0
  let intensity = 0

  useFrame((state, delta) => {
    const { controls, sliding, speed } = useStore.getState()
    intensity = THREE.MathUtils.lerp(intensity, ((sliding || controls.brake) * speed) / 40, delta * 8)

    if (state.clock.getElapsedTime() - time > 0.02) {
      time = state.clock.getElapsedTime()
      // Set new trail
      setItemAt(trail, wheels[2].current, index++, intensity)
      setItemAt(trail, wheels[3].current, index++, intensity)
      if (index === length) index = 0
    } else {
      // Shrink old one
      for (let i = 0; i < length; i++) {
        trail.current.getMatrixAt(i, m)
        m.decompose(o.position, q, v)
        o.scale.setScalar(Math.max(0, v.x - 0.005))
        o.updateMatrix()
        trail.current.setMatrixAt(i, o.matrix)
        trail.current.instanceMatrix.needsUpdate = true
      }
    }
  })

  return (
    <instancedMesh ref={trail} args={[null, null, length]}>
      <sphereGeometry args={[size, 10, 10]} />
      <meshBasicMaterial color="white" transparent opacity={opacity} depthWrite={false} />
    </instancedMesh>
  )
}

function setItemAt(ref, obj, i, intensity) {
  const n = THREE.MathUtils.randFloatSpread(0.25)
  o.position.set(obj.position.x + n, obj.position.y - 0.4, obj.position.z + n)
  o.scale.setScalar(Math.random() * intensity)
  o.updateMatrix()
  ref.current.setMatrixAt(i, o.matrix)
  ref.current.instanceMatrix.needsUpdate = true
}
