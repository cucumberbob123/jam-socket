var express = require('express');

var app = express();

var server = app.listen(process.env.PORT || 3000, listen);

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Sockets listening at http://' + host + ':' + port);
}

app.use(express.static('website'));


var io = require('socket.io')(server);

io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {

    console.log("We have a new client: " + socket.id);

    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('mouse',
      function (data) {
        console.log(`Received: x: ${data.x}, y:${data.y}, px: ${data.px}, y: ${data.py}`);

        // Send it to all other clients
        socket.broadcast.emit('mouse', data);
      }
    );

    socket.on('disconnect', function () {
      console.log("Client has disconnected");
    });
  }
);