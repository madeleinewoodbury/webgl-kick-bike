/**
 * Represents a torus shape in 3D space.
 * @class
 * @param {number} slices - The number of slices (divisions around the outer radius).
 * @param {number} loops - The number of loops (divisions around the inner radius).
 * @param {number} innerRad - The inner radius of the torus.
 * @param {number} outerRad - The outer radius of the torus.
 * @param {number[]} color - The color of the torus in RGBA format [red, green, blue, alpha].
 * @param {Object} textureDimensions - The dimensions of the texture mapping for the circle.
 * @param {number[]} textureDimensions.u - The U-coordinate range for texture mapping [u_min, u_max].
 * @param {number[]} textureDimensions.v - The V-coordinate range for texture mapping [v_min, v_max].
*/
class Torus {
  constructor(slices, loops, innerRad, outerRad, color, textureDimensions) {
    this.slices = slices;
    this.loops = loops;
    this.innerRad = innerRad;
    this.outerRad = outerRad;
    this.color = color;
    this.textureDimensions = textureDimensions

    this.positions = [];
    this.colors = [];
    this.textureCoord = [];
    this.normals = [];
    this.indices = [];

    this.generate();
  }

  generate() {
    for (let slice = 0; slice <= this.slices; ++slice) {
      let v = slice / this.slices;
      let sliceAngle = (slice / this.slices) * 2 * Math.PI;
      let cosSlices = Math.cos(sliceAngle);
      let sinSlices = Math.sin(sliceAngle);
      let sliceRad = this.outerRad + this.innerRad * cosSlices;

      for (let loop = 0; loop <= this.loops; ++loop) {
        let u = loop / this.loops;
        let loopAngle = u * 2 * Math.PI;
        let cosLoops = Math.cos(loopAngle);
        let sinLoops = Math.sin(loopAngle);

        let x = sliceRad * cosLoops;
        let y = this.innerRad * sinSlices;
        let z = sliceRad * sinLoops;

        this.positions.push(x, y, z);
        this.colors.push(...this.color);

        // Scale and offset the u and v values to match the texture dimensions
        let textureOffsetU = this.textureDimensions.u[0]     
        let textureOffsetV = this.textureDimensions.v[0]     
        let textureScaleU = this.textureDimensions.u[1]  
        let textureScaleV = this.textureDimensions.v[1] 

        this.textureCoord.push(u * textureScaleU + textureOffsetU);
        this.textureCoord.push(v * textureScaleV + textureOffsetV);

        this.normals.push(
          cosLoops * sinSlices,
          sinLoops * sinSlices,
          cosSlices
        );
      }
    }

    this.setIndeces();
  }

  setIndeces() {
    const vertsPerSlice = this.loops + 1;

    for (let i = 0; i < this.slices; ++i) {
      let v1 = i * vertsPerSlice;
      let v2 = v1 + vertsPerSlice;

      for (let j = 0; j < this.loops; ++j) {
        this.indices.push(v1);
        this.indices.push(v1 + 1);
        this.indices.push(v2);

        this.indices.push(v2);
        this.indices.push(v1 + 1);
        this.indices.push(v2 + 1);

        v1 += 1;
        v2 += 1;
      }
    }
  }
}

export default Torus;
