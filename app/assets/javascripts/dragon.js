// added to the div and the canvas with 'ondragstart: "drag(event)" '
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

// added to the div and the canvas with ondragover="allowDrop(event)"
function allowDrop(ev) {
  ev.preventDefault();
}

// added to the div and the canvas with ondrop="drop(event)"
function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  debugger
  if (ev.target.tagName == "CANVAS") {
    moveAndDrawImageToCanvas(document.getElementById(data), ev.target)
   } else {
     ev.target.appendChild(document.getElementById(data));
   }
}

// handles what happens when the dragon image is placed in pdf-holding canvas
function moveAndDrawImageToCanvas(image, target) {
  var ctx = target.getContext('2d')
  image.remove()
  ctx.drawImage(image, 20, 20, 200, 200)
}

let url = '//cdn.mozilla.net/pdfjs/helloworld.pdf';

// Loaded via <script> tag, create shortcut to access PDF.js exports.
let pdfjsLib = window['pdfjs-dist/build/pdf'];
console.log(pdfjsLib)

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

// Asynchronous download of PDF
var loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(function(pdf) {
  console.log('PDF loaded');

  // Fetch the first page
  var pageNumber = 1;
  pdf.getPage(pageNumber).then(function(page) {
    console.log('Page loaded');

    var scale = 1.5;
    var viewport = page.getViewport(scale);

    // Prepare canvas using PDF page dimensions
    var canvas = document.getElementById('the-canvas');
    var context = canvas.getContext('2d');
    // Does .getContext come from the pdf.js library? I was seeing errors on this when the pdf.worker file wasn't working

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);
    renderTask.then(function () {
      console.log('Page rendered');
    });

    canvas.onclick = function(e){
      var pageCoords = "( " + e.pageX + ", " + e.pageY + " )";
      console.log(pageCoords);
    };
  });
}, function (reason) {
  // PDF loading error
  console.error(reason);
});

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
      x: e.pageX - this.target.offsetLeft,
      y: e.pageY - this.target.offsetTop
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
    debugger
    this.dragging = true
    this.startPosition = this.getRelativePosition(e)
    this.listenForMouseMoves()
  }

  onMouseUp(e) {
    this.dragging = false
    this.endPosition = this.getRelativePosition(e)
    this.stopListeningForMouseMoves()
  }

  onMouseMove(e) {
    this.endPosition = this.getRelativePosition(e)
    this.update()
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
      this.ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    }
  }
}

var canvas = document.getElementById('myCanvas')

new RectangleDrawer(canvas)
