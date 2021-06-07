import * as THREE from 'three'
import { useRef, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrthographicCamera } from '@react-three/drei'
import { useStore } from '../store'

const v = new THREE.Vector3()

export function Cameras() {
  const defaultCamera = useRef()
  const birdEyeCamera = useRef()

  const editor = useStore((state) => state.editor)
  const raycast = useStore((state) => state.raycast)
  const camera = useStore((state) => state.camera)
  const { steer } = useStore((state) => state.vehicleConfig)

  console.log(camera)
  useLayoutEffect(() => {
    if (!raycast.chassisBody.current) {
      return
    }
    if (editor) {
      defaultCamera.current.position.set(3, 2, 5)
      defaultCamera.current.rotation.set(0, 0, 0)
    }
    defaultCamera.current.lookAt(raycast.chassisBody.current.position)
  }, [editor, raycast.chassisBody.current])

  useFrame((state, delta) => {
    if (editor) {
      return
    }

    const { speed, controls } = useStore.getState()
    const { left, right, brake } = controls

    const steeringValue = left || right ? steer * (left && !right ? 1 : -1) : 0

    if (camera === 'FIRST_PERSON') {
      defaultCamera.current.position.lerp(v.set(0.3 + (Math.sin(-steeringValue) * speed) / 30, 0.5, 0.01), delta)
    } else if (camera === 'DEFAULT') {
      // left-right, up-down, near-far
      defaultCamera.current.position.lerp(v.set(0, 1.25 + (speed / 1000) * -0.5, -5 - speed / 15 + (brake && speed > 1 ? 1 : 0)), delta)
    }
    if (camera !== 'STATIC_FOLLOW') {
      // left-right swivel
      defaultCamera.current.rotation.y = THREE.MathUtils.lerp(defaultCamera.current.rotation.y, Math.sin(-steeringValue), delta)
    }
  })

  return (
    <>
      <PerspectiveCamera
        key={'pc' + editor}
        ref={defaultCamera}
        makeDefault={['DEFAULT', 'STATIC_FOLLOW', 'FIRST_PERSON'].includes(camera)}
        fov={75}
        rotation={[0, Math.PI, 0]}
        position={[0, 10, -20]}
      />
      <OrthographicCamera
        key={'oc' + editor}
        ref={birdEyeCamera}
        makeDefault={camera === 'BIRD_EYE'}
        position={[0, 100, 0]}
        rotation={[(-1 * Math.PI) / 2, 0, Math.PI]}
        zoom={15}
      />
    </>
  )
}
