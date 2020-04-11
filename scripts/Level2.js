"use strict";

function Level2(scene) {
	LevelScene.call(this, scene);
	this.drawBlocks = this.draw;
	playMusic(2);
	this.setTime = Date.now() + 60000;
	this.padTime = function(num, size) {
		return ("000" + num).slice(-size);
	};
	this.niceTime = function(timeInSeconds) {
		const time = parseFloat(timeInSeconds).toFixed(3);
		const minutes = Math.floor(time / 60) % 60;
		const seconds = Math.floor(time - minutes * 60);
		const milliseconds = time.slice(-3);
		return this.padTime(minutes, 2) + ":" + this.padTime(seconds, 2) + "." + this.padTime(milliseconds, 3);
	};
	this.draw = function(context, canvas) {
		this.drawBlocks(context);
		context.fillStyle = "white";
		context.textAlign = "center";
		context.textBaseline = "top";
		context.font = minSize(canvas) * 0.1 + "px Arial";
		const drawTime = this.setTime - Date.now();
		if (drawTime <= 0) {
			this.gameOver();
		} else {
			context.fillText(this.niceTime(drawTime / 1000), canvas.width * 0.5, 0);
		}
	};
	preloadMusic(3, true);
}