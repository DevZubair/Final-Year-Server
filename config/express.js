var express        = require('express'),
    glob           = require('glob'),
    app            = express(),
    favicon        = require('serve-favicon'),
    logger         = require('morgan'),
    cookieParser   = require('cookie-parser'),
    bodyParser     = require('body-parser'),
    compress       = require('compression'),
    methodOverride = require('method-override');

module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  app.use(logger('dev'));
  app.use(function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
  });

  app.use(bodyParser.json());         //use for JSON form data uploading
  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(methodOverride());

  var controllers1 = glob.sync(config.root + '/app/controllers/home.js');

  controllers1.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers2 = glob.sync(config.root + '/app/controllers/registerMobileAPI.js');

  controllers2.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers3 = glob.sync(config.root + '/app/controllers/addAppointmentAPI.js');

  controllers3.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers4 = glob.sync(config.root + '/app/controllers/addClinicAPI.js');

  controllers4.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers5 = glob.sync(config.root + '/app/controllers/addDoctorAPI.js');

  controllers5.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers6 = glob.sync(config.root + '/app/controllers/getClinicsAPI.js');

  controllers6.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers7 = glob.sync(config.root + '/app/controllers/getDoctorsAPI.js');

  controllers7.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers8 = glob.sync(config.root + '/app/controllers/getDoctorDetailAPI.js');

  controllers8.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers9 = glob.sync(config.root + '/app/controllers/getMachineStatusAPI.js');

  controllers9.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers10 = glob.sync(config.root + '/app/controllers/getAllAppointmentsAPI.js');

  controllers10.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers12 = glob.sync(config.root + '/app/controllers/doctorLoginAPI.js');

  controllers12.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers13 = glob.sync(config.root + '/app/controllers/getAllUsersAPI.js');

  controllers13.forEach(function (controller) {
    require(controller)(app);
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.send(err);
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err);
  });
};
