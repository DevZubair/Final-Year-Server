var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

var appointmentSchema = new Schema({
    MobileID : {type : String},
    AppointmentNumber : {type : Number},
    PatientFirstName : {type : String},
    PatientLastName : {type : String},
    PatientAge : {type : Number},
    Gender : {type : String},
    ClinicID : {type : String},
    DoctorID : {type : String},
    DoctorName : {type : String},
    ClinicName : {type : String},
    DeviceNumber : {type : String},
    DeviceID : {type : String},
    DateTime : {type : Date}
});

mongoose.model('Appointment', appointmentSchema);

