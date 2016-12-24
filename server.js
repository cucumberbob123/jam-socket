var express = require('express');

var app = express();
var port = process.env.PORT || 8080;
var server = app.listen(port, listening);

function listening() {
  console.log("listening... ");

}

app.use(express.static('website'));

var io = require("socket.io")(server);

io.sockets.on("connection",
function (socket) {
  console.log("We have a new client: " + socket.id);

  socket.on("mouse",
    function (data) {
      socket.broadcast.emit(data);
    }
  )
}
)
