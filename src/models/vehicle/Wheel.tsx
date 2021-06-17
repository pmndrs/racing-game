import { forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import type { CylinderProps } from '@react-three/cannon'
import { useCylinder } from '@react-three/cannon'
import { useStore } from '../../store'
import type { Mesh, MeshStandardMaterial, Object3D } from 'three'
import type { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
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

export const Wheel = forwardRef<Object3D, WheelProps>(({ leftSide, ...props }, ref) => {
  const { radius } = useStore((state) => state.vehicleConfig)
  const { nodes, materials } = useGLTF('/models/wheel-draco.glb') as GLTFResult
  const scale = radius / 0.34
  useCylinder(
    () => ({
      mass: 50,
      type: 'Kinematic',
      material: 'wheel',
      collisionFilterGroup: 0,
      rotation: [Math.PI / 2, 0, Math.PI / 3],
      args: [radius, radius, 0.5, 16],
      ...props,
    }),
    // @ts-expect-error Sigh, generics...
    // ref is officially a ForwardedRef<Object3D>... Which is correct and is actually a parent of the type:
    // MutableRefObject<Object3D>, however as it's not the exact type, typescript will error.
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
