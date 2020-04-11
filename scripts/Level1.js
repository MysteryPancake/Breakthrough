"use strict";

function Level1(scene) { // TODO
	LevelScene.call(this, scene);
	this.drawBlocks = this.draw;
	this.musicStart = Date.now();
	this.musicDuration = playMusic(1, "Intro") * 1000;
	this.draw = function(context, canvas) {
		this.drawBlocks(context);
		const normal = (Date.now() - this.musicStart) / this.musicDuration;
		if (normal < 1) {
			context.fillStyle = "white";
			context.textAlign = "center";
			context.textBaseline = "middle";
			const textScale = 0.5 + (normal * 0.5);
			context.font = minSize(canvas) * textScale + "px Arial";
			context.fillText("1", canvas.width * 0.5, canvas.height * 0.5);
		} else {
			this.scene.loadNextLevel();
		}
	};
	preloadMusic(2, false);
}