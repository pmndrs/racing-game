// https://sketchfab.com/3d-models/desert-race-game-prototype-map-v2-2ccd3dcbd197415d9f1b97c30b1248c5
// by: Batuhan13

import * as THREE from 'three'
import { useLayoutEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, useGLTF, useAnimations, PositionalAudio } from '@react-three/drei'
import { useStore } from '../../store'
import { levelLayer } from '../../enums'

useGLTF.preload('/models/track-draco.glb')

export function Track(props) {
  const group = useRef()
  const { ready, level } = useStore(({ ready, level }) => ({ ready, level }))
  const { animations, nodes: n, materials: m } = useGLTF('/models/track-draco.glb')
  const { actions } = useAnimations(animations, group)
  const config = { receiveShadow: true, castShadow: true, 'material-roughness': 1 }

  const birds = useRef()
  const clouds = useRef()
  useFrame((state, delta) => {
    birds.current.children.forEach((bird, index) => (bird.rotation.y += delta / index))
    clouds.current.children.forEach((bird, index) => (bird.rotation.y += delta / 10 / index))
  })

  useLayoutEffect(() => {
    actions.train.play()
  }, [actions])

  useLayoutEffect(() => {
    level.current.traverse((child) => void child.layers.enable(levelLayer))
  }, [])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="train" position={[-5.16, 0.13, 2.45]}>
        <mesh geometry={n.train_1.geometry} material={m.custom7Clone} {...config} />
        <mesh geometry={n.train_2.geometry} material={m.blueSteelClone} {...config} />
        <mesh geometry={n.train_3.geometry} material={m.custom12Clone} {...config} />
        <mesh geometry={n.train_4.geometry} material={m.custom14Clone} {...config} />
        <mesh geometry={n.train_5.geometry} material={m.defaultMatClone} {...config} />
        <mesh geometry={n.train_6.geometry} material={m.glassClone} {...config} />
        <mesh geometry={n.train_7.geometry} material={m.steelClone} {...config} />
        <mesh geometry={n.train_8.geometry} material={m.lightRedClone} {...config} />
        <mesh geometry={n.train_9.geometry} material={m.darkClone} {...config} />
        {ready && <PositionalAudio url="/sounds/train.mp3" loop autoplay distance={10} />}
      </group>
      <mesh geometry={n.track_2.geometry} material={m['Material.001']} {...config} />
      <mesh geometry={n.tube.geometry} material={m['default']} {...config} />
      <group ref={level}>
        <mesh geometry={n.strip.geometry} material={n.strip.material} {...config} />
        <mesh geometry={n.track_1.geometry} material={n.track_1.material} {...config} />
        <mesh geometry={n.mountains.geometry} material={n.mountains.material} {...config} />
        <mesh geometry={n.terrain.geometry} material={n.terrain.material} {...config} />
        <mesh geometry={n.water.geometry}>
          <MeshDistortMaterial speed={4} map={m.ColorPaletteWater.map} roughness={0} side={THREE.DoubleSide} />
          {ready && <PositionalAudio url="/sounds/water.mp3" loop autoplay distance={20} />}
        </mesh>
      </group>
      <group ref={birds}>
        <mesh geometry={n.bird001.geometry} material={n.bird001.material} {...config} />
        <mesh geometry={n.bird002.geometry} material={n.bird002.material} {...config} />
        <mesh geometry={n.bird003.geometry} material={n.bird003.material} {...config} />
        <mesh geometry={n.bird.geometry} material={n.bird.material} {...config} />
      </group>
      <mesh geometry={n.blade001.geometry} material={n.blade001.material} {...config} />
      <mesh geometry={n.blade002.geometry} material={n.blade002.material} {...config} />
      <mesh geometry={n.blade003.geometry} material={n.blade003.material} {...config} />
      <mesh geometry={n.blade004.geometry} material={n.blade004.material} {...config} />
      <mesh geometry={n.blade005.geometry} material={n.blade005.material} {...config} />
      <mesh geometry={n.blade006.geometry} material={n.blade006.material} position={[7.13, 1.22, 3.59]} {...config} />
      <mesh geometry={n.blade.geometry} material={n.blade.material} position={[6.53, 1.03, 5.68]} {...config} />
      <group ref={clouds}>
        <mesh geometry={n.cloud001.geometry} material={n.cloud001.material} position={[0, 1.07, 0]} rotation={[0, 0.26, 0]} {...config} />
        <mesh geometry={n.cloud003.geometry} material={n.cloud003.material} position={[0, 0.29, 0]} {...config} />
        <mesh geometry={n.cloud006.geometry} material={n.cloud006.material} position={[-1.32, 0.45, 0.62]} {...config} />
        <mesh geometry={n.cloud008.geometry} material={n.cloud008.material} position={[0.96, 0.32, 0]} {...config} />
        <mesh geometry={n.cloud010.geometry} material={n.cloud010.material} position={[0.58, 0.3, 0]} {...config} />
        <mesh geometry={n.cloud011.geometry} material={n.cloud011.material} position={[0, -0.34, 0]} {...config} />
        <mesh geometry={n.cloud002.geometry} material={n.cloud002.material} position={[2.23, 1.07, -0.37]} rotation={[-Math.PI, 0.92, -Math.PI]} {...config} />
        <mesh geometry={n.cloud004.geometry} material={n.cloud004.material} position={[0.74, 0.45, 0.96]} rotation={[-Math.PI, 1.19, -Math.PI]} {...config} />
        <mesh geometry={n.cloud012.geometry} material={n.cloud012.material} position={[0.77, -0.62, -2.24]} rotation={[-Math.PI, 0.92, -Math.PI]} {...config} />
        <mesh geometry={n.cloud007.geometry} material={n.cloud007.material} position={[0, 0.88, 0]} rotation={[Math.PI, -1.43, Math.PI]} {...config} />
        <mesh geometry={n.cloud009.geometry} material={n.cloud009.material} position={[-0.94, 0.69, 0]} rotation={[Math.PI, -0.79, Math.PI]} {...config} />
        <mesh geometry={n.cloud.geometry} material={n.cloud.material} position={[-2.24, -0.18, -0.37]} rotation={[Math.PI, -0.79, Math.PI]} {...config} />
        <mesh geometry={n.cloud005.geometry} material={n.cloud005.material} position={[1.33, 1.07, -0.58]} rotation={[-Math.PI, 0.31, -Math.PI]} {...config} />
      </group>
    </group>
  )
}
