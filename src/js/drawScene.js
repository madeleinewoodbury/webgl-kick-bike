import { getRGBA } from './lib/utils.js'
/**
 * Renders the 3D scene using WebGL.
 */
function drawScene(renderInfo, camera) {
  const rgba = getRGBA()
  clearCanvas(renderInfo.gl, rgba.black)

  // Draw the coordinate system
  drawCoordinateSystem(renderInfo, camera)

  // Draw the 3D model of a bike
  drawBike(renderInfo, camera)
}

/**
 * Draws the coordinate system
 */
function drawCoordinateSystem(renderInfo, camera) {
  const { gl, shaders, buffers } = renderInfo

  gl.useProgram(shaders.baseShader.program)
  connectPositionAttribute(gl, shaders.baseShader, buffers.coord.position)
  connectColorAttribute(gl, shaders.baseShader, buffers.coord.color)

  let modelMatrix = new Matrix4()
  modelMatrix.setIdentity()
  camera.set()
  let modelviewMatrix = new Matrix4(camera.viewMatrix.multiply(modelMatrix))
  gl.uniformMatrix4fv(
    shaders.baseShader.uniformLocations.modelViewMatrix,
    false,
    modelviewMatrix.elements
  )
  gl.uniformMatrix4fv(
    shaders.baseShader.uniformLocations.projectionMatrix,
    false,
    camera.projectionMatrix.elements
  )

  gl.drawArrays(gl.LINES, 0, buffers.coord.vertexCount)
}
/**
 * Draws the 3D bike components
 */
function drawBike(renderInfo, camera) {
  renderInfo.gl.useProgram(renderInfo.shaders.lightShader.program)

  let modelMatrix = new Matrix4()
  modelMatrix.setIdentity()
  // Apply position for bike in x plane (moves the bike forwards or backwards)
  modelMatrix.translate(renderInfo.animationInfo.bikePosition, 0, 0)
  renderInfo.stack.pushMatrix(modelMatrix) // top of stack

  // Draw the components
  drawBase(renderInfo, camera)
  drawBackWheel(renderInfo, camera)
  drawFrontCylinderBase(renderInfo, camera)
  drawFrontWheel(renderInfo, camera)
  drawHandleBars(renderInfo, camera)
}

/**
 * Draw the cube base and back parts of the bike
 */
function drawBase(renderInfo, camera) {
  const { gl, shaders, buffers, light, stack } = renderInfo

  // draw base
  let modelMatrix = stack.peekMatrix()
  modelMatrix.translate(-0.6, 0, 0.7)
  modelMatrix.scale(2, 0.4, 0.2)
  drawCube(gl, shaders.lightShader, buffers.base, light, camera, modelMatrix)

  // draw back part 1
  modelMatrix = stack.peekMatrix()
  modelMatrix.translate(-1.6, 0, 1.35)
  modelMatrix.rotate(45, 0, 1, 0)
  stack.pushMatrix(modelMatrix) // back part 1
  modelMatrix.scale(0.7, 0.1, 0.1)
  drawCube(gl, shaders.lightShader, buffers.base, light, camera, modelMatrix)

  // draw back part 2
  modelMatrix = stack.peekMatrix() // back part 1
  modelMatrix.translate(-1.4, 0, 0)
  modelMatrix.rotate(-45, 0, 1, 0)
  modelMatrix.translate(-0.1, 0, -0.55)
  modelMatrix.scale(0.7, 0.1, 0.1)
  drawCube(gl, shaders.lightShader, buffers.base, light, camera, modelMatrix)
}

/**
 * Draw the back wheel torus and rim circle
 */
function drawBackWheel(renderInfo, camera) {
  const { gl, shaders, buffers, light, stack, animationInfo } = renderInfo

  stack.popMatrix()
  let modelMatrix = stack.peekMatrix()
  modelMatrix.scale(0.8, 0.8, 0.8)
  modelMatrix.translate(-3.2, 0, 0.8)
  // Apply wheel rotation transformation (lets the wheel rotate)
  modelMatrix.rotate(animationInfo.wheelRotationAngle, 0, 1, 0)
  stack.pushMatrix(modelMatrix)
  drawTorus(gl, shaders.lightShader, buffers.torus, light, camera, modelMatrix)

  modelMatrix = stack.peekMatrix()
  drawCircle(gl, shaders.lightShader, buffers.rim, light, camera, modelMatrix)
}

