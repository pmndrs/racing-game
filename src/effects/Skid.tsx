import { Euler, Object3D, Vector3, Matrix4 } from 'three'
import { useRef, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import type { InstancedMesh } from 'three'

import { getState, mutation, useStore } from '../store'
import type { Controls } from '../store'

const e = new Euler()
const m = new Matrix4()
const o = new Object3D()
const v = new Vector3()

interface SkidProps {
  count?: number
  opacity?: number
  size?: number
}

export function Skid({ count = 500, opacity = 0.5, size = 0.4 }: SkidProps): JSX.Element {
  const ref = useRef<InstancedMesh>(null)
  const [chassisBody, wheels] = useStore((state) => [state.chassisBody, state.wheels])

  let brake: Controls['brake']
  let index = 0
  useFrame(() => {
    brake = getState().controls.brake
    if (chassisBody.current && wheels[2].current && wheels[3].current && brake && mutation.speed > 10) {
      e.setFromRotationMatrix(m.extractRotation(chassisBody.current.matrix))
      setItemAt(ref.current!, e, wheels[2].current, index++)
      setItemAt(ref.current!, e, wheels[3].current, index++)
      if (index === count) index = 0
    }
  })

  useLayoutEffect(() => {
    ref.current!.geometry.rotateX(-Math.PI / 2)
    return () => {
      ref.current!.geometry.rotateX(Math.PI / 2)
    }
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <planeGeometry args={[size, size * 2]} />
      <meshBasicMaterial color="black" transparent opacity={opacity} depthWrite={false} />
    </instancedMesh>
  )
}

function setItemAt(instances: InstancedMesh, rotation: Euler, wheel: Object3D, index: number) {
  o.position.copy(wheel.getWorldPosition(v))
  o.rotation.copy(rotation)
  o.scale.setScalar(1)
  o.updateMatrix()
  instances.setMatrixAt(index, o.matrix)
  instances.instanceMatrix.needsUpdate = true
}
