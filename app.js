var express = require('express');
var path = require('path');
var favicon = require('serve-favicon'); // OJO!: my express created a JSON/app.js with static-favicon, but the training is with "serve-favicon"
// var favicon = require('static-favicon') <--- deprecated
var logger = require('morgan');
// Training (see my notes in the course; also http://blog.ijasoneverett.com/2013/04/form-validation-in-node-js-with-express-validator/)
var expressValidator = require('express-validator');
// **
var cookieParser = require('cookie-parser');
// Training (see my notes in the course)
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// **
var bodyParser = require('body-parser');
// Training (see my notes in the course)
var exphbs = require('express-handlebars')
var multer = require('multer');
var flash = require('connect-flash');
var mongo = require('mongodb');
//OJO: an error found
// "Error: Cannot find module '../build/Release/bson'"
// Solution: http://stackoverflow.com/questions/28651028/cannot-find-module-build-release-bson-code-module-not-found-js-bson
// **
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/elearn');
var db = mongoose.connection;
// **

var routes = require('./routes/index');
var users = require('./routes/users');
var classes = require('./routes/classes');

var app = express();

// view engine setup
// E: differently to previous nodeauth project, this will use handlebars engine for html forms
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}))
app.set('view engine', 'handlebars');

// OJO!: my version of express seems to be outdated! the current one create the favicon as serve-favicon as below...
//       my version use static-favicon (I changed the code according to lessons...)
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
// E: a path to favicon should be given (http://stackoverflow.com/questions/23627726/error-in-twitter-authentication-with-website-in-nodej)
// For static default setting, use:
//app.use(favicon());
//**

app.use(logger('dev'));
app.use(bodyParser.json());


app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Training:
// - A session is a USER session (like a personal portal)
// - passport is a module that control for authorization
// - validator is a shortcut to facilitate the evaluation of entries

//Handle Express Sessions
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave:true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// **

//E: Global Vars
app.use(function(req,res,next){
  res.locals.messages = require('express-messages')(req,res);
  if (req.url == '/') {
    res.locals.isHome = true;
  }
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/classes', classes);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
