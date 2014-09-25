var express = require('express');
var path = require('path');
var logger = require('morgan');
var browserify = require('browserify-middleware');
var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
var auth = require('http-auth');
var authConfig = require('../auth');

var rootFolder = path.join(__dirname, '..');

var app = express();

if (authConfig && authConfig.active) {
	var basic = auth.basic({
			realm: authConfig.realm
		},
		authConfig.authFn);
	app.use(auth.connect(basic));
}

// view engine setup
app.set('views', path.join(rootFolder, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('less-middleware')(path.join(rootFolder, 'public')));
app.use(express.static(path.join(rootFolder, 'public')));

app.use('/js/clientBrowserified.js', browserify(path.join(rootFolder, 'public', 'js', 'client.js')));

app.use('/', require('./../routes/console'));

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
