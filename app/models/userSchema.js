var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

var userSchema = new Schema({
    mobileID : {type : String, unique: true},
    Location : {type : String},
    Appointments : [],
    Reviews : []
});

mongoose.model('User', userSchema);
userSchema.plugin(uniqueValidator, { message: 'Error, mobile ID match found' });
