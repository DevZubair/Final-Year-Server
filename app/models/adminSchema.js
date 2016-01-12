var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

var adminSchema = new Schema({
    FirstName : {type : String},
    LastName : {type : String},
    Age : {type : Number},
    Gender : {type : String},
    ClinicID : {type : String},
    ClinicName : {type : String},
    DateTime : {type : Date},
    Username : {type : String},
    Password : {type : String}
});

mongoose.model('Admin', adminSchema);

