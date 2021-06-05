import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'

const o = new THREE.Object3D()

export function Skid({ opacity = 0.75, length = 1000, size = 0.4 }) {
  let index = 0
  const skid = useRef()
  const { wheels } = useStore((state) => state.raycast)

  useFrame(() => {
    const { controls, speed } = useStore.getState()
    if (controls.brake && speed > 10) {
      setItemAt(skid, wheels[2].current, index++)
      setItemAt(skid, wheels[3].current, index++)
      if (index === length) index = 0
    }
  })

  return (
    <instancedMesh ref={skid} args={[null, null, length]}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial color="black" transparent opacity={opacity} depthWrite={false} />
    </instancedMesh>
  )
}

function setItemAt(ref, obj, i) {
  o.position.set(obj.position.x, obj.position.y - 0, obj.position.z)
  o.rotation.set(-Math.PI / 2, 0, Math.random())
  o.scale.setScalar(1)
  o.updateMatrix()
  ref.current.setMatrixAt(i, o.matrix)
  ref.current.instanceMatrix.needsUpdate = true
}
