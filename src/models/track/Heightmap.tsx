import { useTexture } from '@react-three/drei'
import { useHeightfield } from '@react-three/cannon'
import { useAsset } from 'use-asset'

const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
if (context) context.imageSmoothingEnabled = false

/**
 * Returns matrix data to be passed to heightfield.
 * set elementSize as `size` / matrix[0].length (image width)
 * and rotate heightfield to match (rotation.x = -Math.PI/2)
 */
function createHeightfieldMatrix(image: HTMLImageElement): Number[][] {
  if (!context) {
    throw new Error("Heightmap couldn't be loaded")
  }
  let matrix = []
  const width = image.width
  const height = image.height
  const scale = 20 // determines the vertical scale of the heightmap
  let row

  canvas.width = width
  canvas.height = height
  context.drawImage(image, 0, 0, width, height)
  const imageData = context.getImageData(0, 0, width, height).data
  for (let x = 0; x < width; x++) {
    row = []
    for (let y = 0; y < height; y++) {
      // returned pixel data is [r, g, b, alpha], since image is in b/w -> any rgb val
      const p = Math.max(0, (imageData[4 * (y * width + x)] / 255) * (scale * 2))
      row.push(p / 4)
    }
    matrix.push(row)
  }
  context.clearRect(0, 0, width, height)
  return matrix
}

export function Heightmap(props: {elementSize: number, position: number[], rotation: number[]}) {
  const { elementSize, position, rotation } = props
  const heightmap = useTexture('/textures/heightmap_1024.png')
  const heights = useAsset(async () => createHeightfieldMatrix(heightmap.image))
  useHeightfield(() => ({ args: [heights, { elementSize }], position, rotation }), undefined, [elementSize, position, rotation])
  return null
}
