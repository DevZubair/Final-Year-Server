var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Registration = mongoose.model('Registration');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/register', function (req, res, next) {

    res.send({
      code : 404 ,
      content : 'Not Found',
      msg : 'Missing Credentials'
    });

});
