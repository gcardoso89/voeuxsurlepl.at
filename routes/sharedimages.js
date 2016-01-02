var express = require('express');
var router = express.Router();
var imageGenerator = require('../modules/imageGenerator');
var path = require('path');

router.param('id', function (req, res, next, id) {

	var type = req.params.type;

	if ( !type ){
		res.render('error');
	}

	imageGenerator.generateImageFromId(id, type, function(imageUrl, err){

		if (!err){
			res.sendFile(imageUrl);
		} else {
			res.render('error');
		}

	});

});

router.get('/:type/:id', function (req, res, next) {
	return false;
});

module.exports = function(env){
	imageGenerator.setEnviroment(env);
	return router;
};
