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

  useLayoutEffect(() => {
    if (!raycast.chassisBody.current) {
      return
    }
    defaultCamera.current.lookAt(raycast.chassisBody.current.position)
    defaultCamera.current.rotation.z = Math.PI // resolves the weird spin in the beginning
  }, [editor, raycast.chassisBody.current])

  useFrame((state, delta) => {
    const { speed, controls } = useStore.getState()
    const { forward, backward, left, right, brake, boost, reset } = controls

    const steeringValue = 0
    const engineValue = 1

    if (!editor) {
      if (camera === 'FIRST_PERSON') {
        defaultCamera.current.position.lerp(v.set(0.3 + (Math.sin(-steeringValue) * speed) / 30, 0.5, 0.01), delta)
      } else if (camera === 'DEFAULT') {
        // left-right, up-down, near-far
        defaultCamera.current.position.lerp(
          v.set((Math.sin(steeringValue) * speed) / 2.5, 1.25 + (engineValue / 1000) * -0.5, -5 - speed / 15 + (brake ? 1 : 0)),
          delta,
        )
      }
      // left-right swivel
      defaultCamera.current.rotation.z = THREE.MathUtils.lerp(defaultCamera.current.rotation.z, Math.PI + (-steeringValue * speed) / 45, delta)
    }
  })

  return (
    <>
      <PerspectiveCamera
        key={'pc' + editor}
        ref={defaultCamera}
        makeDefault={['DEFAULT', 'FIRST_PERSON'].includes(camera)}
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
