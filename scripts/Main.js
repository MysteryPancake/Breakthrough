"use strict";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let frame = 0;
let blocks = [];
let spawnRect = canvas;
let interactive = true;
let blockColor = randomColor();
let backgroundColor = randomColor();

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
	const sizeMin = 0.006;
	const sizeMax = 0.01;
	const heightBias = 1.25;
	blocks = [];
	blockColor = backgroundColor;
	backgroundColor = randomColor();
	const heightCount = randomBetween(spawnRect.height * sizeMin * heightBias, spawnRect.height * sizeMax * heightBias);
	const height = spawnRect.height / heightCount;
	for (let j = 0; j < heightCount; j++) {
		const widthCount = randomBetween(spawnRect.width * sizeMin, spawnRect.width * sizeMax);
		const width = spawnRect.width / widthCount;
		for (let i = 0; i < widthCount; i++) {
			const pos = {x: 0, y: 0};
			const x = pos.x + i * width;
			const y = pos.y + j * height;
			const tile = new block(x, y, width, height, blockColor);
			blocks.push(tile);
		}
	}
}

function draw() {
	context.fillStyle = backgroundColor;
	context.fillRect(0, 0, canvas.width, canvas.height);
	for (let i = blocks.length - 1; i >= 0; i--) {
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
	if (!interactive) return;
	for (let t = 0; t < e.touches.length; t++) {
		for (let i = 0; i < blocks.length; i++) {
			const tile = blocks[i];
			if (tile.dying) continue;
			if (tile.touching({x: e.touches[t].pageX, y: e.touches[t].pageY})) {
				tile.kill();
			}
		}
	}
}

function clickBlocks(e) {
	if (!interactive) return;
	for (let i = 0; i < blocks.length; i++) {
		const tile = blocks[i];
		if (tile.dying) continue;
		if (tile.touching({x: e.pageX, y: e.pageY})) {
			tile.kill();
		}
	}
}