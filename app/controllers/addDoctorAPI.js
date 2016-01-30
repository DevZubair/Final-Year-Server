var express  = require('express'),
    router   = express.Router(),
    mongoose = require('mongoose'),
    Doctor   = mongoose.model('Doctor'),
    Clinic   = mongoose.model('Clinic'),
    Machine   = mongoose.model('Machine');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/addDoctor', function (req, res, next) {

    var DoctorFirstName = req.body.DoctorFirstName || req.query.DoctorFirstName || req.headers['x-access-DoctorFirstName'],
        DoctorLastName  = req.body.DoctorLastName || req.query.DoctorLastName || req.headers['x-access-DoctorLastName'],
        Role            = req.body.Role || req.query.Role || req.headers['x-access-Role'],
        Speciality      = req.body.Speciality || req.query.Speciality || req.headers['x-access-Speciality'],
        ClinicID        = req.body.ClinicID || req.query.ClinicID || req.headers['x-access-ClinicID'],
        Timings         = req.body.Timings || req.query.Timings || req.headers['x-access-Timings'],
        Password        = req.body.Password || req.query.Password || req.headers['x-access-Password'],
        Username        = req.body.Username || req.query.Username || req.headers['x-access-Username'];

    if(DoctorFirstName && DoctorLastName && ClinicID && Timings && Password && Username)
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
                Doctor.findOne({Username : Username}, function (err,doctor) {
                    if (err) {
                        res.send({
                            code: 500,
                            content: 'Not Found',
                            msg: 'Internal Server Error'
                        });
                    }
                    else if (doctor != null) {

                        Doctor.update({"Username" : Username},{
                            "DoctorFirstName" : DoctorFirstName,
                            "DoctorLastName" : DoctorLastName,
                            "Role" : Role,
                            "Speciality" : Speciality,
                            "Timings" : Timings,
                            "Status" : false,
                            "Password" : Password

                        }, function () {
                            res.send({
                                code: 200,
                                content: 'Doctor Found',
                                msg: 'Doctor is updated in the db'
                            });
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
                            Status : false,
                            Password : Password,
                            Username : Username
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
                                    var machine_info=new Machine({
                                        ClinicID : ClinicID,
                                        DoctorID : data.id,
                                        DateTime : new Date(),
                                        CurrentNumber : 0,
                                        TotalAppointments : 0,
                                        WaitingPersons : []
                                    });
                                    machine_info.save(function(error,data) {
                                        if (error) {
                                            res.send({
                                                code: 400,
                                                content: 'Bad Request',
                                                msg: 'Device is not saved in the db'
                                            });
                                        }
                                        else {
                                            res.send({
                                                code : 200,
                                                content : 'Success',
                                                msg : 'Device and Doctor is saved in the db'
                                            });
                                        }
                                    })
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
