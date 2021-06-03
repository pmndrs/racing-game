import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../utils/store'

const v = new THREE.Vector3()
const m = new THREE.Matrix4()
const o = new THREE.Object3D()
const q = new THREE.Quaternion()

export function Skid({ opacity = 0.8 }) {
  const { wheels } = useStore((state) => state.raycast)
  const skid = useRef()

  let index = 0
  let time = 0
  let intensity = 0

  function setItemAt(target, obj, i, intensity) {
    o.position.set(obj.position.x, obj.position.y - 0.5, obj.position.z)
    const scale = Math.random() * intensity
    o.scale.set(scale, scale * 1.25, scale)
    o.updateMatrix()
    target.setMatrixAt(i, o.matrix)
    skid.current.instanceMatrix.needsUpdate = true
  }

  useFrame((state, delta) => {
    const store = useStore.getState()
    const { controls, sliding, speed } = useStore.getState()
    intensity = THREE.MathUtils.lerp(intensity, (((sliding || controls.brake) * speed) / 40), delta * 8)

    if (state.clock.getElapsedTime() - time > 0.02) {
      time = state.clock.getElapsedTime()
      // Set new skid
      setItemAt(skid.current, wheels[2].current, index++, intensity)
      setItemAt(skid.current, wheels[3].current, index++, intensity)
      if (index === 200) index = 0
    } else {
      // Shrink old one
      for (let i = 0; i < 200; i++) {
        skid.current.getMatrixAt(i, m)
        m.decompose(o.position, q, v)
        o.scale.set(Math.max(0, v.x - 0.001), Math.max(0, v.y - 0.001), Math.max(0, v.z - 0.001))
        o.updateMatrix()
        skid.current.setMatrixAt(i, o.matrix)
        skid.current.instanceMatrix.needsUpdate = true
      }
    }
  })

  return (
    <instancedMesh ref={skid} args={[null, null, 200]}>
      <boxGeometry args={[2, 1, 2]} />
      <meshBasicMaterial color="black" transparent opacity={opacity} depthWrite={false} />
    </instancedMesh>
  )
}
