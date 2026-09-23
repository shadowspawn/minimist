'use strict';

var parse = require('../');
var test = require('tape');

test('dotted alias', function (t) {
	var argv = parse(['--a.b', '22'], { default: { 'a.b': 11 }, alias: { 'a.b': 'aa.bb' } });
	t.equal(argv.a.b, 22);
	t.equal(argv.aa.bb, 22);
	t.end();
});

test('dotted default', function (t) {
	var argv = parse('', { default: { 'a.b': 11 }, alias: { 'a.b': 'aa.bb' } });
	t.equal(argv.a.b, 11);
	t.equal(argv.aa.bb, 11);
	t.end();
});

test('dotted default with no alias', function (t) {
	var argv = parse('', { default: { 'a.b': 11 } });
	t.equal(argv.a.b, 11);
	t.end();
});

test('dotted array', function (t) {
	var argv = parse(['--a.1.foo', '11']);

	t.notOk(Array.isArray(argv.a));

	t.notOk(0 in argv.a);

	t.equal(argv.a[1].foo, 11);

	t.end();
});

test('dotted access to previous number does not throw', function (t) {
	t.doesNotThrow(function () {
		var argv = parse(['--a', '11', '--a.b', 'VALUE']);
		// overwrites, previous value not retained
		t.equal(argv.a.b, 'VALUE');
	});
	t.end();
});

test('dotted access to previous string does not throw', function (t) {
	t.doesNotThrow(function () {
		var argv = parse(['--a', 'AA', '--a.b', 'VALUE']);
		// overwrites, previous value not retained
		t.equal(argv.a.b, 'VALUE');
	});
	t.end();
});

test('dotted access to _ does not throw', function (t) {
	t.doesNotThrow(function () {
		var argv = parse(['ARG', '--a', 'one', '--a', 'two', '--_.length=100', '--_.extra=EXTRA']);
		// ignoring dotted access to _
		t.deepEqual(argv._, ['ARG']);
	});
	t.end();
});
