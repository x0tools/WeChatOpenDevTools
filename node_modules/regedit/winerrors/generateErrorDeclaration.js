var parsed = require('./parsed.json')

for (var i = 0; i < parsed.length; i++) {
	var entry = parsed[i]
	console.log('var e%d = new Error(\'%s\')', i, entry.error)
	console.log('e%d.description = \'%s\'', i, entry.description)
	console.log('e%d.code = %d', i, entry.code)
	console.log('errors[%d] = e%d', entry.code, i)
}
