var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Doctor = mongoose.model('Doctor');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/deleteClinicDoctors', function (req, res, next) {

    var ClinicID = req.body.ClinicID || req.query.ClinicID || req.headers['x-access-ClinicID'],
        DoctorID = req.body.DoctorID || req.query.DoctorID || req.headers['x-access-DoctorID'];

    Doctor.find({DoctorID : DoctorID},{__v:0},

        function(err,allDoctors) {

            if(err){
                res.send({
                    code: 500,
                    content : 'Internal Server Error',
                    msg: 'API not called properly'
                });
            }
            else if(allDoctors[0]!=''){
                Doctor.remove( { DoctorID: DoctorID }, function (err,data) {
                    if(err){
                        res.send({
                            code: 500,
                            content : 'Internal Server Error',
                            msg: 'API not called properly'
                        });
                    }
                    else{
                        res.send({
                            code: 200,
                            content: 'Deleted',
                            msg: 'Doctor is removed'
                        });
                    }
                })
            }
            else {
                res.send({
                    code: 404,
                    content: 'Not Found',
                    msg: 'No Doctors found'
                });
            }
        })
});
