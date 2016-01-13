var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Admin = mongoose.model('Admin');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/adminLogin', function (req, res, next) {

    var Username = req.body.Username || req.query.Username || req.headers['x-access-Username'],
        Password = req.body.Password || req.query.Password || req.headers['x-access-Password'];

    Admin.find({Username : Username, Password : Password},{__v:0},

        function(err,admin) {

            if(err){
                res.send({
                    code: 500,
                    content : 'Internal Server Error',
                    msg: 'API not called properly'
                });
            }
            else if(admin!=''){
                res.send({
                    code: 200,
                    content : admin[0],
                    msg: 'Admin logged in successfully'
                });
            }
            else {
                res.send({
                    code: 404,
                    content: 'Not Found',
                    msg: 'No Admin found'
                });
            }
        })
});
