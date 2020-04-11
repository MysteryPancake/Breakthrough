"use strict";

function SceneManager(context) {
	this.context = context;
	this.canvas = context.canvas;
	this.blockColor = randomColor();
	this.backgroundColor = randomColor();
	this.draw = function() {
		this.context.fillStyle = this.backgroundColor;
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.scene.draw(this.context, this.canvas);
	};
	this.clicked = function(e) {
		this.scene.clicked(e);
	};
	this.touched = function(e) {
		this.scene.touched(e);
	};
	this.resize = function(width, height) {
		if (this.scene.resize) {
			this.scene.resize(width, height);
		}
	};
	this.getHighestLevel = function() {
		const highestLevel = window.localStorage.getItem("level");
		if (!highestLevel) {
			window.localStorage.setItem("level", 1);
			return 1;
		}
		return parseInt(highestLevel);
	};
	this.setHighestLevel = function(index) {
		window.localStorage.setItem("level", index);
	};
	this.loadMenu = function() {
		this.scene = new MenuScene(this);
	};
	this.loadScore = function(score) {
		this.scene = new ScoreScene(this, score);
	};
	this.loadLevel = function(index) {
		switch (index) {
		case 0:
			this.scene = new Level0(this);
			break;
		case 1:
			this.scene = new Level1(this);
			break;
		case 2:
			this.scene = new Level2(this);
			break;
		case 3:
			this.scene = new Level3(this);
			break;
		case 4:
			this.scene = new Level4(this);
			break;
		case 5:
			this.scene = new Level5(this);
			break;
		case 6:
			this.scene = new Level6(this);
			break;
		}
	};
	this.loadNextLevel = function() {
		const next = this.getHighestLevel() + 1;
		if (next >= 7) {
			window.localStorage.setItem("menu", true);
			this.loadMenu();
		} else {
			this.setHighestLevel(next);
			this.loadLevel(next);
		}
	};
	this.restoreProgress = function() {
		if (window.localStorage.getItem("menu")) {
			this.loadMenu();
		} else {
			this.loadLevel(this.getHighestLevel());
		}
	};
	this.loadLevel(0);
}