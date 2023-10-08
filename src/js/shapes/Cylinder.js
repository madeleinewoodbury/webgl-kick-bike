/**
 * Represents a cylinder shape in 3D space.
 * @class
 * @param {number} sectors - The number of sectors or vertices used to approximate the cylinder.
 * @param {number[]} rgba - The color of the cylinder in RGBA format [r, g, b, a].
 * @param {Object} textureDimensions - The dimensions of the texture mapping for the circle.
 * @param {number[]} textureDimensions.u - The U-coordinate range for texture mapping [u_min, u_max].
 * @param {number[]} textureDimensions.v - The V-coordinate range for texture mapping [v_min, v_max].
 */
class Cylinder {
  constructor(sectors, color, textureDimensions) {
    this.sectors = sectors
    this.color = color
    this.textureDimensions = textureDimensions

    this.positions = []
    this.normals = []
    this.colors = []
    this.textureCoord = []

    this.generate()
  }

  generate() {
    const { u, v } = this.textureDimensions
    let stepGrader = 360 / this.sectors
    let step = (Math.PI / 180) * stepGrader
    let [x, y, z] = [0, 0, 0]
    let n1 = this.calculateCylinderNormalVertex(x, z)

    this.positions.push(x, y, z)
    this.colors.push(...this.color)
    this.normals.push(...n1)
    this.textureCoord.push(u[0], v[0]) // Bottom left

    z = 1
    this.positions.push(x, y, z)
    this.colors.push(...this.color)
    this.normals.push(...n1)
    this.textureCoord.push(u[0], v[0]) // Top left

    let phi = step
    for (let sector = 1; sector <= this.sectors + 2; sector++) {
      x = Math.cos(phi)
      y = Math.sin(phi)
      z = 0

      this.positions.push(x, y, z, x, y, z + 1)
      this.colors.push(...this.color, ...this.color)

      n1 = this.calculateCylinderNormalVertex(x, z)
      this.normals.push(...n1, ...n1)

      // Calculate the texture coordinates
      let uCoord = u[0] + (u[1] - u[0]) * (sector / this.sectors)
      this.textureCoord.push(uCoord, v[0], uCoord, v[1])

      phi += step
    }
  }

  calculateCylinderNormalVertex(x, z) {
    let normal = vec3.fromValues(x, 0, z)
    let normalizedNormal = vec3.create()
    vec3.normalize(normalizedNormal, normal)

    return normalizedNormal
  }
}

export default Cylinder
