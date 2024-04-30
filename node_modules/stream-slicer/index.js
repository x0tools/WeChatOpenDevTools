var Transform = require('stream').Transform;
var $u = require('util');

$u.inherits(StreamSlicer, Transform);
function StreamSlicer(options) {
	if (!(this instanceof StreamSlicer))
    	return new StreamSlicer(options);

	Transform.call(this, options);
	this._buffer = [];
	this._currentLength = 0;

	if (options && options.sliceBy)
		this._sliceBy = options.sliceBy;
	else
		this._sliceBy = '\n';

	if (options && options.replaceWith)
		this.replaceWith = new Buffer(options.replaceWith);
}

StreamSlicer.prototype._transform = function(chunk, encoding, callback) {

	chunk = String(chunk);

	var start = 0;
	var index = -1;

	while ((index = chunk.indexOf(this._sliceBy, start)) > -1 ) {
		var miniChunk = chunk.substring(start, index);

		this._append( miniChunk );
		this._separatorFlush();

		start = index + this._sliceBy.length;
	}

	var trailing = chunk.substring(start);
	
	if (trailing.length > 0)
		this._append( trailing );

	callback();
};

StreamSlicer.prototype._append = function ( str ) {
	var chunk = new Buffer(str);
	this._buffer.push(chunk);
	this._currentLength += chunk.length;
};

StreamSlicer.prototype._separatorFlush = function (transformFlush) {
	if (this.replaceWith && !transformFlush) {
		this._buffer.push(this.replaceWith);
		this._currentLength += this.replaceWith.length;
	}

	var data = Buffer.concat(this._buffer, this._currentLength);

	this._buffer = [];
	this._currentLength = 0;

	this.push(data);
	this.emit('slice', data);
};

StreamSlicer.prototype._flush = function (callback) {
	this._separatorFlush(true);

	if (callback)
		callback();
};

module.exports = StreamSlicer;