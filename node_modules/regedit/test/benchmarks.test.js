var index = require('../index')

describe.skip('benchmark test', function() {
	this.timeout(40000)

	var testSize = 10000
	var staticBaseKey = 'HKCU\\software\\ironSource\\test\\bench\\'

	var baseKey, keys

	it('create', function(done) {

		console.time('start create')
		index.createKey(keys, function(err) {
			if (err) {
				return done(err)
			}
			console.timeEnd('start create')
			done()
		})
	})

	it('test', function(done) {
		index.createKey(keys, function(err) {
			if (err) {
				return done(err)
			}
			console.timeEnd('start create')
			index.list(baseKey, function(err) {
				if (err) {
					return done(err)
				}
				console.time('start create')
				done()
			})
		})
	})

	beforeEach(function() {
		baseKey = staticBaseKey + Date.now()

		// clear remains of previous tests
		index.deleteKey(staticBaseKey, function(err) {
			if (err) {
				console.log(err)
				console.log('this is of no consequence, probably.')
			}

			// create N keys for the test
			keys = []

			for (var i = 0; i < testSize; i++) {
				keys.push(baseKey + '\\' + i)
			}
		})
	})
})
