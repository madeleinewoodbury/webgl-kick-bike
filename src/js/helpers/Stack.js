/**
 * Represents a stack data structure for managing matrices.
 * This stack is used for storing and manipulating matrices in a hierarchical manner.
 */
class Stack {
  constructor() {
    this.matrixStack = [];
  }

  // Adds a matrix to the stack.
  pushMatrix(matrix) {
    let copyToPush = new Matrix4(matrix);
    this.matrixStack.push(copyToPush);
  }

  // Removes the top element from the stack.
  popMatrix() {
    if (this.matrixStack.length == 0)
      throw 'Error in popMatrix - the matrix stack is empty!'
    this.matrixStack.pop();
  }

  // Reads and returns the top matrix. Note: It does not remove it.
  peekMatrix() {
    if (this.matrixStack.length == 0)
      throw 'Error in peekMatrix - the matrix stack is empty!';
    let matrix = new Matrix4(this.matrixStack[this.matrixStack.length - 1]);
    return matrix;
  }

  // Empties the matrix stack.
  empty() {
    this.matrixStack = [];
  }
}

export default Stack;
