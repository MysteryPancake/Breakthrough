"use strict";

function randomBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor() {
	var r = Math.floor(Math.random() * 255);
	var g = Math.floor(Math.random() * 255);
	var b = Math.floor(Math.random() * 255);
	return "rgb(" + r + "," + g + "," + b + ")";
}

function randomHue() {
	var h = Math.floor(Math.random() * 360);
	return "hsl(" + h + ", 100%, 50%)";
}

function maxSize(rect) {
	return Math.max(rect.width, rect.height);
}