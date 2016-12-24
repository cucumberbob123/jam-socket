var socket;

function setup() {
  createCanvas(400, 400);
  background(0);
  socket = io.connect('http://localhost:3000');
  socket.on('mouse',
    function(data) {
      fill(0,0,255);
      noStroke();
      ellipse(data.x, data.y, 20, 20);
    }
  );
}

function draw() {
}

function mouseDragged() {
  fill(255);
  noStroke();
  ellipse(mouseX,mouseY,20,20);
  sendmouse(mouseX,mouseY);
}

function sendmouse(xpos, ypos) {

  // Make a little object with  and y
  var data = {
    x: xpos,
    y: ypos
  };

  // Send that object to the socket
  socket.emit('mouse',data);
}
