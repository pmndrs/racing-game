import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics, usePlane, useBox } from '@react-three/cannon'
import { Sky, Environment, Loader } from '@react-three/drei'
import { Track } from './models/Track'
import { Vehicle } from './models/Vehicle'
import { Overlay } from './ui/Overlay'
import { Speed } from './ui/Speed'
import { Controls } from './ui/Controls'
import { useStore } from './utils/store'

export function App() {
  const vehicleStart = useStore((state) => state.constants.vehicleStart)
  return (
    <Overlay>
      <Canvas dpr={[1, 1.5]} shadows camera={{ position: [0, 5, 15], fov: 50 }}>
        <fog attach="fog" args={['white', 0, 500]} />
        <Sky sunPosition={[100, 10, 100]} scale={1000} />
        <ambientLight intensity={0.1} />
        <Physics broadphase="SAP" contactEquationRelaxation={4} friction={1e-3} allowSleep>
          <Plane rotation={[-Math.PI / 2, 0, 0]} userData={{ id: 'floor' }} />
          <Vehicle {...vehicleStart} />
          <Ramp position={[120, -1, -50]} />
        </Physics>
        <Track position={[80, 0, -210]} scale={26} />
        <Environment preset="night" />
      </Canvas>
      <Controls />
      <Speed />
    </Overlay>
  )
}

function Plane(props) {
  const [ref] = usePlane(() => ({ type: 'Static', material: 'ground', ...props }))
  return null
}

function Ramp({ args = [10, 2.5, 3], rotation = [0, 0.45, Math.PI / 11], ...props }) {
  const [ref] = useBox(() => ({ type: 'Static', args, rotation, ...props }))
  return (
    <mesh ref={ref}>
      <boxGeometry args={args} />
      <meshStandardMaterial color="indianred" />
    </mesh>
  )
}
