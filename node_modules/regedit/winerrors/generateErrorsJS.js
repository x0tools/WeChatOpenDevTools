/* eslint-disable max-len */

var fs = require('fs')
var START_MARKER = '// *** generated errors ***//'
var END_MARKER = '// *** end generated errors ***//'

var generatedErrorObjects = fs.readFileSync('./generatedErrorObjects.js', 'utf8')
var errorsJs = fs.readFileSync('../errors.js', 'utf8')

var start = errorsJs.indexOf(START_MARKER)
var end = errorsJs.indexOf(END_MARKER, start)

if (start === -1) {
	throw new Error('missing injection start marker')
}

if (end === -1) {
	throw new Error('missing injection end marker')
}

errorsJs = errorsJs.substring(0, start + START_MARKER.length) + '\n' + generatedErrorObjects + '\n' + errorsJs.substring(end)

console.log(errorsJs)

