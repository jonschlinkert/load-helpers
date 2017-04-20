'use strict';

var path = require('path');
var glob = require('matched');
var set = require('set-value');
var typeOf = require('kind-of');
var extend = require('extend-shallow');
var Emitter = require('component-emitter');
var isValidGlob = require('is-valid-glob');
var isGlob = require('is-glob');
var utils = require('./utils');

/**
 * Create an instance of `Loader` with the given `options`.
 *
 * ```js
 * var Loader = require('load-helpers');
 * var loader = new Loader();
 * ```
 * @param {Object} `options`
 * @api public
 */

function Loader(options) {
  if (!(this instanceof Loader)) {
    return new Loader(options);
  }
  this.options = options || {};
  this.cache = this.options.helpers || {};
}

/**
 * Inherit `Emitter`
 */

Loader.prototype = Object.create(Emitter.prototype);
Loader.prototype.constructor = Loader;

/**
 * Register a helper function by `name`.
 *
 * ```js
 * loader.addHelper('foo', function() {
 *   // do stuff
 * });
 * ```
 * @param {String} `name`
 * @param {Function} `fn`
 * @param {Object} `options`
 * @api public
 */

Loader.prototype.addHelper = function(name, fn, options) {
  if (typeof name !== 'string') {
    throw new TypeError('expected helper name to be a string');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('expected helper to be a function');
  }

  if (typeof options === 'boolean') {
    options = { async: options };
  }

  if (options && options.async === true) {
    fn.async = true;
  }

  set(this.cache, name, fn);
  this.emit('helper', name, fn);
  return this;
};

/**
 * Register an object of helper functions.
 *
 * ```js
 * loader.addHelpers({
 *   foo: function() {},
 *   bar: function() {},
 *   baz: function() {}
 * });
 * ```
 * @param {Object} `helpers`
 * @param {Object} `options`
 * @api public
 */

Loader.prototype.addHelpers = function(helpers, options) {
  var keys = Object.keys(helpers);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    this.addHelper(key, helpers[key], options);
  }
  return this;
};

/**
 * Load one or more helpers from a filepath, glob pattern, object, or
 * an array of any of those things. This method detects the type of
 * value to be handled then calls one of the other methods to do the
 * actual loading.
 *
 * ```js
 * var loader = new Loader();
 * console.log(loader.load(['foo/*.hbs', 'bar/*.hbs']));
 * console.log(loader.load({path: 'a/b/c.md'}));
 * console.log(loader.load('index', {path: 'a/b/c.md'}));
 * ```
 * @param {Object} `helpers`
 * @param {Object} `options`
 * @return {Object} Returns the views from `loader.helpers`
 * @api public
 */

Loader.prototype.load = function(val, options) {
  if (typeof options === 'boolean') {
    options = { isAsync: options };
  }

  switch (typeOf(val)) {
    case 'string':
    case 'function':
      return this.loadHelper.apply(this, arguments);
    case 'object':
      return this.loadHelpers.apply(this, arguments);
    case 'array':
      if (isValidGlob(val)) {
        var cache = this.loadGlob.apply(this, arguments);
        return this.loadHelpers(cache, options);
      }
      return this.loadHelpers.apply(this, arguments);
    default: {
      throw new TypeError('expected name to be an object, array or string');
    }
  }
};

Loader.prototype.loadHelper = function(name, fn, options) {
  if (utils.isObject(fn)) {
    options = fn;
    fn = undefined;
  }

  if (isGlob(name)) {
    var cache = this.loadGlob.apply(this, arguments);
    return this.loadHelpers(cache, options);
  }

  var opts = utils.options(this, options);
  if (typeof fn === 'string') {
    fn = utils.tryRequire(fn, opts);
  }

  if (typeof fn !== 'function') {
    var val = this.loadFile(name, options);
    if (utils.isObject(val)) {
      return this.addHelpers(val, options);
    }
  }

  this.addHelper(name, fn, options);
  return this;
};

Loader.prototype.loadHelpers = function(helpers, options) {
  if (Array.isArray(helpers) && helpers.length) {
    for (var i = 0; i < helpers.length; i++) {
      this.load(helpers[i], options);
    }

  } else if (utils.isObject(helpers)) {
    var keys = Object.keys(helpers);
    var len = keys.length;
    var idx = -1;

    while (++idx < len) {
      var name = keys[idx];
      var helper = helpers[name];
      var type = typeOf(helper);

      switch (type) {
        case 'function':
          this.loadHelper(name, helper, options);
          break;
        case 'object':
          this.loadGroup(name, helper, options);
          break;
        case 'string':
          this.loadHelper(name, utils.tryRequire(helper), options);
          break;
        case 'array':
          if (isValidGlob(helper)) {
            var cache = this.loadGlob(helper, options);
            this.loadGroup(name, cache, options);
          } else {
            for (var j = 0; j < helper.length; j++) {
              var val = helper[j];
              if (isValidGlob(val)) {
                val = this.loadGlob(val, options);
              }
              this.loadGroup(name, val, options);
            }
          }
          break;
        default: {
          throw new TypeError('unsupported helper type: ' + type);
        }
      }
    }
  }
  return this;
};

Loader.prototype.loadGroup = function(name, helpers, options) {
  if (typeof helpers === 'function') {
    this.addHelper(name, helpers);
  }

  var keys = Object.keys(helpers);
  for (var j = 0; j < keys.length; j++) {
    var key = keys[j];
    this.addHelper(name + '.' + key, helpers[key], options);
  }
  return this;
};

Loader.prototype.loadFile = function(name, options) {
  if (typeof name !== 'string') {
    throw new TypeError('expected filepath or module name to be a string');
  }
  var opts = utils.options(this, options);
  var val = utils.tryRequire(name, opts);

  if (typeof val === 'function') {
    var cache = {};
    name = utils.renameHelper(name, opts);
    cache[name] = val;
    return cache;
  }
  return val;
};

Loader.prototype.loadGlob = function(patterns, options) {
  var opts = utils.options(this, options);
  var cache = {};

  if (typeof patterns === 'string' && !isGlob(patterns)) {
    return this.loadFile(patterns, options);
  }

  var files = glob.sync(patterns, opts);
  for (var i = 0; i < files.length; i++) {
    var name = path.resolve(opts.cwd, files[i]);
    cache = extend({}, cache, this.loadFile(name, opts));
  }
  return cache;
};


/**
 * Expose `Loader`
 */

module.exports = Loader;
