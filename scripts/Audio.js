"use strict";

const buffers = {};
let player;

function setupAudio() {
	if (player) return;
	player = new (window.AudioContext || window.webkitAudioContext)();
	loadBuffer("Snap", function(buffer) {
		buffers.snap = buffer;
		playSnap();
	});
	for (let i = 1; i <= 6; i++) {
		loadBuffer(i, function(buffer, name, markers) {
			buffers[name] = { buffer: buffer, markers: markers };
		});
	}
}

function getMarkers(buffer) {
	const markers = {};
	const cuePoints = new wavefile.WaveFile(new Uint8Array(buffer)).listCuePoints();
	for (let i = 0; i < cuePoints.length; i++) {
		const start = cuePoints[i].position / 1000;
		const data = { start: start };
		markers[cuePoints[i].label] = data;
		const next = cuePoints[i + 1];
		if (next) {
			data.duration = (next.position / 1000) - start;
		}
	}
	return markers;
}

function loadBuffer(file, func) {
	const request = new XMLHttpRequest();
	request.open("GET", "sound/" + file + ".wav", true);
	request.responseType = "arraybuffer";
	request.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			const markers = getMarkers(this.response);
			player.decodeAudioData(this.response, function(buffer) {
				func(buffer, file, markers);
			});
		}
	};
	request.send();
}

function playSnap() {
	if (!player) return;
	const buffer = player.createBufferSource();
	buffer.buffer = buffers.snap;
	buffer.connect(player.destination);
	buffer.start();
}

function playMusic(level, section) {
	if (!player) return;
	const data = buffers[level];
	if (data) {
		const buffer = player.createBufferSource();
		buffer.buffer = data.buffer;
		buffer.connect(player.destination);
		if (section) {
			buffer.start(0, data.markers[section].start, data.markers[section].duration);
		} else {
			buffer.start();
		}
	}
}