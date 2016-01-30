var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Clinic = mongoose.model('Clinic');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/deleteClinic', function (req, res, next) {

    var ClinicID = req.body.ClinicID || req.query.ClinicID || req.headers['x-access-ClinicID'];

    Clinic.find({_id : ClinicID},{__v:0},

        function(err,ClinicData) {

            if(err){
                res.send({
                    code: 500,
                    content : 'Internal Server Error',
                    msg: 'API not called properly'
                });
            }
            else if(ClinicData[0] != undefined){
                Clinic.remove( { _id: ClinicID }, function (err,data) {
                    if(err){
                        res.send({
                            code: 500,
                            content : 'Internal Server Error',
                            msg: 'API not called properly'
                        });
                    }
                    else{
                        res.send({
                            code: 200,
                            content: 'Deleted',
                            msg: 'Clinic is removed'
                        });
                    }
                })
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
