var express  = require('express'),
    router   = express.Router(),
    mongoose = require('mongoose'),
    Doctor   = mongoose.model('Doctor'),
    Clinic   = mongoose.model('Clinic');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/addDoctor', function (req, res, next) {

    var DoctorFirstName = req.body.DoctorFirstName || req.query.DoctorFirstName || req.headers['x-access-DoctorFirstName'],
        DoctorLastName  = req.body.DoctorLastName || req.query.DoctorLastName || req.headers['x-access-DoctorLastName'],
        Role            = req.body.Role || req.query.Role || req.headers['x-access-Role'],
        Speciality      = req.body.Speciality || req.query.Speciality || req.headers['x-access-Speciality'],
        ClinicID        = req.body.ClinicID || req.query.ClinicID || req.headers['x-access-ClinicID'],
        Timings         = req.body.Timings || req.query.Timings || req.headers['x-access-Timings'];

    if(DoctorFirstName && DoctorLastName && ClinicID && Timings)
    {
        Clinic.findOne({_id : ClinicID}, function (err,clinic) {
            if (err) {
                res.send({
                    code: 500,
                    content: 'Not Found',
                    msg: 'Internal Server Error'
                });
            }
            else if (clinic != null) {
                Doctor.findOne({DoctorFirstName : DoctorFirstName, DoctorLastName : DoctorLastName}, function (err,doctor) {
                    if (err) {
                        res.send({
                            code: 500,
                            content: 'Not Found',
                            msg: 'Internal Server Error'
                        });
                    }
                    else if (doctor != null) {
                        res.send({
                            code: 200,
                            content: 'Doctor Found',
                            msg: 'Doctor is already in the db'
                        });
                    }
                    else{
                        var doctor_info=new Doctor({
                            DoctorFirstName : DoctorFirstName,
                            DoctorLastName : DoctorLastName,
                            Role : Role,
                            Speciality : Speciality,
                            ClinicID : ClinicID,
                            Timings : Timings,
                            Status : "Available"
                        });

                        doctor_info.save(function(error,data){
                            if(error){
                                res.send({
                                    code : 400,
                                    content : 'Bad Request',
                                    msg : 'Doctor is not saved in the db'
                                });
                            }
                            else{
                                Clinic.update({"_id" : ClinicID},{
                                    $addToSet: { Doctors: data.id }
                                }, function () {
                                    res.send({
                                        code : 200,
                                        content : 'Success',
                                        msg : 'Doctor is saved in the db'
                                    });
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
                    msg: 'Clinic ID is not correct'
                });
            }
        });
    }
    else {
        res.send({
            code: 404,
            content: 'Not Found',
            msg: 'Missing Credentials'
        });
    }
});
