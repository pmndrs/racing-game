import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { useRef, useEffect, Suspense, useMemo } from 'react'

import { useHeightfield } from '@react-three/cannon'

// returns matrix data to be passed to heightfield
// set elementSize as `size` / matrix[0].length
// rotate hf => .quaternion.setFromEuler(-Math.PI/2, 0, 0)
// and .rotation.x = -Math.PI/2;
function createHeightfieldMatrix(image) {
  let matrix = []
  const w = image.width
  const h = image.height
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const scale = 20
  let p, row

  canvas.width = w
  canvas.height = h
  ctx.drawImage(image, 0, 0, w, h)

  for (let x = 0; x < w; x++) {
    row = []
    for (let y = 0; y < h; y++) {
      p = ctx.getImageData(x, y, 1, 1).data
      // returned pixel data is [r, g, b, alpha], since image is in b/w -> any rgb val
      row.push((p[0] / 255) * scale)
    }
    matrix.push(row)
  }
  return matrix
}

function HeightmapGeometry({ heights, elementSize, ...rest }) {
  const ref = useRef()

  useEffect(() => {
    const dx = elementSize
    const dy = elementSize

    /* Create the vertex data from the heights. */
    const vertices = heights.flatMap((row, i) => row.flatMap((z, j) => [i * dx, j * dy, z]))

    /* Create the faces. */
    const indices = []
    for (let i = 0; i < heights.length - 1; i++) {
      for (let j = 0; j < heights[i].length - 1; j++) {
        const stride = heights[i].length
        const index = i * stride + j
        indices.push(index + 1, index + stride, index + stride + 1)
        indices.push(index + stride, index + 1, index)
      }
    }

    ref.current.setIndex(indices)
    ref.current.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    ref.current.computeVertexNormals()
    ref.current.computeBoundingBox()
    ref.current.computeBoundingSphere()
  }, [heights])

  return <bufferGeometry {...rest} ref={ref} />
}

export function Heightfield(props) {
  const { elementSize, position, rotation, ...rest } = props
  const heightmap = useTexture('/heightmap_512.png')
  const heights = useMemo(() => createHeightfieldMatrix(heightmap.image), [heightmap])

  const [ref] = useHeightfield(() => ({
    args: [
      heights,
      {
        elementSize
      }
    ],
    position,
    rotation
  }))

  return (
    <Suspense fallback={null}>
      <mesh ref={ref} castShadow receiveShadow {...rest}>
        <meshPhongMaterial color={'#fed8b1'} flatShading />
        <HeightmapGeometry heights={heights} elementSize={elementSize} />
      </mesh>
    </Suspense>
  )
}
