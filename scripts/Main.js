"use strict";

let manager;
let canvas;
let frame = 0;
let clicking = false;
const requestFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(e) { return window.setTimeout(e, 1000 / 60); };
const cancelFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function(id) { window.clearTimeout(id); };

function fix(e) {
	setupAudio(manager);
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

function move(e) {
	if (!clicking) return;
	manager.clicked(e);
}

function up(e) {
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
		window.addEventListener("touchstart", fix);
		window.addEventListener("touchmove", manager.touched.bind(manager));
		window.addEventListener("touchend", manager.touched.bind(manager));
	} else {
		window.addEventListener("mousedown", fix);
		window.addEventListener("mousemove", move);
		window.addEventListener("mouseup", up);
	}
	window.addEventListener("contextmenu", hide);
}