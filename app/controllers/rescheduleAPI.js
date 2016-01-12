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
        MobileID  = req.body.MobileID || req.query.MobileID || req.headers['x-access-MobileID'];

    if(DoctorID && ClinicID && MobileID){

        Appointment.find({DoctorID : DoctorID, ClinicID : ClinicID, MobileID : MobileID, rescheduleAttempt : 0},{__v:0},

            function(err,appointment) {

                if (err) {
                    res.send({
                        code: 500,
                        content: 'Not Found',
                        msg: 'Internal Server Error'
                    });
                }
                else if (appointment[0]) {
                    Machine.find({DoctorID : DoctorID, ClinicID : ClinicID},{__v:0},

                        function(err,machine) {

                            if (err) {
                                res.send({
                                    code: 500,
                                    content: 'Not Found',
                                    msg: 'Internal Server Error'
                                });
                            }
                            else if (machine[0]) {
                                Appointment.update({"DoctorID" : DoctorID, "ClinicID" : ClinicID}, {

                                    //This will remove the current served user from waiting members list
                                    "ClinicID" : ClinicID,
                                    "DoctorID" : DoctorID,
                                    "DeviceNumber" : machine.TotalAppointments + 1,
                                    "rescheduleAttempt" : 1,
                                    "DateTime": new Date()

                                },function () {
                                    res.send({
                                        code: 200,
                                        content:  machine.TotalAppointments + 1,
                                        msg: 'Successfully rescheduled the number'
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
