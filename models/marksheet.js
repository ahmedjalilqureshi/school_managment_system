const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MarksheetSchema = new Schema({

    title: { type: 'String' },
    pic_path: { type: 'String' },
    pdf_path:{type:'String'},
    student_user:{type:'String'},
    teacher_user:{type:'String'}

});

module.exports = mongoose.model('marksheet', MarksheetSchema);
