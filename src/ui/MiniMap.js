import { OrthographicCamera, useFBO } from '@react-three/drei'
import { createPortal, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { Box3, Scene } from 'three'
import { Matrix4 } from 'three'
import { Vector3 } from 'three'
import { useStore } from '../store'

const levelCenter = new Vector3()
function useLevelDimensions(callback) {
  const callbackRef = useRef(callback)
  const level = useStore((state) => state.level)

  useEffect(() => {
    const levelBox = new Box3().setFromObject(level.current)
    levelBox.getCenter(levelCenter)
    callbackRef.current({ levelBox, levelCenter })
  }, [])
}

function MiniMapTexture({ buffer }) {
  const camera = useRef()
  const { gl, scene } = useThree(({ gl, scene }) => ({ gl, scene }))

  useLevelDimensions(({ levelBox, levelCenter }) => {
    gl.setRenderTarget(buffer)
    camera.current.bottom = levelBox.min.z - levelCenter.z
    camera.current.top = levelBox.max.z - levelCenter.z
    camera.current.left = levelBox.min.x - levelCenter.x
    camera.current.right = levelBox.max.x - levelCenter.x
    camera.current.position.set(levelCenter.x, levelCenter.y + levelBox.max.y, levelCenter.z)
    camera.current.updateProjectionMatrix()
    gl.render(scene, camera.current)
    gl.setRenderTarget(null)
  })

  return <OrthographicCamera ref={camera} makeDefault={false} rotation={[-Math.PI / 2, 0, 0]} near={20} far={500} />
}

function MiniMap() {
  const virtualScene = useMemo(() => new Scene(), [])
  const buffer = useFBO(600, 600)
  const miniMapCamera = useRef()
  const miniMap = useRef()

  const matrix = new Matrix4()
  const { gl, camera, scene, size } = useThree(({ camera, gl, scene, size }) => ({ gl, camera, scene, size }))

  useFrame(() => {
    matrix.copy(camera.matrix).invert()
    miniMap.current.quaternion.setFromRotationMatrix(matrix)
    gl.autoClear = true
    gl.render(scene, camera)
    gl.autoClear = false
    gl.clearDepth()
    gl.render(virtualScene, miniMapCamera.current)
  }, 1)

  return (
    <>
      {createPortal(
        <>
          <OrthographicCamera ref={miniMapCamera} makeDefault={false} position={[0, 0, 100]} />
          <sprite ref={miniMap} position={[size.width / 2 - 200, size.height / 2 - 200, 0]} scale={[300, 300, 1]}>
            <spriteMaterial map={buffer.texture} />
          </sprite>
        </>,
        virtualScene,
      )}
      <MiniMapTexture buffer={buffer} />
    </>
  )
}

export { MiniMap }
