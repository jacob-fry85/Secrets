require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");

const app = express();

console.log();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema =  new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret: process.env.API_KEY, encryptedField: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  console.log(username + " and " + password);
  User.findOne({email: username}, function(err, foundUser) {
    console.log("the password" + foundUser.password);
    if(err) {
      console.log(err);
    } else if(foundUser) {
        console.log("found user");
        if(foundUser.password === password) {
          console.log("the password" + foundUser.password);
          res.render("secrets");
        }
      }
    else if(!foundUser) {
        res.send("NOT FOUND");

   }
  });
})

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.listen(3000, function(req, res) {
  console.log("Port is running at 3000.");
});
