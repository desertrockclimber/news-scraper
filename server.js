// list out the dependencies
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var express = require("express");
var exphbs = require("express-handlebars");


// Require all models =--------------------------------------------------
// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;

// use handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.connect('mongodb: //localhost/test');
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news-scraper";
// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news-scraper"
mongoose.Promise = Promise;

mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

// connect mongo to Heroku

var db = mongoose.connection;

db.on('error',console.error.bind(console, 'connection error:'));
  
// display a console message when mongoose has a conn to the db
db.once("open", function () {
  console.log("Mongoose connection successful.");
});

// Require the routes in our controllers js file
require("./controllers/appController.js")(app);

//Listen on PORT 8000 & notify us.
app.listen(PORT, function () {
  console.log("App running on port 3000");
});