/**
 * Draw the front cylinder base shape, connects the steering to the base
 */
function drawFrontCylinderBase(renderInfo, camera) {
  const { gl, shaders, buffers, light, stack, animationInfo, flatPack } =
    renderInfo

  stack.popMatrix()
  let modelMatrix = stack.peekMatrix()
  modelMatrix.translate(1.1, 0, 0.58)

  if (flatPack) {
    // Apply transformation animation if bike is packed down/up
    modelMatrix.rotate(animationInfo.flatPackCylinderBaseAngle, 0, 1, 0)
  } else {
    // Initial position (unpacked)
    modelMatrix.rotate(25, 0, 1, 0)
  }
  stack.pushMatrix(modelMatrix)
  modelMatrix.scale(0.25, 0.25, 1.5)
  drawCylinder(
    gl,
    shaders.lightShader,
    buffers.cylinder,
    light,
    camera,
    modelMatrix
  )

  modelMatrix = stack.peekMatrix()
  modelMatrix.translate(0, 0, 1.5)
  modelMatrix.rotate(90, 1, 0, 0)
  modelMatrix.scale(0.25, 0.25, 0.25)
  drawCircle(
    gl,
    shaders.lightShader,
    buffers.metalCircle,
    light,
    camera,
    modelMatrix
  )
}

/**
 * Draw the front wheel and side cylinders
 */
function drawFrontWheel(renderInfo, camera) {
  const { gl, shaders, buffers, light, stack, animationInfo, flatPack } =
    renderInfo

  // right wheel cylinder
  let modelMatrix = stack.peekMatrix()
  modelMatrix.translate(0, 0.2, 1.4)
  modelMatrix.rotate(120, 0, 1, 0)
  if (!flatPack) {
    // Control the rotation of the steering
    modelMatrix.rotate(animationInfo.handleRotationAngle, 0, 0, 1)
  }
  stack.pushMatrix(modelMatrix)
  modelMatrix.scale(0.08, 0.08, 1.5)
  drawCylinder(
    gl,
    shaders.lightShader,
    buffers.cylinder,
    light,
    camera,
    modelMatrix
  )

  // draw side cylinder circles
  modelMatrix = stack.peekMatrix()
  modelMatrix.rotate(90, 1, 0, 0)
  modelMatrix.scale(0.08, 0.08, 0.08)
  drawCircle(
    gl,
    shaders.lightShader,
    buffers.metalCircle,
    light,
    camera,
    modelMatrix
  )

  modelMatrix = stack.peekMatrix()
  modelMatrix.translate(0, 0, 1.5)
  modelMatrix.rotate(90, 1, 0, 0)
  modelMatrix.scale(0.08, 0.08, 0.08)
  drawCircle(
    gl,
    shaders.lightShader,
    buffers.metalCircle,
    light,
    camera,
    modelMatrix
  )

  // Front wheel
  modelMatrix = stack.peekMatrix()
  modelMatrix.scale(0.8, 0.8, 0.8)
  modelMatrix.translate(0, -0.2, 1.8)
  modelMatrix.rotate(animationInfo.wheelRotationAngle, 0, 1, 0)
  stack.pushMatrix(modelMatrix)
  drawTorus(gl, shaders.lightShader, buffers.torus, light, camera, modelMatrix)

  modelMatrix = stack.peekMatrix()
  drawCircle(gl, shaders.lightShader, buffers.rim, light, camera, modelMatrix)

  // left wheel cylinder
  stack.popMatrix()
  modelMatrix = stack.peekMatrix()
  modelMatrix.translate(0, -0.4, 0)
  modelMatrix.scale(0.08, 0.08, 1.5)
  drawCylinder(
    gl,
    shaders.lightShader,
    buffers.cylinder,
    light,
    camera,
    modelMatrix
  )

  // draw side cylinder circles
  modelMatrix = stack.peekMatrix()
  modelMatrix.translate(0, -0.4, 0)
  modelMatrix.rotate(90, 1, 0, 0)
  modelMatrix.scale(0.08, 0.08, 0.08)
  drawCircle(
    gl,
    shaders.lightShader,
    buffers.metalCircle,
    light,
    camera,
    modelMatrix
  )

  modelMatrix = stack.peekMatrix()
  modelMatrix.translate(0, -0.4, 1.5)
  modelMatrix.rotate(90, 1, 0, 0)
  modelMatrix.scale(0.08, 0.08, 0.08)
  drawCircle(
    gl,
    shaders.lightShader,
    buffers.metalCircle,
    light,
    camera,
    modelMatrix
  )
}

