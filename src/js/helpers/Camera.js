import { rotateVector } from '../lib/utils.js';

/**
 * Represents a camera for WebGL rendering.
 * @class
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 */
class Camera {
  constructor(gl) {
    this.gl = gl;

    this.posX = 5;
    this.posY = 5;
    this.posZ = 5;
    this.lookX = 0;
    this.lookY = 0;
    this.lookZ = 3;
    this.upX = 0;
    this.upY = 1;
    this.upZ = 0;

    this.fov = 45;
    this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    this.near = 1;
    this.far = 1000;

    this.viewMatrix = new Matrix4();
    this.projectionMatrix = new Matrix4();
  }

  set() {
    this.setViewMatrix();
    this.setProjectionMatrix();
  }

  setPosition(x, y, z) {
    this.posX = x;
    this.posY = y;
    this.posZ = z;
  }

  setLookAt(x, y, z) {
    this.lookX = x;
    this.lookY = y;
    this.lookZ = z;
  }

  setUp(x, y, z) {
    this.upX = x;
    this.upY = y;
    this.upZ = z;
  }

  setFieldOfView(fov) {
    this.fov = fov;
  }

  setAspect(aspect) {
    this.aspect = aspect;
  }

  setNearFar(near, far) {
    this.near = near;
    this.far = far;
  }

  setViewMatrix() {
    this.viewMatrix.setLookAt(
      this.posX,
      this.posY,
      this.posZ,
      this.lookX,
      this.lookY,
      this.lookZ,
      this.upX,
      this.upY,
      this.upZ
    );
  }

  setProjectionMatrix() {
    this.projectionMatrix.setPerspective(
      this.fov,
      this.aspect,
      this.near,
      this.far
    );
  }

  /**
   * Handles keyboard input to move the camera and adjust zoom.
   */
  handleKeys(currentlyPressed) {
    let camPosVec = vec3.fromValues(this.posX, this.posY, this.posZ);
    let delta = 1.2;

    // Move camera
    if (currentlyPressed['KeyA']) rotateVector(-delta, camPosVec, 0, 0, 1);
    if (currentlyPressed['KeyD']) rotateVector(delta, camPosVec, 0, 0, 1);
    if (currentlyPressed['KeyS']) rotateVector(-delta, camPosVec, 1, 0, 0);
    if (currentlyPressed['KeyW']) rotateVector(delta, camPosVec, 1, 0, 0);

    // Zoom in and out
    if (currentlyPressed['KeyV']) vec3.scale(camPosVec, camPosVec, 1.02);
    if (currentlyPressed['KeyB']) vec3.scale(camPosVec, camPosVec, 0.98);

    // Update x, y, z positions
    this.setPosition(...camPosVec);
    this.set();
  }
}

export default Camera;
