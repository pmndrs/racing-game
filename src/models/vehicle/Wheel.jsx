import { forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useCylinder } from '@react-three/cannon'
import { useStore } from '../../store'

useGLTF.preload('/models/wheel-draco.glb')

const Wheel = forwardRef(({ leftSide, ...props }, ref) => {
  const { radius } = useStore((state) => state.vehicleConfig)  
  const { nodes, materials } = useGLTF('/models/wheel-draco.glb')
  const scale = radius / 0.34
  useCylinder(() => ({ mass: 50, type: 'Kinematic', material: 'wheel', collisionFilterGroup: 0, args: [radius, radius, 0.5, 16], ...props }), ref)
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

export { Wheel }
