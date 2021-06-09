import { useState, useMemo } from 'react'
import { Layers } from 'three'
import { Canvas } from '@react-three/fiber'
import { Physics, Debug } from '@react-three/cannon'
import { Sky, Environment, OrbitControls, Stats } from '@react-three/drei'
import { useStore, levelLayer } from './store'
import { Heightmap, Ramp, Track, Vehicle } from './models'
import { Editor, Help, Minimap, Overlay, Speed } from './ui'
import { HideMouse, KeyboardControls } from './controls'

const layers = new Layers()
layers.enable(levelLayer)

function ConditionalDebug({ children }) {
  const debug = useStore((state) => state.debug)
  return debug ? (
    <Debug scale={1.0001} color="white">
      {children}
    </Debug>
  ) : (
    children
  )
}

export function App() {
  const [light, setLight] = useState()
  const editor = useStore((state) => state.editor)
  const stats = useStore((state) => state.stats)
  const map = useStore((state) => state.map)

  return (
    <Overlay>
      <Canvas mode="concurrent" dpr={[1, 1.5]} shadows camera={{ position: [0, 5, 15], fov: 50 }}>
        <fog attach="fog" args={['white', 0, 500]} />
        <Sky sunPosition={[100, 10, 100]} scale={1000} />
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
        <Physics broadphase="SAP" contactEquationRelaxation={4} friction={1e-3} allowSleep>
          <ConditionalDebug>
            <Heightmap elementSize={1 / 2} position={[327.2 - 80, -20.1, -473.5 + 210]} rotation={[-Math.PI / 2, 0, -Math.PI]} />
            <Vehicle>
              {/* Mount the main-lights target as a child to the vehicle, so that light follows it */}
              {light && <primitive object={light.target} />}
            </Vehicle>
            <Ramp args={[30, 6, 6]} position={[5, -1, 165]} rotation={[0, 0.45, Math.PI / 15]} />
            <Track position={[0, -0.1, 0]} />
          </ConditionalDebug>
        </Physics>
        <Environment preset="night" />
        {map && <Minimap />}
        {editor && <OrbitControls />}
      </Canvas>
      <Speed />
      <Help />
      <KeyboardControls />
      <HideMouse />
      {editor && <Editor />}
      {stats && <Stats />}
    </Overlay>
  )
}
