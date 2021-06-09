import { useTexture } from '@react-three/drei'
import { useHeightfield } from '@react-three/cannon'
import { useAsset } from 'use-asset'

let canvas = document.createElement('canvas')
let context = canvas.getContext('2d')
context.imageSmoothingEnabled = false

/**
 * Returns matrix data to be passed to heightfield.
 * set elementSize as `size` / matrix[0].length (image width)
 * and rotate heightfield to match (rotation.x = -Math.PI/2)
 * @param {Image} image black & white, square heightmap texture
 * @returns {[[Number]]} height data extracted from image
 */
function createHeightfieldMatrix(image) {
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
  const heightmap = useTexture('/textures/heightmap_1024.png')
  const heights = useAsset(async () => createHeightfieldMatrix(heightmap.image), heightmap)
  useHeightfield(() => ({ args: [heights, { elementSize }], position, rotation }))
  return null
}
