"use strict";

function Block(x, y, width, height, color) {
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
		return this.width < 1 || this.height < 1;
	};
	this.draw = function(context) {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width + 1, this.height + 1);
	};
	this.touching = function(x, y) {
		return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
	};
}