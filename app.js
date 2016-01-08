var express     = require('express'),
    app         = express(),
    config      = require('./config/config'),
    bodyParser  = require('body-parser'),
    glob        = require('glob'),
    mongoose    = require('mongoose'),
    server      = app.listen(config.port),
    io          = require('socket.io').listen(server);

//Connecting database
mongoose.connect(config.db);

var db = mongoose.connection;
db.on('error', function () {
    throw new Error('unable to connect to database at ' + config.db);
});

//Connecting Schemas
var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
    require(model);
});

require('./config/express')(app, config);

io.on('connection', function (socket) {

    //When User Connected
    console.log('USER connected' + socket.id);

    socket.on('device_active', function(onlineData) {

        console.log("++++++ NOW SERVING +++++");
        console.log("--------- " + onlineData.nowServing + "----------");

        socket.broadcast.emit('device_active', {
            clinicID: onlineData.clinicID,
            doctorID : onlineData.doctorID,
            nowServing : onlineData.nowServing,
            inWaiting : onlineData.inWaiting,
            dateTime : new Date(),
            code : 200
        });
    });

// when the user disconnects.. perform this
    socket.on('disconnect', function () {

        console.info('Doctor disconnected (ID=' + socket.id + ').');

    });

    socket.on('connectedDoctor', function (data) {

        console.log('Doctor ID :' + data.doctorID + ' Doctor Name : ' + data.doctorFirstName + ' is online');

        socket.broadcast.emit('doctorOnlineStatus',{
            doctorID : data.doctorID,
            clinicID : data.clinicID,
            status : 'Available'
        });
    });

    socket.on('doctor_offline', function(data) {

        console.log("----------- doctor_offline -------------");
        console.log('Doctor ID :' + data.doctorID + ' Doctor Name : ' + data.doctorFirstName + ' is offline');

        socket.broadcast.emit('doctorOfflineStatus',{
            doctorID : data.doctorID,
            clinicID : data.clinicID,
            status : 'Not Available'
        });
    });
});
//app.listen(config.port);
console.log('Server is running at ' + config.port);
