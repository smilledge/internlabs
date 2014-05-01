(function (window, document, undefined) {
  'use strict';
  function minErr(module) {
    return function () {
      var code = arguments[0], prefix = '[' + (module ? module + ':' : '') + code + '] ', template = arguments[1], templateArgs = arguments, stringify = function (obj) {
          if (typeof obj === 'function') {
            return obj.toString().replace(/ \{[\s\S]*$/, '');
          } else if (typeof obj === 'undefined') {
            return 'undefined';
          } else if (typeof obj !== 'string') {
            return JSON.stringify(obj);
          }
          return obj;
        }, message, i;
      message = prefix + template.replace(/\{\d+\}/g, function (match) {
        var index = +match.slice(1, -1), arg;
        if (index + 2 < templateArgs.length) {
          arg = templateArgs[index + 2];
          if (typeof arg === 'function') {
            return arg.toString().replace(/ ?\{[\s\S]*$/, '');
          } else if (typeof arg === 'undefined') {
            return 'undefined';
          } else if (typeof arg !== 'string') {
            return toJson(arg);
          }
          return arg;
        }
        return match;
      });
      message = message + '\nhttp://errors.angularjs.org/1.2.15/' + (module ? module + '/' : '') + code;
      for (i = 2; i < arguments.length; i++) {
        message = message + (i == 2 ? '?' : '&') + 'p' + (i - 2) + '=' + encodeURIComponent(stringify(arguments[i]));
      }
      return new Error(message);
    };
  }
  var lowercase = function (string) {
    return isString(string) ? string.toLowerCase() : string;
  };
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var uppercase = function (string) {
    return isString(string) ? string.toUpperCase() : string;
  };
  var manualLowercase = function (s) {
    return isString(s) ? s.replace(/[A-Z]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) | 32);
    }) : s;
  };
  var manualUppercase = function (s) {
    return isString(s) ? s.replace(/[a-z]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) & ~32);
    }) : s;
  };
  if ('i' !== 'I'.toLowerCase()) {
    lowercase = manualLowercase;
    uppercase = manualUppercase;
  }
  var msie, jqLite, jQuery, slice = [].slice, push = [].push, toString = Object.prototype.toString, ngMinErr = minErr('ng'), _angular = window.angular, angular = window.angular || (window.angular = {}), angularModule, nodeName_, uid = [
      '0',
      '0',
      '0'
    ];
  msie = int((/msie (\d+)/.exec(lowercase(navigator.userAgent)) || [])[1]);
  if (isNaN(msie)) {
    msie = int((/trident\/.*; rv:(\d+)/.exec(lowercase(navigator.userAgent)) || [])[1]);
  }
  function isArrayLike(obj) {
    if (obj == null || isWindow(obj)) {
      return false;
    }
    var length = obj.length;
    if (obj.nodeType === 1 && length) {
      return true;
    }
    return isString(obj) || isArray(obj) || length === 0 || typeof length === 'number' && length > 0 && length - 1 in obj;
  }
  function forEach(obj, iterator, context) {
    var key;
    if (obj) {
      if (isFunction(obj)) {
        for (key in obj) {
          if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
            iterator.call(context, obj[key], key);
          }
        }
      } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context);
      } else if (isArrayLike(obj)) {
        for (key = 0; key < obj.length; key++)
          iterator.call(context, obj[key], key);
      } else {
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            iterator.call(context, obj[key], key);
          }
        }
      }
    }
    return obj;
  }
  function sortedKeys(obj) {
    var keys = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    return keys.sort();
  }
  function forEachSorted(obj, iterator, context) {
    var keys = sortedKeys(obj);
    for (var i = 0; i < keys.length; i++) {
      iterator.call(context, obj[keys[i]], keys[i]);
    }
    return keys;
  }
  function reverseParams(iteratorFn) {
    return function (value, key) {
      iteratorFn(key, value);
    };
  }
  function nextUid() {
    var index = uid.length;
    var digit;
    while (index) {
      index--;
      digit = uid[index].charCodeAt(0);
      if (digit == 57) {
        uid[index] = 'A';
        return uid.join('');
      }
      if (digit == 90) {
        uid[index] = '0';
      } else {
        uid[index] = String.fromCharCode(digit + 1);
        return uid.join('');
      }
    }
    uid.unshift('0');
    return uid.join('');
  }
  function setHashKey(obj, h) {
    if (h) {
      obj.$$hashKey = h;
    } else {
      delete obj.$$hashKey;
    }
  }
  function extend(dst) {
    var h = dst.$$hashKey;
    forEach(arguments, function (obj) {
      if (obj !== dst) {
        forEach(obj, function (value, key) {
          dst[key] = value;
        });
      }
    });
    setHashKey(dst, h);
    return dst;
  }
  function int(str) {
    return parseInt(str, 10);
  }
  function inherit(parent, extra) {
    return extend(new (extend(function () {
    }, { prototype: parent }))(), extra);
  }
  function noop() {
  }
  noop.$inject = [];
  function identity($) {
    return $;
  }
  identity.$inject = [];
  function valueFn(value) {
    return function () {
      return value;
    };
  }
  function isUndefined(value) {
    return typeof value === 'undefined';
  }
  function isDefined(value) {
    return typeof value !== 'undefined';
  }
  function isObject(value) {
    return value != null && typeof value === 'object';
  }
  function isString(value) {
    return typeof value === 'string';
  }
  function isNumber(value) {
    return typeof value === 'number';
  }
  function isDate(value) {
    return toString.call(value) === '[object Date]';
  }
  function isArray(value) {
    return toString.call(value) === '[object Array]';
  }
  function isFunction(value) {
    return typeof value === 'function';
  }
  function isRegExp(value) {
    return toString.call(value) === '[object RegExp]';
  }
  function isWindow(obj) {
    return obj && obj.document && obj.location && obj.alert && obj.setInterval;
  }
  function isScope(obj) {
    return obj && obj.$evalAsync && obj.$watch;
  }
  function isFile(obj) {
    return toString.call(obj) === '[object File]';
  }
  function isBlob(obj) {
    return toString.call(obj) === '[object Blob]';
  }
  function isBoolean(value) {
    return typeof value === 'boolean';
  }
  var trim = function () {
      if (!String.prototype.trim) {
        return function (value) {
          return isString(value) ? value.replace(/^\s\s*/, '').replace(/\s\s*$/, '') : value;
        };
      }
      return function (value) {
        return isString(value) ? value.trim() : value;
      };
    }();
  function isElement(node) {
    return !!(node && (node.nodeName || node.prop && node.attr && node.find));
  }
  function makeMap(str) {
    var obj = {}, items = str.split(','), i;
    for (i = 0; i < items.length; i++)
      obj[items[i]] = true;
    return obj;
  }
  if (msie < 9) {
    nodeName_ = function (element) {
      element = element.nodeName ? element : element[0];
      return element.scopeName && element.scopeName != 'HTML' ? uppercase(element.scopeName + ':' + element.nodeName) : element.nodeName;
    };
  } else {
    nodeName_ = function (element) {
      return element.nodeName ? element.nodeName : element[0].nodeName;
    };
  }
  function map(obj, iterator, context) {
    var results = [];
    forEach(obj, function (value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  }
  function size(obj, ownPropsOnly) {
    var count = 0, key;
    if (isArray(obj) || isString(obj)) {
      return obj.length;
    } else if (isObject(obj)) {
      for (key in obj)
        if (!ownPropsOnly || obj.hasOwnProperty(key))
          count++;
    }
    return count;
  }
  function includes(array, obj) {
    return indexOf(array, obj) != -1;
  }
  function indexOf(array, obj) {
    if (array.indexOf)
      return array.indexOf(obj);
    for (var i = 0; i < array.length; i++) {
      if (obj === array[i])
        return i;
    }
    return -1;
  }
  function arrayRemove(array, value) {
    var index = indexOf(array, value);
    if (index >= 0)
      array.splice(index, 1);
    return value;
  }
  function isLeafNode(node) {
    if (node) {
      switch (node.nodeName) {
      case 'OPTION':
      case 'PRE':
      case 'TITLE':
        return true;
      }
    }
    return false;
  }
  function copy(source, destination) {
    if (isWindow(source) || isScope(source)) {
      throw ngMinErr('cpws', 'Can\'t copy! Making copies of Window or Scope instances is not supported.');
    }
    if (!destination) {
      destination = source;
      if (source) {
        if (isArray(source)) {
          destination = copy(source, []);
        } else if (isDate(source)) {
          destination = new Date(source.getTime());
        } else if (isRegExp(source)) {
          destination = new RegExp(source.source);
        } else if (isObject(source)) {
          destination = copy(source, {});
        }
      }
    } else {
      if (source === destination)
        throw ngMinErr('cpi', 'Can\'t copy! Source and destination are identical.');
      if (isArray(source)) {
        destination.length = 0;
        for (var i = 0; i < source.length; i++) {
          destination.push(copy(source[i]));
        }
      } else {
        var h = destination.$$hashKey;
        forEach(destination, function (value, key) {
          delete destination[key];
        });
        for (var key in source) {
          destination[key] = copy(source[key]);
        }
        setHashKey(destination, h);
      }
    }
    return destination;
  }
  function shallowCopy(src, dst) {
    dst = dst || {};
    for (var key in src) {
      if (src.hasOwnProperty(key) && !(key.charAt(0) === '$' && key.charAt(1) === '$')) {
        dst[key] = src[key];
      }
    }
    return dst;
  }
  function equals(o1, o2) {
    if (o1 === o2)
      return true;
    if (o1 === null || o2 === null)
      return false;
    if (o1 !== o1 && o2 !== o2)
      return true;
    var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
    if (t1 == t2) {
      if (t1 == 'object') {
        if (isArray(o1)) {
          if (!isArray(o2))
            return false;
          if ((length = o1.length) == o2.length) {
            for (key = 0; key < length; key++) {
              if (!equals(o1[key], o2[key]))
                return false;
            }
            return true;
          }
        } else if (isDate(o1)) {
          return isDate(o2) && o1.getTime() == o2.getTime();
        } else if (isRegExp(o1) && isRegExp(o2)) {
          return o1.toString() == o2.toString();
        } else {
          if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) || isArray(o2))
            return false;
          keySet = {};
          for (key in o1) {
            if (key.charAt(0) === '$' || isFunction(o1[key]))
              continue;
            if (!equals(o1[key], o2[key]))
              return false;
            keySet[key] = true;
          }
          for (key in o2) {
            if (!keySet.hasOwnProperty(key) && key.charAt(0) !== '$' && o2[key] !== undefined && !isFunction(o2[key]))
              return false;
          }
          return true;
        }
      }
    }
    return false;
  }
  function csp() {
    return document.securityPolicy && document.securityPolicy.isActive || document.querySelector && !!(document.querySelector('[ng-csp]') || document.querySelector('[data-ng-csp]'));
  }
  function concat(array1, array2, index) {
    return array1.concat(slice.call(array2, index));
  }
  function sliceArgs(args, startIndex) {
    return slice.call(args, startIndex || 0);
  }
  function bind(self, fn) {
    var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
    if (isFunction(fn) && !(fn instanceof RegExp)) {
      return curryArgs.length ? function () {
        return arguments.length ? fn.apply(self, curryArgs.concat(slice.call(arguments, 0))) : fn.apply(self, curryArgs);
      } : function () {
        return arguments.length ? fn.apply(self, arguments) : fn.call(self);
      };
    } else {
      return fn;
    }
  }
  function toJsonReplacer(key, value) {
    var val = value;
    if (typeof key === 'string' && key.charAt(0) === '$') {
      val = undefined;
    } else if (isWindow(value)) {
      val = '$WINDOW';
    } else if (value && document === value) {
      val = '$DOCUMENT';
    } else if (isScope(value)) {
      val = '$SCOPE';
    }
    return val;
  }
  function toJson(obj, pretty) {
    if (typeof obj === 'undefined')
      return undefined;
    return JSON.stringify(obj, toJsonReplacer, pretty ? '  ' : null);
  }
  function fromJson(json) {
    return isString(json) ? JSON.parse(json) : json;
  }
  function toBoolean(value) {
    if (typeof value === 'function') {
      value = true;
    } else if (value && value.length !== 0) {
      var v = lowercase('' + value);
      value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == 'n' || v == '[]');
    } else {
      value = false;
    }
    return value;
  }
  function startingTag(element) {
    element = jqLite(element).clone();
    try {
      element.empty();
    } catch (e) {
    }
    var TEXT_NODE = 3;
    var elemHtml = jqLite('<div>').append(element).html();
    try {
      return element[0].nodeType === TEXT_NODE ? lowercase(elemHtml) : elemHtml.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/, function (match, nodeName) {
        return '<' + lowercase(nodeName);
      });
    } catch (e) {
      return lowercase(elemHtml);
    }
  }
  function tryDecodeURIComponent(value) {
    try {
      return decodeURIComponent(value);
    } catch (e) {
    }
  }
  function parseKeyValue(keyValue) {
    var obj = {}, key_value, key;
    forEach((keyValue || '').split('&'), function (keyValue) {
      if (keyValue) {
        key_value = keyValue.split('=');
        key = tryDecodeURIComponent(key_value[0]);
        if (isDefined(key)) {
          var val = isDefined(key_value[1]) ? tryDecodeURIComponent(key_value[1]) : true;
          if (!obj[key]) {
            obj[key] = val;
          } else if (isArray(obj[key])) {
            obj[key].push(val);
          } else {
            obj[key] = [
              obj[key],
              val
            ];
          }
        }
      }
    });
    return obj;
  }
  function toKeyValue(obj) {
    var parts = [];
    forEach(obj, function (value, key) {
      if (isArray(value)) {
        forEach(value, function (arrayValue) {
          parts.push(encodeUriQuery(key, true) + (arrayValue === true ? '' : '=' + encodeUriQuery(arrayValue, true)));
        });
      } else {
        parts.push(encodeUriQuery(key, true) + (value === true ? '' : '=' + encodeUriQuery(value, true)));
      }
    });
    return parts.length ? parts.join('&') : '';
  }
  function encodeUriSegment(val) {
    return encodeUriQuery(val, true).replace(/%26/gi, '&').replace(/%3D/gi, '=').replace(/%2B/gi, '+');
  }
  function encodeUriQuery(val, pctEncodeSpaces) {
    return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, pctEncodeSpaces ? '%20' : '+');
  }
  function angularInit(element, bootstrap) {
    var elements = [element], appElement, module, names = [
        'ng:app',
        'ng-app',
        'x-ng-app',
        'data-ng-app'
      ], NG_APP_CLASS_REGEXP = /\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;
    function append(element) {
      element && elements.push(element);
    }
    forEach(names, function (name) {
      names[name] = true;
      append(document.getElementById(name));
      name = name.replace(':', '\\:');
      if (element.querySelectorAll) {
        forEach(element.querySelectorAll('.' + name), append);
        forEach(element.querySelectorAll('.' + name + '\\:'), append);
        forEach(element.querySelectorAll('[' + name + ']'), append);
      }
    });
    forEach(elements, function (element) {
      if (!appElement) {
        var className = ' ' + element.className + ' ';
        var match = NG_APP_CLASS_REGEXP.exec(className);
        if (match) {
          appElement = element;
          module = (match[2] || '').replace(/\s+/g, ',');
        } else {
          forEach(element.attributes, function (attr) {
            if (!appElement && names[attr.name]) {
              appElement = element;
              module = attr.value;
            }
          });
        }
      }
    });
    if (appElement) {
      bootstrap(appElement, module ? [module] : []);
    }
  }
  function bootstrap(element, modules) {
    var doBootstrap = function () {
      element = jqLite(element);
      if (element.injector()) {
        var tag = element[0] === document ? 'document' : startingTag(element);
        throw ngMinErr('btstrpd', 'App Already Bootstrapped with this Element \'{0}\'', tag);
      }
      modules = modules || [];
      modules.unshift([
        '$provide',
        function ($provide) {
          $provide.value('$rootElement', element);
        }
      ]);
      modules.unshift('ng');
      var injector = createInjector(modules);
      injector.invoke([
        '$rootScope',
        '$rootElement',
        '$compile',
        '$injector',
        '$animate',
        function (scope, element, compile, injector, animate) {
          scope.$apply(function () {
            element.data('$injector', injector);
            compile(element)(scope);
          });
        }
      ]);
      return injector;
    };
    var NG_DEFER_BOOTSTRAP = /^NG_DEFER_BOOTSTRAP!/;
    if (window && !NG_DEFER_BOOTSTRAP.test(window.name)) {
      return doBootstrap();
    }
    window.name = window.name.replace(NG_DEFER_BOOTSTRAP, '');
    angular.resumeBootstrap = function (extraModules) {
      forEach(extraModules, function (module) {
        modules.push(module);
      });
      doBootstrap();
    };
  }
  var SNAKE_CASE_REGEXP = /[A-Z]/g;
  function snake_case(name, separator) {
    separator = separator || '_';
    return name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
      return (pos ? separator : '') + letter.toLowerCase();
    });
  }
  function bindJQuery() {
    jQuery = window.jQuery;
    if (jQuery) {
      jqLite = jQuery;
      extend(jQuery.fn, {
        scope: JQLitePrototype.scope,
        isolateScope: JQLitePrototype.isolateScope,
        controller: JQLitePrototype.controller,
        injector: JQLitePrototype.injector,
        inheritedData: JQLitePrototype.inheritedData
      });
      jqLitePatchJQueryRemove('remove', true, true, false);
      jqLitePatchJQueryRemove('empty', false, false, false);
      jqLitePatchJQueryRemove('html', false, false, true);
    } else {
      jqLite = JQLite;
    }
    angular.element = jqLite;
  }
  function assertArg(arg, name, reason) {
    if (!arg) {
      throw ngMinErr('areq', 'Argument \'{0}\' is {1}', name || '?', reason || 'required');
    }
    return arg;
  }
  function assertArgFn(arg, name, acceptArrayAnnotation) {
    if (acceptArrayAnnotation && isArray(arg)) {
      arg = arg[arg.length - 1];
    }
    assertArg(isFunction(arg), name, 'not a function, got ' + (arg && typeof arg == 'object' ? arg.constructor.name || 'Object' : typeof arg));
    return arg;
  }
  function assertNotHasOwnProperty(name, context) {
    if (name === 'hasOwnProperty') {
      throw ngMinErr('badname', 'hasOwnProperty is not a valid {0} name', context);
    }
  }
  function getter(obj, path, bindFnToScope) {
    if (!path)
      return obj;
    var keys = path.split('.');
    var key;
    var lastInstance = obj;
    var len = keys.length;
    for (var i = 0; i < len; i++) {
      key = keys[i];
      if (obj) {
        obj = (lastInstance = obj)[key];
      }
    }
    if (!bindFnToScope && isFunction(obj)) {
      return bind(lastInstance, obj);
    }
    return obj;
  }
  function getBlockElements(nodes) {
    var startNode = nodes[0], endNode = nodes[nodes.length - 1];
    if (startNode === endNode) {
      return jqLite(startNode);
    }
    var element = startNode;
    var elements = [element];
    do {
      element = element.nextSibling;
      if (!element)
        break;
      elements.push(element);
    } while (element !== endNode);
    return jqLite(elements);
  }
  function setupModuleLoader(window) {
    var $injectorMinErr = minErr('$injector');
    var ngMinErr = minErr('ng');
    function ensure(obj, name, factory) {
      return obj[name] || (obj[name] = factory());
    }
    var angular = ensure(window, 'angular', Object);
    angular.$$minErr = angular.$$minErr || minErr;
    return ensure(angular, 'module', function () {
      var modules = {};
      return function module(name, requires, configFn) {
        var assertNotHasOwnProperty = function (name, context) {
          if (name === 'hasOwnProperty') {
            throw ngMinErr('badname', 'hasOwnProperty is not a valid {0} name', context);
          }
        };
        assertNotHasOwnProperty(name, 'module');
        if (requires && modules.hasOwnProperty(name)) {
          modules[name] = null;
        }
        return ensure(modules, name, function () {
          if (!requires) {
            throw $injectorMinErr('nomod', 'Module \'{0}\' is not available! You either misspelled ' + 'the module name or forgot to load it. If registering a module ensure that you ' + 'specify the dependencies as the second argument.', name);
          }
          var invokeQueue = [];
          var runBlocks = [];
          var config = invokeLater('$injector', 'invoke');
          var moduleInstance = {
              _invokeQueue: invokeQueue,
              _runBlocks: runBlocks,
              requires: requires,
              name: name,
              provider: invokeLater('$provide', 'provider'),
              factory: invokeLater('$provide', 'factory'),
              service: invokeLater('$provide', 'service'),
              value: invokeLater('$provide', 'value'),
              constant: invokeLater('$provide', 'constant', 'unshift'),
              animation: invokeLater('$animateProvider', 'register'),
              filter: invokeLater('$filterProvider', 'register'),
              controller: invokeLater('$controllerProvider', 'register'),
              directive: invokeLater('$compileProvider', 'directive'),
              config: config,
              run: function (block) {
                runBlocks.push(block);
                return this;
              }
            };
          if (configFn) {
            config(configFn);
          }
          return moduleInstance;
          function invokeLater(provider, method, insertMethod) {
            return function () {
              invokeQueue[insertMethod || 'push']([
                provider,
                method,
                arguments
              ]);
              return moduleInstance;
            };
          }
        });
      };
    });
  }
  var version = {
      full: '1.2.15',
      major: 1,
      minor: 2,
      dot: 15,
      codeName: 'beer-underestimating'
    };
  function publishExternalAPI(angular) {
    extend(angular, {
      'bootstrap': bootstrap,
      'copy': copy,
      'extend': extend,
      'equals': equals,
      'element': jqLite,
      'forEach': forEach,
      'injector': createInjector,
      'noop': noop,
      'bind': bind,
      'toJson': toJson,
      'fromJson': fromJson,
      'identity': identity,
      'isUndefined': isUndefined,
      'isDefined': isDefined,
      'isString': isString,
      'isFunction': isFunction,
      'isObject': isObject,
      'isNumber': isNumber,
      'isElement': isElement,
      'isArray': isArray,
      'version': version,
      'isDate': isDate,
      'lowercase': lowercase,
      'uppercase': uppercase,
      'callbacks': { counter: 0 },
      '$$minErr': minErr,
      '$$csp': csp
    });
    angularModule = setupModuleLoader(window);
    try {
      angularModule('ngLocale');
    } catch (e) {
      angularModule('ngLocale', []).provider('$locale', $LocaleProvider);
    }
    angularModule('ng', ['ngLocale'], [
      '$provide',
      function ngModule($provide) {
        $provide.provider({ $$sanitizeUri: $$SanitizeUriProvider });
        $provide.provider('$compile', $CompileProvider).directive({
          a: htmlAnchorDirective,
          input: inputDirective,
          textarea: inputDirective,
          form: formDirective,
          script: scriptDirective,
          select: selectDirective,
          style: styleDirective,
          option: optionDirective,
          ngBind: ngBindDirective,
          ngBindHtml: ngBindHtmlDirective,
          ngBindTemplate: ngBindTemplateDirective,
          ngClass: ngClassDirective,
          ngClassEven: ngClassEvenDirective,
          ngClassOdd: ngClassOddDirective,
          ngCloak: ngCloakDirective,
          ngController: ngControllerDirective,
          ngForm: ngFormDirective,
          ngHide: ngHideDirective,
          ngIf: ngIfDirective,
          ngInclude: ngIncludeDirective,
          ngInit: ngInitDirective,
          ngNonBindable: ngNonBindableDirective,
          ngPluralize: ngPluralizeDirective,
          ngRepeat: ngRepeatDirective,
          ngShow: ngShowDirective,
          ngStyle: ngStyleDirective,
          ngSwitch: ngSwitchDirective,
          ngSwitchWhen: ngSwitchWhenDirective,
          ngSwitchDefault: ngSwitchDefaultDirective,
          ngOptions: ngOptionsDirective,
          ngTransclude: ngTranscludeDirective,
          ngModel: ngModelDirective,
          ngList: ngListDirective,
          ngChange: ngChangeDirective,
          required: requiredDirective,
          ngRequired: requiredDirective,
          ngValue: ngValueDirective
        }).directive({ ngInclude: ngIncludeFillContentDirective }).directive(ngAttributeAliasDirectives).directive(ngEventDirectives);
        $provide.provider({
          $anchorScroll: $AnchorScrollProvider,
          $animate: $AnimateProvider,
          $browser: $BrowserProvider,
          $cacheFactory: $CacheFactoryProvider,
          $controller: $ControllerProvider,
          $document: $DocumentProvider,
          $exceptionHandler: $ExceptionHandlerProvider,
          $filter: $FilterProvider,
          $interpolate: $InterpolateProvider,
          $interval: $IntervalProvider,
          $http: $HttpProvider,
          $httpBackend: $HttpBackendProvider,
          $location: $LocationProvider,
          $log: $LogProvider,
          $parse: $ParseProvider,
          $rootScope: $RootScopeProvider,
          $q: $QProvider,
          $sce: $SceProvider,
          $sceDelegate: $SceDelegateProvider,
          $sniffer: $SnifferProvider,
          $templateCache: $TemplateCacheProvider,
          $timeout: $TimeoutProvider,
          $window: $WindowProvider,
          $$rAF: $$RAFProvider,
          $$asyncCallback: $$AsyncCallbackProvider
        });
      }
    ]);
  }
  var jqCache = JQLite.cache = {}, jqName = JQLite.expando = 'ng-' + new Date().getTime(), jqId = 1, addEventListenerFn = window.document.addEventListener ? function (element, type, fn) {
      element.addEventListener(type, fn, false);
    } : function (element, type, fn) {
      element.attachEvent('on' + type, fn);
    }, removeEventListenerFn = window.document.removeEventListener ? function (element, type, fn) {
      element.removeEventListener(type, fn, false);
    } : function (element, type, fn) {
      element.detachEvent('on' + type, fn);
    };
  var jqData = JQLite._data = function (node) {
      return this.cache[node[this.expando]] || {};
    };
  function jqNextId() {
    return ++jqId;
  }
  var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
  var MOZ_HACK_REGEXP = /^moz([A-Z])/;
  var jqLiteMinErr = minErr('jqLite');
  function camelCase(name) {
    return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    }).replace(MOZ_HACK_REGEXP, 'Moz$1');
  }
  function jqLitePatchJQueryRemove(name, dispatchThis, filterElems, getterIfNoArguments) {
    var originalJqFn = jQuery.fn[name];
    originalJqFn = originalJqFn.$original || originalJqFn;
    removePatch.$original = originalJqFn;
    jQuery.fn[name] = removePatch;
    function removePatch(param) {
      var list = filterElems && param ? [this.filter(param)] : [this], fireEvent = dispatchThis, set, setIndex, setLength, element, childIndex, childLength, children;
      if (!getterIfNoArguments || param != null) {
        while (list.length) {
          set = list.shift();
          for (setIndex = 0, setLength = set.length; setIndex < setLength; setIndex++) {
            element = jqLite(set[setIndex]);
            if (fireEvent) {
              element.triggerHandler('$destroy');
            } else {
              fireEvent = !fireEvent;
            }
            for (childIndex = 0, childLength = (children = element.children()).length; childIndex < childLength; childIndex++) {
              list.push(jQuery(children[childIndex]));
            }
          }
        }
      }
      return originalJqFn.apply(this, arguments);
    }
  }
  function JQLite(element) {
    if (element instanceof JQLite) {
      return element;
    }
    if (isString(element)) {
      element = trim(element);
    }
    if (!(this instanceof JQLite)) {
      if (isString(element) && element.charAt(0) != '<') {
        throw jqLiteMinErr('nosel', 'Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element');
      }
      return new JQLite(element);
    }
    if (isString(element)) {
      var div = document.createElement('div');
      div.innerHTML = '<div>&#160;</div>' + element;
      div.removeChild(div.firstChild);
      jqLiteAddNodes(this, div.childNodes);
      var fragment = jqLite(document.createDocumentFragment());
      fragment.append(this);
    } else {
      jqLiteAddNodes(this, element);
    }
  }
  function jqLiteClone(element) {
    return element.cloneNode(true);
  }
  function jqLiteDealoc(element) {
    jqLiteRemoveData(element);
    for (var i = 0, children = element.childNodes || []; i < children.length; i++) {
      jqLiteDealoc(children[i]);
    }
  }
  function jqLiteOff(element, type, fn, unsupported) {
    if (isDefined(unsupported))
      throw jqLiteMinErr('offargs', 'jqLite#off() does not support the `selector` argument');
    var events = jqLiteExpandoStore(element, 'events'), handle = jqLiteExpandoStore(element, 'handle');
    if (!handle)
      return;
    if (isUndefined(type)) {
      forEach(events, function (eventHandler, type) {
        removeEventListenerFn(element, type, eventHandler);
        delete events[type];
      });
    } else {
      forEach(type.split(' '), function (type) {
        if (isUndefined(fn)) {
          removeEventListenerFn(element, type, events[type]);
          delete events[type];
        } else {
          arrayRemove(events[type] || [], fn);
        }
      });
    }
  }
  function jqLiteRemoveData(element, name) {
    var expandoId = element[jqName], expandoStore = jqCache[expandoId];
    if (expandoStore) {
      if (name) {
        delete jqCache[expandoId].data[name];
        return;
      }
      if (expandoStore.handle) {
        expandoStore.events.$destroy && expandoStore.handle({}, '$destroy');
        jqLiteOff(element);
      }
      delete jqCache[expandoId];
      element[jqName] = undefined;
    }
  }
  function jqLiteExpandoStore(element, key, value) {
    var expandoId = element[jqName], expandoStore = jqCache[expandoId || -1];
    if (isDefined(value)) {
      if (!expandoStore) {
        element[jqName] = expandoId = jqNextId();
        expandoStore = jqCache[expandoId] = {};
      }
      expandoStore[key] = value;
    } else {
      return expandoStore && expandoStore[key];
    }
  }
  function jqLiteData(element, key, value) {
    var data = jqLiteExpandoStore(element, 'data'), isSetter = isDefined(value), keyDefined = !isSetter && isDefined(key), isSimpleGetter = keyDefined && !isObject(key);
    if (!data && !isSimpleGetter) {
      jqLiteExpandoStore(element, 'data', data = {});
    }
    if (isSetter) {
      data[key] = value;
    } else {
      if (keyDefined) {
        if (isSimpleGetter) {
          return data && data[key];
        } else {
          extend(data, key);
        }
      } else {
        return data;
      }
    }
  }
  function jqLiteHasClass(element, selector) {
    if (!element.getAttribute)
      return false;
    return (' ' + (element.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ').indexOf(' ' + selector + ' ') > -1;
  }
  function jqLiteRemoveClass(element, cssClasses) {
    if (cssClasses && element.setAttribute) {
      forEach(cssClasses.split(' '), function (cssClass) {
        element.setAttribute('class', trim((' ' + (element.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ').replace(' ' + trim(cssClass) + ' ', ' ')));
      });
    }
  }
  function jqLiteAddClass(element, cssClasses) {
    if (cssClasses && element.setAttribute) {
      var existingClasses = (' ' + (element.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ');
      forEach(cssClasses.split(' '), function (cssClass) {
        cssClass = trim(cssClass);
        if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
          existingClasses += cssClass + ' ';
        }
      });
      element.setAttribute('class', trim(existingClasses));
    }
  }
  function jqLiteAddNodes(root, elements) {
    if (elements) {
      elements = !elements.nodeName && isDefined(elements.length) && !isWindow(elements) ? elements : [elements];
      for (var i = 0; i < elements.length; i++) {
        root.push(elements[i]);
      }
    }
  }
  function jqLiteController(element, name) {
    return jqLiteInheritedData(element, '$' + (name || 'ngController') + 'Controller');
  }
  function jqLiteInheritedData(element, name, value) {
    element = jqLite(element);
    if (element[0].nodeType == 9) {
      element = element.find('html');
    }
    var names = isArray(name) ? name : [name];
    while (element.length) {
      var node = element[0];
      for (var i = 0, ii = names.length; i < ii; i++) {
        if ((value = element.data(names[i])) !== undefined)
          return value;
      }
      element = jqLite(node.parentNode || node.nodeType === 11 && node.host);
    }
  }
  function jqLiteEmpty(element) {
    for (var i = 0, childNodes = element.childNodes; i < childNodes.length; i++) {
      jqLiteDealoc(childNodes[i]);
    }
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
  var JQLitePrototype = JQLite.prototype = {
      ready: function (fn) {
        var fired = false;
        function trigger() {
          if (fired)
            return;
          fired = true;
          fn();
        }
        if (document.readyState === 'complete') {
          setTimeout(trigger);
        } else {
          this.on('DOMContentLoaded', trigger);
          JQLite(window).on('load', trigger);
        }
      },
      toString: function () {
        var value = [];
        forEach(this, function (e) {
          value.push('' + e);
        });
        return '[' + value.join(', ') + ']';
      },
      eq: function (index) {
        return index >= 0 ? jqLite(this[index]) : jqLite(this[this.length + index]);
      },
      length: 0,
      push: push,
      sort: [].sort,
      splice: [].splice
    };
  var BOOLEAN_ATTR = {};
  forEach('multiple,selected,checked,disabled,readOnly,required,open'.split(','), function (value) {
    BOOLEAN_ATTR[lowercase(value)] = value;
  });
  var BOOLEAN_ELEMENTS = {};
  forEach('input,select,option,textarea,button,form,details'.split(','), function (value) {
    BOOLEAN_ELEMENTS[uppercase(value)] = true;
  });
  function getBooleanAttrName(element, name) {
    var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];
    return booleanAttr && BOOLEAN_ELEMENTS[element.nodeName] && booleanAttr;
  }
  forEach({
    data: jqLiteData,
    inheritedData: jqLiteInheritedData,
    scope: function (element) {
      return jqLite(element).data('$scope') || jqLiteInheritedData(element.parentNode || element, [
        '$isolateScope',
        '$scope'
      ]);
    },
    isolateScope: function (element) {
      return jqLite(element).data('$isolateScope') || jqLite(element).data('$isolateScopeNoTemplate');
    },
    controller: jqLiteController,
    injector: function (element) {
      return jqLiteInheritedData(element, '$injector');
    },
    removeAttr: function (element, name) {
      element.removeAttribute(name);
    },
    hasClass: jqLiteHasClass,
    css: function (element, name, value) {
      name = camelCase(name);
      if (isDefined(value)) {
        element.style[name] = value;
      } else {
        var val;
        if (msie <= 8) {
          val = element.currentStyle && element.currentStyle[name];
          if (val === '')
            val = 'auto';
        }
        val = val || element.style[name];
        if (msie <= 8) {
          val = val === '' ? undefined : val;
        }
        return val;
      }
    },
    attr: function (element, name, value) {
      var lowercasedName = lowercase(name);
      if (BOOLEAN_ATTR[lowercasedName]) {
        if (isDefined(value)) {
          if (!!value) {
            element[name] = true;
            element.setAttribute(name, lowercasedName);
          } else {
            element[name] = false;
            element.removeAttribute(lowercasedName);
          }
        } else {
          return element[name] || (element.attributes.getNamedItem(name) || noop).specified ? lowercasedName : undefined;
        }
      } else if (isDefined(value)) {
        element.setAttribute(name, value);
      } else if (element.getAttribute) {
        var ret = element.getAttribute(name, 2);
        return ret === null ? undefined : ret;
      }
    },
    prop: function (element, name, value) {
      if (isDefined(value)) {
        element[name] = value;
      } else {
        return element[name];
      }
    },
    text: function () {
      var NODE_TYPE_TEXT_PROPERTY = [];
      if (msie < 9) {
        NODE_TYPE_TEXT_PROPERTY[1] = 'innerText';
        NODE_TYPE_TEXT_PROPERTY[3] = 'nodeValue';
      } else {
        NODE_TYPE_TEXT_PROPERTY[1] = NODE_TYPE_TEXT_PROPERTY[3] = 'textContent';
      }
      getText.$dv = '';
      return getText;
      function getText(element, value) {
        var textProp = NODE_TYPE_TEXT_PROPERTY[element.nodeType];
        if (isUndefined(value)) {
          return textProp ? element[textProp] : '';
        }
        element[textProp] = value;
      }
    }(),
    val: function (element, value) {
      if (isUndefined(value)) {
        if (nodeName_(element) === 'SELECT' && element.multiple) {
          var result = [];
          forEach(element.options, function (option) {
            if (option.selected) {
              result.push(option.value || option.text);
            }
          });
          return result.length === 0 ? null : result;
        }
        return element.value;
      }
      element.value = value;
    },
    html: function (element, value) {
      if (isUndefined(value)) {
        return element.innerHTML;
      }
      for (var i = 0, childNodes = element.childNodes; i < childNodes.length; i++) {
        jqLiteDealoc(childNodes[i]);
      }
      element.innerHTML = value;
    },
    empty: jqLiteEmpty
  }, function (fn, name) {
    JQLite.prototype[name] = function (arg1, arg2) {
      var i, key;
      if (fn !== jqLiteEmpty && (fn.length == 2 && (fn !== jqLiteHasClass && fn !== jqLiteController) ? arg1 : arg2) === undefined) {
        if (isObject(arg1)) {
          for (i = 0; i < this.length; i++) {
            if (fn === jqLiteData) {
              fn(this[i], arg1);
            } else {
              for (key in arg1) {
                fn(this[i], key, arg1[key]);
              }
            }
          }
          return this;
        } else {
          var value = fn.$dv;
          var jj = value === undefined ? Math.min(this.length, 1) : this.length;
          for (var j = 0; j < jj; j++) {
            var nodeValue = fn(this[j], arg1, arg2);
            value = value ? value + nodeValue : nodeValue;
          }
          return value;
        }
      } else {
        for (i = 0; i < this.length; i++) {
          fn(this[i], arg1, arg2);
        }
        return this;
      }
    };
  });
  function createEventHandler(element, events) {
    var eventHandler = function (event, type) {
      if (!event.preventDefault) {
        event.preventDefault = function () {
          event.returnValue = false;
        };
      }
      if (!event.stopPropagation) {
        event.stopPropagation = function () {
          event.cancelBubble = true;
        };
      }
      if (!event.target) {
        event.target = event.srcElement || document;
      }
      if (isUndefined(event.defaultPrevented)) {
        var prevent = event.preventDefault;
        event.preventDefault = function () {
          event.defaultPrevented = true;
          prevent.call(event);
        };
        event.defaultPrevented = false;
      }
      event.isDefaultPrevented = function () {
        return event.defaultPrevented || event.returnValue === false;
      };
      var eventHandlersCopy = shallowCopy(events[type || event.type] || []);
      forEach(eventHandlersCopy, function (fn) {
        fn.call(element, event);
      });
      if (msie <= 8) {
        event.preventDefault = null;
        event.stopPropagation = null;
        event.isDefaultPrevented = null;
      } else {
        delete event.preventDefault;
        delete event.stopPropagation;
        delete event.isDefaultPrevented;
      }
    };
    eventHandler.elem = element;
    return eventHandler;
  }
  forEach({
    removeData: jqLiteRemoveData,
    dealoc: jqLiteDealoc,
    on: function onFn(element, type, fn, unsupported) {
      if (isDefined(unsupported))
        throw jqLiteMinErr('onargs', 'jqLite#on() does not support the `selector` or `eventData` parameters');
      var events = jqLiteExpandoStore(element, 'events'), handle = jqLiteExpandoStore(element, 'handle');
      if (!events)
        jqLiteExpandoStore(element, 'events', events = {});
      if (!handle)
        jqLiteExpandoStore(element, 'handle', handle = createEventHandler(element, events));
      forEach(type.split(' '), function (type) {
        var eventFns = events[type];
        if (!eventFns) {
          if (type == 'mouseenter' || type == 'mouseleave') {
            var contains = document.body.contains || document.body.compareDocumentPosition ? function (a, b) {
                var adown = a.nodeType === 9 ? a.documentElement : a, bup = b && b.parentNode;
                return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
              } : function (a, b) {
                if (b) {
                  while (b = b.parentNode) {
                    if (b === a) {
                      return true;
                    }
                  }
                }
                return false;
              };
            events[type] = [];
            var eventmap = {
                mouseleave: 'mouseout',
                mouseenter: 'mouseover'
              };
            onFn(element, eventmap[type], function (event) {
              var target = this, related = event.relatedTarget;
              if (!related || related !== target && !contains(target, related)) {
                handle(event, type);
              }
            });
          } else {
            addEventListenerFn(element, type, handle);
            events[type] = [];
          }
          eventFns = events[type];
        }
        eventFns.push(fn);
      });
    },
    off: jqLiteOff,
    one: function (element, type, fn) {
      element = jqLite(element);
      element.on(type, function onFn() {
        element.off(type, fn);
        element.off(type, onFn);
      });
      element.on(type, fn);
    },
    replaceWith: function (element, replaceNode) {
      var index, parent = element.parentNode;
      jqLiteDealoc(element);
      forEach(new JQLite(replaceNode), function (node) {
        if (index) {
          parent.insertBefore(node, index.nextSibling);
        } else {
          parent.replaceChild(node, element);
        }
        index = node;
      });
    },
    children: function (element) {
      var children = [];
      forEach(element.childNodes, function (element) {
        if (element.nodeType === 1)
          children.push(element);
      });
      return children;
    },
    contents: function (element) {
      return element.contentDocument || element.childNodes || [];
    },
    append: function (element, node) {
      forEach(new JQLite(node), function (child) {
        if (element.nodeType === 1 || element.nodeType === 11) {
          element.appendChild(child);
        }
      });
    },
    prepend: function (element, node) {
      if (element.nodeType === 1) {
        var index = element.firstChild;
        forEach(new JQLite(node), function (child) {
          element.insertBefore(child, index);
        });
      }
    },
    wrap: function (element, wrapNode) {
      wrapNode = jqLite(wrapNode)[0];
      var parent = element.parentNode;
      if (parent) {
        parent.replaceChild(wrapNode, element);
      }
      wrapNode.appendChild(element);
    },
    remove: function (element) {
      jqLiteDealoc(element);
      var parent = element.parentNode;
      if (parent)
        parent.removeChild(element);
    },
    after: function (element, newElement) {
      var index = element, parent = element.parentNode;
      forEach(new JQLite(newElement), function (node) {
        parent.insertBefore(node, index.nextSibling);
        index = node;
      });
    },
    addClass: jqLiteAddClass,
    removeClass: jqLiteRemoveClass,
    toggleClass: function (element, selector, condition) {
      if (selector) {
        forEach(selector.split(' '), function (className) {
          var classCondition = condition;
          if (isUndefined(classCondition)) {
            classCondition = !jqLiteHasClass(element, className);
          }
          (classCondition ? jqLiteAddClass : jqLiteRemoveClass)(element, className);
        });
      }
    },
    parent: function (element) {
      var parent = element.parentNode;
      return parent && parent.nodeType !== 11 ? parent : null;
    },
    next: function (element) {
      if (element.nextElementSibling) {
        return element.nextElementSibling;
      }
      var elm = element.nextSibling;
      while (elm != null && elm.nodeType !== 1) {
        elm = elm.nextSibling;
      }
      return elm;
    },
    find: function (element, selector) {
      if (element.getElementsByTagName) {
        return element.getElementsByTagName(selector);
      } else {
        return [];
      }
    },
    clone: jqLiteClone,
    triggerHandler: function (element, eventName, eventData) {
      var eventFns = (jqLiteExpandoStore(element, 'events') || {})[eventName];
      eventData = eventData || [];
      var event = [{
            preventDefault: noop,
            stopPropagation: noop
          }];
      forEach(eventFns, function (fn) {
        fn.apply(element, event.concat(eventData));
      });
    }
  }, function (fn, name) {
    JQLite.prototype[name] = function (arg1, arg2, arg3) {
      var value;
      for (var i = 0; i < this.length; i++) {
        if (isUndefined(value)) {
          value = fn(this[i], arg1, arg2, arg3);
          if (isDefined(value)) {
            value = jqLite(value);
          }
        } else {
          jqLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
        }
      }
      return isDefined(value) ? value : this;
    };
    JQLite.prototype.bind = JQLite.prototype.on;
    JQLite.prototype.unbind = JQLite.prototype.off;
  });
  function hashKey(obj) {
    var objType = typeof obj, key;
    if (objType == 'object' && obj !== null) {
      if (typeof (key = obj.$$hashKey) == 'function') {
        key = obj.$$hashKey();
      } else if (key === undefined) {
        key = obj.$$hashKey = nextUid();
      }
    } else {
      key = obj;
    }
    return objType + ':' + key;
  }
  function HashMap(array) {
    forEach(array, this.put, this);
  }
  HashMap.prototype = {
    put: function (key, value) {
      this[hashKey(key)] = value;
    },
    get: function (key) {
      return this[hashKey(key)];
    },
    remove: function (key) {
      var value = this[key = hashKey(key)];
      delete this[key];
      return value;
    }
  };
  var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
  var FN_ARG_SPLIT = /,/;
  var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
  var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
  var $injectorMinErr = minErr('$injector');
  function annotate(fn) {
    var $inject, fnText, argDecl, last;
    if (typeof fn == 'function') {
      if (!($inject = fn.$inject)) {
        $inject = [];
        if (fn.length) {
          fnText = fn.toString().replace(STRIP_COMMENTS, '');
          argDecl = fnText.match(FN_ARGS);
          forEach(argDecl[1].split(FN_ARG_SPLIT), function (arg) {
            arg.replace(FN_ARG, function (all, underscore, name) {
              $inject.push(name);
            });
          });
        }
        fn.$inject = $inject;
      }
    } else if (isArray(fn)) {
      last = fn.length - 1;
      assertArgFn(fn[last], 'fn');
      $inject = fn.slice(0, last);
    } else {
      assertArgFn(fn, 'fn', true);
    }
    return $inject;
  }
  function createInjector(modulesToLoad) {
    var INSTANTIATING = {}, providerSuffix = 'Provider', path = [], loadedModules = new HashMap(), providerCache = {
        $provide: {
          provider: supportObject(provider),
          factory: supportObject(factory),
          service: supportObject(service),
          value: supportObject(value),
          constant: supportObject(constant),
          decorator: decorator
        }
      }, providerInjector = providerCache.$injector = createInternalInjector(providerCache, function () {
        throw $injectorMinErr('unpr', 'Unknown provider: {0}', path.join(' <- '));
      }), instanceCache = {}, instanceInjector = instanceCache.$injector = createInternalInjector(instanceCache, function (servicename) {
        var provider = providerInjector.get(servicename + providerSuffix);
        return instanceInjector.invoke(provider.$get, provider);
      });
    forEach(loadModules(modulesToLoad), function (fn) {
      instanceInjector.invoke(fn || noop);
    });
    return instanceInjector;
    function supportObject(delegate) {
      return function (key, value) {
        if (isObject(key)) {
          forEach(key, reverseParams(delegate));
        } else {
          return delegate(key, value);
        }
      };
    }
    function provider(name, provider_) {
      assertNotHasOwnProperty(name, 'service');
      if (isFunction(provider_) || isArray(provider_)) {
        provider_ = providerInjector.instantiate(provider_);
      }
      if (!provider_.$get) {
        throw $injectorMinErr('pget', 'Provider \'{0}\' must define $get factory method.', name);
      }
      return providerCache[name + providerSuffix] = provider_;
    }
    function factory(name, factoryFn) {
      return provider(name, { $get: factoryFn });
    }
    function service(name, constructor) {
      return factory(name, [
        '$injector',
        function ($injector) {
          return $injector.instantiate(constructor);
        }
      ]);
    }
    function value(name, val) {
      return factory(name, valueFn(val));
    }
    function constant(name, value) {
      assertNotHasOwnProperty(name, 'constant');
      providerCache[name] = value;
      instanceCache[name] = value;
    }
    function decorator(serviceName, decorFn) {
      var origProvider = providerInjector.get(serviceName + providerSuffix), orig$get = origProvider.$get;
      origProvider.$get = function () {
        var origInstance = instanceInjector.invoke(orig$get, origProvider);
        return instanceInjector.invoke(decorFn, null, { $delegate: origInstance });
      };
    }
    function loadModules(modulesToLoad) {
      var runBlocks = [], moduleFn, invokeQueue, i, ii;
      forEach(modulesToLoad, function (module) {
        if (loadedModules.get(module))
          return;
        loadedModules.put(module, true);
        try {
          if (isString(module)) {
            moduleFn = angularModule(module);
            runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks);
            for (invokeQueue = moduleFn._invokeQueue, i = 0, ii = invokeQueue.length; i < ii; i++) {
              var invokeArgs = invokeQueue[i], provider = providerInjector.get(invokeArgs[0]);
              provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
            }
          } else if (isFunction(module)) {
            runBlocks.push(providerInjector.invoke(module));
          } else if (isArray(module)) {
            runBlocks.push(providerInjector.invoke(module));
          } else {
            assertArgFn(module, 'module');
          }
        } catch (e) {
          if (isArray(module)) {
            module = module[module.length - 1];
          }
          if (e.message && e.stack && e.stack.indexOf(e.message) == -1) {
            e = e.message + '\n' + e.stack;
          }
          throw $injectorMinErr('modulerr', 'Failed to instantiate module {0} due to:\n{1}', module, e.stack || e.message || e);
        }
      });
      return runBlocks;
    }
    function createInternalInjector(cache, factory) {
      function getService(serviceName) {
        if (cache.hasOwnProperty(serviceName)) {
          if (cache[serviceName] === INSTANTIATING) {
            throw $injectorMinErr('cdep', 'Circular dependency found: {0}', path.join(' <- '));
          }
          return cache[serviceName];
        } else {
          try {
            path.unshift(serviceName);
            cache[serviceName] = INSTANTIATING;
            return cache[serviceName] = factory(serviceName);
          } catch (err) {
            if (cache[serviceName] === INSTANTIATING) {
              delete cache[serviceName];
            }
            throw err;
          } finally {
            path.shift();
          }
        }
      }
      function invoke(fn, self, locals) {
        var args = [], $inject = annotate(fn), length, i, key;
        for (i = 0, length = $inject.length; i < length; i++) {
          key = $inject[i];
          if (typeof key !== 'string') {
            throw $injectorMinErr('itkn', 'Incorrect injection token! Expected service name as string, got {0}', key);
          }
          args.push(locals && locals.hasOwnProperty(key) ? locals[key] : getService(key));
        }
        if (!fn.$inject) {
          fn = fn[length];
        }
        return fn.apply(self, args);
      }
      function instantiate(Type, locals) {
        var Constructor = function () {
          }, instance, returnedValue;
        Constructor.prototype = (isArray(Type) ? Type[Type.length - 1] : Type).prototype;
        instance = new Constructor();
        returnedValue = invoke(Type, instance, locals);
        return isObject(returnedValue) || isFunction(returnedValue) ? returnedValue : instance;
      }
      return {
        invoke: invoke,
        instantiate: instantiate,
        get: getService,
        annotate: annotate,
        has: function (name) {
          return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name);
        }
      };
    }
  }
  function $AnchorScrollProvider() {
    var autoScrollingEnabled = true;
    this.disableAutoScrolling = function () {
      autoScrollingEnabled = false;
    };
    this.$get = [
      '$window',
      '$location',
      '$rootScope',
      function ($window, $location, $rootScope) {
        var document = $window.document;
        function getFirstAnchor(list) {
          var result = null;
          forEach(list, function (element) {
            if (!result && lowercase(element.nodeName) === 'a')
              result = element;
          });
          return result;
        }
        function scroll() {
          var hash = $location.hash(), elm;
          if (!hash)
            $window.scrollTo(0, 0);
          else if (elm = document.getElementById(hash))
            elm.scrollIntoView();
          else if (elm = getFirstAnchor(document.getElementsByName(hash)))
            elm.scrollIntoView();
          else if (hash === 'top')
            $window.scrollTo(0, 0);
        }
        if (autoScrollingEnabled) {
          $rootScope.$watch(function autoScrollWatch() {
            return $location.hash();
          }, function autoScrollWatchAction() {
            $rootScope.$evalAsync(scroll);
          });
        }
        return scroll;
      }
    ];
  }
  var $animateMinErr = minErr('$animate');
  var $AnimateProvider = [
      '$provide',
      function ($provide) {
        this.$$selectors = {};
        this.register = function (name, factory) {
          var key = name + '-animation';
          if (name && name.charAt(0) != '.')
            throw $animateMinErr('notcsel', 'Expecting class selector starting with \'.\' got \'{0}\'.', name);
          this.$$selectors[name.substr(1)] = key;
          $provide.factory(key, factory);
        };
        this.classNameFilter = function (expression) {
          if (arguments.length === 1) {
            this.$$classNameFilter = expression instanceof RegExp ? expression : null;
          }
          return this.$$classNameFilter;
        };
        this.$get = [
          '$timeout',
          '$$asyncCallback',
          function ($timeout, $$asyncCallback) {
            function async(fn) {
              fn && $$asyncCallback(fn);
            }
            return {
              enter: function (element, parent, after, done) {
                if (after) {
                  after.after(element);
                } else {
                  if (!parent || !parent[0]) {
                    parent = after.parent();
                  }
                  parent.append(element);
                }
                async(done);
              },
              leave: function (element, done) {
                element.remove();
                async(done);
              },
              move: function (element, parent, after, done) {
                this.enter(element, parent, after, done);
              },
              addClass: function (element, className, done) {
                className = isString(className) ? className : isArray(className) ? className.join(' ') : '';
                forEach(element, function (element) {
                  jqLiteAddClass(element, className);
                });
                async(done);
              },
              removeClass: function (element, className, done) {
                className = isString(className) ? className : isArray(className) ? className.join(' ') : '';
                forEach(element, function (element) {
                  jqLiteRemoveClass(element, className);
                });
                async(done);
              },
              setClass: function (element, add, remove, done) {
                forEach(element, function (element) {
                  jqLiteAddClass(element, add);
                  jqLiteRemoveClass(element, remove);
                });
                async(done);
              },
              enabled: noop
            };
          }
        ];
      }
    ];
  function $$AsyncCallbackProvider() {
    this.$get = [
      '$$rAF',
      '$timeout',
      function ($$rAF, $timeout) {
        return $$rAF.supported ? function (fn) {
          return $$rAF(fn);
        } : function (fn) {
          return $timeout(fn, 0, false);
        };
      }
    ];
  }
  function Browser(window, document, $log, $sniffer) {
    var self = this, rawDocument = document[0], location = window.location, history = window.history, setTimeout = window.setTimeout, clearTimeout = window.clearTimeout, pendingDeferIds = {};
    self.isMock = false;
    var outstandingRequestCount = 0;
    var outstandingRequestCallbacks = [];
    self.$$completeOutstandingRequest = completeOutstandingRequest;
    self.$$incOutstandingRequestCount = function () {
      outstandingRequestCount++;
    };
    function completeOutstandingRequest(fn) {
      try {
        fn.apply(null, sliceArgs(arguments, 1));
      } finally {
        outstandingRequestCount--;
        if (outstandingRequestCount === 0) {
          while (outstandingRequestCallbacks.length) {
            try {
              outstandingRequestCallbacks.pop()();
            } catch (e) {
              $log.error(e);
            }
          }
        }
      }
    }
    self.notifyWhenNoOutstandingRequests = function (callback) {
      forEach(pollFns, function (pollFn) {
        pollFn();
      });
      if (outstandingRequestCount === 0) {
        callback();
      } else {
        outstandingRequestCallbacks.push(callback);
      }
    };
    var pollFns = [], pollTimeout;
    self.addPollFn = function (fn) {
      if (isUndefined(pollTimeout))
        startPoller(100, setTimeout);
      pollFns.push(fn);
      return fn;
    };
    function startPoller(interval, setTimeout) {
      (function check() {
        forEach(pollFns, function (pollFn) {
          pollFn();
        });
        pollTimeout = setTimeout(check, interval);
      }());
    }
    var lastBrowserUrl = location.href, baseElement = document.find('base'), newLocation = null;
    self.url = function (url, replace) {
      if (location !== window.location)
        location = window.location;
      if (history !== window.history)
        history = window.history;
      if (url) {
        if (lastBrowserUrl == url)
          return;
        lastBrowserUrl = url;
        if ($sniffer.history) {
          if (replace)
            history.replaceState(null, '', url);
          else {
            history.pushState(null, '', url);
            baseElement.attr('href', baseElement.attr('href'));
          }
        } else {
          newLocation = url;
          if (replace) {
            location.replace(url);
          } else {
            location.href = url;
          }
        }
        return self;
      } else {
        return newLocation || location.href.replace(/%27/g, '\'');
      }
    };
    var urlChangeListeners = [], urlChangeInit = false;
    function fireUrlChange() {
      newLocation = null;
      if (lastBrowserUrl == self.url())
        return;
      lastBrowserUrl = self.url();
      forEach(urlChangeListeners, function (listener) {
        listener(self.url());
      });
    }
    self.onUrlChange = function (callback) {
      if (!urlChangeInit) {
        if ($sniffer.history)
          jqLite(window).on('popstate', fireUrlChange);
        if ($sniffer.hashchange)
          jqLite(window).on('hashchange', fireUrlChange);
        else
          self.addPollFn(fireUrlChange);
        urlChangeInit = true;
      }
      urlChangeListeners.push(callback);
      return callback;
    };
    self.baseHref = function () {
      var href = baseElement.attr('href');
      return href ? href.replace(/^(https?\:)?\/\/[^\/]*/, '') : '';
    };
    var lastCookies = {};
    var lastCookieString = '';
    var cookiePath = self.baseHref();
    self.cookies = function (name, value) {
      var cookieLength, cookieArray, cookie, i, index;
      if (name) {
        if (value === undefined) {
          rawDocument.cookie = escape(name) + '=;path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:00 GMT';
        } else {
          if (isString(value)) {
            cookieLength = (rawDocument.cookie = escape(name) + '=' + escape(value) + ';path=' + cookiePath).length + 1;
            if (cookieLength > 4096) {
              $log.warn('Cookie \'' + name + '\' possibly not set or overflowed because it was too large (' + cookieLength + ' > 4096 bytes)!');
            }
          }
        }
      } else {
        if (rawDocument.cookie !== lastCookieString) {
          lastCookieString = rawDocument.cookie;
          cookieArray = lastCookieString.split('; ');
          lastCookies = {};
          for (i = 0; i < cookieArray.length; i++) {
            cookie = cookieArray[i];
            index = cookie.indexOf('=');
            if (index > 0) {
              name = unescape(cookie.substring(0, index));
              if (lastCookies[name] === undefined) {
                lastCookies[name] = unescape(cookie.substring(index + 1));
              }
            }
          }
        }
        return lastCookies;
      }
    };
    self.defer = function (fn, delay) {
      var timeoutId;
      outstandingRequestCount++;
      timeoutId = setTimeout(function () {
        delete pendingDeferIds[timeoutId];
        completeOutstandingRequest(fn);
      }, delay || 0);
      pendingDeferIds[timeoutId] = true;
      return timeoutId;
    };
    self.defer.cancel = function (deferId) {
      if (pendingDeferIds[deferId]) {
        delete pendingDeferIds[deferId];
        clearTimeout(deferId);
        completeOutstandingRequest(noop);
        return true;
      }
      return false;
    };
  }
  function $BrowserProvider() {
    this.$get = [
      '$window',
      '$log',
      '$sniffer',
      '$document',
      function ($window, $log, $sniffer, $document) {
        return new Browser($window, $document, $log, $sniffer);
      }
    ];
  }
  function $CacheFactoryProvider() {
    this.$get = function () {
      var caches = {};
      function cacheFactory(cacheId, options) {
        if (cacheId in caches) {
          throw minErr('$cacheFactory')('iid', 'CacheId \'{0}\' is already taken!', cacheId);
        }
        var size = 0, stats = extend({}, options, { id: cacheId }), data = {}, capacity = options && options.capacity || Number.MAX_VALUE, lruHash = {}, freshEnd = null, staleEnd = null;
        return caches[cacheId] = {
          put: function (key, value) {
            if (capacity < Number.MAX_VALUE) {
              var lruEntry = lruHash[key] || (lruHash[key] = { key: key });
              refresh(lruEntry);
            }
            if (isUndefined(value))
              return;
            if (!(key in data))
              size++;
            data[key] = value;
            if (size > capacity) {
              this.remove(staleEnd.key);
            }
            return value;
          },
          get: function (key) {
            if (capacity < Number.MAX_VALUE) {
              var lruEntry = lruHash[key];
              if (!lruEntry)
                return;
              refresh(lruEntry);
            }
            return data[key];
          },
          remove: function (key) {
            if (capacity < Number.MAX_VALUE) {
              var lruEntry = lruHash[key];
              if (!lruEntry)
                return;
              if (lruEntry == freshEnd)
                freshEnd = lruEntry.p;
              if (lruEntry == staleEnd)
                staleEnd = lruEntry.n;
              link(lruEntry.n, lruEntry.p);
              delete lruHash[key];
            }
            delete data[key];
            size--;
          },
          removeAll: function () {
            data = {};
            size = 0;
            lruHash = {};
            freshEnd = staleEnd = null;
          },
          destroy: function () {
            data = null;
            stats = null;
            lruHash = null;
            delete caches[cacheId];
          },
          info: function () {
            return extend({}, stats, { size: size });
          }
        };
        function refresh(entry) {
          if (entry != freshEnd) {
            if (!staleEnd) {
              staleEnd = entry;
            } else if (staleEnd == entry) {
              staleEnd = entry.n;
            }
            link(entry.n, entry.p);
            link(entry, freshEnd);
            freshEnd = entry;
            freshEnd.n = null;
          }
        }
        function link(nextEntry, prevEntry) {
          if (nextEntry != prevEntry) {
            if (nextEntry)
              nextEntry.p = prevEntry;
            if (prevEntry)
              prevEntry.n = nextEntry;
          }
        }
      }
      cacheFactory.info = function () {
        var info = {};
        forEach(caches, function (cache, cacheId) {
          info[cacheId] = cache.info();
        });
        return info;
      };
      cacheFactory.get = function (cacheId) {
        return caches[cacheId];
      };
      return cacheFactory;
    };
  }
  function $TemplateCacheProvider() {
    this.$get = [
      '$cacheFactory',
      function ($cacheFactory) {
        return $cacheFactory('templates');
      }
    ];
  }
  var $compileMinErr = minErr('$compile');
  $CompileProvider.$inject = [
    '$provide',
    '$$sanitizeUriProvider'
  ];
  function $CompileProvider($provide, $$sanitizeUriProvider) {
    var hasDirectives = {}, Suffix = 'Directive', COMMENT_DIRECTIVE_REGEXP = /^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/, CLASS_DIRECTIVE_REGEXP = /(([\d\w\-_]+)(?:\:([^;]+))?;?)/, TABLE_CONTENT_REGEXP = /^<\s*(tr|th|td|thead|tbody|tfoot)(\s+[^>]*)?>/i;
    var EVENT_HANDLER_ATTR_REGEXP = /^(on[a-z]+|formaction)$/;
    this.directive = function registerDirective(name, directiveFactory) {
      assertNotHasOwnProperty(name, 'directive');
      if (isString(name)) {
        assertArg(directiveFactory, 'directiveFactory');
        if (!hasDirectives.hasOwnProperty(name)) {
          hasDirectives[name] = [];
          $provide.factory(name + Suffix, [
            '$injector',
            '$exceptionHandler',
            function ($injector, $exceptionHandler) {
              var directives = [];
              forEach(hasDirectives[name], function (directiveFactory, index) {
                try {
                  var directive = $injector.invoke(directiveFactory);
                  if (isFunction(directive)) {
                    directive = { compile: valueFn(directive) };
                  } else if (!directive.compile && directive.link) {
                    directive.compile = valueFn(directive.link);
                  }
                  directive.priority = directive.priority || 0;
                  directive.index = index;
                  directive.name = directive.name || name;
                  directive.require = directive.require || directive.controller && directive.name;
                  directive.restrict = directive.restrict || 'A';
                  directives.push(directive);
                } catch (e) {
                  $exceptionHandler(e);
                }
              });
              return directives;
            }
          ]);
        }
        hasDirectives[name].push(directiveFactory);
      } else {
        forEach(name, reverseParams(registerDirective));
      }
      return this;
    };
    this.aHrefSanitizationWhitelist = function (regexp) {
      if (isDefined(regexp)) {
        $$sanitizeUriProvider.aHrefSanitizationWhitelist(regexp);
        return this;
      } else {
        return $$sanitizeUriProvider.aHrefSanitizationWhitelist();
      }
    };
    this.imgSrcSanitizationWhitelist = function (regexp) {
      if (isDefined(regexp)) {
        $$sanitizeUriProvider.imgSrcSanitizationWhitelist(regexp);
        return this;
      } else {
        return $$sanitizeUriProvider.imgSrcSanitizationWhitelist();
      }
    };
    this.$get = [
      '$injector',
      '$interpolate',
      '$exceptionHandler',
      '$http',
      '$templateCache',
      '$parse',
      '$controller',
      '$rootScope',
      '$document',
      '$sce',
      '$animate',
      '$$sanitizeUri',
      function ($injector, $interpolate, $exceptionHandler, $http, $templateCache, $parse, $controller, $rootScope, $document, $sce, $animate, $$sanitizeUri) {
        var Attributes = function (element, attr) {
          this.$$element = element;
          this.$attr = attr || {};
        };
        Attributes.prototype = {
          $normalize: directiveNormalize,
          $addClass: function (classVal) {
            if (classVal && classVal.length > 0) {
              $animate.addClass(this.$$element, classVal);
            }
          },
          $removeClass: function (classVal) {
            if (classVal && classVal.length > 0) {
              $animate.removeClass(this.$$element, classVal);
            }
          },
          $updateClass: function (newClasses, oldClasses) {
            var toAdd = tokenDifference(newClasses, oldClasses);
            var toRemove = tokenDifference(oldClasses, newClasses);
            if (toAdd.length === 0) {
              $animate.removeClass(this.$$element, toRemove);
            } else if (toRemove.length === 0) {
              $animate.addClass(this.$$element, toAdd);
            } else {
              $animate.setClass(this.$$element, toAdd, toRemove);
            }
          },
          $set: function (key, value, writeAttr, attrName) {
            var booleanKey = getBooleanAttrName(this.$$element[0], key), normalizedVal, nodeName;
            if (booleanKey) {
              this.$$element.prop(key, value);
              attrName = booleanKey;
            }
            this[key] = value;
            if (attrName) {
              this.$attr[key] = attrName;
            } else {
              attrName = this.$attr[key];
              if (!attrName) {
                this.$attr[key] = attrName = snake_case(key, '-');
              }
            }
            nodeName = nodeName_(this.$$element);
            if (nodeName === 'A' && key === 'href' || nodeName === 'IMG' && key === 'src') {
              this[key] = value = $$sanitizeUri(value, key === 'src');
            }
            if (writeAttr !== false) {
              if (value === null || value === undefined) {
                this.$$element.removeAttr(attrName);
              } else {
                this.$$element.attr(attrName, value);
              }
            }
            var $$observers = this.$$observers;
            $$observers && forEach($$observers[key], function (fn) {
              try {
                fn(value);
              } catch (e) {
                $exceptionHandler(e);
              }
            });
          },
          $observe: function (key, fn) {
            var attrs = this, $$observers = attrs.$$observers || (attrs.$$observers = {}), listeners = $$observers[key] || ($$observers[key] = []);
            listeners.push(fn);
            $rootScope.$evalAsync(function () {
              if (!listeners.$$inter) {
                fn(attrs[key]);
              }
            });
            return fn;
          }
        };
        var startSymbol = $interpolate.startSymbol(), endSymbol = $interpolate.endSymbol(), denormalizeTemplate = startSymbol == '{{' || endSymbol == '}}' ? identity : function denormalizeTemplate(template) {
            return template.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol);
          }, NG_ATTR_BINDING = /^ngAttr[A-Z]/;
        return compile;
        function compile($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext) {
          if (!($compileNodes instanceof jqLite)) {
            $compileNodes = jqLite($compileNodes);
          }
          forEach($compileNodes, function (node, index) {
            if (node.nodeType == 3 && node.nodeValue.match(/\S+/)) {
              $compileNodes[index] = node = jqLite(node).wrap('<span></span>').parent()[0];
            }
          });
          var compositeLinkFn = compileNodes($compileNodes, transcludeFn, $compileNodes, maxPriority, ignoreDirective, previousCompileContext);
          safeAddClass($compileNodes, 'ng-scope');
          return function publicLinkFn(scope, cloneConnectFn, transcludeControllers) {
            assertArg(scope, 'scope');
            var $linkNode = cloneConnectFn ? JQLitePrototype.clone.call($compileNodes) : $compileNodes;
            forEach(transcludeControllers, function (instance, name) {
              $linkNode.data('$' + name + 'Controller', instance);
            });
            for (var i = 0, ii = $linkNode.length; i < ii; i++) {
              var node = $linkNode[i], nodeType = node.nodeType;
              if (nodeType === 1 || nodeType === 9) {
                $linkNode.eq(i).data('$scope', scope);
              }
            }
            if (cloneConnectFn)
              cloneConnectFn($linkNode, scope);
            if (compositeLinkFn)
              compositeLinkFn(scope, $linkNode, $linkNode);
            return $linkNode;
          };
        }
        function safeAddClass($element, className) {
          try {
            $element.addClass(className);
          } catch (e) {
          }
        }
        function compileNodes(nodeList, transcludeFn, $rootElement, maxPriority, ignoreDirective, previousCompileContext) {
          var linkFns = [], attrs, directives, nodeLinkFn, childNodes, childLinkFn, linkFnFound;
          for (var i = 0; i < nodeList.length; i++) {
            attrs = new Attributes();
            directives = collectDirectives(nodeList[i], [], attrs, i === 0 ? maxPriority : undefined, ignoreDirective);
            nodeLinkFn = directives.length ? applyDirectivesToNode(directives, nodeList[i], attrs, transcludeFn, $rootElement, null, [], [], previousCompileContext) : null;
            if (nodeLinkFn && nodeLinkFn.scope) {
              safeAddClass(jqLite(nodeList[i]), 'ng-scope');
            }
            childLinkFn = nodeLinkFn && nodeLinkFn.terminal || !(childNodes = nodeList[i].childNodes) || !childNodes.length ? null : compileNodes(childNodes, nodeLinkFn ? nodeLinkFn.transclude : transcludeFn);
            linkFns.push(nodeLinkFn, childLinkFn);
            linkFnFound = linkFnFound || nodeLinkFn || childLinkFn;
            previousCompileContext = null;
          }
          return linkFnFound ? compositeLinkFn : null;
          function compositeLinkFn(scope, nodeList, $rootElement, boundTranscludeFn) {
            var nodeLinkFn, childLinkFn, node, $node, childScope, childTranscludeFn, i, ii, n;
            var nodeListLength = nodeList.length, stableNodeList = new Array(nodeListLength);
            for (i = 0; i < nodeListLength; i++) {
              stableNodeList[i] = nodeList[i];
            }
            for (i = 0, n = 0, ii = linkFns.length; i < ii; n++) {
              node = stableNodeList[n];
              nodeLinkFn = linkFns[i++];
              childLinkFn = linkFns[i++];
              $node = jqLite(node);
              if (nodeLinkFn) {
                if (nodeLinkFn.scope) {
                  childScope = scope.$new();
                  $node.data('$scope', childScope);
                } else {
                  childScope = scope;
                }
                childTranscludeFn = nodeLinkFn.transclude;
                if (childTranscludeFn || !boundTranscludeFn && transcludeFn) {
                  nodeLinkFn(childLinkFn, childScope, node, $rootElement, createBoundTranscludeFn(scope, childTranscludeFn || transcludeFn));
                } else {
                  nodeLinkFn(childLinkFn, childScope, node, $rootElement, boundTranscludeFn);
                }
              } else if (childLinkFn) {
                childLinkFn(scope, node.childNodes, undefined, boundTranscludeFn);
              }
            }
          }
        }
        function createBoundTranscludeFn(scope, transcludeFn) {
          return function boundTranscludeFn(transcludedScope, cloneFn, controllers) {
            var scopeCreated = false;
            if (!transcludedScope) {
              transcludedScope = scope.$new();
              transcludedScope.$$transcluded = true;
              scopeCreated = true;
            }
            var clone = transcludeFn(transcludedScope, cloneFn, controllers);
            if (scopeCreated) {
              clone.on('$destroy', bind(transcludedScope, transcludedScope.$destroy));
            }
            return clone;
          };
        }
        function collectDirectives(node, directives, attrs, maxPriority, ignoreDirective) {
          var nodeType = node.nodeType, attrsMap = attrs.$attr, match, className;
          switch (nodeType) {
          case 1:
            addDirective(directives, directiveNormalize(nodeName_(node).toLowerCase()), 'E', maxPriority, ignoreDirective);
            for (var attr, name, nName, ngAttrName, value, nAttrs = node.attributes, j = 0, jj = nAttrs && nAttrs.length; j < jj; j++) {
              var attrStartName = false;
              var attrEndName = false;
              attr = nAttrs[j];
              if (!msie || msie >= 8 || attr.specified) {
                name = attr.name;
                ngAttrName = directiveNormalize(name);
                if (NG_ATTR_BINDING.test(ngAttrName)) {
                  name = snake_case(ngAttrName.substr(6), '-');
                }
                var directiveNName = ngAttrName.replace(/(Start|End)$/, '');
                if (ngAttrName === directiveNName + 'Start') {
                  attrStartName = name;
                  attrEndName = name.substr(0, name.length - 5) + 'end';
                  name = name.substr(0, name.length - 6);
                }
                nName = directiveNormalize(name.toLowerCase());
                attrsMap[nName] = name;
                attrs[nName] = value = trim(attr.value);
                if (getBooleanAttrName(node, nName)) {
                  attrs[nName] = true;
                }
                addAttrInterpolateDirective(node, directives, value, nName);
                addDirective(directives, nName, 'A', maxPriority, ignoreDirective, attrStartName, attrEndName);
              }
            }
            className = node.className;
            if (isString(className) && className !== '') {
              while (match = CLASS_DIRECTIVE_REGEXP.exec(className)) {
                nName = directiveNormalize(match[2]);
                if (addDirective(directives, nName, 'C', maxPriority, ignoreDirective)) {
                  attrs[nName] = trim(match[3]);
                }
                className = className.substr(match.index + match[0].length);
              }
            }
            break;
          case 3:
            addTextInterpolateDirective(directives, node.nodeValue);
            break;
          case 8:
            try {
              match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue);
              if (match) {
                nName = directiveNormalize(match[1]);
                if (addDirective(directives, nName, 'M', maxPriority, ignoreDirective)) {
                  attrs[nName] = trim(match[2]);
                }
              }
            } catch (e) {
            }
            break;
          }
          directives.sort(byPriority);
          return directives;
        }
        function groupScan(node, attrStart, attrEnd) {
          var nodes = [];
          var depth = 0;
          if (attrStart && node.hasAttribute && node.hasAttribute(attrStart)) {
            var startNode = node;
            do {
              if (!node) {
                throw $compileMinErr('uterdir', 'Unterminated attribute, found \'{0}\' but no matching \'{1}\' found.', attrStart, attrEnd);
              }
              if (node.nodeType == 1) {
                if (node.hasAttribute(attrStart))
                  depth++;
                if (node.hasAttribute(attrEnd))
                  depth--;
              }
              nodes.push(node);
              node = node.nextSibling;
            } while (depth > 0);
          } else {
            nodes.push(node);
          }
          return jqLite(nodes);
        }
        function groupElementsLinkFnWrapper(linkFn, attrStart, attrEnd) {
          return function (scope, element, attrs, controllers, transcludeFn) {
            element = groupScan(element[0], attrStart, attrEnd);
            return linkFn(scope, element, attrs, controllers, transcludeFn);
          };
        }
        function applyDirectivesToNode(directives, compileNode, templateAttrs, transcludeFn, jqCollection, originalReplaceDirective, preLinkFns, postLinkFns, previousCompileContext) {
          previousCompileContext = previousCompileContext || {};
          var terminalPriority = -Number.MAX_VALUE, newScopeDirective, controllerDirectives = previousCompileContext.controllerDirectives, newIsolateScopeDirective = previousCompileContext.newIsolateScopeDirective, templateDirective = previousCompileContext.templateDirective, nonTlbTranscludeDirective = previousCompileContext.nonTlbTranscludeDirective, hasTranscludeDirective = false, hasElementTranscludeDirective = previousCompileContext.hasElementTranscludeDirective, $compileNode = templateAttrs.$$element = jqLite(compileNode), directive, directiveName, $template, replaceDirective = originalReplaceDirective, childTranscludeFn = transcludeFn, linkFn, directiveValue;
          for (var i = 0, ii = directives.length; i < ii; i++) {
            directive = directives[i];
            var attrStart = directive.$$start;
            var attrEnd = directive.$$end;
            if (attrStart) {
              $compileNode = groupScan(compileNode, attrStart, attrEnd);
            }
            $template = undefined;
            if (terminalPriority > directive.priority) {
              break;
            }
            if (directiveValue = directive.scope) {
              newScopeDirective = newScopeDirective || directive;
              if (!directive.templateUrl) {
                assertNoDuplicate('new/isolated scope', newIsolateScopeDirective, directive, $compileNode);
                if (isObject(directiveValue)) {
                  newIsolateScopeDirective = directive;
                }
              }
            }
            directiveName = directive.name;
            if (!directive.templateUrl && directive.controller) {
              directiveValue = directive.controller;
              controllerDirectives = controllerDirectives || {};
              assertNoDuplicate('\'' + directiveName + '\' controller', controllerDirectives[directiveName], directive, $compileNode);
              controllerDirectives[directiveName] = directive;
            }
            if (directiveValue = directive.transclude) {
              hasTranscludeDirective = true;
              if (!directive.$$tlb) {
                assertNoDuplicate('transclusion', nonTlbTranscludeDirective, directive, $compileNode);
                nonTlbTranscludeDirective = directive;
              }
              if (directiveValue == 'element') {
                hasElementTranscludeDirective = true;
                terminalPriority = directive.priority;
                $template = groupScan(compileNode, attrStart, attrEnd);
                $compileNode = templateAttrs.$$element = jqLite(document.createComment(' ' + directiveName + ': ' + templateAttrs[directiveName] + ' '));
                compileNode = $compileNode[0];
                replaceWith(jqCollection, jqLite(sliceArgs($template)), compileNode);
                childTranscludeFn = compile($template, transcludeFn, terminalPriority, replaceDirective && replaceDirective.name, { nonTlbTranscludeDirective: nonTlbTranscludeDirective });
              } else {
                $template = jqLite(jqLiteClone(compileNode)).contents();
                $compileNode.empty();
                childTranscludeFn = compile($template, transcludeFn);
              }
            }
            if (directive.template) {
              assertNoDuplicate('template', templateDirective, directive, $compileNode);
              templateDirective = directive;
              directiveValue = isFunction(directive.template) ? directive.template($compileNode, templateAttrs) : directive.template;
              directiveValue = denormalizeTemplate(directiveValue);
              if (directive.replace) {
                replaceDirective = directive;
                $template = directiveTemplateContents(directiveValue);
                compileNode = $template[0];
                if ($template.length != 1 || compileNode.nodeType !== 1) {
                  throw $compileMinErr('tplrt', 'Template for directive \'{0}\' must have exactly one root element. {1}', directiveName, '');
                }
                replaceWith(jqCollection, $compileNode, compileNode);
                var newTemplateAttrs = { $attr: {} };
                var templateDirectives = collectDirectives(compileNode, [], newTemplateAttrs);
                var unprocessedDirectives = directives.splice(i + 1, directives.length - (i + 1));
                if (newIsolateScopeDirective) {
                  markDirectivesAsIsolate(templateDirectives);
                }
                directives = directives.concat(templateDirectives).concat(unprocessedDirectives);
                mergeTemplateAttributes(templateAttrs, newTemplateAttrs);
                ii = directives.length;
              } else {
                $compileNode.html(directiveValue);
              }
            }
            if (directive.templateUrl) {
              assertNoDuplicate('template', templateDirective, directive, $compileNode);
              templateDirective = directive;
              if (directive.replace) {
                replaceDirective = directive;
              }
              nodeLinkFn = compileTemplateUrl(directives.splice(i, directives.length - i), $compileNode, templateAttrs, jqCollection, childTranscludeFn, preLinkFns, postLinkFns, {
                controllerDirectives: controllerDirectives,
                newIsolateScopeDirective: newIsolateScopeDirective,
                templateDirective: templateDirective,
                nonTlbTranscludeDirective: nonTlbTranscludeDirective
              });
              ii = directives.length;
            } else if (directive.compile) {
              try {
                linkFn = directive.compile($compileNode, templateAttrs, childTranscludeFn);
                if (isFunction(linkFn)) {
                  addLinkFns(null, linkFn, attrStart, attrEnd);
                } else if (linkFn) {
                  addLinkFns(linkFn.pre, linkFn.post, attrStart, attrEnd);
                }
              } catch (e) {
                $exceptionHandler(e, startingTag($compileNode));
              }
            }
            if (directive.terminal) {
              nodeLinkFn.terminal = true;
              terminalPriority = Math.max(terminalPriority, directive.priority);
            }
          }
          nodeLinkFn.scope = newScopeDirective && newScopeDirective.scope === true;
          nodeLinkFn.transclude = hasTranscludeDirective && childTranscludeFn;
          previousCompileContext.hasElementTranscludeDirective = hasElementTranscludeDirective;
          return nodeLinkFn;
          function addLinkFns(pre, post, attrStart, attrEnd) {
            if (pre) {
              if (attrStart)
                pre = groupElementsLinkFnWrapper(pre, attrStart, attrEnd);
              pre.require = directive.require;
              if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
                pre = cloneAndAnnotateFn(pre, { isolateScope: true });
              }
              preLinkFns.push(pre);
            }
            if (post) {
              if (attrStart)
                post = groupElementsLinkFnWrapper(post, attrStart, attrEnd);
              post.require = directive.require;
              if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
                post = cloneAndAnnotateFn(post, { isolateScope: true });
              }
              postLinkFns.push(post);
            }
          }
          function getControllers(require, $element, elementControllers) {
            var value, retrievalMethod = 'data', optional = false;
            if (isString(require)) {
              while ((value = require.charAt(0)) == '^' || value == '?') {
                require = require.substr(1);
                if (value == '^') {
                  retrievalMethod = 'inheritedData';
                }
                optional = optional || value == '?';
              }
              value = null;
              if (elementControllers && retrievalMethod === 'data') {
                value = elementControllers[require];
              }
              value = value || $element[retrievalMethod]('$' + require + 'Controller');
              if (!value && !optional) {
                throw $compileMinErr('ctreq', 'Controller \'{0}\', required by directive \'{1}\', can\'t be found!', require, directiveName);
              }
              return value;
            } else if (isArray(require)) {
              value = [];
              forEach(require, function (require) {
                value.push(getControllers(require, $element, elementControllers));
              });
            }
            return value;
          }
          function nodeLinkFn(childLinkFn, scope, linkNode, $rootElement, boundTranscludeFn) {
            var attrs, $element, i, ii, linkFn, controller, isolateScope, elementControllers = {}, transcludeFn;
            if (compileNode === linkNode) {
              attrs = templateAttrs;
            } else {
              attrs = shallowCopy(templateAttrs, new Attributes(jqLite(linkNode), templateAttrs.$attr));
            }
            $element = attrs.$$element;
            if (newIsolateScopeDirective) {
              var LOCAL_REGEXP = /^\s*([@=&])(\??)\s*(\w*)\s*$/;
              var $linkNode = jqLite(linkNode);
              isolateScope = scope.$new(true);
              if (templateDirective && templateDirective === newIsolateScopeDirective.$$originalDirective) {
                $linkNode.data('$isolateScope', isolateScope);
              } else {
                $linkNode.data('$isolateScopeNoTemplate', isolateScope);
              }
              safeAddClass($linkNode, 'ng-isolate-scope');
              forEach(newIsolateScopeDirective.scope, function (definition, scopeName) {
                var match = definition.match(LOCAL_REGEXP) || [], attrName = match[3] || scopeName, optional = match[2] == '?', mode = match[1], lastValue, parentGet, parentSet, compare;
                isolateScope.$$isolateBindings[scopeName] = mode + attrName;
                switch (mode) {
                case '@':
                  attrs.$observe(attrName, function (value) {
                    isolateScope[scopeName] = value;
                  });
                  attrs.$$observers[attrName].$$scope = scope;
                  if (attrs[attrName]) {
                    isolateScope[scopeName] = $interpolate(attrs[attrName])(scope);
                  }
                  break;
                case '=':
                  if (optional && !attrs[attrName]) {
                    return;
                  }
                  parentGet = $parse(attrs[attrName]);
                  if (parentGet.literal) {
                    compare = equals;
                  } else {
                    compare = function (a, b) {
                      return a === b;
                    };
                  }
                  parentSet = parentGet.assign || function () {
                    lastValue = isolateScope[scopeName] = parentGet(scope);
                    throw $compileMinErr('nonassign', 'Expression \'{0}\' used with directive \'{1}\' is non-assignable!', attrs[attrName], newIsolateScopeDirective.name);
                  };
                  lastValue = isolateScope[scopeName] = parentGet(scope);
                  isolateScope.$watch(function parentValueWatch() {
                    var parentValue = parentGet(scope);
                    if (!compare(parentValue, isolateScope[scopeName])) {
                      if (!compare(parentValue, lastValue)) {
                        isolateScope[scopeName] = parentValue;
                      } else {
                        parentSet(scope, parentValue = isolateScope[scopeName]);
                      }
                    }
                    return lastValue = parentValue;
                  }, null, parentGet.literal);
                  break;
                case '&':
                  parentGet = $parse(attrs[attrName]);
                  isolateScope[scopeName] = function (locals) {
                    return parentGet(scope, locals);
                  };
                  break;
                default:
                  throw $compileMinErr('iscp', 'Invalid isolate scope definition for directive \'{0}\'.' + ' Definition: {... {1}: \'{2}\' ...}', newIsolateScopeDirective.name, scopeName, definition);
                }
              });
            }
            transcludeFn = boundTranscludeFn && controllersBoundTransclude;
            if (controllerDirectives) {
              forEach(controllerDirectives, function (directive) {
                var locals = {
                    $scope: directive === newIsolateScopeDirective || directive.$$isolateScope ? isolateScope : scope,
                    $element: $element,
                    $attrs: attrs,
                    $transclude: transcludeFn
                  }, controllerInstance;
                controller = directive.controller;
                if (controller == '@') {
                  controller = attrs[directive.name];
                }
                controllerInstance = $controller(controller, locals);
                elementControllers[directive.name] = controllerInstance;
                if (!hasElementTranscludeDirective) {
                  $element.data('$' + directive.name + 'Controller', controllerInstance);
                }
                if (directive.controllerAs) {
                  locals.$scope[directive.controllerAs] = controllerInstance;
                }
              });
            }
            for (i = 0, ii = preLinkFns.length; i < ii; i++) {
              try {
                linkFn = preLinkFns[i];
                linkFn(linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.require, $element, elementControllers), transcludeFn);
              } catch (e) {
                $exceptionHandler(e, startingTag($element));
              }
            }
            var scopeToChild = scope;
            if (newIsolateScopeDirective && (newIsolateScopeDirective.template || newIsolateScopeDirective.templateUrl === null)) {
              scopeToChild = isolateScope;
            }
            childLinkFn && childLinkFn(scopeToChild, linkNode.childNodes, undefined, boundTranscludeFn);
            for (i = postLinkFns.length - 1; i >= 0; i--) {
              try {
                linkFn = postLinkFns[i];
                linkFn(linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.require, $element, elementControllers), transcludeFn);
              } catch (e) {
                $exceptionHandler(e, startingTag($element));
              }
            }
            function controllersBoundTransclude(scope, cloneAttachFn) {
              var transcludeControllers;
              if (arguments.length < 2) {
                cloneAttachFn = scope;
                scope = undefined;
              }
              if (hasElementTranscludeDirective) {
                transcludeControllers = elementControllers;
              }
              return boundTranscludeFn(scope, cloneAttachFn, transcludeControllers);
            }
          }
        }
        function markDirectivesAsIsolate(directives) {
          for (var j = 0, jj = directives.length; j < jj; j++) {
            directives[j] = inherit(directives[j], { $$isolateScope: true });
          }
        }
        function addDirective(tDirectives, name, location, maxPriority, ignoreDirective, startAttrName, endAttrName) {
          if (name === ignoreDirective)
            return null;
          var match = null;
          if (hasDirectives.hasOwnProperty(name)) {
            for (var directive, directives = $injector.get(name + Suffix), i = 0, ii = directives.length; i < ii; i++) {
              try {
                directive = directives[i];
                if ((maxPriority === undefined || maxPriority > directive.priority) && directive.restrict.indexOf(location) != -1) {
                  if (startAttrName) {
                    directive = inherit(directive, {
                      $$start: startAttrName,
                      $$end: endAttrName
                    });
                  }
                  tDirectives.push(directive);
                  match = directive;
                }
              } catch (e) {
                $exceptionHandler(e);
              }
            }
          }
          return match;
        }
        function mergeTemplateAttributes(dst, src) {
          var srcAttr = src.$attr, dstAttr = dst.$attr, $element = dst.$$element;
          forEach(dst, function (value, key) {
            if (key.charAt(0) != '$') {
              if (src[key]) {
                value += (key === 'style' ? ';' : ' ') + src[key];
              }
              dst.$set(key, value, true, srcAttr[key]);
            }
          });
          forEach(src, function (value, key) {
            if (key == 'class') {
              safeAddClass($element, value);
              dst['class'] = (dst['class'] ? dst['class'] + ' ' : '') + value;
            } else if (key == 'style') {
              $element.attr('style', $element.attr('style') + ';' + value);
              dst['style'] = (dst['style'] ? dst['style'] + ';' : '') + value;
            } else if (key.charAt(0) != '$' && !dst.hasOwnProperty(key)) {
              dst[key] = value;
              dstAttr[key] = srcAttr[key];
            }
          });
        }
        function directiveTemplateContents(template) {
          var type;
          template = trim(template);
          if (type = TABLE_CONTENT_REGEXP.exec(template)) {
            type = type[1].toLowerCase();
            var table = jqLite('<table>' + template + '</table>');
            if (/(thead|tbody|tfoot)/.test(type)) {
              return table.children(type);
            }
            table = table.children('tbody');
            if (type === 'tr') {
              return table.children('tr');
            }
            return table.children('tr').contents();
          }
          return jqLite('<div>' + template + '</div>').contents();
        }
        function compileTemplateUrl(directives, $compileNode, tAttrs, $rootElement, childTranscludeFn, preLinkFns, postLinkFns, previousCompileContext) {
          var linkQueue = [], afterTemplateNodeLinkFn, afterTemplateChildLinkFn, beforeTemplateCompileNode = $compileNode[0], origAsyncDirective = directives.shift(), derivedSyncDirective = extend({}, origAsyncDirective, {
              templateUrl: null,
              transclude: null,
              replace: null,
              $$originalDirective: origAsyncDirective
            }), templateUrl = isFunction(origAsyncDirective.templateUrl) ? origAsyncDirective.templateUrl($compileNode, tAttrs) : origAsyncDirective.templateUrl;
          $compileNode.empty();
          $http.get($sce.getTrustedResourceUrl(templateUrl), { cache: $templateCache }).success(function (content) {
            var compileNode, tempTemplateAttrs, $template, childBoundTranscludeFn;
            content = denormalizeTemplate(content);
            if (origAsyncDirective.replace) {
              $template = directiveTemplateContents(content);
              compileNode = $template[0];
              if ($template.length != 1 || compileNode.nodeType !== 1) {
                throw $compileMinErr('tplrt', 'Template for directive \'{0}\' must have exactly one root element. {1}', origAsyncDirective.name, templateUrl);
              }
              tempTemplateAttrs = { $attr: {} };
              replaceWith($rootElement, $compileNode, compileNode);
              var templateDirectives = collectDirectives(compileNode, [], tempTemplateAttrs);
              if (isObject(origAsyncDirective.scope)) {
                markDirectivesAsIsolate(templateDirectives);
              }
              directives = templateDirectives.concat(directives);
              mergeTemplateAttributes(tAttrs, tempTemplateAttrs);
            } else {
              compileNode = beforeTemplateCompileNode;
              $compileNode.html(content);
            }
            directives.unshift(derivedSyncDirective);
            afterTemplateNodeLinkFn = applyDirectivesToNode(directives, compileNode, tAttrs, childTranscludeFn, $compileNode, origAsyncDirective, preLinkFns, postLinkFns, previousCompileContext);
            forEach($rootElement, function (node, i) {
              if (node == compileNode) {
                $rootElement[i] = $compileNode[0];
              }
            });
            afterTemplateChildLinkFn = compileNodes($compileNode[0].childNodes, childTranscludeFn);
            while (linkQueue.length) {
              var scope = linkQueue.shift(), beforeTemplateLinkNode = linkQueue.shift(), linkRootElement = linkQueue.shift(), boundTranscludeFn = linkQueue.shift(), linkNode = $compileNode[0];
              if (beforeTemplateLinkNode !== beforeTemplateCompileNode) {
                var oldClasses = beforeTemplateLinkNode.className;
                if (!(previousCompileContext.hasElementTranscludeDirective && origAsyncDirective.replace)) {
                  linkNode = jqLiteClone(compileNode);
                }
                replaceWith(linkRootElement, jqLite(beforeTemplateLinkNode), linkNode);
                safeAddClass(jqLite(linkNode), oldClasses);
              }
              if (afterTemplateNodeLinkFn.transclude) {
                childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude);
              } else {
                childBoundTranscludeFn = boundTranscludeFn;
              }
              afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, linkNode, $rootElement, childBoundTranscludeFn);
            }
            linkQueue = null;
          }).error(function (response, code, headers, config) {
            throw $compileMinErr('tpload', 'Failed to load template: {0}', config.url);
          });
          return function delayedNodeLinkFn(ignoreChildLinkFn, scope, node, rootElement, boundTranscludeFn) {
            if (linkQueue) {
              linkQueue.push(scope);
              linkQueue.push(node);
              linkQueue.push(rootElement);
              linkQueue.push(boundTranscludeFn);
            } else {
              afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, node, rootElement, boundTranscludeFn);
            }
          };
        }
        function byPriority(a, b) {
          var diff = b.priority - a.priority;
          if (diff !== 0)
            return diff;
          if (a.name !== b.name)
            return a.name < b.name ? -1 : 1;
          return a.index - b.index;
        }
        function assertNoDuplicate(what, previousDirective, directive, element) {
          if (previousDirective) {
            throw $compileMinErr('multidir', 'Multiple directives [{0}, {1}] asking for {2} on: {3}', previousDirective.name, directive.name, what, startingTag(element));
          }
        }
        function addTextInterpolateDirective(directives, text) {
          var interpolateFn = $interpolate(text, true);
          if (interpolateFn) {
            directives.push({
              priority: 0,
              compile: valueFn(function textInterpolateLinkFn(scope, node) {
                var parent = node.parent(), bindings = parent.data('$binding') || [];
                bindings.push(interpolateFn);
                safeAddClass(parent.data('$binding', bindings), 'ng-binding');
                scope.$watch(interpolateFn, function interpolateFnWatchAction(value) {
                  node[0].nodeValue = value;
                });
              })
            });
          }
        }
        function getTrustedContext(node, attrNormalizedName) {
          if (attrNormalizedName == 'srcdoc') {
            return $sce.HTML;
          }
          var tag = nodeName_(node);
          if (attrNormalizedName == 'xlinkHref' || tag == 'FORM' && attrNormalizedName == 'action' || tag != 'IMG' && (attrNormalizedName == 'src' || attrNormalizedName == 'ngSrc')) {
            return $sce.RESOURCE_URL;
          }
        }
        function addAttrInterpolateDirective(node, directives, value, name) {
          var interpolateFn = $interpolate(value, true);
          if (!interpolateFn)
            return;
          if (name === 'multiple' && nodeName_(node) === 'SELECT') {
            throw $compileMinErr('selmulti', 'Binding to the \'multiple\' attribute is not supported. Element: {0}', startingTag(node));
          }
          directives.push({
            priority: 100,
            compile: function () {
              return {
                pre: function attrInterpolatePreLinkFn(scope, element, attr) {
                  var $$observers = attr.$$observers || (attr.$$observers = {});
                  if (EVENT_HANDLER_ATTR_REGEXP.test(name)) {
                    throw $compileMinErr('nodomevents', 'Interpolations for HTML DOM event attributes are disallowed.  Please use the ' + 'ng- versions (such as ng-click instead of onclick) instead.');
                  }
                  interpolateFn = $interpolate(attr[name], true, getTrustedContext(node, name));
                  if (!interpolateFn)
                    return;
                  attr[name] = interpolateFn(scope);
                  ($$observers[name] || ($$observers[name] = [])).$$inter = true;
                  (attr.$$observers && attr.$$observers[name].$$scope || scope).$watch(interpolateFn, function interpolateFnWatchAction(newValue, oldValue) {
                    if (name === 'class' && newValue != oldValue) {
                      attr.$updateClass(newValue, oldValue);
                    } else {
                      attr.$set(name, newValue);
                    }
                  });
                }
              };
            }
          });
        }
        function replaceWith($rootElement, elementsToRemove, newNode) {
          var firstElementToRemove = elementsToRemove[0], removeCount = elementsToRemove.length, parent = firstElementToRemove.parentNode, i, ii;
          if ($rootElement) {
            for (i = 0, ii = $rootElement.length; i < ii; i++) {
              if ($rootElement[i] == firstElementToRemove) {
                $rootElement[i++] = newNode;
                for (var j = i, j2 = j + removeCount - 1, jj = $rootElement.length; j < jj; j++, j2++) {
                  if (j2 < jj) {
                    $rootElement[j] = $rootElement[j2];
                  } else {
                    delete $rootElement[j];
                  }
                }
                $rootElement.length -= removeCount - 1;
                break;
              }
            }
          }
          if (parent) {
            parent.replaceChild(newNode, firstElementToRemove);
          }
          var fragment = document.createDocumentFragment();
          fragment.appendChild(firstElementToRemove);
          newNode[jqLite.expando] = firstElementToRemove[jqLite.expando];
          for (var k = 1, kk = elementsToRemove.length; k < kk; k++) {
            var element = elementsToRemove[k];
            jqLite(element).remove();
            fragment.appendChild(element);
            delete elementsToRemove[k];
          }
          elementsToRemove[0] = newNode;
          elementsToRemove.length = 1;
        }
        function cloneAndAnnotateFn(fn, annotation) {
          return extend(function () {
            return fn.apply(null, arguments);
          }, fn, annotation);
        }
      }
    ];
  }
  var PREFIX_REGEXP = /^(x[\:\-_]|data[\:\-_])/i;
  function directiveNormalize(name) {
    return camelCase(name.replace(PREFIX_REGEXP, ''));
  }
  function nodesetLinkingFn(scope, nodeList, rootElement, boundTranscludeFn) {
  }
  function directiveLinkingFn(nodesetLinkingFn, scope, node, rootElement, boundTranscludeFn) {
  }
  function tokenDifference(str1, str2) {
    var values = '', tokens1 = str1.split(/\s+/), tokens2 = str2.split(/\s+/);
    outer:
      for (var i = 0; i < tokens1.length; i++) {
        var token = tokens1[i];
        for (var j = 0; j < tokens2.length; j++) {
          if (token == tokens2[j])
            continue outer;
        }
        values += (values.length > 0 ? ' ' : '') + token;
      }
    return values;
  }
  function $ControllerProvider() {
    var controllers = {}, CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;
    this.register = function (name, constructor) {
      assertNotHasOwnProperty(name, 'controller');
      if (isObject(name)) {
        extend(controllers, name);
      } else {
        controllers[name] = constructor;
      }
    };
    this.$get = [
      '$injector',
      '$window',
      function ($injector, $window) {
        return function (expression, locals) {
          var instance, match, constructor, identifier;
          if (isString(expression)) {
            match = expression.match(CNTRL_REG), constructor = match[1], identifier = match[3];
            expression = controllers.hasOwnProperty(constructor) ? controllers[constructor] : getter(locals.$scope, constructor, true) || getter($window, constructor, true);
            assertArgFn(expression, constructor, true);
          }
          instance = $injector.instantiate(expression, locals);
          if (identifier) {
            if (!(locals && typeof locals.$scope == 'object')) {
              throw minErr('$controller')('noscp', 'Cannot export controller \'{0}\' as \'{1}\'! No $scope object provided via `locals`.', constructor || expression.name, identifier);
            }
            locals.$scope[identifier] = instance;
          }
          return instance;
        };
      }
    ];
  }
  function $DocumentProvider() {
    this.$get = [
      '$window',
      function (window) {
        return jqLite(window.document);
      }
    ];
  }
  function $ExceptionHandlerProvider() {
    this.$get = [
      '$log',
      function ($log) {
        return function (exception, cause) {
          $log.error.apply($log, arguments);
        };
      }
    ];
  }
  function parseHeaders(headers) {
    var parsed = {}, key, val, i;
    if (!headers)
      return parsed;
    forEach(headers.split('\n'), function (line) {
      i = line.indexOf(':');
      key = lowercase(trim(line.substr(0, i)));
      val = trim(line.substr(i + 1));
      if (key) {
        if (parsed[key]) {
          parsed[key] += ', ' + val;
        } else {
          parsed[key] = val;
        }
      }
    });
    return parsed;
  }
  function headersGetter(headers) {
    var headersObj = isObject(headers) ? headers : undefined;
    return function (name) {
      if (!headersObj)
        headersObj = parseHeaders(headers);
      if (name) {
        return headersObj[lowercase(name)] || null;
      }
      return headersObj;
    };
  }
  function transformData(data, headers, fns) {
    if (isFunction(fns))
      return fns(data, headers);
    forEach(fns, function (fn) {
      data = fn(data, headers);
    });
    return data;
  }
  function isSuccess(status) {
    return 200 <= status && status < 300;
  }
  function $HttpProvider() {
    var JSON_START = /^\s*(\[|\{[^\{])/, JSON_END = /[\}\]]\s*$/, PROTECTION_PREFIX = /^\)\]\}',?\n/, CONTENT_TYPE_APPLICATION_JSON = { 'Content-Type': 'application/json;charset=utf-8' };
    var defaults = this.defaults = {
        transformResponse: [function (data) {
            if (isString(data)) {
              data = data.replace(PROTECTION_PREFIX, '');
              if (JSON_START.test(data) && JSON_END.test(data))
                data = fromJson(data);
            }
            return data;
          }],
        transformRequest: [function (d) {
            return isObject(d) && !isFile(d) && !isBlob(d) ? toJson(d) : d;
          }],
        headers: {
          common: { 'Accept': 'application/json, text/plain, */*' },
          post: copy(CONTENT_TYPE_APPLICATION_JSON),
          put: copy(CONTENT_TYPE_APPLICATION_JSON),
          patch: copy(CONTENT_TYPE_APPLICATION_JSON)
        },
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN'
      };
    var interceptorFactories = this.interceptors = [];
    var responseInterceptorFactories = this.responseInterceptors = [];
    this.$get = [
      '$httpBackend',
      '$browser',
      '$cacheFactory',
      '$rootScope',
      '$q',
      '$injector',
      function ($httpBackend, $browser, $cacheFactory, $rootScope, $q, $injector) {
        var defaultCache = $cacheFactory('$http');
        var reversedInterceptors = [];
        forEach(interceptorFactories, function (interceptorFactory) {
          reversedInterceptors.unshift(isString(interceptorFactory) ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory));
        });
        forEach(responseInterceptorFactories, function (interceptorFactory, index) {
          var responseFn = isString(interceptorFactory) ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory);
          reversedInterceptors.splice(index, 0, {
            response: function (response) {
              return responseFn($q.when(response));
            },
            responseError: function (response) {
              return responseFn($q.reject(response));
            }
          });
        });
        function $http(requestConfig) {
          var config = {
              method: 'get',
              transformRequest: defaults.transformRequest,
              transformResponse: defaults.transformResponse
            };
          var headers = mergeHeaders(requestConfig);
          extend(config, requestConfig);
          config.headers = headers;
          config.method = uppercase(config.method);
          var xsrfValue = urlIsSameOrigin(config.url) ? $browser.cookies()[config.xsrfCookieName || defaults.xsrfCookieName] : undefined;
          if (xsrfValue) {
            headers[config.xsrfHeaderName || defaults.xsrfHeaderName] = xsrfValue;
          }
          var serverRequest = function (config) {
            headers = config.headers;
            var reqData = transformData(config.data, headersGetter(headers), config.transformRequest);
            if (isUndefined(config.data)) {
              forEach(headers, function (value, header) {
                if (lowercase(header) === 'content-type') {
                  delete headers[header];
                }
              });
            }
            if (isUndefined(config.withCredentials) && !isUndefined(defaults.withCredentials)) {
              config.withCredentials = defaults.withCredentials;
            }
            return sendReq(config, reqData, headers).then(transformResponse, transformResponse);
          };
          var chain = [
              serverRequest,
              undefined
            ];
          var promise = $q.when(config);
          forEach(reversedInterceptors, function (interceptor) {
            if (interceptor.request || interceptor.requestError) {
              chain.unshift(interceptor.request, interceptor.requestError);
            }
            if (interceptor.response || interceptor.responseError) {
              chain.push(interceptor.response, interceptor.responseError);
            }
          });
          while (chain.length) {
            var thenFn = chain.shift();
            var rejectFn = chain.shift();
            promise = promise.then(thenFn, rejectFn);
          }
          promise.success = function (fn) {
            promise.then(function (response) {
              fn(response.data, response.status, response.headers, config);
            });
            return promise;
          };
          promise.error = function (fn) {
            promise.then(null, function (response) {
              fn(response.data, response.status, response.headers, config);
            });
            return promise;
          };
          return promise;
          function transformResponse(response) {
            var resp = extend({}, response, { data: transformData(response.data, response.headers, config.transformResponse) });
            return isSuccess(response.status) ? resp : $q.reject(resp);
          }
          function mergeHeaders(config) {
            var defHeaders = defaults.headers, reqHeaders = extend({}, config.headers), defHeaderName, lowercaseDefHeaderName, reqHeaderName;
            defHeaders = extend({}, defHeaders.common, defHeaders[lowercase(config.method)]);
            execHeaders(defHeaders);
            execHeaders(reqHeaders);
            defaultHeadersIteration:
              for (defHeaderName in defHeaders) {
                lowercaseDefHeaderName = lowercase(defHeaderName);
                for (reqHeaderName in reqHeaders) {
                  if (lowercase(reqHeaderName) === lowercaseDefHeaderName) {
                    continue defaultHeadersIteration;
                  }
                }
                reqHeaders[defHeaderName] = defHeaders[defHeaderName];
              }
            return reqHeaders;
            function execHeaders(headers) {
              var headerContent;
              forEach(headers, function (headerFn, header) {
                if (isFunction(headerFn)) {
                  headerContent = headerFn();
                  if (headerContent != null) {
                    headers[header] = headerContent;
                  } else {
                    delete headers[header];
                  }
                }
              });
            }
          }
        }
        $http.pendingRequests = [];
        createShortMethods('get', 'delete', 'head', 'jsonp');
        createShortMethodsWithData('post', 'put');
        $http.defaults = defaults;
        return $http;
        function createShortMethods(names) {
          forEach(arguments, function (name) {
            $http[name] = function (url, config) {
              return $http(extend(config || {}, {
                method: name,
                url: url
              }));
            };
          });
        }
        function createShortMethodsWithData(name) {
          forEach(arguments, function (name) {
            $http[name] = function (url, data, config) {
              return $http(extend(config || {}, {
                method: name,
                url: url,
                data: data
              }));
            };
          });
        }
        function sendReq(config, reqData, reqHeaders) {
          var deferred = $q.defer(), promise = deferred.promise, cache, cachedResp, url = buildUrl(config.url, config.params);
          $http.pendingRequests.push(config);
          promise.then(removePendingReq, removePendingReq);
          if ((config.cache || defaults.cache) && config.cache !== false && config.method == 'GET') {
            cache = isObject(config.cache) ? config.cache : isObject(defaults.cache) ? defaults.cache : defaultCache;
          }
          if (cache) {
            cachedResp = cache.get(url);
            if (isDefined(cachedResp)) {
              if (cachedResp.then) {
                cachedResp.then(removePendingReq, removePendingReq);
                return cachedResp;
              } else {
                if (isArray(cachedResp)) {
                  resolvePromise(cachedResp[1], cachedResp[0], copy(cachedResp[2]));
                } else {
                  resolvePromise(cachedResp, 200, {});
                }
              }
            } else {
              cache.put(url, promise);
            }
          }
          if (isUndefined(cachedResp)) {
            $httpBackend(config.method, url, reqData, done, reqHeaders, config.timeout, config.withCredentials, config.responseType);
          }
          return promise;
          function done(status, response, headersString) {
            if (cache) {
              if (isSuccess(status)) {
                cache.put(url, [
                  status,
                  response,
                  parseHeaders(headersString)
                ]);
              } else {
                cache.remove(url);
              }
            }
            resolvePromise(response, status, headersString);
            if (!$rootScope.$$phase)
              $rootScope.$apply();
          }
          function resolvePromise(response, status, headers) {
            status = Math.max(status, 0);
            (isSuccess(status) ? deferred.resolve : deferred.reject)({
              data: response,
              status: status,
              headers: headersGetter(headers),
              config: config
            });
          }
          function removePendingReq() {
            var idx = indexOf($http.pendingRequests, config);
            if (idx !== -1)
              $http.pendingRequests.splice(idx, 1);
          }
        }
        function buildUrl(url, params) {
          if (!params)
            return url;
          var parts = [];
          forEachSorted(params, function (value, key) {
            if (value === null || isUndefined(value))
              return;
            if (!isArray(value))
              value = [value];
            forEach(value, function (v) {
              if (isObject(v)) {
                v = toJson(v);
              }
              parts.push(encodeUriQuery(key) + '=' + encodeUriQuery(v));
            });
          });
          if (parts.length > 0) {
            url += (url.indexOf('?') == -1 ? '?' : '&') + parts.join('&');
          }
          return url;
        }
      }
    ];
  }
  function createXhr(method) {
    if (msie <= 8 && (!method.match(/^(get|post|head|put|delete|options)$/i) || !window.XMLHttpRequest)) {
      return new window.ActiveXObject('Microsoft.XMLHTTP');
    } else if (window.XMLHttpRequest) {
      return new window.XMLHttpRequest();
    }
    throw minErr('$httpBackend')('noxhr', 'This browser does not support XMLHttpRequest.');
  }
  function $HttpBackendProvider() {
    this.$get = [
      '$browser',
      '$window',
      '$document',
      function ($browser, $window, $document) {
        return createHttpBackend($browser, createXhr, $browser.defer, $window.angular.callbacks, $document[0]);
      }
    ];
  }
  function createHttpBackend($browser, createXhr, $browserDefer, callbacks, rawDocument) {
    var ABORTED = -1;
    return function (method, url, post, callback, headers, timeout, withCredentials, responseType) {
      var status;
      $browser.$$incOutstandingRequestCount();
      url = url || $browser.url();
      if (lowercase(method) == 'jsonp') {
        var callbackId = '_' + (callbacks.counter++).toString(36);
        callbacks[callbackId] = function (data) {
          callbacks[callbackId].data = data;
        };
        var jsonpDone = jsonpReq(url.replace('JSON_CALLBACK', 'angular.callbacks.' + callbackId), function () {
            if (callbacks[callbackId].data) {
              completeRequest(callback, 200, callbacks[callbackId].data);
            } else {
              completeRequest(callback, status || -2);
            }
            callbacks[callbackId] = angular.noop;
          });
      } else {
        var xhr = createXhr(method);
        xhr.open(method, url, true);
        forEach(headers, function (value, key) {
          if (isDefined(value)) {
            xhr.setRequestHeader(key, value);
          }
        });
        xhr.onreadystatechange = function () {
          if (xhr && xhr.readyState == 4) {
            var responseHeaders = null, response = null;
            if (status !== ABORTED) {
              responseHeaders = xhr.getAllResponseHeaders();
              response = 'response' in xhr ? xhr.response : xhr.responseText;
            }
            completeRequest(callback, status || xhr.status, response, responseHeaders);
          }
        };
        if (withCredentials) {
          xhr.withCredentials = true;
        }
        if (responseType) {
          try {
            xhr.responseType = responseType;
          } catch (e) {
            if (responseType !== 'json') {
              throw e;
            }
          }
        }
        xhr.send(post || null);
      }
      if (timeout > 0) {
        var timeoutId = $browserDefer(timeoutRequest, timeout);
      } else if (timeout && timeout.then) {
        timeout.then(timeoutRequest);
      }
      function timeoutRequest() {
        status = ABORTED;
        jsonpDone && jsonpDone();
        xhr && xhr.abort();
      }
      function completeRequest(callback, status, response, headersString) {
        timeoutId && $browserDefer.cancel(timeoutId);
        jsonpDone = xhr = null;
        if (status === 0) {
          status = response ? 200 : urlResolve(url).protocol == 'file' ? 404 : 0;
        }
        status = status == 1223 ? 204 : status;
        callback(status, response, headersString);
        $browser.$$completeOutstandingRequest(noop);
      }
    };
    function jsonpReq(url, done) {
      var script = rawDocument.createElement('script'), doneWrapper = function () {
          script.onreadystatechange = script.onload = script.onerror = null;
          rawDocument.body.removeChild(script);
          if (done)
            done();
        };
      script.type = 'text/javascript';
      script.src = url;
      if (msie && msie <= 8) {
        script.onreadystatechange = function () {
          if (/loaded|complete/.test(script.readyState)) {
            doneWrapper();
          }
        };
      } else {
        script.onload = script.onerror = function () {
          doneWrapper();
        };
      }
      rawDocument.body.appendChild(script);
      return doneWrapper;
    }
  }
  var $interpolateMinErr = minErr('$interpolate');
  function $InterpolateProvider() {
    var startSymbol = '{{';
    var endSymbol = '}}';
    this.startSymbol = function (value) {
      if (value) {
        startSymbol = value;
        return this;
      } else {
        return startSymbol;
      }
    };
    this.endSymbol = function (value) {
      if (value) {
        endSymbol = value;
        return this;
      } else {
        return endSymbol;
      }
    };
    this.$get = [
      '$parse',
      '$exceptionHandler',
      '$sce',
      function ($parse, $exceptionHandler, $sce) {
        var startSymbolLength = startSymbol.length, endSymbolLength = endSymbol.length;
        function $interpolate(text, mustHaveExpression, trustedContext) {
          var startIndex, endIndex, index = 0, parts = [], length = text.length, hasInterpolation = false, fn, exp, concat = [];
          while (index < length) {
            if ((startIndex = text.indexOf(startSymbol, index)) != -1 && (endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) != -1) {
              index != startIndex && parts.push(text.substring(index, startIndex));
              parts.push(fn = $parse(exp = text.substring(startIndex + startSymbolLength, endIndex)));
              fn.exp = exp;
              index = endIndex + endSymbolLength;
              hasInterpolation = true;
            } else {
              index != length && parts.push(text.substring(index));
              index = length;
            }
          }
          if (!(length = parts.length)) {
            parts.push('');
            length = 1;
          }
          if (trustedContext && parts.length > 1) {
            throw $interpolateMinErr('noconcat', 'Error while interpolating: {0}\nStrict Contextual Escaping disallows ' + 'interpolations that concatenate multiple expressions when a trusted value is ' + 'required.  See http://docs.angularjs.org/api/ng.$sce', text);
          }
          if (!mustHaveExpression || hasInterpolation) {
            concat.length = length;
            fn = function (context) {
              try {
                for (var i = 0, ii = length, part; i < ii; i++) {
                  if (typeof (part = parts[i]) == 'function') {
                    part = part(context);
                    if (trustedContext) {
                      part = $sce.getTrusted(trustedContext, part);
                    } else {
                      part = $sce.valueOf(part);
                    }
                    if (part === null || isUndefined(part)) {
                      part = '';
                    } else if (typeof part != 'string') {
                      part = toJson(part);
                    }
                  }
                  concat[i] = part;
                }
                return concat.join('');
              } catch (err) {
                var newErr = $interpolateMinErr('interr', 'Can\'t interpolate: {0}\n{1}', text, err.toString());
                $exceptionHandler(newErr);
              }
            };
            fn.exp = text;
            fn.parts = parts;
            return fn;
          }
        }
        $interpolate.startSymbol = function () {
          return startSymbol;
        };
        $interpolate.endSymbol = function () {
          return endSymbol;
        };
        return $interpolate;
      }
    ];
  }
  function $IntervalProvider() {
    this.$get = [
      '$rootScope',
      '$window',
      '$q',
      function ($rootScope, $window, $q) {
        var intervals = {};
        function interval(fn, delay, count, invokeApply) {
          var setInterval = $window.setInterval, clearInterval = $window.clearInterval, deferred = $q.defer(), promise = deferred.promise, iteration = 0, skipApply = isDefined(invokeApply) && !invokeApply;
          count = isDefined(count) ? count : 0;
          promise.then(null, null, fn);
          promise.$$intervalId = setInterval(function tick() {
            deferred.notify(iteration++);
            if (count > 0 && iteration >= count) {
              deferred.resolve(iteration);
              clearInterval(promise.$$intervalId);
              delete intervals[promise.$$intervalId];
            }
            if (!skipApply)
              $rootScope.$apply();
          }, delay);
          intervals[promise.$$intervalId] = deferred;
          return promise;
        }
        interval.cancel = function (promise) {
          if (promise && promise.$$intervalId in intervals) {
            intervals[promise.$$intervalId].reject('canceled');
            clearInterval(promise.$$intervalId);
            delete intervals[promise.$$intervalId];
            return true;
          }
          return false;
        };
        return interval;
      }
    ];
  }
  function $LocaleProvider() {
    this.$get = function () {
      return {
        id: 'en-us',
        NUMBER_FORMATS: {
          DECIMAL_SEP: '.',
          GROUP_SEP: ',',
          PATTERNS: [
            {
              minInt: 1,
              minFrac: 0,
              maxFrac: 3,
              posPre: '',
              posSuf: '',
              negPre: '-',
              negSuf: '',
              gSize: 3,
              lgSize: 3
            },
            {
              minInt: 1,
              minFrac: 2,
              maxFrac: 2,
              posPre: '\xa4',
              posSuf: '',
              negPre: '(\xa4',
              negSuf: ')',
              gSize: 3,
              lgSize: 3
            }
          ],
          CURRENCY_SYM: '$'
        },
        DATETIME_FORMATS: {
          MONTH: 'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),
          SHORTMONTH: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
          DAY: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
          SHORTDAY: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(','),
          AMPMS: [
            'AM',
            'PM'
          ],
          medium: 'MMM d, y h:mm:ss a',
          short: 'M/d/yy h:mm a',
          fullDate: 'EEEE, MMMM d, y',
          longDate: 'MMMM d, y',
          mediumDate: 'MMM d, y',
          shortDate: 'M/d/yy',
          mediumTime: 'h:mm:ss a',
          shortTime: 'h:mm a'
        },
        pluralCat: function (num) {
          if (num === 1) {
            return 'one';
          }
          return 'other';
        }
      };
    };
  }
  var PATH_MATCH = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/, DEFAULT_PORTS = {
      'http': 80,
      'https': 443,
      'ftp': 21
    };
  var $locationMinErr = minErr('$location');
  function encodePath(path) {
    var segments = path.split('/'), i = segments.length;
    while (i--) {
      segments[i] = encodeUriSegment(segments[i]);
    }
    return segments.join('/');
  }
  function parseAbsoluteUrl(absoluteUrl, locationObj, appBase) {
    var parsedUrl = urlResolve(absoluteUrl, appBase);
    locationObj.$$protocol = parsedUrl.protocol;
    locationObj.$$host = parsedUrl.hostname;
    locationObj.$$port = int(parsedUrl.port) || DEFAULT_PORTS[parsedUrl.protocol] || null;
  }
  function parseAppUrl(relativeUrl, locationObj, appBase) {
    var prefixed = relativeUrl.charAt(0) !== '/';
    if (prefixed) {
      relativeUrl = '/' + relativeUrl;
    }
    var match = urlResolve(relativeUrl, appBase);
    locationObj.$$path = decodeURIComponent(prefixed && match.pathname.charAt(0) === '/' ? match.pathname.substring(1) : match.pathname);
    locationObj.$$search = parseKeyValue(match.search);
    locationObj.$$hash = decodeURIComponent(match.hash);
    if (locationObj.$$path && locationObj.$$path.charAt(0) != '/') {
      locationObj.$$path = '/' + locationObj.$$path;
    }
  }
  function beginsWith(begin, whole) {
    if (whole.indexOf(begin) === 0) {
      return whole.substr(begin.length);
    }
  }
  function stripHash(url) {
    var index = url.indexOf('#');
    return index == -1 ? url : url.substr(0, index);
  }
  function stripFile(url) {
    return url.substr(0, stripHash(url).lastIndexOf('/') + 1);
  }
  function serverBase(url) {
    return url.substring(0, url.indexOf('/', url.indexOf('//') + 2));
  }
  function LocationHtml5Url(appBase, basePrefix) {
    this.$$html5 = true;
    basePrefix = basePrefix || '';
    var appBaseNoFile = stripFile(appBase);
    parseAbsoluteUrl(appBase, this, appBase);
    this.$$parse = function (url) {
      var pathUrl = beginsWith(appBaseNoFile, url);
      if (!isString(pathUrl)) {
        throw $locationMinErr('ipthprfx', 'Invalid url "{0}", missing path prefix "{1}".', url, appBaseNoFile);
      }
      parseAppUrl(pathUrl, this, appBase);
      if (!this.$$path) {
        this.$$path = '/';
      }
      this.$$compose();
    };
    this.$$compose = function () {
      var search = toKeyValue(this.$$search), hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';
      this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
      this.$$absUrl = appBaseNoFile + this.$$url.substr(1);
    };
    this.$$rewrite = function (url) {
      var appUrl, prevAppUrl;
      if ((appUrl = beginsWith(appBase, url)) !== undefined) {
        prevAppUrl = appUrl;
        if ((appUrl = beginsWith(basePrefix, appUrl)) !== undefined) {
          return appBaseNoFile + (beginsWith('/', appUrl) || appUrl);
        } else {
          return appBase + prevAppUrl;
        }
      } else if ((appUrl = beginsWith(appBaseNoFile, url)) !== undefined) {
        return appBaseNoFile + appUrl;
      } else if (appBaseNoFile == url + '/') {
        return appBaseNoFile;
      }
    };
  }
  function LocationHashbangUrl(appBase, hashPrefix) {
    var appBaseNoFile = stripFile(appBase);
    parseAbsoluteUrl(appBase, this, appBase);
    this.$$parse = function (url) {
      var withoutBaseUrl = beginsWith(appBase, url) || beginsWith(appBaseNoFile, url);
      var withoutHashUrl = withoutBaseUrl.charAt(0) == '#' ? beginsWith(hashPrefix, withoutBaseUrl) : this.$$html5 ? withoutBaseUrl : '';
      if (!isString(withoutHashUrl)) {
        throw $locationMinErr('ihshprfx', 'Invalid url "{0}", missing hash prefix "{1}".', url, hashPrefix);
      }
      parseAppUrl(withoutHashUrl, this, appBase);
      this.$$path = removeWindowsDriveName(this.$$path, withoutHashUrl, appBase);
      this.$$compose();
      function removeWindowsDriveName(path, url, base) {
        var windowsFilePathExp = /^\/?.*?:(\/.*)/;
        var firstPathSegmentMatch;
        if (url.indexOf(base) === 0) {
          url = url.replace(base, '');
        }
        if (windowsFilePathExp.exec(url)) {
          return path;
        }
        firstPathSegmentMatch = windowsFilePathExp.exec(path);
        return firstPathSegmentMatch ? firstPathSegmentMatch[1] : path;
      }
    };
    this.$$compose = function () {
      var search = toKeyValue(this.$$search), hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';
      this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
      this.$$absUrl = appBase + (this.$$url ? hashPrefix + this.$$url : '');
    };
    this.$$rewrite = function (url) {
      if (stripHash(appBase) == stripHash(url)) {
        return url;
      }
    };
  }
  function LocationHashbangInHtml5Url(appBase, hashPrefix) {
    this.$$html5 = true;
    LocationHashbangUrl.apply(this, arguments);
    var appBaseNoFile = stripFile(appBase);
    this.$$rewrite = function (url) {
      var appUrl;
      if (appBase == stripHash(url)) {
        return url;
      } else if (appUrl = beginsWith(appBaseNoFile, url)) {
        return appBase + hashPrefix + appUrl;
      } else if (appBaseNoFile === url + '/') {
        return appBaseNoFile;
      }
    };
  }
  LocationHashbangInHtml5Url.prototype = LocationHashbangUrl.prototype = LocationHtml5Url.prototype = {
    $$html5: false,
    $$replace: false,
    absUrl: locationGetter('$$absUrl'),
    url: function (url, replace) {
      if (isUndefined(url))
        return this.$$url;
      var match = PATH_MATCH.exec(url);
      if (match[1])
        this.path(decodeURIComponent(match[1]));
      if (match[2] || match[1])
        this.search(match[3] || '');
      this.hash(match[5] || '', replace);
      return this;
    },
    protocol: locationGetter('$$protocol'),
    host: locationGetter('$$host'),
    port: locationGetter('$$port'),
    path: locationGetterSetter('$$path', function (path) {
      return path.charAt(0) == '/' ? path : '/' + path;
    }),
    search: function (search, paramValue) {
      switch (arguments.length) {
      case 0:
        return this.$$search;
      case 1:
        if (isString(search)) {
          this.$$search = parseKeyValue(search);
        } else if (isObject(search)) {
          this.$$search = search;
        } else {
          throw $locationMinErr('isrcharg', 'The first argument of the `$location#search()` call must be a string or an object.');
        }
        break;
      default:
        if (isUndefined(paramValue) || paramValue === null) {
          delete this.$$search[search];
        } else {
          this.$$search[search] = paramValue;
        }
      }
      this.$$compose();
      return this;
    },
    hash: locationGetterSetter('$$hash', identity),
    replace: function () {
      this.$$replace = true;
      return this;
    }
  };
  function locationGetter(property) {
    return function () {
      return this[property];
    };
  }
  function locationGetterSetter(property, preprocess) {
    return function (value) {
      if (isUndefined(value))
        return this[property];
      this[property] = preprocess(value);
      this.$$compose();
      return this;
    };
  }
  function $LocationProvider() {
    var hashPrefix = '', html5Mode = false;
    this.hashPrefix = function (prefix) {
      if (isDefined(prefix)) {
        hashPrefix = prefix;
        return this;
      } else {
        return hashPrefix;
      }
    };
    this.html5Mode = function (mode) {
      if (isDefined(mode)) {
        html5Mode = mode;
        return this;
      } else {
        return html5Mode;
      }
    };
    this.$get = [
      '$rootScope',
      '$browser',
      '$sniffer',
      '$rootElement',
      function ($rootScope, $browser, $sniffer, $rootElement) {
        var $location, LocationMode, baseHref = $browser.baseHref(), initialUrl = $browser.url(), appBase;
        if (html5Mode) {
          appBase = serverBase(initialUrl) + (baseHref || '/');
          LocationMode = $sniffer.history ? LocationHtml5Url : LocationHashbangInHtml5Url;
        } else {
          appBase = stripHash(initialUrl);
          LocationMode = LocationHashbangUrl;
        }
        $location = new LocationMode(appBase, '#' + hashPrefix);
        $location.$$parse($location.$$rewrite(initialUrl));
        $rootElement.on('click', function (event) {
          if (event.ctrlKey || event.metaKey || event.which == 2)
            return;
          var elm = jqLite(event.target);
          while (lowercase(elm[0].nodeName) !== 'a') {
            if (elm[0] === $rootElement[0] || !(elm = elm.parent())[0])
              return;
          }
          var absHref = elm.prop('href');
          if (isObject(absHref) && absHref.toString() === '[object SVGAnimatedString]') {
            absHref = urlResolve(absHref.animVal).href;
          }
          var rewrittenUrl = $location.$$rewrite(absHref);
          if (absHref && !elm.attr('target') && rewrittenUrl && !event.isDefaultPrevented()) {
            event.preventDefault();
            if (rewrittenUrl != $browser.url()) {
              $location.$$parse(rewrittenUrl);
              $rootScope.$apply();
              window.angular['ff-684208-preventDefault'] = true;
            }
          }
        });
        if ($location.absUrl() != initialUrl) {
          $browser.url($location.absUrl(), true);
        }
        $browser.onUrlChange(function (newUrl) {
          if ($location.absUrl() != newUrl) {
            $rootScope.$evalAsync(function () {
              var oldUrl = $location.absUrl();
              $location.$$parse(newUrl);
              if ($rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl).defaultPrevented) {
                $location.$$parse(oldUrl);
                $browser.url(oldUrl);
              } else {
                afterLocationChange(oldUrl);
              }
            });
            if (!$rootScope.$$phase)
              $rootScope.$digest();
          }
        });
        var changeCounter = 0;
        $rootScope.$watch(function $locationWatch() {
          var oldUrl = $browser.url();
          var currentReplace = $location.$$replace;
          if (!changeCounter || oldUrl != $location.absUrl()) {
            changeCounter++;
            $rootScope.$evalAsync(function () {
              if ($rootScope.$broadcast('$locationChangeStart', $location.absUrl(), oldUrl).defaultPrevented) {
                $location.$$parse(oldUrl);
              } else {
                $browser.url($location.absUrl(), currentReplace);
                afterLocationChange(oldUrl);
              }
            });
          }
          $location.$$replace = false;
          return changeCounter;
        });
        return $location;
        function afterLocationChange(oldUrl) {
          $rootScope.$broadcast('$locationChangeSuccess', $location.absUrl(), oldUrl);
        }
      }
    ];
  }
  function $LogProvider() {
    var debug = true, self = this;
    this.debugEnabled = function (flag) {
      if (isDefined(flag)) {
        debug = flag;
        return this;
      } else {
        return debug;
      }
    };
    this.$get = [
      '$window',
      function ($window) {
        return {
          log: consoleLog('log'),
          info: consoleLog('info'),
          warn: consoleLog('warn'),
          error: consoleLog('error'),
          debug: function () {
            var fn = consoleLog('debug');
            return function () {
              if (debug) {
                fn.apply(self, arguments);
              }
            };
          }()
        };
        function formatError(arg) {
          if (arg instanceof Error) {
            if (arg.stack) {
              arg = arg.message && arg.stack.indexOf(arg.message) === -1 ? 'Error: ' + arg.message + '\n' + arg.stack : arg.stack;
            } else if (arg.sourceURL) {
              arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
            }
          }
          return arg;
        }
        function consoleLog(type) {
          var console = $window.console || {}, logFn = console[type] || console.log || noop, hasApply = false;
          try {
            hasApply = !!logFn.apply;
          } catch (e) {
          }
          if (hasApply) {
            return function () {
              var args = [];
              forEach(arguments, function (arg) {
                args.push(formatError(arg));
              });
              return logFn.apply(console, args);
            };
          }
          return function (arg1, arg2) {
            logFn(arg1, arg2 == null ? '' : arg2);
          };
        }
      }
    ];
  }
  var $parseMinErr = minErr('$parse');
  var promiseWarningCache = {};
  var promiseWarning;
  function ensureSafeMemberName(name, fullExpression) {
    if (name === 'constructor') {
      throw $parseMinErr('isecfld', 'Referencing "constructor" field in Angular expressions is disallowed! Expression: {0}', fullExpression);
    }
    return name;
  }
  function ensureSafeObject(obj, fullExpression) {
    if (obj) {
      if (obj.constructor === obj) {
        throw $parseMinErr('isecfn', 'Referencing Function in Angular expressions is disallowed! Expression: {0}', fullExpression);
      } else if (obj.document && obj.location && obj.alert && obj.setInterval) {
        throw $parseMinErr('isecwindow', 'Referencing the Window in Angular expressions is disallowed! Expression: {0}', fullExpression);
      } else if (obj.children && (obj.nodeName || obj.prop && obj.attr && obj.find)) {
        throw $parseMinErr('isecdom', 'Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}', fullExpression);
      }
    }
    return obj;
  }
  var OPERATORS = {
      'null': function () {
        return null;
      },
      'true': function () {
        return true;
      },
      'false': function () {
        return false;
      },
      undefined: noop,
      '+': function (self, locals, a, b) {
        a = a(self, locals);
        b = b(self, locals);
        if (isDefined(a)) {
          if (isDefined(b)) {
            return a + b;
          }
          return a;
        }
        return isDefined(b) ? b : undefined;
      },
      '-': function (self, locals, a, b) {
        a = a(self, locals);
        b = b(self, locals);
        return (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0);
      },
      '*': function (self, locals, a, b) {
        return a(self, locals) * b(self, locals);
      },
      '/': function (self, locals, a, b) {
        return a(self, locals) / b(self, locals);
      },
      '%': function (self, locals, a, b) {
        return a(self, locals) % b(self, locals);
      },
      '^': function (self, locals, a, b) {
        return a(self, locals) ^ b(self, locals);
      },
      '=': noop,
      '===': function (self, locals, a, b) {
        return a(self, locals) === b(self, locals);
      },
      '!==': function (self, locals, a, b) {
        return a(self, locals) !== b(self, locals);
      },
      '==': function (self, locals, a, b) {
        return a(self, locals) == b(self, locals);
      },
      '!=': function (self, locals, a, b) {
        return a(self, locals) != b(self, locals);
      },
      '<': function (self, locals, a, b) {
        return a(self, locals) < b(self, locals);
      },
      '>': function (self, locals, a, b) {
        return a(self, locals) > b(self, locals);
      },
      '<=': function (self, locals, a, b) {
        return a(self, locals) <= b(self, locals);
      },
      '>=': function (self, locals, a, b) {
        return a(self, locals) >= b(self, locals);
      },
      '&&': function (self, locals, a, b) {
        return a(self, locals) && b(self, locals);
      },
      '||': function (self, locals, a, b) {
        return a(self, locals) || b(self, locals);
      },
      '&': function (self, locals, a, b) {
        return a(self, locals) & b(self, locals);
      },
      '|': function (self, locals, a, b) {
        return b(self, locals)(self, locals, a(self, locals));
      },
      '!': function (self, locals, a) {
        return !a(self, locals);
      }
    };
  var ESCAPE = {
      'n': '\n',
      'f': '\f',
      'r': '\r',
      't': '\t',
      'v': '\x0B',
      '\'': '\'',
      '"': '"'
    };
  var Lexer = function (options) {
    this.options = options;
  };
  Lexer.prototype = {
    constructor: Lexer,
    lex: function (text) {
      this.text = text;
      this.index = 0;
      this.ch = undefined;
      this.lastCh = ':';
      this.tokens = [];
      var token;
      var json = [];
      while (this.index < this.text.length) {
        this.ch = this.text.charAt(this.index);
        if (this.is('"\'')) {
          this.readString(this.ch);
        } else if (this.isNumber(this.ch) || this.is('.') && this.isNumber(this.peek())) {
          this.readNumber();
        } else if (this.isIdent(this.ch)) {
          this.readIdent();
          if (this.was('{,') && json[0] === '{' && (token = this.tokens[this.tokens.length - 1])) {
            token.json = token.text.indexOf('.') === -1;
          }
        } else if (this.is('(){}[].,;:?')) {
          this.tokens.push({
            index: this.index,
            text: this.ch,
            json: this.was(':[,') && this.is('{[') || this.is('}]:,')
          });
          if (this.is('{['))
            json.unshift(this.ch);
          if (this.is('}]'))
            json.shift();
          this.index++;
        } else if (this.isWhitespace(this.ch)) {
          this.index++;
          continue;
        } else {
          var ch2 = this.ch + this.peek();
          var ch3 = ch2 + this.peek(2);
          var fn = OPERATORS[this.ch];
          var fn2 = OPERATORS[ch2];
          var fn3 = OPERATORS[ch3];
          if (fn3) {
            this.tokens.push({
              index: this.index,
              text: ch3,
              fn: fn3
            });
            this.index += 3;
          } else if (fn2) {
            this.tokens.push({
              index: this.index,
              text: ch2,
              fn: fn2
            });
            this.index += 2;
          } else if (fn) {
            this.tokens.push({
              index: this.index,
              text: this.ch,
              fn: fn,
              json: this.was('[,:') && this.is('+-')
            });
            this.index += 1;
          } else {
            this.throwError('Unexpected next character ', this.index, this.index + 1);
          }
        }
        this.lastCh = this.ch;
      }
      return this.tokens;
    },
    is: function (chars) {
      return chars.indexOf(this.ch) !== -1;
    },
    was: function (chars) {
      return chars.indexOf(this.lastCh) !== -1;
    },
    peek: function (i) {
      var num = i || 1;
      return this.index + num < this.text.length ? this.text.charAt(this.index + num) : false;
    },
    isNumber: function (ch) {
      return '0' <= ch && ch <= '9';
    },
    isWhitespace: function (ch) {
      return ch === ' ' || ch === '\r' || ch === '\t' || ch === '\n' || ch === '\x0B' || ch === '\xa0';
    },
    isIdent: function (ch) {
      return 'a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z' || '_' === ch || ch === '$';
    },
    isExpOperator: function (ch) {
      return ch === '-' || ch === '+' || this.isNumber(ch);
    },
    throwError: function (error, start, end) {
      end = end || this.index;
      var colStr = isDefined(start) ? 's ' + start + '-' + this.index + ' [' + this.text.substring(start, end) + ']' : ' ' + end;
      throw $parseMinErr('lexerr', 'Lexer Error: {0} at column{1} in expression [{2}].', error, colStr, this.text);
    },
    readNumber: function () {
      var number = '';
      var start = this.index;
      while (this.index < this.text.length) {
        var ch = lowercase(this.text.charAt(this.index));
        if (ch == '.' || this.isNumber(ch)) {
          number += ch;
        } else {
          var peekCh = this.peek();
          if (ch == 'e' && this.isExpOperator(peekCh)) {
            number += ch;
          } else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && number.charAt(number.length - 1) == 'e') {
            number += ch;
          } else if (this.isExpOperator(ch) && (!peekCh || !this.isNumber(peekCh)) && number.charAt(number.length - 1) == 'e') {
            this.throwError('Invalid exponent');
          } else {
            break;
          }
        }
        this.index++;
      }
      number = 1 * number;
      this.tokens.push({
        index: start,
        text: number,
        json: true,
        fn: function () {
          return number;
        }
      });
    },
    readIdent: function () {
      var parser = this;
      var ident = '';
      var start = this.index;
      var lastDot, peekIndex, methodName, ch;
      while (this.index < this.text.length) {
        ch = this.text.charAt(this.index);
        if (ch === '.' || this.isIdent(ch) || this.isNumber(ch)) {
          if (ch === '.')
            lastDot = this.index;
          ident += ch;
        } else {
          break;
        }
        this.index++;
      }
      if (lastDot) {
        peekIndex = this.index;
        while (peekIndex < this.text.length) {
          ch = this.text.charAt(peekIndex);
          if (ch === '(') {
            methodName = ident.substr(lastDot - start + 1);
            ident = ident.substr(0, lastDot - start);
            this.index = peekIndex;
            break;
          }
          if (this.isWhitespace(ch)) {
            peekIndex++;
          } else {
            break;
          }
        }
      }
      var token = {
          index: start,
          text: ident
        };
      if (OPERATORS.hasOwnProperty(ident)) {
        token.fn = OPERATORS[ident];
        token.json = OPERATORS[ident];
      } else {
        var getter = getterFn(ident, this.options, this.text);
        token.fn = extend(function (self, locals) {
          return getter(self, locals);
        }, {
          assign: function (self, value) {
            return setter(self, ident, value, parser.text, parser.options);
          }
        });
      }
      this.tokens.push(token);
      if (methodName) {
        this.tokens.push({
          index: lastDot,
          text: '.',
          json: false
        });
        this.tokens.push({
          index: lastDot + 1,
          text: methodName,
          json: false
        });
      }
    },
    readString: function (quote) {
      var start = this.index;
      this.index++;
      var string = '';
      var rawString = quote;
      var escape = false;
      while (this.index < this.text.length) {
        var ch = this.text.charAt(this.index);
        rawString += ch;
        if (escape) {
          if (ch === 'u') {
            var hex = this.text.substring(this.index + 1, this.index + 5);
            if (!hex.match(/[\da-f]{4}/i))
              this.throwError('Invalid unicode escape [\\u' + hex + ']');
            this.index += 4;
            string += String.fromCharCode(parseInt(hex, 16));
          } else {
            var rep = ESCAPE[ch];
            if (rep) {
              string += rep;
            } else {
              string += ch;
            }
          }
          escape = false;
        } else if (ch === '\\') {
          escape = true;
        } else if (ch === quote) {
          this.index++;
          this.tokens.push({
            index: start,
            text: rawString,
            string: string,
            json: true,
            fn: function () {
              return string;
            }
          });
          return;
        } else {
          string += ch;
        }
        this.index++;
      }
      this.throwError('Unterminated quote', start);
    }
  };
  var Parser = function (lexer, $filter, options) {
    this.lexer = lexer;
    this.$filter = $filter;
    this.options = options;
  };
  Parser.ZERO = function () {
    return 0;
  };
  Parser.prototype = {
    constructor: Parser,
    parse: function (text, json) {
      this.text = text;
      this.json = json;
      this.tokens = this.lexer.lex(text);
      if (json) {
        this.assignment = this.logicalOR;
        this.functionCall = this.fieldAccess = this.objectIndex = this.filterChain = function () {
          this.throwError('is not valid json', {
            text: text,
            index: 0
          });
        };
      }
      var value = json ? this.primary() : this.statements();
      if (this.tokens.length !== 0) {
        this.throwError('is an unexpected token', this.tokens[0]);
      }
      value.literal = !!value.literal;
      value.constant = !!value.constant;
      return value;
    },
    primary: function () {
      var primary;
      if (this.expect('(')) {
        primary = this.filterChain();
        this.consume(')');
      } else if (this.expect('[')) {
        primary = this.arrayDeclaration();
      } else if (this.expect('{')) {
        primary = this.object();
      } else {
        var token = this.expect();
        primary = token.fn;
        if (!primary) {
          this.throwError('not a primary expression', token);
        }
        if (token.json) {
          primary.constant = true;
          primary.literal = true;
        }
      }
      var next, context;
      while (next = this.expect('(', '[', '.')) {
        if (next.text === '(') {
          primary = this.functionCall(primary, context);
          context = null;
        } else if (next.text === '[') {
          context = primary;
          primary = this.objectIndex(primary);
        } else if (next.text === '.') {
          context = primary;
          primary = this.fieldAccess(primary);
        } else {
          this.throwError('IMPOSSIBLE');
        }
      }
      return primary;
    },
    throwError: function (msg, token) {
      throw $parseMinErr('syntax', 'Syntax Error: Token \'{0}\' {1} at column {2} of the expression [{3}] starting at [{4}].', token.text, msg, token.index + 1, this.text, this.text.substring(token.index));
    },
    peekToken: function () {
      if (this.tokens.length === 0)
        throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
      return this.tokens[0];
    },
    peek: function (e1, e2, e3, e4) {
      if (this.tokens.length > 0) {
        var token = this.tokens[0];
        var t = token.text;
        if (t === e1 || t === e2 || t === e3 || t === e4 || !e1 && !e2 && !e3 && !e4) {
          return token;
        }
      }
      return false;
    },
    expect: function (e1, e2, e3, e4) {
      var token = this.peek(e1, e2, e3, e4);
      if (token) {
        if (this.json && !token.json) {
          this.throwError('is not valid json', token);
        }
        this.tokens.shift();
        return token;
      }
      return false;
    },
    consume: function (e1) {
      if (!this.expect(e1)) {
        this.throwError('is unexpected, expecting [' + e1 + ']', this.peek());
      }
    },
    unaryFn: function (fn, right) {
      return extend(function (self, locals) {
        return fn(self, locals, right);
      }, { constant: right.constant });
    },
    ternaryFn: function (left, middle, right) {
      return extend(function (self, locals) {
        return left(self, locals) ? middle(self, locals) : right(self, locals);
      }, { constant: left.constant && middle.constant && right.constant });
    },
    binaryFn: function (left, fn, right) {
      return extend(function (self, locals) {
        return fn(self, locals, left, right);
      }, { constant: left.constant && right.constant });
    },
    statements: function () {
      var statements = [];
      while (true) {
        if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']'))
          statements.push(this.filterChain());
        if (!this.expect(';')) {
          return statements.length === 1 ? statements[0] : function (self, locals) {
            var value;
            for (var i = 0; i < statements.length; i++) {
              var statement = statements[i];
              if (statement) {
                value = statement(self, locals);
              }
            }
            return value;
          };
        }
      }
    },
    filterChain: function () {
      var left = this.expression();
      var token;
      while (true) {
        if (token = this.expect('|')) {
          left = this.binaryFn(left, token.fn, this.filter());
        } else {
          return left;
        }
      }
    },
    filter: function () {
      var token = this.expect();
      var fn = this.$filter(token.text);
      var argsFn = [];
      while (true) {
        if (token = this.expect(':')) {
          argsFn.push(this.expression());
        } else {
          var fnInvoke = function (self, locals, input) {
            var args = [input];
            for (var i = 0; i < argsFn.length; i++) {
              args.push(argsFn[i](self, locals));
            }
            return fn.apply(self, args);
          };
          return function () {
            return fnInvoke;
          };
        }
      }
    },
    expression: function () {
      return this.assignment();
    },
    assignment: function () {
      var left = this.ternary();
      var right;
      var token;
      if (token = this.expect('=')) {
        if (!left.assign) {
          this.throwError('implies assignment but [' + this.text.substring(0, token.index) + '] can not be assigned to', token);
        }
        right = this.ternary();
        return function (scope, locals) {
          return left.assign(scope, right(scope, locals), locals);
        };
      }
      return left;
    },
    ternary: function () {
      var left = this.logicalOR();
      var middle;
      var token;
      if (token = this.expect('?')) {
        middle = this.ternary();
        if (token = this.expect(':')) {
          return this.ternaryFn(left, middle, this.ternary());
        } else {
          this.throwError('expected :', token);
        }
      } else {
        return left;
      }
    },
    logicalOR: function () {
      var left = this.logicalAND();
      var token;
      while (true) {
        if (token = this.expect('||')) {
          left = this.binaryFn(left, token.fn, this.logicalAND());
        } else {
          return left;
        }
      }
    },
    logicalAND: function () {
      var left = this.equality();
      var token;
      if (token = this.expect('&&')) {
        left = this.binaryFn(left, token.fn, this.logicalAND());
      }
      return left;
    },
    equality: function () {
      var left = this.relational();
      var token;
      if (token = this.expect('==', '!=', '===', '!==')) {
        left = this.binaryFn(left, token.fn, this.equality());
      }
      return left;
    },
    relational: function () {
      var left = this.additive();
      var token;
      if (token = this.expect('<', '>', '<=', '>=')) {
        left = this.binaryFn(left, token.fn, this.relational());
      }
      return left;
    },
    additive: function () {
      var left = this.multiplicative();
      var token;
      while (token = this.expect('+', '-')) {
        left = this.binaryFn(left, token.fn, this.multiplicative());
      }
      return left;
    },
    multiplicative: function () {
      var left = this.unary();
      var token;
      while (token = this.expect('*', '/', '%')) {
        left = this.binaryFn(left, token.fn, this.unary());
      }
      return left;
    },
    unary: function () {
      var token;
      if (this.expect('+')) {
        return this.primary();
      } else if (token = this.expect('-')) {
        return this.binaryFn(Parser.ZERO, token.fn, this.unary());
      } else if (token = this.expect('!')) {
        return this.unaryFn(token.fn, this.unary());
      } else {
        return this.primary();
      }
    },
    fieldAccess: function (object) {
      var parser = this;
      var field = this.expect().text;
      var getter = getterFn(field, this.options, this.text);
      return extend(function (scope, locals, self) {
        return getter(self || object(scope, locals));
      }, {
        assign: function (scope, value, locals) {
          return setter(object(scope, locals), field, value, parser.text, parser.options);
        }
      });
    },
    objectIndex: function (obj) {
      var parser = this;
      var indexFn = this.expression();
      this.consume(']');
      return extend(function (self, locals) {
        var o = obj(self, locals), i = indexFn(self, locals), v, p;
        if (!o)
          return undefined;
        v = ensureSafeObject(o[i], parser.text);
        if (v && v.then && parser.options.unwrapPromises) {
          p = v;
          if (!('$$v' in v)) {
            p.$$v = undefined;
            p.then(function (val) {
              p.$$v = val;
            });
          }
          v = v.$$v;
        }
        return v;
      }, {
        assign: function (self, value, locals) {
          var key = indexFn(self, locals);
          var safe = ensureSafeObject(obj(self, locals), parser.text);
          return safe[key] = value;
        }
      });
    },
    functionCall: function (fn, contextGetter) {
      var argsFn = [];
      if (this.peekToken().text !== ')') {
        do {
          argsFn.push(this.expression());
        } while (this.expect(','));
      }
      this.consume(')');
      var parser = this;
      return function (scope, locals) {
        var args = [];
        var context = contextGetter ? contextGetter(scope, locals) : scope;
        for (var i = 0; i < argsFn.length; i++) {
          args.push(argsFn[i](scope, locals));
        }
        var fnPtr = fn(scope, locals, context) || noop;
        ensureSafeObject(context, parser.text);
        ensureSafeObject(fnPtr, parser.text);
        var v = fnPtr.apply ? fnPtr.apply(context, args) : fnPtr(args[0], args[1], args[2], args[3], args[4]);
        return ensureSafeObject(v, parser.text);
      };
    },
    arrayDeclaration: function () {
      var elementFns = [];
      var allConstant = true;
      if (this.peekToken().text !== ']') {
        do {
          if (this.peek(']')) {
            break;
          }
          var elementFn = this.expression();
          elementFns.push(elementFn);
          if (!elementFn.constant) {
            allConstant = false;
          }
        } while (this.expect(','));
      }
      this.consume(']');
      return extend(function (self, locals) {
        var array = [];
        for (var i = 0; i < elementFns.length; i++) {
          array.push(elementFns[i](self, locals));
        }
        return array;
      }, {
        literal: true,
        constant: allConstant
      });
    },
    object: function () {
      var keyValues = [];
      var allConstant = true;
      if (this.peekToken().text !== '}') {
        do {
          if (this.peek('}')) {
            break;
          }
          var token = this.expect(), key = token.string || token.text;
          this.consume(':');
          var value = this.expression();
          keyValues.push({
            key: key,
            value: value
          });
          if (!value.constant) {
            allConstant = false;
          }
        } while (this.expect(','));
      }
      this.consume('}');
      return extend(function (self, locals) {
        var object = {};
        for (var i = 0; i < keyValues.length; i++) {
          var keyValue = keyValues[i];
          object[keyValue.key] = keyValue.value(self, locals);
        }
        return object;
      }, {
        literal: true,
        constant: allConstant
      });
    }
  };
  function setter(obj, path, setValue, fullExp, options) {
    options = options || {};
    var element = path.split('.'), key;
    for (var i = 0; element.length > 1; i++) {
      key = ensureSafeMemberName(element.shift(), fullExp);
      var propertyObj = obj[key];
      if (!propertyObj) {
        propertyObj = {};
        obj[key] = propertyObj;
      }
      obj = propertyObj;
      if (obj.then && options.unwrapPromises) {
        promiseWarning(fullExp);
        if (!('$$v' in obj)) {
          (function (promise) {
            promise.then(function (val) {
              promise.$$v = val;
            });
          }(obj));
        }
        if (obj.$$v === undefined) {
          obj.$$v = {};
        }
        obj = obj.$$v;
      }
    }
    key = ensureSafeMemberName(element.shift(), fullExp);
    obj[key] = setValue;
    return setValue;
  }
  var getterFnCache = {};
  function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp, options) {
    ensureSafeMemberName(key0, fullExp);
    ensureSafeMemberName(key1, fullExp);
    ensureSafeMemberName(key2, fullExp);
    ensureSafeMemberName(key3, fullExp);
    ensureSafeMemberName(key4, fullExp);
    return !options.unwrapPromises ? function cspSafeGetter(scope, locals) {
      var pathVal = locals && locals.hasOwnProperty(key0) ? locals : scope;
      if (pathVal == null)
        return pathVal;
      pathVal = pathVal[key0];
      if (!key1)
        return pathVal;
      if (pathVal == null)
        return undefined;
      pathVal = pathVal[key1];
      if (!key2)
        return pathVal;
      if (pathVal == null)
        return undefined;
      pathVal = pathVal[key2];
      if (!key3)
        return pathVal;
      if (pathVal == null)
        return undefined;
      pathVal = pathVal[key3];
      if (!key4)
        return pathVal;
      if (pathVal == null)
        return undefined;
      pathVal = pathVal[key4];
      return pathVal;
    } : function cspSafePromiseEnabledGetter(scope, locals) {
      var pathVal = locals && locals.hasOwnProperty(key0) ? locals : scope, promise;
      if (pathVal == null)
        return pathVal;
      pathVal = pathVal[key0];
      if (pathVal && pathVal.then) {
        promiseWarning(fullExp);
        if (!('$$v' in pathVal)) {
          promise = pathVal;
          promise.$$v = undefined;
          promise.then(function (val) {
            promise.$$v = val;
          });
        }
        pathVal = pathVal.$$v;
      }
      if (!key1)
        return pathVal;
      if (pathVal == null)
        return undefined;
      pathVal = pathVal[key1];
      if (pathVal && pathVal.then) {
        promiseWarning(fullExp);
        if (!('$$v' in pathVal)) {
          promise = pathVal;
          promise.$$v = undefined;
          promise.then(function (val) {
            promise.$$v = val;
          });
        }
        pathVal = pathVal.$$v;
      }
      if (!key2)
        return pathVal;
      if (pathVal == null)
        return undefined;
      pathVal = pathVal[key2];
      if (pathVal && pathVal.then) {
        promiseWarning(fullExp);
        if (!('$$v' in pathVal)) {
          promise = pathVal;
          promise.$$v = undefined;
          promise.then(function (val) {
            promise.$$v = val;
          });
        }
        pathVal = pathVal.$$v;
      }
      if (!key3)
        return pathVal;
      if (pathVal == null)
        return undefined;
      pathVal = pathVal[key3];
      if (pathVal && pathVal.then) {
        promiseWarning(fullExp);
        if (!('$$v' in pathVal)) {
          promise = pathVal;
          promise.$$v = undefined;
          promise.then(function (val) {
            promise.$$v = val;
          });
        }
        pathVal = pathVal.$$v;
      }
      if (!key4)
        return pathVal;
      if (pathVal == null)
        return undefined;
      pathVal = pathVal[key4];
      if (pathVal && pathVal.then) {
        promiseWarning(fullExp);
        if (!('$$v' in pathVal)) {
          promise = pathVal;
          promise.$$v = undefined;
          promise.then(function (val) {
            promise.$$v = val;
          });
        }
        pathVal = pathVal.$$v;
      }
      return pathVal;
    };
  }
  function simpleGetterFn1(key0, fullExp) {
    ensureSafeMemberName(key0, fullExp);
    return function simpleGetterFn1(scope, locals) {
      if (scope == null)
        return undefined;
      return (locals && locals.hasOwnProperty(key0) ? locals : scope)[key0];
    };
  }
  function simpleGetterFn2(key0, key1, fullExp) {
    ensureSafeMemberName(key0, fullExp);
    ensureSafeMemberName(key1, fullExp);
    return function simpleGetterFn2(scope, locals) {
      if (scope == null)
        return undefined;
      scope = (locals && locals.hasOwnProperty(key0) ? locals : scope)[key0];
      return scope == null ? undefined : scope[key1];
    };
  }
  function getterFn(path, options, fullExp) {
    if (getterFnCache.hasOwnProperty(path)) {
      return getterFnCache[path];
    }
    var pathKeys = path.split('.'), pathKeysLength = pathKeys.length, fn;
    if (!options.unwrapPromises && pathKeysLength === 1) {
      fn = simpleGetterFn1(pathKeys[0], fullExp);
    } else if (!options.unwrapPromises && pathKeysLength === 2) {
      fn = simpleGetterFn2(pathKeys[0], pathKeys[1], fullExp);
    } else if (options.csp) {
      if (pathKeysLength < 6) {
        fn = cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp, options);
      } else {
        fn = function (scope, locals) {
          var i = 0, val;
          do {
            val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], fullExp, options)(scope, locals);
            locals = undefined;
            scope = val;
          } while (i < pathKeysLength);
          return val;
        };
      }
    } else {
      var code = 'var p;\n';
      forEach(pathKeys, function (key, index) {
        ensureSafeMemberName(key, fullExp);
        code += 'if(s == null) return undefined;\n' + 's=' + (index ? 's' : '((k&&k.hasOwnProperty("' + key + '"))?k:s)') + '["' + key + '"]' + ';\n' + (options.unwrapPromises ? 'if (s && s.then) {\n' + ' pw("' + fullExp.replace(/(["\r\n])/g, '\\$1') + '");\n' + ' if (!("$$v" in s)) {\n' + ' p=s;\n' + ' p.$$v = undefined;\n' + ' p.then(function(v) {p.$$v=v;});\n' + '}\n' + ' s=s.$$v\n' + '}\n' : '');
      });
      code += 'return s;';
      var evaledFnGetter = new Function('s', 'k', 'pw', code);
      evaledFnGetter.toString = valueFn(code);
      fn = options.unwrapPromises ? function (scope, locals) {
        return evaledFnGetter(scope, locals, promiseWarning);
      } : evaledFnGetter;
    }
    if (path !== 'hasOwnProperty') {
      getterFnCache[path] = fn;
    }
    return fn;
  }
  function $ParseProvider() {
    var cache = {};
    var $parseOptions = {
        csp: false,
        unwrapPromises: false,
        logPromiseWarnings: true
      };
    this.unwrapPromises = function (value) {
      if (isDefined(value)) {
        $parseOptions.unwrapPromises = !!value;
        return this;
      } else {
        return $parseOptions.unwrapPromises;
      }
    };
    this.logPromiseWarnings = function (value) {
      if (isDefined(value)) {
        $parseOptions.logPromiseWarnings = value;
        return this;
      } else {
        return $parseOptions.logPromiseWarnings;
      }
    };
    this.$get = [
      '$filter',
      '$sniffer',
      '$log',
      function ($filter, $sniffer, $log) {
        $parseOptions.csp = $sniffer.csp;
        promiseWarning = function promiseWarningFn(fullExp) {
          if (!$parseOptions.logPromiseWarnings || promiseWarningCache.hasOwnProperty(fullExp))
            return;
          promiseWarningCache[fullExp] = true;
          $log.warn('[$parse] Promise found in the expression `' + fullExp + '`. ' + 'Automatic unwrapping of promises in Angular expressions is deprecated.');
        };
        return function (exp) {
          var parsedExpression;
          switch (typeof exp) {
          case 'string':
            if (cache.hasOwnProperty(exp)) {
              return cache[exp];
            }
            var lexer = new Lexer($parseOptions);
            var parser = new Parser(lexer, $filter, $parseOptions);
            parsedExpression = parser.parse(exp, false);
            if (exp !== 'hasOwnProperty') {
              cache[exp] = parsedExpression;
            }
            return parsedExpression;
          case 'function':
            return exp;
          default:
            return noop;
          }
        };
      }
    ];
  }
  function $QProvider() {
    this.$get = [
      '$rootScope',
      '$exceptionHandler',
      function ($rootScope, $exceptionHandler) {
        return qFactory(function (callback) {
          $rootScope.$evalAsync(callback);
        }, $exceptionHandler);
      }
    ];
  }
  function qFactory(nextTick, exceptionHandler) {
    var defer = function () {
      var pending = [], value, deferred;
      deferred = {
        resolve: function (val) {
          if (pending) {
            var callbacks = pending;
            pending = undefined;
            value = ref(val);
            if (callbacks.length) {
              nextTick(function () {
                var callback;
                for (var i = 0, ii = callbacks.length; i < ii; i++) {
                  callback = callbacks[i];
                  value.then(callback[0], callback[1], callback[2]);
                }
              });
            }
          }
        },
        reject: function (reason) {
          deferred.resolve(createInternalRejectedPromise(reason));
        },
        notify: function (progress) {
          if (pending) {
            var callbacks = pending;
            if (pending.length) {
              nextTick(function () {
                var callback;
                for (var i = 0, ii = callbacks.length; i < ii; i++) {
                  callback = callbacks[i];
                  callback[2](progress);
                }
              });
            }
          }
        },
        promise: {
          then: function (callback, errback, progressback) {
            var result = defer();
            var wrappedCallback = function (value) {
              try {
                result.resolve((isFunction(callback) ? callback : defaultCallback)(value));
              } catch (e) {
                result.reject(e);
                exceptionHandler(e);
              }
            };
            var wrappedErrback = function (reason) {
              try {
                result.resolve((isFunction(errback) ? errback : defaultErrback)(reason));
              } catch (e) {
                result.reject(e);
                exceptionHandler(e);
              }
            };
            var wrappedProgressback = function (progress) {
              try {
                result.notify((isFunction(progressback) ? progressback : defaultCallback)(progress));
              } catch (e) {
                exceptionHandler(e);
              }
            };
            if (pending) {
              pending.push([
                wrappedCallback,
                wrappedErrback,
                wrappedProgressback
              ]);
            } else {
              value.then(wrappedCallback, wrappedErrback, wrappedProgressback);
            }
            return result.promise;
          },
          'catch': function (callback) {
            return this.then(null, callback);
          },
          'finally': function (callback) {
            function makePromise(value, resolved) {
              var result = defer();
              if (resolved) {
                result.resolve(value);
              } else {
                result.reject(value);
              }
              return result.promise;
            }
            function handleCallback(value, isResolved) {
              var callbackOutput = null;
              try {
                callbackOutput = (callback || defaultCallback)();
              } catch (e) {
                return makePromise(e, false);
              }
              if (callbackOutput && isFunction(callbackOutput.then)) {
                return callbackOutput.then(function () {
                  return makePromise(value, isResolved);
                }, function (error) {
                  return makePromise(error, false);
                });
              } else {
                return makePromise(value, isResolved);
              }
            }
            return this.then(function (value) {
              return handleCallback(value, true);
            }, function (error) {
              return handleCallback(error, false);
            });
          }
        }
      };
      return deferred;
    };
    var ref = function (value) {
      if (value && isFunction(value.then))
        return value;
      return {
        then: function (callback) {
          var result = defer();
          nextTick(function () {
            result.resolve(callback(value));
          });
          return result.promise;
        }
      };
    };
    var reject = function (reason) {
      var result = defer();
      result.reject(reason);
      return result.promise;
    };
    var createInternalRejectedPromise = function (reason) {
      return {
        then: function (callback, errback) {
          var result = defer();
          nextTick(function () {
            try {
              result.resolve((isFunction(errback) ? errback : defaultErrback)(reason));
            } catch (e) {
              result.reject(e);
              exceptionHandler(e);
            }
          });
          return result.promise;
        }
      };
    };
    var when = function (value, callback, errback, progressback) {
      var result = defer(), done;
      var wrappedCallback = function (value) {
        try {
          return (isFunction(callback) ? callback : defaultCallback)(value);
        } catch (e) {
          exceptionHandler(e);
          return reject(e);
        }
      };
      var wrappedErrback = function (reason) {
        try {
          return (isFunction(errback) ? errback : defaultErrback)(reason);
        } catch (e) {
          exceptionHandler(e);
          return reject(e);
        }
      };
      var wrappedProgressback = function (progress) {
        try {
          return (isFunction(progressback) ? progressback : defaultCallback)(progress);
        } catch (e) {
          exceptionHandler(e);
        }
      };
      nextTick(function () {
        ref(value).then(function (value) {
          if (done)
            return;
          done = true;
          result.resolve(ref(value).then(wrappedCallback, wrappedErrback, wrappedProgressback));
        }, function (reason) {
          if (done)
            return;
          done = true;
          result.resolve(wrappedErrback(reason));
        }, function (progress) {
          if (done)
            return;
          result.notify(wrappedProgressback(progress));
        });
      });
      return result.promise;
    };
    function defaultCallback(value) {
      return value;
    }
    function defaultErrback(reason) {
      return reject(reason);
    }
    function all(promises) {
      var deferred = defer(), counter = 0, results = isArray(promises) ? [] : {};
      forEach(promises, function (promise, key) {
        counter++;
        ref(promise).then(function (value) {
          if (results.hasOwnProperty(key))
            return;
          results[key] = value;
          if (!--counter)
            deferred.resolve(results);
        }, function (reason) {
          if (results.hasOwnProperty(key))
            return;
          deferred.reject(reason);
        });
      });
      if (counter === 0) {
        deferred.resolve(results);
      }
      return deferred.promise;
    }
    return {
      defer: defer,
      reject: reject,
      when: when,
      all: all
    };
  }
  function $$RAFProvider() {
    this.$get = [
      '$window',
      '$timeout',
      function ($window, $timeout) {
        var requestAnimationFrame = $window.requestAnimationFrame || $window.webkitRequestAnimationFrame || $window.mozRequestAnimationFrame;
        var cancelAnimationFrame = $window.cancelAnimationFrame || $window.webkitCancelAnimationFrame || $window.mozCancelAnimationFrame || $window.webkitCancelRequestAnimationFrame;
        var rafSupported = !!requestAnimationFrame;
        var raf = rafSupported ? function (fn) {
            var id = requestAnimationFrame(fn);
            return function () {
              cancelAnimationFrame(id);
            };
          } : function (fn) {
            var timer = $timeout(fn, 16.66, false);
            return function () {
              $timeout.cancel(timer);
            };
          };
        raf.supported = rafSupported;
        return raf;
      }
    ];
  }
  function $RootScopeProvider() {
    var TTL = 10;
    var $rootScopeMinErr = minErr('$rootScope');
    var lastDirtyWatch = null;
    this.digestTtl = function (value) {
      if (arguments.length) {
        TTL = value;
      }
      return TTL;
    };
    this.$get = [
      '$injector',
      '$exceptionHandler',
      '$parse',
      '$browser',
      function ($injector, $exceptionHandler, $parse, $browser) {
        function Scope() {
          this.$id = nextUid();
          this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null;
          this['this'] = this.$root = this;
          this.$$destroyed = false;
          this.$$asyncQueue = [];
          this.$$postDigestQueue = [];
          this.$$listeners = {};
          this.$$listenerCount = {};
          this.$$isolateBindings = {};
        }
        Scope.prototype = {
          constructor: Scope,
          $new: function (isolate) {
            var ChildScope, child;
            if (isolate) {
              child = new Scope();
              child.$root = this.$root;
              child.$$asyncQueue = this.$$asyncQueue;
              child.$$postDigestQueue = this.$$postDigestQueue;
            } else {
              ChildScope = function () {
              };
              ChildScope.prototype = this;
              child = new ChildScope();
              child.$id = nextUid();
            }
            child['this'] = child;
            child.$$listeners = {};
            child.$$listenerCount = {};
            child.$parent = this;
            child.$$watchers = child.$$nextSibling = child.$$childHead = child.$$childTail = null;
            child.$$prevSibling = this.$$childTail;
            if (this.$$childHead) {
              this.$$childTail.$$nextSibling = child;
              this.$$childTail = child;
            } else {
              this.$$childHead = this.$$childTail = child;
            }
            return child;
          },
          $watch: function (watchExp, listener, objectEquality) {
            var scope = this, get = compileToFn(watchExp, 'watch'), array = scope.$$watchers, watcher = {
                fn: listener,
                last: initWatchVal,
                get: get,
                exp: watchExp,
                eq: !!objectEquality
              };
            lastDirtyWatch = null;
            if (!isFunction(listener)) {
              var listenFn = compileToFn(listener || noop, 'listener');
              watcher.fn = function (newVal, oldVal, scope) {
                listenFn(scope);
              };
            }
            if (typeof watchExp == 'string' && get.constant) {
              var originalFn = watcher.fn;
              watcher.fn = function (newVal, oldVal, scope) {
                originalFn.call(this, newVal, oldVal, scope);
                arrayRemove(array, watcher);
              };
            }
            if (!array) {
              array = scope.$$watchers = [];
            }
            array.unshift(watcher);
            return function () {
              arrayRemove(array, watcher);
              lastDirtyWatch = null;
            };
          },
          $watchCollection: function (obj, listener) {
            var self = this;
            var newValue;
            var oldValue;
            var veryOldValue;
            var trackVeryOldValue = listener.length > 1;
            var changeDetected = 0;
            var objGetter = $parse(obj);
            var internalArray = [];
            var internalObject = {};
            var initRun = true;
            var oldLength = 0;
            function $watchCollectionWatch() {
              newValue = objGetter(self);
              var newLength, key;
              if (!isObject(newValue)) {
                if (oldValue !== newValue) {
                  oldValue = newValue;
                  changeDetected++;
                }
              } else if (isArrayLike(newValue)) {
                if (oldValue !== internalArray) {
                  oldValue = internalArray;
                  oldLength = oldValue.length = 0;
                  changeDetected++;
                }
                newLength = newValue.length;
                if (oldLength !== newLength) {
                  changeDetected++;
                  oldValue.length = oldLength = newLength;
                }
                for (var i = 0; i < newLength; i++) {
                  var bothNaN = oldValue[i] !== oldValue[i] && newValue[i] !== newValue[i];
                  if (!bothNaN && oldValue[i] !== newValue[i]) {
                    changeDetected++;
                    oldValue[i] = newValue[i];
                  }
                }
              } else {
                if (oldValue !== internalObject) {
                  oldValue = internalObject = {};
                  oldLength = 0;
                  changeDetected++;
                }
                newLength = 0;
                for (key in newValue) {
                  if (newValue.hasOwnProperty(key)) {
                    newLength++;
                    if (oldValue.hasOwnProperty(key)) {
                      if (oldValue[key] !== newValue[key]) {
                        changeDetected++;
                        oldValue[key] = newValue[key];
                      }
                    } else {
                      oldLength++;
                      oldValue[key] = newValue[key];
                      changeDetected++;
                    }
                  }
                }
                if (oldLength > newLength) {
                  changeDetected++;
                  for (key in oldValue) {
                    if (oldValue.hasOwnProperty(key) && !newValue.hasOwnProperty(key)) {
                      oldLength--;
                      delete oldValue[key];
                    }
                  }
                }
              }
              return changeDetected;
            }
            function $watchCollectionAction() {
              if (initRun) {
                initRun = false;
                listener(newValue, newValue, self);
              } else {
                listener(newValue, veryOldValue, self);
              }
              if (trackVeryOldValue) {
                if (!isObject(newValue)) {
                  veryOldValue = newValue;
                } else if (isArrayLike(newValue)) {
                  veryOldValue = new Array(newValue.length);
                  for (var i = 0; i < newValue.length; i++) {
                    veryOldValue[i] = newValue[i];
                  }
                } else {
                  veryOldValue = {};
                  for (var key in newValue) {
                    if (hasOwnProperty.call(newValue, key)) {
                      veryOldValue[key] = newValue[key];
                    }
                  }
                }
              }
            }
            return this.$watch($watchCollectionWatch, $watchCollectionAction);
          },
          $digest: function () {
            var watch, value, last, watchers, asyncQueue = this.$$asyncQueue, postDigestQueue = this.$$postDigestQueue, length, dirty, ttl = TTL, next, current, target = this, watchLog = [], logIdx, logMsg, asyncTask;
            beginPhase('$digest');
            lastDirtyWatch = null;
            do {
              dirty = false;
              current = target;
              while (asyncQueue.length) {
                try {
                  asyncTask = asyncQueue.shift();
                  asyncTask.scope.$eval(asyncTask.expression);
                } catch (e) {
                  clearPhase();
                  $exceptionHandler(e);
                }
                lastDirtyWatch = null;
              }
              traverseScopesLoop:
                do {
                  if (watchers = current.$$watchers) {
                    length = watchers.length;
                    while (length--) {
                      try {
                        watch = watchers[length];
                        if (watch) {
                          if ((value = watch.get(current)) !== (last = watch.last) && !(watch.eq ? equals(value, last) : typeof value == 'number' && typeof last == 'number' && isNaN(value) && isNaN(last))) {
                            dirty = true;
                            lastDirtyWatch = watch;
                            watch.last = watch.eq ? copy(value) : value;
                            watch.fn(value, last === initWatchVal ? value : last, current);
                            if (ttl < 5) {
                              logIdx = 4 - ttl;
                              if (!watchLog[logIdx])
                                watchLog[logIdx] = [];
                              logMsg = isFunction(watch.exp) ? 'fn: ' + (watch.exp.name || watch.exp.toString()) : watch.exp;
                              logMsg += '; newVal: ' + toJson(value) + '; oldVal: ' + toJson(last);
                              watchLog[logIdx].push(logMsg);
                            }
                          } else if (watch === lastDirtyWatch) {
                            dirty = false;
                            break traverseScopesLoop;
                          }
                        }
                      } catch (e) {
                        clearPhase();
                        $exceptionHandler(e);
                      }
                    }
                  }
                  if (!(next = current.$$childHead || current !== target && current.$$nextSibling)) {
                    while (current !== target && !(next = current.$$nextSibling)) {
                      current = current.$parent;
                    }
                  }
                } while (current = next);
              if ((dirty || asyncQueue.length) && !ttl--) {
                clearPhase();
                throw $rootScopeMinErr('infdig', '{0} $digest() iterations reached. Aborting!\n' + 'Watchers fired in the last 5 iterations: {1}', TTL, toJson(watchLog));
              }
            } while (dirty || asyncQueue.length);
            clearPhase();
            while (postDigestQueue.length) {
              try {
                postDigestQueue.shift()();
              } catch (e) {
                $exceptionHandler(e);
              }
            }
          },
          $destroy: function () {
            if (this.$$destroyed)
              return;
            var parent = this.$parent;
            this.$broadcast('$destroy');
            this.$$destroyed = true;
            if (this === $rootScope)
              return;
            forEach(this.$$listenerCount, bind(null, decrementListenerCount, this));
            if (parent.$$childHead == this)
              parent.$$childHead = this.$$nextSibling;
            if (parent.$$childTail == this)
              parent.$$childTail = this.$$prevSibling;
            if (this.$$prevSibling)
              this.$$prevSibling.$$nextSibling = this.$$nextSibling;
            if (this.$$nextSibling)
              this.$$nextSibling.$$prevSibling = this.$$prevSibling;
            this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null;
          },
          $eval: function (expr, locals) {
            return $parse(expr)(this, locals);
          },
          $evalAsync: function (expr) {
            if (!$rootScope.$$phase && !$rootScope.$$asyncQueue.length) {
              $browser.defer(function () {
                if ($rootScope.$$asyncQueue.length) {
                  $rootScope.$digest();
                }
              });
            }
            this.$$asyncQueue.push({
              scope: this,
              expression: expr
            });
          },
          $$postDigest: function (fn) {
            this.$$postDigestQueue.push(fn);
          },
          $apply: function (expr) {
            try {
              beginPhase('$apply');
              return this.$eval(expr);
            } catch (e) {
              $exceptionHandler(e);
            } finally {
              clearPhase();
              try {
                $rootScope.$digest();
              } catch (e) {
                $exceptionHandler(e);
                throw e;
              }
            }
          },
          $on: function (name, listener) {
            var namedListeners = this.$$listeners[name];
            if (!namedListeners) {
              this.$$listeners[name] = namedListeners = [];
            }
            namedListeners.push(listener);
            var current = this;
            do {
              if (!current.$$listenerCount[name]) {
                current.$$listenerCount[name] = 0;
              }
              current.$$listenerCount[name]++;
            } while (current = current.$parent);
            var self = this;
            return function () {
              namedListeners[indexOf(namedListeners, listener)] = null;
              decrementListenerCount(self, 1, name);
            };
          },
          $emit: function (name, args) {
            var empty = [], namedListeners, scope = this, stopPropagation = false, event = {
                name: name,
                targetScope: scope,
                stopPropagation: function () {
                  stopPropagation = true;
                },
                preventDefault: function () {
                  event.defaultPrevented = true;
                },
                defaultPrevented: false
              }, listenerArgs = concat([event], arguments, 1), i, length;
            do {
              namedListeners = scope.$$listeners[name] || empty;
              event.currentScope = scope;
              for (i = 0, length = namedListeners.length; i < length; i++) {
                if (!namedListeners[i]) {
                  namedListeners.splice(i, 1);
                  i--;
                  length--;
                  continue;
                }
                try {
                  namedListeners[i].apply(null, listenerArgs);
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
              if (stopPropagation)
                return event;
              scope = scope.$parent;
            } while (scope);
            return event;
          },
          $broadcast: function (name, args) {
            var target = this, current = target, next = target, event = {
                name: name,
                targetScope: target,
                preventDefault: function () {
                  event.defaultPrevented = true;
                },
                defaultPrevented: false
              }, listenerArgs = concat([event], arguments, 1), listeners, i, length;
            while (current = next) {
              event.currentScope = current;
              listeners = current.$$listeners[name] || [];
              for (i = 0, length = listeners.length; i < length; i++) {
                if (!listeners[i]) {
                  listeners.splice(i, 1);
                  i--;
                  length--;
                  continue;
                }
                try {
                  listeners[i].apply(null, listenerArgs);
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
              if (!(next = current.$$listenerCount[name] && current.$$childHead || current !== target && current.$$nextSibling)) {
                while (current !== target && !(next = current.$$nextSibling)) {
                  current = current.$parent;
                }
              }
            }
            return event;
          }
        };
        var $rootScope = new Scope();
        return $rootScope;
        function beginPhase(phase) {
          if ($rootScope.$$phase) {
            throw $rootScopeMinErr('inprog', '{0} already in progress', $rootScope.$$phase);
          }
          $rootScope.$$phase = phase;
        }
        function clearPhase() {
          $rootScope.$$phase = null;
        }
        function compileToFn(exp, name) {
          var fn = $parse(exp);
          assertArgFn(fn, name);
          return fn;
        }
        function decrementListenerCount(current, count, name) {
          do {
            current.$$listenerCount[name] -= count;
            if (current.$$listenerCount[name] === 0) {
              delete current.$$listenerCount[name];
            }
          } while (current = current.$parent);
        }
        function initWatchVal() {
        }
      }
    ];
  }
  function $$SanitizeUriProvider() {
    var aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|tel|file):/, imgSrcSanitizationWhitelist = /^\s*(https?|ftp|file):|data:image\//;
    this.aHrefSanitizationWhitelist = function (regexp) {
      if (isDefined(regexp)) {
        aHrefSanitizationWhitelist = regexp;
        return this;
      }
      return aHrefSanitizationWhitelist;
    };
    this.imgSrcSanitizationWhitelist = function (regexp) {
      if (isDefined(regexp)) {
        imgSrcSanitizationWhitelist = regexp;
        return this;
      }
      return imgSrcSanitizationWhitelist;
    };
    this.$get = function () {
      return function sanitizeUri(uri, isImage) {
        var regex = isImage ? imgSrcSanitizationWhitelist : aHrefSanitizationWhitelist;
        var normalizedVal;
        if (!msie || msie >= 8) {
          normalizedVal = urlResolve(uri).href;
          if (normalizedVal !== '' && !normalizedVal.match(regex)) {
            return 'unsafe:' + normalizedVal;
          }
        }
        return uri;
      };
    };
  }
  var $sceMinErr = minErr('$sce');
  var SCE_CONTEXTS = {
      HTML: 'html',
      CSS: 'css',
      URL: 'url',
      RESOURCE_URL: 'resourceUrl',
      JS: 'js'
    };
  function escapeForRegexp(s) {
    return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').replace(/\x08/g, '\\x08');
  }
  function adjustMatcher(matcher) {
    if (matcher === 'self') {
      return matcher;
    } else if (isString(matcher)) {
      if (matcher.indexOf('***') > -1) {
        throw $sceMinErr('iwcard', 'Illegal sequence *** in string matcher.  String: {0}', matcher);
      }
      matcher = escapeForRegexp(matcher).replace('\\*\\*', '.*').replace('\\*', '[^:/.?&;]*');
      return new RegExp('^' + matcher + '$');
    } else if (isRegExp(matcher)) {
      return new RegExp('^' + matcher.source + '$');
    } else {
      throw $sceMinErr('imatcher', 'Matchers may only be "self", string patterns or RegExp objects');
    }
  }
  function adjustMatchers(matchers) {
    var adjustedMatchers = [];
    if (isDefined(matchers)) {
      forEach(matchers, function (matcher) {
        adjustedMatchers.push(adjustMatcher(matcher));
      });
    }
    return adjustedMatchers;
  }
  function $SceDelegateProvider() {
    this.SCE_CONTEXTS = SCE_CONTEXTS;
    var resourceUrlWhitelist = ['self'], resourceUrlBlacklist = [];
    this.resourceUrlWhitelist = function (value) {
      if (arguments.length) {
        resourceUrlWhitelist = adjustMatchers(value);
      }
      return resourceUrlWhitelist;
    };
    this.resourceUrlBlacklist = function (value) {
      if (arguments.length) {
        resourceUrlBlacklist = adjustMatchers(value);
      }
      return resourceUrlBlacklist;
    };
    this.$get = [
      '$injector',
      function ($injector) {
        var htmlSanitizer = function htmlSanitizer(html) {
          throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
        };
        if ($injector.has('$sanitize')) {
          htmlSanitizer = $injector.get('$sanitize');
        }
        function matchUrl(matcher, parsedUrl) {
          if (matcher === 'self') {
            return urlIsSameOrigin(parsedUrl);
          } else {
            return !!matcher.exec(parsedUrl.href);
          }
        }
        function isResourceUrlAllowedByPolicy(url) {
          var parsedUrl = urlResolve(url.toString());
          var i, n, allowed = false;
          for (i = 0, n = resourceUrlWhitelist.length; i < n; i++) {
            if (matchUrl(resourceUrlWhitelist[i], parsedUrl)) {
              allowed = true;
              break;
            }
          }
          if (allowed) {
            for (i = 0, n = resourceUrlBlacklist.length; i < n; i++) {
              if (matchUrl(resourceUrlBlacklist[i], parsedUrl)) {
                allowed = false;
                break;
              }
            }
          }
          return allowed;
        }
        function generateHolderType(Base) {
          var holderType = function TrustedValueHolderType(trustedValue) {
            this.$$unwrapTrustedValue = function () {
              return trustedValue;
            };
          };
          if (Base) {
            holderType.prototype = new Base();
          }
          holderType.prototype.valueOf = function sceValueOf() {
            return this.$$unwrapTrustedValue();
          };
          holderType.prototype.toString = function sceToString() {
            return this.$$unwrapTrustedValue().toString();
          };
          return holderType;
        }
        var trustedValueHolderBase = generateHolderType(), byType = {};
        byType[SCE_CONTEXTS.HTML] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.CSS] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.URL] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.JS] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.RESOURCE_URL] = generateHolderType(byType[SCE_CONTEXTS.URL]);
        function trustAs(type, trustedValue) {
          var Constructor = byType.hasOwnProperty(type) ? byType[type] : null;
          if (!Constructor) {
            throw $sceMinErr('icontext', 'Attempted to trust a value in invalid context. Context: {0}; Value: {1}', type, trustedValue);
          }
          if (trustedValue === null || trustedValue === undefined || trustedValue === '') {
            return trustedValue;
          }
          if (typeof trustedValue !== 'string') {
            throw $sceMinErr('itype', 'Attempted to trust a non-string value in a content requiring a string: Context: {0}', type);
          }
          return new Constructor(trustedValue);
        }
        function valueOf(maybeTrusted) {
          if (maybeTrusted instanceof trustedValueHolderBase) {
            return maybeTrusted.$$unwrapTrustedValue();
          } else {
            return maybeTrusted;
          }
        }
        function getTrusted(type, maybeTrusted) {
          if (maybeTrusted === null || maybeTrusted === undefined || maybeTrusted === '') {
            return maybeTrusted;
          }
          var constructor = byType.hasOwnProperty(type) ? byType[type] : null;
          if (constructor && maybeTrusted instanceof constructor) {
            return maybeTrusted.$$unwrapTrustedValue();
          }
          if (type === SCE_CONTEXTS.RESOURCE_URL) {
            if (isResourceUrlAllowedByPolicy(maybeTrusted)) {
              return maybeTrusted;
            } else {
              throw $sceMinErr('insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}', maybeTrusted.toString());
            }
          } else if (type === SCE_CONTEXTS.HTML) {
            return htmlSanitizer(maybeTrusted);
          }
          throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
        }
        return {
          trustAs: trustAs,
          getTrusted: getTrusted,
          valueOf: valueOf
        };
      }
    ];
  }
  function $SceProvider() {
    var enabled = true;
    this.enabled = function (value) {
      if (arguments.length) {
        enabled = !!value;
      }
      return enabled;
    };
    this.$get = [
      '$parse',
      '$sniffer',
      '$sceDelegate',
      function ($parse, $sniffer, $sceDelegate) {
        if (enabled && $sniffer.msie && $sniffer.msieDocumentMode < 8) {
          throw $sceMinErr('iequirks', 'Strict Contextual Escaping does not support Internet Explorer version < 9 in quirks ' + 'mode.  You can fix this by adding the text <!doctype html> to the top of your HTML ' + 'document.  See http://docs.angularjs.org/api/ng.$sce for more information.');
        }
        var sce = copy(SCE_CONTEXTS);
        sce.isEnabled = function () {
          return enabled;
        };
        sce.trustAs = $sceDelegate.trustAs;
        sce.getTrusted = $sceDelegate.getTrusted;
        sce.valueOf = $sceDelegate.valueOf;
        if (!enabled) {
          sce.trustAs = sce.getTrusted = function (type, value) {
            return value;
          };
          sce.valueOf = identity;
        }
        sce.parseAs = function sceParseAs(type, expr) {
          var parsed = $parse(expr);
          if (parsed.literal && parsed.constant) {
            return parsed;
          } else {
            return function sceParseAsTrusted(self, locals) {
              return sce.getTrusted(type, parsed(self, locals));
            };
          }
        };
        var parse = sce.parseAs, getTrusted = sce.getTrusted, trustAs = sce.trustAs;
        forEach(SCE_CONTEXTS, function (enumValue, name) {
          var lName = lowercase(name);
          sce[camelCase('parse_as_' + lName)] = function (expr) {
            return parse(enumValue, expr);
          };
          sce[camelCase('get_trusted_' + lName)] = function (value) {
            return getTrusted(enumValue, value);
          };
          sce[camelCase('trust_as_' + lName)] = function (value) {
            return trustAs(enumValue, value);
          };
        });
        return sce;
      }
    ];
  }
  function $SnifferProvider() {
    this.$get = [
      '$window',
      '$document',
      function ($window, $document) {
        var eventSupport = {}, android = int((/android (\d+)/.exec(lowercase(($window.navigator || {}).userAgent)) || [])[1]), boxee = /Boxee/i.test(($window.navigator || {}).userAgent), document = $document[0] || {}, documentMode = document.documentMode, vendorPrefix, vendorRegex = /^(Moz|webkit|O|ms)(?=[A-Z])/, bodyStyle = document.body && document.body.style, transitions = false, animations = false, match;
        if (bodyStyle) {
          for (var prop in bodyStyle) {
            if (match = vendorRegex.exec(prop)) {
              vendorPrefix = match[0];
              vendorPrefix = vendorPrefix.substr(0, 1).toUpperCase() + vendorPrefix.substr(1);
              break;
            }
          }
          if (!vendorPrefix) {
            vendorPrefix = 'WebkitOpacity' in bodyStyle && 'webkit';
          }
          transitions = !!('transition' in bodyStyle || vendorPrefix + 'Transition' in bodyStyle);
          animations = !!('animation' in bodyStyle || vendorPrefix + 'Animation' in bodyStyle);
          if (android && (!transitions || !animations)) {
            transitions = isString(document.body.style.webkitTransition);
            animations = isString(document.body.style.webkitAnimation);
          }
        }
        return {
          history: !!($window.history && $window.history.pushState && !(android < 4) && !boxee),
          hashchange: 'onhashchange' in $window && (!documentMode || documentMode > 7),
          hasEvent: function (event) {
            if (event == 'input' && msie == 9)
              return false;
            if (isUndefined(eventSupport[event])) {
              var divElm = document.createElement('div');
              eventSupport[event] = 'on' + event in divElm;
            }
            return eventSupport[event];
          },
          csp: csp(),
          vendorPrefix: vendorPrefix,
          transitions: transitions,
          animations: animations,
          android: android,
          msie: msie,
          msieDocumentMode: documentMode
        };
      }
    ];
  }
  function $TimeoutProvider() {
    this.$get = [
      '$rootScope',
      '$browser',
      '$q',
      '$exceptionHandler',
      function ($rootScope, $browser, $q, $exceptionHandler) {
        var deferreds = {};
        function timeout(fn, delay, invokeApply) {
          var deferred = $q.defer(), promise = deferred.promise, skipApply = isDefined(invokeApply) && !invokeApply, timeoutId;
          timeoutId = $browser.defer(function () {
            try {
              deferred.resolve(fn());
            } catch (e) {
              deferred.reject(e);
              $exceptionHandler(e);
            } finally {
              delete deferreds[promise.$$timeoutId];
            }
            if (!skipApply)
              $rootScope.$apply();
          }, delay);
          promise.$$timeoutId = timeoutId;
          deferreds[timeoutId] = deferred;
          return promise;
        }
        timeout.cancel = function (promise) {
          if (promise && promise.$$timeoutId in deferreds) {
            deferreds[promise.$$timeoutId].reject('canceled');
            delete deferreds[promise.$$timeoutId];
            return $browser.defer.cancel(promise.$$timeoutId);
          }
          return false;
        };
        return timeout;
      }
    ];
  }
  var urlParsingNode = document.createElement('a');
  var originUrl = urlResolve(window.location.href, true);
  function urlResolve(url, base) {
    var href = url;
    if (msie) {
      urlParsingNode.setAttribute('href', href);
      href = urlParsingNode.href;
    }
    urlParsingNode.setAttribute('href', href);
    return {
      href: urlParsingNode.href,
      protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
      host: urlParsingNode.host,
      search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
      hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
      hostname: urlParsingNode.hostname,
      port: urlParsingNode.port,
      pathname: urlParsingNode.pathname.charAt(0) === '/' ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
    };
  }
  function urlIsSameOrigin(requestUrl) {
    var parsed = isString(requestUrl) ? urlResolve(requestUrl) : requestUrl;
    return parsed.protocol === originUrl.protocol && parsed.host === originUrl.host;
  }
  function $WindowProvider() {
    this.$get = valueFn(window);
  }
  $FilterProvider.$inject = ['$provide'];
  function $FilterProvider($provide) {
    var suffix = 'Filter';
    function register(name, factory) {
      if (isObject(name)) {
        var filters = {};
        forEach(name, function (filter, key) {
          filters[key] = register(key, filter);
        });
        return filters;
      } else {
        return $provide.factory(name + suffix, factory);
      }
    }
    this.register = register;
    this.$get = [
      '$injector',
      function ($injector) {
        return function (name) {
          return $injector.get(name + suffix);
        };
      }
    ];
    register('currency', currencyFilter);
    register('date', dateFilter);
    register('filter', filterFilter);
    register('json', jsonFilter);
    register('limitTo', limitToFilter);
    register('lowercase', lowercaseFilter);
    register('number', numberFilter);
    register('orderBy', orderByFilter);
    register('uppercase', uppercaseFilter);
  }
  function filterFilter() {
    return function (array, expression, comparator) {
      if (!isArray(array))
        return array;
      var comparatorType = typeof comparator, predicates = [];
      predicates.check = function (value) {
        for (var j = 0; j < predicates.length; j++) {
          if (!predicates[j](value)) {
            return false;
          }
        }
        return true;
      };
      if (comparatorType !== 'function') {
        if (comparatorType === 'boolean' && comparator) {
          comparator = function (obj, text) {
            return angular.equals(obj, text);
          };
        } else {
          comparator = function (obj, text) {
            if (obj && text && typeof obj === 'object' && typeof text === 'object') {
              for (var objKey in obj) {
                if (objKey.charAt(0) !== '$' && hasOwnProperty.call(obj, objKey) && comparator(obj[objKey], text[objKey])) {
                  return true;
                }
              }
              return false;
            }
            text = ('' + text).toLowerCase();
            return ('' + obj).toLowerCase().indexOf(text) > -1;
          };
        }
      }
      var search = function (obj, text) {
        if (typeof text == 'string' && text.charAt(0) === '!') {
          return !search(obj, text.substr(1));
        }
        switch (typeof obj) {
        case 'boolean':
        case 'number':
        case 'string':
          return comparator(obj, text);
        case 'object':
          switch (typeof text) {
          case 'object':
            return comparator(obj, text);
          default:
            for (var objKey in obj) {
              if (objKey.charAt(0) !== '$' && search(obj[objKey], text)) {
                return true;
              }
            }
            break;
          }
          return false;
        case 'array':
          for (var i = 0; i < obj.length; i++) {
            if (search(obj[i], text)) {
              return true;
            }
          }
          return false;
        default:
          return false;
        }
      };
      switch (typeof expression) {
      case 'boolean':
      case 'number':
      case 'string':
        expression = { $: expression };
      case 'object':
        for (var key in expression) {
          (function (path) {
            if (typeof expression[path] == 'undefined')
              return;
            predicates.push(function (value) {
              return search(path == '$' ? value : value && value[path], expression[path]);
            });
          }(key));
        }
        break;
      case 'function':
        predicates.push(expression);
        break;
      default:
        return array;
      }
      var filtered = [];
      for (var j = 0; j < array.length; j++) {
        var value = array[j];
        if (predicates.check(value)) {
          filtered.push(value);
        }
      }
      return filtered;
    };
  }
  currencyFilter.$inject = ['$locale'];
  function currencyFilter($locale) {
    var formats = $locale.NUMBER_FORMATS;
    return function (amount, currencySymbol) {
      if (isUndefined(currencySymbol))
        currencySymbol = formats.CURRENCY_SYM;
      return formatNumber(amount, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, 2).replace(/\u00A4/g, currencySymbol);
    };
  }
  numberFilter.$inject = ['$locale'];
  function numberFilter($locale) {
    var formats = $locale.NUMBER_FORMATS;
    return function (number, fractionSize) {
      return formatNumber(number, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize);
    };
  }
  var DECIMAL_SEP = '.';
  function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
    if (number == null || !isFinite(number) || isObject(number))
      return '';
    var isNegative = number < 0;
    number = Math.abs(number);
    var numStr = number + '', formatedText = '', parts = [];
    var hasExponent = false;
    if (numStr.indexOf('e') !== -1) {
      var match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
      if (match && match[2] == '-' && match[3] > fractionSize + 1) {
        numStr = '0';
      } else {
        formatedText = numStr;
        hasExponent = true;
      }
    }
    if (!hasExponent) {
      var fractionLen = (numStr.split(DECIMAL_SEP)[1] || '').length;
      if (isUndefined(fractionSize)) {
        fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac);
      }
      var pow = Math.pow(10, fractionSize);
      number = Math.round(number * pow) / pow;
      var fraction = ('' + number).split(DECIMAL_SEP);
      var whole = fraction[0];
      fraction = fraction[1] || '';
      var i, pos = 0, lgroup = pattern.lgSize, group = pattern.gSize;
      if (whole.length >= lgroup + group) {
        pos = whole.length - lgroup;
        for (i = 0; i < pos; i++) {
          if ((pos - i) % group === 0 && i !== 0) {
            formatedText += groupSep;
          }
          formatedText += whole.charAt(i);
        }
      }
      for (i = pos; i < whole.length; i++) {
        if ((whole.length - i) % lgroup === 0 && i !== 0) {
          formatedText += groupSep;
        }
        formatedText += whole.charAt(i);
      }
      while (fraction.length < fractionSize) {
        fraction += '0';
      }
      if (fractionSize && fractionSize !== '0')
        formatedText += decimalSep + fraction.substr(0, fractionSize);
    } else {
      if (fractionSize > 0 && number > -1 && number < 1) {
        formatedText = number.toFixed(fractionSize);
      }
    }
    parts.push(isNegative ? pattern.negPre : pattern.posPre);
    parts.push(formatedText);
    parts.push(isNegative ? pattern.negSuf : pattern.posSuf);
    return parts.join('');
  }
  function padNumber(num, digits, trim) {
    var neg = '';
    if (num < 0) {
      neg = '-';
      num = -num;
    }
    num = '' + num;
    while (num.length < digits)
      num = '0' + num;
    if (trim)
      num = num.substr(num.length - digits);
    return neg + num;
  }
  function dateGetter(name, size, offset, trim) {
    offset = offset || 0;
    return function (date) {
      var value = date['get' + name]();
      if (offset > 0 || value > -offset)
        value += offset;
      if (value === 0 && offset == -12)
        value = 12;
      return padNumber(value, size, trim);
    };
  }
  function dateStrGetter(name, shortForm) {
    return function (date, formats) {
      var value = date['get' + name]();
      var get = uppercase(shortForm ? 'SHORT' + name : name);
      return formats[get][value];
    };
  }
  function timeZoneGetter(date) {
    var zone = -1 * date.getTimezoneOffset();
    var paddedZone = zone >= 0 ? '+' : '';
    paddedZone += padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2);
    return paddedZone;
  }
  function ampmGetter(date, formats) {
    return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
  }
  var DATE_FORMATS = {
      yyyy: dateGetter('FullYear', 4),
      yy: dateGetter('FullYear', 2, 0, true),
      y: dateGetter('FullYear', 1),
      MMMM: dateStrGetter('Month'),
      MMM: dateStrGetter('Month', true),
      MM: dateGetter('Month', 2, 1),
      M: dateGetter('Month', 1, 1),
      dd: dateGetter('Date', 2),
      d: dateGetter('Date', 1),
      HH: dateGetter('Hours', 2),
      H: dateGetter('Hours', 1),
      hh: dateGetter('Hours', 2, -12),
      h: dateGetter('Hours', 1, -12),
      mm: dateGetter('Minutes', 2),
      m: dateGetter('Minutes', 1),
      ss: dateGetter('Seconds', 2),
      s: dateGetter('Seconds', 1),
      sss: dateGetter('Milliseconds', 3),
      EEEE: dateStrGetter('Day'),
      EEE: dateStrGetter('Day', true),
      a: ampmGetter,
      Z: timeZoneGetter
    };
  var DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/, NUMBER_STRING = /^\-?\d+$/;
  dateFilter.$inject = ['$locale'];
  function dateFilter($locale) {
    var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
    function jsonStringToDate(string) {
      var match;
      if (match = string.match(R_ISO8601_STR)) {
        var date = new Date(0), tzHour = 0, tzMin = 0, dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear, timeSetter = match[8] ? date.setUTCHours : date.setHours;
        if (match[9]) {
          tzHour = int(match[9] + match[10]);
          tzMin = int(match[9] + match[11]);
        }
        dateSetter.call(date, int(match[1]), int(match[2]) - 1, int(match[3]));
        var h = int(match[4] || 0) - tzHour;
        var m = int(match[5] || 0) - tzMin;
        var s = int(match[6] || 0);
        var ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
        timeSetter.call(date, h, m, s, ms);
        return date;
      }
      return string;
    }
    return function (date, format) {
      var text = '', parts = [], fn, match;
      format = format || 'mediumDate';
      format = $locale.DATETIME_FORMATS[format] || format;
      if (isString(date)) {
        if (NUMBER_STRING.test(date)) {
          date = int(date);
        } else {
          date = jsonStringToDate(date);
        }
      }
      if (isNumber(date)) {
        date = new Date(date);
      }
      if (!isDate(date)) {
        return date;
      }
      while (format) {
        match = DATE_FORMATS_SPLIT.exec(format);
        if (match) {
          parts = concat(parts, match, 1);
          format = parts.pop();
        } else {
          parts.push(format);
          format = null;
        }
      }
      forEach(parts, function (value) {
        fn = DATE_FORMATS[value];
        text += fn ? fn(date, $locale.DATETIME_FORMATS) : value.replace(/(^'|'$)/g, '').replace(/''/g, '\'');
      });
      return text;
    };
  }
  function jsonFilter() {
    return function (object) {
      return toJson(object, true);
    };
  }
  var lowercaseFilter = valueFn(lowercase);
  var uppercaseFilter = valueFn(uppercase);
  function limitToFilter() {
    return function (input, limit) {
      if (!isArray(input) && !isString(input))
        return input;
      limit = int(limit);
      if (isString(input)) {
        if (limit) {
          return limit >= 0 ? input.slice(0, limit) : input.slice(limit, input.length);
        } else {
          return '';
        }
      }
      var out = [], i, n;
      if (limit > input.length)
        limit = input.length;
      else if (limit < -input.length)
        limit = -input.length;
      if (limit > 0) {
        i = 0;
        n = limit;
      } else {
        i = input.length + limit;
        n = input.length;
      }
      for (; i < n; i++) {
        out.push(input[i]);
      }
      return out;
    };
  }
  orderByFilter.$inject = ['$parse'];
  function orderByFilter($parse) {
    return function (array, sortPredicate, reverseOrder) {
      if (!isArray(array))
        return array;
      if (!sortPredicate)
        return array;
      sortPredicate = isArray(sortPredicate) ? sortPredicate : [sortPredicate];
      sortPredicate = map(sortPredicate, function (predicate) {
        var descending = false, get = predicate || identity;
        if (isString(predicate)) {
          if (predicate.charAt(0) == '+' || predicate.charAt(0) == '-') {
            descending = predicate.charAt(0) == '-';
            predicate = predicate.substring(1);
          }
          get = $parse(predicate);
          if (get.constant) {
            var key = get();
            return reverseComparator(function (a, b) {
              return compare(a[key], b[key]);
            }, descending);
          }
        }
        return reverseComparator(function (a, b) {
          return compare(get(a), get(b));
        }, descending);
      });
      var arrayCopy = [];
      for (var i = 0; i < array.length; i++) {
        arrayCopy.push(array[i]);
      }
      return arrayCopy.sort(reverseComparator(comparator, reverseOrder));
      function comparator(o1, o2) {
        for (var i = 0; i < sortPredicate.length; i++) {
          var comp = sortPredicate[i](o1, o2);
          if (comp !== 0)
            return comp;
        }
        return 0;
      }
      function reverseComparator(comp, descending) {
        return toBoolean(descending) ? function (a, b) {
          return comp(b, a);
        } : comp;
      }
      function compare(v1, v2) {
        var t1 = typeof v1;
        var t2 = typeof v2;
        if (t1 == t2) {
          if (t1 == 'string') {
            v1 = v1.toLowerCase();
            v2 = v2.toLowerCase();
          }
          if (v1 === v2)
            return 0;
          return v1 < v2 ? -1 : 1;
        } else {
          return t1 < t2 ? -1 : 1;
        }
      }
    };
  }
  function ngDirective(directive) {
    if (isFunction(directive)) {
      directive = { link: directive };
    }
    directive.restrict = directive.restrict || 'AC';
    return valueFn(directive);
  }
  var htmlAnchorDirective = valueFn({
      restrict: 'E',
      compile: function (element, attr) {
        if (msie <= 8) {
          if (!attr.href && !attr.name) {
            attr.$set('href', '');
          }
          element.append(document.createComment('IE fix'));
        }
        if (!attr.href && !attr.xlinkHref && !attr.name) {
          return function (scope, element) {
            var href = toString.call(element.prop('href')) === '[object SVGAnimatedString]' ? 'xlink:href' : 'href';
            element.on('click', function (event) {
              if (!element.attr(href)) {
                event.preventDefault();
              }
            });
          };
        }
      }
    });
  var ngAttributeAliasDirectives = {};
  forEach(BOOLEAN_ATTR, function (propName, attrName) {
    if (propName == 'multiple')
      return;
    var normalized = directiveNormalize('ng-' + attrName);
    ngAttributeAliasDirectives[normalized] = function () {
      return {
        priority: 100,
        link: function (scope, element, attr) {
          scope.$watch(attr[normalized], function ngBooleanAttrWatchAction(value) {
            attr.$set(attrName, !!value);
          });
        }
      };
    };
  });
  forEach([
    'src',
    'srcset',
    'href'
  ], function (attrName) {
    var normalized = directiveNormalize('ng-' + attrName);
    ngAttributeAliasDirectives[normalized] = function () {
      return {
        priority: 99,
        link: function (scope, element, attr) {
          var propName = attrName, name = attrName;
          if (attrName === 'href' && toString.call(element.prop('href')) === '[object SVGAnimatedString]') {
            name = 'xlinkHref';
            attr.$attr[name] = 'xlink:href';
            propName = null;
          }
          attr.$observe(normalized, function (value) {
            if (!value)
              return;
            attr.$set(name, value);
            if (msie && propName)
              element.prop(propName, attr[name]);
          });
        }
      };
    };
  });
  var nullFormCtrl = {
      $addControl: noop,
      $removeControl: noop,
      $setValidity: noop,
      $setDirty: noop,
      $setPristine: noop
    };
  FormController.$inject = [
    '$element',
    '$attrs',
    '$scope',
    '$animate'
  ];
  function FormController(element, attrs, $scope, $animate) {
    var form = this, parentForm = element.parent().controller('form') || nullFormCtrl, invalidCount = 0, errors = form.$error = {}, controls = [];
    form.$name = attrs.name || attrs.ngForm;
    form.$dirty = false;
    form.$pristine = true;
    form.$valid = true;
    form.$invalid = false;
    parentForm.$addControl(form);
    element.addClass(PRISTINE_CLASS);
    toggleValidCss(true);
    function toggleValidCss(isValid, validationErrorKey) {
      validationErrorKey = validationErrorKey ? '-' + snake_case(validationErrorKey, '-') : '';
      $animate.removeClass(element, (isValid ? INVALID_CLASS : VALID_CLASS) + validationErrorKey);
      $animate.addClass(element, (isValid ? VALID_CLASS : INVALID_CLASS) + validationErrorKey);
    }
    form.$addControl = function (control) {
      assertNotHasOwnProperty(control.$name, 'input');
      controls.push(control);
      if (control.$name) {
        form[control.$name] = control;
      }
    };
    form.$removeControl = function (control) {
      if (control.$name && form[control.$name] === control) {
        delete form[control.$name];
      }
      forEach(errors, function (queue, validationToken) {
        form.$setValidity(validationToken, true, control);
      });
      arrayRemove(controls, control);
    };
    form.$setValidity = function (validationToken, isValid, control) {
      var queue = errors[validationToken];
      if (isValid) {
        if (queue) {
          arrayRemove(queue, control);
          if (!queue.length) {
            invalidCount--;
            if (!invalidCount) {
              toggleValidCss(isValid);
              form.$valid = true;
              form.$invalid = false;
            }
            errors[validationToken] = false;
            toggleValidCss(true, validationToken);
            parentForm.$setValidity(validationToken, true, form);
          }
        }
      } else {
        if (!invalidCount) {
          toggleValidCss(isValid);
        }
        if (queue) {
          if (includes(queue, control))
            return;
        } else {
          errors[validationToken] = queue = [];
          invalidCount++;
          toggleValidCss(false, validationToken);
          parentForm.$setValidity(validationToken, false, form);
        }
        queue.push(control);
        form.$valid = false;
        form.$invalid = true;
      }
    };
    form.$setDirty = function () {
      $animate.removeClass(element, PRISTINE_CLASS);
      $animate.addClass(element, DIRTY_CLASS);
      form.$dirty = true;
      form.$pristine = false;
      parentForm.$setDirty();
    };
    form.$setPristine = function () {
      $animate.removeClass(element, DIRTY_CLASS);
      $animate.addClass(element, PRISTINE_CLASS);
      form.$dirty = false;
      form.$pristine = true;
      forEach(controls, function (control) {
        control.$setPristine();
      });
    };
  }
  var formDirectiveFactory = function (isNgForm) {
    return [
      '$timeout',
      function ($timeout) {
        var formDirective = {
            name: 'form',
            restrict: isNgForm ? 'EAC' : 'E',
            controller: FormController,
            compile: function () {
              return {
                pre: function (scope, formElement, attr, controller) {
                  if (!attr.action) {
                    var preventDefaultListener = function (event) {
                      event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    };
                    addEventListenerFn(formElement[0], 'submit', preventDefaultListener);
                    formElement.on('$destroy', function () {
                      $timeout(function () {
                        removeEventListenerFn(formElement[0], 'submit', preventDefaultListener);
                      }, 0, false);
                    });
                  }
                  var parentFormCtrl = formElement.parent().controller('form'), alias = attr.name || attr.ngForm;
                  if (alias) {
                    setter(scope, alias, controller, alias);
                  }
                  if (parentFormCtrl) {
                    formElement.on('$destroy', function () {
                      parentFormCtrl.$removeControl(controller);
                      if (alias) {
                        setter(scope, alias, undefined, alias);
                      }
                      extend(controller, nullFormCtrl);
                    });
                  }
                }
              };
            }
          };
        return formDirective;
      }
    ];
  };
  var formDirective = formDirectiveFactory();
  var ngFormDirective = formDirectiveFactory(true);
  var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
  var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;
  var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;
  var inputType = {
      'text': textInputType,
      'number': numberInputType,
      'url': urlInputType,
      'email': emailInputType,
      'radio': radioInputType,
      'checkbox': checkboxInputType,
      'hidden': noop,
      'button': noop,
      'submit': noop,
      'reset': noop,
      'file': noop
    };
  function validate(ctrl, validatorName, validity, value) {
    ctrl.$setValidity(validatorName, validity);
    return validity ? value : undefined;
  }
  function addNativeHtml5Validators(ctrl, validatorName, element) {
    var validity = element.prop('validity');
    if (isObject(validity)) {
      var validator = function (value) {
        if (!ctrl.$error[validatorName] && (validity.badInput || validity.customError || validity.typeMismatch) && !validity.valueMissing) {
          ctrl.$setValidity(validatorName, false);
          return;
        }
        return value;
      };
      ctrl.$parsers.push(validator);
      ctrl.$formatters.push(validator);
    }
  }
  function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {
    var validity = element.prop('validity');
    if (!$sniffer.android) {
      var composing = false;
      element.on('compositionstart', function (data) {
        composing = true;
      });
      element.on('compositionend', function () {
        composing = false;
        listener();
      });
    }
    var listener = function () {
      if (composing)
        return;
      var value = element.val();
      if (toBoolean(attr.ngTrim || 'T')) {
        value = trim(value);
      }
      if (ctrl.$viewValue !== value || validity && value === '' && !validity.valueMissing) {
        if (scope.$$phase) {
          ctrl.$setViewValue(value);
        } else {
          scope.$apply(function () {
            ctrl.$setViewValue(value);
          });
        }
      }
    };
    if ($sniffer.hasEvent('input')) {
      element.on('input', listener);
    } else {
      var timeout;
      var deferListener = function () {
        if (!timeout) {
          timeout = $browser.defer(function () {
            listener();
            timeout = null;
          });
        }
      };
      element.on('keydown', function (event) {
        var key = event.keyCode;
        if (key === 91 || 15 < key && key < 19 || 37 <= key && key <= 40)
          return;
        deferListener();
      });
      if ($sniffer.hasEvent('paste')) {
        element.on('paste cut', deferListener);
      }
    }
    element.on('change', listener);
    ctrl.$render = function () {
      element.val(ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue);
    };
    var pattern = attr.ngPattern, patternValidator, match;
    if (pattern) {
      var validateRegex = function (regexp, value) {
        return validate(ctrl, 'pattern', ctrl.$isEmpty(value) || regexp.test(value), value);
      };
      match = pattern.match(/^\/(.*)\/([gim]*)$/);
      if (match) {
        pattern = new RegExp(match[1], match[2]);
        patternValidator = function (value) {
          return validateRegex(pattern, value);
        };
      } else {
        patternValidator = function (value) {
          var patternObj = scope.$eval(pattern);
          if (!patternObj || !patternObj.test) {
            throw minErr('ngPattern')('noregexp', 'Expected {0} to be a RegExp but was {1}. Element: {2}', pattern, patternObj, startingTag(element));
          }
          return validateRegex(patternObj, value);
        };
      }
      ctrl.$formatters.push(patternValidator);
      ctrl.$parsers.push(patternValidator);
    }
    if (attr.ngMinlength) {
      var minlength = int(attr.ngMinlength);
      var minLengthValidator = function (value) {
        return validate(ctrl, 'minlength', ctrl.$isEmpty(value) || value.length >= minlength, value);
      };
      ctrl.$parsers.push(minLengthValidator);
      ctrl.$formatters.push(minLengthValidator);
    }
    if (attr.ngMaxlength) {
      var maxlength = int(attr.ngMaxlength);
      var maxLengthValidator = function (value) {
        return validate(ctrl, 'maxlength', ctrl.$isEmpty(value) || value.length <= maxlength, value);
      };
      ctrl.$parsers.push(maxLengthValidator);
      ctrl.$formatters.push(maxLengthValidator);
    }
  }
  function numberInputType(scope, element, attr, ctrl, $sniffer, $browser) {
    textInputType(scope, element, attr, ctrl, $sniffer, $browser);
    ctrl.$parsers.push(function (value) {
      var empty = ctrl.$isEmpty(value);
      if (empty || NUMBER_REGEXP.test(value)) {
        ctrl.$setValidity('number', true);
        return value === '' ? null : empty ? value : parseFloat(value);
      } else {
        ctrl.$setValidity('number', false);
        return undefined;
      }
    });
    addNativeHtml5Validators(ctrl, 'number', element);
    ctrl.$formatters.push(function (value) {
      return ctrl.$isEmpty(value) ? '' : '' + value;
    });
    if (attr.min) {
      var minValidator = function (value) {
        var min = parseFloat(attr.min);
        return validate(ctrl, 'min', ctrl.$isEmpty(value) || value >= min, value);
      };
      ctrl.$parsers.push(minValidator);
      ctrl.$formatters.push(minValidator);
    }
    if (attr.max) {
      var maxValidator = function (value) {
        var max = parseFloat(attr.max);
        return validate(ctrl, 'max', ctrl.$isEmpty(value) || value <= max, value);
      };
      ctrl.$parsers.push(maxValidator);
      ctrl.$formatters.push(maxValidator);
    }
    ctrl.$formatters.push(function (value) {
      return validate(ctrl, 'number', ctrl.$isEmpty(value) || isNumber(value), value);
    });
  }
  function urlInputType(scope, element, attr, ctrl, $sniffer, $browser) {
    textInputType(scope, element, attr, ctrl, $sniffer, $browser);
    var urlValidator = function (value) {
      return validate(ctrl, 'url', ctrl.$isEmpty(value) || URL_REGEXP.test(value), value);
    };
    ctrl.$formatters.push(urlValidator);
    ctrl.$parsers.push(urlValidator);
  }
  function emailInputType(scope, element, attr, ctrl, $sniffer, $browser) {
    textInputType(scope, element, attr, ctrl, $sniffer, $browser);
    var emailValidator = function (value) {
      return validate(ctrl, 'email', ctrl.$isEmpty(value) || EMAIL_REGEXP.test(value), value);
    };
    ctrl.$formatters.push(emailValidator);
    ctrl.$parsers.push(emailValidator);
  }
  function radioInputType(scope, element, attr, ctrl) {
    if (isUndefined(attr.name)) {
      element.attr('name', nextUid());
    }
    element.on('click', function () {
      if (element[0].checked) {
        scope.$apply(function () {
          ctrl.$setViewValue(attr.value);
        });
      }
    });
    ctrl.$render = function () {
      var value = attr.value;
      element[0].checked = value == ctrl.$viewValue;
    };
    attr.$observe('value', ctrl.$render);
  }
  function checkboxInputType(scope, element, attr, ctrl) {
    var trueValue = attr.ngTrueValue, falseValue = attr.ngFalseValue;
    if (!isString(trueValue))
      trueValue = true;
    if (!isString(falseValue))
      falseValue = false;
    element.on('click', function () {
      scope.$apply(function () {
        ctrl.$setViewValue(element[0].checked);
      });
    });
    ctrl.$render = function () {
      element[0].checked = ctrl.$viewValue;
    };
    ctrl.$isEmpty = function (value) {
      return value !== trueValue;
    };
    ctrl.$formatters.push(function (value) {
      return value === trueValue;
    });
    ctrl.$parsers.push(function (value) {
      return value ? trueValue : falseValue;
    });
  }
  var inputDirective = [
      '$browser',
      '$sniffer',
      function ($browser, $sniffer) {
        return {
          restrict: 'E',
          require: '?ngModel',
          link: function (scope, element, attr, ctrl) {
            if (ctrl) {
              (inputType[lowercase(attr.type)] || inputType.text)(scope, element, attr, ctrl, $sniffer, $browser);
            }
          }
        };
      }
    ];
  var VALID_CLASS = 'ng-valid', INVALID_CLASS = 'ng-invalid', PRISTINE_CLASS = 'ng-pristine', DIRTY_CLASS = 'ng-dirty';
  var NgModelController = [
      '$scope',
      '$exceptionHandler',
      '$attrs',
      '$element',
      '$parse',
      '$animate',
      function ($scope, $exceptionHandler, $attr, $element, $parse, $animate) {
        this.$viewValue = Number.NaN;
        this.$modelValue = Number.NaN;
        this.$parsers = [];
        this.$formatters = [];
        this.$viewChangeListeners = [];
        this.$pristine = true;
        this.$dirty = false;
        this.$valid = true;
        this.$invalid = false;
        this.$name = $attr.name;
        var ngModelGet = $parse($attr.ngModel), ngModelSet = ngModelGet.assign;
        if (!ngModelSet) {
          throw minErr('ngModel')('nonassign', 'Expression \'{0}\' is non-assignable. Element: {1}', $attr.ngModel, startingTag($element));
        }
        this.$render = noop;
        this.$isEmpty = function (value) {
          return isUndefined(value) || value === '' || value === null || value !== value;
        };
        var parentForm = $element.inheritedData('$formController') || nullFormCtrl, invalidCount = 0, $error = this.$error = {};
        $element.addClass(PRISTINE_CLASS);
        toggleValidCss(true);
        function toggleValidCss(isValid, validationErrorKey) {
          validationErrorKey = validationErrorKey ? '-' + snake_case(validationErrorKey, '-') : '';
          $animate.removeClass($element, (isValid ? INVALID_CLASS : VALID_CLASS) + validationErrorKey);
          $animate.addClass($element, (isValid ? VALID_CLASS : INVALID_CLASS) + validationErrorKey);
        }
        this.$setValidity = function (validationErrorKey, isValid) {
          if ($error[validationErrorKey] === !isValid)
            return;
          if (isValid) {
            if ($error[validationErrorKey])
              invalidCount--;
            if (!invalidCount) {
              toggleValidCss(true);
              this.$valid = true;
              this.$invalid = false;
            }
          } else {
            toggleValidCss(false);
            this.$invalid = true;
            this.$valid = false;
            invalidCount++;
          }
          $error[validationErrorKey] = !isValid;
          toggleValidCss(isValid, validationErrorKey);
          parentForm.$setValidity(validationErrorKey, isValid, this);
        };
        this.$setPristine = function () {
          this.$dirty = false;
          this.$pristine = true;
          $animate.removeClass($element, DIRTY_CLASS);
          $animate.addClass($element, PRISTINE_CLASS);
        };
        this.$setViewValue = function (value) {
          this.$viewValue = value;
          if (this.$pristine) {
            this.$dirty = true;
            this.$pristine = false;
            $animate.removeClass($element, PRISTINE_CLASS);
            $animate.addClass($element, DIRTY_CLASS);
            parentForm.$setDirty();
          }
          forEach(this.$parsers, function (fn) {
            value = fn(value);
          });
          if (this.$modelValue !== value) {
            this.$modelValue = value;
            ngModelSet($scope, value);
            forEach(this.$viewChangeListeners, function (listener) {
              try {
                listener();
              } catch (e) {
                $exceptionHandler(e);
              }
            });
          }
        };
        var ctrl = this;
        $scope.$watch(function ngModelWatch() {
          var value = ngModelGet($scope);
          if (ctrl.$modelValue !== value) {
            var formatters = ctrl.$formatters, idx = formatters.length;
            ctrl.$modelValue = value;
            while (idx--) {
              value = formatters[idx](value);
            }
            if (ctrl.$viewValue !== value) {
              ctrl.$viewValue = value;
              ctrl.$render();
            }
          }
          return value;
        });
      }
    ];
  var ngModelDirective = function () {
    return {
      require: [
        'ngModel',
        '^?form'
      ],
      controller: NgModelController,
      link: function (scope, element, attr, ctrls) {
        var modelCtrl = ctrls[0], formCtrl = ctrls[1] || nullFormCtrl;
        formCtrl.$addControl(modelCtrl);
        scope.$on('$destroy', function () {
          formCtrl.$removeControl(modelCtrl);
        });
      }
    };
  };
  var ngChangeDirective = valueFn({
      require: 'ngModel',
      link: function (scope, element, attr, ctrl) {
        ctrl.$viewChangeListeners.push(function () {
          scope.$eval(attr.ngChange);
        });
      }
    });
  var requiredDirective = function () {
    return {
      require: '?ngModel',
      link: function (scope, elm, attr, ctrl) {
        if (!ctrl)
          return;
        attr.required = true;
        var validator = function (value) {
          if (attr.required && ctrl.$isEmpty(value)) {
            ctrl.$setValidity('required', false);
            return;
          } else {
            ctrl.$setValidity('required', true);
            return value;
          }
        };
        ctrl.$formatters.push(validator);
        ctrl.$parsers.unshift(validator);
        attr.$observe('required', function () {
          validator(ctrl.$viewValue);
        });
      }
    };
  };
  var ngListDirective = function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attr, ctrl) {
        var match = /\/(.*)\//.exec(attr.ngList), separator = match && new RegExp(match[1]) || attr.ngList || ',';
        var parse = function (viewValue) {
          if (isUndefined(viewValue))
            return;
          var list = [];
          if (viewValue) {
            forEach(viewValue.split(separator), function (value) {
              if (value)
                list.push(trim(value));
            });
          }
          return list;
        };
        ctrl.$parsers.push(parse);
        ctrl.$formatters.push(function (value) {
          if (isArray(value)) {
            return value.join(', ');
          }
          return undefined;
        });
        ctrl.$isEmpty = function (value) {
          return !value || !value.length;
        };
      }
    };
  };
  var CONSTANT_VALUE_REGEXP = /^(true|false|\d+)$/;
  var ngValueDirective = function () {
    return {
      priority: 100,
      compile: function (tpl, tplAttr) {
        if (CONSTANT_VALUE_REGEXP.test(tplAttr.ngValue)) {
          return function ngValueConstantLink(scope, elm, attr) {
            attr.$set('value', scope.$eval(attr.ngValue));
          };
        } else {
          return function ngValueLink(scope, elm, attr) {
            scope.$watch(attr.ngValue, function valueWatchAction(value) {
              attr.$set('value', value);
            });
          };
        }
      }
    };
  };
  var ngBindDirective = ngDirective(function (scope, element, attr) {
      element.addClass('ng-binding').data('$binding', attr.ngBind);
      scope.$watch(attr.ngBind, function ngBindWatchAction(value) {
        element.text(value == undefined ? '' : value);
      });
    });
  var ngBindTemplateDirective = [
      '$interpolate',
      function ($interpolate) {
        return function (scope, element, attr) {
          var interpolateFn = $interpolate(element.attr(attr.$attr.ngBindTemplate));
          element.addClass('ng-binding').data('$binding', interpolateFn);
          attr.$observe('ngBindTemplate', function (value) {
            element.text(value);
          });
        };
      }
    ];
  var ngBindHtmlDirective = [
      '$sce',
      '$parse',
      function ($sce, $parse) {
        return function (scope, element, attr) {
          element.addClass('ng-binding').data('$binding', attr.ngBindHtml);
          var parsed = $parse(attr.ngBindHtml);
          function getStringValue() {
            return (parsed(scope) || '').toString();
          }
          scope.$watch(getStringValue, function ngBindHtmlWatchAction(value) {
            element.html($sce.getTrustedHtml(parsed(scope)) || '');
          });
        };
      }
    ];
  function classDirective(name, selector) {
    name = 'ngClass' + name;
    return function () {
      return {
        restrict: 'AC',
        link: function (scope, element, attr) {
          var oldVal;
          scope.$watch(attr[name], ngClassWatchAction, true);
          attr.$observe('class', function (value) {
            ngClassWatchAction(scope.$eval(attr[name]));
          });
          if (name !== 'ngClass') {
            scope.$watch('$index', function ($index, old$index) {
              var mod = $index & 1;
              if (mod !== old$index & 1) {
                var classes = flattenClasses(scope.$eval(attr[name]));
                mod === selector ? attr.$addClass(classes) : attr.$removeClass(classes);
              }
            });
          }
          function ngClassWatchAction(newVal) {
            if (selector === true || scope.$index % 2 === selector) {
              var newClasses = flattenClasses(newVal || '');
              if (!oldVal) {
                attr.$addClass(newClasses);
              } else if (!equals(newVal, oldVal)) {
                attr.$updateClass(newClasses, flattenClasses(oldVal));
              }
            }
            oldVal = copy(newVal);
          }
          function flattenClasses(classVal) {
            if (isArray(classVal)) {
              return classVal.join(' ');
            } else if (isObject(classVal)) {
              var classes = [], i = 0;
              forEach(classVal, function (v, k) {
                if (v) {
                  classes.push(k);
                }
              });
              return classes.join(' ');
            }
            return classVal;
          }
        }
      };
    };
  }
  var ngClassDirective = classDirective('', true);
  var ngClassOddDirective = classDirective('Odd', 0);
  var ngClassEvenDirective = classDirective('Even', 1);
  var ngCloakDirective = ngDirective({
      compile: function (element, attr) {
        attr.$set('ngCloak', undefined);
        element.removeClass('ng-cloak');
      }
    });
  var ngControllerDirective = [function () {
        return {
          scope: true,
          controller: '@',
          priority: 500
        };
      }];
  var ngEventDirectives = {};
  forEach('click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' '), function (name) {
    var directiveName = directiveNormalize('ng-' + name);
    ngEventDirectives[directiveName] = [
      '$parse',
      function ($parse) {
        return {
          compile: function ($element, attr) {
            var fn = $parse(attr[directiveName]);
            return function (scope, element, attr) {
              element.on(lowercase(name), function (event) {
                scope.$apply(function () {
                  fn(scope, { $event: event });
                });
              });
            };
          }
        };
      }
    ];
  });
  var ngIfDirective = [
      '$animate',
      function ($animate) {
        return {
          transclude: 'element',
          priority: 600,
          terminal: true,
          restrict: 'A',
          $$tlb: true,
          link: function ($scope, $element, $attr, ctrl, $transclude) {
            var block, childScope, previousElements;
            $scope.$watch($attr.ngIf, function ngIfWatchAction(value) {
              if (toBoolean(value)) {
                if (!childScope) {
                  childScope = $scope.$new();
                  $transclude(childScope, function (clone) {
                    clone[clone.length++] = document.createComment(' end ngIf: ' + $attr.ngIf + ' ');
                    block = { clone: clone };
                    $animate.enter(clone, $element.parent(), $element);
                  });
                }
              } else {
                if (previousElements) {
                  previousElements.remove();
                  previousElements = null;
                }
                if (childScope) {
                  childScope.$destroy();
                  childScope = null;
                }
                if (block) {
                  previousElements = getBlockElements(block.clone);
                  $animate.leave(previousElements, function () {
                    previousElements = null;
                  });
                  block = null;
                }
              }
            });
          }
        };
      }
    ];
  var ngIncludeDirective = [
      '$http',
      '$templateCache',
      '$anchorScroll',
      '$animate',
      '$sce',
      function ($http, $templateCache, $anchorScroll, $animate, $sce) {
        return {
          restrict: 'ECA',
          priority: 400,
          terminal: true,
          transclude: 'element',
          controller: angular.noop,
          compile: function (element, attr) {
            var srcExp = attr.ngInclude || attr.src, onloadExp = attr.onload || '', autoScrollExp = attr.autoscroll;
            return function (scope, $element, $attr, ctrl, $transclude) {
              var changeCounter = 0, currentScope, previousElement, currentElement;
              var cleanupLastIncludeContent = function () {
                if (previousElement) {
                  previousElement.remove();
                  previousElement = null;
                }
                if (currentScope) {
                  currentScope.$destroy();
                  currentScope = null;
                }
                if (currentElement) {
                  $animate.leave(currentElement, function () {
                    previousElement = null;
                  });
                  previousElement = currentElement;
                  currentElement = null;
                }
              };
              scope.$watch($sce.parseAsResourceUrl(srcExp), function ngIncludeWatchAction(src) {
                var afterAnimation = function () {
                  if (isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                    $anchorScroll();
                  }
                };
                var thisChangeId = ++changeCounter;
                if (src) {
                  $http.get(src, { cache: $templateCache }).success(function (response) {
                    if (thisChangeId !== changeCounter)
                      return;
                    var newScope = scope.$new();
                    ctrl.template = response;
                    var clone = $transclude(newScope, function (clone) {
                        cleanupLastIncludeContent();
                        $animate.enter(clone, null, $element, afterAnimation);
                      });
                    currentScope = newScope;
                    currentElement = clone;
                    currentScope.$emit('$includeContentLoaded');
                    scope.$eval(onloadExp);
                  }).error(function () {
                    if (thisChangeId === changeCounter)
                      cleanupLastIncludeContent();
                  });
                  scope.$emit('$includeContentRequested');
                } else {
                  cleanupLastIncludeContent();
                  ctrl.template = null;
                }
              });
            };
          }
        };
      }
    ];
  var ngIncludeFillContentDirective = [
      '$compile',
      function ($compile) {
        return {
          restrict: 'ECA',
          priority: -400,
          require: 'ngInclude',
          link: function (scope, $element, $attr, ctrl) {
            $element.html(ctrl.template);
            $compile($element.contents())(scope);
          }
        };
      }
    ];
  var ngInitDirective = ngDirective({
      priority: 450,
      compile: function () {
        return {
          pre: function (scope, element, attrs) {
            scope.$eval(attrs.ngInit);
          }
        };
      }
    });
  var ngNonBindableDirective = ngDirective({
      terminal: true,
      priority: 1000
    });
  var ngPluralizeDirective = [
      '$locale',
      '$interpolate',
      function ($locale, $interpolate) {
        var BRACE = /{}/g;
        return {
          restrict: 'EA',
          link: function (scope, element, attr) {
            var numberExp = attr.count, whenExp = attr.$attr.when && element.attr(attr.$attr.when), offset = attr.offset || 0, whens = scope.$eval(whenExp) || {}, whensExpFns = {}, startSymbol = $interpolate.startSymbol(), endSymbol = $interpolate.endSymbol(), isWhen = /^when(Minus)?(.+)$/;
            forEach(attr, function (expression, attributeName) {
              if (isWhen.test(attributeName)) {
                whens[lowercase(attributeName.replace('when', '').replace('Minus', '-'))] = element.attr(attr.$attr[attributeName]);
              }
            });
            forEach(whens, function (expression, key) {
              whensExpFns[key] = $interpolate(expression.replace(BRACE, startSymbol + numberExp + '-' + offset + endSymbol));
            });
            scope.$watch(function ngPluralizeWatch() {
              var value = parseFloat(scope.$eval(numberExp));
              if (!isNaN(value)) {
                if (!(value in whens))
                  value = $locale.pluralCat(value - offset);
                return whensExpFns[value](scope, element, true);
              } else {
                return '';
              }
            }, function ngPluralizeWatchAction(newVal) {
              element.text(newVal);
            });
          }
        };
      }
    ];
  var ngRepeatDirective = [
      '$parse',
      '$animate',
      function ($parse, $animate) {
        var NG_REMOVED = '$$NG_REMOVED';
        var ngRepeatMinErr = minErr('ngRepeat');
        return {
          transclude: 'element',
          priority: 1000,
          terminal: true,
          $$tlb: true,
          link: function ($scope, $element, $attr, ctrl, $transclude) {
            var expression = $attr.ngRepeat;
            var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/), trackByExp, trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn, lhs, rhs, valueIdentifier, keyIdentifier, hashFnLocals = { $id: hashKey };
            if (!match) {
              throw ngRepeatMinErr('iexp', 'Expected expression in form of \'_item_ in _collection_[ track by _id_]\' but got \'{0}\'.', expression);
            }
            lhs = match[1];
            rhs = match[2];
            trackByExp = match[3];
            if (trackByExp) {
              trackByExpGetter = $parse(trackByExp);
              trackByIdExpFn = function (key, value, index) {
                if (keyIdentifier)
                  hashFnLocals[keyIdentifier] = key;
                hashFnLocals[valueIdentifier] = value;
                hashFnLocals.$index = index;
                return trackByExpGetter($scope, hashFnLocals);
              };
            } else {
              trackByIdArrayFn = function (key, value) {
                return hashKey(value);
              };
              trackByIdObjFn = function (key) {
                return key;
              };
            }
            match = lhs.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);
            if (!match) {
              throw ngRepeatMinErr('iidexp', '\'_item_\' in \'_item_ in _collection_\' should be an identifier or \'(_key_, _value_)\' expression, but got \'{0}\'.', lhs);
            }
            valueIdentifier = match[3] || match[1];
            keyIdentifier = match[2];
            var lastBlockMap = {};
            $scope.$watchCollection(rhs, function ngRepeatAction(collection) {
              var index, length, previousNode = $element[0], nextNode, nextBlockMap = {}, arrayLength, childScope, key, value, trackById, trackByIdFn, collectionKeys, block, nextBlockOrder = [], elementsToRemove;
              if (isArrayLike(collection)) {
                collectionKeys = collection;
                trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
              } else {
                trackByIdFn = trackByIdExpFn || trackByIdObjFn;
                collectionKeys = [];
                for (key in collection) {
                  if (collection.hasOwnProperty(key) && key.charAt(0) != '$') {
                    collectionKeys.push(key);
                  }
                }
                collectionKeys.sort();
              }
              arrayLength = collectionKeys.length;
              length = nextBlockOrder.length = collectionKeys.length;
              for (index = 0; index < length; index++) {
                key = collection === collectionKeys ? index : collectionKeys[index];
                value = collection[key];
                trackById = trackByIdFn(key, value, index);
                assertNotHasOwnProperty(trackById, '`track by` id');
                if (lastBlockMap.hasOwnProperty(trackById)) {
                  block = lastBlockMap[trackById];
                  delete lastBlockMap[trackById];
                  nextBlockMap[trackById] = block;
                  nextBlockOrder[index] = block;
                } else if (nextBlockMap.hasOwnProperty(trackById)) {
                  forEach(nextBlockOrder, function (block) {
                    if (block && block.scope)
                      lastBlockMap[block.id] = block;
                  });
                  throw ngRepeatMinErr('dupes', 'Duplicates in a repeater are not allowed. Use \'track by\' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}', expression, trackById);
                } else {
                  nextBlockOrder[index] = { id: trackById };
                  nextBlockMap[trackById] = false;
                }
              }
              for (key in lastBlockMap) {
                if (lastBlockMap.hasOwnProperty(key)) {
                  block = lastBlockMap[key];
                  elementsToRemove = getBlockElements(block.clone);
                  $animate.leave(elementsToRemove);
                  forEach(elementsToRemove, function (element) {
                    element[NG_REMOVED] = true;
                  });
                  block.scope.$destroy();
                }
              }
              for (index = 0, length = collectionKeys.length; index < length; index++) {
                key = collection === collectionKeys ? index : collectionKeys[index];
                value = collection[key];
                block = nextBlockOrder[index];
                if (nextBlockOrder[index - 1])
                  previousNode = getBlockEnd(nextBlockOrder[index - 1]);
                if (block.scope) {
                  childScope = block.scope;
                  nextNode = previousNode;
                  do {
                    nextNode = nextNode.nextSibling;
                  } while (nextNode && nextNode[NG_REMOVED]);
                  if (getBlockStart(block) != nextNode) {
                    $animate.move(getBlockElements(block.clone), null, jqLite(previousNode));
                  }
                  previousNode = getBlockEnd(block);
                } else {
                  childScope = $scope.$new();
                }
                childScope[valueIdentifier] = value;
                if (keyIdentifier)
                  childScope[keyIdentifier] = key;
                childScope.$index = index;
                childScope.$first = index === 0;
                childScope.$last = index === arrayLength - 1;
                childScope.$middle = !(childScope.$first || childScope.$last);
                childScope.$odd = !(childScope.$even = (index & 1) === 0);
                if (!block.scope) {
                  $transclude(childScope, function (clone) {
                    clone[clone.length++] = document.createComment(' end ngRepeat: ' + expression + ' ');
                    $animate.enter(clone, null, jqLite(previousNode));
                    previousNode = clone;
                    block.scope = childScope;
                    block.clone = clone;
                    nextBlockMap[block.id] = block;
                  });
                }
              }
              lastBlockMap = nextBlockMap;
            });
          }
        };
        function getBlockStart(block) {
          return block.clone[0];
        }
        function getBlockEnd(block) {
          return block.clone[block.clone.length - 1];
        }
      }
    ];
  var ngShowDirective = [
      '$animate',
      function ($animate) {
        return function (scope, element, attr) {
          scope.$watch(attr.ngShow, function ngShowWatchAction(value) {
            $animate[toBoolean(value) ? 'removeClass' : 'addClass'](element, 'ng-hide');
          });
        };
      }
    ];
  var ngHideDirective = [
      '$animate',
      function ($animate) {
        return function (scope, element, attr) {
          scope.$watch(attr.ngHide, function ngHideWatchAction(value) {
            $animate[toBoolean(value) ? 'addClass' : 'removeClass'](element, 'ng-hide');
          });
        };
      }
    ];
  var ngStyleDirective = ngDirective(function (scope, element, attr) {
      scope.$watch(attr.ngStyle, function ngStyleWatchAction(newStyles, oldStyles) {
        if (oldStyles && newStyles !== oldStyles) {
          forEach(oldStyles, function (val, style) {
            element.css(style, '');
          });
        }
        if (newStyles)
          element.css(newStyles);
      }, true);
    });
  var ngSwitchDirective = [
      '$animate',
      function ($animate) {
        return {
          restrict: 'EA',
          require: 'ngSwitch',
          controller: [
            '$scope',
            function ngSwitchController() {
              this.cases = {};
            }
          ],
          link: function (scope, element, attr, ngSwitchController) {
            var watchExpr = attr.ngSwitch || attr.on, selectedTranscludes, selectedElements, previousElements, selectedScopes = [];
            scope.$watch(watchExpr, function ngSwitchWatchAction(value) {
              var i, ii = selectedScopes.length;
              if (ii > 0) {
                if (previousElements) {
                  for (i = 0; i < ii; i++) {
                    previousElements[i].remove();
                  }
                  previousElements = null;
                }
                previousElements = [];
                for (i = 0; i < ii; i++) {
                  var selected = selectedElements[i];
                  selectedScopes[i].$destroy();
                  previousElements[i] = selected;
                  $animate.leave(selected, function () {
                    previousElements.splice(i, 1);
                    if (previousElements.length === 0) {
                      previousElements = null;
                    }
                  });
                }
              }
              selectedElements = [];
              selectedScopes = [];
              if (selectedTranscludes = ngSwitchController.cases['!' + value] || ngSwitchController.cases['?']) {
                scope.$eval(attr.change);
                forEach(selectedTranscludes, function (selectedTransclude) {
                  var selectedScope = scope.$new();
                  selectedScopes.push(selectedScope);
                  selectedTransclude.transclude(selectedScope, function (caseElement) {
                    var anchor = selectedTransclude.element;
                    selectedElements.push(caseElement);
                    $animate.enter(caseElement, anchor.parent(), anchor);
                  });
                });
              }
            });
          }
        };
      }
    ];
  var ngSwitchWhenDirective = ngDirective({
      transclude: 'element',
      priority: 800,
      require: '^ngSwitch',
      link: function (scope, element, attrs, ctrl, $transclude) {
        ctrl.cases['!' + attrs.ngSwitchWhen] = ctrl.cases['!' + attrs.ngSwitchWhen] || [];
        ctrl.cases['!' + attrs.ngSwitchWhen].push({
          transclude: $transclude,
          element: element
        });
      }
    });
  var ngSwitchDefaultDirective = ngDirective({
      transclude: 'element',
      priority: 800,
      require: '^ngSwitch',
      link: function (scope, element, attr, ctrl, $transclude) {
        ctrl.cases['?'] = ctrl.cases['?'] || [];
        ctrl.cases['?'].push({
          transclude: $transclude,
          element: element
        });
      }
    });
  var ngTranscludeDirective = ngDirective({
      link: function ($scope, $element, $attrs, controller, $transclude) {
        if (!$transclude) {
          throw minErr('ngTransclude')('orphan', 'Illegal use of ngTransclude directive in the template! ' + 'No parent directive that requires a transclusion found. ' + 'Element: {0}', startingTag($element));
        }
        $transclude(function (clone) {
          $element.empty();
          $element.append(clone);
        });
      }
    });
  var scriptDirective = [
      '$templateCache',
      function ($templateCache) {
        return {
          restrict: 'E',
          terminal: true,
          compile: function (element, attr) {
            if (attr.type == 'text/ng-template') {
              var templateUrl = attr.id, text = element[0].text;
              $templateCache.put(templateUrl, text);
            }
          }
        };
      }
    ];
  var ngOptionsMinErr = minErr('ngOptions');
  var ngOptionsDirective = valueFn({ terminal: true });
  var selectDirective = [
      '$compile',
      '$parse',
      function ($compile, $parse) {
        var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/, nullModelCtrl = { $setViewValue: noop };
        return {
          restrict: 'E',
          require: [
            'select',
            '?ngModel'
          ],
          controller: [
            '$element',
            '$scope',
            '$attrs',
            function ($element, $scope, $attrs) {
              var self = this, optionsMap = {}, ngModelCtrl = nullModelCtrl, nullOption, unknownOption;
              self.databound = $attrs.ngModel;
              self.init = function (ngModelCtrl_, nullOption_, unknownOption_) {
                ngModelCtrl = ngModelCtrl_;
                nullOption = nullOption_;
                unknownOption = unknownOption_;
              };
              self.addOption = function (value) {
                assertNotHasOwnProperty(value, '"option value"');
                optionsMap[value] = true;
                if (ngModelCtrl.$viewValue == value) {
                  $element.val(value);
                  if (unknownOption.parent())
                    unknownOption.remove();
                }
              };
              self.removeOption = function (value) {
                if (this.hasOption(value)) {
                  delete optionsMap[value];
                  if (ngModelCtrl.$viewValue == value) {
                    this.renderUnknownOption(value);
                  }
                }
              };
              self.renderUnknownOption = function (val) {
                var unknownVal = '? ' + hashKey(val) + ' ?';
                unknownOption.val(unknownVal);
                $element.prepend(unknownOption);
                $element.val(unknownVal);
                unknownOption.prop('selected', true);
              };
              self.hasOption = function (value) {
                return optionsMap.hasOwnProperty(value);
              };
              $scope.$on('$destroy', function () {
                self.renderUnknownOption = noop;
              });
            }
          ],
          link: function (scope, element, attr, ctrls) {
            if (!ctrls[1])
              return;
            var selectCtrl = ctrls[0], ngModelCtrl = ctrls[1], multiple = attr.multiple, optionsExp = attr.ngOptions, nullOption = false, emptyOption, optionTemplate = jqLite(document.createElement('option')), optGroupTemplate = jqLite(document.createElement('optgroup')), unknownOption = optionTemplate.clone();
            for (var i = 0, children = element.children(), ii = children.length; i < ii; i++) {
              if (children[i].value === '') {
                emptyOption = nullOption = children.eq(i);
                break;
              }
            }
            selectCtrl.init(ngModelCtrl, nullOption, unknownOption);
            if (multiple) {
              ngModelCtrl.$isEmpty = function (value) {
                return !value || value.length === 0;
              };
            }
            if (optionsExp)
              setupAsOptions(scope, element, ngModelCtrl);
            else if (multiple)
              setupAsMultiple(scope, element, ngModelCtrl);
            else
              setupAsSingle(scope, element, ngModelCtrl, selectCtrl);
            function setupAsSingle(scope, selectElement, ngModelCtrl, selectCtrl) {
              ngModelCtrl.$render = function () {
                var viewValue = ngModelCtrl.$viewValue;
                if (selectCtrl.hasOption(viewValue)) {
                  if (unknownOption.parent())
                    unknownOption.remove();
                  selectElement.val(viewValue);
                  if (viewValue === '')
                    emptyOption.prop('selected', true);
                } else {
                  if (isUndefined(viewValue) && emptyOption) {
                    selectElement.val('');
                  } else {
                    selectCtrl.renderUnknownOption(viewValue);
                  }
                }
              };
              selectElement.on('change', function () {
                scope.$apply(function () {
                  if (unknownOption.parent())
                    unknownOption.remove();
                  ngModelCtrl.$setViewValue(selectElement.val());
                });
              });
            }
            function setupAsMultiple(scope, selectElement, ctrl) {
              var lastView;
              ctrl.$render = function () {
                var items = new HashMap(ctrl.$viewValue);
                forEach(selectElement.find('option'), function (option) {
                  option.selected = isDefined(items.get(option.value));
                });
              };
              scope.$watch(function selectMultipleWatch() {
                if (!equals(lastView, ctrl.$viewValue)) {
                  lastView = copy(ctrl.$viewValue);
                  ctrl.$render();
                }
              });
              selectElement.on('change', function () {
                scope.$apply(function () {
                  var array = [];
                  forEach(selectElement.find('option'), function (option) {
                    if (option.selected) {
                      array.push(option.value);
                    }
                  });
                  ctrl.$setViewValue(array);
                });
              });
            }
            function setupAsOptions(scope, selectElement, ctrl) {
              var match;
              if (!(match = optionsExp.match(NG_OPTIONS_REGEXP))) {
                throw ngOptionsMinErr('iexp', 'Expected expression in form of ' + '\'_select_ (as _label_)? for (_key_,)?_value_ in _collection_\'' + ' but got \'{0}\'. Element: {1}', optionsExp, startingTag(selectElement));
              }
              var displayFn = $parse(match[2] || match[1]), valueName = match[4] || match[6], keyName = match[5], groupByFn = $parse(match[3] || ''), valueFn = $parse(match[2] ? match[1] : valueName), valuesFn = $parse(match[7]), track = match[8], trackFn = track ? $parse(match[8]) : null, optionGroupsCache = [[{
                      element: selectElement,
                      label: ''
                    }]];
              if (nullOption) {
                $compile(nullOption)(scope);
                nullOption.removeClass('ng-scope');
                nullOption.remove();
              }
              selectElement.empty();
              selectElement.on('change', function () {
                scope.$apply(function () {
                  var optionGroup, collection = valuesFn(scope) || [], locals = {}, key, value, optionElement, index, groupIndex, length, groupLength, trackIndex;
                  if (multiple) {
                    value = [];
                    for (groupIndex = 0, groupLength = optionGroupsCache.length; groupIndex < groupLength; groupIndex++) {
                      optionGroup = optionGroupsCache[groupIndex];
                      for (index = 1, length = optionGroup.length; index < length; index++) {
                        if ((optionElement = optionGroup[index].element)[0].selected) {
                          key = optionElement.val();
                          if (keyName)
                            locals[keyName] = key;
                          if (trackFn) {
                            for (trackIndex = 0; trackIndex < collection.length; trackIndex++) {
                              locals[valueName] = collection[trackIndex];
                              if (trackFn(scope, locals) == key)
                                break;
                            }
                          } else {
                            locals[valueName] = collection[key];
                          }
                          value.push(valueFn(scope, locals));
                        }
                      }
                    }
                  } else {
                    key = selectElement.val();
                    if (key == '?') {
                      value = undefined;
                    } else if (key === '') {
                      value = null;
                    } else {
                      if (trackFn) {
                        for (trackIndex = 0; trackIndex < collection.length; trackIndex++) {
                          locals[valueName] = collection[trackIndex];
                          if (trackFn(scope, locals) == key) {
                            value = valueFn(scope, locals);
                            break;
                          }
                        }
                      } else {
                        locals[valueName] = collection[key];
                        if (keyName)
                          locals[keyName] = key;
                        value = valueFn(scope, locals);
                      }
                    }
                    if (optionGroupsCache[0].length > 1) {
                      if (optionGroupsCache[0][1].id !== key) {
                        optionGroupsCache[0][1].selected = false;
                      }
                    }
                  }
                  ctrl.$setViewValue(value);
                });
              });
              ctrl.$render = render;
              scope.$watch(render);
              function render() {
                var optionGroups = { '': [] }, optionGroupNames = [''], optionGroupName, optionGroup, option, existingParent, existingOptions, existingOption, modelValue = ctrl.$modelValue, values = valuesFn(scope) || [], keys = keyName ? sortedKeys(values) : values, key, groupLength, length, groupIndex, index, locals = {}, selected, selectedSet = false, lastElement, element, label;
                if (multiple) {
                  if (trackFn && isArray(modelValue)) {
                    selectedSet = new HashMap([]);
                    for (var trackIndex = 0; trackIndex < modelValue.length; trackIndex++) {
                      locals[valueName] = modelValue[trackIndex];
                      selectedSet.put(trackFn(scope, locals), modelValue[trackIndex]);
                    }
                  } else {
                    selectedSet = new HashMap(modelValue);
                  }
                }
                for (index = 0; length = keys.length, index < length; index++) {
                  key = index;
                  if (keyName) {
                    key = keys[index];
                    if (key.charAt(0) === '$')
                      continue;
                    locals[keyName] = key;
                  }
                  locals[valueName] = values[key];
                  optionGroupName = groupByFn(scope, locals) || '';
                  if (!(optionGroup = optionGroups[optionGroupName])) {
                    optionGroup = optionGroups[optionGroupName] = [];
                    optionGroupNames.push(optionGroupName);
                  }
                  if (multiple) {
                    selected = isDefined(selectedSet.remove(trackFn ? trackFn(scope, locals) : valueFn(scope, locals)));
                  } else {
                    if (trackFn) {
                      var modelCast = {};
                      modelCast[valueName] = modelValue;
                      selected = trackFn(scope, modelCast) === trackFn(scope, locals);
                    } else {
                      selected = modelValue === valueFn(scope, locals);
                    }
                    selectedSet = selectedSet || selected;
                  }
                  label = displayFn(scope, locals);
                  label = isDefined(label) ? label : '';
                  optionGroup.push({
                    id: trackFn ? trackFn(scope, locals) : keyName ? keys[index] : index,
                    label: label,
                    selected: selected
                  });
                }
                if (!multiple) {
                  if (nullOption || modelValue === null) {
                    optionGroups[''].unshift({
                      id: '',
                      label: '',
                      selected: !selectedSet
                    });
                  } else if (!selectedSet) {
                    optionGroups[''].unshift({
                      id: '?',
                      label: '',
                      selected: true
                    });
                  }
                }
                for (groupIndex = 0, groupLength = optionGroupNames.length; groupIndex < groupLength; groupIndex++) {
                  optionGroupName = optionGroupNames[groupIndex];
                  optionGroup = optionGroups[optionGroupName];
                  if (optionGroupsCache.length <= groupIndex) {
                    existingParent = {
                      element: optGroupTemplate.clone().attr('label', optionGroupName),
                      label: optionGroup.label
                    };
                    existingOptions = [existingParent];
                    optionGroupsCache.push(existingOptions);
                    selectElement.append(existingParent.element);
                  } else {
                    existingOptions = optionGroupsCache[groupIndex];
                    existingParent = existingOptions[0];
                    if (existingParent.label != optionGroupName) {
                      existingParent.element.attr('label', existingParent.label = optionGroupName);
                    }
                  }
                  lastElement = null;
                  for (index = 0, length = optionGroup.length; index < length; index++) {
                    option = optionGroup[index];
                    if (existingOption = existingOptions[index + 1]) {
                      lastElement = existingOption.element;
                      if (existingOption.label !== option.label) {
                        lastElement.text(existingOption.label = option.label);
                      }
                      if (existingOption.id !== option.id) {
                        lastElement.val(existingOption.id = option.id);
                      }
                      if (existingOption.selected !== option.selected) {
                        lastElement.prop('selected', existingOption.selected = option.selected);
                      }
                    } else {
                      if (option.id === '' && nullOption) {
                        element = nullOption;
                      } else {
                        (element = optionTemplate.clone()).val(option.id).attr('selected', option.selected).text(option.label);
                      }
                      existingOptions.push(existingOption = {
                        element: element,
                        label: option.label,
                        id: option.id,
                        selected: option.selected
                      });
                      if (lastElement) {
                        lastElement.after(element);
                      } else {
                        existingParent.element.append(element);
                      }
                      lastElement = element;
                    }
                  }
                  index++;
                  while (existingOptions.length > index) {
                    existingOptions.pop().element.remove();
                  }
                }
                while (optionGroupsCache.length > groupIndex) {
                  optionGroupsCache.pop()[0].element.remove();
                }
              }
            }
          }
        };
      }
    ];
  var optionDirective = [
      '$interpolate',
      function ($interpolate) {
        var nullSelectCtrl = {
            addOption: noop,
            removeOption: noop
          };
        return {
          restrict: 'E',
          priority: 100,
          compile: function (element, attr) {
            if (isUndefined(attr.value)) {
              var interpolateFn = $interpolate(element.text(), true);
              if (!interpolateFn) {
                attr.$set('value', element.text());
              }
            }
            return function (scope, element, attr) {
              var selectCtrlName = '$selectController', parent = element.parent(), selectCtrl = parent.data(selectCtrlName) || parent.parent().data(selectCtrlName);
              if (selectCtrl && selectCtrl.databound) {
                element.prop('selected', false);
              } else {
                selectCtrl = nullSelectCtrl;
              }
              if (interpolateFn) {
                scope.$watch(interpolateFn, function interpolateWatchAction(newVal, oldVal) {
                  attr.$set('value', newVal);
                  if (newVal !== oldVal)
                    selectCtrl.removeOption(oldVal);
                  selectCtrl.addOption(newVal);
                });
              } else {
                selectCtrl.addOption(attr.value);
              }
              element.on('$destroy', function () {
                selectCtrl.removeOption(attr.value);
              });
            };
          }
        };
      }
    ];
  var styleDirective = valueFn({
      restrict: 'E',
      terminal: true
    });
  if (window.angular.bootstrap) {
    console.log('WARNING: Tried to load angular more than once.');
    return;
  }
  bindJQuery();
  publishExternalAPI(angular);
  jqLite(document).ready(function () {
    angularInit(document, bootstrap);
  });
}(window, document));
!angular.$$csp() && angular.element(document).find('head').prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}.ng-animate-block-transitions{transition:0s all!important;-webkit-transition:0s all!important;}</style>');
(function (window, angular, undefined) {
  'use strict';
  var ngRouteModule = angular.module('ngRoute', ['ng']).provider('$route', $RouteProvider);
  function $RouteProvider() {
    function inherit(parent, extra) {
      return angular.extend(new (angular.extend(function () {
      }, { prototype: parent }))(), extra);
    }
    var routes = {};
    this.when = function (path, route) {
      routes[path] = angular.extend({ reloadOnSearch: true }, route, path && pathRegExp(path, route));
      if (path) {
        var redirectPath = path[path.length - 1] == '/' ? path.substr(0, path.length - 1) : path + '/';
        routes[redirectPath] = angular.extend({ redirectTo: path }, pathRegExp(redirectPath, route));
      }
      return this;
    };
    function pathRegExp(path, opts) {
      var insensitive = opts.caseInsensitiveMatch, ret = {
          originalPath: path,
          regexp: path
        }, keys = ret.keys = [];
      path = path.replace(/([().])/g, '\\$1').replace(/(\/)?:(\w+)([\?\*])?/g, function (_, slash, key, option) {
        var optional = option === '?' ? option : null;
        var star = option === '*' ? option : null;
        keys.push({
          name: key,
          optional: !!optional
        });
        slash = slash || '';
        return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (star && '(.+?)' || '([^/]+)') + (optional || '') + ')' + (optional || '');
      }).replace(/([\/$\*])/g, '\\$1');
      ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
      return ret;
    }
    this.otherwise = function (params) {
      this.when(null, params);
      return this;
    };
    this.$get = [
      '$rootScope',
      '$location',
      '$routeParams',
      '$q',
      '$injector',
      '$http',
      '$templateCache',
      '$sce',
      function ($rootScope, $location, $routeParams, $q, $injector, $http, $templateCache, $sce) {
        var forceReload = false, $route = {
            routes: routes,
            reload: function () {
              forceReload = true;
              $rootScope.$evalAsync(updateRoute);
            }
          };
        $rootScope.$on('$locationChangeSuccess', updateRoute);
        return $route;
        function switchRouteMatcher(on, route) {
          var keys = route.keys, params = {};
          if (!route.regexp)
            return null;
          var m = route.regexp.exec(on);
          if (!m)
            return null;
          for (var i = 1, len = m.length; i < len; ++i) {
            var key = keys[i - 1];
            var val = 'string' == typeof m[i] ? decodeURIComponent(m[i]) : m[i];
            if (key && val) {
              params[key.name] = val;
            }
          }
          return params;
        }
        function updateRoute() {
          var next = parseRoute(), last = $route.current;
          if (next && last && next.$$route === last.$$route && angular.equals(next.pathParams, last.pathParams) && !next.reloadOnSearch && !forceReload) {
            last.params = next.params;
            angular.copy(last.params, $routeParams);
            $rootScope.$broadcast('$routeUpdate', last);
          } else if (next || last) {
            forceReload = false;
            $rootScope.$broadcast('$routeChangeStart', next, last);
            $route.current = next;
            if (next) {
              if (next.redirectTo) {
                if (angular.isString(next.redirectTo)) {
                  $location.path(interpolate(next.redirectTo, next.params)).search(next.params).replace();
                } else {
                  $location.url(next.redirectTo(next.pathParams, $location.path(), $location.search())).replace();
                }
              }
            }
            $q.when(next).then(function () {
              if (next) {
                var locals = angular.extend({}, next.resolve), template, templateUrl;
                angular.forEach(locals, function (value, key) {
                  locals[key] = angular.isString(value) ? $injector.get(value) : $injector.invoke(value);
                });
                if (angular.isDefined(template = next.template)) {
                  if (angular.isFunction(template)) {
                    template = template(next.params);
                  }
                } else if (angular.isDefined(templateUrl = next.templateUrl)) {
                  if (angular.isFunction(templateUrl)) {
                    templateUrl = templateUrl(next.params);
                  }
                  templateUrl = $sce.getTrustedResourceUrl(templateUrl);
                  if (angular.isDefined(templateUrl)) {
                    next.loadedTemplateUrl = templateUrl;
                    template = $http.get(templateUrl, { cache: $templateCache }).then(function (response) {
                      return response.data;
                    });
                  }
                }
                if (angular.isDefined(template)) {
                  locals['$template'] = template;
                }
                return $q.all(locals);
              }
            }).then(function (locals) {
              if (next == $route.current) {
                if (next) {
                  next.locals = locals;
                  angular.copy(next.params, $routeParams);
                }
                $rootScope.$broadcast('$routeChangeSuccess', next, last);
              }
            }, function (error) {
              if (next == $route.current) {
                $rootScope.$broadcast('$routeChangeError', next, last, error);
              }
            });
          }
        }
        function parseRoute() {
          var params, match;
          angular.forEach(routes, function (route, path) {
            if (!match && (params = switchRouteMatcher($location.path(), route))) {
              match = inherit(route, {
                params: angular.extend({}, $location.search(), params),
                pathParams: params
              });
              match.$$route = route;
            }
          });
          return match || routes[null] && inherit(routes[null], {
            params: {},
            pathParams: {}
          });
        }
        function interpolate(string, params) {
          var result = [];
          angular.forEach((string || '').split(':'), function (segment, i) {
            if (i === 0) {
              result.push(segment);
            } else {
              var segmentMatch = segment.match(/(\w+)(.*)/);
              var key = segmentMatch[1];
              result.push(params[key]);
              result.push(segmentMatch[2] || '');
              delete params[key];
            }
          });
          return result.join('');
        }
      }
    ];
  }
  ngRouteModule.provider('$routeParams', $RouteParamsProvider);
  function $RouteParamsProvider() {
    this.$get = function () {
      return {};
    };
  }
  ngRouteModule.directive('ngView', ngViewFactory);
  ngRouteModule.directive('ngView', ngViewFillContentFactory);
  ngViewFactory.$inject = [
    '$route',
    '$anchorScroll',
    '$animate'
  ];
  function ngViewFactory($route, $anchorScroll, $animate) {
    return {
      restrict: 'ECA',
      terminal: true,
      priority: 400,
      transclude: 'element',
      link: function (scope, $element, attr, ctrl, $transclude) {
        var currentScope, currentElement, previousElement, autoScrollExp = attr.autoscroll, onloadExp = attr.onload || '';
        scope.$on('$routeChangeSuccess', update);
        update();
        function cleanupLastView() {
          if (previousElement) {
            previousElement.remove();
            previousElement = null;
          }
          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if (currentElement) {
            $animate.leave(currentElement, function () {
              previousElement = null;
            });
            previousElement = currentElement;
            currentElement = null;
          }
        }
        function update() {
          var locals = $route.current && $route.current.locals, template = locals && locals.$template;
          if (angular.isDefined(template)) {
            var newScope = scope.$new();
            var current = $route.current;
            var clone = $transclude(newScope, function (clone) {
                $animate.enter(clone, null, currentElement || $element, function onNgViewEnter() {
                  if (angular.isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                    $anchorScroll();
                  }
                });
                cleanupLastView();
              });
            currentElement = clone;
            currentScope = current.scope = newScope;
            currentScope.$emit('$viewContentLoaded');
            currentScope.$eval(onloadExp);
          } else {
            cleanupLastView();
          }
        }
      }
    };
  }
  ngViewFillContentFactory.$inject = [
    '$compile',
    '$controller',
    '$route'
  ];
  function ngViewFillContentFactory($compile, $controller, $route) {
    return {
      restrict: 'ECA',
      priority: -400,
      link: function (scope, $element) {
        var current = $route.current, locals = current.locals;
        $element.html(locals.$template);
        var link = $compile($element.contents());
        if (current.controller) {
          locals.$scope = scope;
          var controller = $controller(current.controller, locals);
          if (current.controllerAs) {
            scope[current.controllerAs] = controller;
          }
          $element.data('$ngControllerController', controller);
          $element.children().data('$ngControllerController', controller);
        }
        link(scope);
      }
    };
  }
}(window, window.angular));
(function (F, g, P) {
  'use strict';
  g.module('ngAnimate', ['ng']).factory('$$animateReflow', [
    '$$rAF',
    '$document',
    function (g, F) {
      return function (e) {
        return g(function () {
          e();
        });
      };
    }
  ]).config([
    '$provide',
    '$animateProvider',
    function (V, G) {
      function e(e) {
        for (var p = 0; p < e.length; p++) {
          var g = e[p];
          if (g.nodeType == ba)
            return g;
        }
      }
      function u(p) {
        return g.element(e(p));
      }
      var m = g.noop, p = g.forEach, ga = G.$$selectors, ba = 1, h = '$$ngAnimateState', J = 'ng-animate', r = { running: !0 };
      V.decorator('$animate', [
        '$delegate',
        '$injector',
        '$sniffer',
        '$rootElement',
        '$$asyncCallback',
        '$rootScope',
        '$document',
        function (x, F, aa, K, E, H, P) {
          function Q(a) {
            if (a) {
              var b = [], c = {};
              a = a.substr(1).split('.');
              (aa.transitions || aa.animations) && a.push('');
              for (var d = 0; d < a.length; d++) {
                var f = a[d], e = ga[f];
                e && !c[f] && (b.push(F.get(e)), c[f] = !0);
              }
              return b;
            }
          }
          function L(a, b, c) {
            function d(a, b) {
              var c = a[b], d = a['before' + b.charAt(0).toUpperCase() + b.substr(1)];
              if (c || d)
                return 'leave' == b && (d = c, c = null), y.push({
                  event: b,
                  fn: c
                }), l.push({
                  event: b,
                  fn: d
                }), !0;
            }
            function f(b, d, e) {
              var f = [];
              p(b, function (a) {
                a.fn && f.push(a);
              });
              var n = 0;
              p(f, function (b, p) {
                var C = function () {
                  a: {
                    if (d) {
                      (d[p] || m)();
                      if (++n < f.length)
                        break a;
                      d = null;
                    }
                    e();
                  }
                };
                switch (b.event) {
                case 'setClass':
                  d.push(b.fn(a, q, z, C));
                  break;
                case 'addClass':
                  d.push(b.fn(a, q || c, C));
                  break;
                case 'removeClass':
                  d.push(b.fn(a, z || c, C));
                  break;
                default:
                  d.push(b.fn(a, C));
                }
              });
              d && 0 === d.length && e();
            }
            var e = a[0];
            if (e) {
              var h = 'setClass' == b, r = h || 'addClass' == b || 'removeClass' == b, q, z;
              g.isArray(c) && (q = c[0], z = c[1], c = q + ' ' + z);
              var s = a.attr('class') + ' ' + c;
              if (S(s)) {
                var t = m, v = [], l = [], w = m, n = [], y = [], s = (' ' + s).replace(/\s+/g, '.');
                p(Q(s), function (a) {
                  !d(a, b) && h && (d(a, 'addClass'), d(a, 'removeClass'));
                });
                return {
                  node: e,
                  event: b,
                  className: c,
                  isClassBased: r,
                  isSetClassOperation: h,
                  before: function (a) {
                    t = a;
                    f(l, v, function () {
                      t = m;
                      a();
                    });
                  },
                  after: function (a) {
                    w = a;
                    f(y, n, function () {
                      w = m;
                      a();
                    });
                  },
                  cancel: function () {
                    v && (p(v, function (a) {
                      (a || m)(!0);
                    }), t(!0));
                    n && (p(n, function (a) {
                      (a || m)(!0);
                    }), w(!0));
                  }
                };
              }
            }
          }
          function A(a, b, c, d, f, e, r) {
            function m(d) {
              var e = '$animate:' + d;
              w && (w[e] && 0 < w[e].length) && E(function () {
                c.triggerHandler(e, {
                  event: a,
                  className: b
                });
              });
            }
            function q() {
              m('before');
            }
            function z() {
              m('after');
            }
            function s() {
              m('close');
              r && E(function () {
                r();
              });
            }
            function t() {
              t.hasBeenRun || (t.hasBeenRun = !0, e());
            }
            function v() {
              if (!v.hasBeenRun) {
                v.hasBeenRun = !0;
                var d = c.data(h);
                d && (l && l.isClassBased ? B(c, b) : (E(function () {
                  var d = c.data(h) || {};
                  A == d.index && B(c, b, a);
                }), c.data(h, d)));
                s();
              }
            }
            var l = L(c, a, b);
            if (l) {
              b = l.className;
              var w = g.element._data(l.node), w = w && w.events;
              d || (d = f ? f.parent() : c.parent());
              var n = c.data(h) || {};
              f = n.active || {};
              var y = n.totalActive || 0, C = n.last;
              if (l.isClassBased && (n.disabled || C && !C.isClassBased) || N(c, d))
                t(), q(), z(), v();
              else {
                d = !1;
                if (0 < y) {
                  n = [];
                  if (l.isClassBased)
                    'setClass' == C.event ? (n.push(C), B(c, b)) : f[b] && (x = f[b], x.event == a ? d = !0 : (n.push(x), B(c, b)));
                  else if ('leave' == a && f['ng-leave'])
                    d = !0;
                  else {
                    for (var x in f)
                      n.push(f[x]), B(c, x);
                    f = {};
                    y = 0;
                  }
                  0 < n.length && p(n, function (a) {
                    a.cancel();
                  });
                }
                !l.isClassBased || (l.isSetClassOperation || d) || (d = 'addClass' == a == c.hasClass(b));
                if (d)
                  q(), z(), s();
                else {
                  if ('leave' == a)
                    c.one('$destroy', function (a) {
                      a = g.element(this);
                      var b = a.data(h);
                      b && (b = b.active['ng-leave']) && (b.cancel(), B(a, 'ng-leave'));
                    });
                  c.addClass(J);
                  var A = O++;
                  y++;
                  f[b] = l;
                  c.data(h, {
                    last: l,
                    active: f,
                    index: A,
                    totalActive: y
                  });
                  q();
                  l.before(function (d) {
                    var e = c.data(h);
                    d = d || !e || !e.active[b] || l.isClassBased && e.active[b].event != a;
                    t();
                    !0 === d ? v() : (z(), l.after(v));
                  });
                }
              }
            } else
              t(), q(), z(), v();
          }
          function T(a) {
            if (a = e(a))
              a = g.isFunction(a.getElementsByClassName) ? a.getElementsByClassName(J) : a.querySelectorAll('.' + J), p(a, function (a) {
                a = g.element(a);
                (a = a.data(h)) && a.active && p(a.active, function (a) {
                  a.cancel();
                });
              });
          }
          function B(a, b) {
            if (e(a) == e(K))
              r.disabled || (r.running = !1, r.structural = !1);
            else if (b) {
              var c = a.data(h) || {}, d = !0 === b;
              !d && (c.active && c.active[b]) && (c.totalActive--, delete c.active[b]);
              if (d || !c.totalActive)
                a.removeClass(J), a.removeData(h);
            }
          }
          function N(a, b) {
            if (r.disabled)
              return !0;
            if (e(a) == e(K))
              return r.disabled || r.running;
            do {
              if (0 === b.length)
                break;
              var c = e(b) == e(K), d = c ? r : b.data(h), d = d && (!!d.disabled || d.running || 0 < d.totalActive);
              if (c || d)
                return d;
              if (c)
                break;
            } while (b = b.parent());
            return !0;
          }
          var O = 0;
          K.data(h, r);
          H.$$postDigest(function () {
            H.$$postDigest(function () {
              r.running = !1;
            });
          });
          var U = G.classNameFilter(), S = U ? function (a) {
              return U.test(a);
            } : function () {
              return !0;
            };
          return {
            enter: function (a, b, c, d) {
              this.enabled(!1, a);
              x.enter(a, b, c);
              H.$$postDigest(function () {
                a = u(a);
                A('enter', 'ng-enter', a, b, c, m, d);
              });
            },
            leave: function (a, b) {
              T(a);
              this.enabled(!1, a);
              H.$$postDigest(function () {
                A('leave', 'ng-leave', u(a), null, null, function () {
                  x.leave(a);
                }, b);
              });
            },
            move: function (a, b, c, d) {
              T(a);
              this.enabled(!1, a);
              x.move(a, b, c);
              H.$$postDigest(function () {
                a = u(a);
                A('move', 'ng-move', a, b, c, m, d);
              });
            },
            addClass: function (a, b, c) {
              a = u(a);
              A('addClass', b, a, null, null, function () {
                x.addClass(a, b);
              }, c);
            },
            removeClass: function (a, b, c) {
              a = u(a);
              A('removeClass', b, a, null, null, function () {
                x.removeClass(a, b);
              }, c);
            },
            setClass: function (a, b, c, d) {
              a = u(a);
              A('setClass', [
                b,
                c
              ], a, null, null, function () {
                x.setClass(a, b, c);
              }, d);
            },
            enabled: function (a, b) {
              switch (arguments.length) {
              case 2:
                if (a)
                  B(b);
                else {
                  var c = b.data(h) || {};
                  c.disabled = !0;
                  b.data(h, c);
                }
                break;
              case 1:
                r.disabled = !a;
                break;
              default:
                a = !r.disabled;
              }
              return !!a;
            }
          };
        }
      ]);
      G.register('', [
        '$window',
        '$sniffer',
        '$timeout',
        '$$animateReflow',
        function (h, r, u, K) {
          function E(a, k) {
            R && R();
            W.push(k);
            R = K(function () {
              p(W, function (a) {
                a();
              });
              W = [];
              R = null;
              M = {};
            });
          }
          function H(a, k) {
            var b = e(a);
            a = g.element(b);
            Y.push(a);
            b = Date.now() + 1000 * k;
            b <= fa || (u.cancel(ea), fa = b, ea = u(function () {
              J(Y);
              Y = [];
            }, k, !1));
          }
          function J(a) {
            p(a, function (a) {
              (a = a.data(n)) && (a.closeAnimationFn || m)();
            });
          }
          function Q(a, k) {
            var b = k ? M[k] : null;
            if (!b) {
              var c = 0, d = 0, e = 0, f = 0, n, Z, $, g;
              p(a, function (a) {
                if (a.nodeType == ba) {
                  a = h.getComputedStyle(a) || {};
                  $ = a[I + s];
                  c = Math.max(L($), c);
                  g = a[I + t];
                  n = a[I + v];
                  d = Math.max(L(n), d);
                  Z = a[q + v];
                  f = Math.max(L(Z), f);
                  var k = L(a[q + s]);
                  0 < k && (k *= parseInt(a[q + l], 10) || 1);
                  e = Math.max(k, e);
                }
              });
              b = {
                total: 0,
                transitionPropertyStyle: g,
                transitionDurationStyle: $,
                transitionDelayStyle: n,
                transitionDelay: d,
                transitionDuration: c,
                animationDelayStyle: Z,
                animationDelay: f,
                animationDuration: e
              };
              k && (M[k] = b);
            }
            return b;
          }
          function L(a) {
            var k = 0;
            a = g.isString(a) ? a.split(/\s*,\s*/) : [];
            p(a, function (a) {
              k = Math.max(parseFloat(a) || 0, k);
            });
            return k;
          }
          function A(a) {
            var k = a.parent(), b = k.data(w);
            b || (k.data(w, ++da), b = da);
            return b + '-' + e(a).className;
          }
          function T(a, k, b, c) {
            var d = A(k), f = d + ' ' + b, p = M[f] ? ++M[f].total : 0, g = {};
            if (0 < p) {
              var h = b + '-stagger', g = d + ' ' + h;
              (d = !M[g]) && k.addClass(h);
              g = Q(k, g);
              d && k.removeClass(h);
            }
            c = c || function (a) {
              return a();
            };
            k.addClass(b);
            var h = k.data(n) || {}, l = c(function () {
                return Q(k, f);
              });
            c = l.transitionDuration;
            d = l.animationDuration;
            if (0 === c && 0 === d)
              return k.removeClass(b), !1;
            k.data(n, {
              running: h.running || 0,
              itemIndex: p,
              stagger: g,
              timings: l,
              closeAnimationFn: m
            });
            a = 0 < h.running || 'setClass' == a;
            0 < c && B(k, b, a);
            0 < d && (0 < g.animationDelay && 0 === g.animationDuration) && (e(k).style[q] = 'none 0s');
            return !0;
          }
          function B(a, b, c) {
            'ng-enter' != b && ('ng-move' != b && 'ng-leave' != b) && c ? a.addClass(y) : e(a).style[I + t] = 'none';
          }
          function N(a, b) {
            var c = I + t, d = e(a);
            d.style[c] && 0 < d.style[c].length && (d.style[c] = '');
            a.removeClass(y);
          }
          function O(a) {
            var b = q;
            a = e(a);
            a.style[b] && 0 < a.style[b].length && (a.style[b] = '');
          }
          function U(a, b, c, f) {
            function g(a) {
              b.off(y, h);
              b.removeClass(r);
              d(b, c);
              a = e(b);
              for (var X in u)
                a.style.removeProperty(u[X]);
            }
            function h(a) {
              a.stopPropagation();
              var b = a.originalEvent || a;
              a = b.$manualTimeStamp || b.timeStamp || Date.now();
              b = parseFloat(b.elapsedTime.toFixed(C));
              Math.max(a - A, 0) >= x && b >= v && f();
            }
            var l = e(b);
            a = b.data(n);
            if (-1 != l.className.indexOf(c) && a) {
              var r = '';
              p(c.split(' '), function (a, b) {
                r += (0 < b ? ' ' : '') + a + '-active';
              });
              var q = a.stagger, m = a.timings, t = a.itemIndex, v = Math.max(m.transitionDuration, m.animationDuration), w = Math.max(m.transitionDelay, m.animationDelay), x = w * ca, A = Date.now(), y = z + ' ' + G, s = '', u = [];
              if (0 < m.transitionDuration) {
                var B = m.transitionPropertyStyle;
                -1 == B.indexOf('all') && (s += D + 'transition-property: ' + B + ';', s += D + 'transition-duration: ' + m.transitionDurationStyle + ';', u.push(D + 'transition-property'), u.push(D + 'transition-duration'));
              }
              0 < t && (0 < q.transitionDelay && 0 === q.transitionDuration && (s += D + 'transition-delay: ' + S(m.transitionDelayStyle, q.transitionDelay, t) + '; ', u.push(D + 'transition-delay')), 0 < q.animationDelay && 0 === q.animationDuration && (s += D + 'animation-delay: ' + S(m.animationDelayStyle, q.animationDelay, t) + '; ', u.push(D + 'animation-delay')));
              0 < u.length && (m = l.getAttribute('style') || '', l.setAttribute('style', m + ' ' + s));
              b.on(y, h);
              b.addClass(r);
              a.closeAnimationFn = function () {
                g();
                f();
              };
              l = (t * (Math.max(q.animationDelay, q.transitionDelay) || 0) + (w + v) * V) * ca;
              a.running++;
              H(b, l);
              return g;
            }
            f();
          }
          function S(a, b, c) {
            var d = '';
            p(a.split(','), function (a, X) {
              d += (0 < X ? ',' : '') + (c * b + parseInt(a, 10)) + 's';
            });
            return d;
          }
          function a(a, b, c, e) {
            if (T(a, b, c, e))
              return function (a) {
                a && d(b, c);
              };
          }
          function b(a, b, c, e) {
            if (b.data(n))
              return U(a, b, c, e);
            d(b, c);
            e();
          }
          function c(c, d, e, f) {
            var g = a(c, d, e);
            if (g) {
              var h = g;
              E(d, function () {
                N(d, e);
                O(d);
                h = b(c, d, e, f);
              });
              return function (a) {
                (h || m)(a);
              };
            }
            f();
          }
          function d(a, b) {
            a.removeClass(b);
            var c = a.data(n);
            c && (c.running && c.running--, c.running && 0 !== c.running || a.removeData(n));
          }
          function f(a, b) {
            var c = '';
            a = g.isArray(a) ? a : a.split(/\s+/);
            p(a, function (a, d) {
              a && 0 < a.length && (c += (0 < d ? ' ' : '') + a + b);
            });
            return c;
          }
          var D = '', I, G, q, z;
          F.ontransitionend === P && F.onwebkittransitionend !== P ? (D = '-webkit-', I = 'WebkitTransition', G = 'webkitTransitionEnd transitionend') : (I = 'transition', G = 'transitionend');
          F.onanimationend === P && F.onwebkitanimationend !== P ? (D = '-webkit-', q = 'WebkitAnimation', z = 'webkitAnimationEnd animationend') : (q = 'animation', z = 'animationend');
          var s = 'Duration', t = 'Property', v = 'Delay', l = 'IterationCount', w = '$$ngAnimateKey', n = '$$ngAnimateCSS3Data', y = 'ng-animate-block-transitions', C = 3, V = 1.5, ca = 1000, M = {}, da = 0, W = [], R, ea = null, fa = 0, Y = [];
          return {
            enter: function (a, b) {
              return c('enter', a, 'ng-enter', b);
            },
            leave: function (a, b) {
              return c('leave', a, 'ng-leave', b);
            },
            move: function (a, b) {
              return c('move', a, 'ng-move', b);
            },
            beforeSetClass: function (b, c, d, e) {
              var g = f(d, '-remove') + ' ' + f(c, '-add'), h = a('setClass', b, g, function (a) {
                  var e = b.attr('class');
                  b.removeClass(d);
                  b.addClass(c);
                  a = a();
                  b.attr('class', e);
                  return a;
                });
              if (h)
                return E(b, function () {
                  N(b, g);
                  O(b);
                  e();
                }), h;
              e();
            },
            beforeAddClass: function (b, c, d) {
              var e = a('addClass', b, f(c, '-add'), function (a) {
                  b.addClass(c);
                  a = a();
                  b.removeClass(c);
                  return a;
                });
              if (e)
                return E(b, function () {
                  N(b, c);
                  O(b);
                  d();
                }), e;
              d();
            },
            setClass: function (a, c, d, e) {
              d = f(d, '-remove');
              c = f(c, '-add');
              return b('setClass', a, d + ' ' + c, e);
            },
            addClass: function (a, c, d) {
              return b('addClass', a, f(c, '-add'), d);
            },
            beforeRemoveClass: function (b, c, d) {
              var e = a('removeClass', b, f(c, '-remove'), function (a) {
                  var d = b.attr('class');
                  b.removeClass(c);
                  a = a();
                  b.attr('class', d);
                  return a;
                });
              if (e)
                return E(b, function () {
                  N(b, c);
                  O(b);
                  d();
                }), e;
              d();
            },
            removeClass: function (a, c, d) {
              return b('removeClass', a, f(c, '-remove'), d);
            }
          };
        }
      ]);
    }
  ]);
}(window, window.angular));
(function () {
  var module = angular.module('restangular', []);
  module.provider('Restangular', function () {
    var Configurer = {};
    Configurer.init = function (object, config) {
      object.configuration = config;
      var safeMethods = [
          'get',
          'head',
          'options',
          'trace',
          'getlist'
        ];
      config.isSafe = function (operation) {
        return _.contains(safeMethods, operation.toLowerCase());
      };
      var absolutePattern = /^https?:\/\//i;
      config.isAbsoluteUrl = function (string) {
        return _.isUndefined(config.absoluteUrl) || _.isNull(config.absoluteUrl) ? string && absolutePattern.test(string) : config.absoluteUrl;
      };
      config.absoluteUrl = _.isUndefined(config.absoluteUrl) ? false : true;
      object.setSelfLinkAbsoluteUrl = function (value) {
        config.absoluteUrl = value;
      };
      config.baseUrl = _.isUndefined(config.baseUrl) ? '' : config.baseUrl;
      object.setBaseUrl = function (newBaseUrl) {
        config.baseUrl = /\/$/.test(newBaseUrl) ? newBaseUrl.substring(0, newBaseUrl.length - 1) : newBaseUrl;
        return this;
      };
      config.extraFields = config.extraFields || [];
      object.setExtraFields = function (newExtraFields) {
        config.extraFields = newExtraFields;
        return this;
      };
      config.defaultHttpFields = config.defaultHttpFields || {};
      object.setDefaultHttpFields = function (values) {
        config.defaultHttpFields = values;
        return this;
      };
      config.withHttpValues = function (httpLocalConfig, obj) {
        return _.defaults(obj, httpLocalConfig, config.defaultHttpFields);
      };
      config.encodeIds = _.isUndefined(config.encodeIds) ? true : config.encodeIds;
      object.setEncodeIds = function (encode) {
        config.encodeIds = encode;
      };
      config.defaultRequestParams = config.defaultRequestParams || {
        get: {},
        post: {},
        put: {},
        remove: {},
        common: {}
      };
      object.setDefaultRequestParams = function (param1, param2) {
        var methods = [], params = param2 || param1;
        if (!_.isUndefined(param2)) {
          if (_.isArray(param1)) {
            methods = param1;
          } else {
            methods.push(param1);
          }
        } else {
          methods.push('common');
        }
        _.each(methods, function (method) {
          config.defaultRequestParams[method] = params;
        });
        return this;
      };
      object.requestParams = config.defaultRequestParams;
      config.defaultHeaders = config.defaultHeaders || {};
      object.setDefaultHeaders = function (headers) {
        config.defaultHeaders = headers;
        object.defaultHeaders = config.defaultHeaders;
        return this;
      };
      object.defaultHeaders = config.defaultHeaders;
      config.methodOverriders = config.methodOverriders || [];
      object.setMethodOverriders = function (values) {
        var overriders = _.extend([], values);
        if (config.isOverridenMethod('delete', overriders)) {
          overriders.push('remove');
        }
        config.methodOverriders = overriders;
        return this;
      };
      config.jsonp = _.isUndefined(config.jsonp) ? false : config.jsonp;
      object.setJsonp = function (active) {
        config.jsonp = active;
      };
      config.isOverridenMethod = function (method, values) {
        var search = values || config.methodOverriders;
        return !_.isUndefined(_.find(search, function (one) {
          return one.toLowerCase() === method.toLowerCase();
        }));
      };
      config.urlCreator = config.urlCreator || 'path';
      object.setUrlCreator = function (name) {
        if (!_.has(config.urlCreatorFactory, name)) {
          throw new Error('URL Path selected isn\'t valid');
        }
        config.urlCreator = name;
        return this;
      };
      config.restangularFields = config.restangularFields || {
        id: 'id',
        route: 'route',
        parentResource: 'parentResource',
        restangularCollection: 'restangularCollection',
        cannonicalId: '__cannonicalId',
        etag: 'restangularEtag',
        selfLink: 'href',
        get: 'get',
        getList: 'getList',
        put: 'put',
        post: 'post',
        remove: 'remove',
        head: 'head',
        trace: 'trace',
        options: 'options',
        patch: 'patch',
        getRestangularUrl: 'getRestangularUrl',
        getRequestedUrl: 'getRequestedUrl',
        putElement: 'putElement',
        addRestangularMethod: 'addRestangularMethod',
        getParentList: 'getParentList',
        clone: 'clone',
        ids: 'ids',
        httpConfig: '_$httpConfig',
        reqParams: 'reqParams',
        one: 'one',
        all: 'all',
        several: 'several',
        oneUrl: 'oneUrl',
        allUrl: 'allUrl',
        customPUT: 'customPUT',
        customPOST: 'customPOST',
        customDELETE: 'customDELETE',
        customGET: 'customGET',
        customGETLIST: 'customGETLIST',
        customOperation: 'customOperation',
        doPUT: 'doPUT',
        doPOST: 'doPOST',
        doDELETE: 'doDELETE',
        doGET: 'doGET',
        doGETLIST: 'doGETLIST',
        fromServer: '$fromServer',
        withConfig: 'withConfig',
        withHttpConfig: 'withHttpConfig'
      };
      object.setRestangularFields = function (resFields) {
        config.restangularFields = _.extend(config.restangularFields, resFields);
        return this;
      };
      config.isRestangularized = function (obj) {
        return !!obj[config.restangularFields.one] || !!obj[config.restangularFields.all];
      };
      config.setFieldToElem = function (field, elem, value) {
        var properties = field.split('.');
        var idValue = elem;
        _.each(_.initial(properties), function (prop) {
          idValue[prop] = {};
          idValue = idValue[prop];
        });
        idValue[_.last(properties)] = value;
        return this;
      };
      config.getFieldFromElem = function (field, elem) {
        var properties = field.split('.');
        var idValue = elem;
        _.each(properties, function (prop) {
          if (idValue) {
            idValue = idValue[prop];
          }
        });
        return angular.copy(idValue);
      };
      config.setIdToElem = function (elem, id) {
        config.setFieldToElem(config.restangularFields.id, elem, id);
        return this;
      };
      config.getIdFromElem = function (elem) {
        return config.getFieldFromElem(config.restangularFields.id, elem);
      };
      config.isValidId = function (elemId) {
        return '' !== elemId && !_.isUndefined(elemId) && !_.isNull(elemId);
      };
      config.setUrlToElem = function (elem, url) {
        config.setFieldToElem(config.restangularFields.selfLink, elem, url);
        return this;
      };
      config.getUrlFromElem = function (elem) {
        return config.getFieldFromElem(config.restangularFields.selfLink, elem);
      };
      config.useCannonicalId = _.isUndefined(config.useCannonicalId) ? false : config.useCannonicalId;
      object.setUseCannonicalId = function (value) {
        config.useCannonicalId = value;
        return this;
      };
      config.getCannonicalIdFromElem = function (elem) {
        var cannonicalId = elem[config.restangularFields.cannonicalId];
        var actualId = config.isValidId(cannonicalId) ? cannonicalId : config.getIdFromElem(elem);
        return actualId;
      };
      config.responseInterceptors = config.responseInterceptors || [];
      config.defaultResponseInterceptor = function (data, operation, what, url, response, deferred) {
        return data;
      };
      config.responseExtractor = function (data, operation, what, url, response, deferred) {
        var interceptors = angular.copy(config.responseInterceptors);
        interceptors.push(config.defaultResponseInterceptor);
        var theData = data;
        _.each(interceptors, function (interceptor) {
          theData = interceptor(theData, operation, what, url, response, deferred);
        });
        return theData;
      };
      object.addResponseInterceptor = function (extractor) {
        config.responseInterceptors.push(extractor);
        return this;
      };
      object.setResponseInterceptor = object.addResponseInterceptor;
      object.setResponseExtractor = object.addResponseInterceptor;
      config.requestInterceptors = config.requestInterceptors || [];
      config.defaultInterceptor = function (element, operation, path, url, headers, params, httpConfig) {
        return {
          element: element,
          headers: headers,
          params: params,
          httpConfig: httpConfig
        };
      };
      config.fullRequestInterceptor = function (element, operation, path, url, headers, params, httpConfig) {
        var interceptors = angular.copy(config.requestInterceptors);
        interceptors.push(config.defaultInterceptor);
        return _.reduce(interceptors, function (request, interceptor) {
          return _.defaults(request, interceptor(element, operation, path, url, headers, params, httpConfig));
        }, {});
      };
      object.addRequestInterceptor = function (interceptor) {
        config.requestInterceptors.push(function (elem, operation, path, url, headers, params, httpConfig) {
          return {
            headers: headers,
            params: params,
            element: interceptor(elem, operation, path, url),
            httpConfig: httpConfig
          };
        });
        return this;
      };
      object.setRequestInterceptor = object.addRequestInterceptor;
      object.addFullRequestInterceptor = function (interceptor) {
        config.requestInterceptors.push(interceptor);
        return this;
      };
      object.setFullRequestInterceptor = object.addFullRequestInterceptor;
      config.errorInterceptor = config.errorInterceptor || function () {
      };
      object.setErrorInterceptor = function (interceptor) {
        config.errorInterceptor = interceptor;
        return this;
      };
      config.onBeforeElemRestangularized = config.onBeforeElemRestangularized || function (elem) {
        return elem;
      };
      object.setOnBeforeElemRestangularized = function (post) {
        config.onBeforeElemRestangularized = post;
        return this;
      };
      config.onElemRestangularized = config.onElemRestangularized || function (elem) {
        return elem;
      };
      object.setOnElemRestangularized = function (post) {
        config.onElemRestangularized = post;
        return this;
      };
      config.shouldSaveParent = config.shouldSaveParent || function () {
        return true;
      };
      object.setParentless = function (values) {
        if (_.isArray(values)) {
          config.shouldSaveParent = function (route) {
            return !_.contains(values, route);
          };
        } else if (_.isBoolean(values)) {
          config.shouldSaveParent = function () {
            return !values;
          };
        }
        return this;
      };
      config.suffix = _.isUndefined(config.suffix) ? null : config.suffix;
      object.setRequestSuffix = function (newSuffix) {
        config.suffix = newSuffix;
        return this;
      };
      config.transformers = config.transformers || {};
      object.addElementTransformer = function (type, secondArg, thirdArg) {
        var isCollection = null;
        var transformer = null;
        if (arguments.length === 2) {
          transformer = secondArg;
        } else {
          transformer = thirdArg;
          isCollection = secondArg;
        }
        var typeTransformers = config.transformers[type];
        if (!typeTransformers) {
          typeTransformers = config.transformers[type] = [];
        }
        typeTransformers.push(function (coll, elem) {
          if (_.isNull(isCollection) || coll == isCollection) {
            return transformer(elem);
          }
          return elem;
        });
      };
      object.extendCollection = function (route, fn) {
        return object.addElementTransformer(route, true, fn);
      };
      object.extendModel = function (route, fn) {
        return object.addElementTransformer(route, false, fn);
      };
      config.transformElem = function (elem, isCollection, route, Restangular) {
        if (!config.transformLocalElements && !elem[config.restangularFields.fromServer]) {
          return elem;
        }
        var typeTransformers = config.transformers[route];
        var changedElem = elem;
        if (typeTransformers) {
          _.each(typeTransformers, function (transformer) {
            changedElem = transformer(isCollection, changedElem);
          });
        }
        return config.onElemRestangularized(changedElem, isCollection, route, Restangular);
      };
      config.transformLocalElements = _.isUndefined(config.transformLocalElements) ? true : config.transformLocalElements;
      object.setTransformOnlyServerElements = function (active) {
        config.transformLocalElements = !active;
      };
      config.fullResponse = _.isUndefined(config.fullResponse) ? false : config.fullResponse;
      object.setFullResponse = function (full) {
        config.fullResponse = full;
        return this;
      };
      config.urlCreatorFactory = {};
      var BaseCreator = function () {
      };
      BaseCreator.prototype.setConfig = function (config) {
        this.config = config;
        return this;
      };
      BaseCreator.prototype.parentsArray = function (current) {
        var parents = [];
        while (current) {
          parents.push(current);
          current = current[this.config.restangularFields.parentResource];
        }
        return parents.reverse();
      };
      function RestangularResource(config, $http, url, configurer) {
        var resource = {};
        _.each(_.keys(configurer), function (key) {
          var value = configurer[key];
          value.params = _.extend({}, value.params, config.defaultRequestParams[value.method.toLowerCase()]);
          if (_.isEmpty(value.params)) {
            delete value.params;
          }
          if (config.isSafe(value.method)) {
            resource[key] = function () {
              return $http(_.extend(value, { url: url }));
            };
          } else {
            resource[key] = function (data) {
              return $http(_.extend(value, {
                url: url,
                data: data
              }));
            };
          }
        });
        return resource;
      }
      BaseCreator.prototype.resource = function (current, $http, localHttpConfig, callHeaders, callParams, what, etag, operation) {
        var params = _.defaults(callParams || {}, this.config.defaultRequestParams.common);
        var headers = _.defaults(callHeaders || {}, this.config.defaultHeaders);
        if (etag) {
          if (!config.isSafe(operation)) {
            headers['If-Match'] = etag;
          } else {
            headers['If-None-Match'] = etag;
          }
        }
        var url = this.base(current);
        if (what) {
          var add = '';
          if (!/\/$/.test(url)) {
            add += '/';
          }
          add += what;
          url += add;
        }
        if (this.config.suffix && url.indexOf(this.config.suffix, url.length - this.config.suffix.length) === -1 && !this.config.getUrlFromElem(current)) {
          url += this.config.suffix;
        }
        current[this.config.restangularFields.httpConfig] = undefined;
        return RestangularResource(this.config, $http, url, {
          getList: this.config.withHttpValues(localHttpConfig, {
            method: 'GET',
            params: params,
            headers: headers
          }),
          get: this.config.withHttpValues(localHttpConfig, {
            method: 'GET',
            params: params,
            headers: headers
          }),
          jsonp: this.config.withHttpValues(localHttpConfig, {
            method: 'jsonp',
            params: params,
            headers: headers
          }),
          put: this.config.withHttpValues(localHttpConfig, {
            method: 'PUT',
            params: params,
            headers: headers
          }),
          post: this.config.withHttpValues(localHttpConfig, {
            method: 'POST',
            params: params,
            headers: headers
          }),
          remove: this.config.withHttpValues(localHttpConfig, {
            method: 'DELETE',
            params: params,
            headers: headers
          }),
          head: this.config.withHttpValues(localHttpConfig, {
            method: 'HEAD',
            params: params,
            headers: headers
          }),
          trace: this.config.withHttpValues(localHttpConfig, {
            method: 'TRACE',
            params: params,
            headers: headers
          }),
          options: this.config.withHttpValues(localHttpConfig, {
            method: 'OPTIONS',
            params: params,
            headers: headers
          }),
          patch: this.config.withHttpValues(localHttpConfig, {
            method: 'PATCH',
            params: params,
            headers: headers
          })
        });
      };
      var Path = function () {
      };
      Path.prototype = new BaseCreator();
      Path.prototype.base = function (current) {
        var __this = this;
        return _.reduce(this.parentsArray(current), function (acum, elem) {
          var elemUrl;
          var elemSelfLink = __this.config.getUrlFromElem(elem);
          if (elemSelfLink) {
            if (__this.config.isAbsoluteUrl(elemSelfLink)) {
              return elemSelfLink;
            } else {
              elemUrl = elemSelfLink;
            }
          } else {
            elemUrl = elem[__this.config.restangularFields.route];
            if (elem[__this.config.restangularFields.restangularCollection]) {
              var ids = elem[__this.config.restangularFields.ids];
              if (ids) {
                elemUrl += '/' + ids.join(',');
              }
            } else {
              var elemId;
              if (__this.config.useCannonicalId) {
                elemId = __this.config.getCannonicalIdFromElem(elem);
              } else {
                elemId = __this.config.getIdFromElem(elem);
              }
              if (config.isValidId(elemId)) {
                elemUrl += '/' + (__this.config.encodeIds ? encodeURIComponent(elemId) : elemId);
              }
            }
          }
          return acum.replace(/\/$/, '') + '/' + elemUrl;
        }, this.config.baseUrl);
      };
      Path.prototype.fetchUrl = function (current, what) {
        var baseUrl = this.base(current);
        if (what) {
          baseUrl += '/' + what;
        }
        return baseUrl;
      };
      Path.prototype.fetchRequestedUrl = function (current, what) {
        var url = this.fetchUrl(current, what);
        var params = current[config.restangularFields.reqParams];
        function sortedKeys(obj) {
          var keys = [];
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              keys.push(key);
            }
          }
          return keys.sort();
        }
        function forEachSorted(obj, iterator, context) {
          var keys = sortedKeys(obj);
          for (var i = 0; i < keys.length; i++) {
            iterator.call(context, obj[keys[i]], keys[i]);
          }
          return keys;
        }
        function encodeUriQuery(val, pctEncodeSpaces) {
          return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, pctEncodeSpaces ? '%20' : '+');
        }
        if (!params)
          return url;
        var parts = [];
        forEachSorted(params, function (value, key) {
          if (value == null || value == undefined)
            return;
          if (!angular.isArray(value))
            value = [value];
          angular.forEach(value, function (v) {
            if (angular.isObject(v)) {
              v = angular.toJson(v);
            }
            parts.push(encodeUriQuery(key) + '=' + encodeUriQuery(v));
          });
        });
        return url + (this.config.suffix || '') + (url.indexOf('?') === -1 ? '?' : '&') + parts.join('&');
      };
      config.urlCreatorFactory.path = Path;
    };
    var globalConfiguration = {};
    Configurer.init(this, globalConfiguration);
    this.$get = [
      '$http',
      '$q',
      function ($http, $q) {
        function createServiceForConfiguration(config) {
          var service = {};
          var urlHandler = new config.urlCreatorFactory[config.urlCreator]();
          urlHandler.setConfig(config);
          function restangularizeBase(parent, elem, route, reqParams, fromServer) {
            elem[config.restangularFields.route] = route;
            elem[config.restangularFields.getRestangularUrl] = _.bind(urlHandler.fetchUrl, urlHandler, elem);
            elem[config.restangularFields.getRequestedUrl] = _.bind(urlHandler.fetchRequestedUrl, urlHandler, elem);
            elem[config.restangularFields.addRestangularMethod] = _.bind(addRestangularMethodFunction, elem);
            elem[config.restangularFields.clone] = _.bind(copyRestangularizedElement, elem, elem);
            elem[config.restangularFields.reqParams] = _.isEmpty(reqParams) ? null : reqParams;
            elem[config.restangularFields.withHttpConfig] = _.bind(withHttpConfig, elem);
            elem[config.restangularFields.one] = _.bind(one, elem, elem);
            elem[config.restangularFields.all] = _.bind(all, elem, elem);
            elem[config.restangularFields.several] = _.bind(several, elem, elem);
            elem[config.restangularFields.oneUrl] = _.bind(oneUrl, elem, elem);
            elem[config.restangularFields.allUrl] = _.bind(allUrl, elem, elem);
            elem[config.restangularFields.fromServer] = !!fromServer;
            if (parent && config.shouldSaveParent(route)) {
              var parentId = config.getIdFromElem(parent);
              var parentUrl = config.getUrlFromElem(parent);
              var restangularFieldsForParent = _.union(_.values(_.pick(config.restangularFields, [
                  'route',
                  'parentResource'
                ])), config.extraFields);
              var parentResource = _.pick(parent, restangularFieldsForParent);
              if (config.isValidId(parentId)) {
                config.setIdToElem(parentResource, parentId);
              }
              if (config.isValidId(parentUrl)) {
                config.setUrlToElem(parentResource, parentUrl);
              }
              elem[config.restangularFields.parentResource] = parentResource;
            } else {
              elem[config.restangularFields.parentResource] = null;
            }
            return elem;
          }
          function one(parent, route, id) {
            if (_.isNumber(route) || _.isNumber(parent)) {
              var error = 'You\'re creating a Restangular entity with the number ';
              error += 'instead of the route or the parent. You can\'t call .one(12)';
              throw new Error(error);
            }
            var elem = {};
            config.setIdToElem(elem, id);
            return restangularizeElem(parent, elem, route, false);
          }
          function all(parent, route) {
            return restangularizeCollection(parent, [], route, false);
          }
          function several(parent, route, ids) {
            var collection = [];
            collection[config.restangularFields.ids] = Array.prototype.splice.call(arguments, 2);
            return restangularizeCollection(parent, collection, route, false);
          }
          function oneUrl(parent, route, url) {
            if (!route) {
              throw new Error('Route is mandatory when creating new Restangular objects.');
            }
            var elem = {};
            config.setUrlToElem(elem, url);
            return restangularizeElem(parent, elem, route, false);
          }
          function allUrl(parent, route, url) {
            if (!route) {
              throw new Error('Route is mandatory when creating new Restangular objects.');
            }
            var elem = {};
            config.setUrlToElem(elem, url);
            return restangularizeCollection(parent, elem, route, false);
          }
          function restangularizePromise(promise, isCollection, valueToFill) {
            promise.call = _.bind(promiseCall, promise);
            promise.get = _.bind(promiseGet, promise);
            promise[config.restangularFields.restangularCollection] = isCollection;
            if (isCollection) {
              promise.push = _.bind(promiseCall, promise, 'push');
            }
            promise.$object = valueToFill;
            return promise;
          }
          function promiseCall(method) {
            var deferred = $q.defer();
            var callArgs = arguments;
            var filledValue = {};
            this.then(function (val) {
              var params = Array.prototype.slice.call(callArgs, 1);
              var func = val[method];
              func.apply(val, params);
              filledValue = val;
              deferred.resolve(val);
            });
            return restangularizePromise(deferred.promise, this[config.restangularFields.restangularCollection], filledValue);
          }
          function promiseGet(what) {
            var deferred = $q.defer();
            var filledValue = {};
            this.then(function (val) {
              filledValue = val[what];
              deferred.resolve(filledValue);
            });
            return restangularizePromise(deferred.promise, this[config.restangularFields.restangularCollection], filledValue);
          }
          function resolvePromise(deferred, response, data, filledValue) {
            _.extend(filledValue, data);
            if (config.fullResponse) {
              return deferred.resolve(_.extend(response, { data: data }));
            } else {
              deferred.resolve(data);
            }
          }
          function stripRestangular(elem) {
            if (_.isArray(elem)) {
              var array = [];
              _.each(elem, function (value) {
                array.push(stripRestangular(value));
              });
              return array;
            } else {
              return _.omit(elem, _.values(_.omit(config.restangularFields, 'id')));
            }
          }
          function addCustomOperation(elem) {
            elem[config.restangularFields.customOperation] = _.bind(customFunction, elem);
            _.each([
              'put',
              'post',
              'get',
              'delete'
            ], function (oper) {
              _.each([
                'do',
                'custom'
              ], function (alias) {
                var callOperation = oper === 'delete' ? 'remove' : oper;
                var name = alias + oper.toUpperCase();
                var callFunction;
                if (callOperation !== 'put' && callOperation !== 'post') {
                  callFunction = customFunction;
                } else {
                  callFunction = function (operation, elem, path, params, headers) {
                    return _.bind(customFunction, this)(operation, path, params, headers, elem);
                  };
                }
                elem[name] = _.bind(callFunction, elem, callOperation);
              });
            });
            elem[config.restangularFields.customGETLIST] = _.bind(fetchFunction, elem);
            elem[config.restangularFields.doGETLIST] = elem[config.restangularFields.customGETLIST];
          }
          function copyRestangularizedElement(fromElement) {
            var copiedElement = angular.copy(fromElement);
            return restangularizeElem(copiedElement[config.restangularFields.parentResource], copiedElement, copiedElement[config.restangularFields.route], true);
          }
          function restangularizeElem(parent, element, route, fromServer, collection, reqParams) {
            var elem = config.onBeforeElemRestangularized(element, false, route);
            var localElem = restangularizeBase(parent, elem, route, reqParams, fromServer);
            if (config.useCannonicalId) {
              localElem[config.restangularFields.cannonicalId] = config.getIdFromElem(localElem);
            }
            if (collection) {
              localElem[config.restangularFields.getParentList] = function () {
                return collection;
              };
            }
            localElem[config.restangularFields.restangularCollection] = false;
            localElem[config.restangularFields.get] = _.bind(getFunction, localElem);
            localElem[config.restangularFields.getList] = _.bind(fetchFunction, localElem);
            localElem[config.restangularFields.put] = _.bind(putFunction, localElem);
            localElem[config.restangularFields.post] = _.bind(postFunction, localElem);
            localElem[config.restangularFields.remove] = _.bind(deleteFunction, localElem);
            localElem[config.restangularFields.head] = _.bind(headFunction, localElem);
            localElem[config.restangularFields.trace] = _.bind(traceFunction, localElem);
            localElem[config.restangularFields.options] = _.bind(optionsFunction, localElem);
            localElem[config.restangularFields.patch] = _.bind(patchFunction, localElem);
            addCustomOperation(localElem);
            return config.transformElem(localElem, false, route, service);
          }
          function restangularizeCollection(parent, element, route, fromServer, reqParams) {
            var elem = config.onBeforeElemRestangularized(element, true, route);
            var localElem = restangularizeBase(parent, elem, route, reqParams, fromServer);
            localElem[config.restangularFields.restangularCollection] = true;
            localElem[config.restangularFields.post] = _.bind(postFunction, localElem, null);
            localElem[config.restangularFields.remove] = _.bind(deleteFunction, localElem);
            localElem[config.restangularFields.head] = _.bind(headFunction, localElem);
            localElem[config.restangularFields.trace] = _.bind(traceFunction, localElem);
            localElem[config.restangularFields.putElement] = _.bind(putElementFunction, localElem);
            localElem[config.restangularFields.options] = _.bind(optionsFunction, localElem);
            localElem[config.restangularFields.patch] = _.bind(patchFunction, localElem);
            localElem[config.restangularFields.get] = _.bind(getById, localElem);
            localElem[config.restangularFields.getList] = _.bind(fetchFunction, localElem, null);
            addCustomOperation(localElem);
            return config.transformElem(localElem, true, route, service);
          }
          function restangularizeCollectionAndElements(parent, element, route) {
            var collection = restangularizeCollection(parent, element, route, false);
            _.each(collection, function (elem) {
              restangularizeElem(parent, elem, route, false);
            });
            return collection;
          }
          function getById(id, reqParams, headers) {
            return this.customGET(id.toString(), reqParams, headers);
          }
          function putElementFunction(idx, params, headers) {
            var __this = this;
            var elemToPut = this[idx];
            var deferred = $q.defer();
            var filledArray = [];
            filledArray = config.transformElem(filledArray, true, whatFetched, service);
            elemToPut.put(params, headers).then(function (serverElem) {
              var newArray = copyRestangularizedElement(__this);
              newArray[idx] = serverElem;
              filledArray = newArray;
              deferred.resolve(newArray);
            }, function (response) {
              deferred.reject(response);
            });
            return restangularizePromise(deferred.promise, true, filledArray);
          }
          function parseResponse(resData, operation, route, fetchUrl, response, deferred) {
            var data = config.responseExtractor(resData, operation, route, fetchUrl, response, deferred);
            var etag = response.headers('ETag');
            if (data && etag) {
              data[config.restangularFields.etag] = etag;
            }
            return data;
          }
          function fetchFunction(what, reqParams, headers) {
            var __this = this;
            var deferred = $q.defer();
            var operation = 'getList';
            var url = urlHandler.fetchUrl(this, what);
            var whatFetched = what || __this[config.restangularFields.route];
            var request = config.fullRequestInterceptor(null, operation, whatFetched, url, headers || {}, reqParams || {}, this[config.restangularFields.httpConfig] || {});
            var filledArray = [];
            filledArray = config.transformElem(filledArray, true, whatFetched, service);
            var method = 'getList';
            if (config.jsonp) {
              method = 'jsonp';
            }
            urlHandler.resource(this, $http, request.httpConfig, request.headers, request.params, what, this[config.restangularFields.etag], operation)[method]().then(function (response) {
              var resData = response.data;
              var fullParams = response.config.params;
              var data = parseResponse(resData, operation, whatFetched, url, response, deferred);
              if (!_.isArray(data)) {
                throw new Error('Response for getList SHOULD be an array and not an object or something else');
              }
              var processedData = _.map(data, function (elem) {
                  if (!__this[config.restangularFields.restangularCollection]) {
                    return restangularizeElem(__this, elem, what, true, data);
                  } else {
                    return restangularizeElem(__this[config.restangularFields.parentResource], elem, __this[config.restangularFields.route], true, data);
                  }
                });
              processedData = _.extend(data, processedData);
              if (!__this[config.restangularFields.restangularCollection]) {
                resolvePromise(deferred, response, restangularizeCollection(__this, processedData, what, true, fullParams), filledArray);
              } else {
                resolvePromise(deferred, response, restangularizeCollection(__this[config.restangularFields.parentResource], processedData, __this[config.restangularFields.route], true, fullParams), filledArray);
              }
            }, function error(response) {
              if (response.status === 304 && __this[config.restangularFields.restangularCollection]) {
                resolvePromise(deferred, response, __this, filledArray);
              } else if (config.errorInterceptor(response, deferred) !== false) {
                deferred.reject(response);
              }
            });
            return restangularizePromise(deferred.promise, true, filledArray);
          }
          function withHttpConfig(httpConfig) {
            this[config.restangularFields.httpConfig] = httpConfig;
            return this;
          }
          function elemFunction(operation, what, params, obj, headers) {
            var __this = this;
            var deferred = $q.defer();
            var resParams = params || {};
            var route = what || this[config.restangularFields.route];
            var fetchUrl = urlHandler.fetchUrl(this, what);
            var callObj = obj || this;
            var etag = callObj[config.restangularFields.etag] || (operation != 'post' ? this[config.restangularFields.etag] : null);
            if (_.isObject(callObj) && config.isRestangularized(callObj)) {
              callObj = stripRestangular(callObj);
            }
            var request = config.fullRequestInterceptor(callObj, operation, route, fetchUrl, headers || {}, resParams || {}, this[config.restangularFields.httpConfig] || {});
            var filledObject = {};
            filledObject = config.transformElem(filledObject, false, route, service);
            var okCallback = function (response) {
              var resData = response.data;
              var fullParams = response.config.params;
              var elem = parseResponse(resData, operation, route, fetchUrl, response, deferred);
              if (elem) {
                if (operation === 'post' && !__this[config.restangularFields.restangularCollection]) {
                  resolvePromise(deferred, response, restangularizeElem(__this, elem, what, true, null, fullParams), filledObject);
                } else {
                  resolvePromise(deferred, response, restangularizeElem(__this[config.restangularFields.parentResource], elem, __this[config.restangularFields.route], true, null, fullParams), filledObject);
                }
              } else {
                resolvePromise(deferred, response, undefined, filledObject);
              }
            };
            var errorCallback = function (response) {
              if (response.status === 304 && config.isSafe(operation)) {
                resolvePromise(deferred, response, __this, filledObject);
              } else if (config.errorInterceptor(response, deferred) !== false) {
                deferred.reject(response);
              }
            };
            var callOperation = operation;
            var callHeaders = _.extend({}, request.headers);
            var isOverrideOperation = config.isOverridenMethod(operation);
            if (isOverrideOperation) {
              callOperation = 'post';
              callHeaders = _.extend(callHeaders, { 'X-HTTP-Method-Override': operation === 'remove' ? 'DELETE' : operation });
            } else if (config.jsonp && callOperation === 'get') {
              callOperation = 'jsonp';
            }
            if (config.isSafe(operation)) {
              if (isOverrideOperation) {
                urlHandler.resource(this, $http, request.httpConfig, callHeaders, request.params, what, etag, callOperation)[callOperation]({}).then(okCallback, errorCallback);
              } else {
                urlHandler.resource(this, $http, request.httpConfig, callHeaders, request.params, what, etag, callOperation)[callOperation]().then(okCallback, errorCallback);
              }
            } else {
              urlHandler.resource(this, $http, request.httpConfig, callHeaders, request.params, what, etag, callOperation)[callOperation](request.element).then(okCallback, errorCallback);
            }
            return restangularizePromise(deferred.promise, false, filledObject);
          }
          function getFunction(params, headers) {
            return _.bind(elemFunction, this)('get', undefined, params, undefined, headers);
          }
          function deleteFunction(params, headers) {
            return _.bind(elemFunction, this)('remove', undefined, params, undefined, headers);
          }
          function putFunction(params, headers) {
            return _.bind(elemFunction, this)('put', undefined, params, undefined, headers);
          }
          function postFunction(what, elem, params, headers) {
            return _.bind(elemFunction, this)('post', what, params, elem, headers);
          }
          function headFunction(params, headers) {
            return _.bind(elemFunction, this)('head', undefined, params, undefined, headers);
          }
          function traceFunction(params, headers) {
            return _.bind(elemFunction, this)('trace', undefined, params, undefined, headers);
          }
          function optionsFunction(params, headers) {
            return _.bind(elemFunction, this)('options', undefined, params, undefined, headers);
          }
          function patchFunction(elem, params, headers) {
            return _.bind(elemFunction, this)('patch', undefined, params, elem, headers);
          }
          function customFunction(operation, path, params, headers, elem) {
            return _.bind(elemFunction, this)(operation, path, params, elem, headers);
          }
          function addRestangularMethodFunction(name, operation, path, defaultParams, defaultHeaders, defaultElem) {
            var bindedFunction;
            if (operation === 'getList') {
              bindedFunction = _.bind(fetchFunction, this, path);
            } else {
              bindedFunction = _.bind(customFunction, this, operation, path);
            }
            var createdFunction = function (params, headers, elem) {
              var callParams = _.defaults({
                  params: params,
                  headers: headers,
                  elem: elem
                }, {
                  params: defaultParams,
                  headers: defaultHeaders,
                  elem: defaultElem
                });
              return bindedFunction(callParams.params, callParams.headers, callParams.elem);
            };
            if (config.isSafe(operation)) {
              this[name] = createdFunction;
            } else {
              this[name] = function (elem, params, headers) {
                return createdFunction(params, headers, elem);
              };
            }
          }
          function withConfigurationFunction(configurer) {
            var newConfig = angular.copy(_.omit(config, 'configuration'));
            Configurer.init(newConfig, newConfig);
            configurer(newConfig);
            return createServiceForConfiguration(newConfig);
          }
          Configurer.init(service, config);
          service.copy = _.bind(copyRestangularizedElement, service);
          service.withConfig = _.bind(withConfigurationFunction, service);
          service.one = _.bind(one, service, null);
          service.all = _.bind(all, service, null);
          service.several = _.bind(several, service, null);
          service.oneUrl = _.bind(oneUrl, service, null);
          service.allUrl = _.bind(allUrl, service, null);
          service.stripRestangular = _.bind(stripRestangular, service);
          service.restangularizeElement = _.bind(restangularizeElem, service);
          service.restangularizeCollection = _.bind(restangularizeCollectionAndElements, service);
          return service;
        }
        return createServiceForConfiguration(globalConfiguration);
      }
    ];
  });
}());
;
(function ($, window) {
  'use strict';
  var isIE8 = document.all && document.querySelector && !document.addEventListener;
  var options = {
      customClass: '',
      toggle: false,
      labels: {
        on: 'ON',
        off: 'OFF'
      }
    };
  var pub = {
      defaults: function (opts) {
        options = $.extend(options, opts || {});
        return $(this);
      },
      destroy: function () {
        return $(this).each(function (i, input) {
          var data = $(input).data('picker');
          if (data) {
            data.$picker.off('.picker');
            data.$handle.remove();
            data.$labels.remove();
            data.$input.off('.picker').removeClass('picker-element').data('picker', null);
            data.$label.removeClass('picker-label').unwrap();
          }
        });
      },
      disable: function () {
        return $(this).each(function (i, input) {
          var data = $(input).data('picker');
          if (data) {
            data.$input.prop('disabled', true);
            data.$picker.addClass('disabled');
          }
        });
      },
      enable: function () {
        return $(this).each(function (i, input) {
          var data = $(input).data('picker');
          if (data) {
            data.$input.prop('disabled', false);
            data.$picker.removeClass('disabled');
          }
        });
      },
      update: function () {
        return $(this).each(function (i, input) {
          var data = $(input).data('picker');
          if (data && !data.$input.is(':disabled')) {
            if (data.$input.is(':checked')) {
              _onSelect({ data: data }, true);
            } else {
              _onDeselect({ data: data }, true);
            }
          }
        });
      }
    };
  function _init(opts) {
    opts = $.extend({}, options, opts);
    var $items = $(this);
    for (var i = 0, count = $items.length; i < count; i++) {
      _build($items.eq(i), opts);
    }
    return $items;
  }
  function _build($input, opts) {
    if (!$input.data('picker')) {
      opts = $.extend({}, opts, $input.data('picker-options'));
      var $parent = $input.closest('label'), $label = $parent.length ? $parent.eq(0) : $('label[for=' + $input.attr('id') + ']'), type = $input.attr('type'), typeClass = 'picker-' + (type === 'radio' ? 'radio' : 'checkbox'), group = $input.attr('name'), html = '<div class="picker-handle"><div class="picker-flag" /></div>';
      if (opts.toggle) {
        typeClass += ' picker-toggle';
        html = '<span class="picker-toggle-label on">' + opts.labels.on + '</span><span class="picker-toggle-label off">' + opts.labels.off + '</span>' + html;
      }
      $input.addClass('picker-element');
      $label.wrap('<div class="picker ' + typeClass + ' ' + opts.customClass + '" />').before(html).addClass('picker-label');
      var $picker = $label.parents('.picker'), $handle = $picker.find('.picker-handle'), $labels = $picker.find('.picker-toggle-label');
      if ($input.is(':checked')) {
        $picker.addClass('checked');
      }
      if ($input.is(':disabled')) {
        $picker.addClass('disabled');
      }
      var data = $.extend({}, opts, {
          $picker: $picker,
          $input: $input,
          $handle: $handle,
          $label: $label,
          $labels: $labels,
          group: group,
          isRadio: type === 'radio',
          isCheckbox: type === 'checkbox'
        });
      data.$input.on('focus.picker', data, _onFocus).on('blur.picker', data, _onBlur).on('change.picker', data, _onChange).on('click.picker', data, _onClick).on('deselect.picker', data, _onDeselect).data('picker', data);
      data.$picker.on('click.picker', data, _onClick);
    }
  }
  function _onClick(e) {
    e.stopPropagation();
    var data = e.data;
    if (!$(e.target).is(data.$input)) {
      e.preventDefault();
      data.$input.trigger('click');
    }
  }
  function _onChange(e) {
    var data = e.data;
    if (!data.$input.is(':disabled')) {
      var checked = data.$input.is(':checked');
      if (data.isCheckbox) {
        if (checked) {
          _onSelect(e, true);
        } else {
          _onDeselect(e, true);
        }
      } else {
        if (checked || isIE8 && !checked) {
          _onSelect(e);
        }
      }
    }
  }
  function _onSelect(e, internal) {
    var data = e.data;
    if (typeof data.group !== 'undefined' && data.isRadio) {
      $('input[name="' + data.group + '"]').not(data.$input).trigger('deselect');
    }
    data.$picker.addClass('checked');
  }
  function _onDeselect(e, internal) {
    var data = e.data;
    data.$picker.removeClass('checked');
  }
  function _onFocus(e) {
    e.data.$picker.addClass('focus');
  }
  function _onBlur(e) {
    e.data.$picker.removeClass('focus');
  }
  $.fn.picker = function (method) {
    if (pub[method]) {
      return pub[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return _init.apply(this, arguments);
    }
    return this;
  };
  $.picker = function (method) {
    if (method === 'defaults') {
      pub.defaults.apply(this, Array.prototype.slice.call(arguments, 1));
    }
  };
}(jQuery));
;
(function ($, window) {
  'use strict';
  var guid = 0, isFirefox = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1, isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(window.navigator.userAgent || window.navigator.vendor || window.opera), $body = null;
  var options = {
      callback: $.noop,
      cover: false,
      customClass: '',
      label: '',
      external: false,
      links: false,
      trim: 0
    };
  var pub = {
      defaults: function (opts) {
        options = $.extend(options, opts || {});
        return $(this);
      },
      disable: function (option) {
        return $(this).each(function (i, input) {
          var data = $(input).next('.selecter').data('selecter');
          if (data) {
            if (typeof option !== 'undefined') {
              var index = data.$items.index(data.$items.filter('[data-value=' + option + ']'));
              data.$items.eq(index).addClass('disabled');
              data.$options.eq(index).prop('disabled', true);
            } else {
              if (data.$selecter.hasClass('open')) {
                data.$selecter.find('.selecter-selected').trigger('click.selecter');
              }
              data.$selecter.addClass('disabled');
              data.$select.prop('disabled', true);
            }
          }
        });
      },
      enable: function (option) {
        return $(this).each(function (i, input) {
          var data = $(input).next('.selecter').data('selecter');
          if (data) {
            if (typeof option !== 'undefined') {
              var index = data.$items.index(data.$items.filter('[data-value=' + option + ']'));
              data.$items.eq(index).removeClass('disabled');
              data.$options.eq(index).prop('disabled', false);
            } else {
              data.$selecter.removeClass('disabled');
              data.$select.prop('disabled', false);
            }
          }
        });
      },
      destroy: function () {
        return $(this).each(function (i, input) {
          var data = $(input).next('.selecter').data('selecter');
          if (data) {
            if (data.$selecter.hasClass('open')) {
              data.$selecter.find('.selecter-selected').trigger('click.selecter');
            }
            if ($.fn.scroller !== undefined) {
              data.$selecter.find('.selecter-options').scroller('destroy');
            }
            data.$select[0].tabIndex = data.tabIndex;
            data.$select.off('.selecter').removeClass('selecter-element').show();
            data.$selecter.off('.selecter').remove();
          }
        });
      },
      refresh: function () {
        return $(this).each(function (i, input) {
          var data = $(input).next('.selecter').data('selecter');
          if (data) {
            var index = data.index;
            data.$allOptions = data.$select.find('option, optgroup');
            data.$options = data.$allOptions.filter('option');
            data.index = -1;
            index = data.$options.index(data.$options.filter(':selected'));
            _buildOptions(data);
            _update(index, data);
          }
        });
      }
    };
  function _init(opts) {
    opts = $.extend({}, options, opts || {});
    if ($body === null) {
      $body = $('body');
    }
    var $items = $(this);
    for (var i = 0, count = $items.length; i < count; i++) {
      _build($items.eq(i), opts);
    }
    return $items;
  }
  function _build($select, opts) {
    if (!$select.hasClass('selecter-element')) {
      opts = $.extend({}, opts, $select.data('selecter-options'));
      if (opts.external) {
        opts.links = true;
      }
      var $allOptions = $select.find('option, optgroup'), $options = $allOptions.filter('option'), $originalOption = $options.filter(':selected'), originalIndex = opts.label !== '' ? -1 : $options.index($originalOption), wrapperTag = opts.links ? 'nav' : 'div';
      opts.tabIndex = $select[0].tabIndex;
      $select[0].tabIndex = -1;
      opts.multiple = $select.prop('multiple');
      opts.disabled = $select.is(':disabled');
      var html = '<' + wrapperTag + ' class="selecter ' + opts.customClass;
      if (isMobile) {
        html += ' mobile';
      } else if (opts.cover) {
        html += ' cover';
      }
      if (opts.multiple) {
        html += ' multiple';
      } else {
        html += ' closed';
      }
      if (opts.disabled) {
        html += ' disabled';
      }
      html += '" tabindex="' + opts.tabIndex + '">';
      if (!opts.multiple) {
        html += '<span class="selecter-selected' + (opts.label !== '' ? ' placeholder' : '') + '">';
        html += $('<span></span').text(_trim(opts.label !== '' ? opts.label : $originalOption.text(), opts.trim)).html();
        html += '</span>';
      }
      html += '<div class="selecter-options">';
      html += '</div>';
      html += '</' + wrapperTag + '>';
      $select.addClass('selecter-element').after(html);
      var $selecter = $select.next('.selecter'), data = $.extend({
          $select: $select,
          $allOptions: $allOptions,
          $options: $options,
          $selecter: $selecter,
          $selected: $selecter.find('.selecter-selected'),
          $itemsWrapper: $selecter.find('.selecter-options'),
          index: -1,
          guid: guid++
        }, opts);
      _buildOptions(data);
      _update(originalIndex, data);
      if ($.fn.scroller !== undefined) {
        data.$itemsWrapper.scroller();
      }
      data.$selecter.on('touchstart.selecter click.selecter', '.selecter-selected', data, _onClick).on('click.selecter', '.selecter-item', data, _onSelect).on('close.selecter', data, _onClose).data('selecter', data);
      data.$select.on('change.selecter', data, _onChange);
      if (!isMobile) {
        data.$selecter.on('focus.selecter', data, _onFocus).on('blur.selecter', data, _onBlur);
        data.$select.on('focus.selecter', data, function (e) {
          e.data.$selecter.trigger('focus');
        });
      }
    }
  }
  function _buildOptions(data) {
    var html = '', itemTag = data.links ? 'a' : 'span', j = 0;
    for (var i = 0, count = data.$allOptions.length; i < count; i++) {
      var $op = data.$allOptions.eq(i);
      if ($op[0].tagName === 'OPTGROUP') {
        html += '<span class="selecter-group';
        if ($op.is(':disabled')) {
          html += ' disabled';
        }
        html += '">' + $op.attr('label') + '</span>';
      } else {
        var opVal = $op.val();
        if (!$op.attr('value')) {
          $op.attr('value', opVal);
        }
        html += '<' + itemTag + ' class="selecter-item';
        if ($op.is(':selected') && data.label === '') {
          html += ' selected';
        }
        if ($op.is(':disabled')) {
          html += ' disabled';
        }
        html += '" ';
        if (data.links) {
          html += 'href="' + opVal + '"';
        } else {
          html += 'data-value="' + opVal + '"';
        }
        html += '>' + $('<span></span>').text(_trim($op.text(), data.trim)).html() + '</' + itemTag + '>';
        j++;
      }
    }
    data.$itemsWrapper.html(html);
    data.$items = data.$selecter.find('.selecter-item');
  }
  function _onClick(e) {
    e.preventDefault();
    e.stopPropagation();
    var data = e.data;
    if (!data.$select.is(':disabled')) {
      $('.selecter').not(data.$selecter).trigger('close.selecter', [data]);
      if (isMobile) {
        var el = data.$select[0];
        if (window.document.createEvent) {
          var evt = window.document.createEvent('MouseEvents');
          evt.initMouseEvent('mousedown', false, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          el.dispatchEvent(evt);
        } else if (el.fireEvent) {
          el.fireEvent('onmousedown');
        }
      } else {
        if (data.$selecter.hasClass('closed')) {
          _onOpen(e);
        } else if (data.$selecter.hasClass('open')) {
          _onClose(e);
        }
      }
    }
  }
  function _onOpen(e) {
    e.preventDefault();
    e.stopPropagation();
    var data = e.data;
    if (!data.$selecter.hasClass('open')) {
      var offset = data.$selecter.offset(), bodyHeight = $body.outerHeight(), optionsHeight = data.$itemsWrapper.outerHeight(true), selectedOffset = data.index >= 0 ? data.$items.eq(data.index).position() : {
          left: 0,
          top: 0
        };
      if (offset.top + optionsHeight > bodyHeight) {
        data.$selecter.addClass('bottom');
      }
      data.$itemsWrapper.show();
      data.$selecter.removeClass('closed').addClass('open');
      $body.on('click.selecter-' + data.guid, ':not(.selecter-options)', data, _onCloseHelper);
      if ($.fn.scroller !== undefined) {
        data.$itemsWrapper.scroller('scroll', data.$itemsWrapper.find('.scroller-content').scrollTop() + selectedOffset.top, 0).scroller('reset');
      } else {
        data.$itemsWrapper.scrollTop(data.$itemsWrapper.scrollTop() + selectedOffset.top);
      }
    }
  }
  function _onCloseHelper(e) {
    e.preventDefault();
    e.stopPropagation();
    if ($(e.currentTarget).parents('.selecter').length === 0) {
      _onClose(e);
    }
  }
  function _onClose(e) {
    e.preventDefault();
    e.stopPropagation();
    var data = e.data;
    if (data.$selecter.hasClass('open')) {
      data.$itemsWrapper.hide();
      data.$selecter.removeClass('open bottom').addClass('closed');
      $body.off('.selecter-' + data.guid);
    }
  }
  function _onSelect(e) {
    e.preventDefault();
    e.stopPropagation();
    var $target = $(this), data = e.data;
    if (!data.$select.is(':disabled')) {
      if (data.$itemsWrapper.is(':visible')) {
        var index = data.$items.index($target);
        _update(index, data);
        _handleChange(data);
      }
      if (!data.multiple) {
        _onClose(e);
      }
    }
  }
  function _onChange(e, internal) {
    var $target = $(this), data = e.data;
    if (!internal && !data.multiple) {
      var index = data.$options.index(data.$options.filter('[value=\'' + _escape($target.val()) + '\']'));
      _update(index, data);
      _handleChange(data);
    }
  }
  function _onFocus(e) {
    e.preventDefault();
    e.stopPropagation();
    var data = e.data;
    if (!data.$select.is(':disabled') && !data.multiple) {
      data.$selecter.addClass('focus').on('keydown.selecter' + data.guid, data, _onKeypress);
      $('.selecter').not(data.$selecter).trigger('close.selecter', [data]);
    }
  }
  function _onBlur(e, internal, two) {
    e.preventDefault();
    e.stopPropagation();
    var data = e.data;
    data.$selecter.removeClass('focus').off('keydown.selecter' + data.guid + ' keyup.selecter' + data.guid);
    $('.selecter').not(data.$selecter).trigger('close.selecter', [data]);
  }
  function _onKeypress(e) {
    var data = e.data;
    if (e.keyCode === 13) {
      if (data.$selecter.hasClass('open')) {
        _onClose(e);
        _update(data.index, data);
      }
      _handleChange(data);
    } else if (e.keyCode !== 9 && (!e.metaKey && !e.altKey && !e.ctrlKey && !e.shiftKey)) {
      e.preventDefault();
      e.stopPropagation();
      var total = data.$items.length - 1, index = data.index < 0 ? 0 : data.index;
      if ($.inArray(e.keyCode, isFirefox ? [
          38,
          40,
          37,
          39
        ] : [
          38,
          40
        ]) > -1) {
        index = index + (e.keyCode === 38 || isFirefox && e.keyCode === 37 ? -1 : 1);
        if (index < 0) {
          index = 0;
        }
        if (index > total) {
          index = total;
        }
      } else {
        var input = String.fromCharCode(e.keyCode).toUpperCase(), letter, i;
        for (i = data.index + 1; i <= total; i++) {
          letter = data.$options.eq(i).text().charAt(0).toUpperCase();
          if (letter === input) {
            index = i;
            break;
          }
        }
        if (index < 0) {
          for (i = 0; i <= total; i++) {
            letter = data.$options.eq(i).text().charAt(0).toUpperCase();
            if (letter === input) {
              index = i;
              break;
            }
          }
        }
      }
      if (index >= 0) {
        _update(index, data);
      }
    }
  }
  function _update(index, data) {
    var $item = data.$items.eq(index), isSelected = $item.hasClass('selected'), isDisabled = $item.hasClass('disabled');
    if (!isDisabled) {
      if (index === -1 && data.label !== '') {
        data.$selected.html(data.label);
      } else if (!isSelected) {
        var newLabel = $item.html(), newValue = $item.data('value');
        if (data.multiple) {
          data.$options.eq(index).prop('selected', true);
        } else {
          data.$selected.html(newLabel).removeClass('placeholder');
          data.$items.filter('.selected').removeClass('selected');
          data.$select[0].selectedIndex = index;
        }
        $item.addClass('selected');
      } else if (data.multiple) {
        data.$options.eq(index).prop('selected', null);
        $item.removeClass('selected');
      }
      if (!isSelected || data.multiple) {
        data.index = index;
      }
    }
  }
  function _handleChange(data) {
    if (data.links) {
      _launch(data);
    } else {
      data.callback.call(data.$selecter, data.$select.val(), data.index);
      data.$select.trigger('change', [true]);
    }
  }
  function _launch(data) {
    var url = data.$select.val();
    if (data.external) {
      window.open(url);
    } else {
      window.location.href = url;
    }
  }
  function _trim(text, length) {
    if (length === 0) {
      return text;
    } else {
      if (text.length > length) {
        return text.substring(0, length) + '...';
      } else {
        return text;
      }
    }
  }
  function _escape(text) {
    return text.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
  }
  $.fn.selecter = function (method) {
    if (pub[method]) {
      return pub[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return _init.apply(this, arguments);
    }
    return this;
  };
  $.selecter = function (method) {
    if (method === 'defaults') {
      pub.defaults.apply(this, Array.prototype.slice.call(arguments, 1));
    }
  };
}(jQuery, window));
(function () {
  var root = this;
  var previousUnderscore = root._;
  var breaker = {};
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
  var push = ArrayProto.push, slice = ArrayProto.slice, concat = ArrayProto.concat, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
  var nativeForEach = ArrayProto.forEach, nativeMap = ArrayProto.map, nativeReduce = ArrayProto.reduce, nativeReduceRight = ArrayProto.reduceRight, nativeFilter = ArrayProto.filter, nativeEvery = ArrayProto.every, nativeSome = ArrayProto.some, nativeIndexOf = ArrayProto.indexOf, nativeLastIndexOf = ArrayProto.lastIndexOf, nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeBind = FuncProto.bind;
  var _ = function (obj) {
    if (obj instanceof _)
      return obj;
    if (!(this instanceof _))
      return new _(obj);
    this._wrapped = obj;
  };
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }
  _.VERSION = '1.6.0';
  var each = _.each = _.forEach = function (obj, iterator, context) {
      if (obj == null)
        return obj;
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, length = obj.length; i < length; i++) {
          if (iterator.call(context, obj[i], i, obj) === breaker)
            return;
        }
      } else {
        var keys = _.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
          if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker)
            return;
        }
      }
      return obj;
    };
  _.map = _.collect = function (obj, iterator, context) {
    var results = [];
    if (obj == null)
      return results;
    if (nativeMap && obj.map === nativeMap)
      return obj.map(iterator, context);
    each(obj, function (value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };
  var reduceError = 'Reduce of empty array with no initial value';
  _.reduce = _.foldl = _.inject = function (obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null)
      obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context)
        iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function (value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial)
      throw new TypeError(reduceError);
    return memo;
  };
  _.reduceRight = _.foldr = function (obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null)
      obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context)
        iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function (value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial)
      throw new TypeError(reduceError);
    return memo;
  };
  _.find = _.detect = function (obj, predicate, context) {
    var result;
    any(obj, function (value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };
  _.filter = _.select = function (obj, predicate, context) {
    var results = [];
    if (obj == null)
      return results;
    if (nativeFilter && obj.filter === nativeFilter)
      return obj.filter(predicate, context);
    each(obj, function (value, index, list) {
      if (predicate.call(context, value, index, list))
        results.push(value);
    });
    return results;
  };
  _.reject = function (obj, predicate, context) {
    return _.filter(obj, function (value, index, list) {
      return !predicate.call(context, value, index, list);
    }, context);
  };
  _.every = _.all = function (obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = true;
    if (obj == null)
      return result;
    if (nativeEvery && obj.every === nativeEvery)
      return obj.every(predicate, context);
    each(obj, function (value, index, list) {
      if (!(result = result && predicate.call(context, value, index, list)))
        return breaker;
    });
    return !!result;
  };
  var any = _.some = _.any = function (obj, predicate, context) {
      predicate || (predicate = _.identity);
      var result = false;
      if (obj == null)
        return result;
      if (nativeSome && obj.some === nativeSome)
        return obj.some(predicate, context);
      each(obj, function (value, index, list) {
        if (result || (result = predicate.call(context, value, index, list)))
          return breaker;
      });
      return !!result;
    };
  _.contains = _.include = function (obj, target) {
    if (obj == null)
      return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf)
      return obj.indexOf(target) != -1;
    return any(obj, function (value) {
      return value === target;
    });
  };
  _.invoke = function (obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function (value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };
  _.pluck = function (obj, key) {
    return _.map(obj, _.property(key));
  };
  _.where = function (obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };
  _.findWhere = function (obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };
  _.max = function (obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    var result = -Infinity, lastComputed = -Infinity;
    each(obj, function (value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed > lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };
  _.min = function (obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    var result = Infinity, lastComputed = Infinity;
    each(obj, function (value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed < lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };
  _.shuffle = function (obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function (value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };
  _.sample = function (obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length)
        obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };
  var lookupIterator = function (value) {
    if (value == null)
      return _.identity;
    if (_.isFunction(value))
      return value;
    return _.property(value);
  };
  _.sortBy = function (obj, iterator, context) {
    iterator = lookupIterator(iterator);
    return _.pluck(_.map(obj, function (value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function (left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0)
          return 1;
        if (a < b || b === void 0)
          return -1;
      }
      return left.index - right.index;
    }), 'value');
  };
  var group = function (behavior) {
    return function (obj, iterator, context) {
      var result = {};
      iterator = lookupIterator(iterator);
      each(obj, function (value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };
  _.groupBy = group(function (result, key, value) {
    _.has(result, key) ? result[key].push(value) : result[key] = [value];
  });
  _.indexBy = group(function (result, key, value) {
    result[key] = value;
  });
  _.countBy = group(function (result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });
  _.sortedIndex = function (array, obj, iterator, context) {
    iterator = lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = low + high >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };
  _.toArray = function (obj) {
    if (!obj)
      return [];
    if (_.isArray(obj))
      return slice.call(obj);
    if (obj.length === +obj.length)
      return _.map(obj, _.identity);
    return _.values(obj);
  };
  _.size = function (obj) {
    if (obj == null)
      return 0;
    return obj.length === +obj.length ? obj.length : _.keys(obj).length;
  };
  _.first = _.head = _.take = function (array, n, guard) {
    if (array == null)
      return void 0;
    if (n == null || guard)
      return array[0];
    if (n < 0)
      return [];
    return slice.call(array, 0, n);
  };
  _.initial = function (array, n, guard) {
    return slice.call(array, 0, array.length - (n == null || guard ? 1 : n));
  };
  _.last = function (array, n, guard) {
    if (array == null)
      return void 0;
    if (n == null || guard)
      return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };
  _.rest = _.tail = _.drop = function (array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };
  _.compact = function (array) {
    return _.filter(array, _.identity);
  };
  var flatten = function (input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function (value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };
  _.flatten = function (array, shallow) {
    return flatten(array, shallow, []);
  };
  _.without = function (array) {
    return _.difference(array, slice.call(arguments, 1));
  };
  _.partition = function (array, predicate, context) {
    predicate = lookupIterator(predicate);
    var pass = [], fail = [];
    each(array, function (elem) {
      (predicate.call(context, elem) ? pass : fail).push(elem);
    });
    return [
      pass,
      fail
    ];
  };
  _.uniq = _.unique = function (array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function (value, index) {
      if (isSorted ? !index || seen[seen.length - 1] !== value : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };
  _.union = function () {
    return _.uniq(_.flatten(arguments, true));
  };
  _.intersection = function (array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function (item) {
      return _.every(rest, function (other) {
        return _.contains(other, item);
      });
    });
  };
  _.difference = function (array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function (value) {
      return !_.contains(rest, value);
    });
  };
  _.zip = function () {
    var length = _.max(_.pluck(arguments, 'length').concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };
  _.object = function (list, values) {
    if (list == null)
      return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };
  _.indexOf = function (array, item, isSorted) {
    if (array == null)
      return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf)
      return array.indexOf(item, isSorted);
    for (; i < length; i++)
      if (array[i] === item)
        return i;
    return -1;
  };
  _.lastIndexOf = function (array, item, from) {
    if (array == null)
      return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = hasIndex ? from : array.length;
    while (i--)
      if (array[i] === item)
        return i;
    return -1;
  };
  _.range = function (start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;
    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);
    while (idx < length) {
      range[idx++] = start;
      start += step;
    }
    return range;
  };
  var ctor = function () {
  };
  _.bind = function (func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind)
      return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func))
      throw new TypeError();
    args = slice.call(arguments, 2);
    return bound = function () {
      if (!(this instanceof bound))
        return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor();
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result)
        return result;
      return self;
    };
  };
  _.partial = function (func) {
    var boundArgs = slice.call(arguments, 1);
    return function () {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _)
          args[i] = arguments[position++];
      }
      while (position < arguments.length)
        args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };
  _.bindAll = function (obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0)
      throw new Error('bindAll must be passed function names');
    each(funcs, function (f) {
      obj[f] = _.bind(obj[f], obj);
    });
    return obj;
  };
  _.memoize = function (func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function () {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : memo[key] = func.apply(this, arguments);
    };
  };
  _.delay = function (func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function () {
      return func.apply(null, args);
    }, wait);
  };
  _.defer = function (func) {
    return _.delay.apply(_, [
      func,
      1
    ].concat(slice.call(arguments, 1)));
  };
  _.throttle = function (func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function () {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function () {
      var now = _.now();
      if (!previous && options.leading === false)
        previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };
  _.debounce = function (func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    var later = function () {
      var last = _.now() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };
    return function () {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }
      return result;
    };
  };
  _.once = function (func) {
    var ran = false, memo;
    return function () {
      if (ran)
        return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };
  _.wrap = function (func, wrapper) {
    return _.partial(wrapper, func);
  };
  _.compose = function () {
    var funcs = arguments;
    return function () {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };
  _.after = function (times, func) {
    return function () {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };
  _.keys = function (obj) {
    if (!_.isObject(obj))
      return [];
    if (nativeKeys)
      return nativeKeys(obj);
    var keys = [];
    for (var key in obj)
      if (_.has(obj, key))
        keys.push(key);
    return keys;
  };
  _.values = function (obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };
  _.pairs = function (obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [
        keys[i],
        obj[keys[i]]
      ];
    }
    return pairs;
  };
  _.invert = function (obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };
  _.functions = _.methods = function (obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key]))
        names.push(key);
    }
    return names.sort();
  };
  _.extend = function (obj) {
    each(slice.call(arguments, 1), function (source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };
  _.pick = function (obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function (key) {
      if (key in obj)
        copy[key] = obj[key];
    });
    return copy;
  };
  _.omit = function (obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key))
        copy[key] = obj[key];
    }
    return copy;
  };
  _.defaults = function (obj) {
    each(slice.call(arguments, 1), function (source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0)
            obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };
  _.clone = function (obj) {
    if (!_.isObject(obj))
      return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };
  _.tap = function (obj, interceptor) {
    interceptor(obj);
    return obj;
  };
  var eq = function (a, b, aStack, bStack) {
    if (a === b)
      return a !== 0 || 1 / a == 1 / b;
    if (a == null || b == null)
      return a === b;
    if (a instanceof _)
      a = a._wrapped;
    if (b instanceof _)
      b = b._wrapped;
    var className = toString.call(a);
    if (className != toString.call(b))
      return false;
    switch (className) {
    case '[object String]':
      return a == String(b);
    case '[object Number]':
      return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;
    case '[object Date]':
    case '[object Boolean]':
      return +a == +b;
    case '[object RegExp]':
      return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object')
      return false;
    var length = aStack.length;
    while (length--) {
      if (aStack[length] == a)
        return bStack[length] == b;
    }
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    if (className == '[object Array]') {
      size = a.length;
      result = size == b.length;
      if (result) {
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack)))
            break;
        }
      }
    } else {
      for (var key in a) {
        if (_.has(a, key)) {
          size++;
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack)))
            break;
        }
      }
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !size--)
            break;
        }
        result = !size;
      }
    }
    aStack.pop();
    bStack.pop();
    return result;
  };
  _.isEqual = function (a, b) {
    return eq(a, b, [], []);
  };
  _.isEmpty = function (obj) {
    if (obj == null)
      return true;
    if (_.isArray(obj) || _.isString(obj))
      return obj.length === 0;
    for (var key in obj)
      if (_.has(obj, key))
        return false;
    return true;
  };
  _.isElement = function (obj) {
    return !!(obj && obj.nodeType === 1);
  };
  _.isArray = nativeIsArray || function (obj) {
    return toString.call(obj) == '[object Array]';
  };
  _.isObject = function (obj) {
    return obj === Object(obj);
  };
  each([
    'Arguments',
    'Function',
    'String',
    'Number',
    'Date',
    'RegExp'
  ], function (name) {
    _['is' + name] = function (obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });
  if (!_.isArguments(arguments)) {
    _.isArguments = function (obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }
  if (typeof /./ !== 'function') {
    _.isFunction = function (obj) {
      return typeof obj === 'function';
    };
  }
  _.isFinite = function (obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };
  _.isNaN = function (obj) {
    return _.isNumber(obj) && obj != +obj;
  };
  _.isBoolean = function (obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };
  _.isNull = function (obj) {
    return obj === null;
  };
  _.isUndefined = function (obj) {
    return obj === void 0;
  };
  _.has = function (obj, key) {
    return hasOwnProperty.call(obj, key);
  };
  _.noConflict = function () {
    root._ = previousUnderscore;
    return this;
  };
  _.identity = function (value) {
    return value;
  };
  _.constant = function (value) {
    return function () {
      return value;
    };
  };
  _.property = function (key) {
    return function (obj) {
      return obj[key];
    };
  };
  _.matches = function (attrs) {
    return function (obj) {
      if (obj === attrs)
        return true;
      for (var key in attrs) {
        if (attrs[key] !== obj[key])
          return false;
      }
      return true;
    };
  };
  _.times = function (n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++)
      accum[i] = iterator.call(context, i);
    return accum;
  };
  _.random = function (min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };
  _.now = Date.now || function () {
    return new Date().getTime();
  };
  var entityMap = {
      escape: {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#x27;'
      }
    };
  entityMap.unescape = _.invert(entityMap.escape);
  var entityRegexes = {
      escape: new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
      unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
    };
  _.each([
    'escape',
    'unescape'
  ], function (method) {
    _[method] = function (string) {
      if (string == null)
        return '';
      return ('' + string).replace(entityRegexes[method], function (match) {
        return entityMap[method][match];
      });
    };
  });
  _.result = function (object, property) {
    if (object == null)
      return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };
  _.mixin = function (obj) {
    each(_.functions(obj), function (name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function () {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };
  var idCounter = 0;
  _.uniqueId = function (prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };
  var noMatch = /(.)^/;
  var escapes = {
      '\'': '\'',
      '\\': '\\',
      '\r': 'r',
      '\n': 'n',
      '\t': 't',
      '\u2028': 'u2028',
      '\u2029': 'u2029'
    };
  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
  _.template = function (text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);
    var matcher = new RegExp([
        (settings.escape || noMatch).source,
        (settings.interpolate || noMatch).source,
        (settings.evaluate || noMatch).source
      ].join('|') + '|$', 'g');
    var index = 0;
    var source = '__p+=\'';
    text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, function (match) {
        return '\\' + escapes[match];
      });
      if (escape) {
        source += '\'+\n((__t=(' + escape + '))==null?\'\':_.escape(__t))+\n\'';
      }
      if (interpolate) {
        source += '\'+\n((__t=(' + interpolate + '))==null?\'\':__t)+\n\'';
      }
      if (evaluate) {
        source += '\';\n' + evaluate + '\n__p+=\'';
      }
      index = offset + match.length;
      return match;
    });
    source += '\';\n';
    if (!settings.variable)
      source = 'with(obj||{}){\n' + source + '}\n';
    source = 'var __t,__p=\'\',__j=Array.prototype.join,' + 'print=function(){__p+=__j.call(arguments,\'\');};\n' + source + 'return __p;\n';
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }
    if (data)
      return render(data, _);
    var template = function (data) {
      return render.call(this, data, _);
    };
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';
    return template;
  };
  _.chain = function (obj) {
    return _(obj).chain();
  };
  var result = function (obj) {
    return this._chain ? _(obj).chain() : obj;
  };
  _.mixin(_);
  each([
    'pop',
    'push',
    'reverse',
    'shift',
    'sort',
    'splice',
    'unshift'
  ], function (name) {
    var method = ArrayProto[name];
    _.prototype[name] = function () {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0)
        delete obj[0];
      return result.call(this, obj);
    };
  });
  each([
    'concat',
    'join',
    'slice'
  ], function (name) {
    var method = ArrayProto[name];
    _.prototype[name] = function () {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });
  _.extend(_.prototype, {
    chain: function () {
      this._chain = true;
      return this;
    },
    value: function () {
      return this._wrapped;
    }
  });
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function () {
      return _;
    });
  }
}.call(this));
+function ($) {
  'use strict';
  var Tooltip = function (element, options) {
    this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null;
    this.init('tooltip', element, options);
  };
  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  };
  Tooltip.prototype.init = function (type, element, options) {
    this.enabled = true;
    this.type = type;
    this.$element = $(element);
    this.options = this.getOptions(options);
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport);
    var triggers = this.options.trigger.split(' ');
    for (var i = triggers.length; i--;) {
      var trigger = triggers[i];
      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this));
      } else if (trigger != 'manual') {
        var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin';
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';
        this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this));
      }
    }
    this.options.selector ? this._options = $.extend({}, this.options, {
      trigger: 'manual',
      selector: ''
    }) : this.fixTitle();
  };
  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS;
  };
  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options);
    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      };
    }
    return options;
  };
  Tooltip.prototype.getDelegateOptions = function () {
    var options = {};
    var defaults = this.getDefaults();
    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value)
        options[key] = value;
    });
    return options;
  };
  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type);
    clearTimeout(self.timeout);
    self.hoverState = 'in';
    if (!self.options.delay || !self.options.delay.show)
      return self.show();
    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in')
        self.show();
    }, self.options.delay.show);
  };
  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type);
    clearTimeout(self.timeout);
    self.hoverState = 'out';
    if (!self.options.delay || !self.options.delay.hide)
      return self.hide();
    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out')
        self.hide();
    }, self.options.delay.hide);
  };
  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type);
    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e);
      if (e.isDefaultPrevented())
        return;
      var that = this;
      var $tip = this.tip();
      this.setContent();
      if (this.options.animation)
        $tip.addClass('fade');
      var placement = typeof this.options.placement == 'function' ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement;
      var autoToken = /\s?auto?\s?/i;
      var autoPlace = autoToken.test(placement);
      if (autoPlace)
        placement = placement.replace(autoToken, '') || 'top';
      $tip.detach().css({
        top: 0,
        left: 0,
        display: 'block'
      }).addClass(placement);
      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);
      var pos = this.getPosition();
      var actualWidth = $tip[0].offsetWidth;
      var actualHeight = $tip[0].offsetHeight;
      if (autoPlace) {
        var orgPlacement = placement;
        var $parent = this.$element.parent();
        var parentDim = this.getPosition($parent);
        placement = placement == 'bottom' && pos.top + pos.height + actualHeight - parentDim.scroll > parentDim.height ? 'top' : placement == 'top' && pos.top - parentDim.scroll - actualHeight < 0 ? 'bottom' : placement == 'right' && pos.right + actualWidth > parentDim.width ? 'left' : placement == 'left' && pos.left - actualWidth < parentDim.left ? 'right' : placement;
        $tip.removeClass(orgPlacement).addClass(placement);
      }
      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);
      this.applyPlacement(calculatedOffset, placement);
      this.hoverState = null;
      var complete = function () {
        that.$element.trigger('shown.bs.' + that.type);
      };
      $.support.transition && this.$tip.hasClass('fade') ? $tip.one($.support.transition.end, complete).emulateTransitionEnd(150) : complete();
    }
  };
  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var replace;
    var $tip = this.tip();
    var width = $tip[0].offsetWidth;
    var height = $tip[0].offsetHeight;
    var marginTop = parseInt($tip.css('margin-top'), 10);
    var marginLeft = parseInt($tip.css('margin-left'), 10);
    if (isNaN(marginTop))
      marginTop = 0;
    if (isNaN(marginLeft))
      marginLeft = 0;
    offset.top = offset.top + marginTop;
    offset.left = offset.left + marginLeft;
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        });
      }
    }, offset), 0);
    $tip.addClass('in');
    var actualWidth = $tip[0].offsetWidth;
    var actualHeight = $tip[0].offsetHeight;
    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight;
    }
    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);
    if (delta.left)
      offset.left += delta.left;
    else
      offset.top += delta.top;
    var arrowDelta = delta.left ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
    var arrowPosition = delta.left ? 'left' : 'top';
    var arrowOffsetPosition = delta.left ? 'offsetWidth' : 'offsetHeight';
    $tip.offset(offset);
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], arrowPosition);
  };
  Tooltip.prototype.replaceArrow = function (delta, dimension, position) {
    this.arrow().css(position, delta ? 50 * (1 - delta / dimension) + '%' : '');
  };
  Tooltip.prototype.setContent = function () {
    var $tip = this.tip();
    var title = this.getTitle();
    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
    $tip.removeClass('fade in top bottom left right');
  };
  Tooltip.prototype.hide = function () {
    var that = this;
    var $tip = this.tip();
    var e = $.Event('hide.bs.' + this.type);
    function complete() {
      if (that.hoverState != 'in')
        $tip.detach();
      that.$element.trigger('hidden.bs.' + that.type);
    }
    this.$element.trigger(e);
    if (e.isDefaultPrevented())
      return;
    $tip.removeClass('in');
    $.support.transition && this.$tip.hasClass('fade') ? $tip.one($.support.transition.end, complete).emulateTransitionEnd(150) : complete();
    this.hoverState = null;
    return this;
  };
  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element;
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '');
    }
  };
  Tooltip.prototype.hasContent = function () {
    return this.getTitle();
  };
  Tooltip.prototype.getPosition = function ($element) {
    $element = $element || this.$element;
    var el = $element[0];
    var isBody = el.tagName == 'BODY';
    return $.extend({}, typeof el.getBoundingClientRect == 'function' ? el.getBoundingClientRect() : null, {
      scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop(),
      width: isBody ? $(window).width() : $element.outerWidth(),
      height: isBody ? $(window).height() : $element.outerHeight()
    }, isBody ? {
      top: 0,
      left: 0
    } : $element.offset());
  };
  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? {
      top: pos.top + pos.height,
      left: pos.left + pos.width / 2 - actualWidth / 2
    } : placement == 'top' ? {
      top: pos.top - actualHeight,
      left: pos.left + pos.width / 2 - actualWidth / 2
    } : placement == 'left' ? {
      top: pos.top + pos.height / 2 - actualHeight / 2,
      left: pos.left - actualWidth
    } : {
      top: pos.top + pos.height / 2 - actualHeight / 2,
      left: pos.left + pos.width
    };
  };
  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = {
        top: 0,
        left: 0
      };
    if (!this.$viewport)
      return delta;
    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
    var viewportDimensions = this.getPosition(this.$viewport);
    if (/right|left/.test(placement)) {
      var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
      if (topEdgeOffset < viewportDimensions.top) {
        delta.top = viewportDimensions.top - topEdgeOffset;
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) {
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
      }
    } else {
      var leftEdgeOffset = pos.left - viewportPadding;
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
      if (leftEdgeOffset < viewportDimensions.left) {
        delta.left = viewportDimensions.left - leftEdgeOffset;
      } else if (rightEdgeOffset > viewportDimensions.width) {
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
      }
    }
    return delta;
  };
  Tooltip.prototype.getTitle = function () {
    var title;
    var $e = this.$element;
    var o = this.options;
    title = $e.attr('data-original-title') || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title);
    return title;
  };
  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template);
  };
  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow');
  };
  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide();
      this.$element = null;
      this.options = null;
    }
  };
  Tooltip.prototype.enable = function () {
    this.enabled = true;
  };
  Tooltip.prototype.disable = function () {
    this.enabled = false;
  };
  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled;
  };
  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this;
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self);
  };
  Tooltip.prototype.destroy = function () {
    clearTimeout(this.timeout);
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type);
  };
  var old = $.fn.tooltip;
  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.tooltip');
      var options = typeof option == 'object' && option;
      if (!data && option == 'destroy')
        return;
      if (!data)
        $this.data('bs.tooltip', data = new Tooltip(this, options));
      if (typeof option == 'string')
        data[option]();
    });
  };
  $.fn.tooltip.Constructor = Tooltip;
  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old;
    return this;
  };
}(jQuery);
+function ($) {
  'use strict';
  var Popover = function (element, options) {
    this.init('popover', element, options);
  };
  if (!$.fn.tooltip)
    throw new Error('Popover requires tooltip.js');
  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  });
  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);
  Popover.prototype.constructor = Popover;
  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS;
  };
  Popover.prototype.setContent = function () {
    var $tip = this.tip();
    var title = this.getTitle();
    var content = this.getContent();
    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title);
    $tip.find('.popover-content').empty()[this.options.html ? typeof content == 'string' ? 'html' : 'append' : 'text'](content);
    $tip.removeClass('fade top bottom left right in');
    if (!$tip.find('.popover-title').html())
      $tip.find('.popover-title').hide();
  };
  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent();
  };
  Popover.prototype.getContent = function () {
    var $e = this.$element;
    var o = this.options;
    return $e.attr('data-content') || (typeof o.content == 'function' ? o.content.call($e[0]) : o.content);
  };
  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow');
  };
  Popover.prototype.tip = function () {
    if (!this.$tip)
      this.$tip = $(this.options.template);
    return this.$tip;
  };
  var old = $.fn.popover;
  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.popover');
      var options = typeof option == 'object' && option;
      if (!data && option == 'destroy')
        return;
      if (!data)
        $this.data('bs.popover', data = new Popover(this, options));
      if (typeof option == 'string')
        data[option]();
    });
  };
  $.fn.popover.Constructor = Popover;
  $.fn.popover.noConflict = function () {
    $.fn.popover = old;
    return this;
  };
}(jQuery);
+function ($) {
  'use strict';
  var Modal = function (element, options) {
    this.options = options;
    this.$body = $(document.body);
    this.$element = $(element);
    this.$backdrop = this.isShown = null;
    this.scrollbarWidth = 0;
    if (this.options.remote) {
      this.$element.find('.modal-content').load(this.options.remote, $.proxy(function () {
        this.$element.trigger('loaded.bs.modal');
      }, this));
    }
  };
  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  };
  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget);
  };
  Modal.prototype.show = function (_relatedTarget) {
    var that = this;
    var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget });
    this.$element.trigger(e);
    if (this.isShown || e.isDefaultPrevented())
      return;
    this.isShown = true;
    this.checkScrollbar();
    this.$body.addClass('modal-open');
    this.setScrollbar();
    this.escape();
    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));
    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade');
      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body);
      }
      that.$element.show().scrollTop(0);
      if (transition) {
        that.$element[0].offsetWidth;
      }
      that.$element.addClass('in').attr('aria-hidden', false);
      that.enforceFocus();
      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget });
      transition ? that.$element.find('.modal-dialog').one($.support.transition.end, function () {
        that.$element.trigger('focus').trigger(e);
      }).emulateTransitionEnd(300) : that.$element.trigger('focus').trigger(e);
    });
  };
  Modal.prototype.hide = function (e) {
    if (e)
      e.preventDefault();
    e = $.Event('hide.bs.modal');
    this.$element.trigger(e);
    if (!this.isShown || e.isDefaultPrevented())
      return;
    this.isShown = false;
    this.$body.removeClass('modal-open');
    this.resetScrollbar();
    this.escape();
    $(document).off('focusin.bs.modal');
    this.$element.removeClass('in').attr('aria-hidden', true).off('click.dismiss.bs.modal');
    $.support.transition && this.$element.hasClass('fade') ? this.$element.one($.support.transition.end, $.proxy(this.hideModal, this)).emulateTransitionEnd(300) : this.hideModal();
  };
  Modal.prototype.enforceFocus = function () {
    $(document).off('focusin.bs.modal').on('focusin.bs.modal', $.proxy(function (e) {
      if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
        this.$element.trigger('focus');
      }
    }, this));
  };
  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide();
      }, this));
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal');
    }
  };
  Modal.prototype.hideModal = function () {
    var that = this;
    this.$element.hide();
    this.backdrop(function () {
      that.removeBackdrop();
      that.$element.trigger('hidden.bs.modal');
    });
  };
  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove();
    this.$backdrop = null;
  };
  Modal.prototype.backdrop = function (callback) {
    var animate = this.$element.hasClass('fade') ? 'fade' : '';
    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate;
      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />').appendTo(this.$body);
      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget)
          return;
        this.options.backdrop == 'static' ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this);
      }, this));
      if (doAnimate)
        this.$backdrop[0].offsetWidth;
      this.$backdrop.addClass('in');
      if (!callback)
        return;
      doAnimate ? this.$backdrop.one($.support.transition.end, callback).emulateTransitionEnd(150) : callback();
    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in');
      $.support.transition && this.$element.hasClass('fade') ? this.$backdrop.one($.support.transition.end, callback).emulateTransitionEnd(150) : callback();
    } else if (callback) {
      callback();
    }
  };
  Modal.prototype.checkScrollbar = function () {
    if (document.body.clientWidth >= window.innerWidth)
      return;
    this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar();
  };
  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt(this.$body.css('padding-right') || 0);
    if (this.scrollbarWidth)
      this.$body.css('padding-right', bodyPad + this.scrollbarWidth);
  };
  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', '');
  };
  Modal.prototype.measureScrollbar = function () {
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'modal-scrollbar-measure';
    this.$body.append(scrollDiv);
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    this.$body[0].removeChild(scrollDiv);
    return scrollbarWidth;
  };
  var old = $.fn.modal;
  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.modal');
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option);
      if (!data)
        $this.data('bs.modal', data = new Modal(this, options));
      if (typeof option == 'string')
        data[option](_relatedTarget);
      else if (options.show)
        data.show(_relatedTarget);
    });
  };
  $.fn.modal.Constructor = Modal;
  $.fn.modal.noConflict = function () {
    $.fn.modal = old;
    return this;
  };
  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this);
    var href = $this.attr('href');
    var $target = $($this.attr('data-target') || href && href.replace(/.*(?=#[^\s]+$)/, ''));
    var option = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data());
    if ($this.is('a'))
      e.preventDefault();
    $target.modal(option, this).one('hide', function () {
      $this.is(':visible') && $this.trigger('focus');
    });
  });
}(jQuery);
!function ($) {
  var ParsleyUtils = {
      attr: function ($element, namespace, checkAttr) {
        var attribute, obj = {}, regex = new RegExp('^' + namespace, 'i');
        if ('undefined' === typeof $element || 'undefined' === typeof $element[0])
          return {};
        for (var i in $element[0].attributes) {
          attribute = $element[0].attributes[i];
          if ('undefined' !== typeof attribute && null !== attribute && attribute.specified && regex.test(attribute.name)) {
            if ('undefined' !== typeof checkAttr && new RegExp(checkAttr + '$', 'i').test(attribute.name))
              return true;
            obj[this.camelize(attribute.name.replace(namespace, ''))] = this.deserializeValue(attribute.value);
          }
        }
        return 'undefined' === typeof checkAttr ? obj : false;
      },
      setAttr: function ($element, namespace, attr, value) {
        $element[0].setAttribute(this.dasherize(namespace + attr), String(value));
      },
      get: function (obj, path) {
        var i = 0, paths = (path || '').split('.');
        while (this.isObject(obj) || this.isArray(obj)) {
          obj = obj[paths[i++]];
          if (i === paths.length)
            return obj;
        }
        return undefined;
      },
      hash: function (length) {
        return String(Math.random()).substring(2, length ? length + 2 : 9);
      },
      isArray: function (mixed) {
        return Object.prototype.toString.call(mixed) === '[object Array]';
      },
      isObject: function (mixed) {
        return mixed === Object(mixed);
      },
      deserializeValue: function (value) {
        var num;
        try {
          return value ? value == 'true' || (value == 'false' ? false : value == 'null' ? null : !isNaN(num = Number(value)) ? num : /^[\[\{]/.test(value) ? $.parseJSON(value) : value) : value;
        } catch (e) {
          return value;
        }
      },
      camelize: function (str) {
        return str.replace(/-+(.)?/g, function (match, chr) {
          return chr ? chr.toUpperCase() : '';
        });
      },
      dasherize: function (str) {
        return str.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/_/g, '-').toLowerCase();
      }
    };
  var ParsleyDefaults = {
      namespace: 'data-parsley-',
      inputs: 'input, textarea, select',
      excluded: 'input[type=button], input[type=submit], input[type=reset]',
      priorityEnabled: true,
      uiEnabled: true,
      validationThreshold: 3,
      focus: 'first',
      trigger: false,
      errorClass: 'parsley-error',
      successClass: 'parsley-success',
      classHandler: function (ParsleyField) {
      },
      errorsContainer: function (ParsleyField) {
      },
      errorsWrapper: '<ul class="parsley-errors-list"></ul>',
      errorTemplate: '<li></li>'
    };
  var ParsleyAbstract = function () {
  };
  ParsleyAbstract.prototype = {
    asyncSupport: false,
    actualizeOptions: function () {
      this.options = this.parsleyInstance.OptionsFactory.get(this);
      return this;
    },
    validateThroughValidator: function (value, constraints, priority) {
      return window.ParsleyValidator.validate.apply(window.ParsleyValidator, [
        value,
        constraints,
        priority
      ]);
    },
    subscribe: function (name, fn) {
      $.listenTo(this, name.toLowerCase(), fn);
      return this;
    },
    unsubscribe: function (name) {
      $.unsubscribeTo(this, name.toLowerCase());
      return this;
    },
    reset: function () {
      if ('ParsleyForm' !== this.__class__)
        return $.emit('parsley:field:reset', this);
      for (var i = 0; i < this.fields.length; i++)
        $.emit('parsley:field:reset', this.fields[i]);
      $.emit('parsley:form:reset', this);
    },
    destroy: function () {
      if ('ParsleyForm' !== this.__class__) {
        $.emit('parsley:field:destroy', this);
        this.$element.removeData('Parsley');
        return;
      }
      for (var i = 0; i < this.fields.length; i++)
        this.fields[i].destroy();
      $.emit('parsley:form:destroy', this);
      this.$element.removeData('Parsley');
    }
  };
  (function (exports) {
    var Validator = function (options) {
      this.__class__ = 'Validator';
      this.__version__ = '0.5.8';
      this.options = options || {};
      this.bindingKey = this.options.bindingKey || '_validatorjsConstraint';
      return this;
    };
    Validator.prototype = {
      constructor: Validator,
      validate: function (objectOrString, AssertsOrConstraintOrGroup, group) {
        if ('string' !== typeof objectOrString && 'object' !== typeof objectOrString)
          throw new Error('You must validate an object or a string');
        if ('string' === typeof objectOrString || _isArray(objectOrString))
          return this._validateString(objectOrString, AssertsOrConstraintOrGroup, group);
        if (this.isBinded(objectOrString))
          return this._validateBindedObject(objectOrString, AssertsOrConstraintOrGroup);
        return this._validateObject(objectOrString, AssertsOrConstraintOrGroup, group);
      },
      bind: function (object, constraint) {
        if ('object' !== typeof object)
          throw new Error('Must bind a Constraint to an object');
        object[this.bindingKey] = new Constraint(constraint);
        return this;
      },
      unbind: function (object) {
        if ('undefined' === typeof object._validatorjsConstraint)
          return this;
        delete object[this.bindingKey];
        return this;
      },
      isBinded: function (object) {
        return 'undefined' !== typeof object[this.bindingKey];
      },
      getBinded: function (object) {
        return this.isBinded(object) ? object[this.bindingKey] : null;
      },
      _validateString: function (string, assert, group) {
        var result, failures = [];
        if (!_isArray(assert))
          assert = [assert];
        for (var i = 0; i < assert.length; i++) {
          if (!(assert[i] instanceof Assert))
            throw new Error('You must give an Assert or an Asserts array to validate a string');
          result = assert[i].check(string, group);
          if (result instanceof Violation)
            failures.push(result);
        }
        return failures.length ? failures : true;
      },
      _validateObject: function (object, constraint, group) {
        if ('object' !== typeof constraint)
          throw new Error('You must give a constraint to validate an object');
        if (constraint instanceof Constraint)
          return constraint.check(object, group);
        return new Constraint(constraint).check(object, group);
      },
      _validateBindedObject: function (object, group) {
        return object[this.bindingKey].check(object, group);
      }
    };
    Validator.errorCode = {
      must_be_a_string: 'must_be_a_string',
      must_be_an_array: 'must_be_an_array',
      must_be_a_number: 'must_be_a_number',
      must_be_a_string_or_array: 'must_be_a_string_or_array'
    };
    var Constraint = function (data, options) {
      this.__class__ = 'Constraint';
      this.options = options || {};
      this.nodes = {};
      if (data) {
        try {
          this._bootstrap(data);
        } catch (err) {
          throw new Error('Should give a valid mapping object to Constraint', err, data);
        }
      }
      return this;
    };
    Constraint.prototype = {
      constructor: Constraint,
      check: function (object, group) {
        var result, failures = {};
        for (var property in this.options.strict ? this.nodes : object) {
          if (this.options.strict ? this.has(property, object) : this.has(property)) {
            result = this._check(property, object[property], group);
            if (_isArray(result) && result.length > 0 || !_isArray(result) && !_isEmptyObject(result))
              failures[property] = result;
          } else if (this.options.strict) {
            try {
              new Assert().HaveProperty(property).validate(object);
            } catch (violation) {
              failures[property] = violation;
            }
          }
        }
        return _isEmptyObject(failures) ? true : failures;
      },
      add: function (node, object) {
        if (object instanceof Assert || _isArray(object) && object[0] instanceof Assert) {
          this.nodes[node] = object;
          return this;
        }
        if ('object' === typeof object && !_isArray(object)) {
          this.nodes[node] = object instanceof Constraint ? object : new Constraint(object);
          return this;
        }
        throw new Error('Should give an Assert, an Asserts array, a Constraint', object);
      },
      has: function (node, nodes) {
        nodes = 'undefined' !== typeof nodes ? nodes : this.nodes;
        return 'undefined' !== typeof nodes[node];
      },
      get: function (node, placeholder) {
        return this.has(node) ? this.nodes[node] : placeholder || null;
      },
      remove: function (node) {
        var _nodes = [];
        for (var i in this.nodes)
          if (i !== node)
            _nodes[i] = this.nodes[i];
        this.nodes = _nodes;
        return this;
      },
      _bootstrap: function (data) {
        if (data instanceof Constraint)
          return this.nodes = data.nodes;
        for (var node in data)
          this.add(node, data[node]);
      },
      _check: function (node, value, group) {
        if (this.nodes[node] instanceof Assert)
          return this._checkAsserts(value, [this.nodes[node]], group);
        if (_isArray(this.nodes[node]))
          return this._checkAsserts(value, this.nodes[node], group);
        if (this.nodes[node] instanceof Constraint)
          return this.nodes[node].check(value, group);
        throw new Error('Invalid node', this.nodes[node]);
      },
      _checkAsserts: function (value, asserts, group) {
        var result, failures = [];
        for (var i = 0; i < asserts.length; i++) {
          result = asserts[i].check(value, group);
          if ('undefined' !== typeof result && true !== result)
            failures.push(result);
        }
        return failures;
      }
    };
    var Violation = function (assert, value, violation) {
      this.__class__ = 'Violation';
      if (!(assert instanceof Assert))
        throw new Error('Should give an assertion implementing the Assert interface');
      this.assert = assert;
      this.value = value;
      if ('undefined' !== typeof violation)
        this.violation = violation;
    };
    Violation.prototype = {
      show: function () {
        var show = {
            assert: this.assert.__class__,
            value: this.value
          };
        if (this.violation)
          show.violation = this.violation;
        return show;
      },
      __toString: function () {
        if ('undefined' !== typeof this.violation)
          this.violation = '", ' + this.getViolation().constraint + ' expected was ' + this.getViolation().expected;
        return this.assert.__class__ + ' assert failed for "' + this.value + this.violation || '';
      },
      getViolation: function () {
        var constraint, expected;
        for (constraint in this.violation)
          expected = this.violation[constraint];
        return {
          constraint: constraint,
          expected: expected
        };
      }
    };
    var Assert = function (group) {
      this.__class__ = 'Assert';
      this.__parentClass__ = this.__class__;
      this.groups = [];
      if ('undefined' !== typeof group)
        this.addGroup(group);
      return this;
    };
    Assert.prototype = {
      construct: Assert,
      check: function (value, group) {
        if (group && !this.hasGroup(group))
          return;
        if (!group && this.hasGroups())
          return;
        try {
          return this.validate(value, group);
        } catch (violation) {
          return violation;
        }
      },
      hasGroup: function (group) {
        if (_isArray(group))
          return this.hasOneOf(group);
        if ('Any' === group)
          return true;
        if (!this.hasGroups())
          return 'Default' === group;
        return -1 !== this.groups.indexOf(group);
      },
      hasOneOf: function (groups) {
        for (var i = 0; i < groups.length; i++)
          if (this.hasGroup(groups[i]))
            return true;
        return false;
      },
      hasGroups: function () {
        return this.groups.length > 0;
      },
      addGroup: function (group) {
        if (_isArray(group))
          return this.addGroups(group);
        if (!this.hasGroup(group))
          this.groups.push(group);
        return this;
      },
      removeGroup: function (group) {
        var _groups = [];
        for (var i = 0; i < this.groups.length; i++)
          if (group !== this.groups[i])
            _groups.push(this.groups[i]);
        this.groups = _groups;
        return this;
      },
      addGroups: function (groups) {
        for (var i = 0; i < groups.length; i++)
          this.addGroup(groups[i]);
        return this;
      },
      HaveProperty: function (node) {
        this.__class__ = 'HaveProperty';
        this.node = node;
        this.validate = function (object) {
          if ('undefined' === typeof object[this.node])
            throw new Violation(this, object, { value: this.node });
          return true;
        };
        return this;
      },
      Blank: function () {
        this.__class__ = 'Blank';
        this.validate = function (value) {
          if ('string' !== typeof value)
            throw new Violation(this, value, { value: Validator.errorCode.must_be_a_string });
          if ('' !== value.replace(/^\s+/g, '').replace(/\s+$/g, ''))
            throw new Violation(this, value);
          return true;
        };
        return this;
      },
      Callback: function (fn) {
        this.__class__ = 'Callback';
        this.arguments = Array.prototype.slice.call(arguments);
        if (1 === this.arguments.length)
          this.arguments = [];
        else
          this.arguments.splice(0, 1);
        if ('function' !== typeof fn)
          throw new Error('Callback must be instanciated with a function');
        this.fn = fn;
        this.validate = function (value) {
          var result = this.fn.apply(this, [value].concat(this.arguments));
          if (true !== result)
            throw new Violation(this, value, { result: result });
          return true;
        };
        return this;
      },
      Choice: function (list) {
        this.__class__ = 'Choice';
        if (!_isArray(list) && 'function' !== typeof list)
          throw new Error('Choice must be instanciated with an array or a function');
        this.list = list;
        this.validate = function (value) {
          var list = 'function' === typeof this.list ? this.list() : this.list;
          for (var i = 0; i < list.length; i++)
            if (value === list[i])
              return true;
          throw new Violation(this, value, { choices: list });
        };
        return this;
      },
      Collection: function (constraint) {
        this.__class__ = 'Collection';
        this.constraint = 'undefined' !== typeof constraint ? new Constraint(constraint) : false;
        this.validate = function (collection, group) {
          var result, validator = new Validator(), count = 0, failures = {}, groups = this.groups.length ? this.groups : group;
          if (!_isArray(collection))
            throw new Violation(this, array, { value: Validator.errorCode.must_be_an_array });
          for (var i = 0; i < collection.length; i++) {
            result = this.constraint ? validator.validate(collection[i], this.constraint, groups) : validator.validate(collection[i], groups);
            if (!_isEmptyObject(result))
              failures[count] = result;
            count++;
          }
          return !_isEmptyObject(failures) ? failures : true;
        };
        return this;
      },
      Count: function (count) {
        this.__class__ = 'Count';
        this.count = count;
        this.validate = function (array) {
          if (!_isArray(array))
            throw new Violation(this, array, { value: Validator.errorCode.must_be_an_array });
          var count = 'function' === typeof this.count ? this.count(array) : this.count;
          if (isNaN(Number(count)))
            throw new Error('Count must be a valid interger', count);
          if (count !== array.length)
            throw new Violation(this, array, { count: count });
          return true;
        };
        return this;
      },
      Email: function () {
        this.__class__ = 'Email';
        this.validate = function (value) {
          var regExp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
          if ('string' !== typeof value)
            throw new Violation(this, value, { value: Validator.errorCode.must_be_a_string });
          if (!regExp.test(value))
            throw new Violation(this, value);
          return true;
        };
        return this;
      },
      Eql: function (eql) {
        this.__class__ = 'Eql';
        if ('undefined' === typeof eql)
          throw new Error('Equal must be instanciated with an Array or an Object');
        this.eql = eql;
        this.validate = function (value) {
          var eql = 'function' === typeof this.eql ? this.eql(value) : this.eql;
          if (!expect.eql(eql, value))
            throw new Violation(this, value, { eql: eql });
          return true;
        };
        return this;
      },
      EqualTo: function (reference) {
        this.__class__ = 'EqualTo';
        if ('undefined' === typeof reference)
          throw new Error('EqualTo must be instanciated with a value or a function');
        this.reference = reference;
        this.validate = function (value) {
          var reference = 'function' === typeof this.reference ? this.reference(value) : this.reference;
          if (reference !== value)
            throw new Violation(this, value, { value: reference });
          return true;
        };
        return this;
      },
      GreaterThan: function (threshold) {
        this.__class__ = 'GreaterThan';
        if ('undefined' === typeof threshold)
          throw new Error('Should give a threshold value');
        this.threshold = threshold;
        this.validate = function (value) {
          if ('' === value || isNaN(Number(value)))
            throw new Violation(this, value, { value: Validator.errorCode.must_be_a_number });
          if (this.threshold >= value)
            throw new Violation(this, value, { threshold: this.threshold });
          return true;
        };
        return this;
      },
      GreaterThanOrEqual: function (threshold) {
        this.__class__ = 'GreaterThanOrEqual';
        if ('undefined' === typeof threshold)
          throw new Error('Should give a threshold value');
        this.threshold = threshold;
        this.validate = function (value) {
          if ('' === value || isNaN(Number(value)))
            throw new Violation(this, value, { value: Validator.errorCode.must_be_a_number });
          if (this.threshold > value)
            throw new Violation(this, value, { threshold: this.threshold });
          return true;
        };
        return this;
      },
      InstanceOf: function (classRef) {
        this.__class__ = 'InstanceOf';
        if ('undefined' === typeof classRef)
          throw new Error('InstanceOf must be instanciated with a value');
        this.classRef = classRef;
        this.validate = function (value) {
          if (true !== value instanceof this.classRef)
            throw new Violation(this, value, { classRef: this.classRef });
          return true;
        };
        return this;
      },
      IPv4: function () {
        this.__class__ = 'IPv4';
        this.validate = function (value) {
          var regExp = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
          if ('string' !== typeof value)
            throw new Violation(this, value, { value: Validator.errorCode.must_be_a_string });
          if (!regExp.test(value))
            throw new Violation(this, value);
          return true;
        };
        return this;
      },
      Length: function (boundaries) {
        this.__class__ = 'Length';
        if (!boundaries.min && !boundaries.max)
          throw new Error('Lenth assert must be instanciated with a { min: x, max: y } object');
        this.min = boundaries.min;
        this.max = boundaries.max;
        this.validate = function (value) {
          if ('string' !== typeof value && !_isArray(value))
            throw new Violation(this, value, { value: Validator.errorCode.must_be_a_string_or_array });
          if ('undefined' !== typeof this.min && this.min === this.max && value.length !== this.min)
            throw new Violation(this, value, {
              min: this.min,
              max: this.max
            });
          if ('undefined' !== typeof this.max && value.length > this.max)
            throw new Violation(this, value, { max: this.max });
          if ('undefined' !== typeof this.min && value.length < this.min)
            throw new Violation(this, value, { min: this.min });
          return true;
        };
        return this;
      },
      LessThan: function (threshold) {
        this.__class__ = 'LessThan';
        if ('undefined' === typeof threshold)
          throw new Error('Should give a threshold value');
        this.threshold = threshold;
        this.validate = function (value) {
          if ('' === value || isNaN(Number(value)))
            throw new Violation(this, value, { value: Validator.errorCode.must_be_a_number });
          if (this.threshold <= value)
            throw new Violation(this, value, { threshold: this.threshold });
          return true;
        };
        return this;
      },
      LessThanOrEqual: function (threshold) {
        this.__class__ = 'LessThanOrEqual';
        if ('undefined' === typeof threshold)
          throw new Error('Should give a threshold value');
        this.threshold = threshold;
        this.validate = function (value) {
          if ('' === value || isNaN(Number(value)))
            throw new Violation(this, value, { value: Validator.errorCode.must_be_a_number });
          if (this.threshold < value)
            throw new Violation(this, value, { threshold: this.threshold });
          return true;
        };
        return this;
      },
      Mac: function () {
        this.__class__ = 'Mac';
        this.validate = function (value) {
          var regExp = /^(?:[0-9A-F]{2}:){5}[0-9A-F]{2}$/i;
          if ('string' !== typeof value)
            throw new Violation(this, value, { value: Validator.errorCode.must_be_a_string });
          if (!regExp.test(value))
            throw new Violation(this, value);
          return true;
        };
        return this;
      },
      NotNull: function () {
        this.__class__ = 'NotNull';
        this.validate = function (value) {
          if (null === value || 'undefined' === typeof value)
            throw new Violation(this, value);
          return true;
        };
        return this;
      },
      NotBlank: function () {
        this.__class__ = 'NotBlank';
        this.validate = function (value) {
          if ('string' !== typeof value)
            throw new Violation(this, value, { value: Validator.errorCode.must_be_a_string });
          if ('' === value.replace(/^\s+/g, '').replace(/\s+$/g, ''))
            throw new Violation(this, value);
          return true;
        };
        return this;
      },
      Null: function () {
        this.__class__ = 'Null';
        this.validate = function (value) {
          if (null !== value)
            throw new Violation(this, value);
          return true;
        };
        return this;
      },
      Range: function (min, max) {
        this.__class__ = 'Range';
        if ('undefined' === typeof min || 'undefined' === typeof max)
          throw new Error('Range assert expects min and max values');
        this.min = min;
        this.max = max;
        this.validate = function (value) {
          try {
            if ('string' === typeof value && isNaN(Number(value)) || _isArray(value))
              new Assert().Length({
                min: this.min,
                max: this.max
              }).validate(value);
            else
              new Assert().GreaterThanOrEqual(this.min).validate(value) && new Assert().LessThanOrEqual(this.max).validate(value);
            return true;
          } catch (violation) {
            throw new Violation(this, value, violation.violation);
          }
          return true;
        };
        return this;
      },
      Regexp: function (regexp, flag) {
        this.__class__ = 'Regexp';
        if ('undefined' === typeof regexp)
          throw new Error('You must give a regexp');
        this.regexp = regexp;
        this.flag = flag || '';
        this.validate = function (value) {
          if ('string' !== typeof value)
            throw new Violation(this, value, { value: Validator.errorCode.must_be_a_string });
          if (!new RegExp(this.regexp, this.flag).test(value))
            throw new Violation(this, value, {
              regexp: this.regexp,
              flag: this.flag
            });
          return true;
        };
        return this;
      },
      Required: function () {
        this.__class__ = 'Required';
        this.validate = function (value) {
          if ('undefined' === typeof value)
            throw new Violation(this, value);
          try {
            if ('string' === typeof value)
              new Assert().NotNull().validate(value) && new Assert().NotBlank().validate(value);
            else if (true === _isArray(value))
              new Assert().Length({ min: 1 }).validate(value);
          } catch (violation) {
            throw new Violation(this, value);
          }
          return true;
        };
        return this;
      },
      Unique: function (object) {
        this.__class__ = 'Unique';
        if ('object' === typeof object)
          this.key = object.key;
        this.validate = function (array) {
          var value, store = [];
          if (!_isArray(array))
            throw new Violation(this, array, { value: Validator.errorCode.must_be_an_array });
          for (var i = 0; i < array.length; i++) {
            value = 'object' === typeof array[i] ? array[i][this.key] : array[i];
            if ('undefined' === typeof value)
              continue;
            if (-1 !== store.indexOf(value))
              throw new Violation(this, array, { value: value });
            store.push(value);
          }
          return true;
        };
        return this;
      }
    };
    exports.Assert = Assert;
    exports.Validator = Validator;
    exports.Violation = Violation;
    exports.Constraint = Constraint;
    if (!Array.prototype.indexOf)
      Array.prototype.indexOf = function (searchElement) {
        if (this === null) {
          throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
          return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
          n = Number(arguments[1]);
          if (n != n) {
            n = 0;
          } else if (n !== 0 && n != Infinity && n != -Infinity) {
            n = (n > 0 || -1) * Math.floor(Math.abs(n));
          }
        }
        if (n >= len) {
          return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
          if (k in t && t[k] === searchElement) {
            return k;
          }
        }
        return -1;
      };
    var _isEmptyObject = function (obj) {
      for (var property in obj)
        return false;
      return true;
    };
    var _isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
    var expect = {
        eql: function (actual, expected) {
          if (actual === expected) {
            return true;
          } else if ('undefined' !== typeof Buffer && Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
            if (actual.length !== expected.length)
              return false;
            for (var i = 0; i < actual.length; i++)
              if (actual[i] !== expected[i])
                return false;
            return true;
          } else if (actual instanceof Date && expected instanceof Date) {
            return actual.getTime() === expected.getTime();
          } else if (typeof actual !== 'object' && typeof expected !== 'object') {
            return actual == expected;
          } else {
            return this.objEquiv(actual, expected);
          }
        },
        isUndefinedOrNull: function (value) {
          return value === null || typeof value === 'undefined';
        },
        isArguments: function (object) {
          return Object.prototype.toString.call(object) == '[object Arguments]';
        },
        keys: function (obj) {
          if (Object.keys)
            return Object.keys(obj);
          var keys = [];
          for (var i in obj)
            if (Object.prototype.hasOwnProperty.call(obj, i))
              keys.push(i);
          return keys;
        },
        objEquiv: function (a, b) {
          if (this.isUndefinedOrNull(a) || this.isUndefinedOrNull(b))
            return false;
          if (a.prototype !== b.prototype)
            return false;
          if (this.isArguments(a)) {
            if (!this.isArguments(b))
              return false;
            return eql(pSlice.call(a), pSlice.call(b));
          }
          try {
            var ka = this.keys(a), kb = this.keys(b), key, i;
            if (ka.length !== kb.length)
              return false;
            ka.sort();
            kb.sort();
            for (i = ka.length - 1; i >= 0; i--)
              if (ka[i] != kb[i])
                return false;
            for (i = ka.length - 1; i >= 0; i--) {
              key = ka[i];
              if (!this.eql(a[key], b[key]))
                return false;
            }
            return true;
          } catch (e) {
            return false;
          }
        }
      };
    if ('function' === typeof define && define.amd) {
      define('validator', [], function () {
        return exports;
      });
    }
  }('undefined' === typeof exports ? this['undefined' !== typeof validatorjs_ns ? validatorjs_ns : 'Validator'] = {} : exports));
  var ParsleyValidator = function (validators, catalog) {
    this.__class__ = 'ParsleyValidator';
    this.Validator = Validator;
    this.locale = 'en';
    this.init(validators || {}, catalog || {});
  };
  ParsleyValidator.prototype = {
    init: function (validators, catalog) {
      this.catalog = catalog;
      for (var name in validators)
        this.addValidator(name, validators[name].fn, validators[name].priority);
      $.emit('parsley:validator:init');
    },
    setLocale: function (locale) {
      if ('undefined' === typeof this.catalog[locale])
        throw new Error(locale + ' is not available in the catalog');
      this.locale = locale;
      return this;
    },
    addCatalog: function (locale, messages, set) {
      if ('object' === typeof messages)
        this.catalog[locale] = messages;
      if (true === set)
        return this.setLocale(locale);
      return this;
    },
    addMessage: function (locale, name, message) {
      if (undefined === typeof this.catalog[locale])
        this.catalog[locale] = {};
      this.catalog[locale][name] = message;
      return this;
    },
    validate: function (value, constraints, priority) {
      return new this.Validator.Validator().validate.apply(new Validator.Validator(), arguments);
    },
    addValidator: function (name, fn, priority) {
      this.validators[name] = function (requirements) {
        return $.extend(new Validator.Assert().Callback(fn, requirements), { priority: priority });
      };
      return this;
    },
    updateValidator: function (name, fn, priority) {
      return addValidator(name, fn, priority);
    },
    removeValidator: function (name) {
      delete this.validators[name];
      return this;
    },
    getErrorMessage: function (constraint) {
      var message;
      if ('type' === constraint.name)
        message = window.ParsleyConfig.i18n[this.locale][constraint.name][constraint.requirements];
      else
        message = this.formatMesssage(window.ParsleyConfig.i18n[this.locale][constraint.name], constraint.requirements);
      return '' !== message ? message : window.ParsleyConfig.i18n[this.locale].defaultMessage;
    },
    formatMesssage: function (string, parameters) {
      if ('object' === typeof parameters) {
        for (var i in parameters)
          string = this.formatMesssage(string, parameters[i]);
        return string;
      }
      return 'string' === typeof string ? string.replace(new RegExp('%s', 'i'), parameters) : '';
    },
    validators: {
      notblank: function () {
        return $.extend(new Validator.Assert().NotBlank(), { priority: 2 });
      },
      required: function () {
        return $.extend(new Validator.Assert().Required(), { priority: 512 });
      },
      type: function (type) {
        var assert;
        switch (type) {
        case 'email':
          assert = new Validator.Assert().Email();
          break;
        case 'number':
          assert = new Validator.Assert().Regexp('^-?(?:\\d+|\\d{1,3}(?:,\\d{3})+)?(?:\\.\\d+)?$');
          break;
        case 'integer':
          assert = new Validator.Assert().Regexp('^-?\\d+$');
          break;
        case 'digits':
          assert = new Validator.Assert().Regexp('^\\d+$');
          break;
        case 'alphanum':
          assert = new Validator.Assert().Regexp('^\\w+$', 'i');
          break;
        case 'url':
          assert = new Validator.Assert().Regexp('(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,4}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)', 'i');
          break;
        default:
          throw new Error('validator type `' + type + '` is not supported');
        }
        return $.extend(assert, { priority: 256 });
      },
      pattern: function (regexp) {
        var flags = '';
        if (!!/^\/.*\/(?:[gimy]*)$/.test(regexp)) {
          flags = regexp.replace(/.*\/([gimy]*)$/, '$1');
          regexp = regexp.replace(new RegExp('^/(.*?)/' + flags + '$'), '$1');
        }
        return $.extend(new Validator.Assert().Regexp(regexp, flags), { priority: 64 });
      },
      minlength: function (value) {
        return $.extend(new Validator.Assert().Length({ min: value }), {
          priority: 30,
          requirementsTransformer: function () {
            return 'string' === typeof value && !isNaN(value) ? parseInt(value, 10) : value;
          }
        });
      },
      maxlength: function (value) {
        return $.extend(new Validator.Assert().Length({ max: value }), {
          priority: 30,
          requirementsTransformer: function () {
            return 'string' === typeof value && !isNaN(value) ? parseInt(value, 10) : value;
          }
        });
      },
      length: function (array) {
        return $.extend(new Validator.Assert().Length({
          min: array[0],
          max: array[1]
        }), { priority: 32 });
      },
      mincheck: function (length) {
        return this.minlength(length);
      },
      maxcheck: function (length) {
        return this.maxlength(length);
      },
      check: function (array) {
        return this.length(array);
      },
      min: function (value) {
        return $.extend(new Validator.Assert().GreaterThanOrEqual(value), {
          priority: 30,
          requirementsTransformer: function () {
            return 'string' === typeof value && !isNaN(value) ? parseInt(value, 10) : value;
          }
        });
      },
      max: function (value) {
        return $.extend(new Validator.Assert().LessThanOrEqual(value), {
          priority: 30,
          requirementsTransformer: function () {
            return 'string' === typeof value && !isNaN(value) ? parseInt(value, 10) : value;
          }
        });
      },
      range: function (array) {
        return $.extend(new Validator.Assert().Range(array[0], array[1]), {
          priority: 32,
          requirementsTransformer: function () {
            for (var i = 0; i < array.length; i++)
              array[i] = 'string' === typeof array[i] && !isNaN(array[i]) ? parseInt(array[i], 10) : array[i];
            return array;
          }
        });
      },
      equalto: function (value) {
        return $.extend(new Validator.Assert().EqualTo(value), {
          priority: 256,
          requirementsTransformer: function () {
            return $(value).length ? $(value).val() : value;
          }
        });
      }
    }
  };
  var ParsleyUI = function (options) {
    this.__class__ = 'ParsleyUI';
  };
  ParsleyUI.prototype = {
    listen: function () {
      $.listen('parsley:form:init', this, this.setupForm);
      $.listen('parsley:field:init', this, this.setupField);
      $.listen('parsley:field:validated', this, this.reflow);
      $.listen('parsley:form:validated', this, this.focus);
      $.listen('parsley:field:reset', this, this.reset);
      $.listen('parsley:form:destroy', this, this.destroy);
      $.listen('parsley:field:destroy', this, this.destroy);
      return this;
    },
    reflow: function (fieldInstance) {
      if ('undefined' === typeof fieldInstance._ui || false === fieldInstance._ui.active)
        return;
      var diff = this._diff(fieldInstance.validationResult, fieldInstance._ui.lastValidationResult);
      fieldInstance._ui.lastValidationResult = fieldInstance.validationResult;
      fieldInstance._ui.validatedOnce = true;
      this.manageStatusClass(fieldInstance);
      this.manageErrorsMessages(fieldInstance, diff);
      this.actualizeTriggers(fieldInstance);
      if ((diff.kept.length || diff.added.length) && 'undefined' === typeof fieldInstance._ui.failedOnce)
        this.manageFailingFieldTrigger(fieldInstance);
    },
    manageStatusClass: function (fieldInstance) {
      if (true === fieldInstance.validationResult)
        this._successClass(fieldInstance);
      else if (fieldInstance.validationResult.length > 0)
        this._errorClass(fieldInstance);
      else
        this._resetClass(fieldInstance);
    },
    manageErrorsMessages: function (fieldInstance, diff) {
      if ('undefined' !== typeof fieldInstance.options.errorsMessagesDisabled)
        return;
      if ('undefined' !== typeof fieldInstance.options.errorMessage) {
        if (diff.added.length || diff.kept.length) {
          if (0 === fieldInstance._ui.$errorsWrapper.find('.parsley-custom-error-message').length)
            fieldInstance._ui.$errorsWrapper.append($(fieldInstance.options.errorTemplate).addClass('parsley-custom-error-message'));
          fieldInstance._ui.$errorsWrapper.addClass('filled').find('.parsley-custom-error-message').html(fieldInstance.options.errorMessage);
        } else {
          fieldInstance._ui.$errorsWrapper.removeClass('filled').find('.parsley-custom-error-message').remove();
        }
        return;
      }
      for (var i = 0; i < diff.removed.length; i++)
        this.removeError(fieldInstance, diff.removed[i].assert.name, true);
      for (i = 0; i < diff.added.length; i++)
        this.addError(fieldInstance, diff.added[i].assert.name, undefined, diff.added[i].assert, true);
      for (i = 0; i < diff.kept.length; i++)
        this.updateError(fieldInstance, diff.kept[i].assert.name, undefined, diff.kept[i].assert, true);
    },
    addError: function (fieldInstance, name, message, assert, doNotUpdateClass) {
      fieldInstance._ui.$errorsWrapper.addClass('filled').append($(fieldInstance.options.errorTemplate).addClass('parsley-' + name).html(message || this._getErrorMessage(fieldInstance, assert)));
      if (true !== doNotUpdateClass)
        this._errorClass(fieldInstance);
    },
    updateError: function (fieldInstance, name, message, assert, doNotUpdateClass) {
      fieldInstance._ui.$errorsWrapper.addClass('filled').find('.parsley-' + name).html(message || this._getErrorMessage(fieldInstance, assert));
      if (true !== doNotUpdateClass)
        this._errorClass(fieldInstance);
    },
    removeError: function (fieldInstance, name, doNotUpdateClass) {
      fieldInstance._ui.$errorsWrapper.removeClass('filled').find('.parsley-' + name).remove();
      if (true !== doNotUpdateClass)
        this.manageStatusClass(fieldInstance);
    },
    focus: function (formInstance) {
      if (true === formInstance.validationResult || 'none' === formInstance.options.focus)
        return formInstance._focusedField = null;
      formInstance._focusedField = null;
      for (var i = 0; i < formInstance.fields.length; i++)
        if (true !== formInstance.fields[i].validationResult && formInstance.fields[i].validationResult.length > 0 && 'undefined' === typeof formInstance.fields[i].options.noFocus) {
          if ('first' === formInstance.options.focus) {
            formInstance._focusedField = formInstance.fields[i].$element;
            return formInstance._focusedField.focus();
          }
          formInstance._focusedField = formInstance.fields[i].$element;
        }
      if (null === formInstance._focusedField)
        return null;
      return formInstance._focusedField.focus();
    },
    _getErrorMessage: function (fieldInstance, constraint) {
      var customConstraintErrorMessage = constraint.name + 'Message';
      if ('undefined' !== typeof fieldInstance.options[customConstraintErrorMessage])
        return fieldInstance.options[customConstraintErrorMessage];
      return window.ParsleyValidator.getErrorMessage(constraint);
    },
    _diff: function (newResult, oldResult, deep) {
      var added = [], kept = [];
      for (var i = 0; i < newResult.length; i++) {
        var found = false;
        for (var j = 0; j < oldResult.length; j++)
          if (newResult[i].assert.name === oldResult[j].assert.name) {
            found = true;
            break;
          }
        if (found)
          kept.push(newResult[i]);
        else
          added.push(newResult[i]);
      }
      return {
        kept: kept,
        added: added,
        removed: !deep ? this._diff(oldResult, newResult, true).added : []
      };
    },
    setupForm: function (formInstance) {
      formInstance.$element.on('submit.Parsley', false, $.proxy(formInstance.onSubmitValidate, formInstance));
      if (false === formInstance.options.uiEnabled)
        return;
      formInstance.$element.attr('novalidate', '');
    },
    setupField: function (fieldInstance) {
      var _ui = { active: false };
      if (false === fieldInstance.options.uiEnabled)
        return;
      _ui.active = true;
      fieldInstance.$element.attr(fieldInstance.options.namespace + 'id', fieldInstance.__id__);
      _ui.$errorClassHandler = this._manageClassHandler(fieldInstance);
      _ui.errorsWrapperId = 'parsley-id-' + ('undefined' !== typeof fieldInstance.options.multiple ? 'multiple-' + fieldInstance.options.multiple : fieldInstance.__id__);
      _ui.$errorsWrapper = $(fieldInstance.options.errorsWrapper).attr('id', _ui.errorsWrapperId);
      _ui.lastValidationResult = [];
      _ui.validatedOnce = false;
      _ui.validationInformationVisible = false;
      fieldInstance._ui = _ui;
      this._insertErrorWrapper(fieldInstance);
      this.actualizeTriggers(fieldInstance);
    },
    _manageClassHandler: function (fieldInstance) {
      if ('string' === typeof fieldInstance.options.classHandler && $(fieldInstance.options.classHandler).length)
        return $(fieldInstance.options.classHandler);
      var $handler = fieldInstance.options.classHandler(fieldInstance);
      if ('undefined' !== typeof $handler && $handler.length)
        return $handler;
      if ('undefined' === typeof fieldInstance.options.multiple || fieldInstance.$element.is('select'))
        return fieldInstance.$element;
      return fieldInstance.$element.parent();
    },
    _insertErrorWrapper: function (fieldInstance) {
      var $errorsContainer;
      if ('string' === typeof fieldInstance.options.errorsContainer)
        if ($(fieldInstance.options.errorsContainer + '').length)
          return $(fieldInstance.options.errorsContainer).append(fieldInstance._ui.$errorsWrapper);
        else if (window.console && window.console.warn)
          window.console.warn('The errors container `' + fieldInstance.options.errorsContainer + '` does not exist in DOM');
      if ('function' === typeof fieldInstance.options.errorsContainer)
        $errorsContainer = fieldInstance.options.errorsContainer(fieldInstance);
      if ('undefined' !== typeof $errorsContainer && $errorsContainer.length)
        return $errorsContainer.append(fieldInstance._ui.$errorsWrapper);
      return 'undefined' === typeof fieldInstance.options.multiple ? fieldInstance.$element.after(fieldInstance._ui.$errorsWrapper) : fieldInstance.$element.parent().after(fieldInstance._ui.$errorsWrapper);
    },
    actualizeTriggers: function (fieldInstance) {
      var that = this;
      if (fieldInstance.options.multiple)
        $('[' + fieldInstance.options.namespace + 'multiple="' + fieldInstance.options.multiple + '"]').each(function () {
          $(this).off('.Parsley');
        });
      else
        fieldInstance.$element.off('.Parsley');
      if (false === fieldInstance.options.trigger)
        return;
      var triggers = fieldInstance.options.trigger.replace(/^\s+/g, '').replace(/\s+$/g, '');
      if ('' === triggers)
        return;
      if (fieldInstance.options.multiple)
        $('[' + fieldInstance.options.namespace + 'multiple="' + fieldInstance.options.multiple + '"]').each(function () {
          $(this).on(triggers.split(' ').join('.Parsley ') + '.Parsley', false, $.proxy('function' === typeof fieldInstance.eventValidate ? fieldInstance.eventValidate : that.eventValidate, fieldInstance));
        });
      else
        fieldInstance.$element.on(triggers.split(' ').join('.Parsley ') + '.Parsley', false, $.proxy('function' === typeof fieldInstance.eventValidate ? fieldInstance.eventValidate : this.eventValidate, fieldInstance));
    },
    eventValidate: function (event) {
      if (new RegExp('key').test(event.type))
        if (!this._ui.validationInformationVisible && this.getValue().length <= this.options.validationThreshold)
          return;
      this._ui.validatedOnce = true;
      this.validate();
    },
    manageFailingFieldTrigger: function (fieldInstance) {
      fieldInstance._ui.failedOnce = true;
      if (fieldInstance.options.multiple)
        $('[' + fieldInstance.options.namespace + 'multiple="' + fieldInstance.options.multiple + '"]').each(function () {
          if (!new RegExp('change', 'i').test($(this).parsley().options.trigger || ''))
            return $(this).on('change.ParsleyFailedOnce', false, $.proxy(fieldInstance.validate, fieldInstance));
        });
      if (fieldInstance.$element.is('select'))
        if (!new RegExp('change', 'i').test(fieldInstance.options.trigger || ''))
          return fieldInstance.$element.on('change.ParsleyFailedOnce', false, $.proxy(fieldInstance.validate, fieldInstance));
      if (!new RegExp('keyup', 'i').test(fieldInstance.options.trigger || ''))
        return fieldInstance.$element.on('keyup.ParsleyFailedOnce', false, $.proxy(fieldInstance.validate, fieldInstance));
    },
    reset: function (parsleyInstance) {
      if ('undefined' === typeof parsleyInstance._ui)
        return;
      parsleyInstance.$element.off('.Parsley');
      parsleyInstance.$element.off('.ParsleyFailedOnce');
      if ('ParsleyForm' === parsleyInstance.__class__)
        return;
      parsleyInstance._ui.$errorsWrapper.children().each(function () {
        $(this).remove();
      });
      this._resetClass(parsleyInstance);
      parsleyInstance._ui.validatedOnce = false;
      parsleyInstance._ui.lastValidationResult = [];
      parsleyInstance._ui.validationInformationVisible = false;
    },
    destroy: function (parsleyInstance) {
      if ('undefined' === typeof parsleyInstance._ui)
        return;
      this.reset(parsleyInstance);
      if ('ParsleyForm' === parsleyInstance.__class__)
        return;
      parsleyInstance._ui.$errorsWrapper.remove();
      delete parsleyInstance._ui;
    },
    _successClass: function (fieldInstance) {
      fieldInstance._ui.validationInformationVisible = true;
      fieldInstance._ui.$errorClassHandler.removeClass(fieldInstance.options.errorClass).addClass(fieldInstance.options.successClass);
    },
    _errorClass: function (fieldInstance) {
      fieldInstance._ui.validationInformationVisible = true;
      fieldInstance._ui.$errorClassHandler.removeClass(fieldInstance.options.successClass).addClass(fieldInstance.options.errorClass);
    },
    _resetClass: function (fieldInstance) {
      fieldInstance._ui.$errorClassHandler.removeClass(fieldInstance.options.successClass).removeClass(fieldInstance.options.errorClass);
    }
  };
  var ParsleyOptionsFactory = function (defaultOptions, globalOptions, userOptions, namespace) {
    this.__class__ = 'OptionsFactory';
    this.__id__ = ParsleyUtils.hash(4);
    this.formOptions = null;
    this.fieldOptions = null;
    this.staticOptions = $.extend(true, {}, defaultOptions, globalOptions, userOptions, { namespace: namespace });
  };
  ParsleyOptionsFactory.prototype = {
    get: function (parsleyInstance) {
      if ('undefined' === typeof parsleyInstance.__class__)
        throw new Error('Parsley Instance expected');
      switch (parsleyInstance.__class__) {
      case 'Parsley':
        return this.staticOptions;
      case 'ParsleyForm':
        return this.getFormOptions(parsleyInstance);
      case 'ParsleyField':
      case 'ParsleyFieldMultiple':
        return this.getFieldOptions(parsleyInstance);
      default:
        throw new Error('Instance ' + parsleyInstance.__class__ + ' is not supported');
      }
    },
    getFormOptions: function (formInstance) {
      this.formOptions = ParsleyUtils.attr(formInstance.$element, this.staticOptions.namespace);
      return $.extend({}, this.staticOptions, this.formOptions);
    },
    getFieldOptions: function (fieldInstance) {
      this.fieldOptions = ParsleyUtils.attr(fieldInstance.$element, this.staticOptions.namespace);
      if (null === this.formOptions && 'ParsleyForm' === fieldInstance.parsleyInstance.__proxy__)
        this.formOptions = getFormOptions(fieldInstance.parsleyInstance);
      return $.extend({}, this.staticOptions, this.formOptions, this.fieldOptions);
    }
  };
  var ParsleyForm = function (element, parsleyInstance) {
    this.__class__ = 'ParsleyForm';
    this.__id__ = ParsleyUtils.hash(4);
    if ('Parsley' !== ParsleyUtils.get(parsleyInstance, '__class__'))
      throw new Error('You must give a Parsley instance');
    this.parsleyInstance = parsleyInstance;
    this.$element = $(element);
  };
  ParsleyForm.prototype = {
    init: function () {
      this.validationResult = null;
      this.options = this.parsleyInstance.OptionsFactory.get(this);
      this._bindFields();
      return this;
    },
    onSubmitValidate: function (event) {
      this.validate(undefined, undefined, event);
      if (false === this.validationResult && event instanceof $.Event)
        event.preventDefault();
      return this;
    },
    validate: function (group, force, event) {
      this.submitEvent = event;
      this.validationResult = true;
      var fieldValidationResult = [];
      this._refreshFields();
      $.emit('parsley:form:validate', this);
      for (var i = 0; i < this.fields.length; i++) {
        if (group && group !== this.fields[i].options.group)
          continue;
        fieldValidationResult = this.fields[i].validate(force);
        if (true !== fieldValidationResult && fieldValidationResult.length > 0 && this.validationResult)
          this.validationResult = false;
      }
      $.emit('parsley:form:validated', this);
      return this.validationResult;
    },
    isValid: function (group, force) {
      this._refreshFields();
      for (var i = 0; i < this.fields.length; i++) {
        if (group && group !== this.fields[i].options.group)
          continue;
        if (false === this.fields[i].isValid(force))
          return false;
      }
      return true;
    },
    _refreshFields: function () {
      return this.actualizeOptions()._bindFields();
    },
    _bindFields: function () {
      var self = this;
      this.fields = [];
      this.fieldsMappedById = {};
      this.$element.find(this.options.inputs).each(function () {
        var fieldInstance = new window.Parsley(this, {}, self.parsleyInstance);
        if (('ParsleyField' === fieldInstance.__class__ || 'ParsleyFieldMultiple' === fieldInstance.__class__) && !fieldInstance.$element.is(fieldInstance.options.excluded))
          if ('undefined' === typeof self.fieldsMappedById[fieldInstance.__class__ + '-' + fieldInstance.__id__]) {
            self.fieldsMappedById[fieldInstance.__class__ + '-' + fieldInstance.__id__] = fieldInstance;
            self.fields.push(fieldInstance);
          }
      });
      return this;
    }
  };
  var ConstraintFactory = function (parsleyField, name, requirements, priority, isDomConstraint) {
    if (!new RegExp('ParsleyField').test(ParsleyUtils.get(parsleyField, '__class__')))
      throw new Error('ParsleyField or ParsleyFieldMultiple instance expected');
    if ('function' !== typeof window.ParsleyValidator.validators[name] && 'Assert' !== window.ParsleyValidator.validators[name](requirements).__parentClass__)
      throw new Error('Valid validator expected');
    var getPriority = function (parsleyField, name) {
      if ('undefined' !== typeof parsleyField.options[name + 'Priority'])
        return parsleyField.options[name + 'Priority'];
      return ParsleyUtils.get(window.ParsleyValidator.validators[name](requirements), 'priority') || 2;
    };
    priority = priority || getPriority(parsleyField, name);
    if ('function' === typeof window.ParsleyValidator.validators[name](requirements).requirementsTransformer)
      requirements = window.ParsleyValidator.validators[name](requirements).requirementsTransformer();
    return $.extend(window.ParsleyValidator.validators[name](requirements), {
      name: name,
      requirements: requirements,
      priority: priority,
      groups: [priority],
      isDomConstraint: isDomConstraint || ParsleyUtils.attr(parsleyField.$element, parsleyField.options.namespace, name)
    });
  };
  var ParsleyField = function (field, parsleyInstance) {
    this.__class__ = 'ParsleyField';
    this.__id__ = ParsleyUtils.hash(4);
    if ('Parsley' !== ParsleyUtils.get(parsleyInstance, '__class__'))
      throw new Error('You must give a Parsley instance');
    this.parsleyInstance = parsleyInstance;
    this.$element = $(field);
    this.options = this.parsleyInstance.OptionsFactory.get(this);
  };
  ParsleyField.prototype = {
    init: function () {
      this.constraints = [];
      this.validationResult = [];
      this.bindConstraints();
      return this;
    },
    validate: function (force) {
      this.value = this.getValue();
      $.emit('parsley:field:validate', this);
      $.emit('parsley:field:' + (this.isValid(force, this.value) ? 'success' : 'error'), this);
      $.emit('parsley:field:validated', this);
      return this.validationResult;
    },
    getConstraintsSortedPriorities: function () {
      var priorities = [];
      for (var i = 0; i < this.constraints.length; i++)
        if (-1 === priorities.indexOf(this.constraints[i].priority))
          priorities.push(this.constraints[i].priority);
      priorities.sort(function (a, b) {
        return b - a;
      });
      return priorities;
    },
    isValid: function (force, value) {
      this.refreshConstraints();
      var priorities = this.getConstraintsSortedPriorities();
      value = value || this.getValue();
      if (0 === value.length && !this.isRequired() && 'undefined' === typeof this.options.validateIfEmpty && true !== force)
        return this.validationResult = [];
      if (false === this.options.priorityEnabled)
        return true === (this.validationResult = this.validateThroughValidator(value, this.constraints, 'Any'));
      for (var i = 0; i < priorities.length; i++)
        if (true !== (this.validationResult = this.validateThroughValidator(value, this.constraints, priorities[i])))
          return false;
      return true;
    },
    isRequired: function () {
      var constraintIndex = this._constraintIndex('required');
      return !(-1 === constraintIndex || -1 !== constraintIndex && false === this.constraints[constraintIndex].requirements);
    },
    getValue: function () {
      var value;
      if ('undefined' !== typeof this.options.value)
        value = this.options.value;
      else
        value = this.$element.val();
      if (true === this.options.trimValue)
        return value.replace(/^\s+|\s+$/g, '');
      return value;
    },
    refreshConstraints: function () {
      this.actualizeOptions().bindConstraints();
      return this;
    },
    bindConstraints: function () {
      var constraints = [];
      for (var i = 0; i < this.constraints.length; i++)
        if (false === this.constraints[i].isDomConstraint)
          constraints.push(this.constraints[i]);
      this.constraints = constraints;
      for (var name in this.options)
        this.addConstraint(name, this.options[name]);
      return this.bindHtml5Constraints();
    },
    bindHtml5Constraints: function () {
      if (this.$element.hasClass('required') || this.$element.attr('required'))
        this.addConstraint('required', true, undefined, true);
      if ('string' === typeof this.$element.attr('pattern'))
        this.addConstraint('pattern', this.$element.attr('pattern'), undefined, true);
      if ('undefined' !== typeof this.$element.attr('min') && 'undefined' !== typeof this.$element.attr('max'))
        this.addConstraint('range', [
          this.$element.attr('min'),
          this.$element.attr('max')
        ], undefined, true);
      else if ('undefined' !== typeof this.$element.attr('min'))
        this.addConstraint('min', this.$element.attr('min'), undefined, true);
      else if ('undefined' !== typeof this.$element.attr('max'))
        this.addConstraint('max', this.$element.attr('max'), undefined, true);
      var type = this.$element.attr('type');
      if ('undefined' === typeof type)
        return this;
      if ('number' === type)
        return this.addConstraint('type', 'integer', undefined, true);
      else if (new RegExp(type, 'i').test('email url range'))
        return this.addConstraint('type', type, undefined, true);
    },
    addConstraint: function (name, requirements, priority, isDomConstraint) {
      name = name.toLowerCase();
      if ('function' === typeof window.ParsleyValidator.validators[name]) {
        var constraint = new ConstraintFactory(this, name, requirements, priority, isDomConstraint);
        if (-1 !== this._constraintIndex(constraint.name))
          this.removeConstraint(constraint.name);
        this.constraints.push(constraint);
      }
      return this;
    },
    removeConstraint: function (name) {
      for (var i = 0; i < this.constraints.length; i++)
        if (name === this.constraints[i].name) {
          this.constraints.splice(i, 1);
          break;
        }
      return this;
    },
    updateConstraint: function (name, parameters, priority) {
      return this.removeConstraint(name).addConstraint(name, parameters, priority);
    },
    _constraintIndex: function (name) {
      for (var i = 0; i < this.constraints.length; i++)
        if (name === this.constraints[i].name)
          return i;
      return -1;
    }
  };
  var ParsleyMultiple = function () {
    this.__class__ = 'ParsleyFieldMultiple';
  };
  ParsleyMultiple.prototype = {
    init: function (multiple) {
      this.$elements = [this.$element];
      this.options.multiple = multiple;
      return this;
    },
    addElement: function ($element) {
      this.$elements.push($element);
      return this;
    },
    refreshConstraints: function () {
      this.constraints = [];
      if (this.$element.is('select')) {
        this.actualizeOptions().bindConstraints();
        return this;
      }
      for (var i = 0; i < this.$elements.length; i++)
        this.constraints = this.constraints.concat(this.$elements[i].data('ParsleyFieldMultiple').refreshConstraints().constraints);
      return this;
    },
    getValue: function () {
      if ('undefined' !== typeof this.options.value)
        return this.options.value;
      if (this.$element.is('input[type=radio]'))
        return $('[' + this.options.namespace + 'multiple="' + this.options.multiple + '"]:checked').val() || '';
      if (this.$element.is('input[type=checkbox]')) {
        var values = [];
        $('[' + this.options.namespace + 'multiple="' + this.options.multiple + '"]:checked').each(function () {
          values.push($(this).val());
        });
        return values.length ? values : [];
      }
      if (this.$element.is('select'))
        return null === this.$element.val() ? [] : this.$element.val();
    }
  };
  var o = $({}), subscribed = {};
  $.listen = function (name) {
    if ('undefined' === typeof subscribed[name])
      subscribed[name] = [];
    if ('function' === typeof arguments[1])
      return subscribed[name].push({ fn: arguments[1] });
    if ('object' === typeof arguments[1] && 'function' === typeof arguments[2])
      return subscribed[name].push({
        fn: arguments[2],
        ctxt: arguments[1]
      });
    throw new Error('Wrong parameters');
  };
  $.listenTo = function (instance, name, fn) {
    if ('undefined' === typeof subscribed[name])
      subscribed[name] = [];
    if (!(instance instanceof ParsleyField) && !(instance instanceof ParsleyForm))
      throw new Error('Must give Parsley instance');
    if ('string' !== typeof name || 'function' !== typeof fn)
      throw new Error('Wrong parameters');
    subscribed[name].push({
      instance: instance,
      fn: fn
    });
  };
  $.unsubscribe = function (name, fn) {
    if ('undefined' === typeof subscribed[name])
      return;
    if ('string' !== typeof name || 'function' !== typeof fn)
      throw new Error('Wrong arguments');
    for (var i = 0; i < subscribed[name].length; i++)
      if (subscribed[name][i].fn === fn)
        return subscribed[name].splice(i, 1);
  };
  $.unsubscribeTo = function (instance, name) {
    if ('undefined' === typeof subscribed[name])
      return;
    if (!(instance instanceof ParsleyField) && !(instance instanceof ParsleyForm))
      throw new Error('Must give Parsley instance');
    for (var i = 0; i < subscribed[name].length; i++)
      if ('undefined' !== typeof subscribed[name][i].instance && subscribed[name][i].instance.__id__ === instance.__id__)
        return subscribed[name].splice(i, 1);
  };
  $.unsubscribeAll = function (name) {
    if ('undefined' === typeof subscribed[name])
      return;
    delete subscribed[name];
  };
  $.emit = function (name, instance) {
    if ('undefined' === typeof subscribed[name])
      return;
    for (var i = 0; i < subscribed[name].length; i++) {
      if ('undefined' === typeof subscribed[name][i].instance) {
        subscribed[name][i].fn.apply('undefined' !== typeof subscribed[name][i].ctxt ? subscribed[name][i].ctxt : o, Array.prototype.slice.call(arguments, 1));
        continue;
      }
      if (!(instance instanceof ParsleyField) && !(instance instanceof ParsleyForm))
        continue;
      if (subscribed[name][i].instance.__id__ === instance.__id__) {
        subscribed[name][i].fn.apply(o, Array.prototype.slice.call(arguments, 1));
        continue;
      }
      if (subscribed[name][i].instance instanceof ParsleyForm && instance instanceof ParsleyField)
        for (var j = 0; j < subscribed[name][i].instance.fields.length; j++)
          if (subscribed[name][i].instance.fields[j].__id__ === instance.__id__) {
            subscribed[name][i].fn.apply(o, Array.prototype.slice.call(arguments, 1));
            continue;
          }
    }
  };
  $.subscribed = function () {
    return subscribed;
  };
  window.ParsleyConfig = window.ParsleyConfig || {};
  window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};
  window.ParsleyConfig.i18n.en = $.extend(window.ParsleyConfig.i18n.en || {}, {
    defaultMessage: 'This value seems to be invalid.',
    type: {
      email: 'This value should be a valid email.',
      url: 'This value should be a valid url.',
      number: 'This value should be a valid number.',
      integer: 'This value should be a valid integer.',
      digits: 'This value should be digits.',
      alphanum: 'This value should be alphanumeric.'
    },
    notblank: 'This value should not be blank.',
    required: 'This value is required.',
    pattern: 'This value seems to be invalid.',
    min: 'This value should be greater than or equal to %s.',
    max: 'This value should be lower than or equal to %s.',
    range: 'This value should be between %s and %s.',
    minlength: 'This value is too short. It should have %s characters or more.',
    maxlength: 'This value is too long. It should have %s characters or less.',
    length: 'This value length is invalid. It should be between %s and %s characters long.',
    mincheck: 'You must select at least %s choices.',
    maxcheck: 'You must select %s choices or less.',
    check: 'You must select between %s and %s choices.',
    equalto: 'This value should be the same.'
  });
  if ('undefined' !== typeof window.ParsleyValidator)
    window.ParsleyValidator.addCatalog('en', window.ParsleyConfig.i18n.en, true);
  var Parsley = function (element, options, parsleyInstance) {
    this.__class__ = 'Parsley';
    this.__version__ = '2.0.0-rc5';
    this.__id__ = ParsleyUtils.hash(4);
    if ('undefined' === typeof element)
      throw new Error('You must give an element');
    return this.init($(element), options, parsleyInstance);
  };
  Parsley.prototype = {
    init: function ($element, options, parsleyInstance) {
      if (!$element.length)
        throw new Error('You must bind Parsley on an existing element.');
      this.$element = $element;
      if (this.$element.data('Parsley')) {
        var savedParsleyInstance = this.$element.data('Parsley');
        if ('undefined' !== typeof parsleyInstance && 'ParsleyField' === savedParsleyInstance.parsleyInstance.__proxy__)
          savedParsleyInstance.parsleyInstance = parsleyInstance;
        return savedParsleyInstance;
      }
      this.OptionsFactory = new ParsleyOptionsFactory(ParsleyDefaults, ParsleyUtils.get(window, 'ParsleyConfig') || {}, options, this.getNamespace(options));
      this.options = this.OptionsFactory.get(this);
      if (this.$element.is('form') || ParsleyUtils.attr(this.$element, this.options.namespace, 'validate') && !this.$element.is(this.options.inputs))
        return this.bind('parsleyForm', parsleyInstance);
      else if (this.$element.is(this.options.inputs) && !this.$element.is(this.options.excluded))
        return this.isMultiple() ? this.handleMultiple(parsleyInstance) : this.bind('parsleyField', parsleyInstance);
      return this;
    },
    isMultiple: function () {
      return this.$element.is('input[type=radio], input[type=checkbox]') && 'undefined' === typeof this.options.multiple || this.$element.is('select') && 'undefined' !== typeof this.$element.attr('multiple');
    },
    handleMultiple: function (parsleyInstance) {
      var that = this, name, multiple, parsleyMultipleInstance;
      this.options = $.extend(this.options, ParsleyUtils.attr(this.$element, this.options.namespace));
      if (this.options.multiple) {
        multiple = this.options.multiple;
      } else if ('undefined' !== typeof this.$element.attr('name') && this.$element.attr('name').length) {
        multiple = name = this.$element.attr('name');
      } else if ('undefined' !== typeof this.$element.attr('id') && this.$element.attr('id').length) {
        multiple = this.$element.attr('id');
      }
      if (this.$element.is('select') && 'undefined' !== typeof this.$element.attr('multiple')) {
        return this.bind('parsleyFieldMultiple', parsleyInstance, multiple || this.__id__);
      } else if ('undefined' === typeof multiple) {
        if (window.console && window.console.warn)
          window.console.warn('To be binded by Parsley, a radio, a checkbox and a multiple select input must have either a name or a multiple option.', this.$element);
        return this;
      }
      multiple = multiple.replace(/(:|\.|\[|\]|\$)/g, '');
      if ('undefined' !== typeof name)
        $('input[name="' + name + '"]').each(function () {
          $(this).attr(that.options.namespace + 'multiple', multiple);
        });
      if ($('[' + this.options.namespace + 'multiple=' + multiple + ']').length)
        for (var i = 0; i < $('[' + this.options.namespace + 'multiple=' + multiple + ']').length; i++)
          if ('undefined' !== typeof $($('[' + this.options.namespace + 'multiple=' + multiple + ']').get(i)).data('Parsley')) {
            parsleyMultipleInstance = $($('[' + this.options.namespace + 'multiple=' + multiple + ']').get(i)).data('Parsley');
            if (!this.$element.data('ParsleyFieldMultiple')) {
              parsleyMultipleInstance.addElement(this.$element);
              this.$element.attr(this.options.namespace + 'id', parsleyMultipleInstance.__id__);
            }
            break;
          }
      this.bind('parsleyField', parsleyInstance, multiple, true);
      return parsleyMultipleInstance || this.bind('parsleyFieldMultiple', parsleyInstance, multiple);
    },
    getNamespace: function (options) {
      if ('undefined' !== typeof this.$element.data('parsleyNamespace'))
        return this.$element.data('parsleyNamespace');
      if ('undefined' !== typeof ParsleyUtils.get(options, 'namespace'))
        return options.namespace;
      if ('undefined' !== typeof ParsleyUtils.get(window, 'ParsleyConfig.namespace'))
        return window.ParsleyConfig.namespace;
      return ParsleyDefaults.namespace;
    },
    bind: function (type, parentParsleyInstance, multiple, doNotStore) {
      var parsleyInstance;
      switch (type) {
      case 'parsleyForm':
        parsleyInstance = $.extend(new ParsleyForm(this.$element, parentParsleyInstance || this), new ParsleyAbstract(), window.ParsleyExtend).init();
        break;
      case 'parsleyField':
        parsleyInstance = $.extend(new ParsleyField(this.$element, parentParsleyInstance || this), new ParsleyAbstract(), window.ParsleyExtend).init();
        break;
      case 'parsleyFieldMultiple':
        parsleyInstance = $.extend(new ParsleyField(this.$element, parentParsleyInstance || this).init(), new ParsleyAbstract(), new ParsleyMultiple(), window.ParsleyExtend).init(multiple);
        break;
      default:
        throw new Error(type + 'is not a supported Parsley type');
      }
      if ('undefined' !== typeof multiple)
        ParsleyUtils.setAttr(this.$element, this.options.namespace, 'multiple', multiple);
      if ('undefined' !== typeof doNotStore) {
        this.$element.data('ParsleyFieldMultiple', parsleyInstance);
        return parsleyInstance;
      }
      if (new RegExp('ParsleyF', 'i').test(parsleyInstance.__class__)) {
        this.$element.data('Parsley', parsleyInstance);
        this.__proxy__ = parsleyInstance.__class__;
        $.emit('parsley:' + ('parsleyForm' === type ? 'form' : 'field') + ':init', parsleyInstance);
      }
      return parsleyInstance;
    }
  };
  $.fn.parsley = $.fn.psly = function (options) {
    if (this.length > 1) {
      var instances = [];
      this.each(function () {
        instances.push($(this).parsley(options));
      });
      return instances;
    }
    if (!$(this).length) {
      if (window.console && window.console.warn)
        window.console.warn('You must bind Parsley on an existing element.');
      return;
    }
    return new Parsley(this, options);
  };
  window.ParsleyUI = 'function' === typeof ParsleyUtils.get(window, 'ParsleyConfig.ParsleyUI') ? new window.ParsleyConfig.ParsleyUI().listen() : new ParsleyUI().listen();
  if ('undefined' === typeof window.ParsleyExtend)
    window.ParsleyExtend = {};
  if ('undefined' === typeof window.ParsleyConfig)
    window.ParsleyConfig = {};
  window.Parsley = window.psly = Parsley;
  window.ParsleyUtils = ParsleyUtils;
  window.ParsleyValidator = new ParsleyValidator(window.ParsleyConfig.validators, window.ParsleyConfig.i18n);
  if (false !== ParsleyUtils.get(window, 'ParsleyConfig.autoBind'))
    $(document).ready(function () {
      if ($('[data-parsley-validate]').length)
        $('[data-parsley-validate]').parsley();
    });
}(window.jQuery);
(function (root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define('GMaps', [], factory);
  }
  root.GMaps = factory();
}(this, function () {
  if (!(typeof window.google === 'object' && window.google.maps)) {
    throw 'Google Maps API is required. Please register the following JavaScript library http://maps.google.com/maps/api/js?sensor=true.';
  }
  var extend_object = function (obj, new_obj) {
    var name;
    if (obj === new_obj) {
      return obj;
    }
    for (name in new_obj) {
      obj[name] = new_obj[name];
    }
    return obj;
  };
  var replace_object = function (obj, replace) {
    var name;
    if (obj === replace) {
      return obj;
    }
    for (name in replace) {
      if (obj[name] != undefined) {
        obj[name] = replace[name];
      }
    }
    return obj;
  };
  var array_map = function (array, callback) {
    var original_callback_params = Array.prototype.slice.call(arguments, 2), array_return = [], array_length = array.length, i;
    if (Array.prototype.map && array.map === Array.prototype.map) {
      array_return = Array.prototype.map.call(array, function (item) {
        callback_params = original_callback_params;
        callback_params.splice(0, 0, item);
        return callback.apply(this, callback_params);
      });
    } else {
      for (i = 0; i < array_length; i++) {
        callback_params = original_callback_params;
        callback_params.splice(0, 0, array[i]);
        array_return.push(callback.apply(this, callback_params));
      }
    }
    return array_return;
  };
  var array_flat = function (array) {
    var new_array = [], i;
    for (i = 0; i < array.length; i++) {
      new_array = new_array.concat(array[i]);
    }
    return new_array;
  };
  var coordsToLatLngs = function (coords, useGeoJSON) {
    var first_coord = coords[0], second_coord = coords[1];
    if (useGeoJSON) {
      first_coord = coords[1];
      second_coord = coords[0];
    }
    return new google.maps.LatLng(first_coord, second_coord);
  };
  var arrayToLatLng = function (coords, useGeoJSON) {
    var i;
    for (i = 0; i < coords.length; i++) {
      if (coords[i].length > 0 && typeof coords[i][0] == 'object') {
        coords[i] = arrayToLatLng(coords[i], useGeoJSON);
      } else {
        coords[i] = coordsToLatLngs(coords[i], useGeoJSON);
      }
    }
    return coords;
  };
  var getElementById = function (id, context) {
    var element, id = id.replace('#', '');
    if ('jQuery' in this && context) {
      element = $('#' + id, context)[0];
    } else {
      element = document.getElementById(id);
    }
    ;
    return element;
  };
  var findAbsolutePosition = function (obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
      do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
    }
    return [
      curleft,
      curtop
    ];
  };
  var GMaps = function (global) {
      'use strict';
      var doc = document;
      var GMaps = function (options) {
        if (!this)
          return new GMaps(options);
        options.zoom = options.zoom || 15;
        options.mapType = options.mapType || 'roadmap';
        var self = this, i, events_that_hide_context_menu = [
            'bounds_changed',
            'center_changed',
            'click',
            'dblclick',
            'drag',
            'dragend',
            'dragstart',
            'idle',
            'maptypeid_changed',
            'projection_changed',
            'resize',
            'tilesloaded',
            'zoom_changed'
          ], events_that_doesnt_hide_context_menu = [
            'mousemove',
            'mouseout',
            'mouseover'
          ], options_to_be_deleted = [
            'el',
            'lat',
            'lng',
            'mapType',
            'width',
            'height',
            'markerClusterer',
            'enableNewStyle'
          ], container_id = options.el || options.div, markerClustererFunction = options.markerClusterer, mapType = google.maps.MapTypeId[options.mapType.toUpperCase()], map_center = new google.maps.LatLng(options.lat, options.lng), zoomControl = options.zoomControl || true, zoomControlOpt = options.zoomControlOpt || {
            style: 'DEFAULT',
            position: 'TOP_LEFT'
          }, zoomControlStyle = zoomControlOpt.style || 'DEFAULT', zoomControlPosition = zoomControlOpt.position || 'TOP_LEFT', panControl = options.panControl || true, mapTypeControl = options.mapTypeControl || true, scaleControl = options.scaleControl || true, streetViewControl = options.streetViewControl || true, overviewMapControl = overviewMapControl || true, map_options = {}, map_base_options = {
            zoom: this.zoom,
            center: map_center,
            mapTypeId: mapType
          }, map_controls_options = {
            panControl: panControl,
            zoomControl: zoomControl,
            zoomControlOptions: {
              style: google.maps.ZoomControlStyle[zoomControlStyle],
              position: google.maps.ControlPosition[zoomControlPosition]
            },
            mapTypeControl: mapTypeControl,
            scaleControl: scaleControl,
            streetViewControl: streetViewControl,
            overviewMapControl: overviewMapControl
          };
        if (typeof options.el === 'string' || typeof options.div === 'string') {
          this.el = getElementById(container_id, options.context);
        } else {
          this.el = container_id;
        }
        if (typeof this.el === 'undefined' || this.el === null) {
          throw 'No element defined.';
        }
        window.context_menu = window.context_menu || {};
        window.context_menu[self.el.id] = {};
        this.controls = [];
        this.overlays = [];
        this.layers = [];
        this.singleLayers = {};
        this.markers = [];
        this.polylines = [];
        this.routes = [];
        this.polygons = [];
        this.infoWindow = null;
        this.overlay_el = null;
        this.zoom = options.zoom;
        this.registered_events = {};
        this.el.style.width = options.width || this.el.scrollWidth || this.el.offsetWidth;
        this.el.style.height = options.height || this.el.scrollHeight || this.el.offsetHeight;
        google.maps.visualRefresh = options.enableNewStyle;
        for (i = 0; i < options_to_be_deleted.length; i++) {
          delete options[options_to_be_deleted[i]];
        }
        if (options.disableDefaultUI != true) {
          map_base_options = extend_object(map_base_options, map_controls_options);
        }
        map_options = extend_object(map_base_options, options);
        for (i = 0; i < events_that_hide_context_menu.length; i++) {
          delete map_options[events_that_hide_context_menu[i]];
        }
        for (i = 0; i < events_that_doesnt_hide_context_menu.length; i++) {
          delete map_options[events_that_doesnt_hide_context_menu[i]];
        }
        this.map = new google.maps.Map(this.el, map_options);
        if (markerClustererFunction) {
          this.markerClusterer = markerClustererFunction.apply(this, [this.map]);
        }
        var buildContextMenuHTML = function (control, e) {
          var html = '', options = window.context_menu[self.el.id][control];
          for (var i in options) {
            if (options.hasOwnProperty(i)) {
              var option = options[i];
              html += '<li><a id="' + control + '_' + i + '" href="#">' + option.title + '</a></li>';
            }
          }
          if (!getElementById('gmaps_context_menu'))
            return;
          var context_menu_element = getElementById('gmaps_context_menu');
          context_menu_element.innerHTML = html;
          var context_menu_items = context_menu_element.getElementsByTagName('a'), context_menu_items_count = context_menu_items.length, i;
          for (i = 0; i < context_menu_items_count; i++) {
            var context_menu_item = context_menu_items[i];
            var assign_menu_item_action = function (ev) {
              ev.preventDefault();
              options[this.id.replace(control + '_', '')].action.apply(self, [e]);
              self.hideContextMenu();
            };
            google.maps.event.clearListeners(context_menu_item, 'click');
            google.maps.event.addDomListenerOnce(context_menu_item, 'click', assign_menu_item_action, false);
          }
          var position = findAbsolutePosition.apply(this, [self.el]), left = position[0] + e.pixel.x - 15, top = position[1] + e.pixel.y - 15;
          context_menu_element.style.left = left + 'px';
          context_menu_element.style.top = top + 'px';
          context_menu_element.style.display = 'block';
        };
        this.buildContextMenu = function (control, e) {
          if (control === 'marker') {
            e.pixel = {};
            var overlay = new google.maps.OverlayView();
            overlay.setMap(self.map);
            overlay.draw = function () {
              var projection = overlay.getProjection(), position = e.marker.getPosition();
              e.pixel = projection.fromLatLngToContainerPixel(position);
              buildContextMenuHTML(control, e);
            };
          } else {
            buildContextMenuHTML(control, e);
          }
        };
        this.setContextMenu = function (options) {
          window.context_menu[self.el.id][options.control] = {};
          var i, ul = doc.createElement('ul');
          for (i in options.options) {
            if (options.options.hasOwnProperty(i)) {
              var option = options.options[i];
              window.context_menu[self.el.id][options.control][option.name] = {
                title: option.title,
                action: option.action
              };
            }
          }
          ul.id = 'gmaps_context_menu';
          ul.style.display = 'none';
          ul.style.position = 'absolute';
          ul.style.minWidth = '100px';
          ul.style.background = 'white';
          ul.style.listStyle = 'none';
          ul.style.padding = '8px';
          ul.style.boxShadow = '2px 2px 6px #ccc';
          doc.body.appendChild(ul);
          var context_menu_element = getElementById('gmaps_context_menu');
          google.maps.event.addDomListener(context_menu_element, 'mouseout', function (ev) {
            if (!ev.relatedTarget || !this.contains(ev.relatedTarget)) {
              window.setTimeout(function () {
                context_menu_element.style.display = 'none';
              }, 400);
            }
          }, false);
        };
        this.hideContextMenu = function () {
          var context_menu_element = getElementById('gmaps_context_menu');
          if (context_menu_element) {
            context_menu_element.style.display = 'none';
          }
        };
        var setupListener = function (object, name) {
          google.maps.event.addListener(object, name, function (e) {
            if (e == undefined) {
              e = this;
            }
            options[name].apply(this, [e]);
            self.hideContextMenu();
          });
        };
        for (var ev = 0; ev < events_that_hide_context_menu.length; ev++) {
          var name = events_that_hide_context_menu[ev];
          if (name in options) {
            setupListener(this.map, name);
          }
        }
        for (var ev = 0; ev < events_that_doesnt_hide_context_menu.length; ev++) {
          var name = events_that_doesnt_hide_context_menu[ev];
          if (name in options) {
            setupListener(this.map, name);
          }
        }
        google.maps.event.addListener(this.map, 'rightclick', function (e) {
          if (options.rightclick) {
            options.rightclick.apply(this, [e]);
          }
          if (window.context_menu[self.el.id]['map'] != undefined) {
            self.buildContextMenu('map', e);
          }
        });
        this.refresh = function () {
          google.maps.event.trigger(this.map, 'resize');
        };
        this.fitZoom = function () {
          var latLngs = [], markers_length = this.markers.length, i;
          for (i = 0; i < markers_length; i++) {
            if (typeof this.markers[i].visible === 'boolean' && this.markers[i].visible) {
              latLngs.push(this.markers[i].getPosition());
            }
          }
          this.fitLatLngBounds(latLngs);
        };
        this.fitLatLngBounds = function (latLngs) {
          var total = latLngs.length;
          var bounds = new google.maps.LatLngBounds();
          for (var i = 0; i < total; i++) {
            bounds.extend(latLngs[i]);
          }
          this.map.fitBounds(bounds);
        };
        this.setCenter = function (lat, lng, callback) {
          this.map.panTo(new google.maps.LatLng(lat, lng));
          if (callback) {
            callback();
          }
        };
        this.getElement = function () {
          return this.el;
        };
        this.zoomIn = function (value) {
          value = value || 1;
          this.zoom = this.map.getZoom() + value;
          this.map.setZoom(this.zoom);
        };
        this.zoomOut = function (value) {
          value = value || 1;
          this.zoom = this.map.getZoom() - value;
          this.map.setZoom(this.zoom);
        };
        var native_methods = [], method;
        for (method in this.map) {
          if (typeof this.map[method] == 'function' && !this[method]) {
            native_methods.push(method);
          }
        }
        for (i = 0; i < native_methods.length; i++) {
          (function (gmaps, scope, method_name) {
            gmaps[method_name] = function () {
              return scope[method_name].apply(scope, arguments);
            };
          }(this, this.map, native_methods[i]));
        }
      };
      return GMaps;
    }(this);
  GMaps.prototype.createControl = function (options) {
    var control = document.createElement('div');
    control.style.cursor = 'pointer';
    if (options.disableDefaultStyles !== true) {
      control.style.fontFamily = 'Roboto, Arial, sans-serif';
      control.style.fontSize = '11px';
      control.style.boxShadow = 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px';
    }
    for (var option in options.style) {
      control.style[option] = options.style[option];
    }
    if (options.id) {
      control.id = options.id;
    }
    if (options.classes) {
      control.className = options.classes;
    }
    if (options.content) {
      control.innerHTML = options.content;
    }
    for (var ev in options.events) {
      (function (object, name) {
        google.maps.event.addDomListener(object, name, function () {
          options.events[name].apply(this, [this]);
        });
      }(control, ev));
    }
    control.index = 1;
    return control;
  };
  GMaps.prototype.addControl = function (options) {
    var position = google.maps.ControlPosition[options.position.toUpperCase()];
    delete options.position;
    var control = this.createControl(options);
    this.controls.push(control);
    this.map.controls[position].push(control);
    return control;
  };
  GMaps.prototype.createMarker = function (options) {
    if (options.lat == undefined && options.lng == undefined && options.position == undefined) {
      throw 'No latitude or longitude defined.';
    }
    var self = this, details = options.details, fences = options.fences, outside = options.outside, base_options = {
        position: new google.maps.LatLng(options.lat, options.lng),
        map: null
      }, marker_options = extend_object(base_options, options);
    delete marker_options.lat;
    delete marker_options.lng;
    delete marker_options.fences;
    delete marker_options.outside;
    var marker = new google.maps.Marker(marker_options);
    marker.fences = fences;
    if (options.infoWindow) {
      marker.infoWindow = new google.maps.InfoWindow(options.infoWindow);
      var info_window_events = [
          'closeclick',
          'content_changed',
          'domready',
          'position_changed',
          'zindex_changed'
        ];
      for (var ev = 0; ev < info_window_events.length; ev++) {
        (function (object, name) {
          if (options.infoWindow[name]) {
            google.maps.event.addListener(object, name, function (e) {
              options.infoWindow[name].apply(this, [e]);
            });
          }
        }(marker.infoWindow, info_window_events[ev]));
      }
    }
    var marker_events = [
        'animation_changed',
        'clickable_changed',
        'cursor_changed',
        'draggable_changed',
        'flat_changed',
        'icon_changed',
        'position_changed',
        'shadow_changed',
        'shape_changed',
        'title_changed',
        'visible_changed',
        'zindex_changed'
      ];
    var marker_events_with_mouse = [
        'dblclick',
        'drag',
        'dragend',
        'dragstart',
        'mousedown',
        'mouseout',
        'mouseover',
        'mouseup'
      ];
    for (var ev = 0; ev < marker_events.length; ev++) {
      (function (object, name) {
        if (options[name]) {
          google.maps.event.addListener(object, name, function () {
            options[name].apply(this, [this]);
          });
        }
      }(marker, marker_events[ev]));
    }
    for (var ev = 0; ev < marker_events_with_mouse.length; ev++) {
      (function (map, object, name) {
        if (options[name]) {
          google.maps.event.addListener(object, name, function (me) {
            if (!me.pixel) {
              me.pixel = map.getProjection().fromLatLngToPoint(me.latLng);
            }
            options[name].apply(this, [me]);
          });
        }
      }(this.map, marker, marker_events_with_mouse[ev]));
    }
    google.maps.event.addListener(marker, 'click', function () {
      this.details = details;
      if (options.click) {
        options.click.apply(this, [this]);
      }
      if (marker.infoWindow) {
        self.hideInfoWindows();
        marker.infoWindow.open(self.map, marker);
      }
    });
    google.maps.event.addListener(marker, 'rightclick', function (e) {
      e.marker = this;
      if (options.rightclick) {
        options.rightclick.apply(this, [e]);
      }
      if (window.context_menu[self.el.id]['marker'] != undefined) {
        self.buildContextMenu('marker', e);
      }
    });
    if (marker.fences) {
      google.maps.event.addListener(marker, 'dragend', function () {
        self.checkMarkerGeofence(marker, function (m, f) {
          outside(m, f);
        });
      });
    }
    return marker;
  };
  GMaps.prototype.addMarker = function (options) {
    var marker;
    if (options.hasOwnProperty('gm_accessors_')) {
      marker = options;
    } else {
      if (options.hasOwnProperty('lat') && options.hasOwnProperty('lng') || options.position) {
        marker = this.createMarker(options);
      } else {
        throw 'No latitude or longitude defined.';
      }
    }
    marker.setMap(this.map);
    if (this.markerClusterer) {
      this.markerClusterer.addMarker(marker);
    }
    this.markers.push(marker);
    GMaps.fire('marker_added', marker, this);
    return marker;
  };
  GMaps.prototype.addMarkers = function (array) {
    for (var i = 0, marker; marker = array[i]; i++) {
      this.addMarker(marker);
    }
    return this.markers;
  };
  GMaps.prototype.hideInfoWindows = function () {
    for (var i = 0, marker; marker = this.markers[i]; i++) {
      if (marker.infoWindow) {
        marker.infoWindow.close();
      }
    }
  };
  GMaps.prototype.removeMarker = function (marker) {
    for (var i = 0; i < this.markers.length; i++) {
      if (this.markers[i] === marker) {
        this.markers[i].setMap(null);
        this.markers.splice(i, 1);
        if (this.markerClusterer) {
          this.markerClusterer.removeMarker(marker);
        }
        GMaps.fire('marker_removed', marker, this);
        break;
      }
    }
    return marker;
  };
  GMaps.prototype.removeMarkers = function (collection) {
    var new_markers = [];
    if (typeof collection == 'undefined') {
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
      this.markers = new_markers;
    } else {
      for (var i = 0; i < collection.length; i++) {
        if (this.markers.indexOf(collection[i]) > -1) {
          this.markers[i].setMap(null);
        }
      }
      for (var i = 0; i < this.markers.length; i++) {
        if (this.markers[i].getMap() != null) {
          new_markers.push(this.markers[i]);
        }
      }
      this.markers = new_markers;
    }
  };
  GMaps.prototype.drawOverlay = function (options) {
    var overlay = new google.maps.OverlayView(), auto_show = true;
    overlay.setMap(this.map);
    if (options.auto_show != null) {
      auto_show = options.auto_show;
    }
    overlay.onAdd = function () {
      var el = document.createElement('div');
      el.style.borderStyle = 'none';
      el.style.borderWidth = '0px';
      el.style.position = 'absolute';
      el.style.zIndex = 100;
      el.innerHTML = options.content;
      overlay.el = el;
      if (!options.layer) {
        options.layer = 'overlayLayer';
      }
      var panes = this.getPanes(), overlayLayer = panes[options.layer], stop_overlay_events = [
          'contextmenu',
          'DOMMouseScroll',
          'dblclick',
          'mousedown'
        ];
      overlayLayer.appendChild(el);
      for (var ev = 0; ev < stop_overlay_events.length; ev++) {
        (function (object, name) {
          google.maps.event.addDomListener(object, name, function (e) {
            if (navigator.userAgent.toLowerCase().indexOf('msie') != -1 && document.all) {
              e.cancelBubble = true;
              e.returnValue = false;
            } else {
              e.stopPropagation();
            }
          });
        }(el, stop_overlay_events[ev]));
      }
      google.maps.event.trigger(this, 'ready');
    };
    overlay.draw = function () {
      var projection = this.getProjection(), pixel = projection.fromLatLngToDivPixel(new google.maps.LatLng(options.lat, options.lng));
      options.horizontalOffset = options.horizontalOffset || 0;
      options.verticalOffset = options.verticalOffset || 0;
      var el = overlay.el, content = el.children[0], content_height = content.clientHeight, content_width = content.clientWidth;
      switch (options.verticalAlign) {
      case 'top':
        el.style.top = pixel.y - content_height + options.verticalOffset + 'px';
        break;
      default:
      case 'middle':
        el.style.top = pixel.y - content_height / 2 + options.verticalOffset + 'px';
        break;
      case 'bottom':
        el.style.top = pixel.y + options.verticalOffset + 'px';
        break;
      }
      switch (options.horizontalAlign) {
      case 'left':
        el.style.left = pixel.x - content_width + options.horizontalOffset + 'px';
        break;
      default:
      case 'center':
        el.style.left = pixel.x - content_width / 2 + options.horizontalOffset + 'px';
        break;
      case 'right':
        el.style.left = pixel.x + options.horizontalOffset + 'px';
        break;
      }
      el.style.display = auto_show ? 'block' : 'none';
      if (!auto_show) {
        options.show.apply(this, [el]);
      }
    };
    overlay.onRemove = function () {
      var el = overlay.el;
      if (options.remove) {
        options.remove.apply(this, [el]);
      } else {
        overlay.el.parentNode.removeChild(overlay.el);
        overlay.el = null;
      }
    };
    this.overlays.push(overlay);
    return overlay;
  };
  GMaps.prototype.removeOverlay = function (overlay) {
    for (var i = 0; i < this.overlays.length; i++) {
      if (this.overlays[i] === overlay) {
        this.overlays[i].setMap(null);
        this.overlays.splice(i, 1);
        break;
      }
    }
  };
  GMaps.prototype.removeOverlays = function () {
    for (var i = 0, item; item = this.overlays[i]; i++) {
      item.setMap(null);
    }
    this.overlays = [];
  };
  GMaps.prototype.drawPolyline = function (options) {
    var path = [], points = options.path;
    if (points.length) {
      if (points[0][0] === undefined) {
        path = points;
      } else {
        for (var i = 0, latlng; latlng = points[i]; i++) {
          path.push(new google.maps.LatLng(latlng[0], latlng[1]));
        }
      }
    }
    var polyline_options = {
        map: this.map,
        path: path,
        strokeColor: options.strokeColor,
        strokeOpacity: options.strokeOpacity,
        strokeWeight: options.strokeWeight,
        geodesic: options.geodesic,
        clickable: true,
        editable: false,
        visible: true
      };
    if (options.hasOwnProperty('clickable')) {
      polyline_options.clickable = options.clickable;
    }
    if (options.hasOwnProperty('editable')) {
      polyline_options.editable = options.editable;
    }
    if (options.hasOwnProperty('icons')) {
      polyline_options.icons = options.icons;
    }
    if (options.hasOwnProperty('zIndex')) {
      polyline_options.zIndex = options.zIndex;
    }
    var polyline = new google.maps.Polyline(polyline_options);
    var polyline_events = [
        'click',
        'dblclick',
        'mousedown',
        'mousemove',
        'mouseout',
        'mouseover',
        'mouseup',
        'rightclick'
      ];
    for (var ev = 0; ev < polyline_events.length; ev++) {
      (function (object, name) {
        if (options[name]) {
          google.maps.event.addListener(object, name, function (e) {
            options[name].apply(this, [e]);
          });
        }
      }(polyline, polyline_events[ev]));
    }
    this.polylines.push(polyline);
    GMaps.fire('polyline_added', polyline, this);
    return polyline;
  };
  GMaps.prototype.removePolyline = function (polyline) {
    for (var i = 0; i < this.polylines.length; i++) {
      if (this.polylines[i] === polyline) {
        this.polylines[i].setMap(null);
        this.polylines.splice(i, 1);
        GMaps.fire('polyline_removed', polyline, this);
        break;
      }
    }
  };
  GMaps.prototype.removePolylines = function () {
    for (var i = 0, item; item = this.polylines[i]; i++) {
      item.setMap(null);
    }
    this.polylines = [];
  };
  GMaps.prototype.drawCircle = function (options) {
    options = extend_object({
      map: this.map,
      center: new google.maps.LatLng(options.lat, options.lng)
    }, options);
    delete options.lat;
    delete options.lng;
    var polygon = new google.maps.Circle(options), polygon_events = [
        'click',
        'dblclick',
        'mousedown',
        'mousemove',
        'mouseout',
        'mouseover',
        'mouseup',
        'rightclick'
      ];
    for (var ev = 0; ev < polygon_events.length; ev++) {
      (function (object, name) {
        if (options[name]) {
          google.maps.event.addListener(object, name, function (e) {
            options[name].apply(this, [e]);
          });
        }
      }(polygon, polygon_events[ev]));
    }
    this.polygons.push(polygon);
    return polygon;
  };
  GMaps.prototype.drawRectangle = function (options) {
    options = extend_object({ map: this.map }, options);
    var latLngBounds = new google.maps.LatLngBounds(new google.maps.LatLng(options.bounds[0][0], options.bounds[0][1]), new google.maps.LatLng(options.bounds[1][0], options.bounds[1][1]));
    options.bounds = latLngBounds;
    var polygon = new google.maps.Rectangle(options), polygon_events = [
        'click',
        'dblclick',
        'mousedown',
        'mousemove',
        'mouseout',
        'mouseover',
        'mouseup',
        'rightclick'
      ];
    for (var ev = 0; ev < polygon_events.length; ev++) {
      (function (object, name) {
        if (options[name]) {
          google.maps.event.addListener(object, name, function (e) {
            options[name].apply(this, [e]);
          });
        }
      }(polygon, polygon_events[ev]));
    }
    this.polygons.push(polygon);
    return polygon;
  };
  GMaps.prototype.drawPolygon = function (options) {
    var useGeoJSON = false;
    if (options.hasOwnProperty('useGeoJSON')) {
      useGeoJSON = options.useGeoJSON;
    }
    delete options.useGeoJSON;
    options = extend_object({ map: this.map }, options);
    if (useGeoJSON == false) {
      options.paths = [options.paths.slice(0)];
    }
    if (options.paths.length > 0) {
      if (options.paths[0].length > 0) {
        options.paths = array_flat(array_map(options.paths, arrayToLatLng, useGeoJSON));
      }
    }
    var polygon = new google.maps.Polygon(options), polygon_events = [
        'click',
        'dblclick',
        'mousedown',
        'mousemove',
        'mouseout',
        'mouseover',
        'mouseup',
        'rightclick'
      ];
    for (var ev = 0; ev < polygon_events.length; ev++) {
      (function (object, name) {
        if (options[name]) {
          google.maps.event.addListener(object, name, function (e) {
            options[name].apply(this, [e]);
          });
        }
      }(polygon, polygon_events[ev]));
    }
    this.polygons.push(polygon);
    GMaps.fire('polygon_added', polygon, this);
    return polygon;
  };
  GMaps.prototype.removePolygon = function (polygon) {
    for (var i = 0; i < this.polygons.length; i++) {
      if (this.polygons[i] === polygon) {
        this.polygons[i].setMap(null);
        this.polygons.splice(i, 1);
        GMaps.fire('polygon_removed', polygon, this);
        break;
      }
    }
  };
  GMaps.prototype.removePolygons = function () {
    for (var i = 0, item; item = this.polygons[i]; i++) {
      item.setMap(null);
    }
    this.polygons = [];
  };
  GMaps.prototype.getFromFusionTables = function (options) {
    var events = options.events;
    delete options.events;
    var fusion_tables_options = options, layer = new google.maps.FusionTablesLayer(fusion_tables_options);
    for (var ev in events) {
      (function (object, name) {
        google.maps.event.addListener(object, name, function (e) {
          events[name].apply(this, [e]);
        });
      }(layer, ev));
    }
    this.layers.push(layer);
    return layer;
  };
  GMaps.prototype.loadFromFusionTables = function (options) {
    var layer = this.getFromFusionTables(options);
    layer.setMap(this.map);
    return layer;
  };
  GMaps.prototype.getFromKML = function (options) {
    var url = options.url, events = options.events;
    delete options.url;
    delete options.events;
    var kml_options = options, layer = new google.maps.KmlLayer(url, kml_options);
    for (var ev in events) {
      (function (object, name) {
        google.maps.event.addListener(object, name, function (e) {
          events[name].apply(this, [e]);
        });
      }(layer, ev));
    }
    this.layers.push(layer);
    return layer;
  };
  GMaps.prototype.loadFromKML = function (options) {
    var layer = this.getFromKML(options);
    layer.setMap(this.map);
    return layer;
  };
  GMaps.prototype.addLayer = function (layerName, options) {
    options = options || {};
    var layer;
    switch (layerName) {
    case 'weather':
      this.singleLayers.weather = layer = new google.maps.weather.WeatherLayer();
      break;
    case 'clouds':
      this.singleLayers.clouds = layer = new google.maps.weather.CloudLayer();
      break;
    case 'traffic':
      this.singleLayers.traffic = layer = new google.maps.TrafficLayer();
      break;
    case 'transit':
      this.singleLayers.transit = layer = new google.maps.TransitLayer();
      break;
    case 'bicycling':
      this.singleLayers.bicycling = layer = new google.maps.BicyclingLayer();
      break;
    case 'panoramio':
      this.singleLayers.panoramio = layer = new google.maps.panoramio.PanoramioLayer();
      layer.setTag(options.filter);
      delete options.filter;
      if (options.click) {
        google.maps.event.addListener(layer, 'click', function (event) {
          options.click(event);
          delete options.click;
        });
      }
      break;
    case 'places':
      this.singleLayers.places = layer = new google.maps.places.PlacesService(this.map);
      if (options.search || options.nearbySearch || options.radarSearch) {
        var placeSearchRequest = {
            bounds: options.bounds || null,
            keyword: options.keyword || null,
            location: options.location || null,
            name: options.name || null,
            radius: options.radius || null,
            rankBy: options.rankBy || null,
            types: options.types || null
          };
        if (options.radarSearch) {
          layer.radarSearch(placeSearchRequest, options.radarSearch);
        }
        if (options.search) {
          layer.search(placeSearchRequest, options.search);
        }
        if (options.nearbySearch) {
          layer.nearbySearch(placeSearchRequest, options.nearbySearch);
        }
      }
      if (options.textSearch) {
        var textSearchRequest = {
            bounds: options.bounds || null,
            location: options.location || null,
            query: options.query || null,
            radius: options.radius || null
          };
        layer.textSearch(textSearchRequest, options.textSearch);
      }
      break;
    }
    if (layer !== undefined) {
      if (typeof layer.setOptions == 'function') {
        layer.setOptions(options);
      }
      if (typeof layer.setMap == 'function') {
        layer.setMap(this.map);
      }
      return layer;
    }
  };
  GMaps.prototype.removeLayer = function (layer) {
    if (typeof layer == 'string' && this.singleLayers[layer] !== undefined) {
      this.singleLayers[layer].setMap(null);
      delete this.singleLayers[layer];
    } else {
      for (var i = 0; i < this.layers.length; i++) {
        if (this.layers[i] === layer) {
          this.layers[i].setMap(null);
          this.layers.splice(i, 1);
          break;
        }
      }
    }
  };
  var travelMode, unitSystem;
  GMaps.prototype.getRoutes = function (options) {
    switch (options.travelMode) {
    case 'bicycling':
      travelMode = google.maps.TravelMode.BICYCLING;
      break;
    case 'transit':
      travelMode = google.maps.TravelMode.TRANSIT;
      break;
    case 'driving':
      travelMode = google.maps.TravelMode.DRIVING;
      break;
    default:
      travelMode = google.maps.TravelMode.WALKING;
      break;
    }
    if (options.unitSystem === 'imperial') {
      unitSystem = google.maps.UnitSystem.IMPERIAL;
    } else {
      unitSystem = google.maps.UnitSystem.METRIC;
    }
    var base_options = {
        avoidHighways: false,
        avoidTolls: false,
        optimizeWaypoints: false,
        waypoints: []
      }, request_options = extend_object(base_options, options);
    request_options.origin = /string/.test(typeof options.origin) ? options.origin : new google.maps.LatLng(options.origin[0], options.origin[1]);
    request_options.destination = /string/.test(typeof options.destination) ? options.destination : new google.maps.LatLng(options.destination[0], options.destination[1]);
    request_options.travelMode = travelMode;
    request_options.unitSystem = unitSystem;
    delete request_options.callback;
    delete request_options.error;
    var self = this, service = new google.maps.DirectionsService();
    service.route(request_options, function (result, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        for (var r in result.routes) {
          if (result.routes.hasOwnProperty(r)) {
            self.routes.push(result.routes[r]);
          }
        }
        if (options.callback) {
          options.callback(self.routes);
        }
      } else {
        if (options.error) {
          options.error(result, status);
        }
      }
    });
  };
  GMaps.prototype.removeRoutes = function () {
    this.routes = [];
  };
  GMaps.prototype.getElevations = function (options) {
    options = extend_object({
      locations: [],
      path: false,
      samples: 256
    }, options);
    if (options.locations.length > 0) {
      if (options.locations[0].length > 0) {
        options.locations = array_flat(array_map([options.locations], arrayToLatLng, false));
      }
    }
    var callback = options.callback;
    delete options.callback;
    var service = new google.maps.ElevationService();
    if (!options.path) {
      delete options.path;
      delete options.samples;
      service.getElevationForLocations(options, function (result, status) {
        if (callback && typeof callback === 'function') {
          callback(result, status);
        }
      });
    } else {
      var pathRequest = {
          path: options.locations,
          samples: options.samples
        };
      service.getElevationAlongPath(pathRequest, function (result, status) {
        if (callback && typeof callback === 'function') {
          callback(result, status);
        }
      });
    }
  };
  GMaps.prototype.cleanRoute = GMaps.prototype.removePolylines;
  GMaps.prototype.drawRoute = function (options) {
    var self = this;
    this.getRoutes({
      origin: options.origin,
      destination: options.destination,
      travelMode: options.travelMode,
      waypoints: options.waypoints,
      unitSystem: options.unitSystem,
      error: options.error,
      callback: function (e) {
        if (e.length > 0) {
          self.drawPolyline({
            path: e[e.length - 1].overview_path,
            strokeColor: options.strokeColor,
            strokeOpacity: options.strokeOpacity,
            strokeWeight: options.strokeWeight
          });
          if (options.callback) {
            options.callback(e[e.length - 1]);
          }
        }
      }
    });
  };
  GMaps.prototype.travelRoute = function (options) {
    if (options.origin && options.destination) {
      this.getRoutes({
        origin: options.origin,
        destination: options.destination,
        travelMode: options.travelMode,
        waypoints: options.waypoints,
        error: options.error,
        callback: function (e) {
          if (e.length > 0 && options.start) {
            options.start(e[e.length - 1]);
          }
          if (e.length > 0 && options.step) {
            var route = e[e.length - 1];
            if (route.legs.length > 0) {
              var steps = route.legs[0].steps;
              for (var i = 0, step; step = steps[i]; i++) {
                step.step_number = i;
                options.step(step, route.legs[0].steps.length - 1);
              }
            }
          }
          if (e.length > 0 && options.end) {
            options.end(e[e.length - 1]);
          }
        }
      });
    } else if (options.route) {
      if (options.route.legs.length > 0) {
        var steps = options.route.legs[0].steps;
        for (var i = 0, step; step = steps[i]; i++) {
          step.step_number = i;
          options.step(step);
        }
      }
    }
  };
  GMaps.prototype.drawSteppedRoute = function (options) {
    var self = this;
    if (options.origin && options.destination) {
      this.getRoutes({
        origin: options.origin,
        destination: options.destination,
        travelMode: options.travelMode,
        waypoints: options.waypoints,
        error: options.error,
        callback: function (e) {
          if (e.length > 0 && options.start) {
            options.start(e[e.length - 1]);
          }
          if (e.length > 0 && options.step) {
            var route = e[e.length - 1];
            if (route.legs.length > 0) {
              var steps = route.legs[0].steps;
              for (var i = 0, step; step = steps[i]; i++) {
                step.step_number = i;
                self.drawPolyline({
                  path: step.path,
                  strokeColor: options.strokeColor,
                  strokeOpacity: options.strokeOpacity,
                  strokeWeight: options.strokeWeight
                });
                options.step(step, route.legs[0].steps.length - 1);
              }
            }
          }
          if (e.length > 0 && options.end) {
            options.end(e[e.length - 1]);
          }
        }
      });
    } else if (options.route) {
      if (options.route.legs.length > 0) {
        var steps = options.route.legs[0].steps;
        for (var i = 0, step; step = steps[i]; i++) {
          step.step_number = i;
          self.drawPolyline({
            path: step.path,
            strokeColor: options.strokeColor,
            strokeOpacity: options.strokeOpacity,
            strokeWeight: options.strokeWeight
          });
          options.step(step);
        }
      }
    }
  };
  GMaps.Route = function (options) {
    this.origin = options.origin;
    this.destination = options.destination;
    this.waypoints = options.waypoints;
    this.map = options.map;
    this.route = options.route;
    this.step_count = 0;
    this.steps = this.route.legs[0].steps;
    this.steps_length = this.steps.length;
    this.polyline = this.map.drawPolyline({
      path: new google.maps.MVCArray(),
      strokeColor: options.strokeColor,
      strokeOpacity: options.strokeOpacity,
      strokeWeight: options.strokeWeight
    }).getPath();
  };
  GMaps.Route.prototype.getRoute = function (options) {
    var self = this;
    this.map.getRoutes({
      origin: this.origin,
      destination: this.destination,
      travelMode: options.travelMode,
      waypoints: this.waypoints || [],
      error: options.error,
      callback: function () {
        self.route = e[0];
        if (options.callback) {
          options.callback.call(self);
        }
      }
    });
  };
  GMaps.Route.prototype.back = function () {
    if (this.step_count > 0) {
      this.step_count--;
      var path = this.route.legs[0].steps[this.step_count].path;
      for (var p in path) {
        if (path.hasOwnProperty(p)) {
          this.polyline.pop();
        }
      }
    }
  };
  GMaps.Route.prototype.forward = function () {
    if (this.step_count < this.steps_length) {
      var path = this.route.legs[0].steps[this.step_count].path;
      for (var p in path) {
        if (path.hasOwnProperty(p)) {
          this.polyline.push(path[p]);
        }
      }
      this.step_count++;
    }
  };
  GMaps.prototype.checkGeofence = function (lat, lng, fence) {
    return fence.containsLatLng(new google.maps.LatLng(lat, lng));
  };
  GMaps.prototype.checkMarkerGeofence = function (marker, outside_callback) {
    if (marker.fences) {
      for (var i = 0, fence; fence = marker.fences[i]; i++) {
        var pos = marker.getPosition();
        if (!this.checkGeofence(pos.lat(), pos.lng(), fence)) {
          outside_callback(marker, fence);
        }
      }
    }
  };
  GMaps.prototype.toImage = function (options) {
    var options = options || {}, static_map_options = {};
    static_map_options['size'] = options['size'] || [
      this.el.clientWidth,
      this.el.clientHeight
    ];
    static_map_options['lat'] = this.getCenter().lat();
    static_map_options['lng'] = this.getCenter().lng();
    if (this.markers.length > 0) {
      static_map_options['markers'] = [];
      for (var i = 0; i < this.markers.length; i++) {
        static_map_options['markers'].push({
          lat: this.markers[i].getPosition().lat(),
          lng: this.markers[i].getPosition().lng()
        });
      }
    }
    if (this.polylines.length > 0) {
      var polyline = this.polylines[0];
      static_map_options['polyline'] = {};
      static_map_options['polyline']['path'] = google.maps.geometry.encoding.encodePath(polyline.getPath());
      static_map_options['polyline']['strokeColor'] = polyline.strokeColor;
      static_map_options['polyline']['strokeOpacity'] = polyline.strokeOpacity;
      static_map_options['polyline']['strokeWeight'] = polyline.strokeWeight;
    }
    return GMaps.staticMapURL(static_map_options);
  };
  GMaps.staticMapURL = function (options) {
    var parameters = [], data, static_root = 'http://maps.googleapis.com/maps/api/staticmap';
    if (options.url) {
      static_root = options.url;
      delete options.url;
    }
    static_root += '?';
    var markers = options.markers;
    delete options.markers;
    if (!markers && options.marker) {
      markers = [options.marker];
      delete options.marker;
    }
    var styles = options.styles;
    delete options.styles;
    var polyline = options.polyline;
    delete options.polyline;
    if (options.center) {
      parameters.push('center=' + options.center);
      delete options.center;
    } else if (options.address) {
      parameters.push('center=' + options.address);
      delete options.address;
    } else if (options.lat) {
      parameters.push([
        'center=',
        options.lat,
        ',',
        options.lng
      ].join(''));
      delete options.lat;
      delete options.lng;
    } else if (options.visible) {
      var visible = encodeURI(options.visible.join('|'));
      parameters.push('visible=' + visible);
    }
    var size = options.size;
    if (size) {
      if (size.join) {
        size = size.join('x');
      }
      delete options.size;
    } else {
      size = '630x300';
    }
    parameters.push('size=' + size);
    if (!options.zoom && options.zoom !== false) {
      options.zoom = 15;
    }
    var sensor = options.hasOwnProperty('sensor') ? !!options.sensor : true;
    delete options.sensor;
    parameters.push('sensor=' + sensor);
    for (var param in options) {
      if (options.hasOwnProperty(param)) {
        parameters.push(param + '=' + options[param]);
      }
    }
    if (markers) {
      var marker, loc;
      for (var i = 0; data = markers[i]; i++) {
        marker = [];
        if (data.size && data.size !== 'normal') {
          marker.push('size:' + data.size);
          delete data.size;
        } else if (data.icon) {
          marker.push('icon:' + encodeURI(data.icon));
          delete data.icon;
        }
        if (data.color) {
          marker.push('color:' + data.color.replace('#', '0x'));
          delete data.color;
        }
        if (data.label) {
          marker.push('label:' + data.label[0].toUpperCase());
          delete data.label;
        }
        loc = data.address ? data.address : data.lat + ',' + data.lng;
        delete data.address;
        delete data.lat;
        delete data.lng;
        for (var param in data) {
          if (data.hasOwnProperty(param)) {
            marker.push(param + ':' + data[param]);
          }
        }
        if (marker.length || i === 0) {
          marker.push(loc);
          marker = marker.join('|');
          parameters.push('markers=' + encodeURI(marker));
        } else {
          marker = parameters.pop() + encodeURI('|' + loc);
          parameters.push(marker);
        }
      }
    }
    if (styles) {
      for (var i = 0; i < styles.length; i++) {
        var styleRule = [];
        if (styles[i].featureType && styles[i].featureType != 'all') {
          styleRule.push('feature:' + styles[i].featureType);
        }
        if (styles[i].elementType && styles[i].elementType != 'all') {
          styleRule.push('element:' + styles[i].elementType);
        }
        for (var j = 0; j < styles[i].stylers.length; j++) {
          for (var p in styles[i].stylers[j]) {
            var ruleArg = styles[i].stylers[j][p];
            if (p == 'hue' || p == 'color') {
              ruleArg = '0x' + ruleArg.substring(1);
            }
            styleRule.push(p + ':' + ruleArg);
          }
        }
        var rule = styleRule.join('|');
        if (rule != '') {
          parameters.push('style=' + rule);
        }
      }
    }
    function parseColor(color, opacity) {
      if (color[0] === '#') {
        color = color.replace('#', '0x');
        if (opacity) {
          opacity = parseFloat(opacity);
          opacity = Math.min(1, Math.max(opacity, 0));
          if (opacity === 0) {
            return '0x00000000';
          }
          opacity = (opacity * 255).toString(16);
          if (opacity.length === 1) {
            opacity += opacity;
          }
          color = color.slice(0, 8) + opacity;
        }
      }
      return color;
    }
    if (polyline) {
      data = polyline;
      polyline = [];
      if (data.strokeWeight) {
        polyline.push('weight:' + parseInt(data.strokeWeight, 10));
      }
      if (data.strokeColor) {
        var color = parseColor(data.strokeColor, data.strokeOpacity);
        polyline.push('color:' + color);
      }
      if (data.fillColor) {
        var fillcolor = parseColor(data.fillColor, data.fillOpacity);
        polyline.push('fillcolor:' + fillcolor);
      }
      var path = data.path;
      if (path.join) {
        for (var j = 0, pos; pos = path[j]; j++) {
          polyline.push(pos.join(','));
        }
      } else {
        polyline.push('enc:' + path);
      }
      polyline = polyline.join('|');
      parameters.push('path=' + encodeURI(polyline));
    }
    var dpi = window.devicePixelRatio || 1;
    parameters.push('scale=' + dpi);
    parameters = parameters.join('&');
    return static_root + parameters;
  };
  GMaps.prototype.addMapType = function (mapTypeId, options) {
    if (options.hasOwnProperty('getTileUrl') && typeof options['getTileUrl'] == 'function') {
      options.tileSize = options.tileSize || new google.maps.Size(256, 256);
      var mapType = new google.maps.ImageMapType(options);
      this.map.mapTypes.set(mapTypeId, mapType);
    } else {
      throw '\'getTileUrl\' function required.';
    }
  };
  GMaps.prototype.addOverlayMapType = function (options) {
    if (options.hasOwnProperty('getTile') && typeof options['getTile'] == 'function') {
      var overlayMapTypeIndex = options.index;
      delete options.index;
      this.map.overlayMapTypes.insertAt(overlayMapTypeIndex, options);
    } else {
      throw '\'getTile\' function required.';
    }
  };
  GMaps.prototype.removeOverlayMapType = function (overlayMapTypeIndex) {
    this.map.overlayMapTypes.removeAt(overlayMapTypeIndex);
  };
  GMaps.prototype.addStyle = function (options) {
    var styledMapType = new google.maps.StyledMapType(options.styles, { name: options.styledMapName });
    this.map.mapTypes.set(options.mapTypeId, styledMapType);
  };
  GMaps.prototype.setStyle = function (mapTypeId) {
    this.map.setMapTypeId(mapTypeId);
  };
  GMaps.prototype.createPanorama = function (streetview_options) {
    if (!streetview_options.hasOwnProperty('lat') || !streetview_options.hasOwnProperty('lng')) {
      streetview_options.lat = this.getCenter().lat();
      streetview_options.lng = this.getCenter().lng();
    }
    this.panorama = GMaps.createPanorama(streetview_options);
    this.map.setStreetView(this.panorama);
    return this.panorama;
  };
  GMaps.createPanorama = function (options) {
    var el = getElementById(options.el, options.context);
    options.position = new google.maps.LatLng(options.lat, options.lng);
    delete options.el;
    delete options.context;
    delete options.lat;
    delete options.lng;
    var streetview_events = [
        'closeclick',
        'links_changed',
        'pano_changed',
        'position_changed',
        'pov_changed',
        'resize',
        'visible_changed'
      ], streetview_options = extend_object({ visible: true }, options);
    for (var i = 0; i < streetview_events.length; i++) {
      delete streetview_options[streetview_events[i]];
    }
    var panorama = new google.maps.StreetViewPanorama(el, streetview_options);
    for (var i = 0; i < streetview_events.length; i++) {
      (function (object, name) {
        if (options[name]) {
          google.maps.event.addListener(object, name, function () {
            options[name].apply(this);
          });
        }
      }(panorama, streetview_events[i]));
    }
    return panorama;
  };
  GMaps.prototype.on = function (event_name, handler) {
    return GMaps.on(event_name, this, handler);
  };
  GMaps.prototype.off = function (event_name) {
    GMaps.off(event_name, this);
  };
  GMaps.custom_events = [
    'marker_added',
    'marker_removed',
    'polyline_added',
    'polyline_removed',
    'polygon_added',
    'polygon_removed',
    'geolocated',
    'geolocation_failed'
  ];
  GMaps.on = function (event_name, object, handler) {
    if (GMaps.custom_events.indexOf(event_name) == -1) {
      return google.maps.event.addListener(object, event_name, handler);
    } else {
      var registered_event = {
          handler: handler,
          eventName: event_name
        };
      object.registered_events[event_name] = object.registered_events[event_name] || [];
      object.registered_events[event_name].push(registered_event);
      return registered_event;
    }
  };
  GMaps.off = function (event_name, object) {
    if (GMaps.custom_events.indexOf(event_name) == -1) {
      google.maps.event.clearListeners(object, event_name);
    } else {
      object.registered_events[event_name] = [];
    }
  };
  GMaps.fire = function (event_name, object, scope) {
    if (GMaps.custom_events.indexOf(event_name) == -1) {
      google.maps.event.trigger(object, event_name, Array.prototype.slice.apply(arguments).slice(2));
    } else {
      if (event_name in scope.registered_events) {
        var firing_events = scope.registered_events[event_name];
        for (var i = 0; i < firing_events.length; i++) {
          (function (handler, scope, object) {
            handler.apply(scope, [object]);
          }(firing_events[i]['handler'], scope, object));
        }
      }
    }
  };
  GMaps.geolocate = function (options) {
    var complete_callback = options.always || options.complete;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        options.success(position);
        if (complete_callback) {
          complete_callback();
        }
      }, function (error) {
        options.error(error);
        if (complete_callback) {
          complete_callback();
        }
      }, options.options);
    } else {
      options.not_supported();
      if (complete_callback) {
        complete_callback();
      }
    }
  };
  GMaps.geocode = function (options) {
    this.geocoder = new google.maps.Geocoder();
    var callback = options.callback;
    if (options.hasOwnProperty('lat') && options.hasOwnProperty('lng')) {
      options.latLng = new google.maps.LatLng(options.lat, options.lng);
    }
    delete options.lat;
    delete options.lng;
    delete options.callback;
    this.geocoder.geocode(options, function (results, status) {
      callback(results, status);
    });
  };
  if (!google.maps.Polygon.prototype.getBounds) {
    google.maps.Polygon.prototype.getBounds = function (latLng) {
      var bounds = new google.maps.LatLngBounds();
      var paths = this.getPaths();
      var path;
      for (var p = 0; p < paths.getLength(); p++) {
        path = paths.getAt(p);
        for (var i = 0; i < path.getLength(); i++) {
          bounds.extend(path.getAt(i));
        }
      }
      return bounds;
    };
  }
  if (!google.maps.Polygon.prototype.containsLatLng) {
    google.maps.Polygon.prototype.containsLatLng = function (latLng) {
      var bounds = this.getBounds();
      if (bounds !== null && !bounds.contains(latLng)) {
        return false;
      }
      var inPoly = false;
      var numPaths = this.getPaths().getLength();
      for (var p = 0; p < numPaths; p++) {
        var path = this.getPaths().getAt(p);
        var numPoints = path.getLength();
        var j = numPoints - 1;
        for (var i = 0; i < numPoints; i++) {
          var vertex1 = path.getAt(i);
          var vertex2 = path.getAt(j);
          if (vertex1.lng() < latLng.lng() && vertex2.lng() >= latLng.lng() || vertex2.lng() < latLng.lng() && vertex1.lng() >= latLng.lng()) {
            if (vertex1.lat() + (latLng.lng() - vertex1.lng()) / (vertex2.lng() - vertex1.lng()) * (vertex2.lat() - vertex1.lat()) < latLng.lat()) {
              inPoly = !inPoly;
            }
          }
          j = i;
        }
      }
      return inPoly;
    };
  }
  google.maps.LatLngBounds.prototype.containsLatLng = function (latLng) {
    return this.contains(latLng);
  };
  google.maps.Marker.prototype.setFences = function (fences) {
    this.fences = fences;
  };
  google.maps.Marker.prototype.addFence = function (fence) {
    this.fences.push(fence);
  };
  google.maps.Marker.prototype.getId = function () {
    return this['__gm_id'];
  };
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement) {
      'use strict';
      if (this == null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = 0;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) {
          n = 0;
        } else if (n != 0 && n != Infinity && n != -Infinity) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
        return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (; k < len; k++) {
        if (k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    };
  }
  return GMaps;
}));
(function (angular, factory) {
  if (typeof define === 'function' && define.amd) {
    define('angular-file-upload', ['angular'], function (angular) {
      return factory(angular);
    });
  } else {
    return factory(angular);
  }
}(angular || null, function (angular) {
  var app = angular.module('angularFileUpload', []);
  app.directive('ngFileDrop', [
    '$fileUploader',
    function ($fileUploader) {
      'use strict';
      return {
        link: !$fileUploader.isHTML5 ? angular.noop : function (scope, element, attributes) {
          element.bind('drop', function (event) {
            var dataTransfer = event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
            if (!dataTransfer)
              return;
            event.preventDefault();
            event.stopPropagation();
            scope.$broadcast('file:removeoverclass');
            scope.$emit('file:add', dataTransfer.files, scope.$eval(attributes.ngFileDrop));
          }).bind('dragover', function (event) {
            var dataTransfer = event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
            event.preventDefault();
            event.stopPropagation();
            dataTransfer.dropEffect = 'copy';
            scope.$broadcast('file:addoverclass');
          }).bind('dragleave', function () {
            scope.$broadcast('file:removeoverclass');
          });
        }
      };
    }
  ]);
  app.directive('ngFileOver', function () {
    'use strict';
    return {
      link: function (scope, element, attributes) {
        scope.$on('file:addoverclass', function () {
          element.addClass(attributes.ngFileOver || 'ng-file-over');
        });
        scope.$on('file:removeoverclass', function () {
          element.removeClass(attributes.ngFileOver || 'ng-file-over');
        });
      }
    };
  });
  app.directive('ngFileSelect', [
    '$fileUploader',
    function ($fileUploader) {
      'use strict';
      return {
        link: function (scope, element, attributes) {
          $fileUploader.isHTML5 || element.removeAttr('multiple');
          element.bind('change', function () {
            scope.$emit('file:add', $fileUploader.isHTML5 ? this.files : this, scope.$eval(attributes.ngFileSelect));
            $fileUploader.isHTML5 && element.attr('multiple') && element.prop('value', null);
          });
          element.prop('value', null);
        }
      };
    }
  ]);
  app.factory('$fileUploader', [
    '$compile',
    '$rootScope',
    '$http',
    '$window',
    function ($compile, $rootScope, $http, $window) {
      'use strict';
      function Uploader(params) {
        angular.extend(this, {
          scope: $rootScope,
          url: '/',
          alias: 'file',
          queue: [],
          headers: {},
          progress: null,
          autoUpload: false,
          removeAfterUpload: false,
          method: 'POST',
          filters: [],
          formData: [],
          isUploading: false,
          queueLimit: Number.MAX_VALUE,
          _nextIndex: 0,
          _timestamp: Date.now()
        }, params);
        this.filters.unshift(this._emptyFileFilter);
        this.filters.unshift(this._queueLimitFilter);
        this.scope.$on('file:add', function (event, items, options) {
          event.stopPropagation();
          this.addToQueue(items, options);
        }.bind(this));
        this.bind('beforeupload', Item.prototype._beforeupload);
        this.bind('in:progress', Item.prototype._progress);
        this.bind('in:success', Item.prototype._success);
        this.bind('in:cancel', Item.prototype._cancel);
        this.bind('in:error', Item.prototype._error);
        this.bind('in:complete', Item.prototype._complete);
        this.bind('in:progress', this._progress);
        this.bind('in:complete', this._complete);
      }
      Uploader.prototype = {
        constructor: Uploader,
        _emptyFileFilter: function (item) {
          return angular.isElement(item) ? true : !!item.size;
        },
        _queueLimitFilter: function () {
          return this.queue.length < this.queueLimit;
        },
        bind: function (event, handler) {
          return this.scope.$on(this._timestamp + ':' + event, handler.bind(this));
        },
        trigger: function (event, some) {
          arguments[0] = this._timestamp + ':' + event;
          this.scope.$broadcast.apply(this.scope, arguments);
        },
        isHTML5: !!($window.File && $window.FormData),
        addToQueue: function (items, options) {
          var length = this.queue.length;
          var list = 'length' in items ? items : [items];
          angular.forEach(list, function (file) {
            var isValid = !this.filters.length ? true : this.filters.every(function (filter) {
                return filter.call(this, file);
              }, this);
            var item = new Item(angular.extend({
                url: this.url,
                alias: this.alias,
                headers: angular.copy(this.headers),
                formData: angular.copy(this.formData),
                removeAfterUpload: this.removeAfterUpload,
                method: this.method,
                uploader: this,
                file: file
              }, options));
            if (isValid) {
              this.queue.push(item);
              this.trigger('afteraddingfile', item);
            } else {
              this.trigger('whenaddingfilefailed', item);
            }
          }, this);
          if (this.queue.length !== length) {
            this.trigger('afteraddingall', this.queue);
            this.progress = this._getTotalProgress();
          }
          this._render();
          this.autoUpload && this.uploadAll();
        },
        removeFromQueue: function (value) {
          var index = this.getIndexOfItem(value);
          var item = this.queue[index];
          item.isUploading && item.cancel();
          this.queue.splice(index, 1);
          item._destroy();
          this.progress = this._getTotalProgress();
        },
        clearQueue: function () {
          this.queue.forEach(function (item) {
            item.isUploading && item.cancel();
            item._destroy();
          }, this);
          this.queue.length = 0;
          this.progress = 0;
        },
        getIndexOfItem: function (value) {
          return angular.isObject(value) ? this.queue.indexOf(value) : value;
        },
        getNotUploadedItems: function () {
          return this.queue.filter(function (item) {
            return !item.isUploaded;
          });
        },
        getReadyItems: function () {
          return this.queue.filter(function (item) {
            return item.isReady && !item.isUploading;
          }).sort(function (item1, item2) {
            return item1.index - item2.index;
          });
        },
        uploadItem: function (value) {
          var index = this.getIndexOfItem(value);
          var item = this.queue[index];
          var transport = this.isHTML5 ? '_xhrTransport' : '_iframeTransport';
          item.index = item.index || this._nextIndex++;
          item.isReady = true;
          if (this.isUploading) {
            return;
          }
          this.isUploading = true;
          this[transport](item);
        },
        cancelItem: function (value) {
          var index = this.getIndexOfItem(value);
          var item = this.queue[index];
          var prop = this.isHTML5 ? '_xhr' : '_form';
          item[prop] && item[prop].abort();
        },
        uploadAll: function () {
          var items = this.getNotUploadedItems().filter(function (item) {
              return !item.isUploading;
            });
          items.forEach(function (item) {
            item.index = item.index || this._nextIndex++;
            item.isReady = true;
          }, this);
          items.length && this.uploadItem(items[0]);
        },
        cancelAll: function () {
          this.getNotUploadedItems().forEach(function (item) {
            this.cancelItem(item);
          }, this);
        },
        _render: function () {
          this.scope.$$phase || this.scope.$digest();
        },
        _getTotalProgress: function (value) {
          if (this.removeAfterUpload) {
            return value || 0;
          }
          var notUploaded = this.getNotUploadedItems().length;
          var uploaded = notUploaded ? this.queue.length - notUploaded : this.queue.length;
          var ratio = 100 / this.queue.length;
          var current = (value || 0) * ratio / 100;
          return Math.round(uploaded * ratio + current);
        },
        _progress: function (event, item, progress) {
          var result = this._getTotalProgress(progress);
          this.trigger('progressall', result);
          this.progress = result;
          this._render();
        },
        _complete: function () {
          var item = this.getReadyItems()[0];
          this.isUploading = false;
          if (angular.isDefined(item)) {
            this.uploadItem(item);
            return;
          }
          this.trigger('completeall', this.queue);
          this.progress = this._getTotalProgress();
          this._render();
        },
        _xhrTransport: function (item) {
          var xhr = item._xhr = new XMLHttpRequest();
          var form = new FormData();
          var that = this;
          this.trigger('beforeupload', item);
          item.formData.forEach(function (obj) {
            angular.forEach(obj, function (value, key) {
              form.append(key, value);
            });
          });
          form.append(item.alias, item.file);
          xhr.upload.onprogress = function (event) {
            var progress = event.lengthComputable ? event.loaded * 100 / event.total : 0;
            that.trigger('in:progress', item, Math.round(progress));
          };
          xhr.onload = function () {
            var response = that._transformResponse(xhr.response);
            var event = that._isSuccessCode(xhr.status) ? 'success' : 'error';
            that.trigger('in:' + event, xhr, item, response);
            that.trigger('in:complete', xhr, item, response);
          };
          xhr.onerror = function () {
            that.trigger('in:error', xhr, item);
            that.trigger('in:complete', xhr, item);
          };
          xhr.onabort = function () {
            that.trigger('in:cancel', xhr, item);
            that.trigger('in:complete', xhr, item);
          };
          xhr.open(item.method, item.url, true);
          angular.forEach(item.headers, function (value, name) {
            xhr.setRequestHeader(name, value);
          });
          xhr.send(form);
        },
        _iframeTransport: function (item) {
          var form = angular.element('<form style="display: none;" />');
          var iframe = angular.element('<iframe name="iframeTransport' + Date.now() + '">');
          var input = item._input;
          var that = this;
          item._form && item._form.replaceWith(input);
          item._form = form;
          this.trigger('beforeupload', item);
          input.prop('name', item.alias);
          item.formData.forEach(function (obj) {
            angular.forEach(obj, function (value, key) {
              form.append(angular.element('<input type="hidden" name="' + key + '" value="' + value + '" />'));
            });
          });
          form.prop({
            action: item.url,
            method: item.method,
            target: iframe.prop('name'),
            enctype: 'multipart/form-data',
            encoding: 'multipart/form-data'
          });
          iframe.bind('load', function () {
            var html = iframe[0].contentDocument.body.innerHTML;
            var xhr = {
                response: html,
                status: 200,
                dummy: true
              };
            var response = that._transformResponse(xhr.response);
            that.trigger('in:success', xhr, item, response);
            that.trigger('in:complete', xhr, item, response);
          });
          form.abort = function () {
            var xhr = {
                status: 0,
                dummy: true
              };
            iframe.unbind('load').prop('src', 'javascript:false;');
            form.replaceWith(input);
            that.trigger('in:cancel', xhr, item);
            that.trigger('in:complete', xhr, item);
          };
          input.after(form);
          form.append(input).append(iframe);
          form[0].submit();
        },
        _isSuccessCode: function (status) {
          return status >= 200 && status < 300 || status === 304;
        },
        _transformResponse: function (response) {
          $http.defaults.transformResponse.forEach(function (transformFn) {
            response = transformFn(response);
          });
          return response;
        }
      };
      function Item(params) {
        if (!Uploader.prototype.isHTML5) {
          var input = angular.element(params.file);
          var clone = $compile(input.clone())(params.uploader.scope);
          var value = input.val();
          params.file = {
            lastModifiedDate: null,
            size: null,
            type: 'like/' + value.slice(value.lastIndexOf('.') + 1).toLowerCase(),
            name: value.slice(value.lastIndexOf('/') + value.lastIndexOf('\\') + 2)
          };
          params._input = input;
          clone.prop('value', null);
          input.css('display', 'none').after(clone);
        }
        angular.extend(this, {
          isReady: false,
          isUploading: false,
          isUploaded: false,
          isSuccess: false,
          isCancel: false,
          isError: false,
          progress: null,
          index: null
        }, params);
      }
      Item.prototype = {
        constructor: Item,
        remove: function () {
          this.uploader.removeFromQueue(this);
        },
        upload: function () {
          this.uploader.uploadItem(this);
        },
        cancel: function () {
          this.uploader.cancelItem(this);
        },
        _destroy: function () {
          this._form && this._form.remove();
          this._input && this._input.remove();
          delete this._form;
          delete this._input;
        },
        _beforeupload: function (event, item) {
          item.isReady = true;
          item.isUploading = true;
          item.isUploaded = false;
          item.isSuccess = false;
          item.isCancel = false;
          item.isError = false;
          item.progress = 0;
        },
        _progress: function (event, item, progress) {
          item.progress = progress;
          item.uploader.trigger('progress', item, progress);
        },
        _success: function (event, xhr, item, response) {
          item.isReady = false;
          item.isUploading = false;
          item.isUploaded = true;
          item.isSuccess = true;
          item.isCancel = false;
          item.isError = false;
          item.progress = 100;
          item.index = null;
          item.uploader.trigger('success', xhr, item, response);
        },
        _cancel: function (event, xhr, item) {
          item.isReady = false;
          item.isUploading = false;
          item.isUploaded = false;
          item.isSuccess = false;
          item.isCancel = true;
          item.isError = false;
          item.progress = 0;
          item.index = null;
          item.uploader.trigger('cancel', xhr, item);
        },
        _error: function (event, xhr, item, response) {
          item.isReady = false;
          item.isUploading = false;
          item.isUploaded = true;
          item.isSuccess = false;
          item.isCancel = false;
          item.isError = true;
          item.progress = 100;
          item.index = null;
          item.uploader.trigger('error', xhr, item, response);
        },
        _complete: function (event, xhr, item, response) {
          item.uploader.trigger('complete', xhr, item, response);
          item.removeAfterUpload && item.remove();
        }
      };
      return {
        create: function (params) {
          return new Uploader(params);
        },
        isHTML5: Uploader.prototype.isHTML5
      };
    }
  ]);
  return app;
}));
angular.module('akoenig.deckgrid', []);
angular.module('akoenig.deckgrid').directive('deckgrid', [
  'DeckgridDescriptor',
  function initialize(DeckgridDescriptor) {
    'use strict';
    return DeckgridDescriptor.create();
  }
]);
angular.module('akoenig.deckgrid').factory('DeckgridDescriptor', [
  'Deckgrid',
  '$templateCache',
  function initialize(Deckgrid, $templateCache) {
    'use strict';
    function Descriptor() {
      this.restrict = 'AE';
      this.template = '<div data-ng-repeat="column in columns" class="{{layout.classList}}">' + '<div data-ng-repeat="card in column" data-ng-include="cardTemplate"></div>' + '</div>';
      this.scope = { 'model': '=source' };
      this.$$deckgrid = null;
      this.transclude = true;
      this.link = this.$$link.bind(this);
      this.$$templateKeyIndex = 0;
    }
    Descriptor.prototype.$$destroy = function $$destroy() {
      this.$$deckgrid.destroy();
    };
    Descriptor.prototype.$$link = function $$link(scope, elem, attrs, nullController, transclude) {
      var templateKey = 'deckgrid/innerHtmlTemplate' + ++this.$$templateKeyIndex;
      scope.$on('$destroy', this.$$destroy.bind(this));
      if (attrs.cardtemplate === undefined) {
        if (attrs.cardtemplatestring === undefined) {
          transclude(scope, function onTransclude(innerHTML) {
            var extractedInnerHTML = [], i = 0, len = innerHTML.length, outerHTML;
            for (i; i < len; i = i + 1) {
              outerHTML = innerHTML[i].outerHTML;
              if (outerHTML !== undefined) {
                extractedInnerHTML.push(outerHTML);
              }
            }
            $templateCache.put(templateKey, extractedInnerHTML.join());
          });
        } else {
          $templateCache.put(templateKey, elem.attr('cardtemplatestring'));
        }
        scope.cardTemplate = templateKey;
      } else {
        scope.cardTemplate = attrs.cardtemplate;
      }
      scope.mother = scope.$parent;
      this.$$deckgrid = Deckgrid.create(scope, elem[0]);
    };
    return {
      create: function create() {
        return new Descriptor();
      }
    };
  }
]);
angular.module('akoenig.deckgrid').factory('Deckgrid', [
  '$window',
  '$log',
  function initialize($window, $log) {
    'use strict';
    function Deckgrid(scope, element) {
      var self = this, watcher;
      this.$$elem = element;
      this.$$watchers = [];
      this.$$scope = scope;
      this.$$scope.columns = [];
      this.$$scope.layout = this.$$getLayout();
      this.$$createColumns();
      watcher = this.$$scope.$watch('model', this.$$onModelChange.bind(this), true);
      this.$$watchers.push(watcher);
      angular.forEach(self.$$getMediaQueries(), function onIteration(rule) {
        function onDestroy() {
          rule.removeListener(self.$$onMediaQueryChange.bind(self));
        }
        rule.addListener(self.$$onMediaQueryChange.bind(self));
        self.$$watchers.push(onDestroy);
      });
      angular.element(window).on('resize', self.$$onMediaQueryChange.bind(self));
    }
    Deckgrid.prototype.$$getMediaQueries = function $$getMediaQueries() {
      var stylesheets = [], mediaQueries = [];
      stylesheets = Array.prototype.concat.call(Array.prototype.slice.call(document.querySelectorAll('style[type=\'text/css\']')), Array.prototype.slice.call(document.querySelectorAll('link[rel=\'stylesheet\']')));
      function extractRules(stylesheet) {
        try {
          return stylesheet.sheet.cssRules || [];
        } catch (e) {
          return [];
        }
      }
      function hasDeckgridStyles(rule) {
        var regexe = /\[(\w*-)?deckgrid\]::?before/g, i = 0, selector = '';
        if (!rule.media || angular.isUndefined(rule.cssRules)) {
          return false;
        }
        i = rule.cssRules.length - 1;
        for (i; i >= 0; i = i - 1) {
          selector = rule.cssRules[i].selectorText;
          if (angular.isDefined(selector) && selector.match(regexe)) {
            return true;
          }
        }
        return false;
      }
      angular.forEach(stylesheets, function onIteration(stylesheet) {
        var rules = extractRules(stylesheet);
        angular.forEach(rules, function inRuleIteration(rule) {
          if (hasDeckgridStyles(rule)) {
            mediaQueries.push($window.matchMedia(rule.media.mediaText));
          }
        });
      });
      return mediaQueries;
    };
    Deckgrid.prototype.$$createColumns = function $$createColumns() {
      var self = this;
      if (!this.$$scope.layout) {
        return $log.error('angular-deckgrid: No CSS configuration found (see ' + 'https://github.com/akoenig/angular-deckgrid#the-grid-configuration)');
      }
      this.$$scope.columns = [];
      angular.forEach(this.$$scope.model, function onIteration(card, index) {
        var column = index % self.$$scope.layout.columns | 0;
        if (!self.$$scope.columns[column]) {
          self.$$scope.columns[column] = [];
        }
        card.$index = index;
        self.$$scope.columns[column].push(card);
      });
    };
    Deckgrid.prototype.$$getLayout = function $$getLayout() {
      var content = $window.getComputedStyle(this.$$elem, ':before').content, layout;
      if (content) {
        content = content.replace(/'/g, '');
        content = content.replace(/"/g, '');
        content = content.split(' ');
        if (2 === content.length) {
          layout = {};
          layout.columns = content[0] | 0;
          layout.classList = content[1].replace(/\./g, ' ').trim();
        }
      }
      return layout;
    };
    Deckgrid.prototype.$$onMediaQueryChange = function $$onMediaQueryChange() {
      var self = this, layout = this.$$getLayout();
      if (layout.columns !== this.$$scope.layout.columns) {
        self.$$scope.layout = layout;
        self.$$scope.$apply(function onApply() {
          self.$$createColumns();
        });
      }
    };
    Deckgrid.prototype.$$onModelChange = function $$onModelChange(newModel, oldModel) {
      var self = this;
      newModel = newModel || [];
      oldModel = oldModel || [];
      if (!angular.equals(oldModel, newModel)) {
        self.$$createColumns();
      }
    };
    Deckgrid.prototype.destroy = function destroy() {
      var i = this.$$watchers.length - 1;
      for (i; i >= 0; i = i - 1) {
        this.$$watchers[i]();
      }
    };
    return {
      create: function create(scope, element) {
        return new Deckgrid(scope, element);
      }
    };
  }
]);
function InfoBox(opt_opts) {
  opt_opts = opt_opts || {};
  google.maps.OverlayView.apply(this, arguments);
  this.content_ = opt_opts.content || '';
  this.disableAutoPan_ = opt_opts.disableAutoPan || false;
  this.maxWidth_ = opt_opts.maxWidth || 0;
  this.pixelOffset_ = opt_opts.pixelOffset || new google.maps.Size(0, 0);
  this.position_ = opt_opts.position || new google.maps.LatLng(0, 0);
  this.zIndex_ = opt_opts.zIndex || null;
  this.boxClass_ = opt_opts.boxClass || 'infoBox';
  this.boxStyle_ = opt_opts.boxStyle || {};
  this.closeBoxMargin_ = opt_opts.closeBoxMargin || '2px';
  this.closeBoxURL_ = opt_opts.closeBoxURL || 'http://www.google.com/intl/en_us/mapfiles/close.gif';
  if (opt_opts.closeBoxURL === '') {
    this.closeBoxURL_ = '';
  }
  this.infoBoxClearance_ = opt_opts.infoBoxClearance || new google.maps.Size(1, 1);
  this.isHidden_ = opt_opts.isHidden || false;
  this.alignBottom_ = opt_opts.alignBottom || false;
  this.pane_ = opt_opts.pane || 'floatPane';
  this.enableEventPropagation_ = opt_opts.enableEventPropagation || false;
  this.div_ = null;
  this.closeListener_ = null;
  this.eventListener1_ = null;
  this.eventListener2_ = null;
  this.eventListener3_ = null;
  this.moveListener_ = null;
  this.contextListener_ = null;
  this.fixedWidthSet_ = null;
}
InfoBox.prototype = new google.maps.OverlayView();
InfoBox.prototype.createInfoBoxDiv_ = function () {
  var bw;
  var me = this;
  var cancelHandler = function (e) {
    e.cancelBubble = true;
    if (e.stopPropagation) {
      e.stopPropagation();
    }
  };
  var ignoreHandler = function (e) {
    e.returnValue = false;
    if (e.preventDefault) {
      e.preventDefault();
    }
    if (!me.enableEventPropagation_) {
      cancelHandler(e);
    }
  };
  if (!this.div_) {
    this.div_ = document.createElement('div');
    this.setBoxStyle_();
    if (typeof this.content_.nodeType === 'undefined') {
      this.div_.innerHTML = this.getCloseBoxImg_() + this.content_;
    } else {
      this.div_.innerHTML = this.getCloseBoxImg_();
      this.div_.appendChild(this.content_);
    }
    this.getPanes()[this.pane_].appendChild(this.div_);
    this.addClickHandler_();
    if (this.div_.style.width) {
      this.fixedWidthSet_ = true;
    } else {
      if (this.maxWidth_ !== 0 && this.div_.offsetWidth > this.maxWidth_) {
        this.div_.style.width = this.maxWidth_;
        this.div_.style.overflow = 'auto';
        this.fixedWidthSet_ = true;
      } else {
        bw = this.getBoxWidths_();
        this.div_.style.width = this.div_.offsetWidth - bw.left - bw.right + 'px';
        this.fixedWidthSet_ = false;
      }
    }
    this.panBox_(this.disableAutoPan_);
    if (!this.enableEventPropagation_) {
      this.eventListener1_ = google.maps.event.addDomListener(this.div_, 'mousedown', cancelHandler);
      this.eventListener2_ = google.maps.event.addDomListener(this.div_, 'click', cancelHandler);
      this.eventListener3_ = google.maps.event.addDomListener(this.div_, 'dblclick', cancelHandler);
    }
    this.contextListener_ = google.maps.event.addDomListener(this.div_, 'contextmenu', ignoreHandler);
    google.maps.event.trigger(this, 'domready');
  }
};
InfoBox.prototype.getCloseBoxImg_ = function () {
  var img = '';
  if (this.closeBoxURL_ !== '') {
    img = '<img';
    img += ' src=\'' + this.closeBoxURL_ + '\'';
    img += ' align=right';
    img += ' style=\'';
    img += ' position: relative;';
    img += ' cursor: pointer;';
    img += ' margin: ' + this.closeBoxMargin_ + ';';
    img += '\'>';
  }
  return img;
};
InfoBox.prototype.addClickHandler_ = function () {
  var closeBox;
  if (this.closeBoxURL_ !== '') {
    closeBox = this.div_.firstChild;
    this.closeListener_ = google.maps.event.addDomListener(closeBox, 'click', this.getCloseClickHandler_());
  } else {
    this.closeListener_ = null;
  }
};
InfoBox.prototype.getCloseClickHandler_ = function () {
  var me = this;
  return function (e) {
    e.cancelBubble = true;
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    me.close();
    google.maps.event.trigger(me, 'closeclick');
  };
};
InfoBox.prototype.panBox_ = function (disablePan) {
  var map;
  var bounds;
  var xOffset = 0, yOffset = 0;
  if (!disablePan) {
    map = this.getMap();
    if (map instanceof google.maps.Map) {
      if (!map.getBounds().contains(this.position_)) {
        map.setCenter(this.position_);
      }
      bounds = map.getBounds();
      var mapDiv = map.getDiv();
      var mapWidth = mapDiv.offsetWidth;
      var mapHeight = mapDiv.offsetHeight;
      var iwOffsetX = this.pixelOffset_.width;
      var iwOffsetY = this.pixelOffset_.height;
      var iwWidth = this.div_.offsetWidth;
      var iwHeight = this.div_.offsetHeight;
      var padX = this.infoBoxClearance_.width;
      var padY = this.infoBoxClearance_.height;
      var pixPosition = this.getProjection().fromLatLngToContainerPixel(this.position_);
      if (pixPosition.x < -iwOffsetX + padX) {
        xOffset = pixPosition.x + iwOffsetX - padX;
      } else if (pixPosition.x + iwWidth + iwOffsetX + padX > mapWidth) {
        xOffset = pixPosition.x + iwWidth + iwOffsetX + padX - mapWidth;
      }
      if (this.alignBottom_) {
        if (pixPosition.y < -iwOffsetY + padY + iwHeight) {
          yOffset = pixPosition.y + iwOffsetY - padY - iwHeight;
        } else if (pixPosition.y + iwOffsetY + padY > mapHeight) {
          yOffset = pixPosition.y + iwOffsetY + padY - mapHeight;
        }
      } else {
        if (pixPosition.y < -iwOffsetY + padY) {
          yOffset = pixPosition.y + iwOffsetY - padY;
        } else if (pixPosition.y + iwHeight + iwOffsetY + padY > mapHeight) {
          yOffset = pixPosition.y + iwHeight + iwOffsetY + padY - mapHeight;
        }
      }
      if (!(xOffset === 0 && yOffset === 0)) {
        var c = map.getCenter();
        map.panBy(xOffset, yOffset);
      }
    }
  }
};
InfoBox.prototype.setBoxStyle_ = function () {
  var i, boxStyle;
  if (this.div_) {
    this.div_.className = this.boxClass_;
    this.div_.style.cssText = '';
    boxStyle = this.boxStyle_;
    for (i in boxStyle) {
      if (boxStyle.hasOwnProperty(i)) {
        this.div_.style[i] = boxStyle[i];
      }
    }
    if (typeof this.div_.style.opacity !== 'undefined' && this.div_.style.opacity !== '') {
      this.div_.style.filter = 'alpha(opacity=' + this.div_.style.opacity * 100 + ')';
    }
    this.div_.style.position = 'absolute';
    this.div_.style.visibility = 'hidden';
    if (this.zIndex_ !== null) {
      this.div_.style.zIndex = this.zIndex_;
    }
  }
};
InfoBox.prototype.getBoxWidths_ = function () {
  var computedStyle;
  var bw = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    };
  var box = this.div_;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    computedStyle = box.ownerDocument.defaultView.getComputedStyle(box, '');
    if (computedStyle) {
      bw.top = parseInt(computedStyle.borderTopWidth, 10) || 0;
      bw.bottom = parseInt(computedStyle.borderBottomWidth, 10) || 0;
      bw.left = parseInt(computedStyle.borderLeftWidth, 10) || 0;
      bw.right = parseInt(computedStyle.borderRightWidth, 10) || 0;
    }
  } else if (document.documentElement.currentStyle) {
    if (box.currentStyle) {
      bw.top = parseInt(box.currentStyle.borderTopWidth, 10) || 0;
      bw.bottom = parseInt(box.currentStyle.borderBottomWidth, 10) || 0;
      bw.left = parseInt(box.currentStyle.borderLeftWidth, 10) || 0;
      bw.right = parseInt(box.currentStyle.borderRightWidth, 10) || 0;
    }
  }
  return bw;
};
InfoBox.prototype.onRemove = function () {
  if (this.div_) {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }
};
InfoBox.prototype.draw = function () {
  this.createInfoBoxDiv_();
  var pixPosition = this.getProjection().fromLatLngToDivPixel(this.position_);
  this.div_.style.left = pixPosition.x + this.pixelOffset_.width + 'px';
  if (this.alignBottom_) {
    this.div_.style.bottom = -(pixPosition.y + this.pixelOffset_.height) + 'px';
  } else {
    this.div_.style.top = pixPosition.y + this.pixelOffset_.height + 'px';
  }
  if (this.isHidden_) {
    this.div_.style.visibility = 'hidden';
  } else {
    this.div_.style.visibility = 'visible';
  }
};
InfoBox.prototype.setOptions = function (opt_opts) {
  if (typeof opt_opts.boxClass !== 'undefined') {
    this.boxClass_ = opt_opts.boxClass;
    this.setBoxStyle_();
  }
  if (typeof opt_opts.boxStyle !== 'undefined') {
    this.boxStyle_ = opt_opts.boxStyle;
    this.setBoxStyle_();
  }
  if (typeof opt_opts.content !== 'undefined') {
    this.setContent(opt_opts.content);
  }
  if (typeof opt_opts.disableAutoPan !== 'undefined') {
    this.disableAutoPan_ = opt_opts.disableAutoPan;
  }
  if (typeof opt_opts.maxWidth !== 'undefined') {
    this.maxWidth_ = opt_opts.maxWidth;
  }
  if (typeof opt_opts.pixelOffset !== 'undefined') {
    this.pixelOffset_ = opt_opts.pixelOffset;
  }
  if (typeof opt_opts.position !== 'undefined') {
    this.setPosition(opt_opts.position);
  }
  if (typeof opt_opts.zIndex !== 'undefined') {
    this.setZIndex(opt_opts.zIndex);
  }
  if (typeof opt_opts.closeBoxMargin !== 'undefined') {
    this.closeBoxMargin_ = opt_opts.closeBoxMargin;
  }
  if (typeof opt_opts.closeBoxURL !== 'undefined') {
    this.closeBoxURL_ = opt_opts.closeBoxURL;
  }
  if (typeof opt_opts.infoBoxClearance !== 'undefined') {
    this.infoBoxClearance_ = opt_opts.infoBoxClearance;
  }
  if (typeof opt_opts.isHidden !== 'undefined') {
    this.isHidden_ = opt_opts.isHidden;
  }
  if (typeof opt_opts.enableEventPropagation !== 'undefined') {
    this.enableEventPropagation_ = opt_opts.enableEventPropagation;
  }
  if (this.div_) {
    this.draw();
  }
};
InfoBox.prototype.setContent = function (content) {
  this.content_ = content;
  if (this.div_) {
    if (this.closeListener_) {
      google.maps.event.removeListener(this.closeListener_);
      this.closeListener_ = null;
    }
    if (!this.fixedWidthSet_) {
      this.div_.style.width = '';
    }
    if (typeof content.nodeType === 'undefined') {
      this.div_.innerHTML = this.getCloseBoxImg_() + content;
    } else {
      this.div_.innerHTML = this.getCloseBoxImg_();
      this.div_.appendChild(content);
    }
    if (!this.fixedWidthSet_) {
      this.div_.style.width = this.div_.offsetWidth + 'px';
      this.div_.innerHTML = this.getCloseBoxImg_() + content;
    }
    this.addClickHandler_();
  }
  google.maps.event.trigger(this, 'content_changed');
};
InfoBox.prototype.setPosition = function (latlng) {
  this.position_ = latlng;
  if (this.div_) {
    this.draw();
  }
  google.maps.event.trigger(this, 'position_changed');
};
InfoBox.prototype.setZIndex = function (index) {
  this.zIndex_ = index;
  if (this.div_) {
    this.div_.style.zIndex = index;
  }
  google.maps.event.trigger(this, 'zindex_changed');
};
InfoBox.prototype.getContent = function () {
  return this.content_;
};
InfoBox.prototype.getPosition = function () {
  return this.position_;
};
InfoBox.prototype.getZIndex = function () {
  return this.zIndex_;
};
InfoBox.prototype.show = function () {
  this.isHidden_ = false;
  if (this.div_) {
    this.div_.style.visibility = 'visible';
  }
};
InfoBox.prototype.hide = function () {
  this.isHidden_ = true;
  if (this.div_) {
    this.div_.style.visibility = 'hidden';
  }
};
InfoBox.prototype.open = function (map, anchor) {
  var me = this;
  if (anchor) {
    this.position_ = anchor.getPosition();
    this.moveListener_ = google.maps.event.addListener(anchor, 'position_changed', function () {
      me.setPosition(this.getPosition());
    });
  }
  this.setMap(map);
  if (this.div_) {
    this.panBox_();
  }
};
InfoBox.prototype.close = function () {
  if (this.closeListener_) {
    google.maps.event.removeListener(this.closeListener_);
    this.closeListener_ = null;
  }
  if (this.eventListener1_) {
    google.maps.event.removeListener(this.eventListener1_);
    google.maps.event.removeListener(this.eventListener2_);
    google.maps.event.removeListener(this.eventListener3_);
    this.eventListener1_ = null;
    this.eventListener2_ = null;
    this.eventListener3_ = null;
  }
  if (this.moveListener_) {
    google.maps.event.removeListener(this.moveListener_);
    this.moveListener_ = null;
  }
  if (this.contextListener_) {
    google.maps.event.removeListener(this.contextListener_);
    this.contextListener_ = null;
  }
  this.setMap(null);
};
(function () {
  var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W = [].slice, X = {}.hasOwnProperty, Y = function (a, b) {
      function c() {
        this.constructor = a;
      }
      for (var d in b)
        X.call(b, d) && (a[d] = b[d]);
      return c.prototype = b.prototype, a.prototype = new c(), a.__super__ = b.prototype, a;
    }, Z = [].indexOf || function (a) {
      for (var b = 0, c = this.length; c > b; b++)
        if (b in this && this[b] === a)
          return b;
      return -1;
    };
  for (t = {
      catchupTime: 500,
      initialRate: 0.03,
      minTime: 500,
      ghostTime: 500,
      maxProgressPerFrame: 10,
      easeFactor: 1.25,
      startOnPageLoad: !0,
      restartOnPushState: !0,
      restartOnRequestAfter: 500,
      target: 'body',
      elements: {
        checkInterval: 100,
        selectors: ['body']
      },
      eventLag: {
        minSamples: 10,
        sampleCount: 3,
        lagThreshold: 3
      },
      ajax: {
        trackMethods: ['GET'],
        trackWebSockets: !0,
        ignoreURLs: []
      }
    }, B = function () {
      var a;
      return null != (a = 'undefined' != typeof performance && null !== performance ? 'function' == typeof performance.now ? performance.now() : void 0 : void 0) ? a : +new Date();
    }, D = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame, s = window.cancelAnimationFrame || window.mozCancelAnimationFrame, null == D && (D = function (a) {
      return setTimeout(a, 50);
    }, s = function (a) {
      return clearTimeout(a);
    }), F = function (a) {
      var b, c;
      return b = B(), (c = function () {
        var d;
        return d = B() - b, d >= 33 ? (b = B(), a(d, function () {
          return D(c);
        })) : setTimeout(c, 33 - d);
      })();
    }, E = function () {
      var a, b, c;
      return c = arguments[0], b = arguments[1], a = 3 <= arguments.length ? W.call(arguments, 2) : [], 'function' == typeof c[b] ? c[b].apply(c, a) : c[b];
    }, u = function () {
      var a, b, c, d, e, f, g;
      for (b = arguments[0], d = 2 <= arguments.length ? W.call(arguments, 1) : [], f = 0, g = d.length; g > f; f++)
        if (c = d[f])
          for (a in c)
            X.call(c, a) && (e = c[a], null != b[a] && 'object' == typeof b[a] && null != e && 'object' == typeof e ? u(b[a], e) : b[a] = e);
      return b;
    }, p = function (a) {
      var b, c, d, e, f;
      for (c = b = 0, e = 0, f = a.length; f > e; e++)
        d = a[e], c += Math.abs(d), b++;
      return c / b;
    }, w = function (a, b) {
      var c, d, e;
      if (null == a && (a = 'options'), null == b && (b = !0), e = document.querySelector('[data-pace-' + a + ']')) {
        if (c = e.getAttribute('data-pace-' + a), !b)
          return c;
        try {
          return JSON.parse(c);
        } catch (f) {
          return d = f, 'undefined' != typeof console && null !== console ? console.error('Error parsing inline pace options', d) : void 0;
        }
      }
    }, g = function () {
      function a() {
      }
      return a.prototype.on = function (a, b, c, d) {
        var e;
        return null == d && (d = !1), null == this.bindings && (this.bindings = {}), null == (e = this.bindings)[a] && (e[a] = []), this.bindings[a].push({
          handler: b,
          ctx: c,
          once: d
        });
      }, a.prototype.once = function (a, b, c) {
        return this.on(a, b, c, !0);
      }, a.prototype.off = function (a, b) {
        var c, d, e;
        if (null != (null != (d = this.bindings) ? d[a] : void 0)) {
          if (null == b)
            return delete this.bindings[a];
          for (c = 0, e = []; c < this.bindings[a].length;)
            this.bindings[a][c].handler === b ? e.push(this.bindings[a].splice(c, 1)) : e.push(c++);
          return e;
        }
      }, a.prototype.trigger = function () {
        var a, b, c, d, e, f, g, h, i;
        if (c = arguments[0], a = 2 <= arguments.length ? W.call(arguments, 1) : [], null != (g = this.bindings) ? g[c] : void 0) {
          for (e = 0, i = []; e < this.bindings[c].length;)
            h = this.bindings[c][e], d = h.handler, b = h.ctx, f = h.once, d.apply(null != b ? b : this, a), f ? i.push(this.bindings[c].splice(e, 1)) : i.push(e++);
          return i;
        }
      }, a;
    }(), null == window.Pace && (window.Pace = {}), u(Pace, g.prototype), C = Pace.options = u({}, t, window.paceOptions, w()), T = [
      'ajax',
      'document',
      'eventLag',
      'elements'
    ], P = 0, R = T.length; R > P; P++)
    J = T[P], C[J] === !0 && (C[J] = t[J]);
  i = function (a) {
    function b() {
      return U = b.__super__.constructor.apply(this, arguments);
    }
    return Y(b, a), b;
  }(Error), b = function () {
    function a() {
      this.progress = 0;
    }
    return a.prototype.getElement = function () {
      var a;
      if (null == this.el) {
        if (a = document.querySelector(C.target), !a)
          throw new i();
        this.el = document.createElement('div'), this.el.className = 'pace pace-active', document.body.className = document.body.className.replace(/pace-done/g, ''), document.body.className += ' pace-running', this.el.innerHTML = '<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>', null != a.firstChild ? a.insertBefore(this.el, a.firstChild) : a.appendChild(this.el);
      }
      return this.el;
    }, a.prototype.finish = function () {
      var a;
      return a = this.getElement(), a.className = a.className.replace('pace-active', ''), a.className += ' pace-inactive', document.body.className = document.body.className.replace('pace-running', ''), document.body.className += ' pace-done';
    }, a.prototype.update = function (a) {
      return this.progress = a, this.render();
    }, a.prototype.destroy = function () {
      try {
        this.getElement().parentNode.removeChild(this.getElement());
      } catch (a) {
        i = a;
      }
      return this.el = void 0;
    }, a.prototype.render = function () {
      var a, b;
      return null == document.querySelector(C.target) ? !1 : (a = this.getElement(), a.children[0].style.width = '' + this.progress + '%', (!this.lastRenderedProgress || this.lastRenderedProgress | 0 !== this.progress | 0) && (a.children[0].setAttribute('data-progress-text', '' + (0 | this.progress) + '%'), this.progress >= 100 ? b = '99' : (b = this.progress < 10 ? '0' : '', b += 0 | this.progress), a.children[0].setAttribute('data-progress', '' + b)), this.lastRenderedProgress = this.progress);
    }, a.prototype.done = function () {
      return this.progress >= 100;
    }, a;
  }(), h = function () {
    function a() {
      this.bindings = {};
    }
    return a.prototype.trigger = function (a, b) {
      var c, d, e, f, g;
      if (null != this.bindings[a]) {
        for (f = this.bindings[a], g = [], d = 0, e = f.length; e > d; d++)
          c = f[d], g.push(c.call(this, b));
        return g;
      }
    }, a.prototype.on = function (a, b) {
      var c;
      return null == (c = this.bindings)[a] && (c[a] = []), this.bindings[a].push(b);
    }, a;
  }(), O = window.XMLHttpRequest, N = window.XDomainRequest, M = window.WebSocket, v = function (a, b) {
    var c, d, e, f;
    f = [];
    for (d in b.prototype)
      try {
        e = b.prototype[d], null == a[d] && 'function' != typeof e ? f.push(a[d] = e) : f.push(void 0);
      } catch (g) {
        c = g;
      }
    return f;
  }, z = [], Pace.ignore = function () {
    var a, b, c;
    return b = arguments[0], a = 2 <= arguments.length ? W.call(arguments, 1) : [], z.unshift('ignore'), c = b.apply(null, a), z.shift(), c;
  }, Pace.track = function () {
    var a, b, c;
    return b = arguments[0], a = 2 <= arguments.length ? W.call(arguments, 1) : [], z.unshift('track'), c = b.apply(null, a), z.shift(), c;
  }, I = function (a) {
    var b;
    if (null == a && (a = 'GET'), 'track' === z[0])
      return 'force';
    if (!z.length && C.ajax) {
      if ('socket' === a && C.ajax.trackWebSockets)
        return !0;
      if (b = a.toUpperCase(), Z.call(C.ajax.trackMethods, b) >= 0)
        return !0;
    }
    return !1;
  }, j = function (a) {
    function b() {
      var a, c = this;
      b.__super__.constructor.apply(this, arguments), a = function (a) {
        var b;
        return b = a.open, a.open = function (d, e) {
          return I(d) && c.trigger('request', {
            type: d,
            url: e,
            request: a
          }), b.apply(a, arguments);
        };
      }, window.XMLHttpRequest = function (b) {
        var c;
        return c = new O(b), a(c), c;
      }, v(window.XMLHttpRequest, O), null != N && (window.XDomainRequest = function () {
        var b;
        return b = new N(), a(b), b;
      }, v(window.XDomainRequest, N)), null != M && C.ajax.trackWebSockets && (window.WebSocket = function (a, b) {
        var d;
        return d = null != b ? new M(a, b) : new M(a), I('socket') && c.trigger('request', {
          type: 'socket',
          url: a,
          protocols: b,
          request: d
        }), d;
      }, v(window.WebSocket, M));
    }
    return Y(b, a), b;
  }(h), Q = null, x = function () {
    return null == Q && (Q = new j()), Q;
  }, H = function (a) {
    var b, c, d, e;
    for (e = C.ajax.ignoreURLs, c = 0, d = e.length; d > c; c++)
      if (b = e[c], 'string' == typeof b) {
        if (-1 !== a.indexOf(b))
          return !0;
      } else if (b.test(a))
        return !0;
    return !1;
  }, x().on('request', function (b) {
    var c, d, e, f, g;
    return f = b.type, e = b.request, g = b.url, H(g) ? void 0 : Pace.running || C.restartOnRequestAfter === !1 && 'force' !== I(f) ? void 0 : (d = arguments, c = C.restartOnRequestAfter || 0, 'boolean' == typeof c && (c = 0), setTimeout(function () {
      var b, c, g, h, i, j;
      if (b = 'socket' === f ? e.readyState < 2 : 0 < (h = e.readyState) && 4 > h) {
        for (Pace.restart(), i = Pace.sources, j = [], c = 0, g = i.length; g > c; c++) {
          if (J = i[c], J instanceof a) {
            J.watch.apply(J, d);
            break;
          }
          j.push(void 0);
        }
        return j;
      }
    }, c));
  }), a = function () {
    function a() {
      var a = this;
      this.elements = [], x().on('request', function () {
        return a.watch.apply(a, arguments);
      });
    }
    return a.prototype.watch = function (a) {
      var b, c, d, e;
      return d = a.type, b = a.request, e = a.url, H(e) ? void 0 : (c = 'socket' === d ? new m(b) : new n(b), this.elements.push(c));
    }, a;
  }(), n = function () {
    function a(a) {
      var b, c, d, e, f, g, h = this;
      if (this.progress = 0, null != window.ProgressEvent)
        for (c = null, a.addEventListener('progress', function (a) {
            return h.progress = a.lengthComputable ? 100 * a.loaded / a.total : h.progress + (100 - h.progress) / 2;
          }), g = [
            'load',
            'abort',
            'timeout',
            'error'
          ], d = 0, e = g.length; e > d; d++)
          b = g[d], a.addEventListener(b, function () {
            return h.progress = 100;
          });
      else
        f = a.onreadystatechange, a.onreadystatechange = function () {
          var b;
          return 0 === (b = a.readyState) || 4 === b ? h.progress = 100 : 3 === a.readyState && (h.progress = 50), 'function' == typeof f ? f.apply(null, arguments) : void 0;
        };
    }
    return a;
  }(), m = function () {
    function a(a) {
      var b, c, d, e, f = this;
      for (this.progress = 0, e = [
          'error',
          'open'
        ], c = 0, d = e.length; d > c; c++)
        b = e[c], a.addEventListener(b, function () {
          return f.progress = 100;
        });
    }
    return a;
  }(), d = function () {
    function a(a) {
      var b, c, d, f;
      for (null == a && (a = {}), this.elements = [], null == a.selectors && (a.selectors = []), f = a.selectors, c = 0, d = f.length; d > c; c++)
        b = f[c], this.elements.push(new e(b));
    }
    return a;
  }(), e = function () {
    function a(a) {
      this.selector = a, this.progress = 0, this.check();
    }
    return a.prototype.check = function () {
      var a = this;
      return document.querySelector(this.selector) ? this.done() : setTimeout(function () {
        return a.check();
      }, C.elements.checkInterval);
    }, a.prototype.done = function () {
      return this.progress = 100;
    }, a;
  }(), c = function () {
    function a() {
      var a, b, c = this;
      this.progress = null != (b = this.states[document.readyState]) ? b : 100, a = document.onreadystatechange, document.onreadystatechange = function () {
        return null != c.states[document.readyState] && (c.progress = c.states[document.readyState]), 'function' == typeof a ? a.apply(null, arguments) : void 0;
      };
    }
    return a.prototype.states = {
      loading: 0,
      interactive: 50,
      complete: 100
    }, a;
  }(), f = function () {
    function a() {
      var a, b, c, d, e, f = this;
      this.progress = 0, a = 0, e = [], d = 0, c = B(), b = setInterval(function () {
        var g;
        return g = B() - c - 50, c = B(), e.push(g), e.length > C.eventLag.sampleCount && e.shift(), a = p(e), ++d >= C.eventLag.minSamples && a < C.eventLag.lagThreshold ? (f.progress = 100, clearInterval(b)) : f.progress = 100 * (3 / (a + 3));
      }, 50);
    }
    return a;
  }(), l = function () {
    function a(a) {
      this.source = a, this.last = this.sinceLastUpdate = 0, this.rate = C.initialRate, this.catchup = 0, this.progress = this.lastProgress = 0, null != this.source && (this.progress = E(this.source, 'progress'));
    }
    return a.prototype.tick = function (a, b) {
      var c;
      return null == b && (b = E(this.source, 'progress')), b >= 100 && (this.done = !0), b === this.last ? this.sinceLastUpdate += a : (this.sinceLastUpdate && (this.rate = (b - this.last) / this.sinceLastUpdate), this.catchup = (b - this.progress) / C.catchupTime, this.sinceLastUpdate = 0, this.last = b), b > this.progress && (this.progress += this.catchup * a), c = 1 - Math.pow(this.progress / 100, C.easeFactor), this.progress += c * this.rate * a, this.progress = Math.min(this.lastProgress + C.maxProgressPerFrame, this.progress), this.progress = Math.max(0, this.progress), this.progress = Math.min(100, this.progress), this.lastProgress = this.progress, this.progress;
    }, a;
  }(), K = null, G = null, q = null, L = null, o = null, r = null, Pace.running = !1, y = function () {
    return C.restartOnPushState ? Pace.restart() : void 0;
  }, null != window.history.pushState && (S = window.history.pushState, window.history.pushState = function () {
    return y(), S.apply(window.history, arguments);
  }), null != window.history.replaceState && (V = window.history.replaceState, window.history.replaceState = function () {
    return y(), V.apply(window.history, arguments);
  }), k = {
    ajax: a,
    elements: d,
    document: c,
    eventLag: f
  }, (A = function () {
    var a, c, d, e, f, g, h, i;
    for (Pace.sources = K = [], g = [
        'ajax',
        'elements',
        'document',
        'eventLag'
      ], c = 0, e = g.length; e > c; c++)
      a = g[c], C[a] !== !1 && K.push(new k[a](C[a]));
    for (i = null != (h = C.extraSources) ? h : [], d = 0, f = i.length; f > d; d++)
      J = i[d], K.push(new J(C));
    return Pace.bar = q = new b(), G = [], L = new l();
  })(), Pace.stop = function () {
    return Pace.trigger('stop'), Pace.running = !1, q.destroy(), r = !0, null != o && ('function' == typeof s && s(o), o = null), A();
  }, Pace.restart = function () {
    return Pace.trigger('restart'), Pace.stop(), Pace.start();
  }, Pace.go = function () {
    var a;
    return Pace.running = !0, q.render(), a = B(), r = !1, o = F(function (b, c) {
      var d, e, f, g, h, i, j, k, m, n, o, p, s, t, u, v;
      for (k = 100 - q.progress, e = o = 0, f = !0, i = p = 0, t = K.length; t > p; i = ++p)
        for (J = K[i], n = null != G[i] ? G[i] : G[i] = [], h = null != (v = J.elements) ? v : [J], j = s = 0, u = h.length; u > s; j = ++s)
          g = h[j], m = null != n[j] ? n[j] : n[j] = new l(g), f &= m.done, m.done || (e++, o += m.tick(b));
      return d = o / e, q.update(L.tick(b, d)), q.done() || f || r ? (q.update(100), Pace.trigger('done'), setTimeout(function () {
        return q.finish(), Pace.running = !1, Pace.trigger('hide');
      }, Math.max(C.ghostTime, Math.max(C.minTime - (B() - a), 0)))) : c();
    });
  }, Pace.start = function (a) {
    u(C, a), Pace.running = !0;
    try {
      q.render();
    } catch (b) {
      i = b;
    }
    return document.querySelector('.pace') ? (Pace.trigger('start'), Pace.go()) : setTimeout(Pace.start, 50);
  }, 'function' == typeof define && define.amd ? define(function () {
    return Pace;
  }) : 'object' == typeof exports ? module.exports = Pace : C.startOnPageLoad && Pace.start();
}.call(this));
(function (window, angular, undefined) {
  angular.module('templates-app', [
    'company/details.tpl.html',
    'dashboard/applications.tpl.html',
    'dashboard/company-profile.tpl.html',
    'dashboard/dashboard.tpl.html',
    'dashboard/forms/logo-delete.tpl.html',
    'dashboard/forms/logo-upload.tpl.html',
    'dashboard/forms/role-delete.tpl.html',
    'dashboard/forms/role.tpl.html',
    'dashboard/internships.tpl.html',
    'dashboard/layout.tpl.html',
    'dashboard/roles.tpl.html',
    'home/home.tpl.html',
    'internships/details.tpl.html',
    'internships/forms/apply.tpl.html',
    'login/activate.tpl.html',
    'login/login.tpl.html',
    'login/password-reset.tpl.html',
    'login/resend-activation.tpl.html',
    'register/modal-error.tpl.html',
    'register/register-form.tpl.html',
    'register/register.tpl.html',
    'search/results-map.tpl.html',
    'search/search-widget.tpl.html',
    'search/search.tpl.html'
  ]);
  angular.module('company/details.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('company/details.tpl.html', '<article class="content-page company-details">\n' + '  \n' + '  <header>\n' + '    <div class="container clearfix">\n' + '      <h1 class="page-title pull-left">{{ company.name }}</h1>\n' + '\n' + '      <div class="actions pull-right">\n' + '        <button type="button" auth-group="student" ng-click="apply()" class="btn btn-primary btn-icon-right">Apply for Internship <i class="fa fa-envelope"></i></button>\n' + '      </div>\n' + '    </div>\n' + '  </header>\n' + '\n' + '  <section class="main">\n' + '    <div class="container">\n' + '      <div class="row">\n' + '        <div class="col-sm-4 profile-sidebar">\n' + '          <div class="profile-logo">\n' + '            <img ng-show="company.logoUrl" ng-src="{{ company.logoUrl }}" alt="{{ company.name }}">\n' + '          </div>\n' + '\n' + '          <ul class="profile-meta">\n' + '            <li class="icon-left"><i class="fa fa-map-marker"></i> {{ company.address.city + \', \' +  company.address.country }}</li>\n' + '            <li class="icon-left"><i class="fa fa-globe"></i> <a href="{{ company.website }}" target="_blank">{{ company.website }}</a></li>\n' + '          </ul>\n' + '        </div>\n' + '\n' + '        <div class="col-sm-8 profile-body">\n' + '          <section>\n' + '            <h2>Company profile</h2>\n' + '            {{ company.introduction }}\n' + '          </section>\n' + '\n' + '          <section>\n' + '            <h4>{{ company.name }} is looking for interns with the following skills</h4>\n' + '            <ul class="skills">\n' + '              <li ng-repeat="skill in company.skills">{{ skill }}</li>\n' + '            </ul>\n' + '          </section>\n' + '          \n' + '          <section ng-if="company.roles">\n' + '            <h2>Available Internship Roles</h2>\n' + '            <ul class="list-roles">\n' + '              <li ng-repeat="role in company.roles" class="clearfix">\n' + '                <strong>{{ role.title }}</strong>\n' + '                <div class="actions">\n' + '                  <button ng-click="showRoleDetails(role)" type="button" class="btn btn-default btn-sm"><i class="fa fa-info-circle"></i> More Info</button>\n' + '                  <button auth-group="student" ng-click="apply(role)" type="button" class="btn btn-primary btn-sm">Apply <i class="fa fa-chevron-right small"></i></button>\n' + '                </div>\n' + '              </li>\n' + '            </ul>\n' + '          </section>\n' + '        </div>\n' + '      </div>\n' + '    </div>\n' + '  </section>\n' + '\n' + '  <section class="map map-fullwidth">\n' + '    <div class="map-overlay">\n' + '      <div class="container">\n' + '        <div class="map-info">\n' + '          <h2>{{ company.name }}</h2>\n' + '          <p ng-bind-html="company.displayAddress"></p>\n' + '          <a href="{{ company.getGoogleMapsLink() }}" class="btn btn-primary btn-icon-right" target="_blank">Get Directions <i class="fa fa-map-marker"></i></a>\n' + '        </div>\n' + '      </div>\n' + '    </div>\n' + '    <div google-map lng="company.address.lng" lat="company.address.lat" height="500"></div>\n' + '  </section>\n' + '\n' + '</article>');
    }
  ]);
  angular.module('dashboard/applications.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('dashboard/applications.tpl.html', '<header class="section-header">\n' + '  <h2>Pending Applications</h2>\n' + '</header>\n' + '');
    }
  ]);
  angular.module('dashboard/company-profile.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('dashboard/company-profile.tpl.html', '<article class="edit-company-profile">\n' + '  \n' + '  <header class="section-header">\n' + '    <h2>Company Profile</h2>\n' + '  </header>\n' + '\n' + '\n' + '  <section class="company-logo">\n' + '    \n' + '    <div class="row">\n' + '      <div class="col-sm-4">\n' + '        <img ng-if="company.logoUrl" ng-src="{{ company.logoUrl }}" alt="{{ company.name }}">\n' + '      </div>\n' + '\n' + '      <div class="col-sm-8">\n' + '        \n' + '        <a ng-click="deleteLogo()" class="btn btn-danger btn-icon-right">Remove Logo <i class="fa fa-trash-o"></i></a>\n' + '        <a ng-click="uploadLogo()" class="btn btn-primary btn-icon-right">Upload Logo <i class="fa fa-arrow-up"></i></a>\n' + '\n' + '      </div>\n' + '    </div>\n' + '    \n' + '\n' + '  </section>\n' + '\n' + '</article>');
    }
  ]);
  angular.module('dashboard/dashboard.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('dashboard/dashboard.tpl.html', '<header class="section-header">\n' + '  <h2>Dashboard</h2>\n' + '</header>\n' + '');
    }
  ]);
  angular.module('dashboard/forms/logo-delete.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('dashboard/forms/logo-delete.tpl.html', '<div class="text-center">\n' + '  \n' + '  <p class="lead">Are you sure you want to remove your company\'s logo</p>\n' + '\n' + '  <p class="actions">\n' + '    <button ng-click="delete()" type="submit" class="btn btn-danger">Remove</button>\n' + '    <button ng-click="close()" type="submit" class="btn btn-default">Cancel</button>\n' + '  </p>\n' + '\n' + '</div>');
    }
  ]);
  angular.module('dashboard/forms/logo-upload.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('dashboard/forms/logo-upload.tpl.html', '<form validate="true" role="form" ng-submit="upload()" ng-init="initialize()">\n' + '\n' + '  <div class="form-group">\n' + '    <label for="input-logo" class="sr-only">Select Logo</label>\n' + '    <input type="file" name="logo" id="input-logo" ng-file-select class="form-control">\n' + '  </div>\n' + '\n' + '  <div class="form-group text-center">\n' + '    <button type="submit" class="btn btn-primary btn-icon-right">Upload <i class="fa fa-arrow-up"></i></button>\n' + '  </div>\n' + '\n' + '</form>');
    }
  ]);
  angular.module('dashboard/forms/role-delete.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('dashboard/forms/role-delete.tpl.html', '<div class="text-center">\n' + '  \n' + '  <p class="lead">Are you sure you want to delete this role?</p>\n' + '\n' + '  <p class="actions">\n' + '    <button ng-click="delete()" type="submit" class="btn btn-danger">Delete</button>\n' + '    <button ng-click="close()" type="submit" class="btn btn-default">Cancel</button>\n' + '  </p>\n' + '\n' + '</div>');
    }
  ]);
  angular.module('dashboard/forms/role.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('dashboard/forms/role.tpl.html', '<form validate="true" role="form" ng-submit="save()">\n' + '  \n' + '  <div class="form-group">\n' + '    <label>Role Title</label>\n' + '    <input ng-model="role.title" type="text" class="form-control">\n' + '  </div>\n' + '\n' + '  <div class="form-group">\n' + '    <label for="">Role Description</label>\n' + '    <textarea ng-model="role.description" class="form-control" rows="10"></textarea>\n' + '  </div>\n' + '\n' + '  <div class="form-group text-center">\n' + '    <button type="submit" class="btn btn-primary btn-icon-right">Save <i class="fa fa-save"></i></button>\n' + '  </div>\n' + '\n' + '</form>');
    }
  ]);
  angular.module('dashboard/internships.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('dashboard/internships.tpl.html', '<header class="section-header">\n' + '  <h2>My Internships</h2>\n' + '</header>\n' + '\n' + '\n' + '<div class="list-group">\n' + '  <a ng-repeat="internship in internships" href="{{ internship.url }}" class="list-group-item">\n' + '    <h4 class="list-group-item-heading">\n' + '      {{ internship.role.title || "Internship" }} \n' + '      <span class="text-muted">at</span> \n' + '      {{ internship.company.name }}\n' + '      <span class="label label-primary pull-right">{{ internship.status }}</span>\n' + '    </h4>\n' + '\n' + '    <p class="list-group-item-text">\n' + '      {{ internship.startDate | date:short }}\n' + '      <span ng-show="internship.startDate && internship.endDate" class="text-muted">to</span>\n' + '      {{ internship.endDate | date:short }}</p>\n' + '  </a>\n' + '</div>');
    }
  ]);
  angular.module('dashboard/layout.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('dashboard/layout.tpl.html', '<article class="content-page">\n' + '  <header>\n' + '    <div class="container">\n' + '      <h1 class="page-title">Dashboard</h1>\n' + '    </div>\n' + '  </header>\n' + '\n' + '  <section class="main">\n' + '    <div class="container">\n' + '\n' + '      <div class="row">\n' + '        <div class="col-sm-3">\n' + '          <ul class="nav nav-pills nav-stacked">\n' + '            <li ng-class="{active:active==\'dashboard\'}"><a href="/dashboard">Dashboard</a></li>\n' + '            <li auth-group="student" ng-class="{active:active==\'internships\'}"><a href="/dashboard/internships">Internships</a></li>\n' + '            <li auth-group="employer" ng-class="{active:active==\'applications\'}"><a href="/dashboard/applications">Pending Applications</a></li>\n' + '            <li auth-group="employer" ng-class="{active:active==\'roles\'}"><a href="/dashboard/roles">Available Roles</a></li>\n' + '            <li auth-group="employer" ng-class="{active:active==\'profile\'}"><a href="/dashboard/company-profile">Company Profile</a></li>\n' + '            <li auth-group="student" ng-class="{active:active==\'profile\'}"><a href="/dashboard/profile">Edit Profile</a></li>\n' + '          </ul>\n' + '        </div>\n' + '\n' + '        <div class="col-sm-9">\n' + '          <div ng-include="state.main"></div>\n' + '        </div>\n' + '      </div>\n' + '\n' + '    </div>\n' + '  </section>\n' + '</article>');
    }
  ]);
  angular.module('dashboard/roles.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('dashboard/roles.tpl.html', '<header class="section-header">\n' + '  <h2>Available Roles</h2>\n' + '\n' + '  <div class="actions">\n' + '    <button type="button" ng-click="add()" class="btn btn-primary btn-sm"><i class="fa fa-plus"></i> Add Role</button>\n' + '  </div>\n' + '</header>\n' + '\n' + '\n' + '<section class="list-view">\n' + '  \n' + '  <div ng-repeat="role in roles" class="internship-role">\n' + '    <strong>{{ role.title }}</strong>\n' + '    <p>{{ role.description }}</p>\n' + '    <div class="actions">\n' + '      <button ng-click="delete(role)" class="btn btn-sm btn-danger"><i class="fa fa-times"></i> Delete</button>\n' + '      <button ng-click="edit(role)" class="btn btn-sm btn-default"><i class="fa fa-pencil"></i> Edit</button>\n' + '    </div>\n' + '    <hr>\n' + '  </div>\n' + '\n' + '</section>');
    }
  ]);
  angular.module('home/home.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('home/home.tpl.html', '<section class="section-green section-home" fill-screen homepage-hero>\n' + '  \n' + '  <div class="container text-center">\n' + '    <h2 class="hero-title">InternLabs connects students with employers and helps create successful internships</h2>\n' + '\n' + '    <p class="lead call-to-action">Ready to get started?</p>\n' + '\n' + '    <div class="actions">\n' + '      <a href="/signup/employer" class="btn btn-default btn-lg">I\'m an Employer</a>\n' + '      <a href="/signup/student" class="btn btn-default btn-lg">I\'m a Student</a>\n' + '    </div>\n' + '  </div>  \n' + '\n' + '</section>');
    }
  ]);
  angular.module('internships/details.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('internships/details.tpl.html', '<article class="content-page internship-details">\n' + '  \n' + '  <header>\n' + '    <div class="container clearfix">\n' + '      <h1 class="page-title pull-left">{{ internship.role.title }} - {{ profile.name }}</h1>\n' + '    </div>\n' + '  </header>\n' + '\n' + '  <section class="main">\n' + '    <div class="container">\n' + '      <pre>\n' + '        {{ internship }}\n' + '      </pre>\n' + '    </div>\n' + '  </section>\n' + '\n' + '</article>');
    }
  ]);
  angular.module('internships/forms/apply.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('internships/forms/apply.tpl.html', '<form apply-form role="form" ng-submit="save()">\n' + '\n' + '  <div class="form-group">\n' + '    <p>Your internship proposal contains everything your employer will need to know. This includes the internship length, your availability, required documentation and anything else that will be required of the employer.</p>\n' + '    <p>Your profile and resume will also be attached to your application.</p>\n' + '  </div>\n' + '\n' + '  <div stepped-form>\n' + '\n' + '    <fieldset class="form-step">\n' + '      \n' + '      <legend>Proposed Role</legend>\n' + '\n' + '      <div class="custom-role">\n' + '        <div class="form-group">\n' + '          <label>Role Title</label>\n' + '          <input ng-model="application.role.title" ng-disabled="existingRole" type="text" class="form-control">\n' + '        </div>\n' + '\n' + '        <div class="form-group">\n' + '          <label for="">Role Description</label>\n' + '          <textarea ng-model="application.role.description" ng-disabled="existingRole" class="form-control" rows="6"></textarea>\n' + '        </div>\n' + '      </div>\n' + '\n' + '      <div class="form-group">\n' + '        <a href="#" class="next btn btn-default pull-right btn-icon-right">Next <i class="fa fa-arrow-right"></i></a>\n' + '      </div>\n' + '\n' + '    </fieldset>\n' + '\n' + '\n' + '    <fieldset class="form-step">\n' + '\n' + '      <legend>Internship Details</legend>\n' + '  \n' + '      <div class="form-group">\n' + '        <div class="row">\n' + '          <div class="col-sm-4">\n' + '            <label for="">Start Date</label>\n' + '            <input ng-model="application.startDate" type="text" class="form-control">\n' + '          </div>\n' + '\n' + '          <div class="col-sm-4">\n' + '            <label for="">End Date</label>\n' + '            <input ng-model="application.endDate" type="text" class="form-control">\n' + '          </div>\n' + '          <div class="col-sm-4">\n' + '            <label for="">Total Hours</label>\n' + '            <input ng-model="application.totalHours" type="text" class="form-control">\n' + '          </div>\n' + '        </div>\n' + '      </div>\n' + '\n' + '      <div class="form-group">\n' + '        <label for="">Availability</label>\n' + '        <div checkbox-list selected="application.availability" options="[\'Monday\', \'Tuesday\', \'Wednesday\', \'Thursday\', \'Friday\', \'Saturday\', \'Sunday\']" filterable="false"></div>\n' + '      </div>\n' + '\n' + '      <div class="form-group">\n' + '        <label for="field-comment">Comments</label>\n' + '        <textarea ng-model="application.comment" id="field-comment" rows="6" class="form-control"></textarea>\n' + '      </div>\n' + '\n' + '      <div class="form-group">\n' + '        <a href="#" class="previous btn btn-default pull-left btn-icon-left">Back <i class="fa fa-arrow-left"></i></a>\n' + '        <a href="#" class="next btn btn-default pull-right btn-icon-right">Next <i class="fa fa-arrow-right"></i></a>\n' + '      </div>\n' + '\n' + '    </fieldset>\n' + '\n' + '\n' + '    <fieldset class="form-step">\n' + '\n' + '      <legend>Attached Documents</legend>\n' + '\n' + '      <p class="lead">TODO!</p>\n' + '\n' + '      <div class="form-group">\n' + '        <a href="#" class="previous btn btn-default pull-left btn-icon-left">Back <i class="fa fa-arrow-left"></i></a>\n' + '        <a href="#" class="next btn btn-default pull-right btn-icon-right">Next <i class="fa fa-arrow-right"></i></a>\n' + '      </div>\n' + '\n' + '    </fieldset>\n' + '\n' + '\n' + '    <fieldset class="form-step">\n' + '\n' + '      <legend>Confirm Application</legend>\n' + '\n' + '      <p class="lead">TODO!</p>\n' + '\n' + '      <div class="form-group">\n' + '        <a href="#" class="previous btn btn-default pull-left btn-icon-left">Back <i class="fa fa-arrow-left"></i></a>\n' + '        <button type="submit" class="btn btn-primary btn-icon-right pull-right">Apply <i class="fa fa-arrow-right"></i></button>\n' + '      </div>\n' + '\n' + '    </fieldset>\n' + '\n' + '  </div>\n' + '\n' + '</form>');
    }
  ]);
  angular.module('login/activate.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('login/activate.tpl.html', '<section class="section-green section-activate" fill-screen>\n' + '  <div class="container">\n' + '    <div class="row">\n' + '      <div class="col-sm-offset-3 col-sm-6 text-center">\n' + '\n' + '        <div ng-show="!activated">\n' + '          <h1>Activating Account</h1>\n' + '          <p>Please wait while your account is being activated...</p>\n' + '        </div>\n' + '\n' + '        <div ng-show="activated">\n' + '          <h1>Your account as been activated</h1>\n' + '          <p>Your account has been activated successfully. You may now login.</p>\n' + '          <a href="/login" class="btn btn-default btn-icon-right">Proceed to login <i class="fa fa-arrow-right"></i></a>\n' + '        </div>\n' + '\n' + '      </div>\n' + '    </div>\n' + '  </div>\n' + '</section>');
    }
  ]);
  angular.module('login/login.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('login/login.tpl.html', '<section class="section-green section-login" fill-screen>\n' + '  \n' + '  <div class="container">\n' + '    <div class="row">\n' + '\n' + '      <form validate="true" ng-submit="submit()" role="form" class="col-sm-offset-3 col-sm-6 col-md-offset-4 col-md-4 floating-labels" login-form animated-form>\n' + '\n' + '        <h1 class="text-center animation-group">Login</h1>\n' + '\n' + '        <div form-errors="errors"></div>\n' + '\n' + '        <div class="form-group animation-group">\n' + '          <label for="">Email</label>\n' + '          <input type="email" name="email" ng-model="credentials.email" class="form-control" placeholder="Email" float-label required>\n' + '        </div>\n' + '\n' + '        <div class="form-group animation-group">\n' + '          <label for="">Password</label>\n' + '          <input type="password" name="password" ng-model="credentials.password" class="form-control" placeholder="Password" float-label required>\n' + '        </div>\n' + '\n' + '\n' + '        <div class="form-group animation-group">\n' + '          <div class="row">\n' + '            <div class="col-xs-6">\n' + '              <div class="checkbox">\n' + '                <label>\n' + '                  <input type="checkbox" ng-model="credentials.remember" name="credentials.remember" ng-true-value="true" fs-picker> Remember Me\n' + '                </label>\n' + '              </div>\n' + '            </div>\n' + '            <div class="col-xs-6">\n' + '              <button type="submit" class="btn btn-default pull-right btn-icon-right">Login <i class="fa fa-arrow-right"></i></button>\n' + '            </div>\n' + '          </div>\n' + '        </div>\n' + '\n' + '        <p class="animation-group text-center link-lost-password"><a href="/password-reset">Lost your password?</a> | <a href="/resend-activation">Resend Activation Email</a></p>\n' + '\n' + '      </form>\n' + '\n' + '    </div>\n' + '  </div>\n' + '\n' + '</section>');
    }
  ]);
  angular.module('login/password-reset.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('login/password-reset.tpl.html', '<section class="section-green section-password-reset" fill-screen>\n' + '  \n' + '  <div class="container">\n' + '    <div class="row">\n' + '\n' + '      <div class="col-sm-offset-3 col-sm-6 col-md-offset-4 col-md-4 floating-labels text-center">\n' + '        \n' + '        <!-- Send reset -->\n' + '        <div ng-show="action == \'send\'">\n' + '          \n' + '          <!-- Send form -->\n' + '          <form validate="true" ng-submit="send()" role="form" animated-form ng-if="!sendSuccess">\n' + '            <h1 class="text-center animation-group">Password Reset</h1>\n' + '\n' + '            <div class="form-group animation-group">\n' + '              <label for="">Email</label>\n' + '              <input type="email" name="email" ng-model="reset.email" class="form-control" placeholder="Your account\'s email address" float-label required>\n' + '            </div>\n' + '\n' + '\n' + '            <div class="form-group animation-group">\n' + '              <button type="submit" class="btn btn-default btn-icon-right">Send Confirmation Email <i class="fa fa-arrow-right"></i></button>\n' + '            </div>\n' + '          </form>\n' + '\n' + '          <!-- Send confirmation -->\n' + '          <div ng-if="sendSuccess">\n' + '            <h1>Confirmation Send</h1>\n' + '            <p>A confirmation email has been sent to the address you provided. Please click the link in this email to set a new password for your account.</p>\n' + '          </div>\n' + '          \n' + '        </div>\n' + '        \n' + '\n' + '\n' + '        <!-- Reset password -->\n' + '        <div ng-show="action == \'reset\'">\n' + '          \n' + '          <!-- Reset form -->\n' + '          <form validate="true" ng-submit="reset()" role="form" animated-form ng-if="!resetSuccess">\n' + '            <h1 class="text-center animation-group">Password Reset</h1>\n' + '\n' + '            <div class="form-group animation-group">\n' + '              <label for="">New Password</label>\n' + '              <input type="password" name="password" ng-model="reset.password" class="form-control" placeholder="New password for your account" float-label required data-parsley-minlength="6">\n' + '            </div>\n' + '\n' + '\n' + '            <div class="form-group animation-group">\n' + '              <button type="submit" class="btn btn-default btn-icon-right">Reset Password <i class="fa fa-arrow-right"></i></button>\n' + '            </div>\n' + '          </form>\n' + '\n' + '          <!-- Reset confirmation -->\n' + '          <div ng-show="resetSuccess">\n' + '            <h1>Your password has been reset</h1>\n' + '            <p>Your password has been reset successfully. You may now login using your new password.</p>\n' + '            <a href="/login" class="btn btn-default btn-icon-right">Proceed to login <i class="fa fa-arrow-right"></i></a>\n' + '          </div>\n' + '\n' + '\n' + '        </div>\n' + '\n' + '      </div>\n' + '\n' + '      \n' + '\n' + '    </div>\n' + '  </div>\n' + '\n' + '</section>');
    }
  ]);
  angular.module('login/resend-activation.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('login/resend-activation.tpl.html', '<section class="section-green section-resend-activation" fill-screen>\n' + '  <div class="container">\n' + '    <div class="row">\n' + '      <div class="col-sm-offset-3 col-sm-6 col-md-offset-4 col-md-4 floating-labels text-center">\n' + '\n' + '        <!-- Send form -->\n' + '        <form validate="true" ng-submit="send()" role="form" animated-form ng-if="!success">\n' + '          <h1 class="text-center animation-group">Resend Activation</h1>\n' + '\n' + '          <div form-errors="errors"></div>\n' + '\n' + '          <div class="form-group animation-group">\n' + '            <label for="">Email</label>\n' + '            <input type="email" name="email" ng-model="resend.email" class="form-control" placeholder="Your account\'s email address" float-label required>\n' + '          </div>\n' + '\n' + '          <div class="form-group animation-group">\n' + '            <button type="submit" class="btn btn-default btn-icon-right">Resend Activation Email <i class="fa fa-arrow-right"></i></button>\n' + '          </div>\n' + '        </form>\n' + '\n' + '        <!-- Send confirmation -->\n' + '        <div ng-if="success">\n' + '          <h1>Activation Email Send</h1>\n' + '          <p>An activation email has been sent to the address you provided. Please click the link in this email to verify your account.</p>\n' + '        </div>\n' + '        \n' + '      </div>\n' + '    </div>\n' + '  </div>\n' + '</section>');
    }
  ]);
  angular.module('register/modal-error.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('register/modal-error.tpl.html', '<div>\n' + '  <p>The following errors occured when creating you account;</p>\n' + '  <ul>\n' + '    <li ng-repeat="error in errors">{{ error }}</li>\n' + '  </ul>\n' + '\n' + '  <p class="actions text-center">\n' + '    <button ng-click="close()" type="submit" class="btn btn-primary">Ok</button>\n' + '  </p>\n' + '</div>');
    }
  ]);
  angular.module('register/register-form.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('register/register-form.tpl.html', '<form validate="true" ng-submit="submit()" role="form" class="col-sm-offset-2 col-sm-8 col-md-offset-3 col-md-6 floating-labels" animated-form>\n' + '\n' + '  <div class="form-group animation-group">\n' + '    <h1 class="text-center">{{ type() }} Signup</h1>\n' + '  </div>\n' + '\n' + '  <div stepped-form>\n' + '\n' + '\n' + '    <!-- Account Details -->\n' + '    <fieldset class="form-step">\n' + '\n' + '      <div class="animation-group form-step-title">\n' + '        <i class="number">1</i>\n' + '        <h3 class="title">My Account</h3>\n' + '        <p class="message">Your account details will be used to login.</p>\n' + '      </div>\n' + '\n' + '      <div class="form-group animation-group">\n' + '        <div class="row-sm">\n' + '          <div class="col-sm-6">\n' + '            <label>Your Name</label>\n' + '            <input type="text" name="user.profile.firstName" ng-model="user.profile.firstName" class="form-control" placeholder="First Name" float-label required>\n' + '          </div>\n' + '          <div class="col-sm-6">\n' + '            <input type="text" name="user.profile.lastName" ng-model="user.profile.lastName" class="form-control" placeholder="Last Name" float-label required>\n' + '          </div>\n' + '        </div>\n' + '      </div>\n' + '\n' + '      <div class="form-group animation-group">\n' + '        <label for="">Email</label>\n' + '        <input type="email" name="email" ng-model="user.email" class="form-control" placeholder="Email" float-label required>\n' + '      </div>\n' + '\n' + '      <div class="form-group animation-group">\n' + '        <label for="">Password</label>\n' + '        <input type="password" name="password" ng-model="user.password" class="form-control" placeholder="Password" float-label required data-parsley-minlength="6">\n' + '      </div>\n' + '\n' + '      <div class="form-group animation-group">\n' + '        <a href="#" class="next btn btn-default pull-right btn-icon-right">Next <i class="fa fa-arrow-right"></i></a>\n' + '      </div>\n' + '    </fieldset>\n' + '\n' + '\n' + '\n' + '    <!-- My Profile -->\n' + '    <fieldset class="form-step" ng-if="user.type == \'student\'">\n' + '\n' + '      <div class="form-step-title">\n' + '        <i class="number">2</i>\n' + '        <h3 class="title">My Profile</h3>\n' + '        <p class="message">Your profile will help us match interships relative to your skills and interests. It will also be made available to employers.</p>\n' + '      </div>\n' + '\n' + '      <div class="form-group">\n' + '        <label>Introduction</label>\n' + '        <textarea name="user.profile.introduction" ng-model="user.profile.introduction" class="form-control" placeholder="Introduction" float-label></textarea>\n' + '        <div class="inline-help">\n' + '          <i class="help-icon" popover="Your introduction is a great opportunity to introduce yourself to employers." popover-title="Introduction"></i>\n' + '        </div>\n' + '      </div>\n' + '\n' + '      <div class="form-group">\n' + '        <div class="row-sm">\n' + '          <div class="col-sm-6">\n' + '            <label>Course Name</label>\n' + '            <input type="test" name="user.profile.courseName" ng-model="user.profile.courseName" class="form-control" placeholder="Course Name" float-label>\n' + '          </div>\n' + '\n' + '          <div class="col-sm-6">\n' + '            <label class="sr-only">University</label>\n' + '            <select selecter name="user.profile.university" ng-model="user.profile.university" placeholder="University" float-label>\n' + '              <option value="">Select a University</option>\n' + '              <option>Australian Catholic University</option>\n' + '              <option>Australian National University</option>\n' + '              <option>Bond University</option>\n' + '              <option>Central Queensland University</option>\n' + '              <option>Charles Darwin University</option>\n' + '              <option>Charles Sturt University</option>\n' + '              <option>Curtin University</option>\n' + '              <option>Deakin University</option>\n' + '              <option>Edith Cowan University</option>\n' + '              <option>Federation University</option>\n' + '              <option>Flinders University</option>\n' + '              <option>Griffith University</option>\n' + '              <option>James Cook University</option>\n' + '              <option>La Trobe University</option>\n' + '              <option>Macquarie University</option>\n' + '              <option>Monash University</option>\n' + '              <option>Murdoch University</option>\n' + '              <option>Queensland University of Technology</option>\n' + '              <option>RMIT University</option>\n' + '              <option>Southern Cross University</option>\n' + '              <option>Swinburne University of Technology</option>\n' + '              <option>University of Adelaide</option>\n' + '              <option>University of Canberra</option>\n' + '              <option>University of Melbourne</option>\n' + '              <option>University of New England</option>\n' + '              <option>University of New South Wales</option>\n' + '              <option>University of Newcastle</option>\n' + '              <option>University of Notre Dame</option>\n' + '              <option>University of Queensland</option>\n' + '              <option>University of South Australia</option>\n' + '              <option>University of Southern Queensland</option>\n' + '              <option>University of Sydney</option>\n' + '              <option>University of Tasmania</option>\n' + '              <option>University of Technology Sydney</option>\n' + '              <option>University of the Sunshine Coast</option>\n' + '              <option>University of Western Australia</option>\n' + '              <option>University of Western Sydney</option>\n' + '              <option>University of Wollongong</option>\n' + '              <option>Victoria University</option>\n' + '            </select>\n' + '          </div>\n' + '        </div>\n' + '      </div>\n' + '\n' + '      <div class="form-group">\n' + '        <label>LinkedIn Profile</label>\n' + '        <input type="test" name="user.profile.linkedIn" ng-model="user.profile.linkedIn" class="form-control" placeholder="LinkedIn Profile URL" float-label>\n' + '      </div>\n' + '\n' + '      <div class="form-group">\n' + '        <label>Skills</label>\n' + '        <input type="test" name="user.profile.skills" ng-model="user.profile.skills" class="form-control" placeholder="Comma seperated list of skills" float-label>\n' + '        <div class="inline-help">\n' + '          <i class="help-icon" popover="Enter a comma seperated list of your key skills. (For example; Graphic Design, Adobe Photoshop, etc.)" popover-title="Key Skills"></i>\n' + '        </div>\n' + '      </div>\n' + '      \n' + '      <div class="form-group ">\n' + '        <a href="#" class="previous btn btn-link btn-icon-left"><i class="fa fa-arrow-left"></i> Previous</a>\n' + '        <button type="submit" class="btn btn-default pull-right btn-icon-right">Signup <i class="fa fa-arrow-right"></i></button>\n' + '      </div>\n' + '    </fieldset>\n' + '\n' + '\n' + '    \n' + '    <!-- Company Profile -->\n' + '    <fieldset class="form-step" ng-if="user.type == \'employer\'">\n' + '\n' + '      <div class="form-step-title">\n' + '        <i class="number">2</i>\n' + '        <h3 class="title">Company Profile</h3>\n' + '        <p class="message">Your company profile will be displayed to students interested in applying for internships with you.</p>\n' + '      </div>\n' + '\n' + '      <div class="form-group">\n' + '        <label>Company Name</label>\n' + '        <input type="test" name="user.company.name" ng-model="user.company.name" class="form-control" placeholder="Company Name" float-label required>\n' + '      </div>\n' + '\n' + '      <div class="form-group">\n' + '        <label>Company Introduction</label>\n' + '        <textarea name="user.company.introduction" ng-model="user.company.introduction" class="form-control" placeholder="Company Introduction" float-label></textarea>\n' + '      </div>\n' + '\n' + '      <div class="form-group">\n' + '        <label>Website</label>\n' + '        <input type="test" name="user.company.website" ng-model="user.company.website" class="form-control" placeholder="Website URL" float-label>\n' + '      </div>\n' + '\n' + '      <div class="form-group">\n' + '        <label>Skills</label>\n' + '        <input type="test" name="user.company.skills" ng-model="user.company.skills" class="form-control" placeholder="Comma seperated list of skills" float-label>\n' + '        <div class="inline-help">\n' + '          <i class="help-icon" popover="Enter a comma seperated list of the skills your company looks for in interns. (For example; Graphic Design, Project Management, etc.)" popover-title="Key Skills"></i>\n' + '        </div>\n' + '      </div>\n' + '      \n' + '      <div class="form-group">\n' + '        <a href="#" class="previous btn btn-link btn-icon-left"><i class="fa fa-arrow-left"></i> Previous</a>\n' + '        <a href="#" class="next btn btn-default pull-right btn-icon-right">Next <i class="fa fa-arrow-right"></i></a>\n' + '      </div>\n' + '    </fieldset>\n' + '\n' + '\n' + '\n' + '    <!-- Company Logo -->\n' + '    <fieldset class="form-step" ng-if="user.type == \'employer\'">\n' + '\n' + '      <div class="form-step-title">\n' + '        <i class="number">3</i>\n' + '        <h3 class="title">Company Logo</h3>\n' + '        <p class="message">Upload your company\'s logo to be displayed in you profile.</p>\n' + '      </div>\n' + '\n' + '      <div class="form-group">\n' + '        <label>Company Logo</label>\n' + '        <input type="file" name="logo" ng-file-select class="form-control">\n' + '      </div>\n' + '      \n' + '      <div class="form-group">\n' + '        <a href="#" class="previous btn btn-link btn-icon-left"><i class="fa fa-arrow-left"></i> Previous</a>\n' + '        <a href="#" class="next btn btn-default pull-right btn-icon-right">Next <i class="fa fa-arrow-right"></i></a>\n' + '      </div>\n' + '    </fieldset>\n' + '\n' + '\n' + '\n' + '    <!-- Company Address -->\n' + '    <fieldset class="form-step" ng-if="user.type == \'employer\'">\n' + '\n' + '      <div class="form-step-title">\n' + '        <i class="number">4</i>\n' + '        <h3 class="title">Company Address</h3>\n' + '        <p class="message">Please provide your company\'s address to help your interns locate you.</p>\n' + '      </div>\n' + '\n' + '      <div class="form-group vertical-input-stack">\n' + '        <label>Street Address</label>\n' + '        <input type="test" name="user.company.address.line1" ng-model="user.company.address.line1" class="form-control" placeholder="Street Address" float-label required>\n' + '        <input type="test" name="user.company.address.line2" ng-model="user.company.address.line2" class="form-control">\n' + '      </div>\n' + '\n' + '      <div class="form-group ">\n' + '        <div class="row-sm">\n' + '          <div class="col-sm-5">\n' + '            <label>City / State / Postcode</label>\n' + '            <input type="test" name="user.company.address.city" ng-model="user.company.address.city" class="form-control" placeholder="City" float-label required>\n' + '          </div>\n' + '\n' + '          <div class="col-sm-5">\n' + '            <label class="sr-only">State</label>\n' + '            <select selecter name="user.company.address.state" ng-model="user.company.address.state" placeholder="State" required>\n' + '              <option value="">Select a State</option>\n' + '              <option>Australian Capital Territory</option>\n' + '              <option>New South Wales</option>\n' + '              <option>Northern Territory</option>\n' + '              <option>Queensland</option>\n' + '              <option>South Australia</option>\n' + '              <option>Tasmania</option>\n' + '              <option>Victoria</option>\n' + '              <option>Western Australia</option>\n' + '            </select>\n' + '          </div>\n' + '\n' + '          <div class="col-sm-2">\n' + '            <label class="sr-only">Postcode</label>\n' + '            <input type="test" name="user.company.address.postcode" ng-model="user.company.address.postcode" class="form-control" placeholder="1234" required data-parsley-type="integer">\n' + '          </div>\n' + '        </div>\n' + '      </div>\n' + '\n' + '      <div class="form-group ">\n' + '        <label>Country</label>\n' + '        <select selecter name="user.company.address.country" ng-model="user.company.address.country" placeholder="Country" float-label required>\n' + '          <option value="">Select a Country</option>\n' + '          <option selected="selected">Australia</option>\n' + '        </select>\n' + '      </div>\n' + '      \n' + '      <div class="form-group">\n' + '        <a href="#" class="previous btn btn-link btn-icon-left"><i class="fa fa-arrow-left"></i> Previous</a>\n' + '        <button type="submit" ng-disabled="loading" class="btn btn-default pull-right btn-icon-right">Signup <i class="fa fa-arrow-right"></i></button>\n' + '      </div>\n' + '    </fieldset>\n' + '\n' + '\n' + '\n' + '  </div>\n' + '\n' + '</form>');
    }
  ]);
  angular.module('register/register.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('register/register.tpl.html', '<section class="section-green section-register" fill-screen>\n' + '  \n' + '  <div class="container">\n' + '    <div class="row">\n' + '\n' + '      <div register-form user="user" submit="submit"></div>\n' + '\n' + '    </div>\n' + '  </div>\n' + '\n' + '</section>');
    }
  ]);
  angular.module('search/results-map.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('search/results-map.tpl.html', '<div class="results-map">\n' + '\n' + '  <div results-view-toggle query="query"></div>\n' + '\n' + '  <div id="map"></div>\n' + '  <script type="text/ng-template" id="infoWindowTemplate">\n' + '    <div class="infobox-content">\n' + '      <article>\n' + '        <button type="button" class="close close-button">&times;</button>\n' + '        <a href="{{ result.url }}"><img ng-show="result.logoUrl" ng-src="{{ result.logoUrl }}" alt="{{ result.name }}"></a>\n' + '        <hr />\n' + '        <header class="clearfix">\n' + '          <h4 class="pull-left"><a href="{{ result.url }}">{{ result.name }}</a></h4>\n' + '          <a href="{{ result.url }}" class="btn btn-primary btn-sm pull-right">More Info <i class="fa fa-arrow-right small"></i></a>\n' + '        </header>\n' + '      </article>\n' + '    </div>\n' + '  </script>\n' + '</div>');
    }
  ]);
  angular.module('search/search-widget.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('search/search-widget.tpl.html', '<div class="search-widget">\n' + '\n' + '  <form role="form" ng-submit="search()">\n' + '    <div class="row">\n' + '      <div class="col-sm-6">\n' + '        <div class="form-group">\n' + '          <input type="text" ng-model="query.query" class="form-control" placeholder="Search for...">\n' + '        </div>\n' + '      </div>\n' + '\n' + '      <div class="col-sm-2">\n' + '        <button type="submit" class="btn btn-primary btn-icon-right">Search <i class="fa fa-search"></i></button>\n' + '      </div>\n' + '\n' + '      <div class="col-sm-2 pull-right">\n' + '        <button type="button" ng-click="toggleAdvanced()" class="btn btn-link">Advanced Search <i ng-class="{\'fa fa-chevron-up\':showAdvanced,\'fa fa-chevron-down\':!showAdvanced}"></i></button>\n' + '      </div>\n' + '    </div>\n' + '\n' + '    <div class="row advanced" ng-show="showAdvanced">\n' + '\n' + '      <div class="col-sm-6">\n' + '        <h4>Locations</h4>\n' + '        <div checkbox-list selected="query.locations" options="options.locations" filterable="true"></div>\n' + '      </div>\n' + '\n' + '      <div class="col-sm-6">\n' + '        <h4>Skills</h4>\n' + '        <div checkbox-list selected="query.skills" options="options.skills" filterable="true"></div>\n' + '      </div>\n' + '\n' + '    </div>\n' + '\n' + '  </form>\n' + '\n' + '</div>');
    }
  ]);
  angular.module('search/search.tpl.html', []).run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('search/search.tpl.html', '<article class="content-page">\n' + '  <header>\n' + '    <div class="container">\n' + '      <h1 class="page-title">Search</h1>\n' + '    </div>\n' + '  </header>\n' + '\n' + '  <!-- List View -->\n' + '  <section ng-show="query.view == \'list\'" class="main">\n' + '    <div class="container">\n' + '\n' + '      <div search-widget query="query" options="options"></div>\n' + '\n' + '      <h2>\n' + '        Results <span ng-if="query.query">for "{{ query.query }}"</span> \n' + '        <span ng-if="meta.totalResults" class="muted pull-right">{{ meta.totalResults }} results</span>\n' + '        <div class="pull-right" results-view-toggle query="query"></div>\n' + '      </h2>\n' + '\n' + '      <hr />\n' + '\n' + '      <div class="search-results deckgrid" deckgrid source="results">\n' + '        <div class="search-result">\n' + '          <div class="box">\n' + '            <a ng-show="card.logoUrl" href="{{ card.url }}"><img ng-src="{{ card.logoUrl }}" alt="{{ card.name }}"></a>\n' + '            <h4 class="text-center"><a href="{{ card.url }}">{{ card.name }}</a></h4>\n' + '            <hr />\n' + '            <p class="text-center">\n' + '              <a href="{{ card.url }}" class="btn btn-default btn-sm">More Info</a>\n' + '              <a href="#apply" class="btn btn-sm btn-primary">Apply Online</a>\n' + '            </p>\n' + '          </div>\n' + '        </div>\n' + '      </div>\n' + '\n' + '    </div>\n' + '  </section>\n' + '\n' + '\n' + '  <section ng-if="query.view==\'map\'" class="main">\n' + '    <div results-map results="results" query="query"></div>\n' + '  </section>\n' + '\n' + '</article>');
    }
  ]);
  angular.module('InternLabs', [
    'ngRoute',
    'ngAnimate',
    'angularFileUpload',
    'restangular',
    'akoenig.deckgrid',
    'templates-app',
    'InternLabs.services',
    'InternLabs.common.directives',
    'InternLabs.home',
    'InternLabs.login',
    'InternLabs.register',
    'InternLabs.search',
    'InternLabs.dashboard',
    'InternLabs.company',
    'InternLabs.internships'
  ]).config([
    '$locationProvider',
    'RestangularProvider',
    function ($locationProvider, RestangularProvider) {
      $locationProvider.html5Mode(true);
      RestangularProvider.setBaseUrl('/api');
      RestangularProvider.setResponseExtractor(function (response, operation) {
        return response.data;
      });
      RestangularProvider.setRestangularFields({ id: '_id' });
    }
  ]).run(function () {
    _.mixin({
      capitalize: function (string) {
        return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
      }
    });
    _.mixin({
      compactObject: function (o) {
        _.each(o, function (v, k) {
          if (!v)
            delete o[k];
        });
        return o;
      }
    });
    _.mixin({
      slugify: function (title) {
        var replace = '-';
        var str = title.toString().replace(/[\s\.]+/g, replace).toLowerCase().replace(new RegExp('[^a-z0-9' + replace + ']', 'g'), replace).replace(new RegExp(replace + '+', 'g'), replace);
        ;
        if (str.charAt(str.length - 1) == replace)
          str = str.substring(0, str.length - 1);
        if (str.charAt(0) == replace)
          str = str.substring(1);
        return str;
      }
    });
  }).controller('AppCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    'Auth',
    function ($rootScope, $scope, $location, Auth) {
      $scope.appTitle = 'InternLabs';
      $rootScope.user = window.internlabs.user || {};
      $rootScope.loading = false;
      $scope.$on('$routeChangeStart', function (event, next, current) {
        $rootScope.loading = true;
        if (next.auth && !Auth.check()) {
          $location.path('/login');
        }
      });
      $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.loading = false;
        $(window).scrollTop(0);
        if (!angular.isDefined(current)) {
          return;
        }
        if (angular.isDefined(current.$$route.pageTitle)) {
          $scope.pageTitle = current.$$route.pageTitle;
        } else {
          $scope.pageTitle = $scope.appTitle;
        }
        if (current.$$route.className) {
        }
      });
      $scope.isLoading = function () {
        return $rootScope.loading;
      };
    }
  ]);
  ;
  angular.module('InternLabs.common.directives', []).service('ModalFactory', [
    '$rootScope',
    '$templateCache',
    '$http',
    '$compile',
    function ($rootScope, $templateCache, $http, $compile) {
      var modalTemplate = '<div class="modal fade">' + '<div class="modal-dialog">' + '<div class="modal-content">' + '<div class="modal-header">' + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + '<h4 class="modal-title">{{ title }}</h4>' + '</div>' + '<div class="modal-body">' + '</div>' + '</div>' + '</div>' + '</div>';
      var defaultOptions = {
          className: false,
          scope: false,
          tempalte: false,
          templateUrl: false
        };
      var loadTemplate = function (templateUrl) {
        return $templateCache.get(templateUrl);
      };
      var renderModal = function () {
      };
      this.create = function (options) {
        options = _.extend({}, defaultOptions, options);
        var scope = $rootScope.$new(), $body = $('body'), $modal = $(modalTemplate), template;
        if (_.isObject(options.scope)) {
          _.extend(scope, options.scope);
        }
        if (options.template) {
          template = options.template;
        }
        if (options.templateUrl) {
          template = loadTemplate(options.templateUrl);
        }
        $modal.find('.modal-body').append(template);
        if (options.className) {
          $modal.find('.modal-dialog').addClass(options.className);
        }
        var complied = $compile($modal)(scope);
        complied.appendTo('body').modal({});
        _.extend(scope, {
          close: function () {
            $(complied).modal('hide');
          }
        });
        complied.on('hidden.bs.modal', function (e) {
          $(this).remove();
        });
        scope.$on('$destroy', function () {
          $modal.remove();
        });
      };
    }
  ]).directive('primaryNav', [
    '$location',
    function ($location) {
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          scope.search = { query: '' };
          scope.focus = function () {
            elem.find('input').focus();
          };
          scope.blur = function () {
            elem.find('input').blur();
          };
          scope.search = function () {
            $location.url('/search?query=' + (scope.search.query || ''));
            scope.search.query = '';
          };
        }
      };
    }
  ]).directive('googleMap', function () {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        var mapId = _.uniqueId('map_'), gmap = null;
        elem.attr('id', mapId);
        var renderMap = function () {
          var lat = scope.$eval(elem.attr('lat')), lng = scope.$eval(elem.attr('lng'));
          elem.height(attrs.height || 350);
          gmap = new GMaps({
            div: mapId,
            lat: lat,
            lng: lng,
            zoom: 16,
            zoomControl: false,
            panControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            overviewMapControl: false
          });
          gmap.addMarker({
            lat: lat,
            lng: lng
          });
        };
        _.defer(renderMap);
        $(window).on('resize.gmap', _.debounce(function () {
          renderMap();
        }, 100));
        elem.on('$destroy', function () {
          $(window).off('resize.gmap');
        });
      }
    };
  }).directive('formErrors', function () {
    return {
      restrict: 'A',
      scope: { formErrors: '=' },
      template: '<div class="form-errors">' + '<div class="error" ng-repeat="error in errors">{{ error }}</div>' + '</div>',
      link: function (scope, elem, attrs) {
        elem.hide();
        scope.$watch('formErrors', function (errors) {
          if (errors) {
            if (!_.isArray(errors)) {
              errors = [errors];
            }
            scope.errors = errors;
            return elem.fadeIn();
          }
          errors = [];
          elem.fadeOut();
        });
      }
    };
  }).directive('floatLabel', function () {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        $(elem).bind('checkval', function () {
          var label = $(this).prev('label').addClass('floating-label');
          if (this.value !== '') {
            label.addClass('open');
          } else {
            label.removeClass('open');
          }
        }).on('keyup', function () {
          $(this).trigger('checkval');
        }).on('focus', function () {
          $(this).prev('label').addClass('active');
        }).on('blur', function () {
          $(this).prev('label').removeClass('active');
        }).trigger('checkval');
      }
    };
  }).directive('popover', function () {
    return {
      restrict: 'A',
      replace: false,
      link: function (scope, elem, attrs) {
        var options = {
            placement: attrs.popoverPlacement || 'top',
            trigger: attrs.popoverTrigger || 'hover',
            content: attrs.popoverContent || attrs.popover
          };
        if (attrs.popoverTitle) {
          options.title = attrs.popoverTitle;
        }
        elem.popover(options);
      }
    };
  }).directive('fsPicker', function () {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        elem.picker();
      }
    };
  }).directive('selecter', function () {
    return {
      restrict: 'A',
      replace: false,
      link: function (scope, elem, attrs) {
        elem.selecter({ label: elem.attr('placeholder') });
        scope.$watch(function () {
          return scope.$eval(elem.attr('selecter'));
        }, function (newVal) {
          _.defer(function () {
            elem.selecter('destroy');
            elem.selecter({ label: elem.attr('placeholder') });
          });
        }, true);
      }
    };
  }).directive('animatedForm', function () {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        var $items = $(elem).find('.animation-group');
        new TimelineLite({
          onComplete: function () {
            elem.find('input.form-control').first().focus();
          }
        }).pause().set($items, {
          autoAlpha: 0,
          position: 'relative',
          bottom: -20
        }).staggerTo($items, 0.2, {
          autoAlpha: 1,
          bottom: 0,
          force3D: true,
          ease: Quad.easeOut
        }, 0.1, '+0.1').resume();
      }
    };
  }).directive('steppedForm', [
    '$q',
    function ($q) {
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          var $fieldsets;
          var initialize = function () {
            $fieldsets = elem.find('.form-step').css({
              position: 'absolute',
              width: '100%',
              top: 0
            });
            elem.css({ position: 'relative' });
            $fieldsets.first().addClass('active');
            TweenLite.set($fieldsets.not(':first'), { autoAlpha: 0 });
            elem.find('a.next').on('click', next);
            elem.find('a.previous').on('click', previous);
            elem.parsley({});
            setHeight();
          };
          var setHeight = function ($elem) {
            var height;
            if ($elem) {
              height = $elem.height();
            } else {
              height = elem.find('.form-step.active').height();
            }
            TweenLite.to(elem, 0.3, { 'min-height': height });
          };
          var transitionSteps = function (currentElem, nextElem, reverse) {
            var deferred = $q.defer();
            var timeline = new TimelineLite({
                onComplete: function () {
                  deferred.resolve();
                }
              }).pause().set(currentElem, { left: 0 }).set(nextElem, { left: reverse ? '-110%' : '110%' }).to(currentElem, 0.35, {
                autoAlpha: 0,
                left: reverse ? '110%' : '-110%'
              }).to(nextElem, 0.35, {
                autoAlpha: 1,
                left: 0
              }, '-=0.35').resume();
            return deferred.promise;
          };
          var validateFieldset = function ($fieldset) {
            var $inputs = $fieldset.find(':input');
            var validationResults = _.map($inputs, function ($input) {
                var validator = new Parsley($input);
                if (_.has(validator, 'validate')) {
                  validator.validate();
                  return validator.isValid();
                }
                return true;
              });
            return _.indexOf(validationResults, false) === -1;
          };
          var next = function () {
            var $current = elem.find('.form-step.active'), $next = $current.next('.form-step');
            if (!validateFieldset($current)) {
              return;
            }
            setHeight($next);
            transitionSteps($current, $next, false).then(function () {
              $current.removeClass('active');
              $next.addClass('active');
            });
          };
          var previous = function () {
            var $current = elem.find('.form-step.active'), $prev = $current.prev('.form-step');
            setHeight($prev);
            transitionSteps($current, $prev, true).then(function () {
              $current.removeClass('active');
              $prev.addClass('active');
            });
          };
          _.defer(initialize);
        }
      };
    }
  ]).directive('form', function () {
    return {
      restrict: 'E',
      priority: -100,
      link: function (scope, elem, attrs) {
        if (elem.find('[stepped-form]').length) {
          return;
        }
        if (attrs.validate) {
          var validator = new Parsley(elem);
          elem.on('submit', function (e) {
            validator.validate();
            if (!validator.isValid()) {
              e.preventDefault();
            }
          });
        }
      }
    };
  }).directive('loggedIn', [
    'Auth',
    function (Auth) {
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          elem = $(elem);
          var check = function () {
            var logged = scope.$eval(elem.attr('logged-in'));
            if (logged && !Auth.check() || !logged && Auth.check()) {
              return elem.addClass('hide');
            }
            elem.removeClass('hide');
          };
          check();
        }
      };
    }
  ]).directive('authGroup', [
    'Auth',
    function (Auth) {
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          elem = $(elem);
          var check = function () {
            var group = attrs.authGroup;
            if (!Auth.hasAccess(group)) {
              return elem.addClass('hide');
            }
            elem.removeClass('hide');
          };
          check();
        }
      };
    }
  ]).directive('checkboxList', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        options: '=',
        selected: '=',
        filterable: '=?'
      },
      template: '<div class="checkbox-list">' + '<input ng-show="filterable" type="text" ng-model="query" placeholder="Filter results...">' + '<div class="scroll-box">' + '<div class="group" ng-repeat="group in _options">' + '<strong ng-if="group.group" class="group-title">{{ group.group }}</strong>' + '<div class="checkbox" ng-repeat="item in group.children | filter:query"><label><input type="checkbox" ng-checked="isSelected(item)" ng-click="toggle(item)"> {{ item }}</label></div>' + '</div>' + '</div>' + '</div>',
      link: function (scope, elem, attrs) {
        scope.toggle = function (value) {
          var index = _.indexOf(scope.selected, value);
          if (index > -1) {
            scope.selected = _.without(scope.selected, value);
          } else {
            scope.selected.push(value);
          }
        };
        scope.isSelected = function (value) {
          return _.indexOf(scope.selected, value) > -1;
        };
        scope.$watch('selected', function (newVal) {
          if (_.isString(newVal)) {
            newVal = [newVal];
          }
          scope.selected = newVal || [];
        }, true);
        scope.$watch('options', function (newVal) {
          if (_.isArray(newVal) && _.isUndefined(newVal[0].children)) {
            scope._options = [{ children: newVal }];
          } else {
            scope._options = newVal;
          }
        }, true);
      }
    };
  });
  ;
  angular.module('InternLabs.services', []).service('Options', function () {
    var apiBase = '/api/';
    this.apiUrl = function (resource) {
      return apiBase + resource.replace(/^\/|\/$/g, '');
    };
  });
  ;
  angular.module('InternLabs.services').service('Auth', [
    '$rootScope',
    '$http',
    '$q',
    '$location',
    'Options',
    function ($rootScope, $http, $q, $location, Options) {
      var _user = angular.fromJson(window.internlabs.user);
      this.check = function () {
        return !!_user;
      };
      this.getUser = function () {
        return _user || false;
      };
      this.hasAccess = function (type) {
        return _user && type === _user.type;
      };
      this.login = function (credentials) {
        var deferred = $q.defer();
        var httpPromise = $http.post(Options.apiUrl('login'), credentials);
        httpPromise.success(function (data, status) {
          if (!data.success) {
            return deferred.reject(data.error);
          }
          window.location.href = '/';
        });
        return deferred.promise;
      };
      this.register = function (user) {
        var deferred = $q.defer();
        var httpPromise = $http.post(Options.apiUrl('register'), user);
        httpPromise.success(function (data, status) {
          if (!data.success) {
            return deferred.reject(data.error);
          }
          ;
          deferred.resolve(data.data.user);
        });
        return deferred.promise;
      };
      this.activate = function (data) {
        var deferred = $q.defer();
        $http.put(Options.apiUrl('activate'), data).success(function (data, status) {
          deferred.resolve(data);
        });
        return deferred.promise;
      };
      this.resendActivation = function (data) {
        return $http.post(Options.apiUrl('resend-activation'), data);
      };
      this.sendPasswordReset = function (data) {
        var deferred = $q.defer();
        $http.post(Options.apiUrl('password-reset'), data).success(function (data, status) {
          deferred.resolve(data);
        });
        return deferred.promise;
      };
      this.passwordReset = function (data) {
        var deferred = $q.defer();
        $http.put(Options.apiUrl('password-reset'), data).success(function (data, status) {
          deferred.resolve(data);
        });
        return deferred.promise;
      };
      this.logout = function () {
        var httpPromise = $http({
            method: 'DELETE',
            url: Options.apiUrl('logout')
          });
        httpPromise.success(function (data) {
          window.location.href = '/';
        });
      };
    }
  ]);
  ;
  angular.module('InternLabs.services').run([
    'Restangular',
    function (Restangular) {
      Restangular.extendModel('companies', function (model) {
        model.getDisplayAddress = function () {
          var html = '', address = this.address;
          html += address.line1 + '<br />';
          if (address.line2)
            html += address.line2 + '<br />';
          html += address.city + ', ';
          html += address.state + ', ';
          html += address.postcode + '<br />';
          html += address.country;
          return html;
        };
        model.getGoogleMapsLink = function () {
          var address = this.address, url = '';
          url += 'http://maps.google.com/?ie=UTF8&hq=&ll=';
          url += address.lat + ',' + address.lng;
          url += '&q=' + address.lat + ',' + address.lng;
          ;
          url += '&z=18';
          return url;
        };
        return model;
      });
    }
  ]);
  ;
  angular.module('InternLabs.services').factory('Role', function () {
    var Role = function (data) {
      angular.extend(this, data);
    };
    return Role;
  }).service('RoleService', [
    '$http',
    '$q',
    'Role',
    'Options',
    function ($http, $q, Role, Options) {
      this.delete = function (role) {
        var deferred = $q.defer();
        $http.delete(Options.apiUrl('/roles/' + role._id)).success(function (data) {
          if (!data.success) {
            return deferred.reject(data.error);
          }
          deferred.resolve(data.message);
        });
        return deferred.promise;
      };
    }
  ]);
  ;
  angular.module('InternLabs.services').service('SearchQuery', function () {
    this.parse = function (params) {
      params = _.clone(params);
      if (params.locations) {
        params.locations = params.locations.split(',');
      }
      if (params.skills) {
        params.skills = params.skills.split(',');
      }
      return params;
    };
    this.serialize = function (query) {
      query = _.clone(query);
      if (query.locations && _.isArray(query.locations)) {
        query.locations = _.compact(query.locations).join(',');
      }
      if (query.skills && _.isArray(query.skills)) {
        query.skills = _.compact(query.skills).join(',');
      }
      return _.compactObject(query);
    };
  }).service('Search', [
    '$http',
    'Options',
    function ($http, Options) {
      this.query = function (query) {
        return $http.get(Options.apiUrl('search'), { params: query }).then(function (data) {
          return data.data;
        });
      };
    }
  ]);
  ;
  angular.module('InternLabs.company', []).config([
    '$routeProvider',
    function ($routeProvider) {
      $routeProvider.when('/company/:companyId/:slug?', {
        templateUrl: 'company/details.tpl.html',
        controller: 'CompanyDetailsCtrl',
        pageTitle: 'Company Details',
        resolve: {
          company: function ($route, Restangular) {
            return Restangular.one('companies', $route.current.params.companyId).get();
          }
        }
      });
      ;
    }
  ]).controller('CompanyDetailsCtrl', [
    '$scope',
    '$sce',
    'Restangular',
    'company',
    'ModalFactory',
    function ($scope, $sce, Restangular, company, ModalFactory) {
      $scope.company = company;
      $scope.company.displayAddress = $sce.trustAsHtml(company.getDisplayAddress());
      $scope.application = { company: company._id };
      $scope.apply = function (role) {
        ModalFactory.create({
          scope: {
            title: 'Apply for internship',
            application: $scope.application,
            role: role,
            save: function () {
              Restangular.all('internships').post(this.application).then(function (response) {
                console.log(response);
                this.close();
              }.bind(this));
            }
          },
          templateUrl: 'internships/forms/apply.tpl.html',
          className: 'modal-lg modal-create-application'
        });
      };
      $scope.showRoleDetails = function (role) {
        ModalFactory.create({
          scope: { title: role.title },
          template: role.description
        });
      };
    }
  ]);
  ;
  angular.module('InternLabs.dashboard', []).config([
    '$routeProvider',
    function ($routeProvider) {
      $routeProvider.when('/dashboard', {
        templateUrl: 'dashboard/layout.tpl.html',
        controller: 'DashboardCtrl',
        pageTitle: 'Dashboard',
        auth: true,
        state: { main: 'dashboard/dashboard.tpl.html' }
      }).when('/dashboard/internships', {
        templateUrl: 'dashboard/layout.tpl.html',
        controller: 'InternshipsCtrl',
        pageTitle: 'My Internships',
        auth: true,
        state: { main: 'dashboard/internships.tpl.html' },
        resolve: {
          internships: function (Restangular) {
            return Restangular.one('me').all('internships').getList();
          }
        }
      }).when('/dashboard/applications', {
        templateUrl: 'dashboard/layout.tpl.html',
        controller: 'ApplicationsCtrl',
        pageTitle: 'Pending Applications',
        auth: true,
        state: { main: 'dashboard/applications.tpl.html' }
      }).when('/dashboard/roles', {
        templateUrl: 'dashboard/layout.tpl.html',
        controller: 'RolesCtrl',
        pageTitle: 'Available Roles',
        auth: true,
        state: { main: 'dashboard/roles.tpl.html' },
        resolve: {
          roles: function (Auth, Restangular) {
            return Restangular.one('companies', Auth.getUser().company).all('roles').getList();
          }
        }
      }).when('/dashboard/company-profile', {
        templateUrl: 'dashboard/layout.tpl.html',
        controller: 'CompanyProfileCtrl',
        pageTitle: 'Company Profile',
        auth: true,
        state: { main: 'dashboard/company-profile.tpl.html' },
        resolve: {
          company: function (Auth, Restangular) {
            return Restangular.one('companies', Auth.getUser().company).get();
          }
        }
      });
      ;
    }
  ]).controller('DashboardCtrl', [
    '$route',
    '$scope',
    function ($route, $scope) {
      $scope.state = $route.current.$$route.state;
      $scope.active = 'dashboard';
    }
  ]).controller('InternshipsCtrl', [
    '$route',
    '$scope',
    'internships',
    function ($route, $scope, internships) {
      $scope.state = $route.current.$$route.state;
      $scope.active = 'internships';
      $scope.internships = internships;
    }
  ]).controller('ApplicationsCtrl', [
    '$route',
    '$scope',
    function ($route, $scope) {
      $scope.state = $route.current.$$route.state;
      $scope.active = 'applications';
    }
  ]).controller('RolesCtrl', [
    '$route',
    '$scope',
    'ModalFactory',
    'roles',
    'Restangular',
    function ($route, $scope, ModalFactory, roles, Restangular) {
      $scope.state = $route.current.$$route.state;
      $scope.active = 'roles';
      $scope.roles = roles;
      $scope.add = function () {
        ModalFactory.create({
          scope: {
            title: 'Add an Internship Role',
            role: {},
            save: function () {
              roles.post(this.role).then(function (newRole) {
                roles.unshift(newRole);
                this.close();
              }.bind(this));
            }
          },
          templateUrl: 'dashboard/forms/role.tpl.html',
          className: 'modal-add-role'
        });
      };
      $scope.edit = function (role) {
        ModalFactory.create({
          scope: {
            title: 'Edit Role',
            role: role,
            save: function () {
              this.role.put().then(function (newRole) {
                roles[_.indexOf(roles, role)] = newRole;
                this.close();
              }.bind(this));
            }
          },
          templateUrl: 'dashboard/forms/role.tpl.html',
          className: 'modal-edit-role'
        });
      };
      $scope.delete = function (role) {
        ModalFactory.create({
          scope: {
            title: 'Delete Role',
            delete: function () {
              role.remove().then(function () {
                roles.splice(_.indexOf(roles, role), 1);
                this.close();
              }.bind(this));
            }
          },
          templateUrl: 'dashboard/forms/role-delete.tpl.html',
          className: 'modal-delete-role'
        });
      };
    }
  ]).controller('CompanyProfileCtrl', [
    '$route',
    '$scope',
    '$fileUploader',
    'Options',
    'company',
    'ModalFactory',
    function ($route, $scope, $fileUploader, Options, company, ModalFactory) {
      $scope.state = $route.current.$$route.state;
      $scope.active = 'profile';
      $scope.company = company;
      $scope.uploadLogo = function () {
        var uploader;
        ModalFactory.create({
          scope: {
            title: 'Upload Company Logo',
            initialize: function () {
              uploader = $fileUploader.create({
                scope: this,
                url: Options.apiUrl('companies/' + company._id + '/logo')
              });
            },
            upload: function () {
              uploader.uploadAll();
              uploader.bind('complete', function (event, xhr, item, response) {
                $scope.$apply(function () {
                  $scope.company = response.data;
                });
                this.close();
              }.bind(this));
            }
          },
          templateUrl: 'dashboard/forms/logo-upload.tpl.html',
          className: 'modal-upload-logo'
        });
      };
      $scope.deleteLogo = function () {
        ModalFactory.create({
          scope: {
            title: 'Remove Company Logo',
            delete: function () {
              company.customDELETE('logo').then(function (data) {
                $scope.company = data.data;
                this.close();
              }.bind(this));
            }
          },
          templateUrl: 'dashboard/forms/logo-delete.tpl.html',
          className: 'modal-delete-logo'
        });
      };
    }
  ]);
  ;
  angular.module('InternLabs.home', []).config([
    '$routeProvider',
    function ($routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'home/home.tpl.html',
        controller: 'HomeCtrl',
        pageTitle: 'InternLabs',
        className: 'background-primary'
      });
    }
  ]).controller('HomeCtrl', [
    '$scope',
    '$location',
    'Auth',
    function ($scope, $location, Auth) {
      if (Auth.check()) {
        $location.path('/dashboard');
      }
    }
  ]).directive('fillScreen', function () {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        var headerHeight = angular.element('#primary-nav').height();
        var resizeElem = function () {
          var windowHeight = angular.element(window).height();
          elem.css('min-height', 0).css('min-height', windowHeight - headerHeight);
        };
        angular.element(window).on('resize', resizeElem);
        resizeElem();
      }
    };
  }).directive('homepageHero', function () {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        var $title = $(elem).find('.hero-title'), $callToAction = $(elem).find('.call-to-action'), $actions = $(elem).find('.actions');
        new TimelineLite({
          onComplete: function () {
          }
        }).pause().set($title, { autoAlpha: 0 }).set([
          $callToAction,
          $actions
        ], {
          autoAlpha: 0,
          position: 'relative',
          bottom: -30
        }).to($title, 0.5, {
          autoAlpha: 1,
          ease: Quad.easeIn
        }, '+0.1').staggerTo([
          $callToAction,
          $actions
        ], 0.45, {
          autoAlpha: 1,
          bottom: 0,
          force3D: true,
          ease: Quad.easeOut
        }, 0.45, '+0.75').resume();
      }
    };
  });
  ;
  angular.module('InternLabs.internships', []).config([
    '$routeProvider',
    function ($routeProvider) {
      $routeProvider.when('/internship/:internshipId/:slug?', {
        templateUrl: 'internships/details.tpl.html',
        controller: 'InternshipDetails',
        pageTitle: 'Internship Dashboard',
        resolve: {
          internship: function ($route, Restangular) {
            return Restangular.one('internships', $route.current.params.internshipId).get();
          }
        }
      });
      ;
    }
  ]).controller('InternshipDetails', [
    '$scope',
    '$sce',
    'internship',
    'ModalFactory',
    function ($scope, $sce, internship, ModalFactory) {
      $scope.internship = internship;
      $scope.company = internship.company;
      $scope.student = internship.student;
      $scope.profile = internship.student.profile;
    }
  ]).directive('applyForm', function () {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        scope.application.role = {};
        if (scope.role) {
          scope.application.role = scope.role;
          scope.existingRole = true;
        }
      }
    };
  });
  ;
  angular.module('InternLabs.login', []).config([
    '$routeProvider',
    function ($routeProvider) {
      $routeProvider.when('/login', {
        templateUrl: 'login/login.tpl.html',
        controller: 'LoginCtrl',
        pageTitle: 'Login',
        className: 'background-primary'
      }).when('/activate', {
        templateUrl: 'login/activate.tpl.html',
        controller: 'ActivateCtrl',
        pageTitle: 'Account Activation',
        className: 'background-primary'
      }).when('/resend-activation', {
        templateUrl: 'login/resend-activation.tpl.html',
        controller: 'ResendActivationCtrl',
        pageTitle: 'Resend Activation Email',
        className: 'background-primary'
      }).when('/password-reset', {
        templateUrl: 'login/password-reset.tpl.html',
        controller: 'PasswordResetCtrl',
        pageTitle: 'Reset Password',
        className: 'background-primary'
      }).when('/logout', {
        pageTitle: 'Logout',
        resolve: {
          response: function (Auth, $q, $location) {
            var deferred = $q.defer();
            Auth.logout().then(function (data) {
              $location.path('/');
            });
            return deferred.promise;
          }
        }
      });
      ;
    }
  ]).controller('LoginCtrl', [
    '$scope',
    '$location',
    'Auth',
    function ($scope, $location, Auth) {
      $scope.credentials = {};
      $scope.submit = function () {
        Auth.login($scope.credentials).then(function (data) {
          $location.url('/');
        }, function (error) {
          $scope.errors = error;
        });
      };
    }
  ]).controller('ActivateCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    'Auth',
    function ($rootScope, $scope, $location, Auth) {
      $rootScope.loading = true;
      $scope.activated = false;
      var params = $location.search();
      Auth.activate({
        activationToken: params.token,
        userId: params.user
      }).then(function (response) {
        $rootScope.loading = false;
        $scope.activated = true;
      });
    }
  ]).controller('PasswordResetCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    'Auth',
    function ($rootScope, $scope, $location, Auth) {
      var params = $location.search();
      $scope.action = _.isEmpty(params) ? 'send' : 'reset';
      $scope.reset = {};
      $scope.sendSuccess = false;
      $scope.resetSuccess = false;
      $scope.send = function () {
        $rootScope.loading = true;
        Auth.sendPasswordReset({ email: $scope.reset.email }).then(function (response) {
          $rootScope.loading = false;
          $scope.sendSuccess = true;
        });
      };
      $scope.reset = function () {
        $rootScope.loading = true;
        Auth.passwordReset({
          userId: params.user,
          password: $scope.reset.password,
          resetToken: params.token
        }).then(function (response) {
          $rootScope.loading = false;
          $scope.resetSuccess = true;
        });
      };
    }
  ]).controller('ResendActivationCtrl', [
    '$rootScope',
    '$scope',
    'Auth',
    function ($rootScope, $scope, Auth) {
      $scope.resend = {};
      $scope.success = false;
      $scope.send = function () {
        $rootScope.loading = true;
        Auth.resendActivation({ email: $scope.resend.email }).then(function (response) {
          $rootScope.loading = false;
          if (!response.data.success) {
            return $scope.errors = response.data.error;
          }
          $scope.success = true;
        });
      };
    }
  ]).directive('loginForm', function () {
    return {
      restrict: 'A',
      scope: {
        credentials: '=',
        submit: '&?'
      },
      link: function (scope, elem, attrs) {
      }
    };
  });
  ;
  angular.module('InternLabs.register', []).config([
    '$routeProvider',
    function ($routeProvider) {
      $routeProvider.when('/signup/:type', {
        templateUrl: 'register/register.tpl.html',
        controller: 'RegisterCtrl',
        pageTitle: 'Signup',
        className: 'background-primary'
      });
      ;
    }
  ]).controller('RegisterCtrl', [
    '$scope',
    '$rootScope',
    '$routeParams',
    '$location',
    '$fileUploader',
    'Auth',
    'Options',
    'ModalFactory',
    function ($scope, $rootScope, $routeParams, $location, $fileUploader, Auth, Options, ModalFactory) {
      if (_.indexOf([
          'employer',
          'student',
          'supervisor'
        ], $routeParams.type) === -1) {
        $location.path('/signup/student');
      }
      $scope.user = { type: $routeParams.type };
      var uploader = $scope.uploader = $fileUploader.create({ scope: $scope });
      $scope.submit = function () {
        $rootScope.loading = true;
        Auth.register($scope.user).then(function (user) {
          var logoEndpoint = Options.apiUrl('companies/' + user.company._id + '/logo');
          _.each(uploader.queue, function (file) {
            file.url = logoEndpoint;
          });
          uploader.uploadAll();
          $rootScope.loading = false;
          $location.url('/login');
        }, function (errors) {
          $rootScope.loading = false;
          ModalFactory.create({
            scope: {
              title: 'An error occured',
              errors: errors
            },
            templateUrl: 'register/modal-error.tpl.html',
            className: 'modal-register-error'
          });
        });
      };
    }
  ]).directive('registerForm', function () {
    return {
      restrict: 'A',
      templateUrl: 'register/register-form.tpl.html',
      scope: {
        user: '=',
        submit: '=?'
      },
      link: function (scope, elem, attrs) {
        scope.type = function () {
          return _(scope.user.type).capitalize();
        };
      }
    };
  });
  ;
  angular.module('InternLabs.search', []).config([
    '$routeProvider',
    function ($routeProvider) {
      $routeProvider.when('/search/', {
        templateUrl: 'search/search.tpl.html',
        controller: 'SearchCtrl',
        pageTitle: 'Search',
        resolve: {
          results: function ($route, Search, SearchQuery) {
            return Search.query(SearchQuery.serialize($route.current.params));
          },
          options: function ($http) {
            return $http.get('/api/search/options').then(function (data) {
              return data.data.data;
            });
          }
        },
        reloadOnSearch: false
      });
      ;
    }
  ]).controller('SearchCtrl', [
    '$scope',
    '$routeParams',
    '$location',
    'Search',
    'SearchQuery',
    'results',
    'options',
    function ($scope, $routeParams, $location, Search, SearchQuery, results, options) {
      var initial = true;
      $scope.results = results.data.results;
      $scope.query = SearchQuery.parse($routeParams);
      $scope.query.view = 'list';
      $scope.options = options;
      $scope.search = function () {
        if (initial) {
          return initial = false;
        }
        $location.search(SearchQuery.serialize($scope.query));
        Search.query(SearchQuery.serialize($scope.query)).then(function (data) {
          $scope.results = [];
          $scope.results = data.data.results;
        });
      };
      $scope.$watch('query', $scope.search, true);
      $scope.$on('$locationChangeSuccess', function () {
        var path = $location.path().split('/')[1];
        if (path !== 'search') {
          return;
        }
        $scope.query = $location.search();
      });
    }
  ]).directive('searchWidget', function () {
    return {
      restrict: 'A',
      templateUrl: 'search/search-widget.tpl.html',
      scope: {
        _query: '=query',
        options: '=?'
      },
      link: function (scope, elem, attrs) {
        scope.showAdvanced = false;
        scope.toggleAdvanced = function () {
          scope.showAdvanced = !scope.showAdvanced;
        };
        scope.search = function () {
          scope._query = angular.copy(scope.query);
        };
        scope.$watch('_query', function (newVal) {
          if (newVal) {
            scope.query = angular.copy(scope._query);
          }
        }, true);
      }
    };
  }).directive('resultsViewToggle', function () {
    return {
      restrict: 'A',
      template: '<div class="btn-group results-view-toggle">' + '<button type="button" ng-class="{\'btn btn-default\': query.view!=\'list\', \'btn btn-primary\': query.view == \'list\'}" ng-click="set(\'list\')"><i class="fa fa-list"></i> List View</button>' + '<button type="button" ng-class="{\'btn btn-default\': query.view!=\'map\', \'btn btn-primary\': query.view == \'map\'}" ng-click="set(\'map\')"><i class="fa fa-map-marker"></i> Map View</button>' + '</div>',
      scope: { query: '=' },
      link: function (scope, elem, attrs) {
        scope.set = function (view) {
          scope.query.view = view;
        };
      }
    };
  }).directive('resultsMap', [
    '$compile',
    function ($compile) {
      return {
        restrict: 'A',
        templateUrl: 'search/results-map.tpl.html',
        replace: true,
        scope: {
          query: '=',
          results: '='
        },
        link: function (scope, elem, attrs) {
          var infoWindowTemplate = elem.find('#infoWindowTemplate').html();
          var gmap = null;
          var initMap = function () {
            gmap = new GMaps({
              div: '#map',
              lat: -12.043333,
              lng: -77.028333,
              mapTypeControl: false,
              minZoom: 5,
              visible: true,
              idle: function () {
                console.log('idle');
              },
              click: function () {
                _.each(gmap.markers, function (marker) {
                  marker.infoBox.close();
                });
              }
            });
            addMarkers();
          };
          var addMarkers = function () {
            _.each(scope.results, function (result, key) {
              var markerOptions = {
                  lat: result.address.lat,
                  lng: result.address.lng,
                  animation: google.maps.Animation.DROP,
                  click: function () {
                    var self = this;
                    _.each(gmap.markers, function (marker) {
                      if (marker != self) {
                        marker.infoBox.close();
                      }
                    });
                    this.infoBox.open(this.map, this);
                    gmap.setCenter(this.getPosition().lat(), this.getPosition().lng(), function () {
                    });
                  }
                };
              var marker = gmap.addMarker(markerOptions);
              marker.result = result;
              marker.infoBox = getInfoBox(marker);
            });
            fitBounds();
          };
          var fitBounds = function () {
            var bounds = new google.maps.LatLngBounds();
            _.each(scope.results, function (result, key) {
              if (!result.address.lat || !result.address.lng) {
                return;
              }
              ;
              bounds.extend(new google.maps.LatLng(result.address.lat, result.address.lng));
            });
            gmap.fitBounds(bounds);
          };
          var getInfoBox = function (marker) {
            var content = getInfoBoxContent(marker);
            var options = {
                content: content,
                alignBottom: true,
                closeBoxURL: '',
                pixelOffset: new google.maps.Size(-160, 0),
                infoBoxClearance: new google.maps.Size(1, 1)
              };
            return new InfoBox(options);
          };
          var getInfoBoxContent = function (marker) {
            var boxScope = scope.$new(true);
            boxScope.result = marker.result;
            var elem = $compile(infoWindowTemplate)(boxScope);
            elem.find('.close-button').on('click', function () {
              marker.infoBox.close();
            });
            return elem[0];
          };
          $(window).on('resize', fitBounds);
          initMap();
        }
      };
    }
  ]);
  ;
}(window, window.angular));