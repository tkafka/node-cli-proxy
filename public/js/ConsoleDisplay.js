var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var AnsiToHtml = require('ansi-to-html');
var KeystrokeListener = require('./KeystrokeListener');

var ansiToHtml = new AnsiToHtml();

function escapeInHtmlContext(str) {
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function isDivScrolledToBottom($div, scrollSlack) {
	var scrollHeight = $div[0].scrollHeight;
	var height = $div.outerHeight();
	var scrollTop = $div.scrollTop();

	return scrollTop > scrollHeight - height - scrollSlack;
}

function scrollToBottomOfDiv($div) {
	var scrollHeight = $div[0].scrollHeight;
	$div.scrollTop(scrollHeight);
}

function createInputBuffer() {
	return $('<div class="input-buffer"></div>');
}

var scrollSlack = 10;

var ConsoleDisplay = function ($root) {
	this.$root = $root;
	this.log = [];

	this.$lastLine = this.createAndAppendLine();

	this.$inputLine = createInputBuffer();
	this.$root.append(this.$inputLine);

	this._keystrokeListener = new KeystrokeListener(document);

	// char
	this._keystrokeListener.on('character', function(arg) {
		this.emit('character', arg.c);
		this._setInput(arg.buffer);
	}.bind(this));

	this._keystrokeListener.on('backspace', function(buffer) {
		this.emit('backspace');
		this._setInput(buffer);
	}.bind(this));

	this._keystrokeListener.on('flash', function(buffer) {
		this.$root.addClass('console-flash');
		setTimeout(function() {
			this.$root.removeClass('console-flash');
		}.bind(this), 20);
	}.bind(this));

	// enter pressed - send buffer
	this._keystrokeListener.on('newline', function(buffer) {
		this.emit('newline', buffer);
		// this.emit('line', buffer);
		this.$inputLine.addClass('input-buffer-sent');
		// create new input buffer
		this.$inputLine = createInputBuffer();
		this.$lastLine.append(this.$inputLine);
	}.bind(this));
};
inherits(ConsoleDisplay, EventEmitter);


ConsoleDisplay.prototype._setInput = function (str) {
	this.$inputLine.text(str);
};

ConsoleDisplay.prototype._write = function (str, cssClass) {
	var strHtml = ansiToHtml.toHtml(escapeInHtmlContext(str)).replace(/\n/g, '<br/>');

	// console.log('Console write', str);
	this.log.push(str);

	var wasScrolledToBottom = isDivScrolledToBottom(this.$root, scrollSlack);
	this.$lastLine = this.createAndAppendLine(strHtml, cssClass);

	if (wasScrolledToBottom) {
		scrollToBottomOfDiv(this.$root);
	}
};

ConsoleDisplay.prototype.createAndAppendLine = function(strHtml, cssClass) {
	var $line = $('<div class="line' + (cssClass ? ' ' + cssClass : '') +'">' + (strHtml ? strHtml : '') + '</div>');
	this.$root.append($line);
	// move input line at the end
	$line.append(this.$inputLine);
	return $line;
};


ConsoleDisplay.prototype.enableInput = function () {
	this._keystrokeListener.enable();
};

ConsoleDisplay.prototype.disableInput = function () {
	this._keystrokeListener.disable();
};

ConsoleDisplay.prototype.write = function (str) {
	this._write(str);
};

ConsoleDisplay.prototype.info = function (str) {
	this._write(str, 'line-info line-client-info');
};

ConsoleDisplay.prototype.warning = function (str) {
	this._write(str, 'line-warning line-client-warning');
};

ConsoleDisplay.prototype.error = function (str) {
	this._write(str, 'line-error line-client-error');
};

ConsoleDisplay.prototype.infoServer = function (str) {
	this._write(str, 'line-info line-server-info');
};

ConsoleDisplay.prototype.warningServer = function (str) {
	this._write(str, 'line-warning line-server-warning');
};

ConsoleDisplay.prototype.errorServer = function (str) {
	this._write(str, 'line-error line-server-error');
};

ConsoleDisplay.prototype.stdout = function (str) {
	this._write(str, 'line-stdout');
};

ConsoleDisplay.prototype.stderr = function (str) {
	this._write(str, 'line-stderr');
};

module.exports = ConsoleDisplay;