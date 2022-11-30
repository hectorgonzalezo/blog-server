"use strict";
exports.__esModule = true;
var express = require("express");
var mongoose = require("mongoose");
var createError = require('http-errors');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// Get .env
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
// Set up default mongoose connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// Get the default connection
var db = mongoose.connection;
// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
var indexRouter = require('./routes/index');
var postRouter = require('./routes/post');
var commentRouter = require('./routes/comment');
var userRouter = require('./routes/user');
var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/', indexRouter);
app.use('/posts/', postRouter);
// Comments route includes middleware to pass message id to request
app.use("/posts/:id/comments/", function (req, res, next) {
    req.messageId = req.params.id;
    next();
}, commentRouter);
app.use('/users/', userRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.json({ error: 'error' });
});
module.exports = app;
