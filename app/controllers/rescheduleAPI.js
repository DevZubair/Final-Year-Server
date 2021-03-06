var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Machine = mongoose.model('Machine'),
    Appointment = mongoose.model('Appointment');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/rescheduleNumber', function (req, res, next) {

    var DoctorID = req.body.DoctorID || req.query.DoctorID || req.headers['x-access-DoctorID'],
        ClinicID  = req.body.ClinicID || req.query.ClinicID || req.headers['x-access-ClinicID'],
        MobileID  = req.body.MobileID || req.query.MobileID || req.headers['x-access-MobileID'],
        AppointID  = req.body.AppointID || req.query.AppointID || req.headers['x-access-AppointID'];
    var today = new Date();
    today.setHours(0,0,0,0);
    if(DoctorID && ClinicID && MobileID){

        Appointment.find({_id : AppointID, rescheduleAttempt : 0},{__v:0},

            function(err,appointment) {

                if (err) {
                    res.send({
                        code: 500,
                        content: 'Not Found',
                        msg: 'Internal Server Error'
                    });
                }
                else if (appointment[0] != undefined) {
                    Machine.find({DoctorID : DoctorID, ClinicID : ClinicID},{__v:0},

                        function(err,machine) {

                            if (err) {
                                res.send({
                                    code: 500,
                                    content: 'Not Found',
                                    msg: 'Internal Server Error'
                                });
                            }
                            else if (machine[0] != undefined) {
                                Appointment.update({"_id" : AppointID}, {

                                    //This will remove the current served user from waiting members list
                                    "ClinicID" : ClinicID,
                                    "DoctorID" : DoctorID,
                                    "AppointmentNumber" : machine[0].TotalAppointments + 1,
                                    "rescheduleAttempt" : 1,
                                    "DateTime": new Date()

                                },function () {
                                    Machine.update({"DoctorID" : DoctorID, "ClinicID" : ClinicID}, {

                                        "TotalAppointments" : machine[0].TotalAppointments + 1,
                                        "DateTime": new Date()

                                    },function () {
                                        res.send({
                                            code: 200,
                                            content:  machine[0].TotalAppointments + 1,
                                            msg: 'Successfully rescheduled the number'
                                        });
                                    });
                                });
                            }
                            else {
                                res.send({
                                    code: 404,
                                    content:  'Not found',
                                    msg: 'Device Not found'
                                });
                            }
                        });
                }
                else{
                    res.send({
                        code: 404,
                        content:  "Already Rescheduled",
                        msg: 'Sorry you have already rescheduled'
                    });
                }
            });
    }
    else{
        res.send({
            code: 404,
            content: 'Not Found',
            msg: 'Missing Credentials'
        });
    }
});
