"use strict";

function Level0(scene) {
	LevelScene.call(this, scene);
	this.restartGame = function() {
		this.scene.blockColor = this.scene.backgroundColor;
		this.scene.restoreProgress();
	};
}