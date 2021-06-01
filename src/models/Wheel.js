import { forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useCylinder } from '@react-three/cannon'

useGLTF.preload('/wheel-draco.glb')

const Wheel = forwardRef(({ radius = 0.7, leftSide, ...props }, ref) => {
  const { nodes, materials } = useGLTF('/wheel-draco.glb')
  useCylinder(() => ({ mass: 1, type: 'Kinematic', material: 'wheel', collisionFilterGroup: 0, args: [radius, radius, 0.5, 16], ...props }), ref)
  return (
    <group ref={ref} dispose={null}>
      <group scale={[leftSide ? -0.5 : 0.5, 0.4, 0.4]} position={[leftSide ? -0.4 : 0.4, 0, 0]}>
        <mesh castShadow geometry={nodes.Mesh_14.geometry} material={materials['Material.002']} />
        <mesh castShadow geometry={nodes.Mesh_15.geometry} material={materials['Material.009']} />
        <mesh castShadow geometry={nodes.Mesh_16.geometry} material={materials['Material.007']} />
      </group>
    </group>
  )
})

export { Wheel }
