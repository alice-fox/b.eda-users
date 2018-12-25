var dbModule = require('../db');
var configManager = require('../config');

var dbInitialized = false;

exports.initDb = function(callback) {
	var config = configManager.get();
	dbModule.init(config.db, function(err) {
		dbInitialized = !err;

		callback(err);
	});
};

exports.cleanDb = function(callback) {
	if (!dbInitialized) return callback();

	dbModule.db.collection('users').deleteMany({}, callback);
};
