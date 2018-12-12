'use strict';

module.exports = function(app) {
	app.get('/debug', function(req, res) {
		res.sendFile("index.html", { root: "./app/views/" });
	});

	app.get('/', function(req, res) {
		res.sendFile("game.html", { root: "./app/views/" });
	});
};