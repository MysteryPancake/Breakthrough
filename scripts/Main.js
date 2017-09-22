"use strict";

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var frame = 0;
var blocks = [];
var spawnRect = canvas;
var interactive = true;
var blockColor = randomColor();
var backgroundColor = randomColor();

function setup() {
	window.addEventListener("resize", resize);
	window.addEventListener("orientationchange", resize);
	resize();
	window.addEventListener("mousedown", clickBlocks);
	window.addEventListener("mousemove", clickBlocks);
	window.addEventListener("mouseup", clickBlocks);
	window.addEventListener("touchstart", touchBlocks);
	window.addEventListener("touchmove", touchBlocks);
	window.addEventListener("touchend", touchBlocks);
	generateBlocks();
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
			var pos = {x: 0, y: 0};
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
		blocks[i].draw();
	}
	frame = window.requestAnimationFrame(draw);
}

function resize() {
	window.cancelAnimationFrame(frame);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	frame = window.requestAnimationFrame(draw);
}

function touchBlocks(e) {
	e.preventDefault();
	if (!interactive) return;
	for (var t = 0; t < e.touches.length; t++) {
		for (var i = 0; i < blocks.length; i++) {
			var tile = blocks[i];
			if (tile.dying) continue;
			if (tile.touching({x: e.touches[t].pageX, y: e.touches[t].pageY})) {
				tile.kill();
			}
		}
	}
}

function clickBlocks(e) {
	e.preventDefault();
	if (!interactive) return;
	for (var i = 0; i < blocks.length; i++) {
		var tile = blocks[i];
		if (tile.dying) continue;
		if (tile.touching({x: e.pageX, y: e.pageY})) {
			tile.kill();
		}
	}
}