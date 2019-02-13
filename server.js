// project started on 18 july 2018 //

// dependencies //

var StudentModel = require("./models/student.js");
var TeacherModel = require("./models/teacher.js");
var SalaryModel = require("./models/salary.js");
var PaperModel = require("./models/paper.js");
var MarksheetModel = require("./models/marksheet.js");
var NotificationModel = require("./models/notification.js");
var express = require("express");
var fs = require("fs");
var path = require("path");
var formidable = require('formidable');
var sessions = require("express-session");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cookieParser = require('cookie-parser');
//--dependencies //

// Config //
var app = express();
var student_isSigned = false;
var teacher_isSigned = false;
var admin_isSigned = false;
var Student = {};

// if u dont have mongodb then comment below lines //
mongoose.connect("mongodb://rapshek:natsikap1@ds261450.mlab.com:61450/sm", (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("connection with mongodb is successfull");

    }
});
// mongodb config ends here //
//-- Config //

// Express Middlewares //

app.set("views", path.join(__dirname, "/public"))
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(sessions({
    secret: 'ddfd344f4dud8d8d8d8j',
    resave: false,
    saveUninitialized: true
}));


//-- Express Middleware //

// express Get requests //
app.get("/index.html", (req, res) => {
    res.redirect("/");
});

app.get("/", (req, res) => {
    res.render("index");
})
app.get("/studentlogin", (req, res) => {
    res.render("studentlogin");
});
app.get("/teacherlogin", (req, res) => {
    res.render("teacherlogin");
});
app.get("/studentportal", (req, res) => {
    let user_student = req.cookies.user_student;
    let student_issigned =req.cookies.student_issigned;
    if(user_student==undefined || student_issigned ==undefined){
        user_student=null;
        student_issigned = false;
        res.redirect("/studentlogin");
    }
    else{
        StudentModel.findOne({user:user_student},(err,Student)=>{
            res.render("studentportal", { student: Student });

        });
    }

   
})
app.get("/adminportal",(req,res)=>{
    if(!admin_isSigned){
        res.redirect("/");
}
})
app.get("/student/marksheets", (req, res) => {
    var email = req.query.email.toString();
    var password = req.query.password.toString();
    StudentModel.findOne({ email: email, password: password }, (err, student) => {
        if (err) {
            throw err;
        }
        res.write(JSON.stringify(student.marksheets));
        res.end();
    })
})
app.get("/student/bio", (req, res) => {
    var email = req.query.email.toString();
    var password = req.query.password.toString();
    StudentModel.findOne({ email: email, password: password }, (err, student) => {
        if (err) {
            throw err;
        };
        var stud = {
            "name": student.name,
            "father_name": student.father_name,
            "gender": student.gender,
            "age": student.age,
            "cnic": student.cnic,
            "father_cnic": student.father_cnic,
            "class": student.class,
            "section": student.section,
            "roll_number": student.roll_number
        }
        res.write(JSON.stringify(stud));
        res.end();
    })
})
app.get("/sp",(req,res)=>{
    res.render("studentportal");
});
app.get("/tp",(req,res)=>{
    res.render("teacherportal");
});
app.get("/admin",(req,res)=>{
    res.render("admin-portal");
})
app.get("/students/fetch_specific",(req,res)=>{
    var name = req.query.name;
    var user = req.query.user;
    if(user== undefined){
        StudentModel.find({name:name},(err,students)=>{
            var text = JSON.stringify(students);
            res.end(text); 
        })
    }
  else{
    StudentModel.find({user:user},(err,students)=>{
        var text = JSON.stringify(students);
        res.end(text); 
    })
  }
    
})
app.get("/students/marksheets",(req,res)=>{
    let student = req.cookies.user_student;
  MarksheetModel.find({student_user:student},(err,marksheets)=>{
    var text = JSON.stringify(marksheets);
    res.end(text);

  })
})
app.get("/students/fetch_all",(req,res)=>{
StudentModel.find({},(err,students)=>{
var text = JSON.stringify(students);
res.end(text);
})

})
app.get("/student_logout",(req,res)=>{
    res.clearCookie("user_student");
    res.clearCookie("issigned_student");
    res.redirect("/");
})
app.get("/teacher_logout",(req,res)=>{
    res.clearCookie("user_teacher");
    res.clearCookie("issigned_teacher");
    res.redirect("/");
})
app.get("/teachers/notifications",(req,res)=>{
    NotificationModel.find({role:"teacher",flag:true},(err,notifications)=>{
        let str = JSON.stringify(notifications);
        res.end(str);
    })
})
app.get("/teachers/papers",(req,res)=>{
    let teacher = req.query.user;
    PaperModel.find({user:teacher},(err,papers)=>{
        let str = JSON.stringify(papers);
        res.end(str);
    })
})
app.get("/teacherportal" , (req,res)=>{
    let user_teacher = req.cookies.user_teacher;
    let teacher_issigned =req.cookies.teacher_issigned;
    if(user_teacher==undefined || teacher_issigned ==undefined){
        user_teacher=null;
        teacher_issigned = false;
        res.redirect("/teacherlogin");
    }
    else{
        TeacherModel.findOne({user:user_teacher},(err,teacher)=>{
          let Teacher = teacher;
          let d = new Date();
          let date = d.getMonth()+"/"+d.getFullYear();
          console.log(Teacher);
          console.log(date);
          let salary_status = "no result for now";
          SalaryModel.find({month_year:date},(err,salaries)=>{
              if(err){
                  throw err;
              }
              console.log(salaries);
            
              for(var i=0 ; i<salaries.length ; i++){
                  for(var j=0; j<Teacher.classes.length ; j++ )
                  {
                      if(Teacher.classes[j]==salaries[i].class)
                      {
                          salary_status = salaries[i].status;
                      }
                  }
              }
              res.render("teacherportal",{teacher:Teacher,issigned:teacher_issigned,salary_status:salary_status});

          }) 

        });
    }
  
})

