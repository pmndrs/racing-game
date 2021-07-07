import { Vector3, Matrix4, Object3D, Quaternion, MathUtils } from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { InstancedMesh } from 'three'
import type { MutableRefObject } from 'react'

import { getState, mutation, useStore } from '../store'
import type { Controls } from '../store'

const v = new Vector3()
const m = new Matrix4()
const o = new Object3D()
const q = new Quaternion()

interface DustProps {
  count?: number
  opacity?: number
  size?: number
}

export function Dust({ count = 200, opacity = 0.1, size = 1 }: DustProps): JSX.Element {
  const wheels = useStore((state) => state.wheels)
  const ref = useRef<InstancedMesh>(null!)

  let brake: Controls['brake']
  let i = 0
  let index = 0
  let intensity = 0
  let time = 0
  useFrame((state, delta) => {
    brake = getState().controls.brake
    intensity = MathUtils.lerp(intensity, (Number(mutation.sliding || brake) * mutation.speed) / 40, delta * 8)

    if (state.clock.getElapsedTime() - time > 0.02 && wheels[2].current && wheels[3].current) {
      time = state.clock.getElapsedTime()
      // Set new trail
      setItemAt(ref, wheels[2].current.getWorldPosition(v), index++, intensity)
      setItemAt(ref, wheels[3].current.getWorldPosition(v), index++, intensity)
      if (index === count) index = 0
    } else {
      // Shrink old one
      for (i = 0; i < count; i++) {
        ref.current.getMatrixAt(i, m)
        m.decompose(o.position, q, v)
        o.scale.setScalar(Math.max(0, v.x - 0.005))
        o.updateMatrix()
        ref.current.setMatrixAt(i, o.matrix)
        ref.current.instanceMatrix.needsUpdate = true
      }
    }
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[size, 10, 10]} />
      <meshBasicMaterial color="white" transparent opacity={opacity} depthWrite={false} />
    </instancedMesh>
  )
}

let n: number
function setItemAt(ref: MutableRefObject<InstancedMesh>, position: Vector3, index: number, intensity: number): void {
  n = MathUtils.randFloatSpread(0.25)
  o.position.set(position.x + n, position.y - 0.4, position.z + n)
  o.scale.setScalar(Math.random() * intensity)
  o.updateMatrix()
  ref.current.setMatrixAt(index, o.matrix)
  ref.current.instanceMatrix.needsUpdate = true
}
