"use strict";

var game;
var canvas;
var context;
var frame = 0;
var blockColor = randomColor();
var backgroundColor = randomColor();
var requestFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(e) { return window.setTimeout(e, 1000 / 60); };
var cancelFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function(id) { window.clearTimeout(id); };

function setup() {
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d", { alpha: false });
	window.addEventListener("resize", resize);
	window.addEventListener("orientationchange", resize);
	resize();
	game = new Level(canvas);
	game.load(2);
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

function hide(e) {
	e.preventDefault();
}

function resize() {
	cancelFrame(frame);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	frame = requestFrame(draw);
}

function fix(e) {
	setupAudio();
	if (window.ontouchstart) {
		game.touched(e);
	} else {
		game.clicking = true;
		game.clicked(e);
	}
}

function up(e) {
	game.clicked(e);
	game.clicking = false;
}

function draw() {
	context.fillStyle = backgroundColor;
	context.fillRect(0, 0, canvas.width, canvas.height);
	for (var i = game.blocks.length - 1; i >= 0; i--) {
		var tile = game.blocks[i];
		tile.update();
		if (tile.width < 1 || tile.height < 1) {
			game.blocks.splice(i, 1);
			if (game.blocks.length <= 0) {
				game.generateBlocks();
			}
		}
		tile.draw(context);
	}
	frame = requestFrame(draw);
}