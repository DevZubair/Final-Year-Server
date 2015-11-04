var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

var clinicSchema = new Schema({
    Name : {type : String, unique: true},
    Location : {type : String},
    Timings : {type : String},
    Doctors : [],
    createdDate : {type : Date}
});

mongoose.model('Clinic', clinicSchema);
clinicSchema.plugin(uniqueValidator, { message: 'Error, clinic name match found' });
