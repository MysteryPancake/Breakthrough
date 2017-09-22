"use strict";

const music = new Audio();
const snap = new Audio("sound/Snap.wav");

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
	const r = Math.floor(Math.random() * 256);
	const g = Math.floor(Math.random() * 256);
	const b = Math.floor(Math.random() * 256);
	return `rgb(${r}, ${g}, ${b})`;
}

function randomHue() {
	const h = Math.floor(Math.random() * 361);
	return `hsl(${h}, 100%, 50%)`;
}

function maxSize(rect) {
	return Math.max(rect.width, rect.height);
}