/* eslint-disable no-unused-expressions */

var should = require('should')
var index = require('../index')

describe('list', function() {
	this.timeout(5000)

	it('Streaming interface', function(done) {
		var testKey = 'hkcu\\software'

		// use non streaming interface to get expected results
		index.list(testKey, function(err, expectedResults) {
			if (err) {
				return done(err)
			}

			var actualResults = {}
			var error
			index.list(testKey)
				.once('error', function(e) {
					should(e).be.an.Error
					error = e
				})
				.on('data', function(d) {
					actualResults[d.key] = d.data
				}).once('finish', function() {
					actualResults.should.eql(expectedResults)
					done(error)
				})
		})
	})

	it('works for multiple keys', function(done) {
		var actualResults = {}
		var keys = ['hklm', 'hkcu']
		var error

		// use non streaming interface to get expected results
		index.list(keys, function(err, expectedResults) {
			if (err) {
				return done(err)
			}
			
			index.list(keys)
				.once('error', function(e) {
					error = e
				})
				.on('data', function(d) {
					actualResults[d.key] = d.data
				}).once('finish', function() {
					actualResults.should.eql(expectedResults)
					done(error)
				})
		})
	})
})
