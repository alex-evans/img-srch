'use strict';

var path = process.cwd();
var ImgHandler = require(path + '/app/controllers/imgHandler.js');

module.exports = function (app, db) {
	
 	var imgHandler = new ImgHandler(db);
	
	app.route('/')
		.get(function(req,res) {
			res.sendFile(path + '/public/index.html');
		});
		
	app.route('/api/imagesearch/:search')
		.get(imgHandler.getImages);
		
	app.route('/api/latest/imagesearch')
		.get(imgHandler.getSearches);

};

