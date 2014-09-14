var spawn = require('child_process').spawn;
var debug = require('debug')('consoleSocketServer');
var socketIo = require('socket.io');
var fs = require('fs');

var getFreshJobs = require('./utils/getFreshJobs');
var randomJobId = require('./utils/random/randomJobId');

var SocketServer = function () {
	this.server = null;
};

SocketServer.prototype.listen = function (httpServer) {
	if (this.server) {
		throw new Error('Already started!');
	}

	this.server = socketIo(httpServer);

	this.server.on('connection', function (socket) {
		var jobs = getFreshJobs();

		debug('user connected');

		var jobId = null;
		var jobStrVariant = null;
		var jobStrId = null;
		var cmd = null;

		socket.on('start job', function (jobDesc) {
			if (!jobDesc.jobKey) {
				socketErrorAndDisconnect(socket, 'Job description is missing jobKey.');
			} else if (!jobDesc.jobVariantKey) {
				socketErrorAndDisconnect(socket, 'Job description is missing jobVariantKey.');
			} else if (!jobs.hasOwnProperty(jobDesc.jobKey)) {
				socketErrorAndDisconnect(socket, 'Job key "' + jobDesc.jobKey + '" not found.');
			} else if (!jobs[jobDesc.jobKey].variants.hasOwnProperty(jobDesc.jobVariantKey)) {
				socketErrorAndDisconnect(socket, 'Job "' + jobDesc.jobKey + '" doesn\'t have variant "' + jobDesc.jobVariantKey + '".');
			} else {
				jobId = randomJobId();

				var job = jobs[jobDesc.jobKey];
				var jobVariant = job.variants[jobDesc.jobVariantKey];

				jobStrVariant = jobDesc.jobKey + '/' + jobDesc.jobVariantKey;
				jobStrId = jobStrVariant + '(' + jobId + ')';

				try {
					var jobDescriptor = {
						id: jobId,
						command: jobVariant.command,
						args: jobVariant.args || [],
						cwd: fs.realpathSync(jobVariant.cwd || job.cwd || __dirname)
					};

					var uid = null;
					if (job.hasOwnProperty('uid')) uid = job.uid;
					if (jobVariant.hasOwnProperty('uid')) uid = jobVariant.uid;
					if (uid != null) jobDescriptor.uid = uid;

					var gid = undefined;
					if (job.hasOwnProperty('gid')) gid = job.gid;
					if (jobVariant.hasOwnProperty('gid')) gid = jobVariant.gid;
					if (gid != null) jobDescriptor.gid = gid;

				} catch (e) {
					socketErrorAndDisconnect(socket, 'Error resolving process path: ' + e.message);
					return;
				}

				socket.emit('job start', jobDescriptor);

				cmd = spawn(jobDescriptor.command, jobDescriptor.args, jobDescriptor);

				cmd.stdout.on('data', function (data) {
					var str = data.toString();
					// debug(jobStrId, 'stdout', str);
					socket.emit('job stdout', str);
				});

				cmd.stderr.on('data', function (data) {
					var str = data.toString();
					// debug(jobStrId, 'stderr', str);
					socket.emit('job stderr', str);
				});

				cmd.on('close', function (code) {
					socket.emit('job end', { 
						id: jobId, 
						code: code 
					});
					socket.disconnect();
					cmd = null;
					jobId = null;
				});

				cmd.on('error', function (e) {
					debug('app error - ' + jobStrVariant, e.stack);
					socketError(socket, 'Running process produced following error: ' + e.message);
				});

				socket.emit('job state', 'Job ' + jobDesc.jobKey + '/' + jobDesc.jobVariantKey + ' started on server.');

			}
		});

		/*
		// character
		socket.on('c', function(char) {
			if (!cmd) {
				socketError(socket, 'Job is not running, ignoring input.');
			} else {
				cmd.stdin.write(char);
			}
		});

		// backspace
		socket.on('b', function() {
			if (!cmd) {
				socketError(socket, 'Job is not running, ignoring input.');
			} else {
				cmd.stdin.write(String.fromCharCode(8));
			}
		});

		// newline
		socket.on('l', function(buffer) {
			if (!cmd) {
				socketError(socket, 'Job is not running, ignoring input.');
			} else {
				cmd.stdin.write('\n');
			}
		});
		*/

		// line
		socket.on('line', function(buffer) {
			if (!cmd) {
				socketError(socket, 'Job is not running, ignoring input.');
			} else {
				cmd.stdin.write(buffer + '\n');
			}
		});

		socket.on('ctrl+c', function() {
			if (!cmd) {
				socketError(socket, 'Job is not running, ignoring input.');
			} else {
				cmd.kill();
				debug('Job ' + jobStrId + ' killed.');
			}
		});

		socket.on('disconnect', function () {
			if (cmd) {
				debug('User disconnected and job ' + jobStrId + ' is still running, killing it');
				cmd.kill();
				debug('Job ' + jobStrId + ' killed.');
			} else {
				debug('User disconnected.');
			}
		});

		socket.on('error', function(e) {
			debug('socket error', e);
		})
	});

};

function socketError(socket, err) {
	socket.emit('api error', err);
}

function socketErrorAndDisconnect(socket, err) {
	socketError(socket, err);
	socket.disconnect();
}

var socketServerInstance = new SocketServer();

module.exports = socketServerInstance;