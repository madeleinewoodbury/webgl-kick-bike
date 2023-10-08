import Shader from './helpers/Shader.js'
import { baseShaders, phongTextureShaders } from './shaders.js'

/**
 * Initializes and returns the WebGL shaders for the application
 */
export default function initShaders(gl) {
  return {
    baseShader: initBaseShaders(gl),
    lightShader: initLightShaders(gl),
  }
}

/**
 * Initializes and returns WebGL shader program information, attribute,
 * and uniform locations using the base shaders
 */
function initBaseShaders(gl) {
  const { vsSource, fsSource } = baseShaders
  const shader = new Shader(gl, vsSource, fsSource)

  return {
    program: shader.shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(
        shader.shaderProgram,
        'aVertexPosition'
      ),
      vertexColor: gl.getAttribLocation(shader.shaderProgram, 'aVertexColor'),
    },

    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shader.shaderProgram,
        'uProjectionMatrix'
      ),
      modelViewMatrix: gl.getUniformLocation(
        shader.shaderProgram,
        'uModelViewMatrix'
      ),
    },
  }
}

/**
 * Initializes and returns WebGL shader program information, attribute,
 * and uniform locations using the phong texture shaders
 */
function initLightShaders(gl) {
  const { vsSource, fsSource } = phongTextureShaders
  const shader = new Shader(gl, vsSource, fsSource)

  return {
    program: shader.shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(
        shader.shaderProgram,
        'aVertexPosition'
      ),
      vertexNormal: gl.getAttribLocation(shader.shaderProgram, 'aVertexNormal'),
      vertexTextureCoordinate: gl.getAttribLocation(
        shader.shaderProgram,
        'aVertexTextureCoordinate'
      ),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shader.shaderProgram,
        'uProjectionMatrix'
      ),
      modelViewMatrix: gl.getUniformLocation(
        shader.shaderProgram,
        'uModelViewMatrix'
      ),
      modelMatrix: gl.getUniformLocation(shader.shaderProgram, 'uModelMatrix'),
      normalMatrix: gl.getUniformLocation(
        shader.shaderProgram,
        'uNormalMatrix'
      ),

      lightPosition: gl.getUniformLocation(
        shader.shaderProgram,
        'uLightPosition'
      ),
      ambientLightColor: gl.getUniformLocation(
        shader.shaderProgram,
        'uAmbientLightColor'
      ),
      diffuseLightColor: gl.getUniformLocation(
        shader.shaderProgram,
        'uDiffuseLightColor'
      ),

      sampler: gl.getUniformLocation(shader.shaderProgram, 'uSampler'),
    },
  }
}
