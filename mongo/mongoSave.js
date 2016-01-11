var Patient = require('./mongoSchema').Patient;
var PatientInfo = require('./mongoSchema').PatientInfo;
var Account = require('./mongoSchema').Account;
var async = require('async');
var winston = require('winston');

var updateAccount = function (req, res, cb) {
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;
    var action = req.body.action;

    var result = {
        isSuccess: false,
        uname: username,
        role: role,
        info: ''
    };

    if (action === 'delete') {
        //delete user
        Account.findOneAndRemove({username: username}, function (err, user) {
            if (err) {
                winston.error("error in deleting user");
                result.isSuccess = false;
            } else {
                // we have deleted the user
                result.isSuccess = true;
                result.info = 'User deleted successfully';
            }
            cb(result);
        });
    } else if (action === 'update') {
        //update user
        if (password.trim() === '') {
            //update role

            Account.findOneAndUpdate({username: username}, {role: role}, function (err, user) {
                if (err) {
                    winston.error("error in updating role");
                    result.isSuccess = false;
                } else {
                    // we have the updated user returned to us
                    result.isSuccess = true;
                    result.info = 'Updated user role';
                }
                cb(result);
            });

        } else {
            //update password also

            Account.findOne({username: username}).exec(function (err, user) {
                if (err || !user) {
                    winston.error("Error in updating password");
                    result.isSuccess = false;
                    cb(result);
                }
                else {
                    if (user.role !== role) {
                        //role also changed
                        Account.findOneAndUpdate({username: username}, {role: role}, function (err, user) {
                            if (err) {
                                winston.error("error in updating role");
                                result.isSuccess = false;
                                cb(result);
                            } else {
                                // we have the updated user returned to us
                                result.isSuccess = true;
                                result.info += ' Updated user role ';
                                user.setPassword(password, function () {
                                    user.save();
                                    result.isSuccess = true;
                                    result.info += 'and password';
                                    cb(result);
                                });
                            }
                        });
                    } else {
                        user.setPassword(password, function () {
                            user.save();
                            result.isSuccess = true;
                            result.info += 'User password changed';
                            cb(result);
                        });
                    }
                }

            });
        }
    }
};

var savePatient = function (jsonObj) {
    var patientJson = jsonObj;
    var NewPatient = new Patient({
        lastname: patientJson.lastname,
        mrn: patientJson.mrn
    });
    NewPatient.save(function (err) {
        if (err) {
            console.log("duplicate patient entry or fail save");
        } else {
            console.log('patient saved successfully!!');
        }
    });

};

var savePatientInfo = function (jsonObj, res) {
    savePatient(jsonObj.patient);
    var patientId = jsonObj.patient.mrn;
    var patientInfoJson = jsonObj.ca_data;
    if (patientInfoJson.length < 1)
        return;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var cprCount;
    async.series([
            function (callback) {
                PatientInfo.findOne({
                    date: today,
                    patientId: patientId
                }).sort('-cprCount').exec(function (err, info) {
                    if (err)
                        console.log("error in computing cpr count");
                    else if (info) {
                        cprCount = info.cprCount + 1;
                    }
                    else {
                        cprCount = 1;
                    }
                    callback(null, 'first');
                });
            },
            function (callback) {
                patientInfoJson.forEach(function (patientInfo) {
                    var NewPatientInfo = new PatientInfo({
                        date: today,
                        cprCount: cprCount,
                        patientId: patientId,
                        cpr_time: patientInfo.cpr_time,
                        cpr: patientInfo.cpr,
                        monitoring: patientInfo.monitoring,
                        intervention: patientInfo.intervention,
                        bolus: patientInfo.bolus
                    });

                    NewPatientInfo.save(function (err) {
                        if (err) {
                            console.log("fail save for cpr_time " + patientInfo.cpr_time + " for patientId : " + patientId);
                            console.log(err);
                        } else {
                            console.log("saved successfully!! " + patientId);
                        }
                    });
                });
                callback(null, 'success');
            }
        ],
        function (err, results) {
            if (results[1] === 'success') {
                //res.render('patientDetail', { data: patientInfoJson });
                res.send("Success Count " + cprCount);
            } else
                res.send("Failed");
        }
    );


};

module.exports = {
    savePatientInfo: savePatientInfo,
    updateAccount: updateAccount
};

