/**
 * Represents an HTML canvas for WebGL rendering.
 * @class
 * @param {string} id - The HTML id of the canvas element.
 */
class Canvas {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.gl = this.canvas.getContext('webgl2', { stencil: true });

    if (!this.gl)
      alert(
        'Unable to initialize WebGL. Your browser or machine may not support it.'
      );
  }
}

export default Canvas;
