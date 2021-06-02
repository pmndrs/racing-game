import * as THREE from 'three'
import { useRef, useState, useLayoutEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { useRaycastVehicle } from '@react-three/cannon'
import { Chassis } from './Chassis'
import { Wheel } from './Wheel'
import { useStore } from '../utils/store'
import { Dust } from '../effects/Dust'
import { vehicleStart } from '../constants'

const v = new THREE.Vector3()

export function Vehicle(props) {
  const camera = useRef()
  const [light, setLight] = useState()
  const set = useStore((state) => state.set)
  const config = useStore((state) => state.config)
  const raycast = useStore((state) => state.raycast)
  const [vehicle, api] = useRaycastVehicle(() => raycast)

  useLayoutEffect(() => {
    // Look at is causing the weird spin in the beginning
    camera.current.lookAt(raycast.chassisBody.current.position)
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
    api.applyEngineForce(engineValue, 2)
    const steeringValue = left || right ? steer * (left && !right ? 1 : -1) : 0
    for (let s = 0; s < 2; s++) api.setSteeringValue(steeringValue, s)
    for (let b = 2; b < 4; b++) api.setBrake(brake ? (forward ? maxBrake / 1.5 : maxBrake) : 0, b)
    if (reset) {
      raycast.chassisBody.current.api.position.set(vehicleStart.position[0], vehicleStart.position[1], vehicleStart.position[2])
      raycast.chassisBody.current.api.velocity.set(0, 0, 0)
      raycast.chassisBody.current.api.angularVelocity.set(vehicleStart.angularVelocity[0], vehicleStart.angularVelocity[1], vehicleStart.angularVelocity[2])
      raycast.chassisBody.current.api.rotation.set(vehicleStart.rotation[0], vehicleStart.rotation[1], vehicleStart.rotation[2])
    }

    // left-right, up-down, near-far
    camera.current.position.lerp(
      v.set((Math.sin(steeringValue) * speed) / 2.5, 1.25 + (engineValue / 1000) * -0.5, -5 - speed / 15 + (brake ? 1 : 0)),
      delta,
    )
    // left-right swivel
    camera.current.rotation.z = THREE.MathUtils.lerp(camera.current.rotation.z, Math.PI + (-steeringValue * speed) / 45, delta)
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
          <PerspectiveCamera ref={camera} makeDefault fov={75} rotation={[0, Math.PI, 0]} position={[0, 10, -20]} />
          {light && <primitive object={light.target} />}
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
