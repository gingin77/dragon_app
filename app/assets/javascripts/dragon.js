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

function moveAndDrawImageToCanvas(image, target) {
  var ctx = target.getContext('2d')
  image.remove()
  ctx.drawImage(image, 20, 20, 200, 200)
}

let url = '//cdn.mozilla.net/pdfjs/helloworld.pdf';

// // Loaded via <script> tag, create shortcut to access PDF.js exports.
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
