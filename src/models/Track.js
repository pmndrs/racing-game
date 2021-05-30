// https://sketchfab.com/3d-models/desert-race-game-prototype-map-v2-2ccd3dcbd197415d9f1b97c30b1248c5
// by: Batuhan13

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('/track-draco.glb')

export function Track(props) {
  const { nodes, materials } = useGLTF('/track-draco.glb')
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
      <mesh geometry={nodes.Circle094_ColorPalette_0.geometry} material={nodes.Circle094_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle095_ColorPalette_0.geometry} material={nodes.Circle095_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle096_ColorPalette_0.geometry} material={nodes.Circle096_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle097_ColorPalette_0.geometry} material={nodes.Circle097_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle098_ColorPalette_0.geometry} material={nodes.Circle098_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle099_ColorPalette_0.geometry} material={nodes.Circle099_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle100_ColorPalette_0.geometry} material={nodes.Circle100_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle101_ColorPalette_0.geometry} material={nodes.Circle101_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle102_ColorPalette_0.geometry} material={nodes.Circle102_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle103_ColorPalette_0.geometry} material={nodes.Circle103_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle104_ColorPalette_0.geometry} material={nodes.Circle104_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle105_ColorPalette_0.geometry} material={nodes.Circle105_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle112_ColorPalette_0.geometry} material={nodes.Circle112_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle113_ColorPalette_0.geometry} material={nodes.Circle113_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle114_ColorPalette_0.geometry} material={nodes.Circle114_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle115_ColorPalette_0.geometry} material={nodes.Circle115_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle116_ColorPalette_0.geometry} material={nodes.Circle116_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle117_ColorPalette_0.geometry} material={nodes.Circle117_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle118_ColorPalette_0.geometry} material={nodes.Circle118_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle119_ColorPalette_0.geometry} material={nodes.Circle119_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle120_ColorPalette_0.geometry} material={nodes.Circle120_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle121_ColorPalette_0.geometry} material={nodes.Circle121_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle122_ColorPalette_0.geometry} material={nodes.Circle122_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle123_ColorPalette_0.geometry} material={nodes.Circle123_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle124_ColorPalette_0.geometry} material={nodes.Circle124_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle125_ColorPalette_0.geometry} material={nodes.Circle125_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle126_ColorPalette_0.geometry} material={nodes.Circle126_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle127_ColorPalette_0.geometry} material={nodes.Circle127_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle128_ColorPalette_0.geometry} material={nodes.Circle128_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle129_ColorPalette_0.geometry} material={nodes.Circle129_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle130_ColorPalette_0.geometry} material={nodes.Circle130_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle131_ColorPalette_0.geometry} material={nodes.Circle131_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle132_ColorPalette_0.geometry} material={nodes.Circle132_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Circle133_ColorPalette_0.geometry} material={nodes.Circle133_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff2004_ColorPalette_0.geometry} material={nodes.Cliff2004_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff2005_ColorPalette_0.geometry} material={nodes.Cliff2005_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff2006_ColorPalette_0.geometry} material={nodes.Cliff2006_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff2007_ColorPalette_0.geometry} material={nodes.Cliff2007_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff2008_ColorPalette_0.geometry} material={nodes.Cliff2008_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff2009_ColorPalette_0.geometry} material={nodes.Cliff2009_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff2010_ColorPalette_0.geometry} material={nodes.Cliff2010_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff2011_ColorPalette_0.geometry} material={nodes.Cliff2011_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff2012_ColorPalette_0.geometry} material={nodes.Cliff2012_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff2013_ColorPalette_0.geometry} material={nodes.Cliff2013_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff2014_ColorPalette_0.geometry} material={nodes.Cliff2014_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff2015_ColorPalette_0.geometry} material={nodes.Cliff2015_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff2016_ColorPalette_0.geometry} material={nodes.Cliff2016_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff2017_ColorPalette_0.geometry} material={nodes.Cliff2017_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff2018_ColorPalette_0.geometry} material={nodes.Cliff2018_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff2019_ColorPalette_0.geometry} material={nodes.Cliff2019_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff3003_ColorPalette_0.geometry} material={nodes.Cliff3003_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff3004_ColorPalette_0.geometry} material={nodes.Cliff3004_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff3005_ColorPalette_0.geometry} material={nodes.Cliff3005_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff3006_ColorPalette_0.geometry} material={nodes.Cliff3006_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff3007_ColorPalette_0.geometry} material={nodes.Cliff3007_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff4002_ColorPalette_0.geometry} material={nodes.Cliff4002_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff4003_ColorPalette_0.geometry} material={nodes.Cliff4003_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cliff5002_ColorPalette_0.geometry} material={nodes.Cliff5002_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube060_ColorPalette_0.geometry} material={nodes.Cube060_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube061_ColorPalette_0.geometry} material={nodes.Cube061_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube062_ColorPalette_0.geometry} material={nodes.Cube062_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube063_ColorPalette_0.geometry} material={nodes.Cube063_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube064_ColorPalette_0.geometry} material={nodes.Cube064_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube065_ColorPalette_0.geometry} material={nodes.Cube065_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube066_ColorPalette_0.geometry} material={nodes.Cube066_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube067_ColorPalette_0.geometry} material={nodes.Cube067_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube068_ColorPalette_0.geometry} material={nodes.Cube068_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube069_ColorPalette_0.geometry} material={nodes.Cube069_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube070_ColorPalette_0.geometry} material={nodes.Cube070_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube071_ColorPalette_0.geometry} material={nodes.Cube071_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube072_ColorPalette_0.geometry} material={nodes.Cube072_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube073_ColorPalette_0.geometry} material={nodes.Cube073_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube074_ColorPalette_0.geometry} material={nodes.Cube074_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube075_ColorPalette_0.geometry} material={nodes.Cube075_ColorPalette_0.material} position={[0.52, 0, 0.06]} {...config} />
      <mesh geometry={nodes.Cube076_ColorPalette_0.geometry} material={nodes.Cube076_ColorPalette_0.material} position={[0.52, 0, 0.06]} {...config} />
      <mesh geometry={nodes.Cube077_ColorPalette_0.geometry} material={nodes.Cube077_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube078_ColorPalette_0.geometry} material={nodes.Cube078_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube079_ColorPalette_0.geometry} material={nodes.Cube079_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube080_ColorPalette_0.geometry} material={nodes.Cube080_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube081_ColorPalette_0.geometry} material={nodes.Cube081_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube082_ColorPalette_0.geometry} material={nodes.Cube082_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube083_ColorPalette_0.geometry} material={nodes.Cube083_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube084_ColorPalette_0.geometry} material={nodes.Cube084_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube085_ColorPalette_0.geometry} material={nodes.Cube085_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Cube086_ColorPalette_0.geometry} material={nodes.Cube086_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Icosphere054_ColorPalette_0.geometry} material={nodes.Icosphere054_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Icosphere055_ColorPalette_0.geometry} material={nodes.Icosphere055_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Icosphere056_ColorPalette_0.geometry} material={nodes.Icosphere056_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Icosphere057_ColorPalette_0.geometry} material={nodes.Icosphere057_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Icosphere058_ColorPalette_0.geometry} material={nodes.Icosphere058_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Icosphere059_ColorPalette_0.geometry} material={nodes.Icosphere059_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Icosphere060_ColorPalette_0.geometry} material={nodes.Icosphere060_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Icosphere061_ColorPalette_0.geometry} material={nodes.Icosphere061_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Icosphere062_ColorPalette_0.geometry} material={nodes.Icosphere062_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Icosphere063_ColorPalette_0.geometry} material={nodes.Icosphere063_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Icosphere064_ColorPalette_0.geometry} material={nodes.Icosphere064_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Icosphere065_ColorPalette_0.geometry} material={nodes.Icosphere065_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Icosphere066_ColorPalette_0.geometry} material={nodes.Icosphere066_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Icosphere067_ColorPalette_0.geometry} material={nodes.Icosphere067_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Icosphere068_ColorPalette_0.geometry} material={nodes.Icosphere068_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Mball001_ColorPalette_0.geometry} material={nodes.Mball001_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Mball002_ColorPalette_0.geometry} material={nodes.Mball002_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Mball003_ColorPalette_0.geometry} material={nodes.Mball003_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Mball004_ColorPalette_0.geometry} material={nodes.Mball004_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Mball005_ColorPalette_0.geometry} material={nodes.Mball005_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Mball006_ColorPalette_0.geometry} material={nodes.Mball006_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Plane005_ColorPalette_0.geometry} material={nodes.Plane005_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Plane006_ColorPalette_0.geometry} material={nodes.Plane006_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Plane012_ColorPalette_0.geometry} material={nodes.Plane012_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Plane014_ColorPalette_0.geometry} material={nodes.Plane014_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Plane015_ColorPalette_0.geometry} material={nodes.Plane015_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Plane017_ColorPalette_0.geometry} material={nodes.Plane017_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Plane019_ColorPalette_0.geometry} material={nodes.Plane019_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Plane021_ColorPalette_0.geometry} material={nodes.Plane021_ColorPalette_0.material} {...config} />
      <mesh ref={bird1} geometry={nodes.Plane049_ColorPalette_0.geometry} material={nodes.Plane049_ColorPalette_0.material} {...config} />
      <mesh ref={bird2} geometry={nodes.Plane050_ColorPalette_0.geometry} material={nodes.Plane050_ColorPalette_0.material} {...config} />
      <mesh ref={bird3} geometry={nodes.Plane051_ColorPalette_0.geometry} material={nodes.Plane051_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Plane052_ColorPalette_0.geometry} material={nodes.Plane052_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Plane053_ColorPalette_0.geometry} material={nodes.Plane053_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Plane054_ColorPalette_0.geometry} material={nodes.Plane054_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Plane055_ColorPalette_0.geometry} material={nodes.Plane055_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Plane056_ColorPalette_0.geometry} material={nodes.Plane056_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Plane057_ColorPalette_0.geometry} material={nodes.Plane057_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Plane058_ColorPalette_0.geometry} material={nodes.Plane058_ColorPalette_0.material} {...config} />
      <mesh ref={bird4} geometry={nodes.Plane059_ColorPalette_0.geometry} material={nodes.Plane059_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Plane089_ColorPaletteWater_0.geometry} material={materials.ColorPaletteWater} {...config} />
      <mesh geometry={nodes.Rock2001_ColorPalette_0.geometry} material={nodes.Rock2001_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Rock4001_ColorPalette_0.geometry} material={nodes.Rock4001_ColorPalette_0.material} {...config} />
      <mesh geometry={nodes.Rock4002_ColorPalette_0.geometry} material={nodes.Rock4002_ColorPalette_0.material} {...config} />
    </group>
  )
}
