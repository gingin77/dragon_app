/*
  // Create RectangleDrawer object for drawing within a seperate canvas element from the one that holds the pdf //
  When user clicks, start listening to mousemove
  While mouse moves, draw rect (debounce)
  When user releases mouse, stop listening to mousemove, stop drawing
*/

class RectangleDrawer {
  constructor(target) {
    this.target = target
    this.ctx = target.getContext('2d')
    this.dragging = false

    this._onMouseDown = this.onMouseDown.bind(this)
    this._onMouseUp = this.onMouseUp.bind(this)
    this._onMouseMove = this.onMouseMove.bind(this)

    this.listen()
  }

  getRelativePosition(e) {
    var pos = {
      x: e.clientX - this.target.offsetLeft + window.pageXOffset,
      y: e.clientY - this.target.offsetTop + window.pageYOffset
    }
    return pos
  }

  getBounds() {
    if (this.dragging) {
      return {
        x: this.startPosition.x,
        y: this.startPosition.y,
        width: this.endPosition.x - this.startPosition.x,
        height: this.endPosition.y - this.startPosition.y
      }
    }
  }

  listen() {
    this.target.addEventListener('mousedown', this._onMouseDown)
    this.target.addEventListener('mouseup', this._onMouseUp)
  }

  onMouseDown(e) {
    this.dragging = true
    this.startPosition = this.getRelativePosition(e)
    this.listenForMouseMoves()
  }

  onMouseMove(e) {
    this.endPosition = this.getRelativePosition(e)
    this.update()
  }

  onMouseUp(e) {
    this.dragging = false
    this.endPosition = this.getRelativePosition(e)
    this.stopListeningForMouseMoves()
  }

  listenForMouseMoves() {
    this.target.addEventListener('mousemove', this._onMouseMove)
  }

  stopListeningForMouseMoves() {
    this.target.removeEventListener('mousemove', this._onMouseMove)
  }

  update() {
    let bounds = this.getBounds()

    if (bounds) {
      console.log(bounds)

      this.ctx.clearRect(0, 0, this.target.width, this.target.height);
      this.ctx.strokeStyle = 'green';
      this.ctx.zIndex = 20;
      this.ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    }
  }
}

async function makeDrawableCanvas () {
  try {
    var drawable_canvas = await document.getElementById("myCanvas")
    new RectangleDrawer(drawable_canvas)
  } catch (error) {
    console.log("there's no drawable_canvas")
  }
}
