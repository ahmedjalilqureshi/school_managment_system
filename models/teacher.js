const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
  email: { type: 'String', required: false },
  user: { type: 'String', required: true },
  password: { type: 'String', required: true },
  phone: { type: 'String', required: false },
  name : {type: 'String' , required :false},
  age:{type: 'String' , required :false},
  gender:{type: 'String' , required :false},
  subjects:[{type: 'String' , required :false}],
  cnic:{type: 'String' , required :false},
  address:{type: 'String' , required :false},
  classes:[{type:'String'}],
  });

module.exports = mongoose.model('teacher', TeacherSchema);
