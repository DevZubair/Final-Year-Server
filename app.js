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

var changeStatus = require('./app/controllers/changeDoctorStatus.js'),
    changeServe = require('./app/controllers/changeServeNumber.js');

io.on('connection', function (socket) {

    //When User Connected
    console.log('USER connected' + socket.id);

    socket.on('device_active', function(onlineData) {

        console.log("Device of Clinic#" + onlineData.clinicID + "and Doctor#" + onlineData.doctorID + ",active method is called");

        changeServe.changeServeNumber(onlineData.doctorID, onlineData.clinicID, onlineData.nowServing, function (APIstatus) {

            if(APIstatus.code == 200){
                console.log("++++++ NOW SERVING +++++");
                console.log("--------- " + onlineData.nowServing + "----------");

                socket.emit('device_active', {
                    clinicID: onlineData.clinicID,
                    doctorID : onlineData.doctorID,
                    nowServing : onlineData.nowServing,
                    inWaiting : APIstatus.waiting,
                    dateTime : new Date(),
                    code : 200
                });
            }
            else{
                console.log('Pulse change number API error!');
                socket.emit('device_active', {
                    dateTime : new Date(),
                    code : 404
                });
            }
        });
    });

// when the user disconnects.. perform this
    socket.on('disconnect', function () {

        console.info('Doctor disconnected (ID=' + socket.id + ').');

    });

    socket.on('connectedDoctor', function (data) {

        changeStatus.changeDoctorStatus(data.doctorID,data.clinicID,function(APIstatus){
            if(APIstatus == 200){
                console.log('Doctor ID :' + data.doctorID + ' Doctor Name : ' + data.doctorFirstName + ' is online');

                socket.broadcast.emit('doctorStatusMethod',{
                    doctorID : data.DoctorID,
                    clinicID : data.ClinicID,
                    status : 'Available',
                    code : 200
                });
            }
            else{
                console.log('Doctor change status API error!');
                socket.broadcast.emit('doctorStatusMethod',{

                    code : 404
                });
            }
        });
    });

    socket.on('doctor_offline', function(data) {

        console.log("----------- doctor_offline -------------");

        changeStatus.changeDoctorStatus(data.doctorID,data.clinicID,function(APIstatus){
            if(APIstatus == 200){
                console.log('Doctor ID :' + data.doctorID + ' Doctor Name : ' + data.doctorFirstName + ' is offline');
                socket.emit('doctor_offline', {

                });
                socket.broadcast.emit('doctorStatusMethod',{
                    doctorID : data.DoctorID,
                    clinicID : data.ClinicID,
                    status : 'Not Available',
                    code : 200
                });
            }
            else{
                console.log('Doctor change status API error!');
                socket.broadcast.emit('doctorStatusMethod',{
                    code : 404
                });
            }
        });
    });
});
//app.listen(config.port);
console.log('Server is running at ' + config.port);
