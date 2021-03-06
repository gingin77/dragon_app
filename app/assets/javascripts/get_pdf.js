// get url for the HelloWorld pdf
let url = '//cdn.mozilla.net/pdfjs/tracemonkey.pdf';

// Loaded via <script> tag, create shortcut to access PDF.js exports.
let pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.489/pdf.worker.js'

// Asynchronous download of PDF
var loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(function(pdf) {
  console.log('PDF loaded');

  // Fetch the first page
  var pageNumber = 1;
  pdf.getPage(pageNumber).then(function(page) {
    console.log('Page loaded');

    var scale = 1;
    var viewport = page.getViewport(scale);

    // Prepare canvas using PDF page dimensions
    var canvas = document.getElementById('the-canvas');
    var context = canvas.getContext('2d');

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
      makeCanvas(canvas);
    });
  });
}, function (reason) {
  // PDF loading error
  console.error(reason);
});

function makeCanvas(pdf_canvas) {
  if (document.getElementById("show")) {
    var drawable_canvas = document.createElement('canvas')
    drawable_canvas.setAttribute("id", "myCanvas")

    drawable_canvas.height = pdf_canvas.height
    drawable_canvas.width = pdf_canvas.width

    var parent = document.getElementById("show")
    parent.appendChild(drawable_canvas)
    makeDrawableCanvas();
  }
}
