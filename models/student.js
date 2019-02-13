const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  email: { type: 'String', required: false },
  user: { type: 'String', required: true },
  password: { type: 'String', required: true },
  phone: { type: 'String', required: false },
  address:{ type: 'String', required: false},
  name : {type: 'String' , required :false},
  father_name: {type: 'String' , required :false},
  age:{type: 'String' , required :false},
  gender:{type: 'String' , required :false},
  class:{type: 'String' , required :false},
  cnic:{type: 'String' , required :false},
  father_cnic:{type: 'String' , required :false},
   section:{type: 'String' , required :false},
  roll_number:{type: 'String' , required :false},
  class_incharge:{type: 'String' , required :false},
  attendance :{type:'String'},
  dp_path:{type:'String'},
  marksheets:[
              {title:{type:"String"},subjects:[
                                                {name:{type:"String"},marks:{type:"String"}}
                                              ]}
             ],
  grand_papers:[
              {title:{type:"String"},subjects:[
                                                {name:{type:"String"},marks:{type:"String"}}
                                              ]}
             ],
           


});

module.exports = mongoose.model('student', StudentSchema);
