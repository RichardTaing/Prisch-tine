var db = require("../models");
console.log(db);
var path = require("path");

module.exports = function(app) {
  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads view.html
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/main.html"));
  });

  app.get("/login", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/login.html"));
  });

  app.get("/member", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/user.html"));
  });
};
