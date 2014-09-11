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

	this._lastLineSource = null;
	this._lastLineClass = null;
	this.$lastLine = this.createAndAppendLine();

	this.$inputLine = createInputBuffer();
	this.$root.append(this.$inputLine);

	this._keystrokeListener = new KeystrokeListener(document);

	// listeners:

	this._keystrokeListener.on('ctrl+c', function() {
		this.emit('ctrl+c');
	}.bind(this));

	// char
	this._keystrokeListener.on('character', function(arg) {
		this.emit('character', arg.c);
		this._setInput(arg.buffer);
	}.bind(this));

	this._keystrokeListener.on('backspace', function(buffer) {
		this.emit('backspace');
		this._setInput(buffer);
	}.bind(this));

	this._keystrokeListener.on('flash', function() {
		this.$root.addClass('console-flash');
		setTimeout(function() {
			this.$root.removeClass('console-flash');
		}.bind(this), 20);
	}.bind(this));

	// enter pressed - send buffer
	// TODO: when data arrives, we should reset the buffer, as it probably means that input was discarded
	this._keystrokeListener.on('newline', function(buffer) {
		this.emit('newline', buffer);
		// this.emit('line', buffer);
		this.$inputLine.addClass('input-buffer-sent');

		// create new input buffer for future input, and add it to end
		this.$inputLine = createInputBuffer();
		this.$lastLine.append(this.$inputLine);

		this._writeLine(''); // hack, to ensure that $inputLine won't get deleted. this needs to go after creating a new buffer, so that we don't put finished input line into a new text line.
	}.bind(this));
};
inherits(ConsoleDisplay, EventEmitter);


ConsoleDisplay.prototype._setInput = function (str) {
	this.$inputLine.text(str);
};

ConsoleDisplay.prototype._writeLine = function (str, cssClass) {
	return this._write(str + '\n', cssClass);
};

ConsoleDisplay.prototype._write = function (str, cssClass) {
	var lines = str.split('\n');
	if (lines.length === 0) {
		return;
	}

	var wasScrolledToBottom = isDivScrolledToBottom(this.$root, scrollSlack);

	var startLine = 0;
	if (this._lastLineSource
		&& this._lastLineClass == cssClass)
	{
		// append to existing current line
		startLine = 1;
		this._lastLineSource += lines[0];
		var lastLineHtml = ansiToHtml.toHtml(escapeInHtmlContext(this._lastLineSource));
		this.$lastLine.html(lastLineHtml);
	}

	// some lines remaining?
	// remember, if last line was ended with \n, last line entry will be empty string
	for (var i = startLine, l = lines.length; i<l; i++) {
		var strHtml = ansiToHtml.toHtml(escapeInHtmlContext(lines[i])); // .replace(/\n/g, '<br/>')
		this.$lastLine = this.createAndAppendLine(lines[i], strHtml, cssClass);
	}

	if (wasScrolledToBottom) {
		scrollToBottomOfDiv(this.$root);
	}
};

ConsoleDisplay.prototype.createAndAppendLine = function(strSource, strHtml, cssClass) {
	this._lastLineSource = strSource;
	this._lastLineClass = cssClass;
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
	this._writeLine(str, 'line-info line-client-info');
};

ConsoleDisplay.prototype.warning = function (str) {
	this._writeLine(str, 'line-warning line-client-warning');
};

ConsoleDisplay.prototype.error = function (str) {
	this._writeLine(str, 'line-error line-client-error');
};

ConsoleDisplay.prototype.infoServer = function (str) {
	this._writeLine(str, 'line-info line-server-info');
};

ConsoleDisplay.prototype.warningServer = function (str) {
	this._writeLine(str, 'line-warning line-server-warning');
};

ConsoleDisplay.prototype.errorServer = function (str) {
	this._writeLine(str, 'line-error line-server-error');
};

ConsoleDisplay.prototype.stdout = function (str) {
	this._write(str, 'line-stdout');
};

ConsoleDisplay.prototype.stderr = function (str) {
	this._write(str, 'line-stderr');
};

module.exports = ConsoleDisplay;