import * as THREE from 'three'
import { useRef, useState, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrthographicCamera,PositionalAudio } from '@react-three/drei'
import { useRaycastVehicle } from '@react-three/cannon'
import { Chassis } from './Chassis'
import { Wheel } from './Wheel'
import { useStore } from '../utils/store'
import { Dust } from '../effects/Dust'

const v = new THREE.Vector3()

export function Vehicle(props) {
  const defaultCamera = useRef()
  const birdEyeCamera = useRef()

  const [light, setLight] = useState()
  const set = useStore((state) => state.set)
  const config = useStore((state) => state.config)
  const raycast = useStore((state) => state.raycast)
  const {cameraType} = useStore((state) => state.controls)
  const vehicleStart = useStore((state) => state.constants.vehicleStart)
  const [vehicle, api] = useRaycastVehicle(() => raycast)

  useLayoutEffect(() => {
    defaultCamera.current.lookAt(raycast.chassisBody.current.position)
    defaultCamera.current.rotation.z = Math.PI // resolves the weird spin in the beginning
    // Subscriptions
    const vSub = raycast.chassisBody.current.api.velocity.subscribe((velocity) => set({ velocity, speed: v.set(...velocity).length() }))
    const sSub = api.sliding.subscribe((sliding) => set({ sliding }))
    return () => {
      vSub()
      sSub()
    }
  }, [])

  useFrame((state, delta) => {
    const speed = useStore.getState().speed
    const { forward, backward, left, right, brake, reset } = useStore.getState().controls
    const { force, maxBrake, steer } = config

    const engineValue = forward || backward ? force * (forward && !backward ? -1 : 1) : 0
    for (let e = 2; e < 4; e++) api.applyEngineForce(engineValue, e)
    const steeringValue = left || right ? steer * (left && !right ? 1 : -1) : 0
    for (let s = 0; s < 2; s++) api.setSteeringValue(steeringValue, s)
    for (let b = 2; b < 4; b++) api.setBrake(brake ? (forward ? maxBrake / 1.5 : maxBrake) : 0, b)
    if (reset) {
      raycast.chassisBody.current.api.position.set(vehicleStart.position[0], vehicleStart.position[1], vehicleStart.position[2])
      raycast.chassisBody.current.api.velocity.set(0, 0, 0)
      raycast.chassisBody.current.api.angularVelocity.set(vehicleStart.angularVelocity[0], vehicleStart.angularVelocity[1], vehicleStart.angularVelocity[2])
      raycast.chassisBody.current.api.rotation.set(vehicleStart.rotation[0], vehicleStart.rotation[1], vehicleStart.rotation[2])
    }

    if (cameraType === 'FIRST_PERSON') {
      defaultCamera.current.position.lerp(v.set(0.3 + (Math.sin(-steeringValue) * speed) / 30, 0.7, 0.01), delta)
    } else if(cameraType === 'DEFAULT') {
      // left-right, up-down, near-far
      defaultCamera.current.position.lerp(v.set((Math.sin(steeringValue) * speed) / 2.5, 1.25 + (engineValue / 1000) * -0.5, -5 - speed / 15 + (brake ? 1 : 0)), delta)

      
    }

          // left-right swivel
    defaultCamera.current.rotation.z = THREE.MathUtils.lerp(defaultCamera.current.rotation.z, Math.PI + (-steeringValue * speed) / 45, delta)

    // lean chassis
    raycast.chassisBody.current.children[0].rotation.z = THREE.MathUtils.lerp(
      raycast.chassisBody.current.children[0].rotation.z,
      (-steeringValue * speed) / 200,
      delta * 4,
    )
  })

  return (
    <>
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
      <group ref={vehicle} position={[0, -0.4, 0]}>
        <Chassis ref={raycast.chassisBody} rotation={props.rotation} position={props.position} angularVelocity={props.angularVelocity}>
          <PerspectiveCamera ref={defaultCamera} makeDefault={['DEFAULT', 'FIRST_PERSON'].includes(cameraType)} fov={75} rotation={[0, Math.PI, 0]} position={[0, 10, -20]} />
          <OrthographicCamera ref={birdEyeCamera} makeDefault={cameraType === 'BIRD_EYE'} position={[0, 100, 0]} rotation={[-1 * Math.PI / 2, 0, Math.PI]} zoom={15} />
          {light && <primitive object={light.target} />}
          <VehicleAudio />
        </Chassis>
        <Wheel ref={raycast.wheels[0]} radius={config.radius} leftSide />
        <Wheel ref={raycast.wheels[1]} radius={config.radius} />
        <Wheel ref={raycast.wheels[2]} radius={config.radius} leftSide />
        <Wheel ref={raycast.wheels[3]} radius={config.radius} />
        <Dust />
      </group>
    </>
  )
}

function VehicleAudio() {
  const engineAudio = useRef()
  const honkAudio = useRef()
  const brakeAudio = useRef()
  useFrame(() => {
    const state = useStore.getState()
    const { honk, brake } = state.controls
    engineAudio.current.setVolume((0.4 * state.speed) / 50)
    brakeAudio.current.setVolume(brake ? 1 : 0.2)
    honkAudio.current[honk ? 'play' : 'stop']()
    brakeAudio.current[(state.sliding || brake) && state.speed > 5 ? 'play' : 'stop']()
  })
  return (
    <>
      <PositionalAudio ref={engineAudio} url="/sounds/engine.mp3" loop distance={5} />
      <PositionalAudio ref={honkAudio} url="/sounds/honk.mp3" loop distance={10} />
      <PositionalAudio ref={brakeAudio} url="/sounds/tire-brake.mp3" loop distance={10} />
    </>
  )
}
