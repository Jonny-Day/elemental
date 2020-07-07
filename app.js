const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require("passport");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');
const calculatorRouter = require('./routes/calculator');
const calcResults = require('./routes/results');
const session = require('express-session');

//Models
const Chemist = require('./models/chemist')



const app = express();

//Connect to database with mongoose (translates objects for insertion into the database)
mongoose.connect('mongodb://localhost:27017/elemental', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we\'re connected')
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Configure passport and sessions (sessions comes first)

app.use(session({
  secret: 'meow said the cat',
  resave: false,
  saveUninitialized: true,
}))

passport.use(Chemist.createStrategy());
 
passport.serializeUser(Chemist.serializeUser());
passport.deserializeUser(Chemist.deserializeUser());

//Mount the routes
app.use('/', indexRouter);
app.use('/calculator', calculatorRouter);
app.use('/results', calcResults);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
