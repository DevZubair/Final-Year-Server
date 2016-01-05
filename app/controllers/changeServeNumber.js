var express = require('express'),
    router    = express.Router(),
    mongoose     = require('mongoose'),
    Machine = mongoose.model('Machine'),
    Appointment = mongoose.model('Appointment');

exports.changeServeNumber = function (DoctorID,ClinicID,serveNumber,callBack) {

    if(serveNumber!=0){

        Appointment.find({DoctorID : DoctorID, ClinicID : ClinicID, AppointmentNumber : serveNumber},{__v:0},

            function(err,appointment) {

                if (err) {
                    callBack({
                        code : 500
                    });
                }
                else if (appointment[0]) {
                    Machine.update({"DoctorID" : DoctorID, "ClinicID" : ClinicID}, {

                        //This will remove the current served user from waiting members list

                        "ClinicID" : ClinicID,
                        "DoctorID" : DoctorID,
                        "CurrentNumber" : serveNumber,
                        $pull: { WaitingPersons: appointment[0].MobileID },
                        "DateTime": new Date()

                    }, function () {
                        callBack({
                            code : 200,
                            waiting : appointment[0].WaitingPersons.length
                        });
                    });
                }
                else{
                    callBack({
                        code : 404
                    });
                }
            });
    }
    else{
        Machine.update({"DoctorID" : DoctorID, "ClinicID" : ClinicID}, {

            //This will remove the current served user from waiting members list

            "ClinicID" : ClinicID,
            "DoctorID" : DoctorID,
            "CurrentNumber" : serveNumber,
            "DateTime": new Date()

        }, function () {
            callBack({
                code : 200,
                waiting : 0
            });
        });
    }
};
