import { forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useCylinder } from '@react-three/cannon'
import { useSnapshot } from 'valtio'
import { gameState } from '../../store'

// eslint-plugin-valtio doesn't support forwardRef.
/* eslint-disable valtio/state-snapshot-rule */
export const Wheel = forwardRef(({ leftSide, ...props }, ref) => {
  const { nodes, materials } = useGLTF('/models/wheel-draco.glb')
  const { radius } = useSnapshot(gameState)
  const scale = radius / 0.34
  useCylinder(
    () => ({
      mass: 50,
      type: 'Kinematic',
      material: 'wheel',
      collisionFilterGroup: 0,
      rotation: [Math.PI / 2, 0, Math.PI / 3],
      args: [gameState.radius, gameState.radius, 0.5, 16],
      ...props,
    }),
    ref,
  )
  return (
    <group ref={ref} dispose={null}>
      <group scale={scale}>
        <group scale={leftSide ? -1 : 1}>
          <mesh castShadow geometry={nodes.Mesh_14.geometry} material={materials['Material.002']} />
          <mesh castShadow geometry={nodes.Mesh_14_1.geometry} material={materials['Material.009']} />
        </group>
      </group>
    </group>
  )
})
