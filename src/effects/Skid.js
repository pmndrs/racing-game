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
  const { wheels } = useStore((state) => state.raycast)
  const skid = useRef()

  let index = 0
  let time = 0
  let intensity = 0

  function setItemAt(target, obj, i, intensity) {
    o.position.set(obj.position.x, obj.position.y - 0, obj.position.z)
    o.rotation.set(-Math.PI / 2, 0, Math.random())
    o.scale.setScalar(1)
    o.updateMatrix()
    target.setMatrixAt(i, o.matrix)
    skid.current.instanceMatrix.needsUpdate = true
  }

  useFrame((state, delta) => {
    const { controls, sliding, speed } = useStore.getState()
    intensity = THREE.MathUtils.lerp(intensity, (controls.brake * speed) / 40, delta * 8)

    if (controls.brake || sliding) {
      time = state.clock.getElapsedTime()
      // Set new skid
      setItemAt(skid.current, wheels[2].current, index++, intensity)
      setItemAt(skid.current, wheels[3].current, index++, intensity)
      if (sliding) {
        setItemAt(skid.current, wheels[0].current, index++, intensity)
        setItemAt(skid.current, wheels[1].current, index++, intensity)
      }
      if (index === skidLength) index = 0
    }
  })

  return (
    <instancedMesh ref={skid} args={[null, null, skidLength]}>
      <planeGeometry args={[0.3, 0.3]} />
      <meshBasicMaterial color="black" transparent opacity={opacity} depthWrite={false} />
    </instancedMesh>
  )
}
