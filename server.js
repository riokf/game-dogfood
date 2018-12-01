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
}

function initSocket() 
{
	io.on('connection', function(socket) {
		console.log("A user has connected to the server.");
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