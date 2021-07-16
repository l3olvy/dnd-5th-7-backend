var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql = require('mysql')
const dbconfig = require('./config/db.js')
const connection = mysql.createConnection(dbconfig);
// 라우터를 미들웨어로 등록
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');

var app = express();
app.listen(3000, function() {
	console.log("start! express server on port 3000")
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//DB 연결 TEST
connection.connect(function(err) {
	if(err) {
		throw err;
	} else {
		connection.query("SELECT * FROM fruit", function(err, rows, fields) {
			console.log(rows);
		})
	}
})

module.exports = app;
