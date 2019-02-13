const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaperSchema = new Schema({

    title: { type: 'String' },
    detail: { type: 'String' },
    path: { type: 'String' },
    user:{type:'String'},

});

module.exports = mongoose.model('paper', PaperSchema);
