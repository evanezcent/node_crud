let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let validator = require('express-validator');
let session = require('express-session');
const port = process.env.PORT || 7000
var cors = require('cors');
const fileUpload = require('express-fileupload');

//Import controller
let mhsController = require('./app/controllers/c_mhs');


let app = express();
app.use(cors())

// Express file upload
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));                     
app.use(session({secret: 'max', saveUninitialized: false, resave: false}));

//jalanin controller
// app.get('/', mhsController.getAllMhs);
// app.get('/add_mahasiswa', mhsController.saveView);
// app.post('/save_mhs', mhsController.saveMhs);

// app.get('/update_mahasiswa/:nim', mhsController.updateView);
// app.post('/update_mahasiswa', mhsController.updateMhs);

// app.get('/data_mahasiswa/:nim', mhsController.getMhs);

// app.get('/delete_mahasiswa/:nim', mhsController.deleteMhs);


// MAKE API
app.use('/myapi', mhsController);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(port);
module.exports = app;
