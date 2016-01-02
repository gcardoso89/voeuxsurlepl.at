var shortid = require('shortid');
var fs = require('fs');
var path = require('path');
var postcardModel = require('../models/postcard');

var ImageGenerator = {

	_dimensionsGuide : {

		'facebook' : {
			width : 1200,
			height : 630
		}

	},

	_environment : null,

	_webshot : require('webshot'),

	_generateImage : function(id, type, cb){

		var that = this;
		var imageUrl = path.join(__dirname, '../images/' + type + '/' + id + '.jpg');
		var url = '';

		if ( this._environment === 'development' ){
			url = 'http://localhost:3000/static/';
		} else {
			url = 'http://voeux-4aout.rhcloud.com/static/';
		}

		url += id;

		var options = {
			quality : 80
		};
		options['screenSize'] = this._dimensionsGuide[type];
		options['shotSize'] = this._dimensionsGuide[type];

		fs.exists(imageUrl, function(err){

			if ( err ){
				that._webshot(url, imageUrl, options, function(err, coisas) {
					console.log(imageUrl);
					console.log(err);
					console.log(coisas);
					cb(imageUrl,err);
				});
			} else {
				cb(imageUrl,err);
			}

		});

	},

	setEnviroment : function(environment){
		this._environment = environment;
	},

	generateImageFromId : function(id, type, cb){

		var that = this;
		postcardModel.checkIfExistsId(id, function(exists){
			if ( exists ){
				that._generateImage(id, type, cb);
			} else {
				cb(null, "Error: No id found");
			}

		});
	}

};


module.exports = ImageGenerator;