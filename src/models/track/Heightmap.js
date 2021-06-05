import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { extend } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useHeightfield } from '@react-three/cannon'
import { useAsset } from 'use-asset'

function HeightmapGeometry({ heights, elementSize, ...rest }) {
  const ref = useRef()

  useEffect(() => {
    const dx = elementSize
    const dy = elementSize

    // Create the vertex data from the heights
    const vertices = heights.flatMap((row, i) => row.flatMap((z, j) => [i * dx, j * dy, z]))

    // Create the faces
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

extend({ HeightmapGeometry })

/**
 * Returns matrix data to be passed to heightfield.
 * set elementSize as `size` / matrix[0].length (image width)
 * and rotate heightfield to match (rotation.x = -Math.PI/2)
 * @param {Image} image black & white, square heightmap texture
 * @returns {[[Number]]} height data extracted from image
 */
function createHeightfieldMatrix(image) {
  let matrix = []
  const w = image.width
  const h = image.height
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const scale = 40 // determines the vertical scale of the heightmap
  let p, row

  canvas.width = w
  canvas.height = h
  ctx.drawImage(image, 0, 0, w, h)

  for (let x = 0; x < w; x++) {
    row = []
    for (let y = 0; y < h; y++) {
      // returned pixel data is [r, g, b, alpha], since image is in b/w -> any rgb val
      p = Math.max(0, parseFloat((ctx.getImageData(x, y, 1, 1).data[0] / 255).toPrecision(1)) * scale)
      row.push(p)
    }
    matrix.push(row)
  }
  console.log(matrix)
  return matrix
}

export function Heightmap(props) {
  const { elementSize, position, rotation } = props
  const heightmap = useTexture('/textures/heightmap_1024.png')
  const heights = useAsset(async () => createHeightfieldMatrix(heightmap.image), heightmap)
  useHeightfield(() => ({ args: [heights, { elementSize }], position, rotation }))
  return null
}

export function HeightmapDebug({ elementSize, ...props }) {
  const heightmap = useTexture('/textures/heightmap_1024.png')
  const heights = useAsset(async () => createHeightfieldMatrix(heightmap.image), heightmap)
  return (
    <mesh {...props}>
      <HeightmapGeometry heights={heights} elementSize={elementSize} />
      <meshStandardMaterial />
    </mesh>
  )
}
