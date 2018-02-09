var cheerio = require("cheerio");
var request = require("request");
var axios = require("axios");
var Note = require("../models/note.js");
var Article = require("../models/article.js");


// Our scraping tools

module.exports = function (app) {
  app.get('/', function(req, res){
    res.redirect('/articles');
  });

            // First, tell the console what server.js is doing
            console.log("\n***********************************\n" +
            "scraping stories and links\n" +
            "from ksl news stories" +
            "\n***********************************\n");
            
//  Axios is a promised-based http library, similar to jQuery's Ajax method
app.get("/scrape", function(req, res){
  console.log("did this stop here?")
// Making a request for ksl front page stories. The page's HTML is passed as the callback's third argument
request("https://www.ksl.com/", function(err, res, html){
 console.log("or did it stop here?")

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  $(".headline").each(function(i, element) {
  console.log("how many i's??")
  
    // Save the text of the element in a "title" variable
    var title = $(this).children("h2").text();
    // Save link text of the element in a "link" variable
    var link = $(this).parent().find("a").attr("href");
    // Save summary text in a "summary" variable
    var summary = $(this).children("h5").text();


    if (title && link && summary){
      var result = {};
    // console.log("getting stuck ")
    // Save these results in an object that we'll push into the results array we defined earlier
    
      result.title = title,
      result.link = "www.ksl.com"+link,
      result.summary = summary
  
      Article.create(result, function(err, res){
      if (err) {
        console.log(err);
      
    }else {

      console.log(data);
    }
    });
    };
  });

  // Log the results once you've looped through each of the elements found with cheerio
  // res.send("Scrape Complete");
  });
  res.redirect('/');
  })
  app.get("/articles", function(req, res){
    Article.find({}, function(){
      if (err) {
        console.log(err);
      }
     else {
      res.render("index", {result: doc});
    
  }
  Article.sort({'_id': -1})
});


app.get("/articles/:id", function(req, res){
  Article.findOne({"_id": req.params.id})
  .populate("Notes")
  .exec(function(err, doc){
    if (err) {
      console.log(err);
    } else{
      res.render("Notes", {result: doc});
    }
  });
});
 // Create a new note
  app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    Note
      .create(req.body, function (error, doc) {
        // Log any errors
        if (error) {
          console.log(error// Otherwise
          );
        } else {
          // Use the article id to find and update it's note
          Article.findOneAndUpdate({
            "_id": req.params.id
          }, {
            $push: {
              "note": doc._id
            }
          }, {
            safe: true,
            upsert: true,
            new: true
          })
          // Execute the above query
            .exec(function (err, doc) {
              // Log any errors
              if (err) {
                console.log(err);
              } else {
                // Or send the document to the browser
                res.redirect('back');
              }
            });
        }
      });
  });

  app.delete("/articles/:id/:noteid", function (req, res) {
    Note
      .findByIdAndRemove(req.params.noteid, function (error, doc) {
        // Log any errors
        if (error) {
          console.log(err);
        } else {
          console.log(doc);
          Article.findOneAndUpdate({
            "_id": req.params.id
          }, {
            $pull: {
              "note": doc._id
            }
          })
          // Execute the above query
            .exec(function (err, doc) {
              // Log any errors
              if (err) {
                console.log(err);
              }
            });
        }
      });
  });
})
};

