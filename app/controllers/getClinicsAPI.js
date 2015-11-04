var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Clinic = mongoose.model('Clinic');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/getAllClinics', function (req, res, next) {

    Clinic.find({},{__v:0},

        function(err,allClinics) {

            if(err){
                res.send({
                    code: 500,
                    content : 'Internal Server Error',
                    msg: 'API not called properly'
                });
            }
            else if(allClinics!=null){
                res.send({
                    code: 200,
                    content : allClinics,
                    msg: 'Clinics retrieved successfully'
                });
            }
            else {
                res.send({
                    code: 404,
                    content: 'Not Found',
                    msg: 'No Clinics found'
                });
            }
        })
});
