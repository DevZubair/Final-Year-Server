var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Appointment = mongoose.model('Appointment');

module.exports = function (app) {
    app.use('/', router);
};

router.get('/getAllUsers', function (req, res, next) {

    Appointment.find({},{__v:0},

        function(err,allUsers) {

            if(err){
                res.send({
                    code: 500,
                    content : 'Internal Server Error',
                    msg: 'API not called properly'
                });
            }
            else if(allUsers[0]){
                res.send({
                    code: 200,
                    content : allUsers,
                    msg: 'Users retrieved successfully'
                });
            }
            else {
                res.send({
                    code: 404,
                    content: 'Not Found',
                    msg: 'No Users found'
                });
            }
        })
});
