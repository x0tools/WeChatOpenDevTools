# if-async [![Build Status](https://secure.travis-ci.org/kessler/if-async.png?branch=master)](http://travis-ci.org/kessler/if-async)

async conditional execution for async.js or standalone usage

## Example 1: Using with Async.js Series

```javascript
var async = require('async')
var ifAsync = require('if-async')

async.series([
    foo,
    ifAsync(predicate1).and(predicate2).then(consequent12)
        .elseIf(predicate3).then(consequent3)
        .else(else1),
    bar
], function(err) {})

function foo(callback) { ... }
function predicate1(callback) { fs.stat(... callback ...) }
function predicate2(callback) { fs.stat(... callback ...) }
function consequent12(callback) { ... }
function predicate3(callback) { fs.stat(... callback ...) }
function consequent3(callback) { ... }
function else1(callback) { ... }
function bar(callback) { ... }
```

## Example 2: Using with Async.js waterfall
```javascript
var async = require('async')
var ifAsync = require('if-async')

async.waterfall([
    foo,
    ifAsync(p1).then(c1).else(c2),
    bar
], function(err) {})

function foo(callback) {
    callback(null, 1)
}

function p1(a, callback) {
    console.log(a) // prints 1
    callback(null, true) // this will cause c1 to be executed rather than c2
}

function c1(a, callback) {
    console.log(a) // prints 1
    callback(null, 2)
}

function c2(a, callback) {
    console.log(a) // prints 1
    callback(null, 3)
}

function bar(a, callback) {
    console.log(a) // prints 2 because the c1 passed 2 in the callback
    callback()
}
```

## Example 3: Standalone usage

```javascript
var ifAsync = require('if-async')

var functor = ifAsync(predicate).then(consequent).else(elseClause)

functor(function(err) {
    console.log('done')
})

function predicate(callback) { fs.stat(... callback ...) }
function consequent(callback) { ... }
function elseClause(callback) { ... }
```


## API Reference
Two main concepts that are used throughout this reference are predicate and consequent.

#### Predicate
in the context of ifAsync, a predicate is an async function that calls back with an error or a value. That value evaluates to true or false. e.g
```javascript
function predicate(callback) {
    if (bar) return callback(null, 1)
    else if (foo) return callback() // same as  callback(null, false)
    else return callback(new Error('fail'))
}
```

#### Consequent
in the context of ifAsync a consequent is an async function that is invoked as a result of an evaluation of a predicate, e.g
```javascript
function consequent(callback) {
    callback(null, 'dont care')    
}
```

#### ifAsync(Array|Function)
Call this function with an array of functions or a single function the return value is a new function that will run all the logic and invoke a callback parameter in the end:

```javascript
    var functor = ifAsync(f1, f2, f3)
    
    functor(function(err) {
        // f1 is evaluated and then f2 or f3 will be called accordingly, then this callback is called
    })
```

When calling with an array of functions, the array is divided into pairs. The pair's first member is a predicate and the second is a consequent. If the array contains an odd number of functions then the last function is considered the default consequent (else clause)

When calling with a single function, it is considered a predicate and the user is expected to call then() at least once (an error will be thrown otherwise)

Both array style calls and fluent interface can be mixed. e.g ```ifAsync(f1,f2).elseIf(f3).then(f4)``` which is equivalent to ```ifAsync(f1).then(f2).elseIf(f3).then(f4)```

#### ifAsync.not(Function)
Same as ifAsync, only this call only accepts a predicate function and will negate its result

#### .then(Function) 
```javascript
ifAsync(Function f1).then(Function f2)
```
f1 is a predicate and f2 is a consequent. Each ifAsync must include at least one then consequent

#### .and(Function) 
```javascript
ifAsync(Function f1).and(Function f2).then(Function f3)
```
connect predicates f1 and f2 with a logical AND operator

#### .and.not(Function)
same as and() only negate the result of the predicate

#### .or(Function)
```javascript
 ifAsync(Function f1).or(Function f2).then(Function f3)
```
connect predicates f1 and f2 with a logical OR operator

#### .or.not(Function)
same as or() only negate the result of the predicate

#### .elseIf(Function)
```javascript
ifAsync(Function f1).then(Function f2).elseIf(Function f3).then(Function f4)
```
evaluate the first predicate (f1) if it evalutes to true then run consequent f2 otherwise evaluate f3 and if that is true, run consequent f4
elseIf() is case insensitive, you can also use elseif() 

#### .elseIf.not(Function)
same as elseIf() only negate the result of the predicate

#### .else(Function)
```javascript
ifAsync(Function f1).then(Function f2).else(Function f3)
```
The default consequent, it is optional and is executed if f1 predicate above evaluates to false
