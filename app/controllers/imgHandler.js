'use strict';

var rp = require("request-promise");

function imgHandler(db) {
    var searches = db.collection("searches");

    this.getImages = function(req, res) {

        var urlBase = "https://api.datamarket.azure.com/Bing/Search/v1/Image?Query=%27";
        var url = urlBase + req.params.search + "%27&$format=JSON";
        var options = {
            uri: url,
            json: true,
            auth: {
                user: process.env.BING_USER,
                password: process.env.BING_PW
            }
        };

        rp(options)
            .then((rtnJSON) => {
                res.json(rtnJSON);
            })
            .catch((error) => {
                res.json("Error " + error);
            });
    };
    
    this.getSearches = function(req, res) {
        searches.find({});
    };
    
}

module.exports = imgHandler;