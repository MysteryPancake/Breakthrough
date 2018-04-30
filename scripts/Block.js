"use strict";

function block(x, y, width, height, color) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color;
	this.dying = false;
	this.update = function() {
		if (!this.dying) return;
		this.x += 3;
		this.y += 3;
		this.width -= 6;
		this.height -= 6;
	};
	this.draw = function(context) {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width + 1, this.height + 1);
	};
	this.kill = function() {
		playSnap();
		this.dying = true;
	};
	this.touching = function(pos) {
		return pos.x > this.x && pos.x < (this.x + this.width) && pos.y > this.y && pos.y < (this.y + this.height);
	};
}