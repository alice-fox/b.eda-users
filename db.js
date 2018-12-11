'use strict';

var Datastore = require('nedb');
var pathUtils = require('path');


var MongoClient = require('mongodb').MongoClient;



exports.db;

var absolutePathRegexp = /^\//;

exports.init = function(params, callback) {
	MongoClient.connect(params.url, {
		useNewUrlParser: true
	}, function(err, client) {
		if (err) {
			return callback(err);
		}

	  	var db = client.db(params.dbName);
	  	exports.db = db;
	  	callback();
  	
	});
};

