'use strict';

const req = require('rekuire');

const express = req('express');
const app = express();

const http = req('http').Server(app);
const io = req('socket.io')(http);

const port = 3000;

function initRoutes()
{
	require('./app/routes/')(app);
	app.use('/scripts', express.static(__dirname + '/app/scripts'));
	app.use('/styles', express.static(__dirname + '/app/styles'));
	app.use('/toastr', express.static(__dirname + '/node_modules/toastr/build'));
}

function initSocket() 
{
	io.on('connection', function(socket) {
		console.log("A user has connected to the server.");

		socket.on('disconnect', function() {
			console.log("A user has disconnected from the server.");
		});

		socket.on('markEvent', function(button, playerSign) {
			io.emit('markEvent', button, playerSign);
		});

		socket.on('playerShiftEvent', function(playerMode) {
			io.emit('playerShiftEvent', playerMode);
		});

		socket.on('updateScoreEvent', function(scorePOne, scorePTwo) {
			io.emit('updateScoreEvent', scorePOne, scorePTwo);
		});
	});
}

function startServer()
{
	http.listen(port, function() 
	{
		console.log("Game Demo is live on port " + port);
	});
}

function main() 
{
	initRoutes();
	initSocket();
	startServer();
}

main();