import { useState, useRef, useEffect } from 'react'
import { Layers } from 'three'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import { Sky, Environment, OrbitControls, Stats } from '@react-three/drei'
import { Editor } from './ui/Editor'
import { useStore } from './store'
import { levelLayer } from './enums'
import { Ramp, Track, Vehicle } from './models'
import { Heightmap } from './models/track/Heightmap'
import { Overlay } from './ui/Overlay'
import { Speed } from './ui/Speed'
import { Help } from './ui/Help'
import { Minimap } from './ui/Minimap'
import { KeyboardControls } from './controls/KeyboardControls'
import { InactiveMouse } from './controls/Inactivemouse'
import { CheatCodes } from './utils/CheatCodes'

const layers = new Layers()
layers.enable(levelLayer)

export function App() {
  const [light, setLight] = useState()
  const editor = useStore((state) => state.editor)
  const stats = useStore((state) => state.stats)
  const gravity = useStore((state) => state.gravity)

  return (
    <Overlay>
      <Canvas dpr={[1, 1.5]} shadows camera={{ position: [0, 5, 15], fov: 50 }}>
        <fog attach="fog" args={['white', 0, 500]} />
        <Sky sunPosition={[100, 10, 100]} scale={1000} />
        <ambientLight layers={layers} intensity={0.1} />
        <directionalLight
          ref={setLight}
          layers={layers}
          position={[100, 100, 50]}
          intensity={1}
          shadow-bias={-0.001}
          shadow-mapSize={[4096, 4096]}
          shadow-camera-left={-150}
          shadow-camera-right={150}
          shadow-camera-top={150}
          shadow-camera-bottom={-150}
          castShadow
        />
        {/* DYNAMIC GRAVITY PENDING ON https://github.com/pmndrs/use-cannon/issues/126 */}
        <Physics broadphase="SAP" contactEquationRelaxation={4} friction={1e-3} allowSleep gravity={[0, gravity, 0]}>
          <Heightmap elementSize={1 / 2} position={[335.8, -20.1, -465.5]} rotation={[-Math.PI / 2, 0, -Math.PI]} />
          <Vehicle>
            {/* Mount the main-lights target as a child to the vehicle, so that light follows it */}
            {light && <primitive object={light.target} />}
          </Vehicle>
          <Ramp args={[30, 6, 5]} position={[110, -0.5, -45]} rotation={[0, 0.45, Math.PI / 16]} />
        </Physics>
        <Track position={[80, -0.1, -210]} scale={26} />
        <Minimap />
        <Environment preset="night" />
        {editor && <OrbitControls />}
      </Canvas>
      <Speed />
      <Help />
      <KeyboardControls />
      <CheatCodes />
      <InactiveMouse />
      {editor && <Editor />}
      {stats && <Stats />}
    </Overlay>
  )
}
