var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

var clinicSchema = new Schema({
    Name : {type : String, unique: true},
    Location : {type : String},
    Timings : {type : String},
    Doctors : []
});

mongoose.model('User', clinicSchema);
clinicSchema.plugin(uniqueValidator, { message: 'Error, clinic name match found' });
