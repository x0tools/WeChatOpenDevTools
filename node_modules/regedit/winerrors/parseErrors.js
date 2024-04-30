var fs = require('fs')

var errors = fs.readFileSync('error.txt').toString()
errors = errors.split(/^wbem/m)
errors.shift()
var results = []

for (var i = 0; i < errors.length; i++) {
	var splitted = errors[i].split('\n')
	
	var result = {
		error: 'wbem' + splitted[0],
		code: parseInt(splitted[1], 10),
		description: splitted[2],
	}

	if (result.description) {
		result.description = result.description.replace(/'/g, '\\\'')
	}
	
	results.push(result)
}

console.log(JSON.stringify(results))
