var db = require('../db');
var configManager = require('../config');

var dbInitialized = false;

exports.initDb = function(callback) {
	console.log(config)
	var config = configManager.get();
	db.init(config.db, function(err) {
		dbInitialized = !err;

		callback(err);
	});
};

exports.cleanDb = function(callback) {
	if (!dbInitialized) return callback();

	db.getCollection('user').deleteMany({}, callback);
};
