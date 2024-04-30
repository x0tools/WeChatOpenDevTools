console.log('123')
setTimeout(function() {
	throw new Error('error')
}, 1000)
