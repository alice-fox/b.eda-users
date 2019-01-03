var got = require('got');
var async = require('async');
var expect = require('expect.js');
var dbModule = require('../../../db');
var configManager = require('../../../config');
var testUtils = require('../../utils');

var testData = {
	user: {
		_id: 1,
		email: 'user@example.com',
		password: '12312312312312',
		salt: '12312312312312',
		firstName: 'Ivan',
		lastName: 'Ivanov',
		age: 40,
		availableFoodTypes: ['meal', 'milk'],
		registrationDate: Date.now()
	}
};

describe('PUT /api/users/:_id', function() {
	before(function(done) {
		async.waterfall([
			function(callback) {
				testUtils.initDb(callback);
			},
			function(callback) {
				var config = configManager.get();
				got({
					hostname: config.listen.host,
					port: config.listen.port,
					path: '/api/users'
				}, {
					method: 'post',
					json: true,
					body: testData.user
				}, callback);
			}
		], done);
	});

	it('should be ok', function(done) {
		var config = configManager.get();
		testData = {
					user: {
							_id: 1,
							email: 'userUpdate@example.com',
							password: '12312312312345',
							salt: '12312312312345',
							firstName: 'IvanUp',
							lastName: 'IvanovUp',
							age: 400,
							availableFoodTypes: ['meal', 'milk', 'fish'],
							registrationDate: Date.now()
						}

				 };
		
		async.waterfall([
			function(callback) {
				got['put']({
					hostname: config.listen.host,
					port: config.listen.port,
					path: '/api/users/' + testData.user._id
				}, {
					json: true,
					body: testData.user
				}, callback);
			},
			function(responseData, response, callback) {
				console.log(responseData);

				 //var createdUser = responseData.data;
			 	
				 //expect(testDataUpdate.user).to.be.eql(testData.user);

				callback();
			}
		], done);
	});

	it('should update user', function(done) {

		async.waterfall([
			function(callback) {
				dbModule.db.collection('users').findOne({
					_id: testData.user._id
				}, callback);
			},
			function(user, callback) {
				expect(user).to.be.eql(testData.user);
				//expect(user).not.to.be.ok();

				callback();
			}
		], done);
	});

	after(function(done) {
		testUtils.cleanDb(done);
	});
});
