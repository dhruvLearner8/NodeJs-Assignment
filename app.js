const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("loadsh");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")



const app = express();
mongoose.connect("mongodb://localhost:27017/AssignmentDB",{useNewUrlParser:true});
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const secret = "thisismysecretkeyforencryption.";

const assignmentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
      },
  lastName : {type: String,required: true},
  email : {type: String, required: true},
  password : {type: String, required: true},
  role : {type: String, possibleRoles:['Admin','User']},
  department : String,
  createdAt: { type: Date, default: Date.now },
  updatedAt :{type: Date, default: Date.now},

});

// assignmentSchema.plugin(encrypt,{secret : secret});

const Assignment = mongoose.model("Assignment",assignmentSchema);

const ass1 = new Assignment({
    firstName: "dhruv1",
    lastName : "patel1",
    email : "abc@gmail1.com",
    password : "virus",
    role : 'Amin',
    
});
// ass1.save();

app.get("/",function(req,res){
  res.render("register");
});

app.post("/",function(req,res){
  
  if(req.body.password1 === req.body.password2){
    firstname = req.body.Fname;
  lname = req.body.Lname;
  email = req.body.Email;
    pass= req.body.password1;
    role= req.body.role;
  }
  else{
    res.send("Password Not matching")
  }
  

  const ass= new Assignment({
    firstName : firstname,
    lastName : lname,
    email : email,
    password : pass,
    role : role,

  });
  ass.save();
  res.redirect("/");

});

app.get("/login",function(req,res){
  res.render("login");
});

app.post("/login",function(req,res){
  email = req.body.Email;
  password = req.body.password;
  role= req.body.role;

  Assignment.findOne({email : email, password : password, role: role}, function(err,foundPerson){
    if(err){
      res.send(err);
    }
    else{
      if (foundPerson === null){
        res.send("Person Not Found");
      }
      else{
        console.log(foundPerson);
        res.render("home",{foundPerson: foundPerson});
      }
      
    }
  })
})




app.listen(3000 ,function(){
    console.log("Server running on port 3000.");
  });