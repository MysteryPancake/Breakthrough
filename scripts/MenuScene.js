"use strict";

function MenuScene(scene) {
	this.scene = scene;
	this.rows = 2;
	this.columns = 3;
	this.drawButton = function(context, text, x, y, w, h) {
		context.fillStyle = "#00000080";
		context.fillRect(x, y, w, h);
		context.fillStyle = "white";
		context.font = Math.min(w, h) * 0.5 + "px Arial";
		context.fillText(text, x + w * 0.5, y + h * 0.5);
	};
	this.resize = function(width, height) {
		this.rows = width > height ? 3 : 2;
		this.columns = width > height ? 2 : 3;
	};
	this.draw = function(context, canvas) {
		const margin = minSize(canvas) * 0.01;
		const divideX = (canvas.width - margin) / this.rows;
		const divideY = (canvas.height - margin) / this.columns;
		context.textAlign = "center";
		context.textBaseline = "middle";
		let level = 1;
		for (let i = 0; i < this.columns; i++) {
			for (let j = 0; j < this.rows; j++) {
				this.drawButton(context, level, j * divideX + margin, i * divideY + margin, divideX - margin, divideY - margin);
				level++;
			}
		}
	};
	this.touching = function(x1, y1, x, y, w, h) {
		return x1 > x && x1 < x + w && y1 > y && y1 < y + h;
	};
	this.checkButton = function(x, y) {
		let level = 1;
		const w = this.scene.canvas.width / this.rows;
		const h = this.scene.canvas.height / this.columns;
		for (let i = 0; i < this.columns; i++) {
			for (let j = 0; j < this.rows; j++) {
				if (this.touching(x, y, j * w, i * h, w, h)) {
					playSnap();
					this.scene.loadLevel(level);
					break;
				}
				level++;
			}
		}
	};
	this.clicked = function(e) {
		if (e.type !== "mousedown") return;
		this.checkButton(e.pageX, e.pageY);
	};
	this.touched = function(e) {
		if (e.type !== "touchstart") return;
		for (let t = 0; t < e.touches.length; t++) {
			this.checkButton(e.touches[t].pageX, e.touches[t].pageY);
		}
	};
}