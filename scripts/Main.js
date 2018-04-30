"use strict";

var canvas;
var context;
var spawnRect;
var frame = 0;
var blocks = [];
var interactive = true;
var blockColor = randomColor();
var backgroundColor = randomColor();
var requestFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(e) { return window.setTimeout(e, 1000 / 60); };
var cancelFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function(id) { window.clearTimeout(id); };

function setup() {
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d", { alpha: false });
	spawnRect = canvas; // debug stuff
	window.addEventListener("resize", resize);
	window.addEventListener("orientationchange", resize);
	resize();
	window.addEventListener("touchstart", touched);
	window.addEventListener("touchmove", touched);
	window.addEventListener("touchend", touched);
	window.addEventListener("mousedown", clicked);
	window.addEventListener("mousemove", clicked);
	window.addEventListener("mouseup", clicked);
	generateBlocks();
	setupAudio();
}

function resize() {
	cancelFrame(frame);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	frame = requestFrame(draw);
}

function touched(e) {
	e.preventDefault();
	if (!interactive) return;
	for (var t = 0; t < e.targetTouches.length; t++) {
		for (var i = 0; i < blocks.length; i++) {
			var tile = blocks[i];
			if (tile.dying) continue;
			if (tile.touching({ x: e.targetTouches[t].pageX, y: e.targetTouches[t].pageY })) {
				tile.kill();
			}
		}
	}
}

function clicked(e) {
	e.preventDefault();
	if (!interactive) return;
	for (var i = 0; i < blocks.length; i++) {
		var tile = blocks[i];
		if (tile.dying) continue;
		if (tile.touching({ x: e.pageX, y: e.pageY })) {
			tile.kill();
		}
	}
}

function generateBlocks() {
	var sizeMin = 0.006;
	var sizeMax = 0.01;
	var heightBias = 1.25;
	blocks = [];
	blockColor = backgroundColor;
	backgroundColor = randomColor();
	var heightCount = randomBetween(spawnRect.height * sizeMin * heightBias, spawnRect.height * sizeMax * heightBias);
	var height = spawnRect.height / heightCount;
	for (var j = 0; j < heightCount; j++) {
		var widthCount = randomBetween(spawnRect.width * sizeMin, spawnRect.width * sizeMax);
		var width = spawnRect.width / widthCount;
		for (var i = 0; i < widthCount; i++) {
			var pos = { x: 0, y: 0 };
			var x = pos.x + i * width;
			var y = pos.y + j * height;
			var tile = new block(x, y, width, height, blockColor);
			blocks.push(tile);
		}
	}
}

function draw() {
	context.fillStyle = backgroundColor;
	context.fillRect(0, 0, canvas.width, canvas.height);
	for (var i = blocks.length - 1; i >= 0; i--) {
		var tile = blocks[i];
		tile.update();
		if (tile.width < 1 || tile.height < 1) {
			blocks.splice(i, 1);
			if (blocks.length <= 0) {
				generateBlocks();
			}
		}
		tile.draw(context);
	}
	frame = requestFrame(draw);
}