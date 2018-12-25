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

describe('POST /api/users', function() {
	before(function(done) {
		testUtils.initDb(done);
	});

	it('should be ok', function(done) {
		var config = configManager.get();

		async.waterfall([
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
			},
			function(response, callback) {
				console.log(response);

				var createdUser = response.data;

				expect(createdUser).to.be.eql(testData.user);

				callback();
			}
		], done);
	});

	it('should create user in db', function(done) {
		async.waterfall([
			function(callback) {
				db.getCollection('users').findOne({
					_id: testData.user._id
				}, callback);
			},
			function(user, callback) {
				console.log(user);

				expect(user).to.be.eql(testData.user);

				callback();
			}
		], done);
	});

	after(function(done) {
		testUtils.cleanDb(done);
	});
});
