#!/usr/bin/env node
var debug = require('debug')('server');
var app = require('../app');
var consoleSocketServer = require('../consoleSocketServer');

// SERVER
var port = process.env['PORT'] || 4000;
app.set('port', port);

var server = app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + server.address().port);
	debug('Express server listening on port ' + server.address().port);
});

// SOCKET SERVER
consoleSocketServer.listen(server, function() {
	console.log('Socket.io server listening too.');
	debug('Socket.io server listening too.');
});