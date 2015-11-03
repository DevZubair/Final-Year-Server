var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/registerMobile', function (req, res, next) {

    res.send({
      code : 404 ,
      content : 'Not Found',
      msg : 'Missing Credentials'
    });

});
