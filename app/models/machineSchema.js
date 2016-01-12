var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

var machineSchema = new Schema({
    ClinicID : {type : String},
    DoctorID : {type : String},
    CurrentNumber : {type : Number},
    WaitingPersons : [],
    TotalAppointments : {type : Number},
    DateTime : {type : Date}
});

mongoose.model('Machine', machineSchema);

