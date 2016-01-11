var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

var accountSchema = new Schema({
        username: String,
        password: String,
        role: String
    },
    {
        collection: 'Account'
    }
);

accountSchema.plugin(passportLocalMongoose);

var patientSchema = new Schema({
        lastname: String,
        mrn: String
    },
    {
        collection: 'Patient'
    }
);

patientSchema.index({mrn: 1}, {unique: true});


var patientInfoSchema = new Schema({
        date: Date,
        cprCount: Number,
        patientId: String,
        cpr_time: String,
        cpr: Schema.Types.Mixed,
        monitoring: Schema.Types.Mixed,
        intervention: Schema.Types.Mixed,
        bolus: Schema.Types.Mixed
    },
    {
        collection: 'PatientInfo'
    }
);

patientInfoSchema.index({date: 1, cprCount: 1, patientId: 1, cpr_time: 1}, {unique: true});

var Account = mongoose.model('Account', accountSchema);
var Patient = mongoose.model('Patient', patientSchema);
var PatientInfo = mongoose.model('PatientInfo', patientInfoSchema);


module.exports = {
    Account: Account,
    Patient: Patient,
    PatientInfo: PatientInfo
};