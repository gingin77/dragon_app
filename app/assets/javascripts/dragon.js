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
