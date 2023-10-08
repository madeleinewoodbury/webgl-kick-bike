/**
 * Represents a WebGL shader program consisting of a vertex shader and a fragment shader.
 * @class
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @param {string} vsSource - The source code of the vertex shader.
 * @param {string} fsSource - The source code of the fragment shader.
 */
class Shader {
  constructor(gl, vsSource, fsSource) {
    this.shaderProgram = null;

    // Compile shaders
    const vertexShader = this.compileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.compileShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Attach compiled shaders to shaderProgram
    this.shaderProgram = gl.createProgram();
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);

    // Link shaderProgram
    gl.linkProgram(this.shaderProgram);

    // Check for errors
    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      alert(
        `Unable to initialize the shader program: ${gl.getProgramInfoLog(
          this.shaderProgram
        )}`
      );
      return null;
    }
  }

  compileShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // Check for compile errors
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(
        `An error occurred compiling the shaders: ${gl.getShaderInfoLog(
          shader
        )}`
      );
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }
}

export default Shader;
