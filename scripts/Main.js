"use strict";

let manager;
let canvas;
let frame = 0;
let clicking = false;
const requestFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(e) { return window.setTimeout(e, 1000 / 60); };
const cancelFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function(id) { window.clearTimeout(id); };

function fix(e) {
	setupAudio(manager);
	e.preventDefault();
	if (window.ontouchstart) {
		manager.touched(e);
	} else {
		clicking = true;
		manager.clicked(e);
	}
}

function resize() {
	cancelFrame(frame);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	if (manager) {
		manager.resize(canvas.width, canvas.height);
	}
	frame = requestFrame(draw);
}

function hide(e) {
	e.preventDefault();
}

function touch(e) {
	e.preventDefault();
	manager.touched(e);
}

function move(e) {
	if (!clicking) return;
	e.preventDefault();
	manager.clicked(e);
}

function up(e) {
	e.preventDefault();
	manager.clicked(e);
	clicking = false;
}

function draw() {
	manager.draw();
	frame = requestFrame(draw);
}

function setup() {
	canvas = document.getElementById("canvas");
	window.addEventListener("resize", resize);
	window.addEventListener("orientationchange", resize);
	resize();
	manager = new SceneManager(canvas.getContext("2d", { alpha: false }));
	if (window.ontouchstart) {
		window.addEventListener("touchstart", fix, { passive: false });
		window.addEventListener("touchmove", touch, { passive: false });
		window.addEventListener("touchend", touch, { passive: false });
	} else {
		window.addEventListener("mousedown", fix);
		window.addEventListener("mousemove", move);
		window.addEventListener("mouseup", up);
	}
	window.addEventListener("contextmenu", hide);
}