/**
 * Tutorial application for Exress 4 (expressjs.com)
 * This is a runnable node.js application that shows you the basics
 * in the web framework work Express.
 *
 * Author: @patricjansson
 *
 * PREREQUISITE:
 * Node.js installed. To start this node.js application run [node app.js]
 *
 * OPTIONAL:
 * http://nodemon.io/ - automaticly restarts your node server when a file is saved,
 * this speeds up your development.
 *
 * Install Nodemon on your machine by running [npm install -g nodemon]
 *
 * BEFORE FIRST START
 * Before you can run this application you have to install all the modeules this
 * application depends on. In our case Express and the HTML template engeine Jade.
 * The dependencies are specified in the file package.json.
 * You download and install the modules using npm, run this command [npm install] once.
 * Dependencies are installed in the catalog node_modules.
 *
 * START APPLICATOIN:
 * If you use Nodemon.io start this app by [nodemon app.js], otherwise start as a normal
 * Node.js app by running [node app.js] from your terminal.
 */

/****************** include modules (aka librarys)  ******************
 *
 * A module is external librarys that are installed via the npm package manager.
 * Npm reads the file package.json in the root of the project, and installs any
 * dependencies specified in that file.
 *
 * Note: Any module you want to use a require("a-module-i-need") has to be present
 * as a dependency in package.json and installed using [npm install] before this
 * application can run.
 */
var express = require("express");

/****************** Configuration ******************/
var app = express();

// Select the template mechanism you wish to use. In this case its Jade http://jade-lang.com
// The templates are located by default under /views/*.jade
app.set("view engine", "jade");

// "case sensitive routing" tells Express whether /my-path is the same as /My-PaTH/
// This is default set to false, but for SEO purposes, creating one cannical url is better.
app.set ("case sensitive routing", true);

// utility function, see if a specific port has been default or default to port 3000.
app.getPort = function () {
  return Number(process.env.PORT || 3000);
}

app.log = function (message) {
  console.log( new Date().getTime() + ": " + message);
}

app.accesslog = function (req) {
  app.log(req.route);
}

app.getAuthorAsJson = function () {
  return {username : "patricjansson", name : "Patric Jansson", twitter : "@patricjansson"};
}

/****************** Request stack ******************
 *
 * Express handles routing by a defining a rules based stack that all requests passes through.
 * Each layer in the stack is defined by a funtion. The request is passed down the chain and until it
 * matches a route. If that function matching the route returns a response the chain is exited.
 * Otherwise the request passes down to the next layer in the stack.
 *
 */

// -- Middleware --
// Middleware is stuff that filters all requests. Middleware ends by passing the request
// to the next function in line by calling next();
// BTW: writing this function bellow like app.use("/*", function(req, res, next) whould
// have given the same result.
app.use(function(req, res, next) {
  app.log(req.method + ": " + req.url + " ");
  next();
});

app.all("/secure/*", function(req, res, next) {
  res.send(403, "403 - You are not allowed to se anything here!");
});

// -- Pre-method url parsing
// Express has a nice feture that much like middleware
// can extract data from the url before the actual method handle function
// is invoked. For example it would be nice to read the correct user from
// a database before invoking the routing.
// NOTE: This example will match all ":username" in any request
app.param("username", function(req, res, next, id){

  var author = app.getAuthorAsJson();
  if (id === author.username) {
    req.user = author;
  }
  next();
});

// -- Methods --
// Respone with a rendered template
app.get("/", function(req, res) {
  res.render("index", app.getAuthorAsJson());
});

// Respone with a string
app.get("/html", function(req, res) {
  res.send("<!DOCTYPE html><html><title>String</title><body><h1>HTLM String</h1></body><html>");
});

// Respone with a string
app.get("/text", function(req, res) {
  res.set("Content-Type", "text/plain");
  res.send("Text string");
});

// Respone with json
app.get("/json", function(req, res) {
  res.json(app.getAuthorAsJson());
});

// This is a POST method with a dynamic url path.
// The :username can be accessed directly usering req.params.username
// but in this case its already parsed by the middleware-like function
// matching "username", and put in the resquest object.
//
app.post("/profile/:username", function(req, res){
  var html = "This is a " + req.method + " for '" + req.user.twitter + "'<br/>";
  html += "The last url part :username is '" + req.params.username + "'";
  res.send(html);
});

// This is a GET method with a dynamic url path.
app.get("/profile/:username", function(req, res){
  app.log("Only POST:s are available for this route.")
  res.redirect(301, "/profile");
});

// This is a GET method with a dynamic url path.
app.get("/profile", function(req, res){
  res.render("username-form");
});

// -- Files/statics routes--
// Map static content like images
// Test "/static/patricjansson.png"
app.use("/static", express.static(__dirname + "/public"));

// -- Errors --
// If the request ends up here none of the rules above have returned any response
// so then its time for som error handling
app.use(function(req, res){
  res.send(404, "404 - No route or static file matched ''" + req.url + "'." )
});





/****************** Start  ******************
 *
 * Start the application and listen for incomming requests.
 * If your app needs SSL start it by creating a node server directly.
 * var https = require("https"); https.createServer(app).listen(443);
 */
app.listen(app.getPort(), function() {
  app.log("---------------------------")
  app.log("Application running on::");
  app.log("http://localhost:" + app.getPort());
  app.log("---------------------------")
});
