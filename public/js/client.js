var ConsoleDisplay = require('./ConsoleDisplay');


$(function () {
	var consoleDisplay = new ConsoleDisplay($('#console'));

	var $overlay = $('.console-wrapper .overlay');
	var $jobVariantButtons = $overlay.find('#job-variants a');
	$jobVariantButtons.click(function (e) {
		var jobVariantKey = $(this).attr('href').replace('#', '');
		consoleDisplay.info('Staring job ' + jobKey + '/' + jobVariantKey + ' on server:');
		socket.emit('start job', {
			jobKey: jobKey,
			jobVariantKey: jobVariantKey
		});

		$overlay.hide();

		e.preventDefault();
	});

	var socket = io();
	var jobInProgressId = null;

	consoleDisplay.on('newline', function(buffer) {
		if (jobInProgressId) {
			socket.emit('line', buffer);
		}
	});

	consoleDisplay.on('ctrl+c', function() {
		if (jobInProgressId) {
			consoleDisplay.warning('Ctrl+C detected, killing job on server.');
			socket.emit('ctrl+c');
		}
	});

	/*
	consoleDisplay.on('character', function(char) {
		if (jobInProgressId) {
			socket.emit('c', char);
		}
	});

	consoleDisplay.on('backspace', function() {
		if (jobInProgressId) {
			socket.emit('b');
		}
	});
	*/

	socket.on('job start', function (id) {
		jobInProgressId = id;
		consoleDisplay.infoServer('Job ' + id + ' started.');
		consoleDisplay.enableInput();
	});
	socket.on('job state', function (msg) {
		consoleDisplay.infoServer(msg);
	});
	socket.on('job stdout', function (msg) {
		consoleDisplay.stdout(msg);
	});
	socket.on('job stderr', function (msg) {
		consoleDisplay.stderr(msg);
	});
	socket.on('job end', function (id) {
		jobInProgressId = null;
		consoleDisplay.infoServer('Job ' + id + ' ended.');
		consoleDisplay.disableInput();
	});
	socket.on('disconnect', function () {
		jobInProgressId = null;
		consoleDisplay.warningServer('Socket disconnected, job was finished or killed on server.');
		consoleDisplay.disableInput();
	});
	socket.on('api error', function (message) {
		consoleDisplay.errorServer('Server sends error: ' + message);
	});

});

