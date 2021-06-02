import * as THREE from 'three'
import { useRef, useState, useLayoutEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { useRaycastVehicle } from '@react-three/cannon'
import { Chassis } from './Chassis'
import { Wheel } from './Wheel'
import { useStore } from '../utils/store'
import { Dust } from '../effects/Dust'

const v = new THREE.Vector3()
const cameraPositionTarget = new THREE.Vector3()
const cameraLookAtPosition = new THREE.Vector3()
const cameraLookAtTarget = new THREE.Vector3()
const cameraTarget = new THREE.Object3D()
const cameraDistance = -5
const cameraDamping = 5

export function Vehicle(props) {
  const camera = useRef()
  const [light, setLight] = useState()
  const set = useStore((state) => state.set)
  const config = useStore((state) => state.config)
  const raycast = useStore((state) => state.raycast)
  const [vehicle, api] = useRaycastVehicle(() => raycast)

  useLayoutEffect(() => {
    raycast.chassisBody.current.getWorldPosition(cameraLookAtPosition)
    raycast.chassisBody.current.getWorldPosition(cameraLookAtTarget)
    cameraLookAtPosition.copy(raycast.chassisBody.current.position)
    raycast.chassisBody.current.add(cameraTarget)
    cameraTarget.position.set(0, 2, cameraDistance)

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
      raycast.chassisBody.current.api.position.set(0, 0.5, 0)
      raycast.chassisBody.current.api.velocity.set(0, 0, 0)
      raycast.chassisBody.current.api.angularVelocity.set(0, 0.5, 0)
      raycast.chassisBody.current.api.rotation.set(0, -Math.PI / 4, 0)
    }

    raycast.chassisBody.current.getWorldPosition(cameraLookAtPosition)
    cameraLookAtTarget.lerp(cameraLookAtPosition, delta * cameraDamping)
    camera.current.lookAt(cameraLookAtTarget)

    cameraTarget.position.z = cameraDistance - speed / 50
    cameraTarget.getWorldPosition(cameraPositionTarget)
    camera.current.position.lerp(cameraPositionTarget, delta * cameraDamping)

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
      <PerspectiveCamera ref={camera} makeDefault fov={75} rotation={[0, Math.PI, 0]} position={[0, 10, -20]} />
      <group ref={vehicle} position={[0, -0.4, 0]}>
        <Chassis ref={raycast.chassisBody} rotation={props.rotation} position={props.position} angularVelocity={props.angularVelocity}>
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
