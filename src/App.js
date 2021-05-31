import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics, usePlane } from '@react-three/cannon'
import { Sky, Environment } from '@react-three/drei'
import { Track } from './models/Track'
import Vehicle from './Vehicle'

export default function App() {
  return (
    <>
      <Canvas dpr={[1, 1.5]} shadows camera={{ position: [0, 5, 15], near: 1, far: 200, fov: 50 }}>
        <fog attach="fog" args={['white', 0, 350]} />
        <Sky sunPosition={[100, 10, 100]} scale={1000} />
        <ambientLight intensity={0.1} />
        <Suspense fallback={null}>
          <Physics broadphase="SAP" contactEquationRelaxation={4} friction={1e-3} allowSleep>
            <Plane rotation={[-Math.PI / 2, 0, 0]} userData={{ id: 'floor' }} />
            <Vehicle rotation={[0, Math.PI / 2, 0]} position={[0, 2, 0]} angularVelocity={[0, 0.5, 0]} wheelRadius={0.3} />
          </Physics>
          <Track position={[80, 0, -170]} rotation={[0, 0, 0]} scale={20} />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </>
  )
}

function Plane(props) {
  const [ref] = usePlane(() => ({ type: 'Static', material: 'ground', ...props }))
  return null
}
