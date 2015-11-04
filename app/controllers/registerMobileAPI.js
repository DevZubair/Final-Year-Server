var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/registerMobile', function (req, res, next) {

    var mobileID = req.body.mobileID || req.query.mobileID || req.headers['x-access-mobileID'],
        Location = req.body.Location || req.query.Location || req.headers['x-access-Location'];

    if(mobileID)
    {
        User.findOne({mobileID : mobileID}, function (err,user) {
            if (err) {
                res.send({
                    code: 500,
                    content: 'Not Found',
                    msg: 'Internal Server Error'
                });
            }
            else if (user != null) {
                res.send({
                    code: 200,
                    content: 'User Found',
                    msg: 'User is already in the db'
                });
            }
            else{
                var user_info=new User({
                    mobileID : mobileID,
                    Location : Location,
                    Appointments : [],
                    Reviews : [],
                    createdDate : new Date()
                });

                user_info.save(function(error,data){
                    if(error){
                        res.send({
                            code : 400,
                            content : 'Bad Request',
                            msg : 'User is not saved in the db'
                        });
                    }
                    else{
                        res.send({
                            code : 200,
                            content : 'Success',
                            msg : 'User is saved in the db'
                        });
                    }
                })
            }
        })
    }
    else {
        res.send({
            code: 404,
            content: 'Not Found',
            msg: 'Missing Credentials'
        });
    }
});
