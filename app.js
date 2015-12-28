var express   = require('express'),
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

    socket.on('machine_active', function(onlineData) {

        console.log("Machine of Clinic#" + onlineData.clinicID + "and Doctor#" + onlineData.doctorID + ",active method is called");

       /* newMessage.saveMessage(conversationID, uniqueID, message, userEmail, currentDate, function (Room) {

            //for push Notification
            pushNotification.sendPushes(Room.Users, message, userEmail, conversationID);

        });*/

        socket.emit('machine_active', {
            clinicID: onlineData.clinicID,
            doctorID : onlineData.doctorID,
            nowServing : onlineData.nowServing,
            inWaiting : onlineData.inWaiting,
            dateTime : new Date()
        });
    });

// when the user disconnects.. perform this
socket.on('disconnect', function (data) {

    console.info('Client disconnected (id=' + socket.id + ').');
    // echo globally that this client has left
    socket.emit('disconnected', {
        // userEmail : data.userEmail
    });
});

socket.on('connect', function (data) {

    socket.emit('connect',{

    })
});

socket.on('user_offline', function(data) {

    console.log("----------- user_offline -------------");

    socket.emit('user_offline', {

    });
});

});
//app.listen(config.port);
console.log('Server is running at ' + config.port);
