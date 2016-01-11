var mongoose = require('mongoose');
var mongoSave = require('./mongoSave');
var mongoQuery = require('./mongoQuery');
var mongoSchema = require('./mongoSchema');

mongoose.connect('mongodb://localhost/cardiaca');

module.exports = {
    savePatientInfo: mongoSave.savePatientInfo,
    updateAccount: mongoSave.updateAccount,
    getPatientInfo: mongoQuery.getPatientInfo,
    setUserRole: mongoQuery.setUserRole,
    getUsers: mongoQuery.getUsers,
    Account: mongoSchema.Account
};

