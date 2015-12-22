require('mocha');
require('should');
var path = require('path');
var assert = require('assert');
var loader = require('..');

describe('load helpers:', function () {
  describe('object:', function () {
    it('should throw an error when key is a function:', function () {
      var cache = {};
      var helpers = loader(cache);

      (function () {
        helpers('./test/fixtures/fail/fn.js');
      }).should.throw('key should be an object, array or string.');
    });

    it('should require helpers from a file path:', function () {
      var cache = {};
      var helpers = loader(cache);

      helpers('./test/fixtures/a.js');
      assert(typeof cache.a === 'function');
    });

    it('should return helpers:', function () {
      var cache = {};
      var helpers = loader(cache);

      var obj = helpers('./test/fixtures/a.js');
      assert(typeof obj.a === 'function');
    });

    it('should add an async flag to async helpers:', function () {
      var cache = {};
      var helpers = loader(cache, {async: true});

      var obj = helpers('./test/fixtures/a.js');
      assert.equal(obj.a.async, true);
    });

    it('should load helpers defined as an object:', function () {
      var cache = {};
      var helpers = loader(cache);
      helpers({
      	a: function (str) {
	      	return str;
	      }
      });
      assert(typeof cache.a === 'function');
    });

    it('should load multiple helpers defined as objects.', function () {
      var cache = {};
      var helper = loader(cache);
      helper({
        a: function (str) {
        	return str;
        },
        b: function (str) {
        	return str;
        },
        c: function (str) {
        	return str;
        },
        d: function (str) {
        	return str;
        }
      });

      var keys = Object.keys(cache);
      keys.should.have.length(4);
    });

    it('should load helper objects defined as file paths:', function () {
      var cache = {};
      var helpers = loader(cache);
      helpers('test/fixtures/a.js');

      assert(typeof cache.a === 'function');
    });

    it('should load helper objects defined as file paths 2:', function () {
      var cache = {};
      var helpers = loader(cache);
      helpers({a: './test/fixtures/a.js'});

      assert(typeof cache.a === 'function');
    });

    it('should load helper objects defined as an array of file paths:', function () {
      var cache = {};
      var helpers = loader(cache);
      helpers(['test/fixtures/a.js', 'test/fixtures/b.js', 'test/fixtures/c.js']);

      assert(typeof cache.a === 'function');
      assert(typeof cache.b === 'function');
      assert(typeof cache.c === 'function');
    });

    it('should load helper objects defined as an array of glob patterns:', function () {
      var cache = {};
      var helpers = loader(cache);
      helpers(['test/fixtures/*.js']);

      assert(typeof cache.a === 'function');
      assert(typeof cache.b === 'function');
      assert(typeof cache.c === 'function');
    });

    it('should load helper objects defined as a string of glob patterns:', function () {
      var cache = {};
      var helpers = loader(cache);
      helpers('test/fixtures/*.js');

      assert(typeof cache.a === 'function');
      assert(typeof cache.b === 'function');
      assert(typeof cache.c === 'function');
    });

  });

  describe('array', function () {
    it('should load an array of helpers.', function () {
      var cache = {};
      var helper = loader(cache);
      helper([{
        a: function (str) {
          return str;
        },
        b: function (str) {
          return str;
        },
        c: function (str) {
          return str;
        },
        d: function (str) {
          return str;
        }
      }]);

      var keys = Object.keys(cache);
      keys.should.have.length(4);
    });
  });

  describe('key-value pair', function () {
    it('should load a helper as a key-value pair:', function () {
      var cache = {};
      var helper = loader(cache);
      helper('upper', function upper(str) {
        return str.toUpperCase();
      });
      assert(typeof cache.upper === 'function');
    });

    it('should return an object of helpers loaded as key-value pairs:', function () {
      var helper = loader();
      var foo = helper('upper', function upper(str) {
        return str.toUpperCase();
      });
      var bar = helper('lower', function lower(str) {
        return str.toLowerCase();
      });
      assert(typeof foo.upper === 'function');
      assert(typeof bar.lower === 'function');
    });

    it('should load a key-value pair where the value is a string:', function () {
      var cache = {};
      var helper = loader(cache);
      helper('foo', './test/fixtures/a.js');
      assert(typeof cache.foo === 'function');
    });
  });

  describe('module', function () {
    it('should load a helper function from node_modules:', function () {
      var cache = {};
      var helper = loader(cache);

      helper('is-valid-glob', {
        renameKey: function (key) {
          return key.replace(/-(.)/g, function (m, ch) {
            return ch.toUpperCase();
          });
        }
      });

      assert(typeof cache.isValidGlob === 'function');
    });
  });

  describe('rename options', function () {
    it('should use a custom renameKey function on file paths:', function () {
      var cache = {};
      var helper = loader(cache);

      helper('test/fixtures/a.js', {
        renameKey: function (key) {
          return 'helper-' + path.basename(key);
        }
      });

      assert(typeof cache['helper-a.js'] === 'function');
    });
  });
});

describe('options', function () {
  describe('options.cwd', function () {
    it('should pass cwd option to globby:', function () {
      var cache = {};
      var helpers = loader(cache);
      helpers('*.js', {
        cwd: 'test/fixtures'
      });
      assert(typeof cache.alpha === 'function');
      assert(typeof cache.beta === 'function');
      assert(typeof cache.gamma === 'function');
    });

    it('should pass nonull option to globby:', function () {
      var cache = {};
      var helpers = loader(cache);
      helpers('*.foo', {
        nonull: true,
        cwd: 'test/fixtures',
      });
      assert.deepEqual(cache, {});
    });
  });
});
