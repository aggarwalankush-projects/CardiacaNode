var PatientInfo = require('./mongoSchema').PatientInfo;
var Account = require('./mongoSchema').Account;
var winston = require('winston');

var getPatientInfo = function (jsonObject, res) {
    var date = new Date(Number(jsonObject.date));
    date.setHours(0, 0, 0, 0);
    PatientInfo
        .find({
            date: date,
            patientId: jsonObject.patientId
        })
        .sort({cprCount: 1})
        .exec(function (err, details) {
            if (err)
                console.log("Error in finding patient details");
            else if (details && details.length > 0) {
                res.render('patientDetail', {data: details});
            }
            else {
                console.log("No details found for patient - " + jsonObject.patientId);
                res.send("No details found for patient - " + jsonObject.patientId);
            }
        });
};

var getUsers = function (cb) {
    Account.find().exec(function (err, users) {
        var result = [];
        if (err || !users) {
            winston.error("Error in finding all users");
        }
        else {
            for (var i = 0; i < users.length; i++) {
                var obj = users[i];
                var newObj = {
                    username: obj.username,
                    role: obj.role
                };
                result.push(newObj);
            }
        }
        cb(result);
    });
};

var setUserRole = function (req, res, cb) {
    Account.findOne({username: req.user.username}).exec(function (err, user) {
        if (err || !user)
            winston.error("Error in finding role of user");
        else {
            req.user.role = user.role;
            cb();
        }
    });
};


module.exports = {
    getPatientInfo: getPatientInfo,
    setUserRole: setUserRole,
    getUsers: getUsers
};

