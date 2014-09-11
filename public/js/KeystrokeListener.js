var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

var ctrlKey = 17;

var KeystrokeListener = function (document) {
	this._buffer = '';
	this._enabled = false;

	this._modKeys = {
		ctrl: false
	};

	// to exclude text fields: http://stackoverflow.com/a/2768256
	$(document).keydown(this._keyDownEventHandler.bind(this));
	$(document).keyup(this._keyUpEventHandler.bind(this));
	$(document).keypress(this._keyPressEventHandler.bind(this));
};
inherits(KeystrokeListener, EventEmitter);

KeystrokeListener.prototype.enable = function () {
	this._enabled = true;
};

KeystrokeListener.prototype.disable = function () {
	this._enabled = false;
};

KeystrokeListener.prototype._keyDownEventHandler = function (e) {
	// we need to catch backspace here
	if (e.keyCode === 8)
	{
		this._buffer = this._buffer.slice(0, -1);
		this.emit('backspace', this._buffer);
		e.preventDefault();
	} else if (e.keyCode == ctrlKey) {
		this._modKeys.ctrl = true;
	}
};
KeystrokeListener.prototype._keyUpEventHandler = function (e) {
	if (e.keyCode == ctrlKey) {
		this._modKeys.ctrl = false;
	}};

KeystrokeListener.prototype._keyPressEventHandler = function (e) {
	if (!this._enabled) {
		return;
	}

	var char = String.fromCharCode(e.which);

	var handled = true;

	if (this._modKeys.ctrl && e.which == 3) {
		// ctrl + c
		this.emit('ctrl+c');

	} else if (e.keyCode === 13) {
		// enter

		this.emit('newline', this._buffer);
		// clear:
		this._buffer = '';

	} else if (e.keyCode === 8) {
		// backspace was already handled
	} else if (char) {
		// letter from a list
		this._buffer = this._buffer + char;
		this.emit('character', { c: char, buffer: this._buffer });
		// this.emit('letter', this._buffer);
	} else {
		// not a valid character???
		this.emit('flash', e.keyCode);

		console.log('Unknown keyCode:', e.keyCode);
		handled = false;
	}

	if (handled) {
		e.preventDefault();
	}
};

module.exports = KeystrokeListener;

