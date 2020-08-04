require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require("passport");
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const calculatorRouter = require('./routes/calculator');
const calcResults = require('./routes/results');
const session = require('express-session');
const methodOverride = require('method-override');
const favicon = require('serve-favicon');
const MongoStore = require('connect-mongo')(session);


//Models
const Chemist = require('./models/chemist')



const app = express();


//Connect to database with mongoose (translates objects for insertion into the database)
mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost:27017/elemental', 
  {useNewUrlParser: true, useUnifiedTopology: true,
  useCreateIndex: true  
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we\'re connected')
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//Configure passport and sessions (sessions comes first)

app.use(session({
  secret: 'meow said the cat',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

passport.use(Chemist.createStrategy());

app.use(passport.initialize());
app.use(passport.session());
 
passport.serializeUser(Chemist.serializeUser());
passport.deserializeUser(Chemist.deserializeUser());

//set local variables middleware
app.use(function(req, res, next){

  res.locals.currentUser = req.user;

  //Set success flash message
  res.locals.success = req.session.success || '';
  delete req.session.success;
  //Set error flash message
  res.locals.error = req.session.error || '';
  delete req.session.error;
  next();
});

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
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  console.log(err);
  req.session.error = err.message;
  res.redirect('back');
});

module.exports = app;
