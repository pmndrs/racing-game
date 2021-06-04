import { useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import { useHeightfield } from '@react-three/cannon'

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
      p = ctx.getImageData(x, y, 1, 1).data
      // returned pixel data is [r, g, b, alpha], since image is in b/w -> any rgb val
      row.push((p[0] / 255) * scale)
    }
    matrix.push(row)
  }
  return matrix
}

export function Heightfield(props) {
  const { elementSize, position, rotation } = props
  const heightmap = useTexture('/textures/heightmap_512.png')
  const heights = useMemo(() => createHeightfieldMatrix(heightmap.image), [heightmap])

  useHeightfield(() => ({
    args: [
      heights,
      {
        elementSize,
      },
    ],
    position,
    rotation,
  }))

  return null
}
