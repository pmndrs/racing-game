import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../utils/store'

const o = new THREE.Object3D()

const skidLength = 200
const skidSize = 0.4

export function Skid({ opacity = 0.8 }) {
  let index = 0
  const { wheels } = useStore((state) => state.raycast)
  const skid = useRef()

  function setItemAt(ref, obj, i) {
    o.position.set(obj.position.x, obj.position.y, obj.position.z)
    o.rotation.set(-Math.PI / 2, 0, Math.random())
    o.scale.setScalar(1)
    o.updateMatrix()
    skid.current.setMatrixAt(i, o.matrix)
    skid.current.instanceMatrix.needsUpdate = true
  }

  useFrame((state, delta) => {
    const { controls, sliding } = useStore.getState()

    if (controls.brake && sliding) {
      // Set new skid
      setItemAt(skid.current, wheels[2].current, index++)
      setItemAt(skid.current, wheels[3].current, index++)
      if (index === skidLength) index = 0
    }
  })

  return (
    <instancedMesh ref={skid} args={[null, null, skidLength]}>
      <planeGeometry args={[skidSize, skidSize]} />
      <meshBasicMaterial color="black" transparent opacity={opacity} depthWrite={false} />
    </instancedMesh>
  )
}
