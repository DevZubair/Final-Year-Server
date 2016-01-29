var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

var superAdminSchema = new Schema({
    FirstName : {type : String},
    LastName : {type : String},
    Age : {type : Number},
    Gender : {type : String},
    DateTime : {type : Date},
    Username : {type : String},
    Password : {type : String}
});

mongoose.model('SuperAdmin', superAdminSchema);

