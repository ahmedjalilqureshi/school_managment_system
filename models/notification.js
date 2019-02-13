const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({

    role: { type: 'String' },
    user: { type: 'String' },
    detail: { type: 'String' },
    flag:{type:'Boolean'}

});

module.exports = mongoose.model('notification', NotificationSchema);
