"use strict";

function Level(canvas) {
	this.spawnRect = canvas;
	this.interactive = true;
	this.gameOver = false;
	this.clicking = false;
	this.heightBias = 1.25;
	this.sizeMin = 0.006;
	this.sizeMax = 0.01;
	this.blocks = [];
	this.score = 0;
	this.generateBlocks = function() {
		this.blocks = [];
		blockColor = backgroundColor;
		var heightCount = randomBetween(this.spawnRect.height * this.sizeMin * this.heightBias, this.spawnRect.height * this.sizeMax * this.heightBias);
		var height = this.spawnRect.height / heightCount;
		for (var j = 0; j < heightCount; j++) {
			var widthCount = randomBetween(this.spawnRect.width * this.sizeMin, this.spawnRect.width * this.sizeMax);
			var width = this.spawnRect.width / widthCount;
			for (var i = 0; i < widthCount; i++) {
				var pos = { x: 0, y: 0 };
				var x = pos.x + i * width;
				var y = pos.y + j * height;
				var tile = new Block(x, y, width, height, blockColor);
				this.blocks.push(tile);
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
		for (var t = 0; t < e.targetTouches.length; t++) {
			for (var i = 0; i < this.blocks.length; i++) {
				var tile = this.blocks[i];
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
		for (var i = 0; i < this.blocks.length; i++) {
			var tile = this.blocks[i];
			if (tile.dying) continue;
			if (tile.touching(e.pageX, e.pageY)) {
				this.killBlock(tile);
			}
		}
	};
	this.load = function(game) { // TODO: FIX THIS MESS
		if (game === 2) {
			return new Level2(this);
		}
	};
	this.generateBlocks();
}