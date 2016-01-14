var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Appointment = mongoose.model('Appointment');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/getAllAppointments', function (req, res, next) {

    var MobileID = req.body.MobileID || req.query.MobileID || req.headers['x-access-MobileID'];
    var today = new Date();
    today.setHours(0,0,0,0);

    Appointment.find({MobileID : MobileID, DateTime : {"$gte" : today }, cancelAppoint : false },{__v:0},

        function(err,allAppointments) {

            if(err){
                res.send({
                    code: 500,
                    content : 'Internal Server Error',
                    msg: 'API not called properly'
                });
            }
            else if(allAppointments[0]!=undefined){

                res.send({
                    code: 200,
                    content : allAppointments,
                    msg: 'Appointments retrieved successfully'
                });
            }
            else {
                res.send({
                    code: 404,
                    content: 'Not Found',
                    msg: 'No Appointments found'
                });
            }
        })
});
