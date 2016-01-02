var shortid = require('shortid');

var ImageGenerator = {

	_webshot : require('webshot'),

	generateImageFromUrl : function(url, cb){

		var imageUrl = 'images/' + shortid.generate() + '.jpg';
		this._webshot(url, imageUrl, function(err) {
			cb(imageUrl,err);
		})

	}

};


module.exports = ImageGenerator;