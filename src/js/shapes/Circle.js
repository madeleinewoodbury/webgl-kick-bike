/**
 * Represents a circle shape in 3D space.
 * @class
 * @param {number[]} center - The center coordinates of the circle [x, y, z].
 * @param {number[]} color - The color of the circle in RGBA format [r, g, b, a].
 * @param {number} radius - The radius of the circle.
 * @param {number} sectors - The number of sectors or vertices used to approximate the circle.
 * @param {Object} textureDimensions - The dimensions of the texture mapping for the circle.
 * @param {number[]} textureDimensions.u - The U-coordinate range for texture mapping [u_min, u_max].
 * @param {number[]} textureDimensions.v - The V-coordinate range for texture mapping [v_min, v_max].
 */
class Circle {
  constructor(center, color, radius, sectors, textureDimensions) {
    this.center = center
    this.color = color
    this.radius = radius
    this.sectors = sectors
    this.textureDimensions = textureDimensions

    this.positions = []
    this.colors = []
    this.textureCoord = []
    this.normals = []

    this.generate()
  }

  generate() {
    let [x, y, z] = this.center
    let [r, g, b, a] = this.color
    const textureCenter = this.textureDimensions.u[1] / 2

    this.positions.push(x, y, z)
    this.colors.push(r, g, b, a)
    this.textureCoord.push(textureCenter, textureCenter) // center of the circle
    this.normals.push(0, 1, 0)

    let stepGrader = 360.0 / this.sectors
    if (stepGrader <= 2) stepGrader = 3
    let step = (Math.PI / 180) * stepGrader
    let phi = 0.0

    for (let sector = 1; sector <= this.sectors + 2; sector++) {
      x = this.radius * Math.cos(phi)
      z = this.radius * Math.sin(phi)

      // Calculate texture coordinates based on vertex position
      let u =
        (x / (2 * this.radius)) * this.textureDimensions.u[1] + textureCenter
      let v =
        (z / (2 * this.radius)) * this.textureDimensions.v[1] + textureCenter

      this.positions.push(x, y, z)
      this.colors.push(r, g, b, a)
      this.textureCoord.push(u, v)
      this.normals.push(0, 1, 0)

      phi += step
    }
  }
}

export default Circle
