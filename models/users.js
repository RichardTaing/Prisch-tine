var config = require("config");
var jwt = require("jsonwebtoken");
var Joi = require("@hapi/joi");
var mysql = require("mysql");

//simple schema
var UserSchema = new mysql.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  //give different access rights if admin or not
  isAdmin: Boolean
});

//custom method to generate authToken
UserSchema.methods.generateAuthToken = function() {
  var token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("myprivatekey")
  ); //get the private key from the config file -> environment variable
  return token;
};

var User = mysql.model("User", UserSchema);

//function to validate user
function validateUser(user) {
  var schema = {
    name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(3)
      .max(255)
      .required()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
