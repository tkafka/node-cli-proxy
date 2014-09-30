var ConsoleDisplay = require('./ConsoleDisplay');

var io = window['io'];
var jobKey = window['jobKey'];
var jobVariantKey = window['jobVariantKey'];

$(function () {
	var consoleDisplay = new ConsoleDisplay($('#console'));

	var $overlay = $('.console-wrapper .overlay');
	var $jobVariantButtons = $overlay.find('#job-variants a');
	$jobVariantButtons.click(function (e) {
		var jobVariantKey = $(this).attr('href').replace('#', '');
		consoleDisplay.clear();
		consoleDisplay.info('Starting job ' + jobKey + '/' + jobVariantKey + ' on server:');
		socket.emit('start job', {
			jobKey: jobKey,
			jobVariantKey: jobVariantKey
		});

		$overlay.hide();

		e.preventDefault();
	});

	var socket = io();
	var jobInProgressId = null;
	var jobFinished = false;

	consoleDisplay.on('newline', function (buffer) {
		if (jobInProgressId) {
			socket.emit('line', buffer);
		}
	});

	consoleDisplay.on('ctrl+c', function () {
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

	socket.on('job start', function (desc) {
		jobInProgressId = desc.id;
		var command =
			desc.command
				+ (desc.args.length
				? ' ' + desc.args.map(function (a) {
				return a.match(/[ "]/) ? '"' + a.replace(/"/g, '\\"') + '"' : a;
			}).join(' ')
				: '');
		consoleDisplay.infoServer('Job ' + desc.id + ' started: ' + desc.cwd + ' $ ' + command);
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
	socket.on('job end', function (desc) {
		jobInProgressId = null;
		jobFinished = true;
		consoleDisplay.infoServer('Job ' + desc.id + ' ended' + (desc.code ? ' with code ' + desc.code : '') + '.');
		consoleDisplay.disableInput();
	});
	socket.on('disconnect', function () {
		jobInProgressId = null;
		if (jobFinished) {
			consoleDisplay.infoServer('Socket disconnected, job was finished on server.');
		} else {
			consoleDisplay.warningServer('Socket disconnected, job was probably killed on server.');
		}
		consoleDisplay.disableInput();

		// show button
		var $link = $('<a href="" class="button button-new-job">Start another job?</a>');
		var $wrapper = $('<div class="wrapper-new-job"></div>');
		$wrapper.append($link);
		consoleDisplay.appendElement($wrapper);
		setTimeout(function() {
			consoleDisplay.scrollToBottom();
		}, 0);
	});
	socket.on('api error', function (message) {
		consoleDisplay.errorServer('Server sends error: ' + message);
	});

});

