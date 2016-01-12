var mongoose = require('mongoose'),
    Appointment = mongoose.model('Appointment');

exports.deleteAppointments = function (callBack) {

    mongoose.model('Appointment').remove({},
        function (err, Room) {
            if (err) {
                console.log('Internal Server Error');
            }
            else if (Room != null) {

                callBack(200);
            }
            else {
                callBack(404)
            }
        });
};
