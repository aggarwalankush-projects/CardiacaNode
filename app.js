var winston = require('winston');
var flash = require('connect-flash');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var handleRoutes=require('./routes/handleRoutes');
var port = 3000;

var app = express();

// initializing logger
winston.add(winston.transports.File, { filename: 'cardiaca.log' });
winston.remove(winston.transports.Console);

app.set('view engine', 'jade');
app.use('/js', express.static('./public/javascripts'));
app.use('/css', express.static('./public/stylesheets'));
app.use('/img', express.static('./public/images'));
app.use('/fonts', express.static('./public/fonts'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// passport config
var Account = require('./mongo/mongoSchema').Account;
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

handleRoutes(app);

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

app.listen(port);
