import { useState } from 'react'
import { Layers } from 'three'
import { Canvas } from '@react-three/fiber'
import { Physics, Debug } from '@react-three/cannon'
import { Sky, Environment, PerspectiveCamera, OrthographicCamera, OrbitControls, Stats } from '@react-three/drei'

import type { ComponentType, ReactNode } from 'react'
import type { DirectionalLight } from 'three'

import { angularVelocity, levelLayer, mutation, position, rotation, useStore } from './store'
import { Ramp, Track, Vehicle, Goal, Train, Heightmap } from './models'
import { Clock, Speed, Minimap, Intro, Help, Editor, LeaderBoard, Finished, Checkpoint } from './ui'
import { HideMouse, Keyboard } from './controls'

import type { Booleans, Numbers } from './store'

const layers = new Layers()
layers.enable(levelLayer)

function DebugScene({ children }: { children: ReactNode }) {
  const debug = useStore((state) => state.debug)
  return debug ? (
    <Debug scale={1.0001} color="white">
      {children}
    </Debug>
  ) : (
    <>{children}</>
  )
}

const useToggle =
  <P extends {}>(ToggledComponent: ComponentType<P>, toggle: Booleans | Numbers) =>
  (props: P) => {
    const value = useStore((state) => state[toggle])
    return value ? <ToggledComponent {...props} /> : null
  }

export function App() {
  const [light, setLight] = useState<DirectionalLight>()
  const [camera, dpr, editor, set, shadows] = useStore((s) => [s.camera, s.dpr, s.editor, s.set, s.shadows])

  const onStart = () => {
    mutation.start = Date.now()
    mutation.finish = 0
  }

  const onFinish = () => {
    if (mutation.start && !mutation.finish) {
      mutation.finish = Date.now()
      set({ finished: mutation.finish - mutation.start })
    }
  }

  const onCheckpoint = () => {
    mutation.tempCheckpoint1 = Date.now() - mutation.start
    mutation.checkpointDifference = mutation.tempCheckpoint1 - mutation.checkpoint1
    mutation.checkpoint1 = mutation.tempCheckpoint1
    set({
      checkpoint1: mutation.checkpoint1,
      // checkpointRecord: mutation.checkpointDifference < 0 ? mutation.checkpoint1 : checkpoint1,
      showCheckpoint: true,
    })
    setTimeout(() => set({ showCheckpoint: false }), 3000)
  }

  const ToggledEditor = useToggle(Editor, 'editor')
  const ToggledFinished = useToggle(Finished, 'finished')
  const ToggledMap = useToggle(Minimap, 'map')
  const ToggledOrbitControls = useToggle(OrbitControls, 'editor')
  const ToggledStats = useToggle(Stats, 'stats')

  return (
    <Intro>
      <Canvas key={`${dpr}${shadows}`} mode="concurrent" dpr={[1, dpr]} shadows={shadows} camera={{ position: [0, 5, 15], fov: 50 }}>
        <fog attach="fog" args={['white', 0, 500]} />
        <Sky sunPosition={[100, 10, 100]} distance={1000} />
        <ambientLight layers={layers} intensity={0.1} />
        <directionalLight
          ref={setLight}
          layers={layers}
          position={[0, 50, 150]}
          intensity={1}
          shadow-bias={-0.001}
          shadow-mapSize={[4096, 4096]}
          shadow-camera-left={-150}
          shadow-camera-right={150}
          shadow-camera-top={150}
          shadow-camera-bottom={-150}
          castShadow
        />
        <PerspectiveCamera makeDefault={editor} fov={75} position={[0, 20, 20]} />
        <Physics broadphase="SAP" defaultContactMaterial={{ contactEquationRelaxation: 4, friction: 1e-3 }} allowSleep>
          <DebugScene>
            <Vehicle angularVelocity={[...angularVelocity]} position={[...position]} rotation={[...rotation]}>
              {light && <primitive object={light.target} />}
              <PerspectiveCamera makeDefault={!editor && camera !== 'BIRD_EYE'} fov={75} rotation={[0, Math.PI, 0]} position={[0, 10, -20]} />
              <OrthographicCamera makeDefault={!editor && camera === 'BIRD_EYE'} position={[0, 100, 0]} rotation={[(-1 * Math.PI) / 2, 0, Math.PI]} zoom={15} />
            </Vehicle>
            <Train />
            <Ramp args={[30, 6, 8]} position={[2, -1, 168.55]} rotation={[0, 0.49, Math.PI / 15]} />
            <Heightmap elementSize={0.5085} position={[327 - 66.5, -3.3, -473 + 213]} rotation={[-Math.PI / 2, 0, -Math.PI]} />
            <Goal args={[0.001, 10, 18]} onCollide={onStart} rotation={[0, 0.55, 0]} position={[-27, 1, 180]} />
            <Goal args={[0.001, 10, 18]} onCollide={onFinish} rotation={[0, -1.2, 0]} position={[-104, 1, -189]} />
            <Goal args={[0.001, 10, 18]} onCollide={onCheckpoint} rotation={[0, -1.2, 0]} position={[-104, 1, -189]} />
          </DebugScene>
        </Physics>
        <Track />
        <Environment files={'textures/dikhololo_night_1k.hdr'} />
        <ToggledMap />
        <ToggledOrbitControls />
      </Canvas>
      <Clock />
      <ToggledEditor />
      <ToggledFinished />
      <Help />
      <Speed />
      <ToggledStats />
      {<Checkpoint />}
      <LeaderBoard />
      <HideMouse />
      <Keyboard />
    </Intro>
  )
}
