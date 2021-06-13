import { Object3D } from 'three'
import { useRef, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { getState, mutation, useStore } from '../store'
import type { MutableRefObject } from 'react'
import type { Euler, InstancedMesh, Vector3 } from 'three'
import type { Controls } from '../store'

const o = new Object3D()

export function Skid({ count = 500, opacity = 0.5, size = 0.4 }) {
  const ref = useRef<InstancedMesh>(null!)
  const { wheels, chassisBody } = useStore((state) => state.raycast)

  let controls: Controls
  let index = 0
  useFrame(() => {
    controls = getState().controls
    if (controls.brake && mutation.speed > 10) {
      setItemAt(ref, chassisBody.current!.rotation, wheels[2].current!.position, index++)
      setItemAt(ref, chassisBody.current!.rotation, wheels[3].current!.position, index++)
      if (index === count) index = 0
    }
  })

  useLayoutEffect(() => void ref.current.geometry.rotateX(-Math.PI / 2), [])

  return (
    // @ts-expect-error - https://github.com/three-types/three-ts-types/issues/92
    <instancedMesh ref={ref} args={[null, null, count]}>
      <planeGeometry args={[size, size * 2]} />
      <meshBasicMaterial color="black" transparent opacity={opacity} depthWrite={false} />
    </instancedMesh>
  )
}

function setItemAt(ref: MutableRefObject<InstancedMesh>, rotation: Euler, position: Vector3, index: number) {
  o.position.set(position.x, position.y - 0, position.z)
  o.rotation.copy(rotation)
  o.scale.setScalar(1)
  o.updateMatrix()
  ref.current.setMatrixAt(index, o.matrix)
  ref.current.instanceMatrix.needsUpdate = true
}
