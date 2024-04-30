var util = require('util')

module.exports = ifAsync

var OK = 0
var EXPECT_THEN = 1

function ifAsync() {

	var clauses = toArray(arguments)
	var elseClause = elseNoop
	var fluentState = OK

	if (clauses.length  === 0) {
		throw new Error('at least one predicate and one consequent are required')
	}

	// using fluent interface, we expect the user will call then() before invoking the functor
	if (clauses.length === 1) {
		fluentState = EXPECT_THEN
	} else if (clauses.length % 2 === 1) {
		elseClause = clauses.pop()
	}

	var functor = function() {
		if (fluentState !== OK) {
			throw new Error('missing at least one consequent, you forgot to call then() ?')
		}

		var args = arguments
		var callback = args[args.length - 1]

		if (typeof callback !== 'function') {
			throw new Error('missing callback argument')
		}

		var predicate = clauses.shift()
		
		if (!predicate) {
			return elseClause.apply(null, args)
		}

		var consequent = clauses.shift()
		
		var replacedCallbackArgs = toArray(args)

		replacedCallbackArgs.pop()
		replacedCallbackArgs.push(predicateCallback)

		predicate.apply(null, replacedCallbackArgs)

		function predicateCallback(err, result) {
			if (err) return callback(err)

			if (result) {
				return consequent.apply(null, args)
			} else {
				functor.apply(null, args)
			}
		}
	}

	functor.then = function(fn) {
		if (fluentState !== EXPECT_THEN) {
			throw new Error('not expecting a then() call now')
		}

		fluentState = OK
		clauses.push(fn)
		return functor
	}

	functor.and = function(fn) {
		var predicate = clauses.pop()
		// logical AND using ifAsync
		clauses.push(			
			ifAsync(predicate)
				.then(fn)
				.else(callbackFalse)
		)

		return functor
	}

	functor.and.not = function(predicate) {
		return functor.and(not(predicate))
	}

	functor.or = function(fn) {
		var predicate = clauses.pop()
		// logical OR
		clauses.push(
			ifAsync(predicate)
				.then(callbackTrue)
				.elseIf(fn)
				.then(callbackTrue)
				.else(callbackFalse)
		)
		return functor
	}

	functor.or.not = function(predicate) {
		return functor.or(not(predicate))
	}

	functor.else = function(predicate) {
		if (fluentState === EXPECT_THEN) {
			throw new Error('only then() may be called after elseIf()')
		}

		elseClause = predicate
		return functor
	}

	functor.elseif = functor.elseIf = function(predicate) {
		if (fluentState === EXPECT_THEN) {
			throw new Error('only then() may be called after elseIf()')
		}

		clauses.push(predicate)

		// allow only then after a call to elseif
		fluentState = EXPECT_THEN
		return functor
	}

	functor.elseif.not = function(predicate) {
		return functor.elseIf(not(predicate))
	}

	return functor	
}

ifAsync.not = function(predicate) {
	if (typeof predicate !== 'function') {
		throw new Error('argument must be a predicate function')
	}

	return ifAsync(not(predicate))
}

function not(predicate) {
	return function () {
		var args = toArray(arguments)
		var callback = args.pop()

		if (typeof callback !== 'function') {
			throw new Error('expected a callback but instead got ' + typeof callback)
		}

		args.push(function(err, result) {
			callback(err, !result)
		})

		predicate.apply(null, args)
	}
}

function elseNoop() {
	var args = toArray(arguments)
	var callback = args.pop()	
	args.unshift(null)

	if (typeof callback !== 'function') {
		throw new Error('expected a callback function')
	}

	setImmediate(function () {		
		callback.apply(null, args)
	})
}

function callbackTrue() {
	var callback = arguments[arguments.length - 1]
	if (typeof callback !== 'function') {
		throw new Error('expected a callback function')
	}
	
	callback(null, true)
}

function callbackFalse() {
	var callback = arguments[arguments.length - 1]
	if (typeof callback !== 'function') {
		throw new Error('expected a callback function')
	}
	
	callback(null, false)
}

function toArray(args) {
	return Array.prototype.slice.call(args, 0)
}