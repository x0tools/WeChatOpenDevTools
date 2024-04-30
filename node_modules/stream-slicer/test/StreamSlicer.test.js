var assert = require('assert');
var StreamSlicer = require('../index');
var fs = require('fs');
var path = require('path');

var dir = process.cwd();
var testdataFilename;

if (dir.substr(-5) === 'test/')
	testdataFilename = './testdata';
else
	testdataFilename = path.join(dir, 'test', 'testdata');

testdata = fs.readFileSync(testdataFilename, 'utf8');

function createRead(stream, output) {

	return function read () {

		var result = stream.read();
		
		if (result === null) {
			stream.once('readable', read)
		} else {
			output.push(result);				
			read();
		}	
	}
}

describe('StreamSlicer', function () {

	it('will slice a stream by a separator', function (done) {
		
		var stream = new StreamSlicer({ sliceBy: '|' });		
		var incoming = fs.createReadStream(testdataFilename);

		var slicerOutput = [];

		stream.on('end', function () {
			
			var expected = testdata.split('|').join('');

			assert.strictEqual(expected, slicerOutput.join(''));
			done();
		});	

		var read = createRead(stream, slicerOutput);

		read();

		incoming.pipe(stream);
	});

	it('will slice a stream by a separator and replace it with another', function (done) {
		
		var stream = new StreamSlicer({ sliceBy: '|', replaceWith: '-' });		
		var incoming = fs.createReadStream(testdataFilename);

		var slicerOutput = [];

		stream.on('end', function () {
			
			var expected = testdata.split('|').join('-');

			assert.strictEqual(expected, slicerOutput.join(''));
			done();
		});	

		var read = createRead(stream, slicerOutput);

		read();

		incoming.pipe(stream);
	});

	it('can handle various lengths of separators', function (done) {
		
		var stream = new StreamSlicer({ sliceBy: '||', replaceWith: '---' });		
		var incoming = fs.createReadStream(testdataFilename);

		var slicerOutput = [];

		stream.on('end', function () {
			
			var expected = testdata.split('||').join('---');			
			assert.strictEqual(expected, slicerOutput.join(''));
			done();
		});	

		var read = createRead(stream, slicerOutput);

		read();

		incoming.pipe(stream);
	});

	it('will emit an event for each slice it does', function (done) {
		
		var stream = new StreamSlicer({ sliceBy: '|' });		
		var incoming = fs.createReadStream(testdataFilename);

		var slicerOutput = [];

		stream.on('end', function () {
			
			var expected = testdata.split('|');

			assert.strictEqual(expected.length, slicerOutput.length);
			assert.deepEqual(expected, slicerOutput);
			done();
		});	

		stream.on('slice', function(data) {
			slicerOutput.push(data.toString());
		});

		incoming.pipe(stream).pipe(process.stdout);
	});

});
