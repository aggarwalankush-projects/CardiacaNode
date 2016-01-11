var express = require('express');
var passport = require('passport');
var mongo = require('../mongo/mongo');
var winston = require('winston');

var handleRoutes = function (app) {

    /**
     * Login
     */
    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/',
            failureFlash: 'Invalid username or password.'
        }));

    /**
     * Logout
     */
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    /**
     * Home Page
     */
    app.get('/', function (req, res) {
        if (req.user && req.user.username)
            mongo.setUserRole(req, res, function () {
                res.render('home', {user: req.user});
            });
        else{
            res.render('login', {error: req.flash().error});
        }
    });

    /**
     * Add User
     */
    app.post('/addUser', function (req, res) {
        var Account = mongo.Account;
        Account.register(new Account({
            username: req.body.username,
            role: req.body.role
        }), req.body.password, function (err) {
            if (err) {
                res.send({isSuccess: false, info: "User already exists."});
                return;
            }
            res.send({isSuccess: true, info: "User saved successfully"});
        });
    });

    /**
     * Edit or Modify User
     */
    app.get('/editUser', function (req, res) {
        // redirect admin to edit user page
        if (req.user && req.user.role === 'admin') {
            mongo.getUsers(function (users) {
                res.render('editUser', {data: users, user: req.user});
            });
        } else
            res.redirect('/');
    });

    app.post('/modifyUser', function (req, res) {
        mongo.updateAccount(req, res, function(result){
            res.send(result);
        });
    });

    /**
     * Save Patient Info
     */
    app.post('/savePatientInfo', function (req, res) {
        mongo.savePatientInfo(JSON.parse(Object.keys(req.body)[0]), res);
    });

    /**
     * Get Patient Info
     */
    app.post('/getPatientInfo', function (req, res) {
        mongo.getPatientInfo(JSON.parse(Object.keys(req.body)[0]), res);
    });


    /**
     * CPR
     */
    app.get('/cpr', function (req, res) {
        if (req.user) {
            res.render('index', {user: req.user});
        } else
            res.redirect('/');
    });
};

module.exports = handleRoutes;