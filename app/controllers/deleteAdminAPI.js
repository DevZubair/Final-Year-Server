var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Admin = mongoose.model('Admin');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/deleteAdmin', function (req, res, next) {

    var AdminID = req.body.AdminID || req.query.AdminID || req.headers['x-access-AdminID'];

    Admin.find({_id : AdminID},{__v:0},

        function(err,allAdmins) {

            if(err){
                res.send({
                    code: 500,
                    content : 'Internal Server Error',
                    msg: 'API not called properly'
                });
            }
            else if(allAdmins[0] != undefined){
                Admin.remove( { _id: AdminID }, function (err,data) {
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
                            msg: 'Admin is removed'
                        });
                    }
                })
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
