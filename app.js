const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("loadsh");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require('connect-mongo')





const app = express();
app.use(cookieParser());
app.use(session({
  resave:true,
  saveUninitialized: true,
  secret: "secret",
  
}));

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
    dept = req.body.Dept;
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
    department : dept

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
        //console.log(foundPerson);
        req.session.user = foundPerson;
        
        res.redirect("/home");
      }
      
    }
  })
})

app.get("/home",function(req,res){
  foundPerson = req.session.user;
  res.render("home",{foundPerson : foundPerson})
})

app.get("/addUser",function(req,res){
  foundPerson = req.session.user;
  role=foundPerson.role;
  
  res.render("addUser",{role : role});

});

app.post("/addUser",function(req,res){
  if(req.body.password1 === req.body.password2){
    firstname = req.body.Fname;
  lname = req.body.Lname;
  email = req.body.Email;
    pass= req.body.password1;
    role= req.body.role;
    dept = req.body.Dept;

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
    department:dept,

  });
  ass.save();
  res.redirect("/home");
});

app.get("/findUser",function(req,res){
  res.render("findUser");
})

app.post("/findUser",function(req,res){
  foundPerson = req.session.user;
  role=foundPerson.role;
  
  if(role==='User'){

  field = req.body.name;
  
  if(field === 'fname'){
    Assignment.find({role:'User'},{firstName:1,_id:0}, function (err, docs1) {
      if(err){
        res.send(err);
      }
      else{
        res.render("details",{field : field, docs1 : docs1});
      }
    });
  }

  if(field === 'lname'){
    Assignment.find({role:'User'},{lastName:1,_id:0}, function (err, docs1) {
      if(err){
        res.send(err);
      }
      else{
        res.render("details",{field : field, docs1 : docs1});
      }
    });
  }

  if(field === 'all'){
    Assignment.find({role:'User'}, function (err, docs1) {
      if(err){
        res.send(err);
      }
      else{
        res.render("details",{field : field, docs1 : docs1});
      }
    });
  }
}

if(role==='Admin'){

  field = req.body.name;
  
  if(field === 'fname'){
    Assignment.find({},{firstName:1,_id:0}, function (err, docs1) {
      if(err){
        res.send(err);
      }
      else{
        res.render("details",{field : field, docs1 : docs1});
      }
    });
  }

  if(field === 'lname'){
    Assignment.find({},{lastName:1,_id:0}, function (err, docs1) {
      if(err){
        res.send(err);
      }
      else{
        res.render("details",{field : field, docs1 : docs1});
      }
    });
  }

  if(field === 'all'){
    Assignment.find({}, function (err, docs1) {
      if(err){
        res.send(err);
      }
      else{
        res.render("details",{field : field, docs1 : docs1});
      }
    });
  }
}
});

app.get("/updateUser/:id",function(req,res){
  Assignment.findOne({_id:req.params.id},function(err,foundPerson){
    if(err){
      res.send(err);
    }
    else{
      res.render("updatePage",foundPerson);
    }
  })
  
})

app.post("/updateUser",function(req,res){
  console.log(req.body.Id);
  Assignment.findOneAndUpdate({_id : req.body.Id},{
    firstName : req.body.fname,
    lastName : req.body.lname,
    email : req.body.email,
    role : req.body.role,
    updatedAt : new Date(),

  },
  {overwrite:true},
  function(err){
    if(err){
      res.send(err);
    }
    else{
      res.send("Updated Succesfully");
    }
  })
  
})



app.listen(3000 ,function(){
    console.log("Server running on port 3000.");
  });