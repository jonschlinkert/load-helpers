/*!
 * load-helpers <https://github.com/jonschlinkert/load-helpers>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');

module.exports = function (cache) {
  cache = cache || {};

  function loadHelpers(key, val) {
    if (typeof val === 'function') {
      return addHelper(key, val);
    }
    if (utils.isObject(key)) {
      return addHelpers(key, val);
    }
    val = val || {};
    key = utils.arrayify(key);
    if (!utils.isGlob(key)) {
      return addHelpers(key, val);
    }

    loader(key, val);
    return cache;
  }

  function addHelper(name, fn) {
    cache[name] = fn;
    return cache;
  }

  function addHelpers(helpers, opts) {
    if (Array.isArray(helpers)) {
      helpers.forEach(function (helper) {
        loadHelpers(helper, opts);
      });
    } else {
      for (var name in helpers) {
        addHelper(name, helpers[name]);
      }
    }
    return cache;
  }

  function loader(patterns, opts) {
    var files = utils.glob.sync(patterns, opts);
    var len = files.length;

    if (!len) {
      files = patterns;
      len = files.length;
    }

    while (len--) {
      var name = files[len];
      var file = utils.tryRequire(name, opts);
      if (typeof file === 'function') {
        name = utils.renameKey(name, opts);
        loadHelpers(name, file);
      } else {
        loadHelpers(file, opts);
      }
    }
    return cache;
  }

  return loadHelpers;
};
