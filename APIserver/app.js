var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const env = require('./common_modules/env/env.json');

var indexRouter = require('./routes/index');
var deviceRouter = require('./routes/device');
var authRouter = require('./routes/auth');

var app = express();
app.io = require('socket.io')(); //socket.io 추가

//cors middleware
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/device', deviceRouter);
app.use('/auth', authRouter);

// 404핸들러
app.use(function (req, res, next) {
  next(createError(404));
});

//일반적인 에러 매핑
const newErrorMap = new Map([['ER_NO_DEFAULT_FOR_FIELD', 400]]);

//매핑 에러핸들러
app.use((err, req, res, next) => {
  const newError = newErrorMap.get(err.code);
  if (newError) {
    err.status = newError;
    next(err);
  } else {
    next(err);
  }
});

//최종 에러핸들러
app.use(function (err, req, res, next) {
  //에러응답
  res.status(err.status || 500);
  res.json({ error: err, success: false });
});

//웹소켓 커넥션 핸들러
app.io.on('connection', function (socket) {
  console.log(`WebSocket Connected to the Client`);
});
app.set('socketIO', app.io); //router 에서 사용하기위해 등록

module.exports = app;
