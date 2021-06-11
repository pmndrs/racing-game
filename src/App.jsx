import { useState } from 'react'
import { Layers } from 'three'
import { Canvas } from '@react-three/fiber'
import { Physics, Debug } from '@react-three/cannon'
import { Sky, Environment, PerspectiveCamera, OrthographicCamera, OrbitControls } from '@react-three/drei'
import { useStore, levelLayer } from './store'
import { Ramp, Track, Vehicle, Goal } from './models'
import { HUD, Minimap, Overlay } from './ui'
import { Controls } from './controls'

const layers = new Layers()
layers.enable(levelLayer)

function DebugScene({ children }) {
  const debug = useStore((state) => state.debug)
  return debug ? <Debug scale={1.0001} color="white" children={children} /> : children
}

export function App() {
  const [light, setLight] = useState()
  const [shadows, dpr, camera, editor, map] = useStore((s) => [s.shadows, s.dpr, s.camera, s.editor, s.map])
  return (
    <Overlay>
      <Canvas key={shadows + dpr} mode="concurrent" dpr={[1, dpr]} shadows={shadows} camera={{ position: [0, 5, 15], fov: 50 }}>
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
        <PerspectiveCamera makeDefault={editor} fov={75} position={[0, 20, 20]} />
        <Physics broadphase="SAP" contactEquationRelaxation={4} friction={1e-3} allowSleep>
          <DebugScene>
            <Vehicle>
              {light && <primitive object={light.target} />}
              <PerspectiveCamera makeDefault={!editor && camera !== 'BIRD_EYE'} fov={75} rotation={[0, Math.PI, 0]} position={[0, 10, -20]} />
              <OrthographicCamera makeDefault={!editor && camera === 'BIRD_EYE'} position={[0, 100, 0]} rotation={[(-1 * Math.PI) / 2, 0, Math.PI]} zoom={15} />
            </Vehicle>
            <Ramp args={[30, 6, 6]} position={[5, -1, 165]} rotation={[0, 0.45, Math.PI / 15]} />
            <Track position={[0, 0, 0]} />
            <Goal start args={[0.001, 10, 18]} rotation={[0, 0.55, 0]} position={[-27, 1, 180]} />
            <Goal args={[0.001, 10, 18]} rotation={[0, -1.2, 0]} position={[-104, 1, -189]} />
          </DebugScene>
        </Physics>
        <Environment files={'textures/dikhololo_night_1k.hdr'} />
        {map && <Minimap />}
        {editor && <OrbitControls />}
      </Canvas>
      <HUD />
      <Controls />
    </Overlay>
  )
}
