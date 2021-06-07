import * as THREE from 'three'
import { useRef, useLayoutEffect, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrthographicCamera, PositionalAudio } from '@react-three/drei'
import { useRaycastVehicle } from '@react-three/cannon'
import { Chassis } from './Chassis'
import { Wheel } from './Wheel'
import { useStore } from '../../store'
import { Dust, Skid } from '../../effects'

const v = new THREE.Vector3()

export function Vehicle({ angularVelocity = [0, 0.5, 0], children, position = [-115, 0.5, 220], rotation = [0, Math.PI / 2 + 0.5, 0] }) {
  const defaultCamera = useRef()
  const birdEyeCamera = useRef()

  const set = useStore((state) => state.set)
  const editor = useStore((state) => state.editor)
  const raycast = useStore((state) => state.raycast)
  const camera = useStore((state) => state.camera)
  const { force, maxBrake, steer, maxSpeed } = useStore((state) => state.vehicleConfig)
  const ready = useStore((state) => state.ready)
  const [vehicle, api] = useRaycastVehicle(() => raycast, null, [raycast])

  useLayoutEffect(() => {
    defaultCamera.current.rotation.set(0, Math.PI, 0)
    defaultCamera.current.position.set(0, 10, -20)
    defaultCamera.current.lookAt(raycast.chassisBody.current.position)
    defaultCamera.current.rotation.z = Math.PI // resolves the weird spin in the beginning
    // Subscriptions
    const vSub = raycast.chassisBody.current.api.velocity.subscribe((velocity) => set({ velocity, speed: v.set(...velocity).length() }))
    const sSub = api.sliding.subscribe((sliding) => set({ sliding }))
    return () => void [vSub, sSub].forEach((sub) => sub())
  }, [editor])

  let steeringValue = 0
  let engineValue = 0

  useFrame((state, delta) => {
    const { speed, controls } = useStore.getState()
    const { forward, backward, left, right, brake, boost, reset } = controls

    engineValue = THREE.MathUtils.lerp(engineValue, forward || backward ? force * (forward && !backward ? (boost ? -1.5 : -1) : 1) : 0, delta * 20)
    steeringValue = THREE.MathUtils.lerp(steeringValue, left || right ? steer * (left && !right ? 1 : -1) : 0, delta * 20)
    for (let e = 2; e < 4; e++) api.applyEngineForce(speed < maxSpeed ? engineValue : 0, e)
    for (let s = 0; s < 2; s++) api.setSteeringValue(steeringValue, s)
    for (let b = 2; b < 4; b++) api.setBrake(brake ? (forward ? maxBrake / 1.5 : maxBrake) : 0, b)
    if (reset) {
      raycast.chassisBody.current.api.position.set(...position)
      raycast.chassisBody.current.api.velocity.set(0, 0, 0)
      raycast.chassisBody.current.api.angularVelocity.set(...angularVelocity)
      raycast.chassisBody.current.api.rotation.set(...rotation)
    }

    if (!editor) {
      if (camera === 'FIRST_PERSON') v.set(0.3 + (Math.sin(-steeringValue) * speed) / 30, 0.5, 0.01)
      else if (camera === 'DEFAULT') v.set((Math.sin(steeringValue) * speed) / 2.5, 1.25 + (engineValue / 1000) * -0.5, -5 - speed / 15 + (brake ? 1 : 0))
      // left-right, up-down, near-far
      defaultCamera.current.position.lerp(v, delta)
      // left-right swivel
      defaultCamera.current.rotation.z = THREE.MathUtils.lerp(
        defaultCamera.current.rotation.z,
        Math.PI + (-steeringValue * speed) / (camera === 'DEFAULT' ? 40 : 60),
        delta,
      )
    }

    // lean chassis
    raycast.chassisBody.current.children[0].rotation.z = THREE.MathUtils.lerp(
      raycast.chassisBody.current.children[0].rotation.z,
      (-steeringValue * speed) / 200,
      delta * 4,
    )
  })

  return (
    <group ref={vehicle}>
      <Chassis ref={raycast.chassisBody} {...{ angularVelocity, position, rotation }}>
        <PerspectiveCamera ref={defaultCamera} makeDefault={camera !== 'BIRD_EYE'} fov={75} rotation={[0, Math.PI, 0]} position={[0, 10, -20]} />
        <OrthographicCamera
          ref={birdEyeCamera}
          makeDefault={camera === 'BIRD_EYE'}
          position={[0, 100, 0]}
          rotation={[(-1 * Math.PI) / 2, 0, Math.PI]}
          zoom={15}
        />
        {ready && <VehicleAudio />}
        {children}
      </Chassis>
      <Wheel ref={raycast.wheels[0]} leftSide />
      <Wheel ref={raycast.wheels[1]} />
      <Wheel ref={raycast.wheels[2]} leftSide />
      <Wheel ref={raycast.wheels[3]} />
      <Dust />
      <Skid />
    </group>
  )
}

function VehicleAudio() {
  const raycast = useStore((state) => state.raycast)
  const engineAudio = useRef()
  const accelerateAudio = useRef()
  const honkAudio = useRef()
  const brakeAudio = useRef()
  const rightRearWheel = raycast.wheels[2].current
  const leftRearWheel = raycast.wheels[3].current

  useFrame(() => {
    const state = useStore.getState()
    const { honk, brake, boost } = state.controls
    engineAudio.current.setVolume(1)
    accelerateAudio.current.setVolume((state.speed / state.vehicleConfig.maxSpeed) * (boost ? 3 : 2))
    brakeAudio.current.setVolume(brake ? 1 : 0.5)
    if (honk) {
      if (!honkAudio.current.isPlaying) honkAudio.current.play()
    } else honkAudio.current.isPlaying && honkAudio.current.stop()
    if ((state.sliding || brake) && state.speed > 5 && rightRearWheel.position.y < 0.29 && leftRearWheel.position.y < 0.29) {
      if (!brakeAudio.current.isPlaying) brakeAudio.current.play()
    } else brakeAudio.current.isPlaying && brakeAudio.current.stop()
  })

  useEffect(() => {
    const engine = engineAudio.current
    const honk = honkAudio.current
    const brake = brakeAudio.current
    return () =>
      [engine, honk, brake].forEach((sound) => {
        if (sound.current && sound.current.isPlaying) sound.current.stop()
      })
  }, [])

  return (
    <>
      <PositionalAudio ref={engineAudio} url="/sounds/engine.mp3" autoplay loop distance={5} />
      <PositionalAudio ref={accelerateAudio} url="/sounds/accelerate.mp3" autoplay loop distance={5} />
      <PositionalAudio ref={honkAudio} url="/sounds/honk.mp3" loop distance={10} />
      <PositionalAudio ref={brakeAudio} url="/sounds/tire-brake.mp3" loop distance={10} />
    </>
  )
}
