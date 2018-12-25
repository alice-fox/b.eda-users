var got = require('got');
var async = require('async');
var expect = require('expect.js');
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

describe('DELETE /api/users/:_id', function() {
	before(function(done) {
		async.waterfall([
			function(callback) {
				testUtils.initDb(done);
			},
			function(callback) {
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

		async.waterfall([
			function(callback) {
				got({
					hostname: config.listen.host,
					port: config.listen.port,
					path: '/api/users/' + testData.user._id
				}, {
					method: 'delete',
					json: true,
					body: testData.user
				}, callback);
			},
			function(response, callback) {
				console.log(response);

				// var createdUser = response.data;

				// expect(createdUser).to.be.eql(testData.user);

				callback();
			}
		], done);
	});

	it('should delete user from db', function(done) {
		async.waterfall([
			function(callback) {
				db.getCollection('users').findOne({
					_id: testData.user._id
				}, callback);
			},
			function(user, callback) {
				console.log(user);

				expect(user).not.to.be.ok();

				callback();
			}
		], done);
	});

	after(function(done) {
		testUtils.cleanDb(done);
	});
});
