let socket;
let available = true;

let r = 0;
let g = 100;
let b = 255;

function setup() {
  let canvas = createCanvas(1000, 1000);
  canvas.parent("canvas-holder")
  background(0);

  socket = io.connect('localhost:3000');

  socket.on('clear', () => {
    if (available) {
      clearCanvas()
    }
  })


  socket.on('mouse',
    function (data) {
      console.log(data);
      strokeWeight(10);
      stroke(data.r, data.g, data.b) //set color to blue
      line(data.x, data.y, data.px, data.py);
    }
  );
}

function draw() {
  // Nothing
}

function mouseDragged() {
  strokeWeight(10);
  stroke(255); //set color to white
  line(mouseX, mouseY, pmouseX, pmouseY);
  sendmouse(mouseX, mouseY, pmouseX, pmouseY);
}

function sendmouse(x, y, px, py) {
  var data = {
    x,
    y,
    px,
    py,
    r: r,
    g: g,
    b: b
  };
  console.log(data)
  // Send that object to the socket
  socket.emit('mouse', data);
}

function clearCanvas() {
  available = false;
  fetch("/clear")
  clear();
  background(0);
  setTimeout(() => available = true, 5000)
}

async function authorised() {
  return await fetch("/authorised").then(res => res.json()).then(data => data.authorised)
}

function keyTyped() {
  console.log(key)
  if (key === "r") {
    console.log("r")
    r = 255
    g = 0
    b = 0
  }
}