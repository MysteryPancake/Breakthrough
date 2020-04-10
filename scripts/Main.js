"use strict";

let game;
let canvas;
let context;
let frame = 0;
let blockColor = randomColor();
let backgroundColor = randomColor();
const requestFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(e) { return window.setTimeout(e, 1000 / 60); };
const cancelFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function(id) { window.clearTimeout(id); };

function fix(e) {
	setupAudio();
	if (window.ontouchstart) {
		game.touched(e);
	} else {
		game.clicking = true;
		game.clicked(e);
	}
}

function resize() {
	cancelFrame(frame);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	frame = requestFrame(draw);
}

function hide(e) {
	e.preventDefault();
}

function up(e) {
	game.clicked(e);
	game.clicking = false;
}

function draw() {
	context.fillStyle = backgroundColor;
	context.fillRect(0, 0, canvas.width, canvas.height);
	for (let tile of game.blocks) {
		tile.update();
		if (tile.width < 1 || tile.height < 1) {
			game.blocks.delete(tile);
			if (game.blocks.size <= 0) {
				game.generateBlocks();
			}
		}
		tile.draw(context);
	}
	frame = requestFrame(draw);
}

function setup() {
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d", { alpha: false });
	window.addEventListener("resize", resize);
	window.addEventListener("orientationchange", resize);
	resize();
	game = new Level(canvas);
	//game.load(2);
	if (window.ontouchstart) {
		window.addEventListener("touchstart", fix);
		window.addEventListener("touchmove", game.touched.bind(game));
		window.addEventListener("touchend", game.touched.bind(game));
	} else {
		window.addEventListener("mousedown", fix);
		window.addEventListener("mousemove", game.clicked.bind(game));
		window.addEventListener("mouseup", up);
	}
	window.addEventListener("contextmenu", hide);
}