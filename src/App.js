import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import { Sky, Environment } from '@react-three/drei'

import { Track } from './models/Track'
import { Vehicle } from './models/Vehicle'
import { Speed } from './ui/Speed'
import { Controls } from './ui/Controls'
import { Heightfield } from './utils/terrain'

export function App() {
  return (
    <>
      <Canvas dpr={[1, 1.5]} shadows camera={{ position: [0, 5, 15], fov: 50 }}>
        <fog attach="fog" args={['white', 0, 500]} />
        <Sky sunPosition={[100, 10, 100]} scale={1000} />
        <ambientLight intensity={0.1} />
        <Suspense fallback={null}>
          <Physics broadphase="SAP" contactEquationRelaxation={4} friction={1e-3} allowSleep>
            <Vehicle rotation={[0, Math.PI / 2, 0]} position={[80, 20, 100]} angularVelocity={[0, 0.5, 0]} wheelRadius={0.3} />
            <Heightfield
              elementSize={524 / 512}
              position={[260, -7, -260]} // Tweaking these values may be necessary on updates to heightmap
              rotation={[-Math.PI / 2, 0, Math.PI]}
            />
          </Physics>
          <Track scale={26} />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
      <Controls />
      <Speed />
    </>
  )
}
