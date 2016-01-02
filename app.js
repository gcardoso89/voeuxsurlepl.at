var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Slack = require('node-slack');
var slack = new Slack('https://hooks.slack.com/services/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');

var app = express();
var enviromnent = app.get('env');
var production = (enviromnent !== 'development');
// development only
if (!production) {
	require("./voeux/env-variables")();
}

var index = require('./routes/index');
var postcardModel = require('./models/postcard');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

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

postcardModel.onError(function (err) {

	if (enviromnent !== 'development') {
		slack.send({
			text: "@gcardoso BD Error: " + err,
			channel: '#voeux-4aout',
			username: 'Voeux 4août',
			link_names: 1
		}, function (err) {
			console.log("Slack error access")
		});
	}
});

module.exports = app;
