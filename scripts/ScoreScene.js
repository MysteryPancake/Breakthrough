"use strict";

function ScoreScene(scene, score) {
	this.scene = scene;
	this.score = score;
	this.lastSnap = 0;
	this.drawStart = Date.now();
	this.drawScore = 0;
	this.calculateCircle = function(width, height) {
		this.circle = new Path2D();
		this.circle.arc(width * 0.5, height * 0.7, Math.min(width, height) * 0.2, 0, 2 * Math.PI);
	};
	this.resize = function(width, height) {
		this.calculateCircle(width, height);
	};
	this.draw = function(context, canvas) {
		const minimum = minSize(canvas);
		context.fillStyle = "#00000080";
		if (!this.circle) {
			this.calculateCircle(canvas.width, canvas.height);
		}
		context.fill(this.circle);
		context.fillStyle = "white";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.font = minimum * 0.25 + "px Arial";
		context.fillText("►", canvas.width * 0.505, canvas.height * 0.71);
		if (this.score < 1) {
			context.fillText(0, canvas.width * 0.5, canvas.height * 0.25);
		} else {
			if (this.drawScore < this.score) {
				this.drawScore = this.score * Math.min(1, (Date.now() - this.drawStart) / 1000);
				const snapDelay = 10 + Math.max(0, 40 - this.score);
				if (Date.now() - this.lastSnap > snapDelay) {
					playSnap(0.5 + this.drawScore / this.score);
					this.lastSnap = Date.now() + snapDelay;
				}
			}
			const textScale = 0.75 - (this.drawScore / this.score) * 0.5;
			context.font = minimum * textScale + "px Arial";
			context.fillText(Math.floor(this.drawScore), canvas.width * 0.5, canvas.height * 0.25);
		}
	};
	this.checkButton = function(x, y) {
		if (this.scene.context.isPointInPath(this.circle, x, y)) {
			playSnap();
			this.scene.loadNextLevel();
		}
	};
	this.clicked = function(e) {
		if (e.type !== "mousedown") return;
		this.checkButton(e.pageX, e.pageY);
	};
	this.touched = function(e) {
		if (e.type !== "touchstart") return;
		for (let t = 0; t < e.targetTouches.length; t++) {
			this.checkButton(e.targetTouches[t].pageX, e.targetTouches[t].pageY);
		}
	};
}