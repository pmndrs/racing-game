import { OrthographicCamera, useFBO } from '@react-three/drei'
import { createPortal, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Box3, Matrix4, Scene, Vector3 } from 'three'
import { levelLayer } from '../enums'
import { useStore } from '../store'

function useLevelDimensions() {
  const [levelBox] = useState(new Box3())
  const [levelCenter] = useState(new Vector3())
  const [levelDimensions] = useState(new Vector3())
  const level = useStore((state) => state.level)

  useEffect(() => {
    const box = new Box3().setFromObject(level.current)
    levelBox.copy(box)
    levelBox.getCenter(levelCenter)
    levelBox.getSize(levelDimensions)
  }, [])

  return {
    levelBox,
    levelCenter,
    levelDimensions,
  }
}

function MiniMapTexture({ buffer }) {
  const camera = useRef()
  const { gl, scene } = useThree(({ gl, scene }) => ({ gl, scene }))
  const { levelBox, levelCenter } = useLevelDimensions()

  useEffect(() => {
    gl.setRenderTarget(buffer)
    camera.current.bottom = levelBox.min.z - levelCenter.z
    camera.current.top = levelBox.max.z - levelCenter.z
    camera.current.left = levelBox.min.x - levelCenter.x
    camera.current.right = levelBox.max.x - levelCenter.x
    camera.current.position.set(levelCenter.x, levelCenter.y + levelBox.max.y, levelCenter.z)
    camera.current.updateProjectionMatrix()
    gl.render(scene, camera.current)
    gl.setRenderTarget(null)
  }, [levelBox, levelCenter])

  useLayoutEffect(() => {
    camera.current.layers.disableAll()
    camera.current.layers.enable(levelLayer)
  }, [])

  return <OrthographicCamera ref={camera} makeDefault={false} rotation={[-Math.PI / 2, 0, 0]} near={20} far={500} />
}

function MiniMap({ size = 300 }) {
  const virtualScene = useMemo(() => new Scene(), [])
  const buffer = useFBO(600, 600)
  const miniMapCamera = useRef()
  const miniMap = useRef()
  const { gl, camera, scene, size: screenSize } = useThree(({ camera, gl, scene, size }) => ({ gl, camera, scene, size }))
  const [screenPosition, setScreenPosition] = useState(new Vector3(screenSize.width / 2 - size / 2, screenSize.height / 2 - size / 2, 0))
  const player = useRef()
  const matrix = new Matrix4()
  const { levelCenter, levelDimensions } = useLevelDimensions()
  const chassisBody = useStore((state) => state.raycast.chassisBody)
  const direction = new Vector3()

  useEffect(() => {
    setScreenPosition(new Vector3(screenSize.width / 2 - size / 2, screenSize.height / 2 - size / 2, 0))
  }, [screenSize])

  useFrame(() => {
    matrix.copy(camera.matrix).invert()
    miniMap.current.quaternion.setFromRotationMatrix(matrix)
    player.current.quaternion.setFromRotationMatrix(matrix)
    gl.autoClear = true
    gl.render(scene, camera)
    gl.autoClear = false
    gl.clearDepth()
    direction.subVectors(chassisBody.current.position, levelCenter)
    const ratioX = size / levelDimensions.x
    const ratioY = levelDimensions.y / size
    player.current.position.set(screenPosition.x + direction.x * ratioX, screenPosition.y - direction.z * ratioY, 0)
    gl.render(virtualScene, miniMapCamera.current)
  }, 1)

  return (
    <>
      {createPortal(
        <>
          <OrthographicCamera ref={miniMapCamera} makeDefault={false} position={[0, 0, 100]} />
          <sprite ref={miniMap} position={screenPosition} scale={[size, size, 1]}>
            <spriteMaterial map={buffer.texture} />
          </sprite>
          <sprite ref={player} position={screenPosition} scale={[size / 30, size / 30, 1]} />
        </>,
        virtualScene,
      )}
      <MiniMapTexture buffer={buffer} />
    </>
  )
}

export { MiniMap }
