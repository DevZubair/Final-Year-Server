var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Admin = mongoose.model('Admin');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/getAdminDetail', function (req, res, next) {

    var AdminID = req.body.AdminID || req.query.AdminID || req.headers['x-access-AdminID'];

    Admin.find({_id : AdminID},{__v:0},

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
