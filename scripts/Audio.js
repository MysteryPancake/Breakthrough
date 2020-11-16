"use strict";

const buffers = {};
let player;

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

function loadBuffer(file, loadMarkers) {
	return new Promise((resolve, reject) => {
		window.fetch("sound/" + file + (loadMarkers ? ".wav" : ".mp3")).then(function(response) {
			if (response.ok) {
				return response.arrayBuffer();
			} else {
				throw new Error("HTTP error, status = " + response.status);
			}
		}).then(function(buffer) {
			const markers = loadMarkers ? getMarkers(buffer) : {};
			player.decodeAudioData(buffer, function(decoded) {
				resolve({ buffer: decoded, name: file, markers: markers });
			}, reject);
		}).catch(reject);
	});
}

function preloadMusic(game, loadMarkers) {
	if (buffers[game]) return;
	loadBuffer(game, loadMarkers).then((result) => {
		buffers[result.name] = result;
	}).catch(window.alert);
}

function playSnap(pitch) {
	if (!player || !buffers.snap) return;
	const buffer = player.createBufferSource();
	buffer.buffer = buffers.snap;
	if (pitch !== undefined) {
		buffer.playbackRate.value = pitch;
	}
	buffer.connect(player.destination);
	buffer.start();
}

function playMusic(level, section) {
	if (!player) return;
	const data = buffers[level];
	if (!data) return;
	const buffer = player.createBufferSource();
	buffer.buffer = data.buffer;
	buffer.connect(player.destination);
	if (section && data.markers[section]) {
		buffer.start(0, data.markers[section].start, data.markers[section].duration);
		return data.markers[section].duration;
	} else {
		buffer.start();
	}
}

function setupAudio(manager) {
	if (player) return;
	player = new (window.AudioContext || window.webkitAudioContext)();
	loadBuffer("Snap", false).then((result) => {
		buffers.snap = result.buffer;
		playSnap();
		preloadMusic(manager.getHighestLevel(), true);
	}).catch(window.alert);
}