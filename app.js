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
    firstName: "dhruv",
    lastName : "patel",
    email : "abc@gmail.com",
    password : "virus",
    role : 'Admin',
    
});
ass1.save();




app.listen(3000 ,function(){
    console.log("Server running on port 3000.");
  });