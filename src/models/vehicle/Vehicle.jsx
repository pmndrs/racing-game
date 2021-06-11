import * as THREE from 'three'
import { useRef, useLayoutEffect, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PositionalAudio } from '@react-three/drei'
import { useRaycastVehicle } from '@react-three/cannon'
import { Chassis } from './Chassis'
import { Wheel } from './Wheel'
import { Dust, Skid } from '../../effects'
import { useStore, mutation } from '../../store'

const v = new THREE.Vector3()

export function Vehicle({ angularVelocity = [0, 0.5, 0], children, position = [-110, 0.75, 220], rotation = [0, Math.PI / 2 + 0.35, 0] }) {
  const defaultCamera = useThree((state) => state.camera)
  const [ready, editor, raycast, camera, vehicleConfig, set] = useStore((s) => [s.ready, s.editor, s.raycast, s.camera, s.vehicleConfig, s.set])
  const { force, maxBrake, steer, maxSpeed } = vehicleConfig
  const [vehicle, api] = useRaycastVehicle(() => raycast, null, [raycast])

  useLayoutEffect(() => {
    const sub1 = raycast.chassisBody.current.api.velocity.subscribe((velocity) => Object.assign(mutation, { velocity, speed: v.set(...velocity).length() }))
    const sub2 = api.sliding.subscribe((sliding) => (mutation.sliding = sliding))
    return () => void [sub1, sub2].forEach((sub) => sub())
  }, [editor])

  useLayoutEffect(() => {
    if (defaultCamera instanceof THREE.PerspectiveCamera) {
      defaultCamera.rotation.set(0, Math.PI, 0)
      defaultCamera.position.set(0, 10, -20)
      defaultCamera.lookAt(raycast.chassisBody.current.position)
      defaultCamera.rotation.x -= 0.3
      defaultCamera.rotation.z = Math.PI // resolves the weird spin in the beginning
    }
  }, [defaultCamera])

  let i = 0
  let steeringValue = 0
  let engineValue = 0
  let speed = 0
  let ctrl

  useFrame((state, delta) => {
    speed = mutation.speed
    ctrl = useStore.getState().controls

    engineValue = THREE.MathUtils.lerp(
      engineValue,
      ctrl.forward || ctrl.backward ? force * (ctrl.forward && !ctrl.backward ? (ctrl.boost ? -1.5 : -1) : 1) : 0,
      delta * 20,
    )
    steeringValue = THREE.MathUtils.lerp(steeringValue, ctrl.left || ctrl.right ? steer * (ctrl.left && !ctrl.right ? 1 : -1) : 0, delta * 20)
    for (i = 2; i < 4; i++) api.applyEngineForce(speed < maxSpeed ? engineValue : 0, i)
    for (i = 0; i < 2; i++) api.setSteeringValue(steeringValue, i)
    for (i = 2; i < 4; i++) api.setBrake(ctrl.brake ? (ctrl.forward ? maxBrake / 1.5 : maxBrake) : 0, i)
    if (ctrl.reset) {
      raycast.chassisBody.current.api.position.set(...position)
      raycast.chassisBody.current.api.velocity.set(0, 0, 0)
      raycast.chassisBody.current.api.angularVelocity.set(...angularVelocity)
      raycast.chassisBody.current.api.rotation.set(...rotation)
      set((state) => ({ ...state, controls: { ...state.controls, reset: false } }))
    }

    if (!editor) {
      if (camera === 'FIRST_PERSON') v.set(0.3 + (Math.sin(-steeringValue) * speed) / 30, 0.4, -0.1)
      else if (camera === 'DEFAULT') v.set((Math.sin(steeringValue) * speed) / 2.5, 1.25 + (engineValue / 1000) * -0.5, -5 - speed / 15 + (ctrl.brake ? 1 : 0))
      // ctrl.left-ctrl.right, up-down, near-far
      defaultCamera.position.lerp(v, delta)
      // ctrl.left-ctrl.right swivel
      defaultCamera.rotation.z = THREE.MathUtils.lerp(defaultCamera.rotation.z, Math.PI + (-steeringValue * speed) / (camera === 'DEFAULT' ? 40 : 60), delta)
    }
    // lean chassis
    raycast.chassisBody.current.children[0].rotation.z = THREE.MathUtils.lerp(
      raycast.chassisBody.current.children[0].rotation.z,
      (-steeringValue * speed) / 200,
      delta * 4,
    )
    // Vibrations
    raycast.chassisBody.current.children[0].rotation.x = (Math.sin(state.clock.getElapsedTime() * 20) * speed) / vehicleConfig.maxSpeed / 100
    raycast.chassisBody.current.children[0].rotation.z = (Math.cos(state.clock.getElapsedTime() * 20) * speed) / vehicleConfig.maxSpeed / 100
  })

  return (
    <group ref={vehicle}>
      <Chassis ref={raycast.chassisBody} {...{ angularVelocity, position, rotation }}>
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
  const engineAudio = useRef()
  const accelerateAudio = useRef()
  const honkAudio = useRef()
  const brakeAudio = useRef()
  const [sound, vehicleConfig] = useStore((state) => [state.sound, state.vehicleConfig])

  let ctrl
  let speed = 0
  useFrame(() => {
    speed = mutation.speed
    ctrl = useStore.getState().controls
    engineAudio.current.setVolume(sound ? 1 : 0)
    accelerateAudio.current.setVolume(sound ? (speed / vehicleConfig.maxSpeed) * (ctrl.boost ? 3 : 2) : 0)
    brakeAudio.current.setVolume(sound ? (ctrl.brake ? 1 : 0.5) : 0)
    if (sound) {
      if (ctrl.honk) {
        if (!honkAudio.current.isPlaying) honkAudio.current.play()
      } else honkAudio.current.isPlaying && honkAudio.current.stop()
      if (ctrl.brake && speed > 20) {
        if (!brakeAudio.current.isPlaying) brakeAudio.current.play()
      } else brakeAudio.current.isPlaying && brakeAudio.current.stop()
    }
  })

  useEffect(() => {
    const engine = engineAudio.current
    const honk = honkAudio.current
    const brake = brakeAudio.current
    return () => [engine, honk, brake].forEach((sound) => sound.current && sound.current.isPlaying && sound.current.stop())
  }, [])

  return (
    <>
      <PositionalAudio ref={engineAudio} url="/sounds/engine.mp3" autoplay loop distance={5} />
      <PositionalAudio ref={accelerateAudio} url="/sounds/accelerate.mp3" autoplay loop distance={5} />
      <PositionalAudio ref={honkAudio} url="/sounds/honk.mp3" distance={10} />
      <PositionalAudio ref={brakeAudio} url="/sounds/tire-brake.mp3" distance={10} />
    </>
  )
}
