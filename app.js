let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

//Import controller
let mhsController = require('./app/controllers/c_mhs');


let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//jalanin controller
app.get('/', mhsController.getAllMhs);
app.get('/add_mahasiswa', mhsController.saveView);
app.post('/save_mhs', mhsController.saveMhs);

app.get('/update_mahasiswa/:nim', mhsController.updateView);
app.post('/update_mahasiswa', mhsController.updateMhs);

app.get('/data_mahasiswa/:nim', mhsController.getMhs);

app.get('/delete_mahasiswa/:nim', mhsController.deleteMhs);

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

module.exports = app;
