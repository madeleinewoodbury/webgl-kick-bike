/**
 * Represents a cube shape in 3D space.
 * @class
 * @param {number[]} color - The color of the cube in RGBA format [r, g, b, a].
 */
class Cube {
  constructor(color, textureDimensions) {
    this.color = color
    this.textureDimensions = textureDimensions
    this.positions = []
    this.colors = []
    this.normals = []
    this.textureCoord = []

    this.generate()
  }

  generate() {
    this.positions.push(
      // Front
      -1,
      1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      1,
      -1,
      1,
      1,
      1,
      -1,
      1,
      1,
      1,
      1,

      // Right side
      1,
      1,
      1,
      1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
      1,
      1,
      1,
      -1,
      -1,
      1,
      1,
      -1,

      // Back
      1,
      -1,
      -1,
      -1,
      -1,
      -1,
      1,
      1,
      -1,
      -1,
      -1,
      -1,
      -1,
      1,
      -1,
      1,
      1,
      -1,

      // Left side
      -1,
      -1,
      -1,
      -1,
      1,
      1,
      -1,
      1,
      -1,
      -1,
      -1,
      1,
      -1,
      1,
      1,
      -1,
      -1,
      -1,

      // Top
      -1,
      1,
      1,
      1,
      1,
      1,
      -1,
      1,
      -1,
      -1,
      1,
      -1,
      1,
      1,
      1,
      1,
      1,
      -1,

      // Bottom
      -1,
      -1,
      -1,
      1,
      -1,
      1,
      -1,
      -1,
      1,
      -1,
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      -1,
      1
    )

    this.normals.push(
      // Front
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,

      // Right side
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,

      // Back
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,

      // Left side
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,

      // Top
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,

      // Bottom
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0
    )

    this.textureCoord.push(
      // Front:
      this.textureDimensions.u[0],
      this.textureDimensions.v[1],
      this.textureDimensions.u[0],
      this.textureDimensions.v[0],
      this.textureDimensions.u[1],
      this.textureDimensions.v[0],

      this.textureDimensions.u[0],
      this.textureDimensions.v[1],
      this.textureDimensions.u[1],
      this.textureDimensions.v[0],
      this.textureDimensions.u[1],
      this.textureDimensions.v[1],

      // Right side
      this.textureDimensions.u[0],
      this.textureDimensions.v[1],
      this.textureDimensions.u[0],
      this.textureDimensions.v[0],
      this.textureDimensions.u[1],
      this.textureDimensions.v[0],

      this.textureDimensions.u[0],
      this.textureDimensions.v[1],
      this.textureDimensions.u[1],
      this.textureDimensions.v[0],
      this.textureDimensions.u[1],
      this.textureDimensions.v[1],

      // Back
      this.textureDimensions.u[0],
      this.textureDimensions.v[0],
      this.textureDimensions.u[1],
      this.textureDimensions.v[0],
      this.textureDimensions.u[0],
      this.textureDimensions.v[1],

      this.textureDimensions.u[1],
      this.textureDimensions.v[0],
      this.textureDimensions.u[1],
      this.textureDimensions.v[1],
      this.textureDimensions.u[0],
      this.textureDimensions.v[1],

      // Left side
      this.textureDimensions.u[0],
      this.textureDimensions.v[0],
      this.textureDimensions.u[1],
      this.textureDimensions.v[1],
      this.textureDimensions.u[0],
      this.textureDimensions.v[1],

      this.textureDimensions.u[1],
      this.textureDimensions.v[0],
      this.textureDimensions.u[1],
      this.textureDimensions.v[1],
      this.textureDimensions.u[0],
      this.textureDimensions.v[0],

      // Top
      this.textureDimensions.u[0],
      this.textureDimensions.v[0],
      this.textureDimensions.u[1],
      this.textureDimensions.v[0],
      this.textureDimensions.u[0],
      this.textureDimensions.v[1],

      this.textureDimensions.u[0],
      this.textureDimensions.v[1],
      this.textureDimensions.u[1],
      this.textureDimensions.v[0],
      this.textureDimensions.u[1],
      this.textureDimensions.v[1],

      // Bottom
      this.textureDimensions.u[1],
      this.textureDimensions.v[1],
      this.textureDimensions.u[0],
      this.textureDimensions.v[0],
      this.textureDimensions.u[1],
      this.textureDimensions.v[0],

      this.textureDimensions.u[1],
      this.textureDimensions.v[1],
      this.textureDimensions.u[0],
      this.textureDimensions.v[1],
      this.textureDimensions.u[0],
      this.textureDimensions.v[0]
    )

    for (let i = 0; i < this.positions.length / 3; i++) {
      this.colors.push(...this.color)
    }
  }
}

export default Cube
