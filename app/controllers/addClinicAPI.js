var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Clinic = mongoose.model('Clinic');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/addClinic', function (req, res, next) {

    var clinicName = req.body.Name || req.query.Name || req.headers['x-access-Name'],
        clinicLocation = req.body.Location || req.query.Location || req.headers['x-access-Location'],
        clinicTimings = req.body.Timings || req.query.Timings || req.headers['x-access-Timings'];

    if(clinicName)
    {
        Clinic.findOne({Name : clinicName}, function (err,clinic) {
            if (err) {
                res.send({
                    code: 500,
                    content: 'Not Found',
                    msg: 'Internal Server Error'
                });
            }
            else if (clinic != null) {
                res.send({
                    code: 400,
                    content: 'Bad Request',
                    msg: 'Clinic is already in the db'
                });
            }
            else{
                var clinic_info=new Clinic({
                    Name : clinicName,
                    Location : clinicLocation,
                    Timings : clinicTimings,
                    Doctors : [],
                    createdDate : new Date()
                });

                clinic_info.save(function(error,data){
                    if(error){
                        res.send({
                            code : 400,
                            content : 'Bad Request',
                            msg : 'Clinic is not saved in the db'
                        });
                    }
                    else{
                        res.send({
                            code : 200,
                            content : 'Success',
                            msg : 'Clinic is saved in the db'
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
            msg: 'Missing Credentials'
        });
    }
});
