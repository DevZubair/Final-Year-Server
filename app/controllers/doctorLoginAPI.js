var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Doctor = mongoose.model('Doctor');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/doctorLogin', function (req, res, next) {

    var Username = req.body.Username || req.query.Username || req.headers['x-access-Username'],
        Password = req.body.Password || req.query.Password || req.headers['x-access-Password'];

    Doctor.find({Username : Username, Password : Password},{__v:0},

        function(err,doctor) {

            if(err){
                res.send({
                    code: 500,
                    content : 'Internal Server Error',
                    msg: 'API not called properly'
                });
            }
            else if(doctor!=''){
                res.send({
                    code: 200,
                    content : doctor[0],
                    msg: 'Doctor logged in successfully'
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