/**
 * Draw the steering pole and handle bars
 */
function drawHandleBars(renderInfo, camera) {
  const { gl, shaders, buffers, light, stack, animationInfo, flatPack } =
    renderInfo

  // steering pole
  let modelMatrix = stack.peekMatrix()
  if (flatPack) {
    // Apply transformation for packing the bike
    modelMatrix.rotate(animationInfo.flatPackSteeringAngle, 0, 1, 0)
  }
  modelMatrix.translate(-1.35, -0.2, -3.55)
  modelMatrix.rotate(20, 0, 1, 0)
  modelMatrix.rotate(90, 0, 0, 1)
  stack.pushMatrix(modelMatrix)
  modelMatrix.scale(0.1, 0.1, 4)
  drawCylinder(
    gl,
    shaders.lightShader,
    buffers.cylinder,
    light,
    camera,
    modelMatrix
  )

  // Draw handle bars
  modelMatrix = stack.peekMatrix()
  modelMatrix.translate(-1, 0, 0)
  modelMatrix.rotate(90, 0, 1, 0)
  stack.pushMatrix(modelMatrix)
  modelMatrix.scale(0.1, 0.1, 2)
  drawCylinder(
    gl,
    shaders.lightShader,
    buffers.cylinder,
    light,
    camera,
    modelMatrix
  )

  // Draw left handle grip
  modelMatrix = stack.peekMatrix()
  modelMatrix.scale(0.11, 0.11, 0.5)
  drawCylinder(
    gl,
    shaders.lightShader,
    buffers.handleBar,
    light,
    camera,
    modelMatrix
  )

  // Draw left handle grip circles
  modelMatrix = stack.peekMatrix()
  modelMatrix.rotate(90, 1, 0, 0)
  modelMatrix.scale(0.11, 0.11, 0.11)
  drawCircle(
    gl,
    shaders.lightShader,
    buffers.handleBarCircle,
    light,
    camera,
    modelMatrix
  )

  // Draw right handle grip
  modelMatrix = stack.peekMatrix()
  modelMatrix.translate(0, 0, 1.5)
  stack.pushMatrix(modelMatrix)
  modelMatrix.scale(0.11, 0.11, 0.5)
  drawCylinder(
    gl,
    shaders.lightShader,
    buffers.handleBar,
    light,
    camera,
    modelMatrix
  )

  // Draw right handle grip circles
  modelMatrix = stack.peekMatrix()
  modelMatrix.translate(0, 0, 0.5)
  modelMatrix.rotate(90, 1, 0, 0)
  modelMatrix.scale(0.11, 0.11, 0.11)
  drawCircle(
    gl,
    shaders.lightShader,
    buffers.handleBarCircle,
    light,
    camera,
    modelMatrix
  )
}

/**
 * Draws a cube shape
 */
function drawCube(gl, shaderInfo, buffers, light, camera, modelMatrix) {
  setupShaderAttributesAndUniforms(
    gl,
    shaderInfo,
    buffers,
    light,
    camera,
    modelMatrix
  )

  gl.drawArrays(gl.TRIANGLES, 0, buffers.vertexCount)
}

/**
 * Draws a torus shape
 */
function drawTorus(gl, shaderInfo, buffers, light, camera, modelMatrix) {
  setupShaderAttributesAndUniforms(
    gl,
    shaderInfo,
    buffers,
    light,
    camera,
    modelMatrix
  )
  gl.drawElements(gl.TRIANGLES, buffers.indicesCount, gl.UNSIGNED_SHORT, 0)
}

/**
 * Draws a circle shape
 */
function drawCircle(gl, shaderInfo, buffers, light, camera, modelMatrix) {
  setupShaderAttributesAndUniforms(
    gl,
    shaderInfo,
    buffers,
    light,
    camera,
    modelMatrix
  )

  gl.drawArrays(gl.TRIANGLE_FAN, 0, buffers.vertexCount)
}

/**
 * Draws a cylinder shape
 */
function drawCylinder(gl, shaderInfo, buffers, light, camera, modelMatrix) {
  setupShaderAttributesAndUniforms(
    gl,
    shaderInfo,
    buffers,
    light,
    camera,
    modelMatrix
  )

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, buffers.vertexCount)
}

/**
 * Clears the WebGL canvas with a specified clear color and depth settings.
 */
