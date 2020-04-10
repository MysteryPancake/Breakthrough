"use strict";

function Level(canvas) {
	this.spawnRect = canvas;
	this.interactive = true;
	this.gameOver = false;
	this.clicking = false;
	this.heightBias = 1.25;
	this.sizeMin = 0.006;
	this.sizeMax = 0.01;
	this.blocks = new Set();
	this.score = 0;
	this.generateBlocks = function() {
		this.blocks.clear();
		blockColor = backgroundColor;
		const heightCount = randomBetween(this.spawnRect.height * this.sizeMin * this.heightBias, this.spawnRect.height * this.sizeMax * this.heightBias);
		const height = this.spawnRect.height / heightCount;
		for (let j = 0; j < heightCount; j++) {
			const widthCount = randomBetween(this.spawnRect.width * this.sizeMin, this.spawnRect.width * this.sizeMax);
			const width = this.spawnRect.width / widthCount;
			for (let i = 0; i < widthCount; i++) {
				this.blocks.add(new Block(i * width, j * height, width, height, blockColor));
			}
		}
		backgroundColor = randomColor();
	};
	this.killBlock = function(block) {
		playSnap();
		this.preKilledBlock(block);
		block.dying = true;
	};
	this.preKilledBlock = function() {
		this.score += 1;
	};
	this.touched = function(e) {
		e.preventDefault();
		if (!this.interactive) return;
		for (let t = 0; t < e.targetTouches.length; t++) {
			for (let tile of this.blocks) {
				if (tile.dying) continue;
				if (tile.touching(e.targetTouches[t].pageX, e.targetTouches[t].pageY)) {
					this.killBlock(tile);
				}
			}
		}
	};
	this.clicked = function(e) {
		e.preventDefault();
		if (!this.interactive || !this.clicking) return;
		for (let tile of this.blocks) {
			if (tile.dying) continue;
			if (tile.touching(e.pageX, e.pageY)) {
				this.killBlock(tile);
			}
		}
	};
	this.load = function(game) { // TODO: FIX THIS MESS
		//if (game === 2) {
			//return new Level2(this);
		//}
	};
	this.generateBlocks();
}