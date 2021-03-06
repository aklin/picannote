"use strict";
/**
* Line draw:
* Left click down sets a node (x,y) and starts a countdown
* 	On countdown expiry, a node is created at the cursor position. Countdown is restarted
* 	A line is drawn connecting the previous node with the new one
* Left click up cancels timeout and sets final node
Edit: That won't work. Can't get mouse pos without mouse event, so will have to use mousemove instead. Pity
*/
var log = console.log;
var canvas;
var ctx;
var timeoutID;
var state = {
	down: false,
	lastNode: null, //{x:0,y:0},
	timeout: 200, //ms
	track: false,
	lastTimeout: 0
};


function onMove(e) {
	if (state.track) {
		createNode(e, false);
	}
}


function createNode(e, force) {
	var now = Date.now();
	var diff = now - state.lastTimeout;
	var prev = state.lastNode; //previous node
	var curr = setNode(e); //current node
	if (!(force || diff > state.timeout)) {
		return;
	}
	if (!force) {
		ctx.beginPath();
		ctx.strokeStyle = 'blue';
		ctx.moveTo(prev.x, prev.y);
		// ctx.moveTo(0, 0);
		ctx.lineTo(curr.x, curr.y);
		ctx.stroke();
	}
	log("Update last node - " + diff);
	state.lastTimeout = now;
	state.lastNode = curr;
}


function draw() {
	canvas = document.getElementById('base');
	ctx = canvas.getContext('2d');
	canvas.addEventListener("mousemove", onMove);
	canvas.addEventListener("mousedown", mDown);
	canvas.addEventListener("mouseup", mUp);
}


function mDown(e) {
	if (e.button != 0) return;
	createNode(e, true);
	state.track = true;
}


function mUp(e) {
	if (e.button != 0) return;
	state.track = false;
}


function setNode(e) {
	//needs relative dom correction
	var r = canvas.getBoundingClientRect();
	var x = e.clientX - parseInt(canvas.offsetLeft);
	var y = e.clientY - parseInt(canvas.offsetTop);
	state.lastNode = state.lastNode || {
		x: 0,
		y: 0
	};
	log("rel: " + r.x + ", " + r.y)
	console.log(" X,Y: " + x + ", " + y);
	return {
		x: x,
		y: y
	};
}


function clear() {
	canvas.fillStyle = "#ffffff";
	canvas.fillRect(0, 0, width, height);
	canvas.fillStyle = "#888888";
	canvas.strokeRect(0, 0, width, height);
}
