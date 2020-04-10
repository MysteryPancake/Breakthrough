"use strict";

function randomBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor() {
	const r = Math.floor(Math.random() * 255);
	const g = Math.floor(Math.random() * 255);
	const b = Math.floor(Math.random() * 255);
	return "rgb(" + r + "," + g + "," + b + ")";
}

function randomHue() {
	const h = Math.floor(Math.random() * 360);
	return "hsl(" + h + ", 100%, 50%)";
}

function maxSize(rect) {
	return Math.max(rect.width, rect.height);
}