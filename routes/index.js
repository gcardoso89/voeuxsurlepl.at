var express = require('express');
var router = express.Router();
var postcardModel = require('../models/postcard');
var jwt = require('jwt-simple');
var shortid = require('shortid');

/* GET home page. */
router.get('/', function (req, res, next) {

	var token = jwt.encode({
		ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress
	}, process.env.VOEUX_FORM_SECRET);

	res.render('index', { title: "Express", token: token });
});

router.post('/savePostcard', function (req, res, next) {

	var token = jwt.encode({
		ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress
	}, process.env.VOEUX_FORM_SECRET);

	if (req.body.token == token) {

		var id = shortid.generate();
		req.body.cardid = id;

		postcardModel.addNewCard(req.body, function (success, err) {

			if (success) {
				res.status(200).json({ success: true, cardId: id });
			}
			else {
				res.status(403).end();
			}

		});

	}

	else {
		res.status(403).end();
	}
});

router.get('/:postcardid', function (req, res, next) {
	return false;
});

router.param('postcardid', function (req, res, next, postcardid) {

	postcardModel.getById(postcardid, function (postcard, err) {
		if (err || postcard.length === 0) {
			res.redirect(301, "/");
		} else {
			res.render('postcard', postcard[0]);
		}
	});

});


module.exports = router;
