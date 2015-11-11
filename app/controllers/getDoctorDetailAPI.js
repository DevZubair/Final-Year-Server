var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Doctor = mongoose.model('Doctor');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/getDoctorDetail', function (req, res, next) {

    var DoctorID = req.body.DoctorID || req.query.DoctorID || req.headers['x-access-DoctorID'];

    Doctor.find({_id : DoctorID},{__v:0},

        function(err,doctor) {

            if(err){
                res.send({
                    code: 500,
                    content : 'Internal Server Error',
                    msg: 'API not called properly'
                });
            }
            else if(doctor!=null){
                res.send({
                    code: 200,
                    content : doctor,
                    msg: 'Doctor retrieved successfully'
                });
            }
            else {
                res.send({
                    code: 404,
                    content: 'Not Found',
                    msg: 'No Doctor found'
                });
            }
        })
});
