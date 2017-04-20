'use strict';

var Loader = require('./');
var loader = new Loader({cwd: 'test/fixtures'});

loader.on('helper', function(name, fn) {
  console.log(name, fn.isAsync);
});

loader.load('upper', function upper(str) {
  return str.toUpperCase();
});

loader.load('is-valid-glob', {
  renameKey: function(key) {
    return key.replace(/\W(.)/g, function(m, ch) {
      return ch.toUpperCase();
    });
  }
});

loader.load('a.js');
loader.load('b.js');
loader.load('c.js');
loader.load(['*.js']);
loader.load('more/[d-f].js');
loader.load(['more/o*.js']);
loader.load({
  foo: function() {},
  bar: function() {},
  baz: function() {}
});
loader.load([{
  aaaaa: function() {},
  bbbbb: function() {},
  ccccc: function() {}
}]);

loader.load([
  'has-glob',
  {
    qux: function() {},
    fez: function() {}
  }
],
{
  renameKey: function(key) {
    return key.replace(/-(.)/g, function(m, ch) {
      return ch.toUpperCase();
    });
  }
});

console.log(loader);
