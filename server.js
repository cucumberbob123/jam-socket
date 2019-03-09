let drawing = [];
let timer;
var express = require("express");

var app = express();

var server = app.listen(process.env.PORT || 3000, listen);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(require("cookie-parser")());

function listen() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("Sockets listening at http://" + host + ":" + port);
}

app.use(express.static("website"));

var io = require("socket.io")(server);

const draw = io.sockets.on("connection",
	// We are given a websocket object in our function
	socket => {
		console.log("We have a new client: " + socket.id);

		// When this user emits, client side: socket.emit('otherevent',some data);
		socket.on("mouse", data => {
			drawing.push(data);
			if (timer) clearInterval(timer)
			timer = setInterval(() => {
				drawing = []
			}, 5 * 1000 * 60)
			// Send it to all other clients
			socket.broadcast.emit("mouse", data);
		});
		socket.on("rect", data => {
			socket.broadcast.emit("rect", data);
		});
		socket.on("clear", () => {
			console.log("clearing");
			socket.broadcast.emit("clear");
		});

		socket.on("disconnect", () => {
			console.log("Client has disconnected");
		});
	}
);

app.post("/login", (req, res) => {
	console.log(req.body.password);
	if (req.body.password === "very secure password") {
		res.cookie(
			"authorised", true
		);
	}
	return res.redirect("/");
});

app.get("/authorised", (req, res) => res.json({
	authorised: req.cookies.authorised
}));

app.get("/clear", (req, res) => {
	console.log("clear request");
	if (req.cookies.authorised) {
		console.log("clearing all canvases");
		draw.emit("clear");
		drawing = [];
		return res.status(200).end();
	}
	console.log("not authorised");
	return res.status(200).end();
});

app.get('/load', (req, res) => {
	console.log(drawing.length)
	return res.json(drawing)
})