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
}

function initSocket() 
{
	io.on('connection', function(socket) {
		console.log("A user has connected to the server.");
		socket.on('disconnect', function() {
			console.log("A user has disconnected from the server.");
		})

		socket.on('gameEvent', function(msg, char) {
			io.emit('gameEvent', msg, char);
		})
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