'use strict';

var async = require('async');
var _ = require('underscore');
var db = require('../db').db;
var errors = require('../utils/errors');
var validate = require('../utils/validate').validate;
var serviceRequest = require('../utils/serviceRequest').serviceRequest;
var accumulateCallback = require('../utils/async').accumulateCallback;


var idScheme = {
	type: 'object',
	properties: {
		_id: {
			type: 'number',
			minimum: 1
		}
	},
	required: [
		'_id'
	]
};

var accountscheme = {
	type: 'object',
	properties: {
		_id: {
			type: 'number',
			minimum: 1
		}
	},
	required: [
		'_id'
	],
	additionalProperties: false
};

var credentialsScheme = {
	type: 'object',
	properites: {
		email: {
			type: 'string'
		},
		password: {
			type: 'string'
		},
		salt: {
			type: 'string'
		}
	},
	required: [
		'email', 'password', 'salt'
	]
};

module.exports = function(app) {
	app.get('/api/accounts/:_id', function(req, res, next) {
		var params = req.params;

		async.waterfall([
			function(callback) {
				validate(idScheme, params, callback);
			},
			function(validatedParams, callback) {
				params = validatedParams;
				db.accounts.findOne({_id: params._id}, callback);
			},
			function(account, callback) {
				if (!account) {
					return callback(new errors.NotFoundError(
						'Account not found: _id = ' + params._id
					));
				}

				res.json({
					data: account
				});
			}
		], next);
	});

	app.post('/api/accounts', function(req, res, next) {
		async.waterfall([
			function(callback) {
				var data = req.body;
				validate(accountscheme, data, callback);
			},
			function(data, callback) {
				db.insert(data, callback);
			},
			function(accounts, callback) {
				res.json({
					data: accounts
				});
			}
		], next);
	});
};