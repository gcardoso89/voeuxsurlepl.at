var shortid = require('shortid');
var fs = require('fs');
var path = require('path');
var postcardModel = require('../models/postcard');

var ImageGenerator = {

	_dimensionsGuide : {

		'facebook' : {
			width : 1200,
			height : 630
		},

		'twitter' : {
			width : 1024,
			height : 512
		},

		'gplus' : {
			width : 800,
			height : 1200
		},

		'tumblr' : {
			width : 1024,
			height : 512
		}

	},

	_environment : null,

	_webshot : require('webshot'),

	_generateImage : function(id, type, cb){

		var that = this;
		var imageUrl = path.join(__dirname, '../images/' + type + '/' + id + '.jpg');
		var url = '';

		url = 'http://' + (process.env.OPENSHIFT_NODEJS_IP || '192.168.1.65') + ':' + (process.env.OPENSHIFT_NODEJS_PORT || '3000');
		url += '/static/';
		url += id;

		var options = {
			quality : 80
		};
		options['screenSize'] = this._dimensionsGuide[type];
		options['shotSize'] = this._dimensionsGuide[type];

		fs.exists(imageUrl, function(exists, err){

			if ( !exists ){
				that._webshot(url, imageUrl, options, function(err, coisas) {
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