var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Machine = mongoose.model('Machine'),
    Appointment = mongoose.model('Appointment');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/cancelNumber', function (req, res, next) {

    var AppointID = req.body.AppointID || req.query.AppointID || req.headers['x-access-AppointID'],
        ClinicID = req.body.ClinicID || req.query.ClinicID || req.headers['x-access-ClinicID'],
        DoctorID = req.body.DoctorID || req.query.DoctorID || req.headers['x-access-DoctorID'],
        MobileID = req.body.MobileID || req.query.MobileID || req.headers['x-access-MobileID'];

    var today = new Date();
    today.setHours(0,0,0,0);

    if(AppointID && ClinicID && DoctorID && MobileID){

        Appointment.find({_id : AppointID},{__v:0},

            function(err,appointment) {

                if (err) {
                    res.send({
                        code: 500,
                        content: 'Not Found',
                        msg: 'Internal Server Error'
                    });
                }
                else if (appointment[0]) {
                    Machine.update({"DoctorID" : DoctorID, "ClinicID" : ClinicID}, {

                        //This will remove the user from waiting members list
                        $pull: { WaitingPersons: MobileID},
                        "DateTime": new Date()

                    },function () {

                        Appointment.remove({"_id":AppointID},function () {
                            res.send({
                                code: 200,
                                content:  'Appointment deleted',
                                msg: 'Successfully appointment is cancelled'
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
        res.send({
            code: 404,
            content: 'Not Found',
            msg: 'Missing Credentials'
        });
    }
});
