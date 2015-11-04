var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Machine = mongoose.model('Machine');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/getMachineDetail', function (req, res, next) {

    var DoctorID = req.body.DoctorID || req.query.DoctorID || req.headers['x-access-DoctorID'],
    ClinicID = req.body.ClinicID || req.query.ClinicID || req.headers['x-access-ClinicID'];

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
                res.send({
                    code: 200,
                    content : machine,
                    msg: 'Machine retrieved successfully'
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
