// TODO need to find a better way to test the 32bit/64bit specific scenarios

var index = require('../index')

describe('regedit', function() {
	var baseKey = 'HKCU\\software\\ironSource\\regedit\\issues-test\\'
	var key

	// this test fails with a timeout because putValue callback is never invoked
	it('putValue with empty string for value fails silently #8', function(done) {

		index.createKey(key, function(err) {
			if (err) {
				return done(err)
			}

			var values = {}

			values[key] = { 'valName': { value: '', type: 'REG_SZ' } }

			index.putValue(values, function(err) {
				if (err) {
					return done(err)
				}

				index.list(key, function(err, results) {
					if (err) {
						return done(err)
					}

					results.should.have.property(key)
						.which.have.property('values')
						.which.have.property('valName')
						.which.have.property('value', '')

					done()
				})
			})
		})

	})

	it('can putValue REG_DWORD > 0x7fffffff #21', function(done) {
		index.createKey(key, function(err) {
			if (err) {
				return done(err)
			}

			var values = {}

			values[key] = { 'valName': { value: 0x80000000, type: 'REG_DWORD' } }

			index.putValue(values, function(err) {
				if (err) {
					return done(err)
				}

				index.list(key, function(err, results) {
					if (err) {
						return done(err)
					}

					results.should.have.property(key)
						.which.have.property('values')
						.which.have.property('valName')
						.which.have.property('value', 0x80000000)

					done()
				})
			})
		})
	})

	it('can putValue REG_QWORD < 9007199254740993 #21', function(done) {
		index.createKey(key, function(err) {
			if (err) {
				return done(err)
			}

			var values = {}

			values[key] = { 'valName': { value: 9007199254740993, type: 'REG_QWORD' } }

			index.putValue(values, function(err) {
				if (err) {
					return done(err)
				}

				index.list(key, function(err, results) {
					if (err) {
						return done(err)
					}

					results.should.have.property(key)
						.which.have.property('values')
						.which.have.property('valName')
						.which.have.property('value', 9007199254740992)

					done()
				})

			})
		})
	})

	beforeEach(function() {
		key = baseKey + Date.now()
	})
})
