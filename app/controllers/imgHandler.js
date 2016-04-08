'use strict';

var rp = require("request-promise");

function imgHandler(db) {
    var searches = db.collection("searches");

    this.getImages = function(req, res) {

        var srchCnt;
        var offset = parseInt(req.query.offset, 10);
        if(isNaN(offset)) {
            srchCnt = 10;
        } else {
            srchCnt = offset;
        }

        var urlBase = "https://api.datamarket.azure.com/Bing/Search/v1/Image?Query=%27";
        var url = urlBase + req.params.search + "%27&$top=" + srchCnt + "&$format=JSON";
        var options = {
            uri: url,
            json: true,
            auth: {
                user: process.env.BING_USER,
                password: process.env.BING_PW
            }
        };

        searches.insert(
          {
              term: req.params.search,
              when: Date()
          }
        );

        rp(options)
            .then((imgsObj) => {
                var rtnArray = [];
                imgsObj.d.results.forEach((img) => {
                    
                    var rtnImgObj = {
                        
                        url: img.MediaUrl,
                        snippet: img.Title,
                        thumbnail: img.Thumbnail.MediaUrl,
                        context: img.SourceUrl
                        
                    };

                    rtnArray.push(rtnImgObj);

                });
                
                res.json(rtnArray);
                
            })

            .catch((error) => {
                res.json("Error " + error);
            });
    };
    
    this.getSearches = function(req, res) {
        searches.find(
                    {},
                    {_id: 0, term: 1, when: 1}
                )
                .sort({$natural: -1})
                .limit(10)
                .toArray((err, srchs) => {
                    if(err) throw err;
                    res.json(srchs);
                });
    };
    
}

module.exports = imgHandler;