'use strict';

const req = require('rekuire');

const express = req('express');
const app = express();

const http = req('http').Server(app);
const io = req('socket.io')(http);

const port = 3000;

var clients = []

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
		if (clients.length < 2 && clients[0] != socket && clients[1] != socket)
		{
			clients.push(socket);
			console.log("A user has connected to the server.");
		}
		else
		{
			console.log("A connection has been rejected for interacting with other users and the server.");
		}

		if (clients[0] == socket || clients[1] == socket)
		{	
			socket.on('markEvent', function(button, playerSign) {
				io.emit('markEvent', button, playerSign);
			});

			socket.on('playerShiftEvent', function(playerMode) {
				io.emit('playerShiftEvent', playerMode);
			});

			socket.on('updateScoreEvent', function(scorePOne, scorePTwo) {
				io.emit('updateScoreEvent', scorePOne, scorePTwo);
			});

			socket.on('connectionEvent', function() {
				if (clients.length == 2)
				{
					io.emit('gameStart');
				}
				else
				{
					io.emit('gamePause');
				}
			})

			socket.on('disconnect', function() {
				console.log("A user has disconnected from the server.");
				clients.splice(socket, 1);
				socket.conn.close();
				io.emit('gameDelete');
			});
		}
		else
		{
			console.log(clients);
		}
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