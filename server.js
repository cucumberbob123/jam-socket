var express = require('express');

var app = express();

var server = app.listen(process.env.PORT || 3000, listen);

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(require('cookie-parser')());

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Sockets listening at http://' + host + ':' + port);
}

app.use(express.static('website'));

var io = require('socket.io')(server);

let sockets = [];
const draw = io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {
    const index = sockets.length;
    console.log(sockets)
    console.log("We have a new client: " + socket.id);

    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('mouse',
      function (data) {
        console.log(`Received: x: ${data.x}, y:${data.y}, px: ${data.px}, y: ${data.py}`);

        // Send it to all other clients
        socket.broadcast.emit('mouse', data);
      }
    );

    socket.on('clear', () => {
      console.log("clearing")
      socket.broadcast.emit('clear');
    })

    socket.on('disconnect', function () {
      console.log("Client has disconnected");
    });
  }
)

app.post("/login", (req, res) => {
  console.log(req.body.password === "very secure password")
  if (req.body.password === "very secure password") {
    res.cookie(
      "authorised", true
    )
  }
  return res.json({
    foo: "bar"
  })
})

app.get("/authorised", (req, res) => res.json({
  authorised: req.cookies.authorised
}))

app.get("/clear", (req, res) => {
  if (req.cookies.authorised) {
    draw.emit("clear")
    return res.status(200).end()
  }
  return res.status(200).end()
})