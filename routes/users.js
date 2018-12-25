'use strict';

var async = require('async');
var db = require('../db').db;
var errors = require('../utils/errors');
var validate = require('../utils/validate').validate;


var idScheme = {
	type: 'object',
	properties: {
		_id: {
			type: 'number',
			minimum: 1
		}
	},
	required: ['_id'],
	additionalProperties: false
};

var userScheme = {
	type: 'object',
	properties: {
		_id: {
			type: 'number',
			minimum: 1
		},
		email: {
			type: 'string',
			minLength: 1,
			maxLength: 1000
		},
		password: {
			type: 'string',
			minLength: 1,
			maxLength: 1000
		},
		salt: {
			type: 'string',
			minLength: 1,
			maxLength: 1000
		},
		firstName: {
			type: 'string',
			minimum: 1,
			maximum: 1000
		},
		lastName: {
			type: 'string',
			minimum: 1,
			maximum: 1000
		},
		age: {
			type: 'number',
			minimum: 1,
			maximum: 1000
		},
		availableFoodTypes: {
			type: 'array',
			items: {
				type: 'string',
				enum: ['meal', 'fish', 'milk', 'vegetable']
			}
		},
		registrationDate: {
			type: 'number',
			minLength: 1,
			maxLength: 999999999999999
		}	
	},
	required: [
		'_id', 'email', 'firstName', 'lastName', 'registrationDate'
	],
	additionalProperties: false
};

module.exports = function(app) {
	app.get('/api/users/:_id', function(req, res, next) {
		var params = req.params;

		async.waterfall([
			function(callback) {
				validate(idScheme, params, callback);
			},
			function(validatedParams, callback) {
				params = validatedParams;
				db.collection('users').findOne({_id: params._id}, callback);
			},
			function(user, callback) {
				if (!user) {
					return callback(new errors.NotFoundError(
						'User not found: _id = ' + params._id
					));
				}

				res.json({
					data: user
				});
			}
		], next);
	});

	app.get('/api/users', function(req, res, next) {
		async.waterfall([
			function(callback) {
				var query = req.query || {};

				validate({
					type: 'object',
					properties: {
						offset: {
							type: 'integer',
							minimum: 0,
							default: 0
						},
						limit: {
							type: 'integer',
							minimum: 0,
							maximum: 100,
							default: 20
						},
						title: {
							type: 'string'
						}
					},
					additionalProperties: false
				}, query, callback);
			},
			function(query, callback) {
				var condition = {};
				if (query.title) {
					condition.title = {
						$regex: new RegExp(query.title)
					};
				}

				var cursor = db.collection('users').find(condition)
					.skip(query.offset)
					.limit(query.limit);

				cursor.toArray(callback);
			},
			function(users, callback) {
				res.json({
					data: users
				});
			}
		], next);
	});

	app.post('/api/users', function(req, res, next) {
		async.waterfall([
			function(callback) {
				var data = req.body;
				validate(userScheme, data, callback);
			},
			function(data, callback) {
				db.collection('users').insertOne(data, {
					returnDocsOnly: true
				}, callback);
			},
			function(operationResult, callback) {
				res.json({
					data: operationResult.ops[0]
				});
			}
		], next);
	});

	app.put('/api/users/:_id', function(req, res, next) {
		var params = req.params;
		var data = req.body;

		async.waterfall([
			function(callback) {
				validate(idScheme, params, callback);
			},
			function(validatedParams, callback) {
				params = validatedParams;
				validate(userScheme, data, callback);
			},
			function(validatedData, callback) {
				data = validatedData;
				db.collection('users').findOne({_id: params._id}, callback);
			},
			function(user, callback) {
				if (!user) {
					return callback(new errors.NotFoundError(
						'User not found: _id = ' + params._id
					));
				}

				db.collection('users').update(
					{_id: params._id},
					data,
					{returnUpdatedDocs: true},
					callback
				);
			},
			function(user, callback) {
				res.json({
					data: user
				});
			}
		], next);
	});

	app['delete']('/api/users/:_id', function(req, res, next) {
		var params = req.params;

		async.waterfall([
			function(callback) {
				validate(idScheme, params, callback);
			},
			function(validatedParams, callback) {
				params = validatedParams;
				db.collection('users').findOne({_id: params._id}, callback);
			},
			function(user, callback) {
				if (!user) {
					return callback(new errors.NotFoundError(
						'User not found: _id = ' + params._id
					));
				}

				db.collection('users').remove({_id: params._id}, {}, callback);
			},
			function(user) {
				res.json({
					data: user
				});
			}
		], next);
	});
};
