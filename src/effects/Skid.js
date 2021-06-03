import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../utils/store'

const v = new THREE.Vector3()
const m = new THREE.Matrix4()
const o = new THREE.Object3D()
const q = new THREE.Quaternion()

const skidLength = 500

export function Skid({ opacity = 0.8 }) {
  const { chassisBody, wheels } = useStore((state) => state.raycast)
  const skid = useRef()

  let index = 0
  let time = 0
  let intensity = 0

  function setItemAt(target, obj, i, intensity) {
    const tempObj = new THREE.Object3D()
    tempObj.position.set(obj.position.x, obj.position.y - 0.4, obj.position.z)
    tempObj.rotation.set(0, 0, 0) // need to match the rotation of the wheels
    const scale = Math.random() * intensity
    tempObj.scale.set(scale, scale, scale)
    tempObj.updateMatrix()
    target.setMatrixAt(i, tempObj.matrix)
    skid.current.instanceMatrix.needsUpdate = true
  }

  useFrame((state, delta) => {
    const store = useStore.getState()
    const { controls, sliding, speed } = useStore.getState()

    intensity = THREE.MathUtils.lerp(intensity, (((sliding || controls.brake) * speed) / 40), delta * 8)

    if (state.clock.getElapsedTime() - time > 0.02) {
      time = state.clock.getElapsedTime()
      // Set new skids
      setItemAt(skid.current, wheels[2].current, index++, intensity)
      setItemAt(skid.current, wheels[3].current, index++, intensity)
      if (index === 200) index = 0
    } else {
      // Shrink old one
      for (let i = 0; i < skidLength; i++) {
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
    <instancedMesh ref={skid} args={[null, null, skidLength]}>
      <boxGeometry args={[3, 0.1, 1]} />
      <meshBasicMaterial color="black" transparent opacity={opacity} depthWrite={false} />
    </instancedMesh>
  )
}
