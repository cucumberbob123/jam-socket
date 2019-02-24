let socket;
let available = true;

let h = 0
let s = 0
let v = 100

let mode = "";
let effect;

function setup() {
  let canvas = createCanvas(1000, 1000);
  canvas.parent("canvas-holder");
  background(0);
  colorMode(HSB, 100);
  socket = io.connect("https://jam-socket.herokuapp.com");

  socket.on("clear", () => {
    if (available) {
      clearCanvas();
    }
  });

  socket.on("mouse", function (data) {
    strokeWeight(10);
    stroke(data.h, data.s, data.v); //set color to blue
    line(data.x, data.y, data.px, data.py);
  });
}

function draw() {
  // Nothing
}

function mouseDragged() {
  strokeWeight(10)
  stroke(h, s, v)
  line(mouseX, mouseY, pmouseX, pmouseY);
  sendmouse(mouseX, mouseY, pmouseX, pmouseY);

}

function sendmouse(x, y, px, py) {
  var data = {
    x,
    y,
    px,
    py,
    h,
    s,
    v
  };
  // Send that object to the socket
  socket.emit("mouse", data);
}

function clearCanvas() {
  available = false;
  fetch("/clear");
  clear();
  background(0);
  setTimeout(() => (available = true), 5000);
}

function keyTyped() {
  console.log(key);
  if (key === "r") {
    h = s = v = 100;
    mode = "red";
  }
  if (key === "t") {
    mode = "rainbow";
    s = v = 100;
    h = 0;
    effect = setInterval(() => {
      h++;
      if (h === 100) h = 0;
      console.log(h)
    }, 15)
  }
  if (key === "n") {
    clearInterval(effect);
    s = 0;
    v = 100;
    mode = "normal"
  }
  console.log(mode)
}