import * as THREE from 'three'
import React, { useEffect, useRef } from 'react'
import { extend } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useHeightfield } from '@react-three/cannon'
import { useAsset } from 'use-asset'
import { useStore } from '../../store'

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

let canvas
let context

function createCanvas() {
  canvas = document.createElement('canvas')
  context = canvas.getContext('2d')
  context.imageSmoothingEnabled = false
}

/**
 * Returns matrix data to be passed to heightfield.
 * set elementSize as `size` / matrix[0].length (image width)
 * and rotate heightfield to match (rotation.x = -Math.PI/2)
 * @param {Image} image black & white, square heightmap texture
 * @returns {[[Number]]} height data extracted from image
 */
function createHeightfieldMatrix(image) {
  if (!canvas) {
    createCanvas()
  }
  let matrix = []
  const width = image.width
  const height = image.height
  const scale = 40 // determines the vertical scale of the heightmap
  let p, row

  canvas.width = width
  canvas.height = height
  context.drawImage(image, 0, 0, width, height)
  const imageData = context.getImageData(0, 0, width, height).data
  for (let x = 0; x < width; x++) {
    row = []
    for (let y = 0; y < height; y++) {
      // returned pixel data is [r, g, b, alpha], since image is in b/w -> any rgb val
      p = Math.max(0, parseFloat((imageData[4 * (y * width + x)] / 255).toPrecision(1)) * scale)
      row.push(p)
    }
    matrix.push(row)
  }
  context.clearRect(0, 0, width, height)
  return matrix
}

export function Heightmap(props) {
  const { elementSize, position, rotation } = props
  const debug = useStore((state) => state.debug)
  const heightmap = useTexture('/textures/heightmap_1024.png')
  const heights = useAsset(async () => createHeightfieldMatrix(heightmap.image), heightmap)
  useHeightfield(() => ({ args: [heights, { elementSize }], position, rotation }))
  return debug ? <HeightmapDebug {...props} /> : null
}

function HeightmapDebug({ elementSize, ...props }) {
  const heightmap = useTexture('/textures/heightmap_1024.png')
  const heights = useAsset(async () => createHeightfieldMatrix(heightmap.image), heightmap)
  return (
    <mesh {...props}>
      <HeightmapGeometry heights={heights} elementSize={elementSize} />
      <meshStandardMaterial />
    </mesh>
  )
}
