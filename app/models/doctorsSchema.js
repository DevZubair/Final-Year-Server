var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

var doctorsSchema = new Schema({
    DoctorFirstName : {type : String},
    DoctorLastName : {type : String},
    Role : {type : String},
    Speciality : {type : String},
    ClinicID : {type : String},
    Timings : {type : String},
    Status : {type : String}
});

mongoose.model('Doctor', doctorsSchema);

