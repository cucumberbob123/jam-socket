let socket;
let available = true;

let h = 0;
let s = 0;
let v = 100;

let mode = "";
let effect;

let squareCoordinates, circleCoordinates;

function setup() {
	const slider = document.getElementById("slide");
	slider.oninput = handleSlide;
	let canvas = createCanvas(1000, 1000);
	canvas.parent("canvas-holder");
	background(0);
	colorMode(HSB, 100);
	load();
	socket = io.connect("localhost:3000");

	socket.on("clear", () => {
		if (available) {
			clearCanvas();
		}
	});

	socket.on("mouse", function (data) {
		strokeWeight(10);
		stroke(data.h, data.s, data.v);
		line(data.x, data.y, data.px, data.py);
	});

	socket.on("rect", data => {
		console.log(data);
		fill(h, s, v);
		stroke(h, s, v);
		rect(data.x, data.y, data.px, data.py);
	});
}

function draw() {}

function mouseDragged() {
	strokeWeight(10);
	stroke(h, s, v);
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
	fetch("/clear").then(() => {

		clear();
		background(0);
	})
	setTimeout(() => (available = true), 5000);
}

function keyTyped() {
	console.log(key);
	if (key === "r") {
		h = s = v = 100;
		mode = "red";
		updateLine();
	}
	if (key === "t") {
		mode = "rainbow";
		s = v = 100;
		h = 0;
		clearInterval(effect)
		effect = setInterval(() => {
			h++;
			if (h === 100) h = 0;
			updateLine();

		}, 15);
	}
	if (key === "n") {
		clearInterval(effect);
		s = 0;
		v = 100;
		mode = "normal";
		updateLine();
	}
	if (key === "s") {
		console.log(squareCoordinates);
		if (!squareCoordinates) {
			squareCoordinates = [mouseX, mouseY];
		} else {
			fill(h, s, v);
			stroke(h, s, v);
			squareCoordinates[2] = 20;
			squareCoordinates[3] = 20;
			rect(squareCoordinates[0], squareCoordinates[1], mouseX - squareCoordinates[0], mouseY - squareCoordinates[1]);
			sendRect(squareCoordinates[0], squareCoordinates[1], mouseX - squareCoordinates[0], mouseY - squareCoordinates[1]);
			squareCoordinates = undefined;
		}
		mode = "square";
	}
	if (key === "c") {
		if (!circleCoordinates) {
			circleCoordinates = [mouseX, mouseY];
		} else {
			fill(h, s, v);
			stroke(h, s, v);
			xSize = (circleCoordinates[0] - mouseX);
			ySize = (circleCoordinates[1] - mouseY);

			size = sqrt((Math.pow(xSize, 2)) + (Math.pow)) / 2;

			x = circleCoordinates[0] + (xSize / 2);
			y = circleCoordinates[1] + (ySize / 2);
			ellipse(x, y, xSize, ySize);
			circleCoordinates = undefined;
		}
		mode = "circle";
	}
	console.log(mode);
}

function handleSlide() {
	s = v = 100;
	h = this.value;
	updateLine();
}

function updateLine() {
	strokeWeight(10);
	stroke(h, s, v);
	line(1000, 0, 1000, 1000);
}

function sendRect(x, y, px, py) {
	socket.emit("rect", {
		x,
		y,
		px,
		py,
		h,
		s,
		v
	});
}

let rectangle, circle;

function mouseMoved() {
	if (mode === "square") {
		if (rectangle) remove(rectangle);
		fill(h, s, v);
		stroke(h, s, v);
		rect(squareCoordinates[0], squareCoordinates[1], mouseX - squareCoordinates[0], mouseY - squareCoordinates[1]);
	}
	if (mode === "circle") {
		if (circle) remove(circle);
		fill(h, s, v);
		stroke(h, s, v);
		fill(h, s, v);
		stroke(h, s, v);
		let xSizen = (circleCoordinates[0] - mouseX);
		let ySizen = (circleCoordinates[1] - mouseY);

		let sizen = sqrt((Math.pow(xSizen, 2)) + (Math.pow(ySizen, 2))) / 2;

		let xn = circleCoordinates[0] - (xSizen / 2);
		let yn = circleCoordinates[1] - (ySizen / 2);
		ellipse(xn, yn, sizen);
	}
}

function load() {
	const start = Date.now()
	fetch('/load').then(data => data.json()).then(res => {
		const loopStart = Date.now()
		for (let i in res) {
			const data = res[i]
			strokeWeight(10);
			stroke(data.h, data.s, data.v);
			line(data.x, data.y, data.px, data.py);
		}
		finish = Date.now()
		console.log(`Total Load Time: ${finish - start}`)
		console.log(`Request Took: ${loopStart - start}`)
		console.log(`Render Load Time: ${finish - loopStart}`)
	})
}