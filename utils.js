'use strict';

var fs = require('fs');
var path = require('path');

/**
 * Lazily required module dependencies
 */

var lazy = require('lazy-cache')(require);
lazy('globby', 'glob');
lazy('is-valid-glob', 'isGlob');

/**
 * Utils
 */

var utils = lazy;

utils.tryRequire = function tryRequire(name, opts) {
  try {
    // try to require by `name`
    return require(name);
  } catch(err) {
    try {
      var fp = utils.resolve(name, opts);
      return require(fp);
    } catch(err) {}
  }
  return null;
};

utils.renameKey = function renameKey(name, opts) {
  if (opts && typeof opts.renameKey === 'function') {
    return opts.renameKey(name);
  }
  var ext = path.extname(name);
  return path.basename(name, ext);
};

utils.resolve = function resolve(fp, opts) {
  var cwd = opts.cwd || process.cwd();
  return path.resolve(cwd, fp);
};

utils.isObject = function isObject(val) {
  return val && typeof val === 'object'
    && !Array.isArray(val);
};

utils.arrayify = function arrayify(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Expose `utils`
 */

module.exports = utils;