//-- express Get requests //

// express Post requests //
app.post("/marksheetUpload",(req,res)=>{
    let teacher =req.cookies.user_teacher;
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var title = fields.title;
        var student = fields.student;
          var pic_oldpath = files.pic.path;
          var pdf_oldpath = files.pdf.path;
          var pic_newpath =path.join(__dirname ,"./public/marksheets/",student,files.pic.name);
          var pdf_newpath =path.join(__dirname ,"./public/marksheets/",student,files.pdf.name);
          var folder = path.join("./public/marksheets/",student);
          var pic_dbpath = path.join("./marksheets/",student,files.pic.name);
          var pdf_dbpath = path.join("./marksheets/",student,files.pdf.name);

          
    
         
    //       console.log("new directory");
          try{
            fs.lstatSync(folder).isDirectory();
       }catch(e){
          
          if(e.code == 'ENOENT'){
            fs.mkdirSync(folder);
        
            console.log("new directory");
    
          }
       }
       fs.copyFile(pdf_oldpath,pdf_newpath,(err_pdf_file)=>{
           if(err_pdf_file){
               throw err_pdf_file
           }
           fs.unlink(pdf_oldpath,(err_7)=>{
               if(err_7){
                   throw err_7
               }
               fs.copyFile(pic_oldpath, pic_newpath, (err_pic_file) => {
                if (err_pic_file) { throw err_pic_file; }
                fs.unlink(pic_oldpath, (err4) => {
                    if (err4) { throw err4 };
                
                    let marksheet = new MarksheetModel();
                    marksheet.pic_path= pic_dbpath;
                    marksheet.title= title;
                    marksheet.pdf_path = pdf_dbpath;
                    marksheet.student_user = student;
                    marksheet.teacher_user = teacher;
                    marksheet.save(()=>{
                        res.end("file uploaded");
                    
                    
    
                })
                })
            });
           })
        

       })
       
     })

})
app.post("/paperUpload",(req,res)=>{
    let teacher = req.cookies.user_teacher;
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
    var title = fields.title;
    var desc = fields.desc;
      var oldpath = files.paper.path;
      var newpath =path.join(__dirname ,"./public/papers/",teacher,files.paper.name);
      var folder = path.join("./public/papers/",teacher);
      var dbpath = path.join("./papers/",teacher,files.paper.name);
      

     
//       console.log("new directory");
      try{
        fs.lstatSync(folder).isDirectory();
   }catch(e){
      
      if(e.code == 'ENOENT'){
        fs.mkdirSync(folder);
    
        console.log("new directory");

      }
   }
   fs.copyFile(oldpath, newpath, (err3) => {
                    if (err3) { throw err3; }
                    fs.unlink(oldpath, (err4) => {
                        if (err4) { throw err4 };
                    let notification = new NotificationModel();
                    notification.role="teacher";
                    notification.user= teacher;
                    notification.detail=teacher+" has uploaded a paper";
                    notification.flag=true;
                    notification.save(()=>{
                        let paper = new PaperModel();
                        paper.user= teacher;
                        paper.title= title;
                        paper.detail = desc;
                        paper.path= dbpath;
                        paper.save(()=>{
                            res.end("file uploaded");
                        })
                        

                    })
                    })
                });

 })
})
app.post("/salaryRequest",(req,res)=>{
    let _class = req.body.class;
    let month = req.body.month;
    let status = req.body.status;
    console.log(_class);
    let salary = new SalaryModel();
    salary.class=_class ;
    salary.month_year=month ;
     salary.status = status;
     salary.save((err,salary)=>{
        if(err){
            throw err;
        }
        res.redirect("/admin");
     })
   
})
app.post("/teacherLoginRequest",(req,res)=>{
    let user = req.body.user;
    let password = req.body.password;
    TeacherModel.findOne({"user":user,"password":password},(err,teacher)=>{
        if(err){
            throw err;
        }
        else if (teacher == null) {
            res.redirect("/");
        }
        else {
            res.cookie("user_teacher",teacher.user,{maxAge:1000*60*60*24*30});
            res.cookie("teacher_issigned",true,{maxAge:1000*60*60*24*30});
            res.redirect("/teacherportal");
        }
    })
})
app.post("/studentLoginRequest", (req, res) => {
    
    let user = req.body.user;
    let password = req.body.user_pass;
    console.log(user);
    StudentModel.findOne({ "user": user, "password": password }, (err, student) => {
        if (err) {
            throw err;
        }
        else if (student == null) {
            res.redirect("/");
        }
        else {
            res.cookie("user_student",student.user,{maxAge:1000*60*60*24*30});
            res.cookie("student_issigned",true,{maxAge:1000*60*60*24*30});
            res.redirect("/studentportal");
        }

    })
})
app.post("/adminLoginRequest",(req,res)=>{
    var username = req.body.user_name.toString();
    var password = req.body.user_pass.toString();
    if(username === "admin" && password ==="1234"){

        res.redirect("/adminportal");
    }
    else{
        res.redirect("/");
    }
})
app.post("/studentSignupRequest", (req, res) => {
    var fname = req.body.user_name;
    var email = req.body.user_email;
    var password = req.body.user_pass;
    var student = new StudentModel();
    student.name = fname;
    student.email = email;
    student.password = password;

    student.save((err, student) => {
        if (err) {
            throw err;
        }
        res.redirect("/");
    })


});
app.post("/addTeacher",(req,res)=>{
    var name = req.body.name;
    var age = req.body.age;
    var gender = req.body.gender;
    var phone = req.body.phone;
    var cnic = req.body.cnic;
    var username = req.body.username;
    var password = req.body.password;
    var _classes = req.body.class;
    var subjects = req.body.subjects;
    console.log(_classes);
    var NewTeacher = new TeacherModel({
        "name": name,
        "age": age,
        "gender": gender,
        "cnic": cnic,
        "user": username,
        "password": password,
        "phone":phone,
        "classes":_classes,
        "subjects":subjects
    });
    
    NewTeacher.save((err,result)=>{
        if(err){
            throw err;
        }
        res.redirect("/admin");
    })
    

})
app.post("/modifyStudent",(req,res)=>{
    var name = req.body.name;
    var father_name = req.body.father_name;
    var age = req.body.age;
    var phone = req.body.phone;
    var cnic = req.body.cnic;
    var father_cnic = req.body.father_cnic;
    var _class = req.body.class;
    var roll_number = req.body.roll_number;
    var section = req.body.section;
    var password = req.body.password;
    var username = req.body.username;
   console.log(username);
     StudentModel.findOne({user:username},(err,student)=>{
         console.log(student);
         student.name= name;
         student.father_name= father_name;
         student.age = age;
         student.phone= phone;
         student.cnic= cnic;
         student.father_cnic=father_cnic;
         student.class = _class;
         student.roll_number = roll_number;
         student.section = section;
         student.password = password;
        student.save((err)=>{
            if(err){
                throw err
            }
            else{
                res.redirect("/admin");
            }

        })
         
     })
})
app.post("/addStudent", (req, res) => {
    console.log("adding a student");
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) { 

    var name = fields.name;
    var father_name = fields.father_name;
    var age = fields.age;
    var gender = fields.gender;
    var phone = fields.phone;
    var cnic = fields.cnic;
    var father_cnic = fields.father_cnic;
    var _class = fields.class;
    var roll_number = fields.roll_number;
    var section = fields.section;
    var username = fields.username;
    var password = fields.password;
    var oldpath = files.pic.path;
    var newpath =path.join(__dirname ,"./public/dp/",username,files.pic.name);
    var folder = path.join(__dirname,"./public/dp/",username);
    var db_path =  path.join("./dp/",username,files.pic.name);

  console.log(name);
    var NewStudent = new StudentModel({
        "name": name,
        "father_name": father_name,
        "age": age,
        "gender": gender,
        "cnic": cnic,
        "father_cnic": father_cnic,
        "class": _class,
        "roll_number": roll_number,
        "section": section,
        "user": username,
        "password": password,
        "dp_path" : db_path
    });
    
    NewStudent.save(()=>{
        try{
            fs.lstatSync(folder).isDirectory();
       }catch(e){
          
          if(e.code == 'ENOENT'){
            fs.mkdirSync(folder);
        
            console.log("new directory");
    
          }
       }
        fs.copyFile(oldpath,newpath,(err_3)=>{
            if(err_3){
                throw err_3
            }
            fs.unlink(oldpath,(err_4)=>{
                if(err_4){
                    throw err_4
                }
                console.log("new student added");
                  res.redirect("/admin");
            })
        })
        
    })
});






})
//-- express Post requests //

app.listen("80", () => {
    console.log("server is running on port 80");
});