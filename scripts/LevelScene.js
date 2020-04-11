"use strict";

function LevelScene(scene) {
	this.scene = scene;
	this.interactive = true;
	this.heightBias = 1.25;
	this.sizeMin = 0.006;
	this.sizeMax = 0.01;
	this.score = 0;
	this.badBlocks = new Set();
	this.chosenBlocks = new Set();
	this.generateBlocks = function() {
		this.badBlocks.clear();
		this.chosenBlocks.clear();
		this.scene.blockColor = this.scene.backgroundColor;
		const heightCount = randomBetween(this.scene.canvas.height * this.sizeMin * this.heightBias, this.scene.canvas.height * this.sizeMax * this.heightBias);
		const height = this.scene.canvas.height / heightCount;
		for (let j = 0; j < heightCount; j++) {
			const widthCount = randomBetween(this.scene.canvas.width * this.sizeMin, this.scene.canvas.width * this.sizeMax);
			const width = this.scene.canvas.width / widthCount;
			for (let i = 0; i < widthCount; i++) {
				this.badBlocks.add(new Block(i * width, j * height, width, height, this.scene.blockColor));
			}
		}
		this.scene.backgroundColor = randomColor();
		this.chooseBlocks();
	};
	this.preKilledBlock = function() {
		this.score += 1;
	};
	this.chooseBlocks = function() {
		for (let tile of this.badBlocks) {
			this.chosenBlocks.add(tile);
			this.badBlocks.delete(tile);
		}
	};
	this.restartGame = function() {
		this.generateBlocks();
	};
	this.killBlock = function(block) {
		playSnap();
		this.preKilledBlock(block);
		block.dying = true;
	};
	this.killTouchedBlocks = function(x, y) {
		for (let tile of this.chosenBlocks) {
			if (tile.dying) continue;
			if (tile.touching(x, y)) {
				this.killBlock(tile);
			}
		}
		for (let tile of this.badBlocks) {
			if (tile.dying) continue;
			if (tile.touching(x, y)) {
				this.killBlock(tile);
			}
		}
	};
	this.gameOver = function() {
		this.scene.blockColor = this.scene.backgroundColor;
		this.scene.loadScore(this.score);
	};
	this.touched = function(e) {
		if (!this.interactive) return;
		for (let t = 0; t < e.touches.length; t++) {
			this.killTouchedBlocks(e.touches[t].pageX, e.touches[t].pageY);
		}
	};
	this.clicked = function(e) {
		if (!this.interactive) return;
		this.killTouchedBlocks(e.pageX, e.pageY);
	};
	this.draw = function(context) {
		for (let tile of this.chosenBlocks) {
			if (tile.update()) {
				this.chosenBlocks.delete(tile);
				if (this.chosenBlocks.size <= 0) {
					this.restartGame();
				}
			} else {
				tile.draw(context);
			}
		}
		for (let tile of this.badBlocks) {
			if (tile.update()) {
				this.badBlocks.delete(tile);
			} else {
				tile.draw(context);
			}
		}
	};
	this.generateBlocks();
}