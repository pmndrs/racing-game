import * as THREE from 'three'
import { useRef, useEffect, useState, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { useRaycastVehicle } from '@react-three/cannon'
import { Chassis } from './models/Chassis'
import { Wheel } from './models/Wheel'
import { useStore } from './utils/store'

const vec = new THREE.Vector3()

function Vehicle({ radius = 0.7, width = 1.2, height = -0.04, front = 1.3, back = -1.15, steer = 0.5, force = 3500, maxBrake = 75, ...props }) {
  const set = useStore((state) => state.set)

  const chassis = useRef()
  const camera = useRef()
  const wheel1 = useRef()
  const wheel2 = useRef()
  const wheel3 = useRef()
  const wheel4 = useRef()

  const wheelInfo = {
    radius,
    directionLocal: [0, -1, 0],
    suspensionStiffness: 30,
    suspensionRestLength: 0.3,
    axleLocal: [-1, 0, 0],
    chassisConnectionPointLocal: [1, 0, 1],
    useCustomSlidingRotationalSpeed: true,
    customSlidingRotationalSpeed: -0.1,
    frictionSlip: 1.5,
    sideAcceleration: 2
  }

  const wheelInfo1 = { ...wheelInfo, isFrontWheel: true, chassisConnectionPointLocal: [-width / 2, height, front] }
  const wheelInfo2 = { ...wheelInfo, isFrontWheel: true, chassisConnectionPointLocal: [width / 2, height, front] }
  const wheelInfo3 = { ...wheelInfo, isFrontWheel: false, chassisConnectionPointLocal: [-width / 2, height, back] }
  const wheelInfo4 = { ...wheelInfo, isFrontWheel: false, chassisConnectionPointLocal: [width / 2, height, back] }

  const [vehicle, api] = useRaycastVehicle(() => ({
    chassisBody: chassis,
    wheels: [wheel1, wheel2, wheel3, wheel4],
    wheelInfos: [wheelInfo1, wheelInfo2, wheelInfo3, wheelInfo4],
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1
  }))

  const velocity = useRef(0)
  useEffect(() => {
    console.log(chassis.current.api)

    const vSub = chassis.current.api.velocity.subscribe((current) => set({ velocity: vec.set(...current).length() }))
    return () => {
      vSub()
    }
  }, [])

  const t = new THREE.Vector3()
  const p = new THREE.Vector3()
  const m = new THREE.Matrix4()
  const o = new THREE.Object3D()
  const q = new THREE.Quaternion()

  const target = useRef()
  useFrame((state, delta) => {
    const velocity = useStore.getState().velocity
    const { forward, backward, left, right, brake, reset } = useStore.getState().controls

    const engineValue = forward || backward ? force * (forward && !backward ? -1 : 1) : 0
    for (let e = 2; e < 4; e++) api.applyEngineForce(engineValue, 2)
    const steeringValue = left || right ? steer * (left && !right ? 1 : -1) : 0
    for (let s = 0; s < 2; s++) api.setSteeringValue(steeringValue, s)
    for (let b = 2; b < 4; b++) api.setBrake(brake ? maxBrake : 0, b)
    if (reset) {
      chassis.current.api.position.set(0, 0.5, 0)
      chassis.current.api.velocity.set(0, 0, 0)
      chassis.current.api.angularVelocity.set(0, 0.5, 0)
      chassis.current.api.rotation.set(0, -Math.PI / 4, 0)
    }

    camera.current.position.lerp(
      p.set(
        (Math.sin(steeringValue) * velocity) / 5, 
        1.25 + (engineValue / 1000) * -0.5, 
        -5.5 + (Math.cos(steeringValue) - velocity / 20)),
      0.025
    )
    camera.current.rotation.z = THREE.MathUtils.lerp(camera.current.rotation.z, Math.PI + (-steeringValue * velocity) / 50, 0.025)
  })

  useLayoutEffect(() => {
    camera.current.lookAt(chassis.current.position)
  }, [])

  const [light, setLight] = useState()
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
      <group ref={vehicle} position={[0, -0.4, 0]} rotation={[0, 0, 0]}>
        <Chassis ref={chassis} rotation={props.rotation} position={props.position} angularVelocity={props.angularVelocity}>
          <PerspectiveCamera ref={camera} makeDefault fov={75} rotation={[0, Math.PI, 0]} position={[0, 10, -20]} />
          {light && <primitive object={light.target} />}
        </Chassis>
        <Wheel ref={wheel1} radius={radius} leftSide />
        <Wheel ref={wheel2} radius={radius} />
        <Wheel ref={wheel3} radius={radius} leftSide />
        <Wheel ref={wheel4} radius={radius} />
      </group>
    </>
  )
}

export default Vehicle
