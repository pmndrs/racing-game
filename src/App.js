import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import { Sky, Environment, OrbitControls } from '@react-three/drei'
import { Editor } from './ui/Editor'
import { useStore } from './store'
import { Ground, Ramp, Track, Vehicle } from './models'
import { Overlay } from './ui/Overlay'
import { Speed } from './ui/Speed'
import { Help } from './ui/Help'
import { KeyboardControls } from './controls/KeyboardControls'

// Heightfield needs some more work ...
//import { Heightmap } from './utils/Heightmap'

export function App() {
  const playing = useStore((state) => state.playing)
  return (
    <Overlay>
      <Canvas dpr={[1, 1.5]} shadows camera={{ position: [0, 5, 15], fov: 50 }}>
        {playing ? <Game /> : <VehicleEditor />}
      </Canvas>
      {playing ? (
        <>
          <KeyboardControls />
          <Help />
          <Speed />
        </>
      ) : (
        <Editor />
      )}
    </Overlay>
  )
}

function VehicleEditor() {
  const vehicleStart = useStore((state) => state.constants.vehicleStart)
  return (
    <>
      <ambientLight intensity={0.1} />
      <Physics broadphase="SAP" contactEquationRelaxation={4} friction={1e-3} allowSleep>
        <Ground rotation={[-Math.PI / 2, 0, 0]} userData={{ id: 'floor' }} />
        <Vehicle {...vehicleStart} />
      </Physics>
      <Environment preset="night" />
      <OrbitControls />
    </>
  )
}

function Game() {
  const vehicleStart = useStore((state) => state.constants.vehicleStart)
  const [light, setLight] = useState()
  return (
    <>
      <fog attach="fog" args={['white', 0, 500]} />
      <Sky sunPosition={[100, 10, 100]} scale={1000} />
      <ambientLight intensity={0.1} />
      <directionalLight
        ref={setLight}
        position={[100, 100, 50]}
        intensity={1}
        castShadow
        shadow-bias={-0.001}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
      />
      <Physics broadphase="SAP" contactEquationRelaxation={4} friction={1e-3} allowSleep>
        <Ground rotation={[-Math.PI / 2, 0, 0]} userData={{ id: 'floor' }} />
        {/*<Heightmap
            elementSize={1.01} // uniform xy scale
            position={[337, -18.03, -451]}
            rotation={[-Math.PI / 2, 0, -Math.PI]}
          />*/}
        <Vehicle {...vehicleStart}>
          {/* Mount the main-lights target as a child to the vehicle, so that light follows it */}
          {light && <primitive object={light.target} />}
        </Vehicle>
        <Ramp position={[120, -1, -50]} />
      </Physics>
      <Track position={[80, 0, -210]} scale={26} />
      <Environment preset="night" />
    </>
  )
}
