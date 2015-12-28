var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Machine = mongoose.model('Machine');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/changeServeNumber', function (req, res, next) {

    var DoctorID = req.body.DoctorID || req.query.DoctorID || req.headers['x-access-DoctorID'],
        ClinicID = req.body.ClinicID || req.query.ClinicID || req.headers['x-access-ClinicID'],
        serveNumber = req.body.serveNumber || req.query.serveNumber || req.headers['x-access-serveNumber'],
        serveMobileID = req.body.serveMobileID || req.query.serveMobileID || req.headers['x-access-serveMobileID'];

    Machine.find({DoctorID : DoctorID, ClinicID : ClinicID},{__v:0},

        function(err,machine) {

            if(err){
                res.send({
                    code: 500,
                    content : 'Internal Server Error',
                    msg: 'API not called properly'
                });
            }
            else if(machine!=null){

                Machine.update({"DoctorID" : DoctorID, "ClinicID" : ClinicID}, {

                    //This will remove the current served user from waiting members list

                    "ClinicID" : ClinicID,
                    "DoctorID" : DoctorID,
                    "CurrentNumber" : serveNumber,
                    $pull: { WaitingPersons: { $in: serveMobileID }},
                    "DateTime": new Date()

                }, function () {
                    res.send({
                        code: 200,
                        content : 'OK',
                        msg: 'Serve Number is updated'
                    });
                });
            }
            else {
                res.send({
                    code: 404,
                    content: 'Not Found',
                    msg: 'No Machine found'
                });
            }
        })
});
