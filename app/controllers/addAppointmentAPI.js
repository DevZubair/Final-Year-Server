var express  = require('express'),
    router   = express.Router(),
    mongoose = require('mongoose'),
    Doctor   = mongoose.model('Doctor'),
    Clinic   = mongoose.model('Clinic'),
    Appointment = mongoose.model('Appointment'),
    Machine   = mongoose.model('Machine');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/addAppointment', function (req, res, next) {

    var MobileID = req.body.MobileID || req.query.MobileID || req.headers['x-access-MobileID'],
        PatientFirstName = req.body.PatientFirstName || req.query.PatientFirstName || req.headers['x-access-PatientFirstName'],
        PatientLastName = req.body.PatientLastName || req.query.PatientLastName || req.headers['x-access-PatientLastName'],
        PatientAge = req.body.PatientAge || req.query.PatientAge || req.headers['x-access-PatientAge'],
        ClinicID = req.body.ClinicID || req.query.ClinicID || req.headers['x-access-ClinicID'],
        DoctorID = req.body.DoctorID || req.query.DoctorID || req.headers['x-access-DoctorID'],
        Gender = req.body.Gender || req.query.Gender || req.headers['x-access-Gender'];

    if(MobileID && PatientFirstName && PatientLastName && ClinicID && DoctorID)
    {
        Machine.findOne({ClinicID : ClinicID, DoctorID : DoctorID}, function (err,machine) {
            if (err) {
                res.send({
                    code: 500,
                    content: 'Not Found',
                    msg: 'Internal Server Error'
                });
            }
            else if (machine[0] != '') {

                Appointment.findOne({MobileID : MobileID, ClinicID : ClinicID, DoctorID : DoctorID}, function (err,appointment) {
                    if (err) {
                        res.send({
                            code: 500,
                            content: 'Not Found',
                            msg: 'Internal Server Error'
                        });
                    }
                    else if (appointment != null) {
                        res.send({
                            code: 400,
                            content: 'Appointment Found',
                            msg: 'Appointment is already taken from this user'
                        });
                    }
                    else{
                        var appointment_info=new Appointment({
                            MobileID : MobileID,
                            AppointmentNumber : (machine.CurrentNumber + machine.WaitingPersons.length) + 1,
                            PatientFirstName : PatientFirstName,
                            PatientLastName : PatientLastName,
                            PatientAge : PatientAge,
                            Gender : Gender,
                            ClinicID : ClinicID,
                            DoctorID : DoctorID,
                            DateTime : new Date()
                        });

                        appointment_info.save(function(error,data){
                            if(error){
                                res.send({
                                    code : 400,
                                    content : 'Bad Request',
                                    msg : 'Appointment is not saved in the db'
                                });
                            }
                            else{
                                Machine.update({"_id" : machine.id},{
                                    $addToSet: { WaitingPersons: MobileID}
                                }, function () {
                                    res.send({
                                        code : 200,
                                        content : 'Success',
                                        AppointmentNumber : (machine.CurrentNumber + machine.WaitingPersons.length) + 1,
                                        msg : 'Appointment is saved in the db'
                                    });
                                });
                            }
                        })
                    }
                })
            }
            else {
                Appointment.findOne({MobileID : MobileID, ClinicID : ClinicID, DoctorID : DoctorID}, function (err,appointment) {
                    if (err) {
                        res.send({
                            code: 500,
                            content: 'Not Found',
                            msg: 'Internal Server Error'
                        });
                    }
                    else if (appointment != null) {
                        res.send({
                            code: 400,
                            content: 'Appointment Found',
                            msg: 'Appointment is already taken from this user'
                        });
                    }
                    else{
                        var appointment_info=new Appointment({
                            MobileID : MobileID,
                            AppointmentNumber : 1,
                            PatientFirstName : PatientFirstName,
                            PatientLastName : PatientLastName,
                            PatientAge : PatientAge,
                            ClinicID : ClinicID,
                            DoctorID : DoctorID,
                            DateTime : new Date()
                        });

                        appointment_info.save(function(error,data){
                            if(error){
                                res.send({
                                    code : 400,
                                    content : 'Bad Request',
                                    msg : 'Appointment is not saved in the db'
                                });
                            }
                            else{
                                var machine_info=new Machine({
                                    ClinicID : ClinicID,
                                    DoctorID : DoctorID,
                                    DateTime : new Date(),
                                    CurrentNumber : 1,
                                    WaitingPersons : [MobileID]
                                });

                                machine_info.save(function(error,data) {
                                    if (error) {
                                        res.send({
                                            code: 400,
                                            content: 'Bad Request',
                                            msg: 'Appointment is not saved in the db'
                                        });
                                    }
                                    else {
                                        res.send({
                                            code: 200,
                                            content: 'Success',
                                            AppointmentNumber : 1,
                                            msg: 'Appointment is saved in the db'
                                        });
                                    }
                                })
                            }
                        })
                    }
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
