var loader = require('./');
var cache = {};
var helpers = loader(cache);

var opts = {cwd: 'test/fixtures'};

helpers('upper', function upper(str) {
  return str.toUpperCase();
});

helpers('is-valid-glob', {
  renameKey: function(key) {
    return key.replace(/\W(.)/g, function(m, ch) {
      return ch.toUpperCase();
    });
  }
});

helpers('test/fixtures/a.js');
helpers('test/fixtures/b.js', opts);
helpers('c.js', opts);
helpers(['*.js'], opts);
helpers('test/fixtures/more/[d-f].js');
helpers(['test/fixtures/more/o*.js']);
helpers({
  foo: function() {},
  bar: function() {},
  baz: function() {}
});
helpers([
  'has-glob',
  {
  qux: function() {},
  fez: function() {}
}], {
  renameKey: function(key) {
    return key.replace(/-(.)/g, function(m, ch) {
      return ch.toUpperCase();
    });
  }
});

console.log(cache);