function clearCanvas(gl, rgba) {
  gl.clearColor(...rgba)
  gl.clearDepth(1.0)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LESS)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

/**
 * Sets up shader attributes and uniforms for rendering an object.
 */
function setupShaderAttributesAndUniforms(
  gl,
  shaderInfo,
  buffers,
  light,
  camera,
  modelMatrix
) {
  connectPositionAttribute(gl, shaderInfo, buffers.position)
  connectNormalAttribute(gl, shaderInfo, buffers.normal)

  connectAmbientUniform(gl, shaderInfo, light.ambientLightColor)
  connectDiffuseUniform(gl, shaderInfo, light.diffuseLightColor)
  connectLightPosition(gl, shaderInfo, light.lightPosition)

  connectTextureAttribute(
    gl,
    shaderInfo,
    buffers.texture,
    buffers.textureObject
  )

  gl.uniformMatrix4fv(
    shaderInfo.uniformLocations.modelMatrix,
    false,
    modelMatrix.elements
  )

  camera.set()
  let modelviewMatrix = new Matrix4(camera.viewMatrix.multiply(modelMatrix))
  gl.uniformMatrix4fv(
    shaderInfo.uniformLocations.modelViewMatrix,
    false,
    modelviewMatrix.elements
  )
  gl.uniformMatrix4fv(
    shaderInfo.uniformLocations.projectionMatrix,
    false,
    camera.projectionMatrix.elements
  )

  let normalMatrix = mat3.create()
  mat3.normalFromMat4(normalMatrix, modelMatrix.elements)
  gl.uniformMatrix3fv(
    shaderInfo.uniformLocations.normalMatrix,
    false,
    normalMatrix
  )
}

/**
 * Connect the position attribute to the vertex buffer
 */
function connectPositionAttribute(gl, shader, positionBuffer) {
  const numComponents = 3
  const type = gl.FLOAT
  const normalize = false
  const stride = 0
  const offset = 0
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.vertexAttribPointer(
    shader.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  )
  gl.enableVertexAttribArray(shader.attribLocations.vertexPosition)
}

/**
 * Connect the color attribute to the vertex buffer
 */
function connectColorAttribute(gl, shader, colorBuffer) {
  const numComponents = 4
  const type = gl.FLOAT
  const normalize = false
  const stride = 0
  const offset = 0
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.vertexAttribPointer(
    shader.attribLocations.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset
  )
  gl.enableVertexAttribArray(shader.attribLocations.vertexColor)
}

/**
 * Connect the normal attribute to the normal buffer
 */
function connectNormalAttribute(gl, shader, normalBuffer) {
  const numComponents = 3
  const type = gl.FLOAT
  const normalize = false
  const stride = 0
  const offset = 0
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
  gl.vertexAttribPointer(
    shader.attribLocations.vertexNormal,
    numComponents,
    type,
    normalize,
    stride,
    offset
  )
  gl.enableVertexAttribArray(shader.attribLocations.vertexNormal)
}

/**
 * Connect the ambient light uniform to the shader program
 */
function connectAmbientUniform(gl, shader, color) {
  gl.uniform3f(
    shader.uniformLocations.ambientLightColor,
    color.r,
    color.g,
    color.b
  )
}

/**
 * Connect the diffuse light uniform to the shader program
 */
function connectDiffuseUniform(gl, shader, color) {
  gl.uniform3f(
    shader.uniformLocations.diffuseLightColor,
    color.r,
    color.g,
    color.b
  )
}

/**
 * Connect the light position uniform to the shader program
 */
function connectLightPosition(gl, shader, position) {
  gl.uniform3f(
    shader.uniformLocations.lightPosition,
    position.x,
    position.y,
    position.z
  )
}

/**
 * Connect the texture attribute and set the texture object
 */
function connectTextureAttribute(gl, textureShader, buffer, texture) {
  const numComponents = 2
  const type = gl.FLOAT
  const normalize = false
  const stride = 0
  const offset = 0

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.vertexAttribPointer(
    textureShader.attribLocations.vertexTextureCoordinate,
    numComponents,
    type,
    normalize,
    stride,
    offset
  )
  gl.enableVertexAttribArray(
    textureShader.attribLocations.vertexTextureCoordinate
  )

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)

  let samplerLoc = gl.getUniformLocation(
    textureShader.program,
    textureShader.uniformLocations.sampler
  )
  gl.uniform1i(samplerLoc, 0)
}

export default drawScene
