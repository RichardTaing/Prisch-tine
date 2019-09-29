require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");

var db = require("./models");
var usersRoute = require("./routes/userRoute");

var app = express();
var PORT = process.env.PORT || 3000;

// Login Authorisation ----------------------------------------------------
var jwt = require("jsonwebtoken");
var config = require("config");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

var authentication = function(req, res, next) {
  //get the token from the header if present
  // eslint-disable-next-line dot-notation
  var token = req.headers["x-access-token"] || req.headers["authorization"];
  //if no token found, return response (without going to the next middelware)
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    //if can verify the token, set req.user and pass to next middleware
    var decoded = jwt.verify(token, config.get("myprivatekey"));
    req.user = decoded;
    next();
  } catch (ex) {
    //if invalid token
    res.status(400).send("Invalid token.");
  }
};
console.log(authentication);

//use config module to get the privatekey, if no private key set, end the application
if (!config.get("myprivatekey")) {
  console.error("FATAL ERROR: myprivatekey is not defined.");
  process.exit(1);
}

app.use(express.json());
//use users route for api/users
app.use("/api/users", usersRoute);

// ---------------------------------------------------------------

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
