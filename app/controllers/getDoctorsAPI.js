var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Doctor = mongoose.model('Doctor');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/getClinicDoctors', function (req, res, next) {

    var ClinicID = req.body.ClinicID || req.query.ClinicID || req.headers['x-access-ClinicID'];

    Doctor.find({ClinicID : ClinicID},{__v:0,Username:0,Password:0},

        function(err,allDoctors) {

            if(err){
                res.send({
                    code: 500,
                    content : 'Internal Server Error',
                    msg: 'API not called properly'
                });
            }
            else if(allDoctors[0]!=''){
                res.send({
                    code: 200,
                    content : allDoctors,
                    msg: 'Clinic Doctors retrieved successfully'
                });
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
