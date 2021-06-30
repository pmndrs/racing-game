import { OrthographicCamera, useFBO, useTexture } from '@react-three/drei'
import { createPortal, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Box3, Matrix4, Scene, Vector2, Vector3 } from 'three'

import type { Mesh, Sprite, WebGLRenderTarget } from 'three'

import { useStore, levelLayer } from '../store'

const m = new Matrix4()
const v = new Vector3()
const playerPosition = new Vector3()
const playerRotation = new Vector3()
const spriteRotation = new Vector2()

function useLevelGeometricProperties(): [Box3, Vector3, Vector3] {
  const [box] = useState(() => new Box3())
  const [center] = useState(() => new Vector3())
  const [dimensions] = useState(() => new Vector3())
  const level = useStore((state) => state.level)
  useLayoutEffect(() => {
    if (level.current && level.current.parent) {
      level.current.parent.updateWorldMatrix(false, false)
      box.setFromObject(level.current)
      box.getCenter(center)
      box.getSize(dimensions)
    }
  }, [])
  return [box, center, dimensions]
}

function MinimapTexture({ buffer }: { buffer: WebGLRenderTarget }) {
  const camera = useRef<THREE.OrthographicCamera>(null)
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const [levelBox, levelCenter] = useLevelGeometricProperties()

  useEffect(() => {
    gl.setRenderTarget(buffer)
    camera.current!.bottom = levelBox.min.z - levelCenter.z
    camera.current!.top = levelBox.max.z - levelCenter.z
    camera.current!.left = levelBox.min.x - levelCenter.x
    camera.current!.right = levelBox.max.x - levelCenter.x
    camera.current!.position.set(levelCenter.x, levelCenter.y + levelBox.max.y, levelCenter.z)
    camera.current!.updateProjectionMatrix()
    gl.render(scene, camera.current!)
    gl.setRenderTarget(null)
  }, [])

  useLayoutEffect(() => {
    camera.current!.layers.disableAll()
    camera.current!.layers.enable(levelLayer)
  }, [])

  return <OrthographicCamera ref={camera} makeDefault={false} rotation={[-Math.PI / 2, 0, 0]} near={20} far={500} />
}

export function Minimap({ size = 200 }): JSX.Element {
  const player = useRef<Sprite>(null)
  const miniMap = useRef<Mesh>(null)
  const miniMapCamera = useRef<THREE.OrthographicCamera>(null)
  const [virtualScene] = useState(() => new Scene())
  const mask = useTexture('textures/mask.svg')
  const cursor = useTexture('textures/cursor.svg')
  const buffer = useFBO(size * 2, size * 2)
  const { gl, camera, scene, size: screenSize } = useThree()
  const [, levelCenter, levelDimensions] = useLevelGeometricProperties()
  const chassisBody = useStore((state) => state.chassisBody)
  const screenPosition = useMemo(() => new Vector3(screenSize.width / -2 - size / -2 + 30, screenSize.height / -2 - size / -2 + 30, 0), [screenSize])

  useFrame(() => {
    gl.autoClear = true
    gl.render(scene, camera)
    m.copy(camera.matrix).invert()
    miniMap.current!.quaternion.setFromRotationMatrix(m)
    player.current!.quaternion.setFromRotationMatrix(m)
    gl.autoClear = false
    gl.clearDepth()
    v.subVectors(chassisBody.current!.getWorldPosition(playerPosition), levelCenter)
    player.current!.position.set(screenPosition.x + (v.x / levelDimensions.x) * size, screenPosition.y - (v.z / levelDimensions.z) * size, 0)
    chassisBody.current!.getWorldDirection(playerRotation)
    spriteRotation.set(playerRotation.x, playerRotation.z)
    player.current!.material.rotation = Math.PI / 2 - spriteRotation.angle()
    gl.render(virtualScene, miniMapCamera.current!)
  }, 1)

  return (
    <>
      {createPortal(
        <>
          <ambientLight intensity={1} />
          <sprite ref={miniMap} position={screenPosition} scale={[size, size, 1]}>
            <spriteMaterial map={buffer.texture} alphaMap={mask} />
          </sprite>
          <sprite ref={player} position={screenPosition} scale={[size / 20, size / 20, 1]}>
            <spriteMaterial color="white" alphaMap={cursor} />
          </sprite>
        </>,
        virtualScene,
      )}
      <OrthographicCamera ref={miniMapCamera} position={[0, 0, 0.1]} />
      <MinimapTexture buffer={buffer} />
    </>
  )
}
