import { forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useCylinder } from '@react-three/cannon'
import { useStore } from '../../store'

useGLTF.preload('/models/wheel-draco.glb')

const Wheel = forwardRef(({ leftSide, ...props }, ref) => {
  const { vehicleConfig } = useStore((state) => state.constants)
  const debug = useStore((state) => state.debug)
  const { radius } = vehicleConfig
  const { nodes, materials } = useGLTF('/models/wheel-draco.glb')
  const scale = radius / 0.34
  useCylinder(() => ({ mass: 50, type: 'Kinematic', material: 'wheel', collisionFilterGroup: 0, args: [radius, radius, 0.5, 16], ...props }), ref)
  return (
    <group ref={ref} dispose={null}>
      {debug && (
        <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]}>
          <cylinderGeometry args={[radius, radius, 0.5, 16]} />
          <meshBasicMaterial color="red" transparent opacity={0.25} />
        </mesh>
      )}
      <group scale={scale}>
        <group scale={leftSide ? -1 : 1}>
          <mesh geometry={nodes.Mesh_14.geometry} material={materials['Material.002']} />
          <mesh geometry={nodes.Mesh_14_1.geometry} material={materials['Material.009']} />
        </group>
      </group>
    </group>
  )
})

export { Wheel }
