"use strict";

function block(x, y, width, height, color) {
	this.dying = false;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color;
	this.update = function() {
		if (!this.dying) return;
		this.x += 3;
		this.y += 3;
		this.width -= 6;
		this.height -= 6;
		if (this.width < 1 || this.height < 1) {
			const index = blocks.indexOf(this);
			if (index > -1) {
				blocks.splice(index, 1);
				if (blocks.length < 1) {
					generateBlocks();
				}
			}
		}
	};
	this.draw = function() {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width + 1, this.height + 1);
		this.update();
	};
	this.touching = function(pos) {
		return pos.x > this.x && pos.x < (this.x + this.width) && pos.y > this.y && pos.y < (this.y + this.height);
	};
	this.kill = function() {
		this.dying = true;
		playSnap();
	};
}