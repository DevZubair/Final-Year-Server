var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Doctor = mongoose.model('Doctor');

exports.changeDoctorStatus = function (DoctorID,ClinicID,callBack) {

    Doctor.find({_id : DoctorID, ClinicID : ClinicID},{__v:0},

        function(err,doctor) {

            if(err){
                res.send({
                    code: 500,
                    content : 'Internal Server Error',
                    msg: 'API not called properly'
                });
            }
            else if(doctor!=''){

                Doctor.update({"_id" : DoctorID, "ClinicID" : ClinicID}, {

                    //This will change the status of doctor

                    "Status" : !doctor[0].Status,
                    "DateTime": new Date()

                }, function () {
                    console.log('Doctor Status Update');
                    callBack(200);
                });
            }
            else {
                callBack(404);
                console.log('No Doctor found');
            }
        })
};
