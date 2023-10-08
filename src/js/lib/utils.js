/**
 * Sets and returns rgba values for certain color values
 */
export function getRGBA() {
  const rgba = {
    grey: [0.85, 0.85, 0.9, 1],
    darkGrey: [0.25, 0.25, 0.25, 1],
    white: [1, 1, 1, 1],
    black: [0, 0, 0, 1],
    red: [1, 0, 0, 1],
    green: [0, 1, 0, 1],
    blue: [0, 0, 1, 1],
    yellow: [1, 1, 0, 1],
    transparent: [0, 0, 0, 0],
  };

  return rgba;
}

/**
 * Rotates a 3D vector around a specified axis by a given angle.
 */
export function rotateVector(delta, vector, axisX, axisY, axisZ) {
  var matrix = new Matrix4();
  matrix.setIdentity();
  matrix.rotate(delta, axisX, axisY, axisZ);
  vec3.transformMat4(vector, vector, matrix.elements);
}

/**
 * Check if the given value is a power of 2
 */
export function isPowerOfTwo1(value) {
  if (value === 0) return false;
  while (value !== 1) {
    if (value % 2 !== 0) return false;
    value = value / 2;
  }
  return true;
}

/**
 * Check if any of the provided images are a POT image
 */
export function allImagesArePOT(images) {
  for (let i = 0; i < images.length; i++) {
    if (isPowerOfTwo1(images[i].width) && isPowerOfTwo1(images[i].height)) {
      continue;
    } else {
      return false;
    }
  }

  return true;
}
