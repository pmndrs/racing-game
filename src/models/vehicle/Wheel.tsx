import { forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useCompoundBody } from '@react-three/cannon'

import { useStore } from '../../store'

import type { CylinderProps } from '@react-three/cannon'
import type { Group, Mesh, MeshStandardMaterial } from 'three'
import type { GLTF } from 'three-stdlib'

interface WheelGLTF extends GLTF {
  nodes: {
    /* Manually typed meshes names */
    Mesh_14: Mesh
    Mesh_14_1: Mesh
  }
  materials: {
    /* Manually typed meshes names */
    'Material.002': MeshStandardMaterial
    'Material.009': MeshStandardMaterial
  }
}

interface WheelProps extends CylinderProps {
  leftSide?: boolean
}

export const Wheel = forwardRef<Group, WheelProps>(({ leftSide, ...props }, ref) => {
  const { radius } = useStore((state) => state.wheelInfo)
  const { nodes, materials } = useGLTF('/models/wheel-draco.glb') as WheelGLTF
  const scale = radius / 0.34
  useCompoundBody(
    () => ({
      mass: 50,
      type: 'Kinematic',
      material: 'wheel',
      collisionFilterGroup: 0,
      shapes: [{ args: [radius, radius, 0.5, 16], rotation: [0, 0, -Math.PI / 2], type: 'Cylinder' }],
      ...props,
    }),
    ref,
    [radius],
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
