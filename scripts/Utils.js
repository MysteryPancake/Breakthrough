"use strict";

var music = new Audio();
var snap = new Audio("sound/Snap.wav");

function playMusic(name, level) {
	music.pause();
	music.src = `sound/${level}/${name}.wav`;
	music.currentTime = 0;
	music.play();
}

function playSnap() {
	snap.pause();
	snap.currentTime = 0;
	snap.play();
}

function randomBetween(min, max) {
	return Math.floor(max - Math.random() * (max - min));
}

function randomColor() {
	var r = Math.floor(Math.random() * 256);
	var g = Math.floor(Math.random() * 256);
	var b = Math.floor(Math.random() * 256);
	return `rgb(${r}, ${g}, ${b})`;
}

function randomHue() {
	var h = Math.floor(Math.random() * 361);
	return `hsl(${h}, 100%, 50%)`;
}

function maxSize(rect) {
	return Math.max(rect.width, rect.height);
}