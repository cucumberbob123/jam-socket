var socket;

function setup() {
  createCanvas(1000, 1000);
  background(0);
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect('https://jam-socket.herokuapp.com');
  // We make a named event called 'mouse' and write an
  // anonymous callback function
  socket.on('mouse',
    // When we receive data
    function (data) {
      console.log(data);
      // Draw a blue circle
      strokeWeight(10);
      stroke(0, 100, 255)
      line(data.x, data.y, data.px, data.py);
    }
  );
}

function draw() {
  // Nothing
}

function mouseDragged() {
  // Draw some white circles
  strokeWeight(10);
  stroke(255)
  line(mouseX, mouseY, pmouseX, pmouseY);
  // Send the mouse coordinates
  sendmouse(mouseX, mouseY, pmouseX, pmouseY);
}

// Function for sending to the socket
function sendmouse(x, y, px, py) {
  // We are sending!
  console.log("sendmouse: " + x + " " + y);

  // Make a little object with  and y
  var data = {
    x,
    y,
    px,
    py
  };
  console.log(data)
  // Send that object to the socket
  socket.emit('mouse', data);
}