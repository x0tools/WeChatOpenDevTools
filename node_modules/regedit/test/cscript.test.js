/* eslint-disable consistent-this */

var cscript = require('../lib/cscript.js')

describe('cscript', function() {
	var mockFs, mockExecFile

	it('must be initialized', function() {
		(function() {
			cscript.path()
		}).should.throw('must initialize first')
	})

	it('if cscript.exe is successfully spawned then no more checks are conducted', function(done) {
		mockExecFile['cscript.exe'].calls.should.eql(0)
		mockExecFile['cscript.exe'].stdout = cscript.CSCRIPT_EXPECTED_OUTPUT

		cscript.init(function(err) {
			if (err) {
				return done(err)
			}

			mockExecFile['cscript.exe'].calls.should.eql(1)
			mockExecFile['cscript.exe'].args[0].should.eql('cscript.exe')
			done()
		})
	})

	it('initializes only once', function(done) {

		mockExecFile['cscript.exe'].calls.should.eql(0)
		mockExecFile['cscript.exe'].stdout = cscript.CSCRIPT_EXPECTED_OUTPUT

		cscript.init(function(err) {
			if (err) {
				return done(err)
			}

			mockExecFile['cscript.exe'].calls.should.eql(1)

			cscript.init(function(err) {
				if (err) {
					return done(err)
				}

				mockExecFile['cscript.exe'].calls.should.eql(1)
				mockExecFile['where cscript.exe'].calls.should.eql(0)
				done()
			})
		})
	})

	it('if cscript.exe fails to execute, try to run "where cscript.exe"', function(done) {
		mockExecFile['cscript.exe'].calls.should.eql(0)
		mockExecFile['where cscript.exe'].calls.should.eql(0)

		mockExecFile['cscript.exe'].err = new Error()
		mockExecFile['cscript.exe'].err.code = 'ENOENT'
		mockExecFile['where cscript.exe'].stdout = '123'

		cscript.init(function(err) {
			if (err) {
				return done(err)
			}

			mockExecFile['cscript.exe'].calls.should.eql(1)
			mockExecFile['where cscript.exe'].calls.should.eql(1)

			cscript.path().should.eql('123')
			done()
		})
	})

	beforeEach(function() {
		mockFs = {
			err: null,
			calls: 0,
			stat: function(name, cb) {
				this.calls++
				var self = this
				setImmediate(function() {
					cb(self.err, {})
				})
			},
		}

		mockExecFile = function(command, args, options, callback) {
			if (!mockExecFile[command]) {
				throw new Error('unexpected command ' + command)
			}

			mockExecFile[command].args = arguments
			mockExecFile[command].calls++

			if (typeof args === 'function') {
				callback = args
				args = undefined
				options = undefined
			}

			if (typeof options === 'function') {
				callback = options
				args = undefined
				options = undefined
			}

			if (typeof callback !== 'function') {
				throw new Error('missing callback')
			}

			setImmediate(function() {
				callback(mockExecFile[command].err, mockExecFile[command].stdout, mockExecFile[command].stderr)
			})
		}

		mockExecFile['cscript.exe'] = { calls: 0, stdout: '', stderr: '', err: null }
		mockExecFile['where cscript.exe'] = { calls: 0, stdout: '', stderr: '', err: null }

		cscript._mock(mockFs, mockExecFile, false)
	})

	afterEach(function() {
		cscript._mockReset()
	})
})
