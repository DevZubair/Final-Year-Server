var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Clinic = mongoose.model('Clinic');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/findClinic', function (req, res, next) {

    var ClinicName = req.body.ClinicName || req.query.ClinicName || req.headers['x-access-ClinicName'];

    Clinic.find({Name : ClinicName},{__v:0},

        function(err,Clinic) {

            if(err){
                res.send({
                    code: 500,
                    content : 'Internal Server Error',
                    msg: 'API not called properly'
                });
            }
            else if(Clinic[0]!=undefined){
                res.send({
                    code: 200,
                    content : Clinic,
                    msg: 'Clinic retrieved successfully'
                });
            }
            else {
                res.send({
                    code: 404,
                    content: 'Not Found',
                    msg: 'No Clinic found'
                });
            }
        })
});
