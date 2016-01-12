var express  = require('express'),
    router   = express.Router(),
    mongoose = require('mongoose'),
    Clinic   = mongoose.model('Clinic'),
    Admin   = mongoose.model('Admin');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/addAdmin', function (req, res, next) {

    var FirstName = req.body.FirstName || req.query.FirstName || req.headers['x-access-FirstName'],
        LastName  = req.body.LastName || req.query.LastName || req.headers['x-access-LastName'],
        Age       = req.body.Age || req.query.Age || req.headers['x-access-Age'],
        Gender    = req.body.Gender || req.query.Gender || req.headers['x-access-Gender'],
        ClinicID  = req.body.ClinicID || req.query.ClinicID || req.headers['x-access-ClinicID'],
        ClinicName= req.body.ClinicName || req.query.ClinicName || req.headers['x-access-ClinicName'],
        Password  = req.body.Password || req.query.Password || req.headers['x-access-Password'],
        Username  = req.body.Username || req.query.Username || req.headers['x-access-Username'];

    if(FirstName && LastName && ClinicID && Password && Username)
    {
        Clinic.findOne({_id : ClinicID}, function (err,clinic) {
            if (err) {
                res.send({
                    code: 500,
                    content: 'Not Found',
                    msg: 'Internal Server Error'
                });
            }
            else if (clinic != null) {
                Admin.findOne({Username : Username}, function (err,doctor) {
                    if (err) {
                        res.send({
                            code: 500,
                            content: 'Not Found',
                            msg: 'Internal Server Error'
                        });
                    }
                    else if (doctor != null) {
                        res.send({
                            code: 200,
                            content: 'Admin Found',
                            msg: 'Admin is already in the db'
                        });
                    }
                    else{
                        var admin_info=new Admin({
                            FirstName : FirstName,
                            LastName : LastName,
                            Age : Age,
                            Gender : Gender,
                            ClinicID : ClinicID,
                            ClinicName : ClinicName,
                            DateTime : new Date(),
                            Password : Password,
                            Username : Username
                        });

                        admin_info.save(function(error,data){
                            if(error){
                                res.send({
                                    code : 400,
                                    content : 'Bad Request',
                                    msg : 'Admin is not saved in the db'
                                });
                            }
                            else{
                                res.send({
                                    code : 200,
                                    content : 'Success',
                                    msg : 'Admin is saved in the db'
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
                    msg: 'Clinic ID is not correct'
                });
            }
        });
    }
    else {
        res.send({
            code: 404,
            content: 'Not Found',
            msg: 'Missing Credentials'
        });
    }
});
