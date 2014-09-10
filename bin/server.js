#!/usr/bin/env node
var debug = require('debug')('server');
var app = require('../app');
var consoleSocketServer = require('../consoleSocketServer');

// SERVER
app.set('port', process.env['PORT'] || 4000);

var server = app.listen(app.get('port'), function() {
	debug('Express server listening on port ' + server.address().port);
});

// SOCKET SERVER
consoleSocketServer.listen(server, function() {
	debug('Socket.io server listening too.');
});