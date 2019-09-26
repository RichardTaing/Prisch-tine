var auth = require("server");
var bcrypt = require("bcrypt");
var User = require("../models/user").User;
var validate = require("../models/user").validate;
var express = require("express");
var router = express.Router();

router.get("/current", function (req, res) {
  var user = User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", function (req, res) {
  // validate the request body first
  var _validate = validate(req.body);
  
  if (error) return res.status(400).send(error.details[0].message);

  //find an existing user
  var user =  User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email
  });
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();

  var token = user.generateAuthToken();
  res.header("x-auth-token", token).send({
    _id: user._id,
    name: user.name,
    email: user.email
  });
});

module.exports = router;
