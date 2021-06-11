import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'

const o = new THREE.Object3D()
let ctrl
let chassisObject

export function Boost({ opacity = 0.5, length = 16, size = 0.1 }) {
  const ref = useRef()
  const { chassisBody } = useStore((state) => state.raycast)

  function setItemAt(positionOffset, i, progress) {
    ctrl = useStore.getState().controls
    positionOffset.z -= progress * 0.75
    o.position.set(positionOffset.x, positionOffset.y, positionOffset.z)
    // o.rotation.z += progress;
    o.scale.setScalar(ctrl.boost ? (1 - progress) * 2 : 0)
    o.matrixWorldNeedsUpdate = true
    o.updateMatrixWorld()
    ref.current.setMatrixAt(i, o.matrixWorld)
    ref.current.instanceMatrix.needsUpdate = true
  }

  useFrame((state) => {
    chassisObject = chassisBody.current.children[6]
    if (!chassisObject) {
      return
    }
    chassisObject.add(o)

    for (let i = 0; i < length; i += 2) {
      var offset = (state.clock.getElapsedTime() + i * 0.2) % 1
      setItemAt(new THREE.Vector3(-0.4, -0.5, -1.5), i, offset)
      setItemAt(new THREE.Vector3(0.4, -0.5, -1.5), i + 1, offset)
    }
  })

  return (
    <instancedMesh ref={ref} args={[null, null, length]}>
      <boxGeometry args={[size, size, size]} />
      <meshBasicMaterial color="#5ecfff" transparent opacity={opacity} depthWrite={false} />
    </instancedMesh>
  )
}
