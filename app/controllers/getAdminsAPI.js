var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Admin = mongoose.model('Admin');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/getAdmins', function (req, res, next) {

    var ClinicID = req.body.ClinicID || req.query.ClinicID || req.headers['x-access-ClinicID'];

    Admin.find({ClinicID : ClinicID},{__v:0},

        function(err,allAdmins) {

            if(err){
                res.send({
                    code: 500,
                    content : 'Internal Server Error',
                    msg: 'API not called properly'
                });
            }
            else if(allAdmins[0]!=undefined){
                res.send({
                    code: 200,
                    content : allAdmins,
                    msg: 'Clinic Admins retrieved successfully'
                });
            }
            else {
                res.send({
                    code: 404,
                    content: 'Not Found',
                    msg: 'No Admins found'
                });
            }
        })
});
