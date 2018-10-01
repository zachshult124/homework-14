var axios = require('axios')
var cheerio = require('cheerio')
var db = require("./models");
var articleModel = require('./models/Article.js')
var noteModel = require('./models/Note.js')



module.exports = function (app) {
    app.get("/scrape", function (req, res) {
        axios.get("http://www.echojs.com/").then(function (response) {



            var $ = cheerio.load(response.data);


            $("article h2").each(function (i, element) {

                var thingToSave = {
                    title: $(this).children("a").text(),
                    link: $(this).children('a').attr('href')
                }

                //console.log('here is our thing to save', thingToSave)
                articleModel.create(thingToSave).then(function (thingWeJustSaved) {
                    console.log('We just saved this dude', thingWeJustSaved)
                })


                // var result = {};
                // result.title = $(this)
                //     .children("a")
                //     .text();
                // result.link = $(this)
                //     .children("a")
                //     .attr("href");
                // db.Article.create(result)
                //     .then(function (dbArticle) {
                //         console.log(dbArticle);
                //     })
                //     .catch(function (err) {
                //         return res.json(err);
                //     });
            });

            // res.send("Scrape Complete");
        });
    });
    app.get("/articles", function (req, res) {
        articleModel.find({})
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });




    app.get("/articles/:id", function (req, res) {

        console.log("this is our ID", req.params.id)

        articleModel.findOne({ _id: req.params.id })
            .populate("note")
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });




    app.post("/articles/:articleId", function (req, res) {
        noteModel.create(req.body)
            .then(function (dbNote) {
                return articleModel.findOneAndUpdate({ _id: req.params.articleId }, { note: dbNote._id }, { new: true });
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });
}

