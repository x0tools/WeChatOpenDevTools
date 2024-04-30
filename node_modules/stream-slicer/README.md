Stream slicer
=============

```
	npm install stream-slicer
```

#### usage

```
var StreamSlicer = require('stream-slicer');
var fs = require('fs');

var read = fs.createReadStream('data');  // data === '1|2|3|4|5|6';
var write = fs.createWriteStream('data1');

var slicer = new StreamSlicer({ sliceBy: '|', replaceWith: '\n'});

slicer.on('slice', function (data) {
	console.log(data);
});

read.pipe(slicer).pipe(write); 

/*
	data1 ===

	1
	2
	3
	4
	5
	6

*/

```
also:
```
var StreamSlicer = require('stream-slicer');
var fs = require('fs');

var read = fs.createReadStream('data');  // data === '1||2|3||4|5||6';
var write = fs.createWriteStream('data1');

var slicer = new StreamSlicer({ sliceBy: '||', replaceWith: '---'});

slicer.on('slice', function (data) {
	console.log(data);
});

read.pipe(slicer).pipe(write); // data1 === '1---2|3---4|5---6'
```