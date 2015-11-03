var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

var machineSchema = new Schema({
    ClinicID : {type : String},
    DoctorID : {type : String},
    CurrentNumber : {type : String},
    WaitingPersons : [],
    DateTime : {type : Date}
});

mongoose.model('Machine', machineSchema);

