'use strict';

var Datastore = require('nedb');
var pathUtils = require('path');


var MongoClient = require('mongodb').MongoClient;
<<<<<<< HEAD
=======
var assert = require('assert');
 
// Connection URL
var url = 'mongodb://172.17.0.2:27017/users'; 
//var url = require('./config/develop');
 
// Database Name
var dbName = 'dbUsers';
 
>>>>>>> e9a031cb38a0d140cafd1ad5b15232325447c39b

var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

var findAllDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({'a': 3}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });
}

var updateDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  });
}

var removeDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Delete document where a is 3
  collection.deleteOne({ a : 3 }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });
}

var indexCollection = function(db, callback) {
  db.collection('documents').createIndex(
    { "a": 1 },
      null,
      function(err, results) {
        console.log(results);
        callback();
    }
  );
};

exports.db;

var absolutePathRegexp = /^\//;

var initLocalDb = function(params, callback) {
	var dbPath = params.path;
	if (!absolutePathRegexp.test(dbPath)) {
		dbPath = pathUtils.join(__dirname, dbPath);
	}

	var db = new Datastore({filename: dbPath});
	db.loadDatabase(function(err) {
		if (err) {
			return callback(err);
		}

		exports.db = db;
		callback();
	});
};

var initMongoDb = function(params, callback){
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

exports.init = function(params, callback) {
	if (params.type == 'mongodb'){
		initMongoDb(params, callback);
	}
	else if(params.type == 'local'){
		initLocalDb(params, callback);
	}
};

