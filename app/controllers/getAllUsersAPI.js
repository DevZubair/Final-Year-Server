var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    User = mongoose.model('User');

module.exports = function (app) {
    app.use('/', router);
};

router.get('/getAllUsers', function (req, res, next) {

    User.find({},{__v:0},

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
