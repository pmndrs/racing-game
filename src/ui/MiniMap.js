import { OrthographicCamera, Ring } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { Vector3 } from 'three'
import { useStore } from '../store'

const cameraDistance = new Vector3(0, 100, 0)
const ringDistance = new Vector3(0, -20, 0)
function MiniMap() {
  const miniMapCamera = useRef()
  const frame = useRef()
  const raycast = useStore((state) => state.raycast)
  const { gl, camera, scene, size } = useThree(({ camera, gl, scene, size }) => ({ gl, camera, scene, size }))
  const ratio = size.width / size.height

  useFrame((state, delta) => {
    gl.autoClear = true
    gl.render(scene, camera)
    if (miniMapCamera.current && raycast.chassisBody.current && frame.current) {
      gl.autoClear = false
      gl.clearDepth()

      const lerpAlpha = 1.0 - Math.pow(0.001, delta)
      const newPosition = raycast.chassisBody.current.position.clone().add(cameraDistance)
      const framePosition = newPosition.clone().add(ringDistance)
      miniMapCamera.current.position.lerp(newPosition, lerpAlpha)
      frame.current.position.lerp(framePosition, lerpAlpha)

      gl.setViewport(0, size.height - size.height * 0.15 * ratio, size.width * 0.15, size.height * 0.15 * ratio)
      gl.render(scene, miniMapCamera.current)
      gl.setViewport(0, 0, size.width, size.height)
    }
  }, 1)

  return (
    <>
      <OrthographicCamera
        ref={miniMapCamera}
        makeDefault={false}
        position={cameraDistance}
        rotation={[(-1 * Math.PI) / 2, 0, Math.PI]}
        near={20}
        far={120}
        left={-100}
        right={100}
        bottom={-100}
        top={100}
      />
      <Ring ref={frame} position={cameraDistance.clone().add(ringDistance)} rotation={[-Math.PI / 2, 0, Math.PI / 4]} args={[140, 150, 4]} />
    </>
  )
}

export { MiniMap }
