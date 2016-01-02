var mongo = require('mongodb').MongoClient;

var PostcardModel = {

	_mongoURL: (function () {

		if (process.env.VOEUX_MONGODB_USERNAME != 'null' && process.env.VOEUX_MONGODB_PASSWORD != 'null') {
			return 'mongodb://' + process.env.VOEUX_MONGODB_USERNAME + ':' + process.env.VOEUX_MONGODB_PASSWORD + '@' + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/voeux';
		} else {
			return 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/voeux';
		}

	}()),

	_errorCallbacks: [],

	_callErrors: function (err) {

		for (var i = 0; i < this._errorCallbacks.length; i++) {
			this._errorCallbacks[i](err);
		}

	},

	getAllMessages : function(cb){

		var messages = [];

		mongo.connect(this._mongoURL, function (err, db) {

			if (err != null) {
				that._callErrors(err);
				cb(messages, err);
				return;
			}

			var collection = db.collection('type_messages');
			collection.find({}).toArray(function (err, docs) {
				messages = docs;
				cb(messages, err);
				db.close();
			});

		});

	},

	getById: function (id, cb) {

		var that = this;
		var postcard = [];

		mongo.connect(this._mongoURL, function (err, db) {

			if (err != null) {
				that._callErrors(err);
				cb(postcard, err);
				return false;
			}

			var collection = db.collection('cards');
			collection.find({ cardid: id }).toArray(function (err, docs) {
				postcard = docs;
				cb(postcard, err);
				db.close();
			});

		});

	},

	addNewCard: function (body, cb) {

		var that = this;

		mongo.connect(this._mongoURL, function (err, db) {

			if (err != null) {
				that._callErrors();
				cb(false, err);
				return false;
			}

			var collection = db.collection('cards');
			collection.insertOne({
				receiver: body.receiver,
				sender: body.sender,
				cardid: body.cardid,
				message: body.message,
				type : body.type
			}, function (err, result) {
				if (err === null && result.result.n === 1) {
					cb(true, err);
				} else {
					cb(false, err);
				}
				db.close();
			});

		});


	},

	onError: function (addNewOnError) {
		this._errorCallbacks.push(addNewOnError);
	}

};

module.exports = PostcardModel;



