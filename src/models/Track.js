// https://sketchfab.com/3d-models/desert-race-game-prototype-map-v2-2ccd3dcbd197415d9f1b97c30b1248c5
// by: Batuhan13

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, useGLTF } from '@react-three/drei'

useGLTF.preload('/track-draco.glb')

export function Track(props) {
  const { scene, nodes, materials } = useGLTF('/track-draco.glb')
  const config = { receiveShadow: true, castShadow: true, 'material-roughness': 1 }

  const bird1 = useRef()
  const bird2 = useRef()
  const bird3 = useRef()
  const bird4 = useRef()
  useFrame((state, delta) => {
    bird1.current.rotation.y += delta / 3.5
    bird2.current.rotation.y += delta / 4
    bird3.current.rotation.y += delta / 2.5
    bird4.current.rotation.y += delta / 4.5
  })

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes['02_Bus_Middle_01_custom7(Clone)_0_1'].geometry}
        material={materials.custom7Clone}
        {...config}
      />
      <mesh
        geometry={nodes['02_Bus_Middle_01_custom7(Clone)_0_2'].geometry}
        material={materials.blueSteelClone}
        {...config}
      />
      <mesh
        geometry={nodes['02_Bus_Middle_01_custom7(Clone)_0_3'].geometry}
        material={materials.custom12Clone}
        {...config}
      />
      <mesh
        geometry={nodes['02_Bus_Middle_01_custom7(Clone)_0_4'].geometry}
        material={materials.custom14Clone}
        {...config}
      />
      <mesh
        geometry={nodes['02_Bus_Middle_01_custom7(Clone)_0_5'].geometry}
        material={materials.defaultMatClone}
        {...config}
      />
      <mesh
        geometry={nodes['02_Bus_Middle_01_custom7(Clone)_0_6'].geometry}
        material={materials.glassClone}
        {...config}
      />
      <mesh
        geometry={nodes['02_Bus_Middle_01_custom7(Clone)_0_7'].geometry}
        material={materials.steelClone}
        {...config}
      />
      <mesh
        geometry={nodes['02_Bus_Middle_01_custom7(Clone)_0_8'].geometry}
        material={materials.lightRedClone}
        {...config}
      />
      <mesh
        geometry={nodes['02_Bus_Middle_01_custom7(Clone)_0_9'].geometry}
        material={materials.darkClone}
        {...config}
      />
      <mesh
        geometry={nodes.Circle133_ColorPalette_0.geometry}
        material={nodes.Circle133_ColorPalette_0.material}
        {...config}
      />
      <mesh
        geometry={nodes.Circle133_ColorPalette_0001.geometry}
        material={nodes.Circle133_ColorPalette_0001.material}
        {...config}
      />
      <mesh
        geometry={nodes.Circle133_ColorPalette_0.geometry}
        material={nodes.Circle133_ColorPalette_0.material}
        {...config}
      />
      <mesh
        geometry={nodes.Cliff2019_ColorPalette_0.geometry}
        material={nodes.Cliff2019_ColorPalette_0.material}
        {...config}
      />
      <mesh
        geometry={nodes.Cube061_ColorPalette_0.geometry}
        material={nodes.Cube061_ColorPalette_0.material}
        {...config}
      />
      <mesh
        geometry={nodes.Cube062_ColorPalette_0.geometry}
        material={nodes.Cube062_ColorPalette_0.material}
        {...config}
      />
      <mesh
        geometry={nodes.Cube063_ColorPalette_0.geometry}
        material={nodes.Cube063_ColorPalette_0.material}
        {...config}
      />
      <mesh
        geometry={nodes.Cube064_ColorPalette_0.geometry}
        material={nodes.Cube064_ColorPalette_0.material}
        {...config}
      />
      <mesh
        geometry={nodes.Cube069_ColorPalette_0.geometry}
        material={nodes.Cube069_ColorPalette_0.material}
        {...config}
      />
      <mesh
        geometry={nodes.Cube070_ColorPalette_0.geometry}
        material={nodes.Cube070_ColorPalette_0.material}
        {...config}
      />
      <mesh
        geometry={nodes.Cube071_ColorPalette_0.geometry}
        material={nodes.Cube071_ColorPalette_0.material}
        {...config}
      />
      <mesh
        geometry={nodes.Cube072_ColorPalette_0.geometry}
        material={nodes.Cube072_ColorPalette_0.material}
        {...config}
      />
      <mesh
        geometry={nodes.Cube073_ColorPalette_0.geometry}
        material={nodes.Cube073_ColorPalette_0.material}
        {...config}
      />
      <mesh
        geometry={nodes.Cube074_ColorPalette_0.geometry}
        material={nodes.Cube074_ColorPalette_0.material}
        {...config}
      />
      <mesh
        geometry={nodes.Cube075_ColorPalette_0.geometry}
        material={nodes.Cube075_ColorPalette_0.material}
        position={[0.52, 0, 0.06]}
      />
      <mesh
        geometry={nodes.Cube076_ColorPalette_0.geometry}
        material={nodes.Cube076_ColorPalette_0.material}
        position={[7.13, 1.22, 3.59]}
      />
      <mesh
        geometry={nodes.Cube079_ColorPalette_0.geometry}
        material={nodes.Cube079_ColorPalette_0.material}
        {...config}
      />
      <mesh
        geometry={nodes.Cube080_ColorPalette_0.geometry}
        material={nodes.Cube080_ColorPalette_0.material}
        position={[6.53, 1.03, 5.68]}
      />
      <mesh
        geometry={nodes.Mball001_ColorPalette_0.geometry}
        material={nodes.Mball001_ColorPalette_0.material}
        {...config}
      />
      <mesh
        geometry={nodes.Mball002_ColorPalette_0.geometry}
        material={nodes.Mball002_ColorPalette_0.material}
        {...config}
      />
      <mesh
        geometry={nodes.Mball003_ColorPalette_0.geometry}
        material={nodes.Mball003_ColorPalette_0.material}
        {...config}
      />
      <mesh
        geometry={nodes.Mball004_ColorPalette_0.geometry}
        material={nodes.Mball004_ColorPalette_0.material}
        {...config}
      />
      <mesh
        geometry={nodes.Mball005_ColorPalette_0.geometry}
        material={nodes.Mball005_ColorPalette_0.material}
        {...config}
      />
      <mesh
        geometry={nodes.Mball006_ColorPalette_0.geometry}
        material={nodes.Mball006_ColorPalette_0.material}
        {...config}
      />
      <mesh
        geometry={nodes.Plane006_ColorPalette_0.geometry}
        material={nodes.Plane006_ColorPalette_0.material}
        {...config}
      />
      <mesh
        ref={bird1}
        castShadow
        geometry={nodes.Plane049_ColorPalette_0.geometry}
        material={nodes.Plane049_ColorPalette_0.material}
      />
      <mesh
        ref={bird2}
        castShadow
        geometry={nodes.Plane050_ColorPalette_0.geometry}
        material={nodes.Plane050_ColorPalette_0.material}
      />
      <mesh
        ref={bird3}
        castShadow
        geometry={nodes.Plane051_ColorPalette_0.geometry}
        material={nodes.Plane051_ColorPalette_0.material}
      />
      <mesh
        ref={bird4}
        castShadow
        geometry={nodes.Plane059_ColorPalette_0.geometry}
        material={nodes.Plane059_ColorPalette_0.material}
      />
      <mesh geometry={nodes.Plane089_ColorPaletteWater_0.geometry}>
        <MeshDistortMaterial speed={4} map={materials.ColorPaletteWater.map} roughness={0} />
      </mesh>
    </group>
  )
}
