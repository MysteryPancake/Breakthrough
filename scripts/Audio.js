"use strict";

var player;
var snap;

function setupAudio() {
	player = new (window.AudioContext || window.webkitAudioContext)();
	loadBuffer("Snap", function(buffer) {
		snap = buffer;
	});
}

function loadBuffer(file, func) {
	var request = new XMLHttpRequest();
	request.open("GET", "sound/" + file + ".wav", true);
	request.responseType = "arraybuffer";
	request.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			player.decodeAudioData(this.response, func);
		}
	};
	request.send();
}

function playSnap() {
	var buffer = player.createBufferSource();
	buffer.buffer = snap;
	buffer.connect(player.destination);
	buffer.start();
}

function playMusic() {
	// todo
}