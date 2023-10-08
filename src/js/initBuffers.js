import Texture from './helpers/Texture.js'
import CoordinateSystem from './shapes/CoordinateSystem.js'
import Circle from './shapes/Circle.js'
import Cube from './shapes/Cube.js'
import Torus from './shapes/Torus.js'
import Cylinder from './shapes/Cylinder.js'
import { getRGBA } from './lib/utils.js'

/**
 * Initializes WebGL buffers for various 3D objects and textures.
 */
export default function initBuffers(gl, images) {
  const tire = new Texture(0, [0, 1], [0.73633, 1 - 0.73633])
  const rim = new Texture(0, [0, 0.52734], [0, 0.52734])
  const baseMetal = new Texture(1)
  const cylinderMetal = new Texture(1, [0.1, 0.9], [0.45, 0.55])
  const handleBars = new Texture(2)

  return {
    coord: initCoordBuffers(gl),
    torus: initTorusBuffers(gl, images[tire.urlIndex], tire.dimensions),
    rim: initCircleBuffers(gl, images[rim.urlIndex], rim.dimensions),
    base: initCubeBuffers(gl, images[baseMetal.urlIndex], baseMetal.dimensions),
    cylinder: initCylinderBuffers(
      gl,
      images[cylinderMetal.urlIndex],
      cylinderMetal.dimensions
    ),
    metalCircle: initCircleBuffers(
      gl,
      images[cylinderMetal.urlIndex],
      cylinderMetal.dimensions
    ),
    handleBar: initCylinderBuffers(
      gl,
      images[handleBars.urlIndex],
      handleBars.dimensions
    ),
    handleBarCircle: initCircleBuffers(
      gl,
      images[handleBars.urlIndex],
      handleBars.dimensions
    ),
  }
}

/**
 * Initializes and returns WebGL buffers for the coordinate system
 */
function initCoordBuffers(gl) {
  const rgba = getRGBA()
  const extent = 100

  const coordSystem = new CoordinateSystem(
    extent,
    rgba.red,
    rgba.blue,
    rgba.green
  )
  const positionBuffer = createBuffer(gl, coordSystem.positions)
  const colorBuffer = createBuffer(gl, coordSystem.colors)

  return {
    position: positionBuffer,
    color: colorBuffer,
    vertexCount: coordSystem.positions.length / 3,
  }
}

/**
 * Initializes and returns WebGL buffers for the torus shape
 */
function initTorusBuffers(gl, textureImage, textureDimensions) {
  const rgba = getRGBA()
  const slices = 10
  const loops = 200
  const inner_rad = 0.2
  const outer_rad = 0.9

  const torus = new Torus(
    slices,
    loops,
    inner_rad,
    outer_rad,
    rgba.red,
    textureDimensions
  )

  const positionBuffer = createBuffer(gl, torus.positions)
  const normalBuffer = createBuffer(gl, torus.normals)
  const indexBuffer = createIndexBuffer(gl, torus.indices)

  const texture = createTexture(gl, textureImage)
  const textureBuffer = createBuffer(gl, torus.textureCoord)
  return {
    position: positionBuffer,
    normal: normalBuffer,
    index: indexBuffer,
    texture: textureBuffer,
    textureObject: texture,
    vertexCount: torus.positions.length / 3,
    indicesCount: torus.indices.length,
  }
}

/**
 * Initializes and returns WebGL buffers for the circle shape
 */
function initCircleBuffers(gl, textureImage, textureDimensions) {
  const rgba = getRGBA()
  const center = [0, 0, 0]
  const radius = 1
  const sectors = 50

  const circle = new Circle(
    center,
    rgba.yellow,
    radius,
    sectors,
    textureDimensions
  )
  const positionBuffer = createBuffer(gl, circle.positions)
  const normalBuffer = createBuffer(gl, circle.normals)
  const textureBuffer = createBuffer(gl, circle.textureCoord)
  const texture = createTexture(gl, textureImage)
  return {
    position: positionBuffer,
    normal: normalBuffer,
    texture: textureBuffer,
    textureObject: texture,
    vertexCount: circle.positions.length / 3,
  }
}

/**
 * Initializes and returns WebGL buffers for the cube shape
 */
function initCubeBuffers(gl, textureImage, textureDimensions) {
  const rgba = getRGBA()
  const cube = new Cube(rgba.yellow, textureDimensions)

  const positionBuffer = createBuffer(gl, cube.positions)
  const textureBuffer = createBuffer(gl, cube.textureCoord)
  const texture = createTexture(gl, textureImage)
  const normalBuffer = createBuffer(gl, cube.normals)

  return {
    position: positionBuffer,
    texture: textureBuffer,
    textureObject: texture,
    normal: normalBuffer,
    vertexCount: cube.positions.length / 3,
  }
}

/**
 * Initializes and returns WebGL buffers for the cylinder shape
 */
function initCylinderBuffers(gl, textureImage, textureDimensions) {
  const rgba = getRGBA()
  let sectors = 36

  const cylinder = new Cylinder(sectors, rgba.blue, textureDimensions)
  const positionBuffer = createBuffer(gl, cylinder.positions)
  const normalBuffer = createBuffer(gl, cylinder.normals)
  const texture = createTexture(gl, textureImage)
  const textureBuffer = createBuffer(gl, cylinder.textureCoord)

  return {
    position: positionBuffer,
    normal: normalBuffer,
    texture: textureBuffer,
    textureObject: texture,
    vertexCount: cylinder.positions.length / 3,
  }
}

/**
 * Creates and initializes a WebGL buffer with the provided data
 */
function createBuffer(gl, arr) {
  const newBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, newBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  return newBuffer
}

/**
 * Creates and initializes a WebGL texture with the provided texture image
 */
function createTexture(gl, textureImage) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    textureImage
  )
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.bindTexture(gl.TEXTURE_2D, null)

  return texture
}

/**
 * Creates and initializes a WebGL index buffer with the provided data
 */
function createIndexBuffer(gl, indices) {
  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  )

  return indexBuffer
}
