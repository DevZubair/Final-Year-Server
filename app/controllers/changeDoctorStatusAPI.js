var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Doctor = mongoose.model('Doctor');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/changeDoctorStatus', function (req, res, next) {

    var DoctorID = req.body.DoctorID || req.query.DoctorID || req.headers['x-access-DoctorID'],
        ClinicID  = req.body.ClinicID || req.query.ClinicID || req.headers['x-access-ClinicID'];

    Doctor.find({_id : DoctorID, ClinicID : ClinicID},{__v:0},

        function(err,doctor) {

            if(err){
                res.send({
                    code: 500,
                    content: 'Not Found',
                    msg: 'Internal Server Error'
                });
            }
            else if(doctor!=''){

                Doctor.update({"_id" : DoctorID, "ClinicID" : ClinicID}, {

                    //This will change the status of doctor

                    "Status" : !doctor[0].Status,
                    "DateTime": new Date()

                }, function () {
                    console.log('Doctor Status Update');
                    res.send({
                        code: 200,
                        content: 'Success',
                        msg: 'Doctor Status Update',
                        status : !doctor[0].Status
                    });
                });
            }
            else {
                res.send({
                    code: 404,
                    content: 'Not Found',
                    msg: 'Doctor Not Found'
                });
                console.log('No Doctor found');
            }
        })
});
