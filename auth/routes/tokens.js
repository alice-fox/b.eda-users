'use strict';

var async = require('async');
var _ = require('underscore');
var db = require('../db').db;
var errors = require('../utils/errors');
var validate = require('../utils/validate').validate;
var serviceRequest = require('../utils/serviceRequest').serviceRequest;
var accumulateCallback = require('../utils/async').accumulateCallback;


var tokenScheme = {
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

module.exports = function(app) {
	app.get('/api/tokens/:_id', function(req, res, next) {
		var params = req.params;

		async.waterfall([
			function(callback) {
				validate(tokenScheme, params, callback);
			},
			function(validatedParams, callback) {
				params = validatedParams;
				db.tokens.findOne({_id: params._id}, callback);
			},
			function(token, series) {
				res.json({
					data: token
				});
			}
		], next);
	});
};