import { MathUtils, PerspectiveCamera, Vector3 } from 'three'
import { useRef, useLayoutEffect, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PositionalAudio } from '@react-three/drei'
import { useRaycastVehicle } from '@react-three/cannon'
import { useSnapshot } from 'valtio'
import { Chassis } from './Chassis'
import { Wheel } from './Wheel'
import { Dust, Skid, Boost } from '../../effects'
import { gameState, mutation } from '../../store'

const { lerp } = MathUtils
const v = new Vector3()

export function Vehicle({ angularVelocity, children, position, rotation }) {
  const defaultCamera = useThree((state) => state.camera)
  const { editor, ready, raycast } = useSnapshot(gameState)
  const [vehicle, api] = useRaycastVehicle(() => gameState.raycast, null, [gameState.raycast])

  useLayoutEffect(() => {
    const sub1 = gameState.raycast.chassisBody.current.api.velocity.subscribe((velocity) =>
      Object.assign(mutation, { velocity, speed: v.set(...velocity).length() }),
    )
    const sub2 = api.sliding.subscribe((sliding) => (mutation.sliding = sliding))
    return () => void [sub1, sub2].forEach((sub) => sub())
  }, [editor])

  useLayoutEffect(() => {
    if (defaultCamera instanceof PerspectiveCamera) {
      defaultCamera.rotation.set(0, Math.PI, 0)
      defaultCamera.position.set(0, 10, -20)
      defaultCamera.lookAt(gameState.raycast.chassisBody.current.position)
      defaultCamera.rotation.x -= 0.3
      defaultCamera.rotation.z = Math.PI // resolves the weird spin in the beginning
    }
  }, [defaultCamera])

  let i = 0
  let steeringValue = 0
  let engineValue = 0
  let speed = 0
  let controls
  let boostValue = false
  let swayValue = 0

  useFrame((state, delta) => {
    speed = mutation.speed
    controls = gameState.controls
    const { force, maxBrake, steer, maxSpeed } = gameState.vehicleConfig

    engineValue = lerp(
      engineValue,
      controls.forward || controls.backward ? force * (controls.forward && !controls.backward ? (controls.boost ? -1.5 : -1) : 1) : 0,
      delta * 20,
    )
    steeringValue = lerp(steeringValue, controls.left || controls.right ? steer * (controls.left && !controls.right ? 1 : -1) : 0, delta * 20)
    for (i = 2; i < 4; i++) api.applyEngineForce(speed < maxSpeed ? engineValue : 0, i)
    for (i = 0; i < 2; i++) api.setSteeringValue(steeringValue, i)
    for (i = 2; i < 4; i++) api.setBrake(controls.brake ? (controls.forward ? maxBrake / 1.5 : maxBrake) : 0, i)

    if (!gameState.editor) {
      if (gameState.camera === 'FIRST_PERSON') v.set(0.3 + (Math.sin(-steeringValue) * speed) / 30, 0.4, -0.1)
      else if (gameState.camera === 'DEFAULT')
        v.set((Math.sin(steeringValue) * speed) / 2.5, 1.25 + (engineValue / 1000) * -0.5, -5 - speed / 15 + (controls.brake ? 1 : 0))

      // ctrl.left-ctrl.right, up-down, near-far
      defaultCamera.position.lerp(v, delta)

      // ctrl.left-ctrl.right swivel
      defaultCamera.rotation.z = lerp(defaultCamera.rotation.z, Math.PI + (-steeringValue * speed) / (gameState.camera === 'DEFAULT' ? 40 : 60), delta)
    }

    // lean chassis
    gameState.raycast.chassisBody.current.children[0].rotation.z = MathUtils.lerp(
      gameState.raycast.chassisBody.current.children[0].rotation.z,
      (-steeringValue * speed) / 200,
      delta * 4,
    )

    controls = gameState.controls
    // Camera sway
    const swaySpeed = controls.boost ? 60 : 30
    const startedBoosting = controls.boost && !boostValue
    boostValue = controls.boost
    const swayTarget = controls.boost ? (speed / maxSpeed) * 8 : (speed / maxSpeed) * 2
    swayValue = startedBoosting ? (speed / maxSpeed + 0.25) * 30 : MathUtils.lerp(swayValue, swayTarget, delta * (controls.boost ? 5 : 10))
    defaultCamera.rotation.z += (Math.sin(state.clock.elapsedTime * swaySpeed * 0.9) / 1000) * swayValue
    defaultCamera.rotation.x += (Math.sin(state.clock.elapsedTime * swaySpeed) / 1000) * swayValue

    // Vibrations
    gameState.raycast.chassisBody.current.children[0].rotation.x = (Math.sin(state.clock.getElapsedTime() * 20) * speed) / maxSpeed / 100
    gameState.raycast.chassisBody.current.children[0].rotation.z = (Math.cos(state.clock.getElapsedTime() * 20) * speed) / maxSpeed / 100
  })

  return (
    <group ref={vehicle}>
      <Chassis ref={raycast.chassisBody} {...{ angularVelocity, position, rotation }}>
        {ready && <VehicleAudio />}
        <Boost />
        {children}
      </Chassis>
      <Wheel ref={gameState.raycast.wheels[0]} leftSide />
      <Wheel ref={gameState.raycast.wheels[1]} />
      <Wheel ref={gameState.raycast.wheels[2]} leftSide />
      <Wheel ref={gameState.raycast.wheels[3]} />
      <Dust />
      <Skid />
    </group>
  )
}

function VehicleAudio() {
  const engineAudio = useRef()
  const boostAudio = useRef()
  const accelerateAudio = useRef()
  const honkAudio = useRef()
  const brakeAudio = useRef()

  let controls
  let speed = 0
  useFrame(() => {
    speed = mutation.speed
    controls = gameState.controls

    boostAudio.current.setVolume(gameState.sound ? (controls.boost ? Math.pow(speed / gameState.vehicleConfig.maxSpeed, 1.5) + 0.5 : 0) * 5 : 0)
    boostAudio.current.setPlaybackRate(Math.pow(speed / gameState.vehicleConfig.maxSpeed, 1.5) + 0.5)
    engineAudio.current.setVolume(gameState.sound ? 1 : 0)
    accelerateAudio.current.setVolume(gameState.sound ? (speed / gameState.vehicleConfig.maxSpeed) * 2 : 0)
    brakeAudio.current.setVolume(gameState.sound ? (controls.brake ? 1 : 0.5) : 0)

    if (gameState.sound) {
      if (controls.honk) {
        if (!honkAudio.current.isPlaying) honkAudio.current.play()
      } else honkAudio.current.isPlaying && honkAudio.current.stop()
      if (controls.brake && speed > 20) {
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
      <PositionalAudio ref={boostAudio} url="/sounds/boost.mp3" autoplay loop distance={5} />
      <PositionalAudio ref={accelerateAudio} url="/sounds/accelerate.mp3" autoplay loop distance={5} />
      <PositionalAudio ref={honkAudio} url="/sounds/honk.mp3" distance={10} />
      <PositionalAudio ref={brakeAudio} url="/sounds/tire-brake.mp3" distance={10} />
    </>
  )
}
