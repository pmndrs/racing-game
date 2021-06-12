import { forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useCylinder } from '@react-three/cannon'
import { useStore, VehicleConfig, WheelInfo } from '../../store'
import React from 'react'
import { Mesh, MeshStandardMaterial } from 'three'

export type GLTFResult = import("three-stdlib").GLTF & {
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

export type WheelRef = ReturnType<typeof Wheel>

export const Wheel = forwardRef<WheelInfo, {leftSide?: boolean}>(({ leftSide, ...props }, ref) => {
  const { radius } = useStore((state) => state.vehicleConfig) as VehicleConfig
  const { nodes, materials } = useGLTF('/models/wheel-draco.glb') as GLTFResult; 
  const scale = radius / 0.34
  useCylinder(() => ({ mass: 50, type: 'Kinematic', material: 'wheel', collisionFilterGroup: 0, args: [radius, radius, 0.5, 16] as [number, number, number, number], ...props }), ref as any)
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
