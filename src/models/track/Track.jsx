// https://sketchfab.com/3d-models/desert-race-game-prototype-map-v2-2ccd3dcbd197415d9f1b97c30b1248c5
// by: Batuhan13

import * as THREE from 'three'
import { useLayoutEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, useGLTF, useAnimations, PositionalAudio } from '@react-three/drei'
import { useBox } from '@react-three/cannon'
import { useStore, levelLayer } from '../../store'

useGLTF.preload('/models/track-draco.glb')

function Train({ args = [38, 8, 10], position = [-145.84, 3.42, 54.67], rotation = [0, -0.09, 0], config }) {
  const group = useRef()
  const ready = useStore((state) => state.ready)
  const { animations, nodes: n, materials: m } = useGLTF('/models/track-draco.glb')
  const [ref, api] = useBox(() => ({ mass: 10000, type: 'Kinematic', args, position, rotation }), undefined, [args, position, rotation])
  const { actions } = useAnimations(animations, group)
  useLayoutEffect(() => void actions.train.play(), [actions])

  useFrame(() => {
    api.position.set(group.current.position.x, group.current.position.y, group.current.position.z)
    api.rotation.set(group.current.rotation.x, group.current.rotation.y - 0.09, group.current.rotation.z)
  })

  return (
    <>
      <group ref={group} name="train" position={[-145.84, 3.42, 54.67]} rotation={[0, -0.09, 0]}>
        <mesh geometry={n.train_1.geometry} material={m.custom7Clone} {...config} />
        <mesh geometry={n.train_2.geometry} material={m.blueSteelClone} {...config} />
        <mesh geometry={n.train_3.geometry} material={m.custom12Clone} {...config} />
        <mesh geometry={n.train_4.geometry} material={m.custom14Clone} {...config} />
        <mesh geometry={n.train_5.geometry} material={m.defaultMatClone} {...config} />
        <mesh geometry={n.train_6.geometry} material={m.glassClone} {...config} />
        <mesh geometry={n.train_7.geometry} material={m.steelClone} {...config} />
        <mesh geometry={n.train_8.geometry} material={m.lightRedClone} {...config} />
        <mesh geometry={n.train_9.geometry} material={m.darkClone} {...config} />
        {ready && <PositionalAudio url="/sounds/train.mp3" loop autoplay distance={5} />}
      </group>
    </>
  )
}

export function Track(props) {
  const group = useRef()
  const ready = useStore((state) => state.ready)
  const level = useStore((state) => state.level)
  const { nodes: n, materials: m } = useGLTF('/models/track-draco.glb')
  const config = { receiveShadow: true, castShadow: true, 'material-roughness': 1 }

  const birds = useRef()
  const clouds = useRef()
  useFrame((state, delta) => {
    birds.current.children.forEach((bird, index) => (bird.rotation.y += delta / index))
    clouds.current.children.forEach((bird, index) => (bird.rotation.y += delta / 25 / index))
  })

  useLayoutEffect(() => void level.current.traverse((child) => child.layers.enable(levelLayer)), [])

  return (
    <group ref={group} {...props} dispose={null}>
      <Train config={config} />
      <mesh geometry={n.track_2.geometry} material={m['Material.001']} {...config} />
      <mesh geometry={n.tube.geometry} material={m['default']} {...config} />
      <group ref={level}>
        <mesh geometry={n.strip.geometry} material={n.strip.material} {...config} />
        <mesh geometry={n.track_1.geometry} material={n.track_1.material} {...config} />
        <mesh geometry={n.mountains.geometry} material={n.mountains.material} {...config} />
        <mesh geometry={n.terrain.geometry} material={n.terrain.material} {...config} />
        <mesh geometry={n.water.geometry}>
          <MeshDistortMaterial speed={4} map={m.ColorPaletteWater.map} roughness={0} side={THREE.DoubleSide} />
          {ready && <PositionalAudio url="/sounds/water.mp3" loop autoplay distance={10} />}
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
      <mesh geometry={n.blade006.geometry} material={n.blade006.material} {...config} />
      <mesh geometry={n.blade.geometry} material={n.blade.material} {...config} />
      <group ref={clouds}>
        <mesh geometry={n.cloud001.geometry} material={n.cloud001.material} position={[-8.55, 27.94, -7.84]} rotation={[0, 0.26, 0]} />
        <mesh geometry={n.cloud003.geometry} material={n.cloud003.material} position={[-8.55, 7.47, -7.84]} />
        <mesh geometry={n.cloud006.geometry} material={n.cloud006.material} position={[-43, 11.66, 8.15]} />
        <mesh geometry={n.cloud008.geometry} material={n.cloud008.material} position={[16.29, 8.22, -7.84]} />
        <mesh geometry={n.cloud010.geometry} material={n.cloud010.material} position={[6.63, 7.79, -7.84]} />
        <mesh geometry={n.cloud011.geometry} material={n.cloud011.material} position={[-8.55, -8.74, -7.84]} />
        <mesh geometry={n.cloud002.geometry} material={n.cloud002.material} position={[49.41, 27.94, -17.5]} rotation={[-Math.PI, 0.92, -Math.PI]} />
        <mesh geometry={n.cloud004.geometry} material={n.cloud004.material} position={[10.77, 11.73, 17]} rotation={[-Math.PI, 1.19, -Math.PI]} />
        <mesh geometry={n.cloud012.geometry} material={n.cloud012.material} position={[11.47, -16.12, -66.08]} rotation={[-Math.PI, 0.92, -Math.PI]} />
        <mesh geometry={n.cloud007.geometry} material={n.cloud007.material} position={[-8.55, 22.81, -7.84]} rotation={[Math.PI, -1.43, Math.PI]} />
        <mesh geometry={n.cloud009.geometry} material={n.cloud009.material} position={[-32.93, 17.92, -7.84]} rotation={[Math.PI, -0.79, Math.PI]} />
        <mesh geometry={n.cloud.geometry} material={n.cloud.material} position={[-66.73, -4.76, -17.35]} rotation={[Math.PI, -0.79, Math.PI]} />
        <mesh geometry={n.cloud005.geometry} material={n.cloud005.material} position={[25.95, 27.94, -23.02]} rotation={[-Math.PI, 0.31, -Math.PI]} />
      </group>
    </group>
  )
}
