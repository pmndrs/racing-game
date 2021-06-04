import * as THREE from 'three'
import { useRef, useLayoutEffect, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrthographicCamera, PositionalAudio } from '@react-three/drei'
import { useRaycastVehicle } from '@react-three/cannon'
import { Chassis } from './Chassis'
import { Wheel } from './Wheel'
import { useStore } from '../../store'
import { Dust } from '../../effects/Dust'
import { Skid } from '../../effects/Skid'

const v = new THREE.Vector3()

export function Vehicle({ children }) {
  const defaultCamera = useRef()
  const birdEyeCamera = useRef()

  const set = useStore((state) => state.set)
  const raycast = useStore((state) => state.raycast)
  const cameraType = useStore((state) => state.controls.cameraType)
  const { vehicleStart, vehicleConfig } = useStore((state) => state.constants)
  const ready = useStore((state) => state.ready)
  const [vehicle, api] = useRaycastVehicle(() => raycast)

  const { radius, force, maxBrake, steer, maxSpeed } = vehicleConfig

  useLayoutEffect(() => {
    defaultCamera.current.lookAt(raycast.chassisBody.current.position)
    defaultCamera.current.rotation.z = Math.PI // resolves the weird spin in the beginning
    // Subscriptions
    const vSub = raycast.chassisBody.current.api.velocity.subscribe((velocity) => set({ velocity, speed: v.set(...velocity).length() }))
    const sSub = api.sliding.subscribe((sliding) => set({ sliding }))
    return () => void [vSub, sSub].forEach((sub) => sub())
  }, [])

  useFrame((state, delta) => {
    const { speed, controls } = useStore.getState()
    const { forward, backward, left, right, brake, boost, reset } = controls

    //const dynamicSteer = // the higher the speed the less the car can turn
    const dynamicSteer = steer
    const engineValue = forward || backward ? force * (forward && !backward ? (boost ? -1.5 : -1) : 1) : 0

    for (let e = 2; e < 4; e++) api.applyEngineForce(speed < maxSpeed ? engineValue : 0, e)
    const steeringValue = left || right ? dynamicSteer * (left && !right ? 1 : -1) : 0
    for (let s = 0; s < 2; s++) api.setSteeringValue(steeringValue, s)
    for (let b = 2; b < 4; b++) api.setBrake(brake ? (forward ? maxBrake / 1.5 : maxBrake) : 0, b)
    if (reset) {
      raycast.chassisBody.current.api.position.set(...vehicleStart.position)
      raycast.chassisBody.current.api.velocity.set(0, 0, 0)
      raycast.chassisBody.current.api.angularVelocity.set(...vehicleStart.angularVelocity)
      raycast.chassisBody.current.api.rotation.set(...vehicleStart.rotation)
    }

    // left-right, up-down, near-far
    if (cameraType === 'FIRST_PERSON') {
      defaultCamera.current.position.lerp(v.set(0.3 + (Math.sin(-steeringValue) * speed) / 30, 0.7, 0.01), delta)
    } else if (cameraType === 'DEFAULT') {
      defaultCamera.current.position.lerp(
        v.set((Math.sin(steeringValue) * speed) / 2.5, 1.25 + (engineValue / 1000) * -0.5, -5 - speed / 15 + (brake ? 1 : 0)),
        delta,
      )
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
    <group ref={vehicle} position={[0, -0.4, 0]}>
      <Chassis ref={raycast.chassisBody} {...vehicleStart}>
        <PerspectiveCamera
          ref={defaultCamera}
          makeDefault={['DEFAULT', 'FIRST_PERSON'].includes(cameraType)}
          fov={75}
          rotation={[0, Math.PI, 0]}
          position={[0, 10, -20]}
        />
        <OrthographicCamera
          ref={birdEyeCamera}
          makeDefault={cameraType === 'BIRD_EYE'}
          position={[0, 100, 0]}
          rotation={[(-1 * Math.PI) / 2, 0, Math.PI]}
          zoom={15}
        />
        {ready && <VehicleAudio />}
        {children}
      </Chassis>
      <Wheel ref={raycast.wheels[0]} radius={radius} leftSide />
      <Wheel ref={raycast.wheels[1]} radius={radius} />
      <Wheel ref={raycast.wheels[2]} radius={radius} leftSide />
      <Wheel ref={raycast.wheels[3]} radius={radius} />
      <Dust />
      <Skid />
    </group>
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
    if (honk) {
      if (!honkAudio.current.isPlaying) honkAudio.current.play()
    } else honkAudio.current.stop()
    if ((state.sliding || brake) && state.speed > 5) {
      if (!brakeAudio.current.isPlaying) brakeAudio.current.play()
    } else brakeAudio.current.stop()
  })

  useEffect(() => {
    const engine = engineAudio.current
    const honk = honkAudio.current
    const brake = brakeAudio.current
    return () => void [engine, honk, brake].forEach((sound) => sound.stop)
  }, [])

  return (
    <>
      <PositionalAudio ref={engineAudio} url="/sounds/engine.mp3" loop distance={5} />
      <PositionalAudio ref={honkAudio} url="/sounds/honk.mp3" loop distance={10} />
      <PositionalAudio ref={brakeAudio} url="/sounds/tire-brake.mp3" loop distance={10} />
    </>
  )
}
