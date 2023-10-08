/**
 * Represents a texture for 3D objects in WebGL
 * @class
 * @param {number} urlIndex - The index of the texture's URL.
 * @param {Array} u - The U-coordinate range for the texture (default: [0, 1]).
 * @param {Array} v - The V-coordinate range for the texture (default: [0, 1]).
 */
class Texture {
  constructor(urlIndex, u = [0, 1], v = [0, 1]) {
    this.urlIndex = urlIndex
    this.dimensions = { u: u, v: v }
  }
}

export default Texture
