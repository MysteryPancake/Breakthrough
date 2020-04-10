"use strict";

var buffers = {};
var player;
var snap;

function setupAudio() {
	if (player) return;
	player = new (window.AudioContext || window.webkitAudioContext)();
	loadBuffer("Snap", function(buffer) {
		buffers.snap = buffer;
		playSnap();
	});
	for (var i = 1; i <= 6; i++) {
		loadBuffer(i, function(buffer, name, markers) {
			buffers[name] = { buffer: buffer, markers: markers };
		});
	}
}

/*function markers(buffer) {
	var data = new Uint8Array(buffer);
	var str = "";
	for (var i = 0; i < data.length; i++) {
		str += String.fromCharCode(data[i]);
	}
	if (!str.startsWith("RIFF")) return;
	var cue = str.indexOf("cue ");
	if (cue !== -1) {
		console.log(str.slice(cue));
		console.log(data.slice(cue));
	}
}*/

function getMarkers(buffer) {
	var markers = {};
	var cuePoints = new wavefile.WaveFile(new Uint8Array(buffer)).listCuePoints();
	for (var i = 0; i < cuePoints.length; i++) {
		var start = cuePoints[i].position / 1000;
		var data = { start: start };
		markers[cuePoints[i].label] = data;
		var next = cuePoints[i + 1];
		if (next) {
			data.duration = (next.position / 1000) - start;
		}
	}
	return markers;
}

function loadBuffer(file, func) {
	var request = new XMLHttpRequest();
	request.open("GET", "sound/" + file + ".wav", true);
	request.responseType = "arraybuffer";
	request.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			var markers = getMarkers(this.response);
			player.decodeAudioData(this.response, function(buffer) {
				func(buffer, file, markers);
			});
		}
	};
	request.send();
}

function playSnap() {
	if (!player) return;
	var buffer = player.createBufferSource();
	buffer.buffer = buffers.snap;
	buffer.connect(player.destination);
	buffer.start();
}

function playMusic(level, section) {
	if (!player) return;
	var buffer = player.createBufferSource();
	var data = buffers[level];
	buffer.buffer = data.buffer;
	buffer.connect(player.destination);
	if (section) {
		buffer.start(0, data.markers[section].start, data.markers[section].duration);
	} else {
		buffer.start();
	}
}