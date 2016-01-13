var express  = require('express'),
    router   = express.Router(),
    mongoose = require('mongoose'),
    Doctor   = mongoose.model('Doctor'),
    Clinic   = mongoose.model('Clinic'),
    Appointment = mongoose.model('Appointment'),
    Machine   = mongoose.model('Machine');

module.exports = function (app) {
    app.use('/', router);
};

router.post('/addReview', function (req, res, next) {

    var AppointID = req.body.AppointID || req.query.AppointID || req.headers['x-access-AppointID'],
        comments = req.body.comments || req.query.comments || req.headers['x-access-comments'],
        rating = req.body.rating || req.query.rating || req.headers['x-access-rating'],
        today = new Date();
    today.setHours(0,0,0,0);

    if(AppointID)
    {
        Appointment.findOne({_id : AppointID}, function (err,appointment) {
            if (err) {
                res.send({
                    code: 500,
                    content: 'Not Found',
                    msg: 'Internal Server Error'
                });
            }
            else if (appointment != null) {

                Appointment.update({"_id" : AppointID},{
                    "Reviews" : {stars : rating, comments : comments}
                }, function () {
                    res.send({
                        code : 200,
                        content : 'Success',
                        msg : 'Review is saved in the db'
                    });
                });
            }
            else{
                res.send({
                    code: 404,
                    content: 'Not Found',
                    msg: 'Appointment is not found'
                });
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
