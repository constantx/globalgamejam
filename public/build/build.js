
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("jb55-domready/index.js", Function("exports, require, module",
"/*!\n\
  * domready (c) Dustin Diaz 2012 - License MIT\n\
  */\n\
!function (name, definition) {\n\
  if (typeof module != 'undefined') module.exports = definition()\n\
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)\n\
  else this[name] = definition()\n\
}('domready', function (ready) {\n\
\n\
  var fns = [], fn, f = false\n\
    , doc = document\n\
    , testEl = doc.documentElement\n\
    , hack = testEl.doScroll\n\
    , domContentLoaded = 'DOMContentLoaded'\n\
    , addEventListener = 'addEventListener'\n\
    , onreadystatechange = 'onreadystatechange'\n\
    , readyState = 'readyState'\n\
    , loaded = /^loade|c/.test(doc[readyState])\n\
\n\
  function flush(f) {\n\
    loaded = 1\n\
    while (f = fns.shift()) f()\n\
  }\n\
\n\
  doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {\n\
    doc.removeEventListener(domContentLoaded, fn, f)\n\
    flush()\n\
  }, f)\n\
\n\
\n\
  hack && doc.attachEvent(onreadystatechange, fn = function () {\n\
    if (/^c/.test(doc[readyState])) {\n\
      doc.detachEvent(onreadystatechange, fn)\n\
      flush()\n\
    }\n\
  })\n\
\n\
  return (ready = hack ?\n\
    function (fn) {\n\
      self != top ?\n\
        loaded ? fn() : fns.push(fn) :\n\
        function () {\n\
          try {\n\
            testEl.doScroll('left')\n\
          } catch (e) {\n\
            return setTimeout(function() { ready(fn) }, 50)\n\
          }\n\
          fn()\n\
        }()\n\
    } :\n\
    function (fn) {\n\
      loaded ? fn() : fns.push(fn)\n\
    })\n\
})//@ sourceURL=jb55-domready/index.js"
));
require.register("component-type/index.js", Function("exports, require, module",
"/**\n\
 * toString ref.\n\
 */\n\
\n\
var toString = Object.prototype.toString;\n\
\n\
/**\n\
 * Return the type of `val`.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(val){\n\
  switch (toString.call(val)) {\n\
    case '[object Date]': return 'date';\n\
    case '[object RegExp]': return 'regexp';\n\
    case '[object Arguments]': return 'arguments';\n\
    case '[object Array]': return 'array';\n\
    case '[object Error]': return 'error';\n\
  }\n\
\n\
  if (val === null) return 'null';\n\
  if (val === undefined) return 'undefined';\n\
  if (val !== val) return 'nan';\n\
  if (val && val.nodeType === 1) return 'element';\n\
\n\
  return typeof val.valueOf();\n\
};\n\
//@ sourceURL=component-type/index.js"
));
require.register("component-each/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var toFunction = require('to-function');\n\
var type;\n\
\n\
try {\n\
  type = require('type-component');\n\
} catch (e) {\n\
  type = require('type');\n\
}\n\
\n\
/**\n\
 * HOP reference.\n\
 */\n\
\n\
var has = Object.prototype.hasOwnProperty;\n\
\n\
/**\n\
 * Iterate the given `obj` and invoke `fn(val, i)`.\n\
 *\n\
 * @param {String|Array|Object} obj\n\
 * @param {Function} fn\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(obj, fn){\n\
  fn = toFunction(fn);\n\
  switch (type(obj)) {\n\
    case 'array':\n\
      return array(obj, fn);\n\
    case 'object':\n\
      if ('number' == typeof obj.length) return array(obj, fn);\n\
      return object(obj, fn);\n\
    case 'string':\n\
      return string(obj, fn);\n\
  }\n\
};\n\
\n\
/**\n\
 * Iterate string chars.\n\
 *\n\
 * @param {String} obj\n\
 * @param {Function} fn\n\
 * @api private\n\
 */\n\
\n\
function string(obj, fn) {\n\
  for (var i = 0; i < obj.length; ++i) {\n\
    fn(obj.charAt(i), i);\n\
  }\n\
}\n\
\n\
/**\n\
 * Iterate object keys.\n\
 *\n\
 * @param {Object} obj\n\
 * @param {Function} fn\n\
 * @api private\n\
 */\n\
\n\
function object(obj, fn) {\n\
  for (var key in obj) {\n\
    if (has.call(obj, key)) {\n\
      fn(key, obj[key]);\n\
    }\n\
  }\n\
}\n\
\n\
/**\n\
 * Iterate array-ish.\n\
 *\n\
 * @param {Array|Object} obj\n\
 * @param {Function} fn\n\
 * @api private\n\
 */\n\
\n\
function array(obj, fn) {\n\
  for (var i = 0; i < obj.length; ++i) {\n\
    fn(obj[i], i);\n\
  }\n\
}\n\
//@ sourceURL=component-each/index.js"
));
require.register("component-event/index.js", Function("exports, require, module",
"var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',\n\
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',\n\
    prefix = bind !== 'addEventListener' ? 'on' : '';\n\
\n\
/**\n\
 * Bind `el` event `type` to `fn`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
exports.bind = function(el, type, fn, capture){\n\
  el[bind](prefix + type, fn, capture || false);\n\
  return fn;\n\
};\n\
\n\
/**\n\
 * Unbind `el` event `type`'s callback `fn`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
exports.unbind = function(el, type, fn, capture){\n\
  el[unbind](prefix + type, fn, capture || false);\n\
  return fn;\n\
};//@ sourceURL=component-event/index.js"
));
require.register("component-delegate/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var matches = require('matches-selector')\n\
  , event = require('event');\n\
\n\
/**\n\
 * Delegate event `type` to `selector`\n\
 * and invoke `fn(e)`. A callback function\n\
 * is returned which may be passed to `.unbind()`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} selector\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
exports.bind = function(el, selector, type, fn, capture){\n\
  return event.bind(el, type, function(e){\n\
    if (matches(e.target, selector)) fn(e);\n\
  }, capture);\n\
  return callback;\n\
};\n\
\n\
/**\n\
 * Unbind event `type`'s callback `fn`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @api public\n\
 */\n\
\n\
exports.unbind = function(el, type, fn, capture){\n\
  event.unbind(el, type, fn, capture);\n\
};\n\
//@ sourceURL=component-delegate/index.js"
));
require.register("component-domify/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `parse`.\n\
 */\n\
\n\
module.exports = parse;\n\
\n\
/**\n\
 * Wrap map from jquery.\n\
 */\n\
\n\
var map = {\n\
  option: [1, '<select multiple=\"multiple\">', '</select>'],\n\
  optgroup: [1, '<select multiple=\"multiple\">', '</select>'],\n\
  legend: [1, '<fieldset>', '</fieldset>'],\n\
  thead: [1, '<table>', '</table>'],\n\
  tbody: [1, '<table>', '</table>'],\n\
  tfoot: [1, '<table>', '</table>'],\n\
  colgroup: [1, '<table>', '</table>'],\n\
  caption: [1, '<table>', '</table>'],\n\
  tr: [2, '<table><tbody>', '</tbody></table>'],\n\
  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],\n\
  th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],\n\
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],\n\
  _default: [0, '', '']\n\
};\n\
\n\
/**\n\
 * Parse `html` and return the children.\n\
 *\n\
 * @param {String} html\n\
 * @return {Array}\n\
 * @api private\n\
 */\n\
\n\
function parse(html) {\n\
  if ('string' != typeof html) throw new TypeError('String expected');\n\
\n\
  // tag name\n\
  var m = /<([\\w:]+)/.exec(html);\n\
  if (!m) throw new Error('No elements were generated.');\n\
  var tag = m[1];\n\
\n\
  // body support\n\
  if (tag == 'body') {\n\
    var el = document.createElement('html');\n\
    el.innerHTML = html;\n\
    return el.removeChild(el.lastChild);\n\
  }\n\
\n\
  // wrap map\n\
  var wrap = map[tag] || map._default;\n\
  var depth = wrap[0];\n\
  var prefix = wrap[1];\n\
  var suffix = wrap[2];\n\
  var el = document.createElement('div');\n\
  el.innerHTML = prefix + html + suffix;\n\
  while (depth--) el = el.lastChild;\n\
\n\
  var els = el.children;\n\
  if (1 == els.length) {\n\
    return el.removeChild(els[0]);\n\
  }\n\
\n\
  var fragment = document.createDocumentFragment();\n\
  while (els.length) {\n\
    fragment.appendChild(el.removeChild(els[0]));\n\
  }\n\
\n\
  return fragment;\n\
}\n\
//@ sourceURL=component-domify/index.js"
));
require.register("component-indexof/index.js", Function("exports, require, module",
"module.exports = function(arr, obj){\n\
  if (arr.indexOf) return arr.indexOf(obj);\n\
  for (var i = 0; i < arr.length; ++i) {\n\
    if (arr[i] === obj) return i;\n\
  }\n\
  return -1;\n\
};//@ sourceURL=component-indexof/index.js"
));
require.register("component-classes/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var index = require('indexof');\n\
\n\
/**\n\
 * Whitespace regexp.\n\
 */\n\
\n\
var re = /\\s+/;\n\
\n\
/**\n\
 * toString reference.\n\
 */\n\
\n\
var toString = Object.prototype.toString;\n\
\n\
/**\n\
 * Wrap `el` in a `ClassList`.\n\
 *\n\
 * @param {Element} el\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(el){\n\
  return new ClassList(el);\n\
};\n\
\n\
/**\n\
 * Initialize a new ClassList for `el`.\n\
 *\n\
 * @param {Element} el\n\
 * @api private\n\
 */\n\
\n\
function ClassList(el) {\n\
  this.el = el;\n\
  this.list = el.classList;\n\
}\n\
\n\
/**\n\
 * Add class `name` if not already present.\n\
 *\n\
 * @param {String} name\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.add = function(name){\n\
  // classList\n\
  if (this.list) {\n\
    this.list.add(name);\n\
    return this;\n\
  }\n\
\n\
  // fallback\n\
  var arr = this.array();\n\
  var i = index(arr, name);\n\
  if (!~i) arr.push(name);\n\
  this.el.className = arr.join(' ');\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove class `name` when present, or\n\
 * pass a regular expression to remove\n\
 * any which match.\n\
 *\n\
 * @param {String|RegExp} name\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.remove = function(name){\n\
  if ('[object RegExp]' == toString.call(name)) {\n\
    return this.removeMatching(name);\n\
  }\n\
\n\
  // classList\n\
  if (this.list) {\n\
    this.list.remove(name);\n\
    return this;\n\
  }\n\
\n\
  // fallback\n\
  var arr = this.array();\n\
  var i = index(arr, name);\n\
  if (~i) arr.splice(i, 1);\n\
  this.el.className = arr.join(' ');\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove all classes matching `re`.\n\
 *\n\
 * @param {RegExp} re\n\
 * @return {ClassList}\n\
 * @api private\n\
 */\n\
\n\
ClassList.prototype.removeMatching = function(re){\n\
  var arr = this.array();\n\
  for (var i = 0; i < arr.length; i++) {\n\
    if (re.test(arr[i])) {\n\
      this.remove(arr[i]);\n\
    }\n\
  }\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Toggle class `name`.\n\
 *\n\
 * @param {String} name\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.toggle = function(name){\n\
  // classList\n\
  if (this.list) {\n\
    this.list.toggle(name);\n\
    return this;\n\
  }\n\
\n\
  // fallback\n\
  if (this.has(name)) {\n\
    this.remove(name);\n\
  } else {\n\
    this.add(name);\n\
  }\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Return an array of classes.\n\
 *\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.array = function(){\n\
  var str = this.el.className.replace(/^\\s+|\\s+$/g, '');\n\
  var arr = str.split(re);\n\
  if ('' === arr[0]) arr.shift();\n\
  return arr;\n\
};\n\
\n\
/**\n\
 * Check if class `name` is present.\n\
 *\n\
 * @param {String} name\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.has =\n\
ClassList.prototype.contains = function(name){\n\
  return this.list\n\
    ? this.list.contains(name)\n\
    : !! ~index(this.array(), name);\n\
};\n\
//@ sourceURL=component-classes/index.js"
));
require.register("visionmedia-debug/index.js", Function("exports, require, module",
"if ('undefined' == typeof window) {\n\
  module.exports = require('./lib/debug');\n\
} else {\n\
  module.exports = require('./debug');\n\
}\n\
//@ sourceURL=visionmedia-debug/index.js"
));
require.register("visionmedia-debug/debug.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `debug()` as the module.\n\
 */\n\
\n\
module.exports = debug;\n\
\n\
/**\n\
 * Create a debugger with the given `name`.\n\
 *\n\
 * @param {String} name\n\
 * @return {Type}\n\
 * @api public\n\
 */\n\
\n\
function debug(name) {\n\
  if (!debug.enabled(name)) return function(){};\n\
\n\
  return function(fmt){\n\
    fmt = coerce(fmt);\n\
\n\
    var curr = new Date;\n\
    var ms = curr - (debug[name] || curr);\n\
    debug[name] = curr;\n\
\n\
    fmt = name\n\
      + ' '\n\
      + fmt\n\
      + ' +' + debug.humanize(ms);\n\
\n\
    // This hackery is required for IE8\n\
    // where `console.log` doesn't have 'apply'\n\
    window.console\n\
      && console.log\n\
      && Function.prototype.apply.call(console.log, console, arguments);\n\
  }\n\
}\n\
\n\
/**\n\
 * The currently active debug mode names.\n\
 */\n\
\n\
debug.names = [];\n\
debug.skips = [];\n\
\n\
/**\n\
 * Enables a debug mode by name. This can include modes\n\
 * separated by a colon and wildcards.\n\
 *\n\
 * @param {String} name\n\
 * @api public\n\
 */\n\
\n\
debug.enable = function(name) {\n\
  try {\n\
    localStorage.debug = name;\n\
  } catch(e){}\n\
\n\
  var split = (name || '').split(/[\\s,]+/)\n\
    , len = split.length;\n\
\n\
  for (var i = 0; i < len; i++) {\n\
    name = split[i].replace('*', '.*?');\n\
    if (name[0] === '-') {\n\
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));\n\
    }\n\
    else {\n\
      debug.names.push(new RegExp('^' + name + '$'));\n\
    }\n\
  }\n\
};\n\
\n\
/**\n\
 * Disable debug output.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
debug.disable = function(){\n\
  debug.enable('');\n\
};\n\
\n\
/**\n\
 * Humanize the given `ms`.\n\
 *\n\
 * @param {Number} m\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
debug.humanize = function(ms) {\n\
  var sec = 1000\n\
    , min = 60 * 1000\n\
    , hour = 60 * min;\n\
\n\
  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';\n\
  if (ms >= min) return (ms / min).toFixed(1) + 'm';\n\
  if (ms >= sec) return (ms / sec | 0) + 's';\n\
  return ms + 'ms';\n\
};\n\
\n\
/**\n\
 * Returns true if the given mode name is enabled, false otherwise.\n\
 *\n\
 * @param {String} name\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
debug.enabled = function(name) {\n\
  for (var i = 0, len = debug.skips.length; i < len; i++) {\n\
    if (debug.skips[i].test(name)) {\n\
      return false;\n\
    }\n\
  }\n\
  for (var i = 0, len = debug.names.length; i < len; i++) {\n\
    if (debug.names[i].test(name)) {\n\
      return true;\n\
    }\n\
  }\n\
  return false;\n\
};\n\
\n\
/**\n\
 * Coerce `val`.\n\
 */\n\
\n\
function coerce(val) {\n\
  if (val instanceof Error) return val.stack || val.message;\n\
  return val;\n\
}\n\
\n\
// persist\n\
\n\
try {\n\
  if (window.localStorage) debug.enable(localStorage.debug);\n\
} catch(e){}\n\
//@ sourceURL=visionmedia-debug/debug.js"
));
require.register("ianstormtaylor-to-no-case/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `toNoCase`.\n\
 */\n\
\n\
module.exports = toNoCase;\n\
\n\
\n\
/**\n\
 * Test whether a string is camel-case.\n\
 */\n\
\n\
var hasSpace = /\\s/;\n\
var hasCamel = /[a-z][A-Z]/;\n\
var hasSeparator = /[\\W_]/;\n\
\n\
\n\
/**\n\
 * Remove any starting case from a `string`, like camel or snake, but keep\n\
 * spaces and punctuation that may be important otherwise.\n\
 *\n\
 * @param {String} string\n\
 * @return {String}\n\
 */\n\
\n\
function toNoCase (string) {\n\
  if (hasSpace.test(string)) return string.toLowerCase();\n\
\n\
  if (hasSeparator.test(string)) string = unseparate(string);\n\
  if (hasCamel.test(string)) string = uncamelize(string);\n\
  return string.toLowerCase();\n\
}\n\
\n\
\n\
/**\n\
 * Separator splitter.\n\
 */\n\
\n\
var separatorSplitter = /[\\W_]+(.|$)/g;\n\
\n\
\n\
/**\n\
 * Un-separate a `string`.\n\
 *\n\
 * @param {String} string\n\
 * @return {String}\n\
 */\n\
\n\
function unseparate (string) {\n\
  return string.replace(separatorSplitter, function (m, next) {\n\
    return next ? ' ' + next : '';\n\
  });\n\
}\n\
\n\
\n\
/**\n\
 * Camelcase splitter.\n\
 */\n\
\n\
var camelSplitter = /(.)([A-Z]+)/g;\n\
\n\
\n\
/**\n\
 * Un-camelcase a `string`.\n\
 *\n\
 * @param {String} string\n\
 * @return {String}\n\
 */\n\
\n\
function uncamelize (string) {\n\
  return string.replace(camelSplitter, function (m, previous, uppers) {\n\
    return previous + ' ' + uppers.toLowerCase().split('').join(' ');\n\
  });\n\
}//@ sourceURL=ianstormtaylor-to-no-case/index.js"
));
require.register("ianstormtaylor-to-space-case/index.js", Function("exports, require, module",
"\n\
var clean = require('to-no-case');\n\
\n\
\n\
/**\n\
 * Expose `toSpaceCase`.\n\
 */\n\
\n\
module.exports = toSpaceCase;\n\
\n\
\n\
/**\n\
 * Convert a `string` to space case.\n\
 *\n\
 * @param {String} string\n\
 * @return {String}\n\
 */\n\
\n\
\n\
function toSpaceCase (string) {\n\
  return clean(string).replace(/[\\W_]+(.|$)/g, function (matches, match) {\n\
    return match ? ' ' + match : '';\n\
  });\n\
}//@ sourceURL=ianstormtaylor-to-space-case/index.js"
));
require.register("ianstormtaylor-to-camel-case/index.js", Function("exports, require, module",
"\n\
var toSpace = require('to-space-case');\n\
\n\
\n\
/**\n\
 * Expose `toCamelCase`.\n\
 */\n\
\n\
module.exports = toCamelCase;\n\
\n\
\n\
/**\n\
 * Convert a `string` to camel case.\n\
 *\n\
 * @param {String} string\n\
 * @return {String}\n\
 */\n\
\n\
\n\
function toCamelCase (string) {\n\
  return toSpace(string).replace(/\\s(\\w)/g, function (matches, letter) {\n\
    return letter.toUpperCase();\n\
  });\n\
}//@ sourceURL=ianstormtaylor-to-camel-case/index.js"
));
require.register("component-within-document/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Check if `el` is within the document.\n\
 *\n\
 * @param {Element} el\n\
 * @return {Boolean}\n\
 * @api private\n\
 */\n\
\n\
module.exports = function(el) {\n\
  var node = el;\n\
  while (node = node.parentNode) {\n\
    if (node == document) return true;\n\
  }\n\
  return false;\n\
};//@ sourceURL=component-within-document/index.js"
));
require.register("component-css/index.js", Function("exports, require, module",
"/**\n\
 * Module Dependencies\n\
 */\n\
\n\
var debug = require('debug')('css');\n\
var set = require('./lib/style');\n\
var get = require('./lib/css');\n\
\n\
/**\n\
 * Expose `css`\n\
 */\n\
\n\
module.exports = css;\n\
\n\
/**\n\
 * Get and set css values\n\
 *\n\
 * @param {Element} el\n\
 * @param {String|Object} prop\n\
 * @param {Mixed} val\n\
 * @return {Element} el\n\
 * @api public\n\
 */\n\
\n\
function css(el, prop, val) {\n\
  if (!el) return;\n\
\n\
  if (undefined !== val) {\n\
    var obj = {};\n\
    obj[prop] = val;\n\
    debug('setting styles %j', obj);\n\
    return setStyles(el, obj);\n\
  }\n\
\n\
  if ('object' == typeof prop) {\n\
    debug('setting styles %j', prop);\n\
    return setStyles(el, prop);\n\
  }\n\
\n\
  debug('getting %s', prop);\n\
  return get(el, prop);\n\
}\n\
\n\
/**\n\
 * Set the styles on an element\n\
 *\n\
 * @param {Element} el\n\
 * @param {Object} props\n\
 * @return {Element} el\n\
 */\n\
\n\
function setStyles(el, props) {\n\
  for (var prop in props) {\n\
    set(el, prop, props[prop]);\n\
  }\n\
\n\
  return el;\n\
}\n\
//@ sourceURL=component-css/index.js"
));
require.register("component-css/lib/css.js", Function("exports, require, module",
"/**\n\
 * Module Dependencies\n\
 */\n\
\n\
var debug = require('debug')('css:css');\n\
var camelcase = require('to-camel-case');\n\
var computed = require('./computed');\n\
var property = require('./prop');\n\
\n\
/**\n\
 * Expose `css`\n\
 */\n\
\n\
module.exports = css;\n\
\n\
/**\n\
 * CSS Normal Transforms\n\
 */\n\
\n\
var cssNormalTransform = {\n\
  letterSpacing: 0,\n\
  fontWeight: 400\n\
};\n\
\n\
/**\n\
 * Get a CSS value\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} prop\n\
 * @param {Mixed} extra\n\
 * @param {Array} styles\n\
 * @return {String}\n\
 */\n\
\n\
function css(el, prop, extra, styles) {\n\
  var hooks = require('./hooks');\n\
  var orig = camelcase(prop);\n\
  var style = el.style;\n\
  var val;\n\
\n\
  prop = property(prop, style);\n\
  var hook = hooks[prop] || hooks[orig];\n\
\n\
  // If a hook was provided get the computed value from there\n\
  if (hook && hook.get) {\n\
    debug('get hook provided. use that');\n\
    val = hook.get(el, true, extra);\n\
  }\n\
\n\
  // Otherwise, if a way to get the computed value exists, use that\n\
  if (undefined == val) {\n\
    debug('fetch the computed value of %s', prop);\n\
    val = computed(el, prop);\n\
  }\n\
\n\
  if ('normal' == val && cssNormalTransform[prop]) {\n\
    val = cssNormalTransform[prop];\n\
    debug('normal => %s', val);\n\
  }\n\
\n\
  // Return, converting to number if forced or a qualifier was provided and val looks numeric\n\
  if ('' == extra || extra) {\n\
    debug('converting value: %s into a number');\n\
    var num = parseFloat(val);\n\
    return true === extra || isNumeric(num) ? num || 0 : val;\n\
  }\n\
\n\
  return val;\n\
}\n\
\n\
/**\n\
 * Is Numeric\n\
 *\n\
 * @param {Mixed} obj\n\
 * @return {Boolean}\n\
 */\n\
\n\
function isNumeric(obj) {\n\
  return !isNan(parseFloat(obj)) && isFinite(obj);\n\
}\n\
//@ sourceURL=component-css/lib/css.js"
));
require.register("component-css/lib/prop.js", Function("exports, require, module",
"/**\n\
 * Module dependencies\n\
 */\n\
\n\
var debug = require('debug')('css:prop');\n\
var camelcase = require('to-camel-case');\n\
var vendor = require('./vendor');\n\
\n\
/**\n\
 * Export `prop`\n\
 */\n\
\n\
module.exports = prop;\n\
\n\
/**\n\
 * Normalize Properties\n\
 */\n\
\n\
var cssProps = {\n\
  'float': 'cssFloat' in document.body.style ? 'cssFloat' : 'styleFloat'\n\
};\n\
\n\
/**\n\
 * Get the vendor prefixed property\n\
 *\n\
 * @param {String} prop\n\
 * @param {String} style\n\
 * @return {String} prop\n\
 * @api private\n\
 */\n\
\n\
function prop(prop, style) {\n\
  prop = cssProps[prop] || (cssProps[prop] = vendor(prop, style));\n\
  debug('transform property: %s => %s');\n\
  return prop;\n\
}\n\
//@ sourceURL=component-css/lib/prop.js"
));
require.register("component-css/lib/swap.js", Function("exports, require, module",
"/**\n\
 * Export `swap`\n\
 */\n\
\n\
module.exports = swap;\n\
\n\
/**\n\
 * Initialize `swap`\n\
 *\n\
 * @param {Element} el\n\
 * @param {Object} options\n\
 * @param {Function} fn\n\
 * @param {Array} args\n\
 * @return {Mixed}\n\
 */\n\
\n\
function swap(el, options, fn, args) {\n\
  // Remember the old values, and insert the new ones\n\
  for (var key in options) {\n\
    old[key] = el.style[key];\n\
    el.style[key] = options[key];\n\
  }\n\
\n\
  ret = fn.apply(el, args || []);\n\
\n\
  // Revert the old values\n\
  for (key in options) {\n\
    el.style[key] = old[key];\n\
  }\n\
\n\
  return ret;\n\
}\n\
//@ sourceURL=component-css/lib/swap.js"
));
require.register("component-css/lib/style.js", Function("exports, require, module",
"/**\n\
 * Module Dependencies\n\
 */\n\
\n\
var debug = require('debug')('css:style');\n\
var camelcase = require('to-camel-case');\n\
var support = require('./support');\n\
var property = require('./prop');\n\
var hooks = require('./hooks');\n\
\n\
/**\n\
 * Expose `style`\n\
 */\n\
\n\
module.exports = style;\n\
\n\
/**\n\
 * Possibly-unitless properties\n\
 *\n\
 * Don't automatically add 'px' to these properties\n\
 */\n\
\n\
var cssNumber = {\n\
  \"columnCount\": true,\n\
  \"fillOpacity\": true,\n\
  \"fontWeight\": true,\n\
  \"lineHeight\": true,\n\
  \"opacity\": true,\n\
  \"order\": true,\n\
  \"orphans\": true,\n\
  \"widows\": true,\n\
  \"zIndex\": true,\n\
  \"zoom\": true\n\
};\n\
\n\
/**\n\
 * Set a css value\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} prop\n\
 * @param {Mixed} val\n\
 * @param {Mixed} extra\n\
 */\n\
\n\
function style(el, prop, val, extra) {\n\
  // Don't set styles on text and comment nodes\n\
  if (!el || el.nodeType === 3 || el.nodeType === 8 || !el.style ) return;\n\
\n\
  var orig = camelcase(prop);\n\
  var style = el.style;\n\
  var type = typeof val;\n\
\n\
  if (!val) return get(el, prop, orig, extra);\n\
\n\
  prop = property(prop, style);\n\
\n\
  var hook = hooks[prop] || hooks[orig];\n\
\n\
  // If a number was passed in, add 'px' to the (except for certain CSS properties)\n\
  if ('number' == type && !cssNumber[orig]) {\n\
    debug('adding \"px\" to end of number');\n\
    val += 'px';\n\
  }\n\
\n\
  // Fixes jQuery #8908, it can be done more correctly by specifying setters in cssHooks,\n\
  // but it would mean to define eight (for every problematic property) identical functions\n\
  if (!support.clearCloneStyle && '' === val && 0 === prop.indexOf('background')) {\n\
    debug('set property (%s) value to \"inherit\"', prop);\n\
    style[prop] = 'inherit';\n\
  }\n\
\n\
  // If a hook was provided, use that value, otherwise just set the specified value\n\
  if (!hook || !hook.set || undefined !== (val = hook.set(el, val, extra))) {\n\
    // Support: Chrome, Safari\n\
    // Setting style to blank string required to delete \"style: x !important;\"\n\
    debug('set hook defined. setting property (%s) to %s', prop, val);\n\
    style[prop] = '';\n\
    style[prop] = val;\n\
  }\n\
\n\
}\n\
\n\
/**\n\
 * Get the style\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} prop\n\
 * @param {String} orig\n\
 * @param {Mixed} extra\n\
 * @return {String}\n\
 */\n\
\n\
function get(el, prop, orig, extra) {\n\
  var style = el.style;\n\
  var hook = hooks[prop] || hooks[orig];\n\
  var ret;\n\
\n\
  if (hook && hook.get && undefined !== (ret = hook.get(el, false, extra))) {\n\
    debug('get hook defined, returning: %s', ret);\n\
    return ret;\n\
  }\n\
\n\
  ret = style[prop];\n\
  debug('getting %s', ret);\n\
  return ret;\n\
}\n\
//@ sourceURL=component-css/lib/style.js"
));
require.register("component-css/lib/hooks.js", Function("exports, require, module",
"/**\n\
 * Module Dependencies\n\
 */\n\
\n\
var each = require('each');\n\
var css = require('./css');\n\
var cssShow = { position: 'absolute', visibility: 'hidden', display: 'block' };\n\
var pnum = (/[+-]?(?:\\d*\\.|)\\d+(?:[eE][+-]?\\d+|)/).source;\n\
var rnumnonpx = new RegExp( '^(' + pnum + ')(?!px)[a-z%]+$', 'i');\n\
var rnumsplit = new RegExp( '^(' + pnum + ')(.*)$', 'i');\n\
var rdisplayswap = /^(none|table(?!-c[ea]).+)/;\n\
var styles = require('./styles');\n\
var support = require('./support');\n\
var swap = require('./swap');\n\
var computed = require('./computed');\n\
var cssExpand = [ \"Top\", \"Right\", \"Bottom\", \"Left\" ];\n\
\n\
/**\n\
 * Height & Width\n\
 */\n\
\n\
each(['width', 'height'], function(name) {\n\
  exports[name] = {};\n\
\n\
  exports[name].get = function(el, compute, extra) {\n\
    if (!compute) return;\n\
    // certain elements can have dimension info if we invisibly show them\n\
    // however, it must have a current display style that would benefit from this\n\
    return 0 == el.offsetWidth && rdisplayswap.test(css(el, 'display'))\n\
      ? swap(el, cssShow, function() { return getWidthOrHeight(el, name, extra); })\n\
      : getWidthOrHeight(el, name, extra);\n\
  }\n\
\n\
  exports[name].set = function(el, val, extra) {\n\
    var styles = extra && styles(el);\n\
    return setPositiveNumber(el, val, extra\n\
      ? augmentWidthOrHeight(el, name, extra, 'border-box' == css(el, 'boxSizing', false, styles), styles)\n\
      : 0\n\
    );\n\
  };\n\
\n\
});\n\
\n\
/**\n\
 * Opacity\n\
 */\n\
\n\
exports.opacity = {};\n\
exports.opacity.get = function(el, compute) {\n\
  if (!compute) return;\n\
  var ret = computed(el, 'opacity');\n\
  return '' == ret ? '1' : ret;\n\
}\n\
\n\
/**\n\
 * Utility: Set Positive Number\n\
 *\n\
 * @param {Element} el\n\
 * @param {Mixed} val\n\
 * @param {Number} subtract\n\
 * @return {Number}\n\
 */\n\
\n\
function setPositiveNumber(el, val, subtract) {\n\
  var matches = rnumsplit.exec(val);\n\
  return matches ?\n\
    // Guard against undefined 'subtract', e.g., when used as in cssHooks\n\
    Math.max(0, matches[1]) + (matches[2] || 'px') :\n\
    val;\n\
}\n\
\n\
/**\n\
 * Utility: Get the width or height\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} prop\n\
 * @param {Mixed} extra\n\
 * @return {String}\n\
 */\n\
\n\
function getWidthOrHeight(el, prop, extra) {\n\
  // Start with offset property, which is equivalent to the border-box value\n\
  var valueIsBorderBox = true;\n\
  var val = prop === 'width' ? el.offsetWidth : el.offsetHeight;\n\
  var styles = computed(el);\n\
  var isBorderBox = support.boxSizing && css(el, 'boxSizing') === 'border-box';\n\
\n\
  // some non-html elements return undefined for offsetWidth, so check for null/undefined\n\
  // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285\n\
  // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668\n\
  if (val <= 0 || val == null) {\n\
    // Fall back to computed then uncomputed css if necessary\n\
    val = computed(el, prop, styles);\n\
\n\
    if (val < 0 || val == null) {\n\
      val = el.style[prop];\n\
    }\n\
\n\
    // Computed unit is not pixels. Stop here and return.\n\
    if (rnumnonpx.test(val)) {\n\
      return val;\n\
    }\n\
\n\
    // we need the check for style in case a browser which returns unreliable values\n\
    // for getComputedStyle silently falls back to the reliable el.style\n\
    valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === el.style[prop]);\n\
\n\
    // Normalize ', auto, and prepare for extra\n\
    val = parseFloat(val) || 0;\n\
  }\n\
\n\
  // use the active box-sizing model to add/subtract irrelevant styles\n\
  extra = extra || (isBorderBox ? 'border' : 'content');\n\
  val += augmentWidthOrHeight(el, prop, extra, valueIsBorderBox, styles);\n\
  return val + 'px';\n\
}\n\
\n\
/**\n\
 * Utility: Augment the width or the height\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} prop\n\
 * @param {Mixed} extra\n\
 * @param {Boolean} isBorderBox\n\
 * @param {Array} styles\n\
 */\n\
\n\
function augmentWidthOrHeight(el, prop, extra, isBorderBox, styles) {\n\
  // If we already have the right measurement, avoid augmentation,\n\
  // Otherwise initialize for horizontal or vertical properties\n\
  var i = extra === (isBorderBox ? 'border' : 'content') ? 4 : 'width' == prop ? 1 : 0;\n\
  var val = 0;\n\
\n\
  for (; i < 4; i += 2) {\n\
    // both box models exclude margin, so add it if we want it\n\
    if (extra === 'margin') {\n\
      val += css(el, extra + cssExpand[i], true, styles);\n\
    }\n\
\n\
    if (isBorderBox) {\n\
      // border-box includes padding, so remove it if we want content\n\
      if (extra === 'content') {\n\
        val -= css(el, 'padding' + cssExpand[i], true, styles);\n\
      }\n\
\n\
      // at this point, extra isn't border nor margin, so remove border\n\
      if (extra !== 'margin') {\n\
        val -= css(el, 'border' + cssExpand[i] + 'Width', true, styles);\n\
      }\n\
    } else {\n\
      // at this point, extra isn't content, so add padding\n\
      val += css(el, 'padding' + cssExpand[i], true, styles);\n\
\n\
      // at this point, extra isn't content nor padding, so add border\n\
      if (extra !== 'padding') {\n\
        val += css(el, 'border' + cssExpand[i] + 'Width', true, styles);\n\
      }\n\
    }\n\
  }\n\
\n\
  return val;\n\
}\n\
//@ sourceURL=component-css/lib/hooks.js"
));
require.register("component-css/lib/styles.js", Function("exports, require, module",
"/**\n\
 * Expose `styles`\n\
 */\n\
\n\
module.exports = styles;\n\
\n\
/**\n\
 * Get all the styles\n\
 *\n\
 * @param {Element} el\n\
 * @return {Array}\n\
 */\n\
\n\
function styles(el) {\n\
  if (window.getComputedStyle) {\n\
    return el.ownerDocument.defaultView.getComputedStyle(el, null);\n\
  } else {\n\
    return el.currentStyle;\n\
  }\n\
}\n\
//@ sourceURL=component-css/lib/styles.js"
));
require.register("component-css/lib/vendor.js", Function("exports, require, module",
"/**\n\
 * Module Dependencies\n\
 */\n\
\n\
var prefixes = ['Webkit', 'O', 'Moz', 'ms'];\n\
\n\
/**\n\
 * Expose `vendor`\n\
 */\n\
\n\
module.exports = vendor;\n\
\n\
/**\n\
 * Get the vendor prefix for a given property\n\
 *\n\
 * @param {String} prop\n\
 * @param {Object} style\n\
 * @return {String}\n\
 */\n\
\n\
function vendor(prop, style) {\n\
  // shortcut for names that are not vendor prefixed\n\
  if (style[prop]) return prop;\n\
\n\
  // check for vendor prefixed names\n\
  var capName = prop[0].toUpperCase() + prop.slice(1);\n\
  var original = prop;\n\
  var i = prefixes.length;\n\
\n\
  while (i--) {\n\
    prop = prefixes[i] + capName;\n\
    if (prop in style) return prop;\n\
  }\n\
\n\
  return original;\n\
}\n\
//@ sourceURL=component-css/lib/vendor.js"
));
require.register("component-css/lib/support.js", Function("exports, require, module",
"/**\n\
 * Support values\n\
 */\n\
\n\
var reliableMarginRight;\n\
var boxSizingReliableVal;\n\
var pixelPositionVal;\n\
var clearCloneStyle;\n\
\n\
/**\n\
 * Container setup\n\
 */\n\
\n\
var docElem = document.documentElement;\n\
var container = document.createElement('div');\n\
var div = document.createElement('div');\n\
\n\
/**\n\
 * Clear clone style\n\
 */\n\
\n\
div.style.backgroundClip = 'content-box';\n\
div.cloneNode(true).style.backgroundClip = '';\n\
exports.clearCloneStyle = div.style.backgroundClip === 'content-box';\n\
\n\
container.style.cssText = 'border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px';\n\
container.appendChild(div);\n\
\n\
/**\n\
 * Pixel position\n\
 *\n\
 * Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084\n\
 * getComputedStyle returns percent when specified for top/left/bottom/right\n\
 * rather than make the css module depend on the offset module, we just check for it here\n\
 */\n\
\n\
exports.pixelPosition = function() {\n\
  if (undefined == pixelPositionVal) computePixelPositionAndBoxSizingReliable();\n\
  return pixelPositionVal;\n\
}\n\
\n\
/**\n\
 * Reliable box sizing\n\
 */\n\
\n\
exports.boxSizingReliable = function() {\n\
  if (undefined == boxSizingReliableVal) computePixelPositionAndBoxSizingReliable();\n\
  return boxSizingReliableVal;\n\
}\n\
\n\
/**\n\
 * Reliable margin right\n\
 *\n\
 * Support: Android 2.3\n\
 * Check if div with explicit width and no margin-right incorrectly\n\
 * gets computed margin-right based on width of container. (#3333)\n\
 * WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right\n\
 * This support function is only executed once so no memoizing is needed.\n\
 *\n\
 * @return {Boolean}\n\
 */\n\
\n\
exports.reliableMarginRight = function() {\n\
  var ret;\n\
  var marginDiv = div.appendChild(document.createElement(\"div\" ));\n\
\n\
  marginDiv.style.cssText = div.style.cssText = divReset;\n\
  marginDiv.style.marginRight = marginDiv.style.width = \"0\";\n\
  div.style.width = \"1px\";\n\
  docElem.appendChild(container);\n\
\n\
  ret = !parseFloat(window.getComputedStyle(marginDiv, null).marginRight);\n\
\n\
  docElem.removeChild(container);\n\
\n\
  // Clean up the div for other support tests.\n\
  div.innerHTML = \"\";\n\
\n\
  return ret;\n\
}\n\
\n\
/**\n\
 * Executing both pixelPosition & boxSizingReliable tests require only one layout\n\
 * so they're executed at the same time to save the second computation.\n\
 */\n\
\n\
function computePixelPositionAndBoxSizingReliable() {\n\
  // Support: Firefox, Android 2.3 (Prefixed box-sizing versions).\n\
  div.style.cssText = \"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;\" +\n\
    \"box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;\" +\n\
    \"position:absolute;top:1%\";\n\
  docElem.appendChild(container);\n\
\n\
  var divStyle = window.getComputedStyle(div, null);\n\
  pixelPositionVal = divStyle.top !== \"1%\";\n\
  boxSizingReliableVal = divStyle.width === \"4px\";\n\
\n\
  docElem.removeChild(container);\n\
}\n\
\n\
\n\
//@ sourceURL=component-css/lib/support.js"
));
require.register("component-css/lib/computed.js", Function("exports, require, module",
"/**\n\
 * Module Dependencies\n\
 */\n\
\n\
var debug = require('debug')('css:computed');\n\
var withinDocument = require('within-document');\n\
var styles = require('./styles');\n\
\n\
/**\n\
 * Expose `computed`\n\
 */\n\
\n\
module.exports = computed;\n\
\n\
/**\n\
 * Get the computed style\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} prop\n\
 * @param {Array} precomputed (optional)\n\
 * @return {Array}\n\
 * @api private\n\
 */\n\
\n\
function computed(el, prop, precomputed) {\n\
  var computed = precomputed || styles(el);\n\
  var ret;\n\
  \n\
  if (!computed) return;\n\
\n\
  if (computed.getPropertyValue) {\n\
    ret = computed.getPropertyValue(prop) || computed[prop];\n\
  } else {\n\
    ret = computed[prop];\n\
  }\n\
\n\
  if ('' === ret && !withinDocument(el)) {\n\
    debug('element not within document, try finding from style attribute');\n\
    var style = require('./style');\n\
    ret = style(el, prop);\n\
  }\n\
\n\
  debug('computed value of %s: %s', prop, ret);\n\
\n\
  // Support: IE\n\
  // IE returns zIndex value as an integer.\n\
  return undefined === ret ? ret : ret + '';\n\
}\n\
//@ sourceURL=component-css/lib/computed.js"
));
require.register("component-value/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var typeOf = require('type');\n\
\n\
/**\n\
 * Set or get `el`'s' value.\n\
 *\n\
 * @param {Element} el\n\
 * @param {Mixed} val\n\
 * @return {Mixed}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(el, val){\n\
  if (2 == arguments.length) return set(el, val);\n\
  return get(el);\n\
};\n\
\n\
/**\n\
 * Get `el`'s value.\n\
 */\n\
\n\
function get(el) {\n\
  switch (type(el)) {\n\
    case 'checkbox':\n\
    case 'radio':\n\
      if (el.checked) {\n\
        var attr = el.getAttribute('value');\n\
        return null == attr ? true : attr;\n\
      } else {\n\
        return false;\n\
      }\n\
    case 'radiogroup':\n\
      for (var i = 0, radio; radio = el[i]; i++) {\n\
        if (radio.checked) return radio.value;\n\
      }\n\
      break;\n\
    case 'select':\n\
      for (var i = 0, option; option = el.options[i]; i++) {\n\
        if (option.selected) return option.value;\n\
      }\n\
      break;\n\
    default:\n\
      return el.value;\n\
  }\n\
}\n\
\n\
/**\n\
 * Set `el`'s value.\n\
 */\n\
\n\
function set(el, val) {\n\
  switch (type(el)) {\n\
    case 'checkbox':\n\
    case 'radio':\n\
      if (val) {\n\
        el.checked = true;\n\
      } else {\n\
        el.checked = false;\n\
      }\n\
      break;\n\
    case 'radiogroup':\n\
      for (var i = 0, radio; radio = el[i]; i++) {\n\
        radio.checked = radio.value === val;\n\
      }\n\
      break;\n\
    case 'select':\n\
      for (var i = 0, option; option = el.options[i]; i++) {\n\
        option.selected = option.value === val;\n\
      }\n\
      break;\n\
    default:\n\
      el.value = val;\n\
  }\n\
}\n\
\n\
/**\n\
 * Element type.\n\
 */\n\
\n\
function type(el) {\n\
  var group = 'array' == typeOf(el) || 'object' == typeOf(el);\n\
  if (group) el = el[0];\n\
  var name = el.nodeName.toLowerCase();\n\
  var type = el.getAttribute('type');\n\
\n\
  if (group && type && 'radio' == type.toLowerCase()) return 'radiogroup';\n\
  if ('input' == name && type && 'checkbox' == type.toLowerCase()) return 'checkbox';\n\
  if ('input' == name && type && 'radio' == type.toLowerCase()) return 'radio';\n\
  if ('select' == name) return 'select';\n\
  return name;\n\
}\n\
//@ sourceURL=component-value/index.js"
));
require.register("component-query/index.js", Function("exports, require, module",
"\n\
function one(selector, el) {\n\
  return el.querySelector(selector);\n\
}\n\
\n\
exports = module.exports = function(selector, el){\n\
  el = el || document;\n\
  return one(selector, el);\n\
};\n\
\n\
exports.all = function(selector, el){\n\
  el = el || document;\n\
  return el.querySelectorAll(selector);\n\
};\n\
\n\
exports.engine = function(obj){\n\
  if (!obj.one) throw new Error('.one callback required');\n\
  if (!obj.all) throw new Error('.all callback required');\n\
  one = obj.one;\n\
  exports.all = obj.all;\n\
};\n\
//@ sourceURL=component-query/index.js"
));
require.register("component-matches-selector/index.js", Function("exports, require, module",
"/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var query = require('query');\n\
\n\
/**\n\
 * Element prototype.\n\
 */\n\
\n\
var proto = Element.prototype;\n\
\n\
/**\n\
 * Vendor function.\n\
 */\n\
\n\
var vendor = proto.matches\n\
  || proto.webkitMatchesSelector\n\
  || proto.mozMatchesSelector\n\
  || proto.msMatchesSelector\n\
  || proto.oMatchesSelector;\n\
\n\
/**\n\
 * Expose `match()`.\n\
 */\n\
\n\
module.exports = match;\n\
\n\
/**\n\
 * Match `el` to `selector`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} selector\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
function match(el, selector) {\n\
  if (vendor) return vendor.call(el, selector);\n\
  var nodes = query.all(selector, el.parentNode);\n\
  for (var i = 0; i < nodes.length; ++i) {\n\
    if (nodes[i] == el) return true;\n\
  }\n\
  return false;\n\
}\n\
//@ sourceURL=component-matches-selector/index.js"
));
require.register("yields-traverse/index.js", Function("exports, require, module",
"\n\
/**\n\
 * dependencies\n\
 */\n\
\n\
var matches = require('matches-selector');\n\
\n\
/**\n\
 * Traverse with the given `el`, `selector` and `len`.\n\
 *\n\
 * @param {String} type\n\
 * @param {Element} el\n\
 * @param {String} selector\n\
 * @param {Number} len\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(type, el, selector, len){\n\
  var el = el[type]\n\
    , n = len || 1\n\
    , ret = [];\n\
\n\
  if (!el) return ret;\n\
\n\
  do {\n\
    if (n == ret.length) break;\n\
    if (1 != el.nodeType) continue;\n\
    if (matches(el, selector)) ret.push(el);\n\
    if (!selector) ret.push(el);\n\
  } while (el = el[type]);\n\
\n\
  return ret;\n\
}\n\
//@ sourceURL=yields-traverse/index.js"
));
require.register("component-trim/index.js", Function("exports, require, module",
"\n\
exports = module.exports = trim;\n\
\n\
function trim(str){\n\
  if (str.trim) return str.trim();\n\
  return str.replace(/^\\s*|\\s*$/g, '');\n\
}\n\
\n\
exports.left = function(str){\n\
  if (str.trimLeft) return str.trimLeft();\n\
  return str.replace(/^\\s*/, '');\n\
};\n\
\n\
exports.right = function(str){\n\
  if (str.trimRight) return str.trimRight();\n\
  return str.replace(/\\s*$/, '');\n\
};\n\
//@ sourceURL=component-trim/index.js"
));
require.register("yields-isarray/index.js", Function("exports, require, module",
"\n\
/**\n\
 * isArray\n\
 */\n\
\n\
var isArray = Array.isArray;\n\
\n\
/**\n\
 * toString\n\
 */\n\
\n\
var str = Object.prototype.toString;\n\
\n\
/**\n\
 * Wether or not the given `val`\n\
 * is an array.\n\
 *\n\
 * example:\n\
 *\n\
 *        isArray([]);\n\
 *        // > true\n\
 *        isArray(arguments);\n\
 *        // > false\n\
 *        isArray('');\n\
 *        // > false\n\
 *\n\
 * @param {mixed} val\n\
 * @return {bool}\n\
 */\n\
\n\
module.exports = isArray || function (val) {\n\
  return !! val && '[object Array]' == str.call(val);\n\
};\n\
//@ sourceURL=yields-isarray/index.js"
));
require.register("component-props/index.js", Function("exports, require, module",
"/**\n\
 * Global Names\n\
 */\n\
\n\
var globals = /\\b(Array|Date|Object|Math|JSON)\\b/g;\n\
\n\
/**\n\
 * Return immediate identifiers parsed from `str`.\n\
 *\n\
 * @param {String} str\n\
 * @param {String|Function} map function or prefix\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(str, fn){\n\
  var p = unique(props(str));\n\
  if (fn && 'string' == typeof fn) fn = prefixed(fn);\n\
  if (fn) return map(str, p, fn);\n\
  return p;\n\
};\n\
\n\
/**\n\
 * Return immediate identifiers in `str`.\n\
 *\n\
 * @param {String} str\n\
 * @return {Array}\n\
 * @api private\n\
 */\n\
\n\
function props(str) {\n\
  return str\n\
    .replace(/\\.\\w+|\\w+ *\\(|\"[^\"]*\"|'[^']*'|\\/([^/]+)\\//g, '')\n\
    .replace(globals, '')\n\
    .match(/[a-zA-Z_]\\w*/g)\n\
    || [];\n\
}\n\
\n\
/**\n\
 * Return `str` with `props` mapped with `fn`.\n\
 *\n\
 * @param {String} str\n\
 * @param {Array} props\n\
 * @param {Function} fn\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
function map(str, props, fn) {\n\
  var re = /\\.\\w+|\\w+ *\\(|\"[^\"]*\"|'[^']*'|\\/([^/]+)\\/|[a-zA-Z_]\\w*/g;\n\
  return str.replace(re, function(_){\n\
    if ('(' == _[_.length - 1]) return fn(_);\n\
    if (!~props.indexOf(_)) return _;\n\
    return fn(_);\n\
  });\n\
}\n\
\n\
/**\n\
 * Return unique array.\n\
 *\n\
 * @param {Array} arr\n\
 * @return {Array}\n\
 * @api private\n\
 */\n\
\n\
function unique(arr) {\n\
  var ret = [];\n\
\n\
  for (var i = 0; i < arr.length; i++) {\n\
    if (~ret.indexOf(arr[i])) continue;\n\
    ret.push(arr[i]);\n\
  }\n\
\n\
  return ret;\n\
}\n\
\n\
/**\n\
 * Map with prefix `str`.\n\
 */\n\
\n\
function prefixed(str) {\n\
  return function(_){\n\
    return str + _;\n\
  };\n\
}\n\
//@ sourceURL=component-props/index.js"
));
require.register("component-to-function/index.js", Function("exports, require, module",
"/**\n\
 * Module Dependencies\n\
 */\n\
\n\
try {\n\
  var expr = require('props');\n\
} catch(e) {\n\
  var expr = require('props-component');\n\
}\n\
\n\
/**\n\
 * Expose `toFunction()`.\n\
 */\n\
\n\
module.exports = toFunction;\n\
\n\
/**\n\
 * Convert `obj` to a `Function`.\n\
 *\n\
 * @param {Mixed} obj\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function toFunction(obj) {\n\
  switch ({}.toString.call(obj)) {\n\
    case '[object Object]':\n\
      return objectToFunction(obj);\n\
    case '[object Function]':\n\
      return obj;\n\
    case '[object String]':\n\
      return stringToFunction(obj);\n\
    case '[object RegExp]':\n\
      return regexpToFunction(obj);\n\
    default:\n\
      return defaultToFunction(obj);\n\
  }\n\
}\n\
\n\
/**\n\
 * Default to strict equality.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function defaultToFunction(val) {\n\
  return function(obj){\n\
    return val === obj;\n\
  }\n\
}\n\
\n\
/**\n\
 * Convert `re` to a function.\n\
 *\n\
 * @param {RegExp} re\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function regexpToFunction(re) {\n\
  return function(obj){\n\
    return re.test(obj);\n\
  }\n\
}\n\
\n\
/**\n\
 * Convert property `str` to a function.\n\
 *\n\
 * @param {String} str\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function stringToFunction(str) {\n\
  // immediate such as \"> 20\"\n\
  if (/^ *\\W+/.test(str)) return new Function('_', 'return _ ' + str);\n\
\n\
  // properties such as \"name.first\" or \"age > 18\" or \"age > 18 && age < 36\"\n\
  return new Function('_', 'return ' + get(str));\n\
}\n\
\n\
/**\n\
 * Convert `object` to a function.\n\
 *\n\
 * @param {Object} object\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function objectToFunction(obj) {\n\
  var match = {}\n\
  for (var key in obj) {\n\
    match[key] = typeof obj[key] === 'string'\n\
      ? defaultToFunction(obj[key])\n\
      : toFunction(obj[key])\n\
  }\n\
  return function(val){\n\
    if (typeof val !== 'object') return false;\n\
    for (var key in match) {\n\
      if (!(key in val)) return false;\n\
      if (!match[key](val[key])) return false;\n\
    }\n\
    return true;\n\
  }\n\
}\n\
\n\
/**\n\
 * Built the getter function. Supports getter style functions\n\
 *\n\
 * @param {String} str\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
function get(str) {\n\
  var props = expr(str);\n\
  if (!props.length) return '_.' + str;\n\
\n\
  var val;\n\
  for(var i = 0, prop; prop = props[i]; i++) {\n\
    val = '_.' + prop;\n\
    val = \"('function' == typeof \" + val + \" ? \" + val + \"() : \" + val + \")\";\n\
    str = str.replace(new RegExp(prop, 'g'), val);\n\
  }\n\
\n\
  return str;\n\
}\n\
//@ sourceURL=component-to-function/index.js"
));
require.register("matthewp-keys/index.js", Function("exports, require, module",
"module.exports = Object.keys || function(obj){\n\
  var keys = [];\n\
\n\
  for (var key in obj) {\n\
    if (obj.hasOwnProperty(key)) {\n\
      keys.push(key);\n\
    }\n\
  }\n\
\n\
  return keys;\n\
};//@ sourceURL=matthewp-keys/index.js"
));
require.register("matthewp-text/index.js", Function("exports, require, module",
"\n\
var text = 'innerText' in document.createElement('div')\n\
  ? 'innerText'\n\
  : 'textContent'\n\
\n\
module.exports = function (el, val) {\n\
  if (val == null) return el[text];\n\
  el[text] = val;\n\
};\n\
//@ sourceURL=matthewp-text/index.js"
));
require.register("component-dom/index.js", Function("exports, require, module",
"/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var isArray = require('isArray');\n\
var domify = require('domify');\n\
var each = require('each');\n\
var events = require('event');\n\
var getKeys = require('keys');\n\
var query = require('query');\n\
var trim = require('trim');\n\
var slice = [].slice;\n\
\n\
/**\n\
 * Attributes supported.\n\
 */\n\
\n\
var attrs = [\n\
  'id',\n\
  'src',\n\
  'rel',\n\
  'cols',\n\
  'rows',\n\
  'type',\n\
  'name',\n\
  'href',\n\
  'title',\n\
  'style',\n\
  'width',\n\
  'height',\n\
  'action',\n\
  'method',\n\
  'tabindex',\n\
  'placeholder'\n\
];\n\
\n\
/*\n\
 * A simple way to check for HTML strings or ID strings\n\
 */\n\
\n\
var quickExpr = /^(?:[^#<]*(<[\\w\\W]+>)[^>]*$|#([\\w\\-]*)$)/;\n\
\n\
/**\n\
 * Expose `dom()`.\n\
 */\n\
\n\
module.exports = dom;\n\
\n\
/**\n\
 * Return a dom `List` for the given\n\
 * `html`, selector, or element.\n\
 *\n\
 * @param {String|Element|List} selector\n\
 * @param {String|ELement|context} context\n\
 * @return {List}\n\
 * @api public\n\
 */\n\
\n\
function dom(selector, context) {\n\
  // array\n\
  if (isArray(selector)) {\n\
    return new List(selector);\n\
  }\n\
\n\
  // List\n\
  if (selector instanceof List) {\n\
    return selector;\n\
  }\n\
\n\
  // node\n\
  if (selector.nodeName) {\n\
    return new List([selector]);\n\
  }\n\
\n\
  if ('string' != typeof selector) {\n\
    throw new TypeError('invalid selector');\n\
  }\n\
\n\
  // html\n\
  var htmlselector = trim.left(selector);\n\
  if (isHTML(htmlselector)) {\n\
    return new List([domify(htmlselector)], htmlselector);\n\
  }\n\
\n\
  // selector\n\
  var ctx = context\n\
    ? (context instanceof List ? context[0] : context)\n\
    : document;\n\
\n\
  return new List(query.all(selector, ctx), selector);\n\
}\n\
\n\
/**\n\
 * Static: Expose `List`\n\
 */\n\
\n\
dom.List = List;\n\
\n\
/**\n\
 * Static: Expose supported attrs.\n\
 */\n\
\n\
dom.attrs = attrs;\n\
\n\
/**\n\
 * Static: Mixin a function\n\
 *\n\
 * @param {Object|String} name\n\
 * @param {Object|Function} obj\n\
 * @return {List} self\n\
 */\n\
\n\
dom.use = function(name, fn) {\n\
  var keys = [];\n\
  var tmp;\n\
\n\
  if (2 == arguments.length) {\n\
    keys.push(name);\n\
    tmp = {};\n\
    tmp[name] = fn;\n\
    fn = tmp;\n\
  } else if (name.name) {\n\
    // use function name\n\
    fn = name;\n\
    name = name.name;\n\
    keys.push(name);\n\
    tmp = {};\n\
    tmp[name] = fn;\n\
    fn = tmp;\n\
  } else {\n\
    keys = getKeys(name);\n\
    fn = name;\n\
  }\n\
\n\
  for(var i = 0, len = keys.length; i < len; i++) {\n\
    List.prototype[keys[i]] = fn[keys[i]];\n\
  }\n\
\n\
  return this;\n\
}\n\
\n\
/**\n\
 * Initialize a new `List` with the\n\
 * given array-ish of `els` and `selector`\n\
 * string.\n\
 *\n\
 * @param {Mixed} els\n\
 * @param {String} selector\n\
 * @api private\n\
 */\n\
\n\
function List(els, selector) {\n\
  els = els || [];\n\
  var len = this.length = els.length;\n\
  for(var i = 0; i < len; i++) this[i] = els[i];\n\
  this.selector = selector;\n\
}\n\
\n\
/**\n\
 * Remake the list\n\
 *\n\
 * @param {String|ELement|context} context\n\
 * @return {List}\n\
 * @api private\n\
 */\n\
\n\
List.prototype.dom = dom;\n\
\n\
/**\n\
 * Make `List` an array-like object\n\
 */\n\
\n\
List.prototype.length = 0;\n\
List.prototype.splice = Array.prototype.splice;\n\
\n\
/**\n\
 * Array-like object to array\n\
 *\n\
 * @return {Array}\n\
 */\n\
\n\
List.prototype.toArray = function() {\n\
  return slice.call(this);\n\
}\n\
\n\
/**\n\
 * Attribute accessors.\n\
 */\n\
\n\
each(attrs, function(name){\n\
  List.prototype[name] = function(val){\n\
    if (0 == arguments.length) return this.attr(name);\n\
    return this.attr(name, val);\n\
  };\n\
});\n\
\n\
/**\n\
 * Mixin the API\n\
 */\n\
\n\
dom.use(require('./lib/attributes'));\n\
dom.use(require('./lib/classes'));\n\
dom.use(require('./lib/events'));\n\
dom.use(require('./lib/manipulate'));\n\
dom.use(require('./lib/traverse'));\n\
\n\
/**\n\
 * Check if the string is HTML\n\
 *\n\
 * @param {String} str\n\
 * @return {Boolean}\n\
 * @api private\n\
 */\n\
\n\
function isHTML(str) {\n\
  // Faster than running regex, if str starts with `<` and ends with `>`, assume it's HTML\n\
  if (str.charAt(0) === '<' && str.charAt(str.length - 1) === '>' && str.length >= 3) return true;\n\
\n\
  // Run the regex\n\
  var match = quickExpr.exec(str);\n\
  return !!(match && match[1]);\n\
}\n\
//@ sourceURL=component-dom/index.js"
));
require.register("component-dom/lib/traverse.js", Function("exports, require, module",
"/**\n\
 * Module Dependencies\n\
 */\n\
\n\
var proto = Array.prototype;\n\
var each = require('each');\n\
var traverse = require('traverse');\n\
var toFunction = require('to-function');\n\
var matches = require('matches-selector');\n\
\n\
/**\n\
 * Find children matching the given `selector`.\n\
 *\n\
 * @param {String} selector\n\
 * @return {List}\n\
 * @api public\n\
 */\n\
\n\
exports.find = function(selector){\n\
  return this.dom(selector, this);\n\
};\n\
\n\
/**\n\
 * Check if the any element in the selection\n\
 * matches `selector`.\n\
 *\n\
 * @param {String} selector\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
exports.is = function(selector){\n\
  for(var i = 0, el; el = this[i]; i++) {\n\
    if (matches(el, selector)) return true;\n\
  }\n\
\n\
  return false;\n\
};\n\
\n\
/**\n\
 * Get parent(s) with optional `selector` and `limit`\n\
 *\n\
 * @param {String} selector\n\
 * @param {Number} limit\n\
 * @return {List}\n\
 * @api public\n\
 */\n\
\n\
exports.parent = function(selector, limit){\n\
  return this.dom(traverse('parentNode',\n\
    this[0],\n\
    selector,\n\
    limit\n\
    || 1));\n\
};\n\
\n\
/**\n\
 * Get next element(s) with optional `selector` and `limit`.\n\
 *\n\
 * @param {String} selector\n\
 * @param {Number} limit\n\
 * @retrun {List}\n\
 * @api public\n\
 */\n\
\n\
exports.next = function(selector, limit){\n\
  return this.dom(traverse('nextSibling',\n\
    this[0],\n\
    selector,\n\
    limit\n\
    || 1));\n\
};\n\
\n\
/**\n\
 * Get previous element(s) with optional `selector` and `limit`.\n\
 *\n\
 * @param {String} selector\n\
 * @param {Number} limit\n\
 * @return {List}\n\
 * @api public\n\
 */\n\
\n\
exports.prev =\n\
exports.previous = function(selector, limit){\n\
  return this.dom(traverse('previousSibling',\n\
    this[0],\n\
    selector,\n\
    limit\n\
    || 1));\n\
};\n\
\n\
/**\n\
 * Iterate over each element creating a new list with\n\
 * one item and invoking `fn(list, i)`.\n\
 *\n\
 * @param {Function} fn\n\
 * @return {List} self\n\
 * @api public\n\
 */\n\
\n\
exports.each = function(fn){\n\
  var dom = this.dom;\n\
\n\
  for (var i = 0, list, len = this.length; i < len; i++) {\n\
    list = dom(this[i]);\n\
    fn.call(list, list, i);\n\
  }\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Iterate over each element and invoke `fn(el, i)`\n\
 *\n\
 * @param {Function} fn\n\
 * @return {List} self\n\
 * @api public\n\
 */\n\
\n\
exports.forEach = function(fn) {\n\
  for (var i = 0, len = this.length; i < len; i++) {\n\
    fn.call(this[i], this[i], i);\n\
  }\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Map each return value from `fn(val, i)`.\n\
 *\n\
 * Passing a callback function:\n\
 *\n\
 *    inputs.map(function(input){\n\
 *      return input.type\n\
 *    })\n\
 *\n\
 * Passing a property string:\n\
 *\n\
 *    inputs.map('type')\n\
 *\n\
 * @param {Function} fn\n\
 * @return {List} self\n\
 * @api public\n\
 */\n\
\n\
exports.map = function(fn){\n\
  fn = toFunction(fn);\n\
  var dom = this.dom;\n\
  var out = [];\n\
\n\
  for (var i = 0, len = this.length; i < len; i++) {\n\
    out.push(fn.call(dom(this[i]), this[i], i));\n\
  }\n\
\n\
  return this.dom(out);\n\
};\n\
\n\
/**\n\
 * Select all values that return a truthy value of `fn(val, i)`.\n\
 *\n\
 *    inputs.select(function(input){\n\
 *      return input.type == 'password'\n\
 *    })\n\
 *\n\
 *  With a property:\n\
 *\n\
 *    inputs.select('type == password')\n\
 *\n\
 * @param {Function|String} fn\n\
 * @return {List} self\n\
 * @api public\n\
 */\n\
\n\
exports.filter =\n\
exports.select = function(fn){\n\
  fn = toFunction(fn);\n\
  var dom = this.dom;\n\
  var out = [];\n\
  var val;\n\
\n\
  for (var i = 0, len = this.length; i < len; i++) {\n\
    val = fn.call(dom(this[i]), this[i], i);\n\
    if (val) out.push(this[i]);\n\
  }\n\
\n\
  return this.dom(out);\n\
};\n\
\n\
/**\n\
 * Reject all values that return a truthy value of `fn(val, i)`.\n\
 *\n\
 * Rejecting using a callback:\n\
 *\n\
 *    input.reject(function(user){\n\
 *      return input.length < 20\n\
 *    })\n\
 *\n\
 * Rejecting with a property:\n\
 *\n\
 *    items.reject('password')\n\
 *\n\
 * Rejecting values via `==`:\n\
 *\n\
 *    data.reject(null)\n\
 *    input.reject(file)\n\
 *\n\
 * @param {Function|String|Mixed} fn\n\
 * @return {List}\n\
 * @api public\n\
 */\n\
\n\
exports.reject = function(fn){\n\
  var out = [];\n\
  var len = this.length;\n\
  var val, i;\n\
\n\
  if ('string' == typeof fn) fn = toFunction(fn);\n\
\n\
  if (fn) {\n\
    for (i = 0; i < len; i++) {\n\
      val = fn.call(dom(this[i]), this[i], i);\n\
      if (!val) out.push(this[i]);\n\
    }\n\
  } else {\n\
    for (i = 0; i < len; i++) {\n\
      if (this[i] != fn) out.push(this[i]);\n\
    }\n\
  }\n\
\n\
  return this.dom(out);\n\
};\n\
\n\
/**\n\
 * Return a `List` containing the element at `i`.\n\
 *\n\
 * @param {Number} i\n\
 * @return {List}\n\
 * @api public\n\
 */\n\
\n\
exports.at = function(i){\n\
  return this.dom(this[i]);\n\
};\n\
\n\
/**\n\
 * Return a `List` containing the first element.\n\
 *\n\
 * @param {Number} i\n\
 * @return {List}\n\
 * @api public\n\
 */\n\
\n\
exports.first = function(){\n\
  return this.dom(this[0]);\n\
};\n\
\n\
/**\n\
 * Return a `List` containing the last element.\n\
 *\n\
 * @param {Number} i\n\
 * @return {List}\n\
 * @api public\n\
 */\n\
\n\
exports.last = function(){\n\
  return this.dom(this[this.length - 1]);\n\
};\n\
\n\
/**\n\
 * Mixin the array functions\n\
 */\n\
\n\
each([\n\
  'push',\n\
  'pop',\n\
  'shift',\n\
  'splice',\n\
  'unshift',\n\
  'reverse',\n\
  'sort',\n\
  'toString',\n\
  'concat',\n\
  'join',\n\
  'slice'\n\
], function(method) {\n\
  exports[method] = function() {\n\
    return proto[method].apply(this.toArray(), arguments);\n\
  };\n\
});\n\
//@ sourceURL=component-dom/lib/traverse.js"
));
require.register("component-dom/lib/manipulate.js", Function("exports, require, module",
"/**\n\
 * Module Dependencies\n\
 */\n\
\n\
var value = require('value');\n\
var css = require('css');\n\
var text = require('text');\n\
\n\
/**\n\
 * Return element text.\n\
 *\n\
 * @param {String} str\n\
 * @return {String|List}\n\
 * @api public\n\
 */\n\
\n\
exports.text = function(str) {\n\
  if (1 == arguments.length) {\n\
    return this.forEach(function(el) {\n\
      if (11 == el.nodeType) {\n\
        var node;\n\
        while (node = el.firstChild) el.removeChild(node);\n\
        el.appendChild(document.createTextNode(str));\n\
      } else {\n\
        text(el, str);\n\
      }\n\
    });\n\
  }\n\
\n\
  var out = '';\n\
  this.forEach(function(el) {\n\
    if (11 == el.nodeType) {\n\
      out += getText(el.firstChild);\n\
    } else {\n\
      out += text(el);\n\
    }\n\
  });\n\
\n\
  return out;\n\
};\n\
\n\
/**\n\
 * Get text helper from Sizzle.\n\
 *\n\
 * Source: https://github.com/jquery/sizzle/blob/master/src/sizzle.js#L914-L947\n\
 *\n\
 * @param {Element|Array} el\n\
 * @return {String}\n\
 */\n\
\n\
function getText(el) {\n\
  var ret = '';\n\
  var type = el.nodeType;\n\
  var node;\n\
\n\
  switch(type) {\n\
    case 1:\n\
    case 9:\n\
      ret = text(el);\n\
      break;\n\
    case 11:\n\
      ret = el.textContent || el.innerText;\n\
      break;\n\
    case 3:\n\
    case 4:\n\
      return el.nodeValue;\n\
    default:\n\
      while (node = el[i++]) {\n\
        ret += getText(node);\n\
      }\n\
  }\n\
\n\
  return ret;\n\
}\n\
\n\
/**\n\
 * Return element html.\n\
 *\n\
 * @return {String} html\n\
 * @api public\n\
 */\n\
\n\
exports.html = function(html) {\n\
  if (1 == arguments.length) {\n\
    return this.forEach(function(el) {\n\
      el.innerHTML = html;\n\
    });\n\
  }\n\
\n\
  // TODO: real impl\n\
  return this[0] && this[0].innerHTML;\n\
};\n\
\n\
/**\n\
 * Get and set the css value\n\
 *\n\
 * @param {String|Object} prop\n\
 * @param {Mixed} val\n\
 * @return {Mixed}\n\
 * @api public\n\
 */\n\
\n\
exports.css = function(prop, val) {\n\
  // getter\n\
  if (!val && 'object' != typeof prop) {\n\
    return css(this[0], prop);\n\
  }\n\
  // setter\n\
  this.forEach(function(el) {\n\
    css(el, prop, val);\n\
  });\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Prepend `val`.\n\
 *\n\
 * From jQuery: if there is more than one target element\n\
 * cloned copies of the inserted element will be created\n\
 * for each target after the first.\n\
 *\n\
 * @param {String|Element|List} val\n\
 * @return {List} self\n\
 * @api public\n\
 */\n\
\n\
exports.prepend = function(val) {\n\
  var dom = this.dom;\n\
\n\
  this.forEach(function(target, i) {\n\
    dom(val).forEach(function(selector) {\n\
      selector = i ? selector.cloneNode(true) : selector;\n\
      if (target.children.length) {\n\
        target.insertBefore(selector, target.firstChild);\n\
      } else {\n\
        target.appendChild(selector);\n\
      }\n\
    });\n\
  });\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Append `val`.\n\
 *\n\
 * From jQuery: if there is more than one target element\n\
 * cloned copies of the inserted element will be created\n\
 * for each target after the first.\n\
 *\n\
 * @param {String|Element|List} val\n\
 * @return {List} self\n\
 * @api public\n\
 */\n\
\n\
exports.append = function(val) {\n\
  var dom = this.dom;\n\
\n\
  this.forEach(function(target, i) {\n\
    dom(val).forEach(function(el) {\n\
      el = i ? el.cloneNode(true) : el;\n\
      target.appendChild(el);\n\
    });\n\
  });\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Insert self's `els` after `val`\n\
 *\n\
 * From jQuery: if there is more than one target element,\n\
 * cloned copies of the inserted element will be created\n\
 * for each target after the first, and that new set\n\
 * (the original element plus clones) is returned.\n\
 *\n\
 * @param {String|Element|List} val\n\
 * @return {List} self\n\
 * @api public\n\
 */\n\
\n\
exports.insertAfter = function(val) {\n\
  var dom = this.dom;\n\
\n\
  this.forEach(function(el) {\n\
    dom(val).forEach(function(target, i) {\n\
      if (!target.parentNode) return;\n\
      el = i ? el.cloneNode(true) : el;\n\
      target.parentNode.insertBefore(el, target.nextSibling);\n\
    });\n\
  });\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Append self's `el` to `val`\n\
 *\n\
 * @param {String|Element|List} val\n\
 * @return {List} self\n\
 * @api public\n\
 */\n\
\n\
exports.appendTo = function(val) {\n\
  this.dom(val).append(this);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Replace elements in the DOM.\n\
 *\n\
 * @param {String|Element|List} val\n\
 * @return {List} self\n\
 * @api public\n\
 */\n\
\n\
exports.replace = function(val) {\n\
  var self = this;\n\
  var list = this.dom(val);\n\
\n\
  list.forEach(function(el, i) {\n\
    var old = self[i];\n\
    var parent = old.parentNode;\n\
    if (!parent) return;\n\
    el = i ? el.cloneNode(true) : el;\n\
    parent.replaceChild(el, old);\n\
  });\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Empty the dom list\n\
 *\n\
 * @return self\n\
 * @api public\n\
 */\n\
\n\
exports.empty = function() {\n\
  return this.forEach(function(el) {\n\
    text(el, \"\");\n\
  });\n\
};\n\
\n\
/**\n\
 * Remove all elements in the dom list\n\
 *\n\
 * @return {List} self\n\
 * @api public\n\
 */\n\
\n\
exports.remove = function() {\n\
  return this.forEach(function(el) {\n\
    var parent = el.parentNode;\n\
    if (parent) parent.removeChild(el);\n\
  });\n\
};\n\
\n\
/**\n\
 * Return a cloned dom list with all elements cloned.\n\
 *\n\
 * @return {List}\n\
 * @api public\n\
 */\n\
\n\
exports.clone = function() {\n\
  var out = this.map(function(el) {\n\
    return el.cloneNode(true);\n\
  });\n\
\n\
  return this.dom(out);\n\
};\n\
//@ sourceURL=component-dom/lib/manipulate.js"
));
require.register("component-dom/lib/classes.js", Function("exports, require, module",
"/**\n\
 * Module Dependencies\n\
 */\n\
\n\
var classes = require('classes');\n\
\n\
/**\n\
 * Add the given class `name`.\n\
 *\n\
 * @param {String} name\n\
 * @return {List} self\n\
 * @api public\n\
 */\n\
\n\
exports.addClass = function(name){\n\
  return this.forEach(function(el) {\n\
    el._classes = el._classes || classes(el);\n\
    el._classes.add(name);\n\
  });\n\
};\n\
\n\
/**\n\
 * Remove the given class `name`.\n\
 *\n\
 * @param {String|RegExp} name\n\
 * @return {List} self\n\
 * @api public\n\
 */\n\
\n\
exports.removeClass = function(name){\n\
  return this.forEach(function(el) {\n\
    el._classes = el._classes || classes(el);\n\
    el._classes.remove(name);\n\
  });\n\
};\n\
\n\
/**\n\
 * Toggle the given class `name`,\n\
 * optionally a `bool` may be given\n\
 * to indicate that the class should\n\
 * be added when truthy.\n\
 *\n\
 * @param {String} name\n\
 * @param {Boolean} bool\n\
 * @return {List} self\n\
 * @api public\n\
 */\n\
\n\
exports.toggleClass = function(name, bool){\n\
  var fn = 'toggle';\n\
\n\
  // toggle with boolean\n\
  if (2 == arguments.length) {\n\
    fn = bool ? 'add' : 'remove';\n\
  }\n\
\n\
  return this.forEach(function(el) {\n\
    el._classes = el._classes || classes(el);\n\
    el._classes[fn](name);\n\
  })\n\
};\n\
\n\
/**\n\
 * Check if the given class `name` is present.\n\
 *\n\
 * @param {String} name\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
exports.hasClass = function(name){\n\
  var el;\n\
\n\
  for(var i = 0, len = this.length; i < len; i++) {\n\
    el = this[i];\n\
    el._classes = el._classes || classes(el);\n\
    if (el._classes.has(name)) return true;\n\
  }\n\
\n\
  return false;\n\
};\n\
//@ sourceURL=component-dom/lib/classes.js"
));
require.register("component-dom/lib/attributes.js", Function("exports, require, module",
"/**\n\
 * Module Dependencies\n\
 */\n\
\n\
var value = require('value');\n\
\n\
/**\n\
 * Set attribute `name` to `val`, or get attr `name`.\n\
 *\n\
 * @param {String} name\n\
 * @param {String} [val]\n\
 * @return {String|List} self\n\
 * @api public\n\
 */\n\
\n\
exports.attr = function(name, val){\n\
  // get\n\
  if (1 == arguments.length) {\n\
    return this[0] && this[0].getAttribute(name);\n\
  }\n\
\n\
  // remove\n\
  if (null == val) {\n\
    return this.removeAttr(name);\n\
  }\n\
\n\
  // set\n\
  return this.forEach(function(el){\n\
    el.setAttribute(name, val);\n\
  });\n\
};\n\
\n\
/**\n\
 * Remove attribute `name`.\n\
 *\n\
 * @param {String} name\n\
 * @return {List} self\n\
 * @api public\n\
 */\n\
\n\
exports.removeAttr = function(name){\n\
  return this.forEach(function(el){\n\
    el.removeAttribute(name);\n\
  });\n\
};\n\
\n\
/**\n\
 * Set property `name` to `val`, or get property `name`.\n\
 *\n\
 * @param {String} name\n\
 * @param {String} [val]\n\
 * @return {Object|List} self\n\
 * @api public\n\
 */\n\
\n\
exports.prop = function(name, val){\n\
  if (1 == arguments.length) {\n\
    return this[0] && this[0][name];\n\
  }\n\
\n\
  return this.forEach(function(el){\n\
    el[name] = val;\n\
  });\n\
};\n\
\n\
/**\n\
 * Get the first element's value or set selected\n\
 * element values to `val`.\n\
 *\n\
 * @param {Mixed} [val]\n\
 * @return {Mixed}\n\
 * @api public\n\
 */\n\
\n\
exports.val =\n\
exports.value = function(val){\n\
  if (0 == arguments.length) {\n\
    return this[0]\n\
      ? value(this[0])\n\
      : undefined;\n\
  }\n\
\n\
  return this.forEach(function(el){\n\
    value(el, val);\n\
  });\n\
};\n\
//@ sourceURL=component-dom/lib/attributes.js"
));
require.register("component-dom/lib/events.js", Function("exports, require, module",
"/**\n\
 * Module Dependencies\n\
 */\n\
\n\
var events = require('event');\n\
var delegate = require('delegate');\n\
\n\
/**\n\
 * Bind to `event` and invoke `fn(e)`. When\n\
 * a `selector` is given then events are delegated.\n\
 *\n\
 * @param {String} event\n\
 * @param {String} [selector]\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {List}\n\
 * @api public\n\
 */\n\
\n\
exports.on = function(event, selector, fn, capture){\n\
  if ('string' == typeof selector) {\n\
    return this.forEach(function (el) {\n\
      fn._delegate = delegate.bind(el, selector, event, fn, capture);\n\
    });\n\
  }\n\
\n\
  capture = fn;\n\
  fn = selector;\n\
\n\
  return this.forEach(function (el) {\n\
    events.bind(el, event, fn, capture);\n\
  });\n\
};\n\
\n\
/**\n\
 * Unbind to `event` and invoke `fn(e)`. When\n\
 * a `selector` is given then delegated event\n\
 * handlers are unbound.\n\
 *\n\
 * @param {String} event\n\
 * @param {String} [selector]\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {List}\n\
 * @api public\n\
 */\n\
\n\
exports.off = function(event, selector, fn, capture){\n\
  if ('string' == typeof selector) {\n\
    return this.forEach(function (el) {\n\
      // TODO: add selector support back\n\
      delegate.unbind(el, event, fn._delegate, capture);\n\
    });\n\
  }\n\
\n\
  capture = fn;\n\
  fn = selector;\n\
\n\
  return this.forEach(function (el) {\n\
    events.unbind(el, event, fn, capture);\n\
  });\n\
};\n\
//@ sourceURL=component-dom/lib/events.js"
));
require.register("boot/index.js", Function("exports, require, module",
"/* jshint indent:2, devel:true, browser:true */\n\
/*global Phaser:true */\n\
\n\
(function () {\n\
\n\
  \"use strict\";\n\
\n\
  var dom = require('dom');\n\
  var domready = require('domready');\n\
  var socket = window.io.connect(window.location.hostname);\n\
\n\
  domready(function() {\n\
\n\
    var game = new Phaser.Game(1024*2, 640*2, Phaser.CANVAS, 'game-container', {\n\
      preload: preload,\n\
      create: create,\n\
      update: update,\n\
      render: render\n\
    }, true);\n\
\n\
    /**\n\
     * preload is run once before the game start\n\
     * @return {[type]} [description]\n\
     */\n\
    function preload () {\n\
      console.log('>> preload');\n\
      game.load.image('logo', 'img/phaser.png');\n\
    }\n\
\n\
    /**\n\
     * The create function is called automatically once the preload has finished\n\
     */\n\
\n\
    function create () {\n\
      console.log('>> create');\n\
      var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');\n\
      logo.anchor.setTo(0.5, 0.5);\n\
\n\
      // socket it up\n\
      socket.emit(\"game:join\");\n\
      socket.on(\"player:welcome\", function(res) {\n\
        // console.log('player:welcome', res);\n\
\n\
        if (res && res.total_player) {\n\
          var text = \"Online: \" + res.total_player;\n\
          var style = { font: \"20px Monaco\", fill: \"#323232\", align: \"left\" };\n\
          var t = game.add.text(10, 10, text, style);\n\
        }\n\
      });\n\
    }\n\
\n\
\n\
    /**\n\
     * The update (and render) functions are called every frame. So on a desktop that'd be around 60 time per second. In update this is where you'd do things like poll for input to move a player, check for object collision, etc. It's the heart of your game really.\n\
     */\n\
    function update() {\n\
      console.log('>> update');\n\
    }\n\
\n\
\n\
    /**\n\
     * The render function is called AFTER the WebGL/canvas render has taken place, so consider it the place to apply post-render effects or extra debug overlays. For example when building a game I will often put the game into CANVAS mode only and then use the render function to draw lots of debug info over the top of my game.\n\
     */\n\
    function render() {\n\
      console.log('>> render');\n\
    }\n\
  });\n\
\n\
}());\n\
//@ sourceURL=boot/index.js"
));




































require.alias("boot/index.js", "constantx/deps/boot/index.js");
require.alias("boot/index.js", "constantx/deps/boot/index.js");
require.alias("boot/index.js", "boot/index.js");
require.alias("jb55-domready/index.js", "boot/deps/domready/index.js");

require.alias("component-dom/index.js", "boot/deps/dom/index.js");
require.alias("component-dom/lib/traverse.js", "boot/deps/dom/lib/traverse.js");
require.alias("component-dom/lib/manipulate.js", "boot/deps/dom/lib/manipulate.js");
require.alias("component-dom/lib/classes.js", "boot/deps/dom/lib/classes.js");
require.alias("component-dom/lib/attributes.js", "boot/deps/dom/lib/attributes.js");
require.alias("component-dom/lib/events.js", "boot/deps/dom/lib/events.js");
require.alias("component-each/index.js", "component-dom/deps/each/index.js");
require.alias("component-to-function/index.js", "component-each/deps/to-function/index.js");
require.alias("component-props/index.js", "component-to-function/deps/props/index.js");
require.alias("component-props/index.js", "component-to-function/deps/props/index.js");
require.alias("component-props/index.js", "component-props/index.js");
require.alias("component-type/index.js", "component-each/deps/type/index.js");

require.alias("component-event/index.js", "component-dom/deps/event/index.js");

require.alias("component-delegate/index.js", "component-dom/deps/delegate/index.js");
require.alias("component-matches-selector/index.js", "component-delegate/deps/matches-selector/index.js");
require.alias("component-query/index.js", "component-matches-selector/deps/query/index.js");

require.alias("component-event/index.js", "component-delegate/deps/event/index.js");

require.alias("component-domify/index.js", "component-dom/deps/domify/index.js");

require.alias("component-classes/index.js", "component-dom/deps/classes/index.js");
require.alias("component-indexof/index.js", "component-classes/deps/indexof/index.js");

require.alias("component-css/index.js", "component-dom/deps/css/index.js");
require.alias("component-css/lib/css.js", "component-dom/deps/css/lib/css.js");
require.alias("component-css/lib/prop.js", "component-dom/deps/css/lib/prop.js");
require.alias("component-css/lib/swap.js", "component-dom/deps/css/lib/swap.js");
require.alias("component-css/lib/style.js", "component-dom/deps/css/lib/style.js");
require.alias("component-css/lib/hooks.js", "component-dom/deps/css/lib/hooks.js");
require.alias("component-css/lib/styles.js", "component-dom/deps/css/lib/styles.js");
require.alias("component-css/lib/vendor.js", "component-dom/deps/css/lib/vendor.js");
require.alias("component-css/lib/support.js", "component-dom/deps/css/lib/support.js");
require.alias("component-css/lib/computed.js", "component-dom/deps/css/lib/computed.js");
require.alias("component-css/index.js", "component-dom/deps/css/index.js");
require.alias("component-each/index.js", "component-css/deps/each/index.js");
require.alias("component-to-function/index.js", "component-each/deps/to-function/index.js");
require.alias("component-props/index.js", "component-to-function/deps/props/index.js");
require.alias("component-props/index.js", "component-to-function/deps/props/index.js");
require.alias("component-props/index.js", "component-props/index.js");
require.alias("component-type/index.js", "component-each/deps/type/index.js");

require.alias("visionmedia-debug/index.js", "component-css/deps/debug/index.js");
require.alias("visionmedia-debug/debug.js", "component-css/deps/debug/debug.js");

require.alias("ianstormtaylor-to-camel-case/index.js", "component-css/deps/to-camel-case/index.js");
require.alias("ianstormtaylor-to-space-case/index.js", "ianstormtaylor-to-camel-case/deps/to-space-case/index.js");
require.alias("ianstormtaylor-to-no-case/index.js", "ianstormtaylor-to-space-case/deps/to-no-case/index.js");

require.alias("component-within-document/index.js", "component-css/deps/within-document/index.js");

require.alias("component-css/index.js", "component-css/index.js");
require.alias("component-value/index.js", "component-dom/deps/value/index.js");
require.alias("component-value/index.js", "component-dom/deps/value/index.js");
require.alias("component-type/index.js", "component-value/deps/type/index.js");

require.alias("component-value/index.js", "component-value/index.js");
require.alias("component-query/index.js", "component-dom/deps/query/index.js");

require.alias("component-matches-selector/index.js", "component-dom/deps/matches-selector/index.js");
require.alias("component-query/index.js", "component-matches-selector/deps/query/index.js");

require.alias("yields-traverse/index.js", "component-dom/deps/traverse/index.js");
require.alias("yields-traverse/index.js", "component-dom/deps/traverse/index.js");
require.alias("component-matches-selector/index.js", "yields-traverse/deps/matches-selector/index.js");
require.alias("component-query/index.js", "component-matches-selector/deps/query/index.js");

require.alias("yields-traverse/index.js", "yields-traverse/index.js");
require.alias("component-trim/index.js", "component-dom/deps/trim/index.js");

require.alias("yields-isarray/index.js", "component-dom/deps/isArray/index.js");

require.alias("component-to-function/index.js", "component-dom/deps/to-function/index.js");
require.alias("component-props/index.js", "component-to-function/deps/props/index.js");
require.alias("component-props/index.js", "component-to-function/deps/props/index.js");
require.alias("component-props/index.js", "component-props/index.js");
require.alias("matthewp-keys/index.js", "component-dom/deps/keys/index.js");
require.alias("matthewp-keys/index.js", "component-dom/deps/keys/index.js");
require.alias("matthewp-keys/index.js", "matthewp-keys/index.js");
require.alias("matthewp-text/index.js", "component-dom/deps/text/index.js");

require.alias("boot/index.js", "boot/index.js");