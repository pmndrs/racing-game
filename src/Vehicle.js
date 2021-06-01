import * as THREE from 'three'
import { useRef, useEffect, useState, useLayoutEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { useRaycastVehicle } from '@react-three/cannon'
import { Chassis } from './models/Chassis'
import { Wheel } from './models/Wheel'
import { useStore } from './utils/store'

const vec = new THREE.Vector3()

function Vehicle({ radius = 0.7, width = 1.2, height = -0.04, front = 1.3, back = -1.15, steer = 0.5, force = 3000, maxBrake = 75, ...props }) {
  const set = useStore((state) => state.set)

  const chassis = useRef()
  const chassisWrap = useRef()
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


  useEffect(() => {
    const vSub = chassis.current.api.velocity.subscribe((current) => {
      set({ velocity: current, speed: p.set(...current).length() })
    })
    return () => {
      vSub()
    }
  }, [])

  const t = new THREE.Vector3()
  const p = new THREE.Vector3()
  const m = new THREE.Matrix4()
  const o = new THREE.Object3D()
  const q = new THREE.Quaternion()
  const e = new THREE.Euler()

  const target = useRef()
  useFrame((state, delta) => {
    const speed = useStore.getState().speed
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
        // left-right
        (Math.sin(steeringValue) * speed) / 5,
        // up-down
        1.25 + (engineValue / 1000) * -0.5,
        // near-far
        -5 - speed / 20
      ),
      0.025
    )
    // left-right swivel
    camera.current.rotation.z = THREE.MathUtils.lerp(camera.current.rotation.z, Math.PI + (-steeringValue * speed) / 50, 0.025)
    // lean chassis
    chassis.current.children[0].rotation.z = THREE.MathUtils.lerp(chassis.current.children[0].rotation.z, (-steeringValue * speed) / 200, 0.1)
  })

  // Look at is causing the weird spin in the beginning
  useLayoutEffect(() => {
    camera.current.lookAt(chassis.current.position)
  }, [])

  // Needs cleanup!
  let trail = useRef()
  let index = 0
  let time = 0

  function setItemAt(target, obj, i) {
    const { controls, speed } = useStore.getState()
    let scale = (Math.random() * controls.brake * speed) / 30
    o.position.set(obj.position.x, obj.position.y - 0.25, obj.position.z)
    o.scale.set(scale, scale, scale)
    o.updateMatrix()
    target.setMatrixAt(i, o.matrix)
    trail.current.instanceMatrix.needsUpdate = true
  }

  useFrame((state) => {
    if (state.clock.getElapsedTime() - time > 0.04) {
      time = state.clock.getElapsedTime()
    } else {
      for (let i = 0; i < 100; i++) {
        trail.current.getMatrixAt(i, m)
        m.decompose(p, q, t)
        o.position.copy(p)
        const s = Math.max(0, t.x - 0.01)
        o.scale.set(s, s, s)
        o.updateMatrix()
        trail.current.setMatrixAt(i, o.matrix)
        trail.current.instanceMatrix.needsUpdate = true
      }
      return
    }
    setItemAt(trail.current, wheel3.current, index++)
    setItemAt(trail.current, wheel4.current, index++)
    if (index === 100) index = 0
  })

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
      <group ref={vehicle} position={[0, -0.4, 0]}>
        <Chassis ref={chassis} rotation={props.rotation} position={props.position} angularVelocity={props.angularVelocity}>
          <PerspectiveCamera ref={camera} makeDefault fov={75} rotation={[0, Math.PI, 0]} position={[0, 10, -20]} />
          {light && <primitive object={light.target} />}
        </Chassis>
        <Wheel ref={wheel1} radius={radius} leftSide />
        <Wheel ref={wheel2} radius={radius} />
        <Wheel ref={wheel3} radius={radius} leftSide />
        <Wheel ref={wheel4} radius={radius} />
        <instancedMesh ref={trail} args={[null, null, 100]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="white" transparent opacity={0.15} />
        </instancedMesh>
      </group>
    </>
  )
}

export default Vehicle
