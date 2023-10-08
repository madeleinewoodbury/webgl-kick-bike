'use-strict'
import Canvas from './helpers/Canvas.js'
import ImageLoader from './helpers/ImageLoader.js'
import Camera from './helpers/Camera.js'
import Stack from './helpers/Stack.js'
import initShaders from './initShaders.js'
import initBuffers from './initBuffers.js'
import { allImagesArePOT } from './lib/utils.js'
import drawScene from './drawScene.js'

/**
 * The main entry point of the application. Sets up the canvas, WebGL context,
 * shader info, buffers, and initiates the animation loop.
 */
function main() {
  const canvas = new Canvas('canvas')
  const imageLoader = new ImageLoader()
  const urls = [
    './textures/wheel.png',
    './textures/metal.png',
    './textures/black.png',
  ]

  imageLoader.load((images) => {
    if (allImagesArePOT(images)) {
      const renderInfo = {
        gl: canvas.gl,
        shaders: initShaders(canvas.gl),
        buffers: initBuffers(canvas.gl, images),

        stack: new Stack(),
        currentlyPressedKeys: [],
        lastTime: 0,
        fpsInfo: {
          frameCount: 0,
          lastTimeStamp: 0,
        },
        light: {
          lightPosition: { x: 5, y: 5, z: 10 },
          diffuseLightColor: { r: 0.2, g: 0.2, b: 0.2 },
          ambientLightColor: { r: 0, g: 0, b: 0, a: 1 },
        },
        animationInfo: {
          handleRotationAngle: 0,
          wheelRotationAngle: 0,
          bikePosition: 0,
          flatPackCylinderBaseAngle: 25,
          flatPackSteeringAngle: 0,
        },
        flatPack: false,
        unpack: false,
      }
      const camera = new Camera(renderInfo.gl)
      camera.setPosition(10, 13, 7)
      camera.setUp(0, 0, 1)
      initKeyPress(renderInfo)
      animate(0, renderInfo, camera)
    } else {
      console.log('Wrong image size')
    }
  }, urls)
}

/**
 * Initializes event listeners to track keyboard key presses for camera and bike movement.
 */
function initKeyPress(renderInfo) {
  document.addEventListener(
    'keyup',
    (event) => {
      renderInfo.currentlyPressedKeys[event.code] = false
    },
    false
  )
  document.addEventListener(
    'keydown',
    (event) => {
      renderInfo.currentlyPressedKeys[event.code] = true
    },
    false
  )

  const switchBtn = document.querySelector('#flatPackSwitch')
  switchBtn.addEventListener('click', (e) => {
    e.preventDefault()
    if (!renderInfo.flatPack) {
      renderInfo.flatPack = true
    } else if (!renderInfo.unpack) {
      renderInfo.unpack = true
    }

    updateFlatPackToggle()
  })
}

/**
 * Handles keyboard input to control bike steering, wheel rotation and bike movement
 */
function handleKeys(renderInfo) {
  const { currentlyPressedKeys, animationInfo } = renderInfo
  if (currentlyPressedKeys['ArrowRight']) {
    if (animationInfo.handleRotationAngle < 45)
      animationInfo.handleRotationAngle += 1
  }
  if (currentlyPressedKeys['ArrowLeft']) {
    if (animationInfo.handleRotationAngle > -45)
      animationInfo.handleRotationAngle -= 1
  }
  if (currentlyPressedKeys['ArrowUp']) {
    animationInfo.wheelRotationAngle += 2
    animationInfo.bikePosition += 0.05
  }
  if (currentlyPressedKeys['ArrowDown']) {
    animationInfo.wheelRotationAngle -= 2
    animationInfo.bikePosition -= 0.05
  }

  animationInfo.wheelRotationAngle %= 360
}

/**
 * The animation loop that continuously updates and renders the scene.
 * */
function animate(currentTime, renderInfo, camera) {
  window.requestAnimationFrame((currentTime) => {
    animate(currentTime, renderInfo, camera)
  })

  calculateFps(currentTime, renderInfo.fpsInfo)
  camera.handleKeys(renderInfo.currentlyPressedKeys)
  if (renderInfo.flatPack) {
    flatPackAnimate(renderInfo)
  } else {
    handleKeys(renderInfo)
  }
  drawScene(renderInfo, camera)
}

/**
 * Update animation iformation for packing and unpacking the bike
 * */
function flatPackAnimate(renderInfo) {
  if (renderInfo.flatPack && !renderInfo.unpack) {
    if (renderInfo.animationInfo.flatPackCylinderBaseAngle > 0) {
      renderInfo.animationInfo.flatPackCylinderBaseAngle -= 0.625
    }
    if (renderInfo.animationInfo.flatPackSteeringAngle > -50) {
      renderInfo.animationInfo.flatPackSteeringAngle -= 1
    }
  } else if (renderInfo.flatPack && renderInfo.unpack) {
    if (renderInfo.animationInfo.flatPackCylinderBaseAngle < 25)
      renderInfo.animationInfo.flatPackCylinderBaseAngle += 0.624
    if (renderInfo.animationInfo.flatPackSteeringAngle < 0)
      renderInfo.animationInfo.flatPackSteeringAngle += 1
    if (
      renderInfo.animationInfo.flatPackCylinderBaseAngle >= 25 &&
      renderInfo.animationInfo.flatPackSteeringAngle >= 0
    ) {
      renderInfo.unpack = false
      renderInfo.flatPack = false
    }
  }
}

/**
 * Calculate and display FPS
 */
function calculateFps(currentTime, fpsInfo) {
  if (!currentTime) currentTime = 0

  if (currentTime - fpsInfo.lastTimeStamp >= 1000) {
    document.getElementById('fps').innerHTML = fpsInfo.frameCount
    fpsInfo.frameCount = 0
    fpsInfo.lastTimeStamp = currentTime
  }
  fpsInfo.frameCount++
}

/**
 * Update the toggle icon and text for the flatpack functionality
 */
function updateFlatPackToggle() {
  const packDown = document.querySelector('#packDown')
  const packUp = document.querySelector('#packUp')
  const shaderTitle = document.querySelector('#shaderTitle')

  if (packDown.classList.contains('hide')) {
    packDown.classList.remove('hide')
    packUp.classList.add('hide')
    shaderTitle.innerHTML = 'Flatpack'
    return false
  } else {
    packUp.classList.remove('hide')
    packDown.classList.add('hide')
    shaderTitle.innerHTML = 'Unpack'
    return true
  }
}

/**
 * Initializes the application when the DOM content is loaded and adds an event
 * listener to reset the application when the shader toggle icon is clicked.
 */
document.addEventListener('DOMContentLoaded', () => {
  main()
})
