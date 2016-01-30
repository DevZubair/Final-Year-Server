var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Doctor = mongoose.model('Doctor'),
    Machine = mongoose.model('Machine');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/deleteClinicDoctors', function (req, res, next) {

    var ClinicID = req.body.ClinicID || req.query.ClinicID || req.headers['x-access-ClinicID'],
        DoctorID = req.body.DoctorID || req.query.DoctorID || req.headers['x-access-DoctorID'];

    Doctor.find({_id : DoctorID},{__v:0},

        function(err,allDoctors) {

            if(err){
                res.send({
                    code: 500,
                    content : 'Internal Server Error',
                    msg: 'API not called properly'
                });
            }
            else if(allDoctors[0] != undefined){
                Doctor.remove( { _id: DoctorID }, function (err,data) {
                    if(err){
                        res.send({
                            code: 500,
                            content : 'Internal Server Error',
                            msg: 'API not called properly'
                        });
                    }
                    else{
                        Machine.remove({DoctorID: DoctorID }, function (err,data) {
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
                })
            }
            else {
                res.send({
                    code: 404,
                    content: 'Not Found',
                    msg: 'No Doctor found'
                });
            }
        })
});
