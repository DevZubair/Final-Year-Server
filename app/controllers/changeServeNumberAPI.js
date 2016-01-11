var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Machine = mongoose.model('Machine'),
    Appointment = mongoose.model('Appointment');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/changeServeNumber', function (req, res, next) {

    var DoctorID = req.body.DoctorID || req.query.DoctorID || req.headers['x-access-DoctorID'],
        ClinicID  = req.body.ClinicID || req.query.ClinicID || req.headers['x-access-ClinicID'],
        serveNumber  = req.body.serveNumber || req.query.serveNumber || req.headers['x-access-serveNumber'];

    if(req.body.serveNumber!=0){

        Appointment.find({DoctorID : DoctorID, ClinicID : ClinicID, AppointmentNumber : req.body.serveNumber},{__v:0},

            function(err,appointment) {

                if (err) {
                    res.send({
                        code: 500,
                        content: 'Not Found',
                        msg: 'Internal Server Error'
                    });
                }
                else if (appointment[0]) {
                    Appointment.update({"DoctorID" : DoctorID, "ClinicID" : ClinicID}, {

                        //This will remove the current served user from waiting members list
                        "ClinicID" : ClinicID,
                        "DoctorID" : DoctorID,
                        "DeviceNumber" : req.body.serveNumber,
                        "DateTime": new Date()

                    },{multi : true}, function () {
                        Appointment.update({"DoctorID" : DoctorID, "ClinicID" : ClinicID, AppointmentNumber : req.body.serveNumber}, {

                            //This will remove the current served user from waiting members list
                            "ClinicID" : ClinicID,
                            "DoctorID" : DoctorID,
                            "DateTime": new Date(),
                            "Past" : true

                        }, function () {

                            Machine.update({"DoctorID" : DoctorID, "ClinicID" : ClinicID}, {

                                //This will remove the current served user from waiting members list
                                "ClinicID" : ClinicID,
                                "DoctorID" : DoctorID,
                                "CurrentNumber" : req.body.serveNumber,
                                $pull: { WaitingPersons: appointment[0].MobileID},
                                "DateTime": new Date()

                            },{multi : true}, function () {
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
                                            res.send({
                                                code: 200,
                                                content:  machine[0].WaitingPersons.length,
                                                msg: 'Success'
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
                            });
                        });
                    });
                }
                else{
                    res.send({
                        code: 404,
                        content:  "Appointment Not found",
                        msg: 'Appointment Error'
                    });
                }
            });
    }
    else{
        Appointment.update({"DoctorID" : DoctorID, "ClinicID" : ClinicID}, {

            //This will remove the current served user from waiting members list
            "ClinicID" : ClinicID,
            "DoctorID" : DoctorID,
            "DeviceNumber" : req.body.serveNumber,
            "DateTime": new Date()

        },{multi : true}, function () {

            Machine.update({"DoctorID": DoctorID, "ClinicID": ClinicID}, {

                //This will remove the current served user from waiting members list

                "ClinicID": ClinicID,
                "DoctorID": DoctorID,
                "CurrentNumber": req.body.serveNumber,
                "DateTime": new Date()

            },{multi : true}, function () {
                res.send({
                    code: 200,
                    content: 0,
                    msg: 'Success'
                });
            });
        });
    }
});
