/*!
 * drag-event-service v1.0.4
 * (c) phphe <phphe@outlook.com> (https://github.com/phphe)
 * Homepage: undefined
 * Released under the MIT License.
 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _toConsumableArray = _interopDefault(require('@babel/runtime/helpers/toConsumableArray'));
var hp = require('helper-js');

var events = {
  start: ['mousedown', 'touchstart'],
  move: ['mousemove', 'touchmove'],
  end: ['mouseup', 'touchend']
};
var index = {
  isTouch: function isTouch(e) {
    return e.type && e.type.startsWith('touch');
  },
  _getStore: function _getStore(el) {
    if (!el._wrapperStore) {
      el._wrapperStore = [];
    }

    return el._wrapperStore;
  },
  on: function on(el, name, handler, options) {
    var _hp$onDOM, _hp$onDOM2;

    var _resolveOptions = resolveOptions(options),
        args = _resolveOptions.args,
        mouseArgs = _resolveOptions.mouseArgs,
        touchArgs = _resolveOptions.touchArgs;

    var store = this._getStore(el);

    var ts = this;

    var wrapper = function wrapper(e) {
      var mouse;
      var isTouch = ts.isTouch(e);

      if (isTouch) {
        // touch
        mouse = {
          x: e.changedTouches[0].pageX,
          y: e.changedTouches[0].pageY
        };
      } else {
        // mouse
        mouse = {
          x: e.pageX,
          y: e.pageY
        };

        if (name === 'start' && e.which !== 1) {
          // not left button mousedown
          return;
        }
      }

      return handler.call(this, e, mouse);
    };

    store.push({
      handler: handler,
      wrapper: wrapper
    }); // follow format will cause big bundle size
    // 以下写法将会使打包工具认为hp是上下文, 导致打包整个hp
    // hp.onDOM(el, events[name][0], wrapper, ...args)

    (_hp$onDOM = hp.onDOM).call.apply(_hp$onDOM, [null, el, events[name][0], wrapper].concat([].concat(_toConsumableArray(args), _toConsumableArray(mouseArgs))));

    (_hp$onDOM2 = hp.onDOM).call.apply(_hp$onDOM2, [null, el, events[name][1], wrapper].concat([].concat(_toConsumableArray(args), _toConsumableArray(touchArgs))));
  },
  off: function off(el, name, handler, options) {
    var _resolveOptions2 = resolveOptions(options),
        args = _resolveOptions2.args,
        mouseArgs = _resolveOptions2.mouseArgs;

    var store = this._getStore(el);

    for (var i = store.length - 1; i >= 0; i--) {
      var _store$i = store[i],
          handler2 = _store$i.handler,
          wrapper = _store$i.wrapper;

      if (handler === handler2) {
        var _hp$offDOM, _hp$offDOM2;

        (_hp$offDOM = hp.offDOM).call.apply(_hp$offDOM, [null, el, events[name][0], wrapper].concat([].concat(_toConsumableArray(args), _toConsumableArray(mouseArgs))));

        (_hp$offDOM2 = hp.offDOM).call.apply(_hp$offDOM2, [null, el, events[name][1], wrapper].concat([].concat(_toConsumableArray(args), _toConsumableArray(mouseArgs))));

        store.splice(i, 1);
      }
    }
  }
};

function resolveOptions(options) {
  if (!options) {
    options = {};
  }

  var args = options.args || [];
  var mouseArgs = options.mouseArgs || [];
  var touchArgs = options.touchArgs || [];
  return {
    args: args,
    mouseArgs: mouseArgs,
    touchArgs: touchArgs
  };
}

module.exports = index;
