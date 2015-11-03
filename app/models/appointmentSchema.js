var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

var appointmentSchema = new Schema({
    AppointmentNumber : {type : Number},
    PatientFirstName : {type : String},
    PatientLastName : {type : String},
    PatientAge : {type : Number},
    ClinicID : {type : String},
    DoctorID : {type : String},
    DateTime : {type : Date}
});

mongoose.model('Appointment', appointmentSchema);

