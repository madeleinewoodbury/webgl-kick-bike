/**
 * Represents a Coordinate System shape in 3D space.
 * @class
 * @param {number} extent - The extend of the coordinate system
 * @param {number[]} xColor - The color of the X-axis in RGBA format [r, g, b, a].
 * @param {number[]} yColor - The color of the Y-axis in RGBA format [r, g, b, a].
 * @param {number[]} zColor - The color of the Z-axis in RGBA format [r, g, b, a].
 */
class CoordinateSystem {
  constructor(extent, xColor, yColor, zColor) {
    this.xPos = new Line([-extent, 0, 0], [extent, 0, 0], xColor);
    this.yPos = new Line([0, -extent, 0], [0, extent, 0], yColor);
    this.zPos = new Line([0, 0, -extent], [0, 0, extent], zColor);

    this.positions = [];
    this.colors = [];

    this.generate();
  }

  generate() {
    this.positions.push(
      ...this.xPos.positions,
      ...this.yPos.positions,
      ...this.zPos.positions
    );
    this.colors.push(
      ...this.xPos.colors,
      ...this.yPos.colors,
      ...this.zPos.colors
    );
  }
}

/**
 * Represents a line shape in 3D space.
 * @class
 * @param {number[]} start - The start coordinates of the line [x, y, z].
 * @param {number[]} end - The end coordinates of the line [x, y, z].
 * @param {number[]} color - The color of the line in RGBA format [r, g, b, a].
 */
class Line {
  constructor(start, end, color) {
    this.positions = start.concat(end);
    this.colors = color.concat(color);
  }
}

export default CoordinateSystem;
