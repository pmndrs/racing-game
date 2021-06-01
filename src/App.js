import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics, usePlane } from '@react-three/cannon'
import { Sky, Environment, OrbitControls } from '@react-three/drei'
import { Track } from './models/Track'
import { Vehicle } from './models/Vehicle'
import { Speed } from './ui/Speed'
import { Heightfield } from './utils/terrain'
import { useControls } from "leva"

const scale = 512


export function App() {
  const {position} = useControls({position: [0,0,0]})
  return (
    <>
      <Canvas dpr={[1, 1.5]} shadows camera={{ position: [0, 5, 15], fov: 50 }}>
        {/* <fog attach="fog" args={['white', 0, 500]} /> */}
        <Sky sunPosition={[100, 10, 100]} scale={1000} />
        <ambientLight intensity={0.1} />
        <Suspense fallback={null}>
          <Physics broadphase="SAP" contactEquationRelaxation={4} friction={1e-3} allowSleep>
            {/* <Vehicle rotation={[0, Math.PI / 2, 0]} position={[80, -20, -210]} angularVelocity={[0, 0.5, 0]} wheelRadius={0.3} /> */}
            <Heightfield
              elementSize={(scale * 1) / 512}
              position={[0, 0, 0]}
              rotation={[-Math.PI / 2, 0, Math.PI]}
              scale={[1, 1, 1]}
            />
          </Physics>
          <Track position={position} scale={26} />
          <Environment preset="night" />
        </Suspense>
        <OrbitControls />
      </Canvas>
      <Controls />
      <Speed />
    </>
  )
}
