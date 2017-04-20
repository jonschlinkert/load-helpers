'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var Loader = require('..');
var loader;

function size(obj) {
  return Object.keys(obj).length;
}

describe('load helpers:', function() {
  beforeEach(function() {
    loader = new Loader();
  });

  describe('errors:', function() {
    it('should throw an error when key is a function:', function() {
      assert.throws(function() {
        loader.load('test/fixtures/fail/fn.js');
      });

      assert.throws(function() {
        loader.load();
      });
    });
  });

  describe('key-value pair', function() {
    it('should support helpers defined as key-value pairs:', function() {
      loader.loadHelper('upper', function(str) {
        return str.toUpperCase();
      });
      loader.loadHelper('lower', function(str) {
        return str.toLowerCase();
      });
      assert.equal(typeof loader.cache.upper, 'function');
      assert.equal(typeof loader.cache.lower, 'function');
    });

    it('should load a key-value pair where the value is a string:', function() {
      loader.load('foo', 'test/fixtures/a.js');
      assert.equal(typeof loader.cache.foo, 'function');
    });
  });

  describe('filepath', function() {
    it('should require helpers from file paths defined as a string:', function() {
      loader.load('test/fixtures/a.js');
      loader.load('test/fixtures/b.js');
      loader.load('test/fixtures/c.js');

      assert.equal(size(loader.cache), 3);
      assert.equal(typeof loader.cache.a, 'function');
      assert.equal(typeof loader.cache.b, 'function');
      assert.equal(typeof loader.cache.c, 'function');
    });
  });

  describe('object', function() {
    it('should load helpers from an object:', function() {
      loader.load({
        a: function(str) {
          return str;
        },
        b: function(str) {
          return str;
        },
        c: function(str) {
          return str;
        },
        d: function(str) {
          return str;
        }
      });

      loader.load({
        z: function(str) {
          return str;
        }
      });

      assert.equal(size(loader.cache), 5);
      assert.equal(typeof loader.cache.a, 'function');
    });

    it('should load an object of helpers with filepath values', function() {
      loader.load({a: 'test/fixtures/a.js'});
      assert.equal(typeof loader.cache.a, 'function');
    });

    it('should load an object of helpers with array values', function() {
      loader.load({foo: ['test/fixtures/a.js', 'test/fixtures/b.js']});

      assert.equal(typeof loader.cache.foo.a, 'function');
      assert.equal(typeof loader.cache.foo.b, 'function');
    });
  });

  describe('array', function() {
    it('should load helpers from an array of file paths:', function() {
      loader.load(['test/fixtures/a.js', 'test/fixtures/b.js', 'test/fixtures/c.js']);

      assert.equal(size(loader.cache), 3);
      assert.equal(typeof loader.cache.a, 'function');
      assert.equal(typeof loader.cache.b, 'function');
      assert.equal(typeof loader.cache.c, 'function');
    });

    it('should load helpers from an array of objects:', function() {
      loader.load([
        {
          a: function(str) {
            return str;
          },
          b: function(str) {
            return str;
          },
          c: function(str) {
            return str;
          },
          d: function(str) {
            return str;
          }
        },
        {
          z: function(str) {
            return str;
          }
        }
      ]);

      assert.equal(size(loader.cache), 5);
      assert.equal(typeof loader.cache.a, 'function');
    });

    it('should load helper objects defined as an array of file paths:', function() {
      loader.load(['test/fixtures/a.js', 'test/fixtures/b.js', 'test/fixtures/c.js']);
      assert.equal(typeof loader.cache.a, 'function');
      assert.equal(typeof loader.cache.b, 'function');
      assert.equal(typeof loader.cache.c, 'function');
    });
  });

  describe('glob', function() {
    it('should load helper objects defined as an array of glob patterns:', function() {
      loader.load(['test/fixtures/*.js']);
      assert.equal(typeof loader.cache.a, 'function');
      assert.equal(typeof loader.cache.b, 'function');
      assert.equal(typeof loader.cache.c, 'function');
    });

    it('should load helper objects defined as a string of glob patterns:', function() {
      loader.load('test/fixtures/*.js');

      assert.equal(typeof loader.cache.a, 'function');
      assert.equal(typeof loader.cache.b, 'function');
      assert.equal(typeof loader.cache.c, 'function');
    });
  });

  describe('groups', function() {
    it('should add an object of helpers to a namespace', function() {
      loader.load({
        utils: {
          a: function(str) {
            return str;
          },
          b: function(str) {
            return str;
          },
          c: function(str) {
            return str;
          },
          d: function(str) {
            return str;
          }
        }
      });
      assert.equal(size(loader.cache.utils), 4);
      assert.equal(typeof loader.cache.utils.a, 'function');
      assert.equal(typeof loader.cache.utils.b, 'function');
      assert.equal(typeof loader.cache.utils.c, 'function');
      assert.equal(typeof loader.cache.utils.d, 'function');
    });

    it('should add an array of helper objects to a namespace', function() {
      loader.load({
        utils: [{
          a: function(str) {
            return str;
          },
          b: function(str) {
            return str;
          },
          c: function(str) {
            return str;
          },
          d: function(str) {
            return str;
          }
        }]
      });
      assert.equal(size(loader.cache.utils), 4);
      assert.equal(typeof loader.cache.utils.a, 'function');
      assert.equal(typeof loader.cache.utils.b, 'function');
      assert.equal(typeof loader.cache.utils.c, 'function');
      assert.equal(typeof loader.cache.utils.d, 'function');
    });

    it('should add an array of helper strings to a namespace', function() {
      loader.load({
        utils: [
          'test/fixtures/a.js',
          'test/fixtures/b.js',
          'test/fixtures/c.js'
        ]
      });
      assert.equal(size(loader.cache.utils), 3);
      assert.equal(typeof loader.cache.utils.a, 'function');
      assert.equal(typeof loader.cache.utils.b, 'function');
      assert.equal(typeof loader.cache.utils.c, 'function');
    });

    it('should add an array of mixed helper args to a namespace', function() {
      loader.load({
        utils: [
          'test/fixtures/a.js',
          'test/fixtures/b.js',
          {
            c: function(str) {
              return str;
            },
            d: function(str) {
              return str;
            }
          }
        ]
      });
      assert.equal(size(loader.cache.utils), 4);
      assert.equal(typeof loader.cache.utils.a, 'function');
      assert.equal(typeof loader.cache.utils.b, 'function');
      assert.equal(typeof loader.cache.utils.c, 'function');
      assert.equal(typeof loader.cache.utils.d, 'function');
    });
  });

  describe('installed module', function() {
    it('should load a helper function from local node_modules:', function() {
      loader.load('is-valid-glob', {
        renameHelper: function(key) {
          return key.replace(/-(.)/g, function(m, ch) {
            return ch.toUpperCase();
          });
        }
      });
      assert.equal(typeof loader.cache.isValidGlob, 'function');
    });
  });

  describe('rename options', function() {
    it('should use a custom renameHelper function on file paths:', function() {
      loader.load('test/fixtures/a.js', {
        renameHelper: function(key) {
          return 'helper-' + path.basename(key).split('.').join('\\.');
        }
      });
      assert.equal(typeof loader.cache['helper-a.js'], 'function');
    });
  });

  describe('options.async', function() {
    it('should add an async flag to async helpers:', function() {
      loader.load('test/fixtures/a.js', {async: true});
      assert.equal(loader.cache.a.async, true);
    });
  });

  describe('options.cwd', function() {
    it('should pass cwd option to matched:', function() {
      loader.load('*.js', {cwd: 'test/fixtures'});

      assert.equal(typeof loader.cache.alpha, 'function');
      assert.equal(typeof loader.cache.beta, 'function');
      assert.equal(typeof loader.cache.gamma, 'function');
    });

    it('should pass nonull option to matched:', function() {
      loader.load('*.foo', {
        nonull: true,
        cwd: 'test/fixtures',
      });

      assert.deepEqual(loader.cache, {});
    });
  });
});


