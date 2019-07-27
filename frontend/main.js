(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./node_modules/hammerjs/hammer.js":
/*!*****************************************!*\
  !*** ./node_modules/hammerjs/hammer.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined) {
  'use strict';

var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * wrap a method with a deprecation warning and stack trace
 * @param {Function} method
 * @param {String} name
 * @param {String} message
 * @returns {Function} A new function wrapping the supplied method.
 */
function deprecate(method, name, message) {
    var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
    return function() {
        var e = new Error('get-stack-trace');
        var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
            .replace(/^\s+at\s+/gm, '')
            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

        var log = window.console && (window.console.warn || window.console.log);
        if (log) {
            log.call(window.console, deprecationMessage, stack);
        }
        return method.apply(this, arguments);
    };
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} target
 * @param {...Object} objects_to_assign
 * @returns {Object} target
 */
var assign;
if (typeof Object.assign !== 'function') {
    assign = function assign(target) {
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    };
} else {
    assign = Object.assign;
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge=false]
 * @returns {Object} dest
 */
var extend = deprecate(function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}, 'extend', 'Use `assign`.');

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
var merge = deprecate(function merge(dest, src) {
    return extend(dest, src, true);
}, 'merge', 'Use `assign`.');

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        assign(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined : undefined, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument || element;
    return (doc.defaultView || doc.parentWindow || window);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
    input.overallVelocityX = overallVelocity.x;
    input.overallVelocityY = overallVelocity.y;
    input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
        session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
        var deltaX = input.deltaX - last.deltaX;
        var deltaY = input.deltaY - last.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0, y = 0, i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down
        if (!this.pressed) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent && !window.PointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // get index of the event in the store
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
            }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // it not found, so the pointer hasn't been down (so it's probably a hover)
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var SINGLE_TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function SingleTouchInput() {
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    this.started = false;

    Input.apply(this, arguments);
}

inherit(SingleTouchInput, Input, {
    handler: function TEhandler(ev) {
        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

        // should we handle the touch events?
        if (type === INPUT_START) {
            this.started = true;
        }

        if (!this.started) {
            return;
        }

        var touches = normalizeSingleTouches.call(this, ev, type);

        // when done, reset the started state
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function normalizeSingleTouches(ev, type) {
    var all = toArray(ev.touches);
    var changed = toArray(ev.changedTouches);

    if (type & (INPUT_END | INPUT_CANCEL)) {
        all = uniqueArray(all.concat(changed), 'identifier', true);
    }

    return [all, changed];
}

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Multi-user touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    handler: function MTEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches,
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [],
        target = this.target;

    // get target touches from touches
    targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
    });

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */

var DEDUP_TIMEOUT = 2500;
var DEDUP_DISTANCE = 25;

function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);

    this.primaryTouch = null;
    this.lastTouches = [];
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
            return;
        }

        // when we're in a touch event, record touches to  de-dupe synthetic mouse event
        if (isTouch) {
            recordTouches.call(this, inputEvent, inputData);
        } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
            return;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

function recordTouches(eventType, eventData) {
    if (eventType & INPUT_START) {
        this.primaryTouch = eventData.changedPointers[0].identifier;
        setLastTouch.call(this, eventData);
    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
        setLastTouch.call(this, eventData);
    }
}

function setLastTouch(eventData) {
    var touch = eventData.changedPointers[0];

    if (touch.identifier === this.primaryTouch) {
        var lastTouch = {x: touch.clientX, y: touch.clientY};
        this.lastTouches.push(lastTouch);
        var lts = this.lastTouches;
        var removeLastTouch = function() {
            var i = lts.indexOf(lastTouch);
            if (i > -1) {
                lts.splice(i, 1);
            }
        };
        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
    }
}

function isSyntheticEvent(eventData) {
    var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
    for (var i = 0; i < this.lastTouches.length; i++) {
        var t = this.lastTouches[i];
        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
            return true;
        }
    }
    return false;
}

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';
var TOUCH_ACTION_MAP = getTouchActionProps();

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

        if (hasNone) {
            //do not prevent defaults if this is a tap gesture

            var isTapPointer = input.pointers.length === 1;
            var isTapMovement = input.distance < 2;
            var isTapTouchTime = input.deltaTime < 250;

            if (isTapPointer && isTapMovement && isTapTouchTime) {
                return;
            }
        }

        if (hasPanX && hasPanY) {
            // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
            return;
        }

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // if both pan-x and pan-y are set (different recognizers
    // for different directions, e.g. horizontal pan but vertical swipe?)
    // we need none (as otherwise with pan-x pan-y combined none of these
    // recognizers will work, since the browser would handle all panning
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_NONE;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

function getTouchActionProps() {
    if (!NATIVE_TOUCH_ACTION) {
        return false;
    }
    var touchMap = {};
    var cssSupports = window.CSS && window.CSS.supports;
    ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

        // If css.supports is not supported but there is native touch-action assume it supports
        // all values. This is the case for IE 10 and 11.
        touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
    });
    return touchMap;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.options = assign({}, this.defaults, options || {});

    this.id = uniqueId();

    this.manager = null;

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        assign(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(event) {
            self.manager.emit(event, input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }

        emit(self.options.event); // simple 'eventName' events

        if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
            emit(input.additionalEvent);
        }

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = assign({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {

        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);

        if (direction) {
            input.additionalEvent = this.options.event + direction;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            input.additionalEvent = this.options.event + inOut;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 251, // minimal time of the pointer to be pressed
        threshold: 9 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.3,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.overallVelocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.overallVelocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.overallVelocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.offsetDirection &&
            input.distance > this.options.threshold &&
            input.maxPointers == this.options.pointers &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.offsetDirection);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 9, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create a manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.7';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, {enable: false}],
        [PinchRecognizer, {enable: false}, ['rotate']],
        [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
        [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    this.options = assign({}, Hammer.defaults, options || {});

    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];
    this.oldCssProps = {};

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(this.options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        assign(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        recognizer = this.get(recognizer);

        // let's make sure this recognizer exists
        if (recognizer) {
            var recognizers = this.recognizers;
            var index = inArray(recognizers, recognizer);

            if (index !== -1) {
                recognizers.splice(index, 1);
                this.touchAction.update();
            }
        }

        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        if (events === undefined) {
            return;
        }
        if (handler === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        if (events === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    if (!element.style) {
        return;
    }
    var prop;
    each(manager.options.cssProps, function(value, name) {
        prop = prefixed(element.style, name);
        if (add) {
            manager.oldCssProps[prop] = element.style[prop];
            element.style[prop] = value;
        } else {
            element.style[prop] = manager.oldCssProps[prop] || '';
        }
    });
    if (!add) {
        manager.oldCssProps = {};
    }
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

assign(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,
    SingleTouchInput: SingleTouchInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    assign: assign,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

// this prevents errors when Hammer is loaded in the presence of an AMD
//  style loader but by script tag, not by the loader.
var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
freeGlobal.Hammer = Hammer;

if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
        return Hammer;
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {}

})(window, document, 'Hammer');


/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/about-us/about-us.component.html":
/*!**************************************************!*\
  !*** ./src/app/about-us/about-us.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"wrapper\">\r\n        <div data-aos-duration=\"1200\" data-aos=\"fade\" class=\"page-header background  page-header-sm\" data-parallax=\"true\" style=\"background-image: url('./assets/img/about_us.jpeg');\">\r\n            <div class=\"filter\"></div>\r\n            <div class=\"container mt-4 pt-4 \">\r\n                <div class=\"mt-4 pt-4 motto text-left\">\r\n                <h3 class=\"title-uppercase py-4 mt-4\">about us</h3>\r\n                <!-- <p class=\"description text-white\">\r\n                    A Professional Tourism Corporation Based in Jeddah, Saudi Arabia. \r\n                    </p> -->\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"section sm profile-content\">\r\n            <div class=\"container\">\r\n                <!-- <div class=\"row\">\r\n                    <div class=\"col-md-12 ml-auto mr-auto text-justify\">\r\n                        <h3 class=\"title  title-uppercase\">about us<br /></h3>\r\n                    </div>\r\n\r\n                </div> -->\r\n                <div class=\"row  my-4 py-4\">\r\n                    <div  data-aos-duration=\"1200\" data-aos=\"fade\" data-aos-delay=\"300\" data-aos-easing=\"ease-out-bounce\" class=\"col-md-12 mb-4 ml-auto mr-auto text-justify\">\r\n                        <p class=\"description mb-4\" >A Professional Tourism Corporation Based in Jeddah, Saudi Arabia. Licensed by Ministry of Commerce, Saudi travel and tourism association and the Saudi\r\n                            Commission for Tourism and National Heritage.</p>\r\n\r\n                        <p class=\"description mb-4\" >We aim to be a unique tourism services provider through helping people to travel smart within their budget. \r\n                            Our mission is to combine our travel knowledge and expertise, enabling our customers to plan and then enjoy an amazing travel experience through\r\n                                providing them with fair value against requested tourism services and full commitments of our promises.</p>\r\n\r\n                                <p class=\"description mb-4\">At Rawnaq you can find a variety of \r\n                                specialized tourism services with just one stop such as Ticketing, \r\n                                Hotels Booking and Tourism Packages for the luxury destinations all over the world.</p>\r\n            \r\n                        <p  class=\"description\" >This is allowed us to be one of the most admired and accepted corporations in the tourism field in GCC, \r\n                            serving more than 500,000 followers in our social media channels and numerous corporate clients as well. \r\n                            With our proven history of commitments, honesty, responsibility, efficiency and problem-solving skills, \r\n                            we are well suited to fulfill the unique requirements \r\n                            our clients. We highly appreciate our strong team members and their cooperation for the success of our corporation.</p>\r\n                    </div>\r\n                    <br/>\r\n                    \r\n                </div>\r\n                \r\n    \r\n\r\n\r\n                <!--  -->\r\n                <div class=\"row section-gray mt-4 mb-0 pb-0 text-center\">\r\n                    <div class=\"col-md-6 d-xs-none\" style=\"background-image: url('./assets/img/mission.jpg'); background-repeat: no-repeat; background-size: cover\" >\r\n                        <div class=\"my-4 py-4\">\r\n                                <br>                           \r\n                                <br>\r\n                                <br>\r\n                                <br>\r\n                                <br>\r\n                                <br>\r\n                                <br>\r\n                                <br>\r\n\r\n                        </div>\r\n                    </div>\r\n\r\n\r\n                    <div data-aos-duration=\"1200\" data-aos=\"fade-up\" data-aos-delay=\"300\" data-aos-easing=\"ease-out-bounce\" class=\"col-md-6 my-auto mx-auto py-5 text-center\">\r\n                        <div class=\"about-page\">\r\n                            <!-- <a class=\"mt-4\" href=\"#\" ><i class=\"nc-icon nc-email-85\"></i></a> -->\r\n                            <h6 class=\"my-2\" >Vision</h6>\r\n                            <p class=\"description\">Rawnaq aims to be a unique tourism <br/> services provider through \r\n                                helping people to <br/> travel smart within their budget.</p>  \r\n                        </div>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"row section-gray mt-0 mb-4 text-center\">\r\n                    <div data-aos-duration=\"1200\" data-aos=\"fade-up\" data-aos-delay=\"300\" data-aos-easing=\"ease-out-bounce\"  class=\"col-md-6 my-auto mx-auto py-5\">\r\n                        <div class=\"about-page\">\r\n                                <h6 class=\"my-2\" >Mission</h6>\r\n                                <p class=\"description\">Enabling our customers to plan and enjoy an <br/> \r\n                                    amazing travel experience with our vast <br/> experience and expertise.</p>\r\n                            <!-- <a class=\"mt-4\" href=\"#\" ><i class=\"nc-icon nc-email-85\"></i></a> -->\r\n                             \r\n                        </div>\r\n                    </div>\r\n\r\n\r\n                    <div class=\"col-md-6 d-xs-none\" style=\"background-image: url('./assets/img/vision.jpg'); background-repeat: no-repeat; background-size: cover\" >\r\n                        <div class=\"my-4 py-4\">\r\n                                <br>                           \r\n                                <br>\r\n                                <br>\r\n                                <br>\r\n                                <br>\r\n                                <br>\r\n                                <br>\r\n                                <br>\r\n\r\n                        </div>\r\n                    </div>\r\n                        \r\n                </div>\r\n                    <!--  -->\r\n\r\n\r\n        \r\n            <div data-aos-duration=\"1200\" data-aos=\"fade\" data-aos-delay=\"300\" data-aos-easing=\"ease-out-bounce\" class=\"row\">\r\n                <div class=\"col-md-12 mr-auto ml-auto text-center\">\r\n                    <h4 class=\"mb-4 pb-4 title-uppercase\"> Our Values</h4> \r\n                </div>\r\n            </div>\r\n\r\n                    <div data-aos-duration=\"1200\" data-aos=\"fade-up\" data-aos-delay=\"300\" data-aos-easing=\"ease-out-bounce\" class=\"row mb-4 pb-4 text-center\">\r\n        \r\n                        <div class=\"col-md-2 py-sm-3 mr-auto ml-auto\">\r\n                            <div class=\"about-page\">\r\n                                    <a href=\"#\"><i class=\"nc-icon nc-diamond\"></i></a>\r\n                                    <h6 class=\"description\" >Responsibility </h6>\r\n                            </div>\r\n                        </div>\r\n                \r\n                        \r\n                            <div class=\"col-md-2 py-sm-3 mr-auto ml-auto\">\r\n                                <div class=\"about-page\">\r\n                                        <a href=\"#\"><i class=\"nc-icon nc-diamond\"></i></a>\r\n                                        <h6 class=\"description\" >Innovation</h6>\r\n                                </div>\r\n                            </div>\r\n                        \r\n            \r\n                            <div class=\"col-md-2 py-sm-3 mr-auto ml-auto\">\r\n                                <div class=\"about-page\">\r\n                                        <a href=\"#\"><i class=\"nc-icon nc-diamond\"></i></a>\r\n                                        <h6 class=\"description\" >Quality</h6>\r\n                                </div>\r\n                            </div>\r\n\r\n                            <div class=\"col-md-2 py-sm-3 mr-auto ml-auto\">\r\n                                    <div class=\"about-page\">\r\n                                            <a href=\"#\"><i class=\"nc-icon nc-diamond\"></i></a>\r\n                                            <h6 class=\"description\" >Honesty</h6>\r\n                                    </div>\r\n                                </div>\r\n                            <div class=\"col-md-2 py-sm-3 mr-auto ml-auto\">\r\n                                    <div class=\"about-page\">\r\n                                            <a href=\"#\"><i class=\"nc-icon nc-diamond\"></i></a>\r\n                                            <h6 class=\"description\" >Efficiency</h6>\r\n                                    </div>\r\n                                </div>\r\n\r\n                            <div class=\"col-md-2 py-sm-3 mr-auto ml-auto\">\r\n                                    <div class=\"about-page\">\r\n                                            <a href=\"#\"><i class=\"nc-icon nc-diamond\"></i></a>\r\n                                            <h6 class=\"description\" >Commitments</h6>\r\n                                    </div>\r\n                                </div>\r\n                    \r\n                    </div>\r\n        </div>\r\n    \r\n    </div>      \r\n    </div>\r\n    <!--End of section-->\r\n    <!-- About us page -->"

/***/ }),

/***/ "./src/app/about-us/about-us.component.scss":
/*!**************************************************!*\
  !*** ./src/app/about-us/about-us.component.scss ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/about-us/about-us.component.ts":
/*!************************************************!*\
  !*** ./src/app/about-us/about-us.component.ts ***!
  \************************************************/
/*! exports provided: AboutUsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AboutUsComponent", function() { return AboutUsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/animations */ "./node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! aos */ "./node_modules/aos/dist/aos.js");
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(aos__WEBPACK_IMPORTED_MODULE_4__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AboutUsComponent = /** @class */ (function () {
    function AboutUsComponent(el, title, router) {
        this.el = el;
        this.title = title;
        this.router = router;
        this.state = 'hide';
        this.title.setTitle('RAWNAQ Tourism | About us');
    }
    // @HostListener('window:scroll', ['$event'])
    //   checkScroll() {
    //     var d = document.getElementById("values");
    //     var topPos = d.offsetTop;
    //     //const componentPosition = this.el.nativeElement.getBoundingClientRect().top
    //     const scrollPosition = window.pageYOffset
    //     if (scrollPosition >= topPos) {
    //       this.state = 'show';
    //       console.log("show: ", scrollPosition);
    //       console.log("show: ", topPos);
    //     }
    // } else {
    //   this.state = 'hide';
    //   console.log("hide: ", scrollPosition);
    //   console.log("hide: ", topPos);
    // }
    // }
    AboutUsComponent.prototype.ngOnInit = function () {
        aos__WEBPACK_IMPORTED_MODULE_4___default.a.init({
            once: true, disable: 'mobile'
        });
        this.router.events.subscribe(function (evt) {
            if (!(evt instanceof _angular_router__WEBPACK_IMPORTED_MODULE_3__["NavigationEnd"])) {
                return;
            }
            window.scrollTo(0, 0);
        });
    };
    AboutUsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-about-us',
            template: __webpack_require__(/*! ./about-us.component.html */ "./src/app/about-us/about-us.component.html"),
            styles: [__webpack_require__(/*! ./about-us.component.scss */ "./src/app/about-us/about-us.component.scss")],
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["trigger"])('fadeInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["state"])('void', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["style"])({
                        opacity: 0
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["transition"])('void <=> *', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["animate"])(1000)),
                ]),
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["trigger"])('scrollAnimationFadeIn', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["state"])('hide', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["style"])({
                        opacity: 0
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["transition"])('hide => show', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["animate"])(1000))
                ]),
            ]
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Title"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]])
    ], AboutUsComponent);
    return AboutUsComponent;
}());



/***/ }),

/***/ "./src/app/api.service.ts":
/*!********************************!*\
  !*** ./src/app/api.service.ts ***!
  \********************************/
/*! exports provided: ApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiService", function() { return ApiService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../environments/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ApiService = /** @class */ (function () {
    function ApiService(http) {
        this.http = http;
    }
    ApiService.prototype.get = function (endpoint, params, background) {
        return this._createPromise('get', endpoint, params, background);
    };
    ApiService.prototype.post = function (endpoint, body, background) {
        return this._createPromise('post', endpoint, body, background);
    };
    ApiService.prototype._createPromise = function (method, endpoint, body, background) {
        var request;
        var url = endpoint.indexOf('http') === -1 ? _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].api_url + endpoint : endpoint;
        var options = {};
        // attach auth token if loggedin
        if (method === 'get') {
            url += this.serialize(body);
            request = this.http.get(url, options);
        }
        else {
            request = this.http.post(url, body, options);
        }
        return request;
    };
    ApiService.prototype.serialize = function (obj) {
        if (obj === undefined) {
            return '';
        }
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
        }
        return '?' + str.join('&');
    };
    // this function is called on browser unload event
    // the best choice would have been navigator.sendBeacon but
    // the reason for using sync ajax instead of navigator.sendBeacon is that sendBeacon does not support
    // custom headers which we require for sending out the auth token
    ApiService.prototype.sendBeacon = function (endpoint, data) {
        var url = endpoint.indexOf('http') === -1 ? _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].api_url + endpoint : endpoint;
        var client = new XMLHttpRequest();
        client.open('POST', url, false); // third parameter indicates sync xhr. :(
        /*if (this.sessionManager.isLoggedin()) {
          client.setRequestHeader('X-AuthToken', this.sessionManager.getToken());
        }*/
        client.setRequestHeader('Content-Type', 'application/json');
        client.send(JSON.stringify(data));
    };
    ApiService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], ApiService);
    return ApiService;
}());



/***/ }),

/***/ "./src/app/api/api.module.ts":
/*!***********************************!*\
  !*** ./src/app/api/api.module.ts ***!
  \***********************************/
/*! exports provided: ApiModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiModule", function() { return ApiModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
/* harmony import */ var _routes_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./routes.service */ "./src/app/api/routes.service.ts");
/* harmony import */ var _meta_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./meta.service */ "./src/app/api/meta.service.ts");
/* harmony import */ var _social_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./social.service */ "./src/app/api/social.service.ts");
/* harmony import */ var _site_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./site.service */ "./src/app/api/site.service.ts");
/* harmony import */ var _page_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./page.service */ "./src/app/api/page.service.ts");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./auth.service */ "./src/app/api/auth.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









var ApiModule = /** @class */ (function () {
    function ApiModule() {
    }
    ApiModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"]],
            declarations: [],
            providers: [
                _api_service__WEBPACK_IMPORTED_MODULE_2__["ApiService"],
                _routes_service__WEBPACK_IMPORTED_MODULE_3__["RoutesService"],
                _meta_service__WEBPACK_IMPORTED_MODULE_4__["MetaService"],
                _social_service__WEBPACK_IMPORTED_MODULE_5__["SocialMediaService"],
                _site_service__WEBPACK_IMPORTED_MODULE_6__["SiteService"],
                _page_service__WEBPACK_IMPORTED_MODULE_7__["PageService"],
                _auth_service__WEBPACK_IMPORTED_MODULE_8__["AuthService"]
            ]
        })
    ], ApiModule);
    return ApiModule;
}());



/***/ }),

/***/ "./src/app/api/auth.service.ts":
/*!*************************************!*\
  !*** ./src/app/api/auth.service.ts ***!
  \*************************************/
/*! exports provided: AuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthService", function() { return AuthService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AuthService = /** @class */ (function () {
    function AuthService(apiService) {
        this.apiService = apiService;
    }
    AuthService.prototype.login = function (params) {
        return this.apiService.post('default/auth-login', params).toPromise();
    };
    AuthService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"]])
    ], AuthService);
    return AuthService;
}());



/***/ }),

/***/ "./src/app/api/meta.service.ts":
/*!*************************************!*\
  !*** ./src/app/api/meta.service.ts ***!
  \*************************************/
/*! exports provided: MetaService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MetaService", function() { return MetaService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MetaService = /** @class */ (function () {
    function MetaService(apiService) {
        this.apiService = apiService;
    }
    MetaService.prototype.createMeta = function (url) {
        if (url === void 0) { url = ''; }
        return this.apiService.get('default/get-seo-url', { url: url }).toPromise();
    };
    MetaService.prototype.searchHotel = function (param) {
        return this.apiService.post('carsolize/search', param).toPromise();
    };
    MetaService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"]])
    ], MetaService);
    return MetaService;
}());



/***/ }),

/***/ "./src/app/api/page.service.ts":
/*!*************************************!*\
  !*** ./src/app/api/page.service.ts ***!
  \*************************************/
/*! exports provided: PageService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageService", function() { return PageService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var PageService = /** @class */ (function () {
    function PageService(apiService) {
        this.apiService = apiService;
    }
    PageService.prototype.getHomePage = function () {
        return this.apiService.get("default/get-home-page-content").toPromise();
    };
    PageService.prototype.getAllDestination = function (limit, show_on_home, page, search_string) {
        if (limit === void 0) { limit = -1; }
        if (show_on_home === void 0) { show_on_home = 0; }
        if (page === void 0) { page = 0; }
        if (search_string === void 0) { search_string = ""; }
        return this.apiService
            .get("default/get-all-destination", {
            limit: limit,
            show_on_home: show_on_home,
            page: page,
            search_string: search_string
        })
            .toPromise();
    };
    PageService.prototype.getTopResorts = function (limit) {
        if (limit === void 0) { limit = -1; }
        return this.apiService
            .get("default/get-top-resorts", { limit: limit })
            .toPromise();
    };
    PageService.prototype.getTestimonials = function (limit) {
        if (limit === void 0) { limit = 5; }
        return this.apiService
            .get("default/get-testimonials", { limit: limit })
            .toPromise();
    };
    PageService.prototype.getPageContent = function (slug) {
        return this.apiService
            .get("default/get-page-content", { slug: slug })
            .toPromise();
    };
    PageService.prototype.getAllHotels = function (slug, limit, page, search_string, filter_type, filter_value) {
        if (limit === void 0) { limit = -1; }
        if (page === void 0) { page = 0; }
        if (search_string === void 0) { search_string = ""; }
        if (filter_type === void 0) { filter_type = ""; }
        if (filter_value === void 0) { filter_value = ""; }
        return this.apiService
            .get("default/get-all-hotels", {
            slug: slug,
            limit: limit,
            search: search_string,
            filter_type: filter_type,
            filter_value: filter_value,
            page: page
        })
            .toPromise();
    };
    PageService.prototype.getHotel = function (slug) {
        return this.apiService.get("default/get-hotel", { slug: slug }).toPromise();
    };
    PageService.prototype.sendQuote = function (param) {
        return this.apiService.post("default/send-quote", param).toPromise();
    };
    PageService.prototype.sendEnquiry = function (param) {
        return this.apiService.post("default/send-enquiry", param).toPromise();
    };
    PageService.prototype.sendContact = function (param) {
        return this.apiService.post("default/send-contact", param).toPromise();
    };
    PageService.prototype.sendmailList = function (param) {
        return this.apiService.post("default/send-mailList", param).toPromise();
    };
    PageService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"]])
    ], PageService);
    return PageService;
}());



/***/ }),

/***/ "./src/app/api/routes.service.ts":
/*!***************************************!*\
  !*** ./src/app/api/routes.service.ts ***!
  \***************************************/
/*! exports provided: RoutesService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RoutesService", function() { return RoutesService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _home_home_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../home/home.component */ "./src/app/home/home.component.ts");
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../login/login.component */ "./src/app/login/login.component.ts");
/* harmony import */ var _page_page_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../page/page.component */ "./src/app/page/page.component.ts");
/* harmony import */ var _destinations_destinations_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../destinations/destinations.component */ "./src/app/destinations/destinations.component.ts");
/* harmony import */ var _explore_explore_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../explore/explore.component */ "./src/app/explore/explore.component.ts");
/* harmony import */ var _hotel_hotel_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../hotel/hotel.component */ "./src/app/hotel/hotel.component.ts");
/* harmony import */ var _contact_form_contact_form_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../contact-form/contact-form.component */ "./src/app/contact-form/contact-form.component.ts");
/* harmony import */ var _how_we_work_how_we_work_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../how-we-work/how-we-work.component */ "./src/app/how-we-work/how-we-work.component.ts");
/* harmony import */ var _about_us_about_us_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../about-us/about-us.component */ "./src/app/about-us/about-us.component.ts");
/* harmony import */ var _bank_details_bank_details_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../bank-details/bank-details.component */ "./src/app/bank-details/bank-details.component.ts");
/* harmony import */ var _online_booking_online_booking_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../online-booking/online-booking.component */ "./src/app/online-booking/online-booking.component.ts");
/* harmony import */ var _search_search_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../search/search.component */ "./src/app/search/search.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};















var RoutesService = /** @class */ (function () {
    function RoutesService(injector, apiService) {
        this.injector = injector;
        this.apiService = apiService;
    }
    RoutesService.prototype.getNavigation = function () {
        return this.apiService.get("default/get-all-navigation").toPromise();
    };
    RoutesService.prototype.createNavigation = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                var router = _this.injector.get(_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]);
                //console.log(router);
                _this.apiService.get("default/get-all-navigation").subscribe(function (response) {
                    router.config.push({
                        path: "",
                        component: _home_home_component__WEBPACK_IMPORTED_MODULE_3__["HomeComponent"],
                        pathMatch: "full",
                        data: { title: "Rawnaq" }
                    });
                    router.config.push({
                        path: "login",
                        component: _login_login_component__WEBPACK_IMPORTED_MODULE_4__["LoginComponent"],
                        data: {
                            path: "login",
                            title: "Rawnaq - Login",
                            label: "Rawnaq - Login",
                            visible: "0"
                        }
                    });
                    _this.currentSettings = response;
                    if (_this.currentSettings && _this.currentSettings.response) {
                        _this.currentSettings.response.push({
                            label: "Search",
                            url: "search",
                            visible: 0
                        });
                    }
                    _this.currentSettings.response.forEach(function (element) {
                        //if(element.visible && element.visible === 1)
                        var comp;
                        if (element.url === "login") {
                            comp = _login_login_component__WEBPACK_IMPORTED_MODULE_4__["LoginComponent"];
                        }
                        else if (typeof element.view != "undefined" &&
                            element.view === "destinations") {
                            comp = _destinations_destinations_component__WEBPACK_IMPORTED_MODULE_6__["DestinationsComponent"];
                        }
                        else if (typeof element.view != "undefined" &&
                            element.view === "page") {
                            comp = _page_page_component__WEBPACK_IMPORTED_MODULE_5__["PageComponent"];
                        }
                        else if (element.url.indexOf("explore/") > -1) {
                            comp = _explore_explore_component__WEBPACK_IMPORTED_MODULE_7__["ExploreComponent"];
                        }
                        else if (element.url.indexOf("hotel/") > -1) {
                            comp = _hotel_hotel_component__WEBPACK_IMPORTED_MODULE_8__["HotelComponent"];
                        }
                        else if (element.url.indexOf("how-we-work") > -1) {
                            comp = _how_we_work_how_we_work_component__WEBPACK_IMPORTED_MODULE_10__["HowWeWorkComponent"];
                        }
                        else if (element.url.indexOf("about-us") > -1) {
                            comp = _about_us_about_us_component__WEBPACK_IMPORTED_MODULE_11__["AboutUsComponent"];
                        }
                        else if (element.url.indexOf("online-booking") > -1) {
                            comp = _online_booking_online_booking_component__WEBPACK_IMPORTED_MODULE_13__["OnlineBookingComponent"];
                        }
                        else if (element.url.indexOf("bank-details") > -1) {
                            comp = _bank_details_bank_details_component__WEBPACK_IMPORTED_MODULE_12__["BankDetailsComponent"];
                        }
                        else if (element.url.indexOf("contact") > -1) {
                            comp = _contact_form_contact_form_component__WEBPACK_IMPORTED_MODULE_9__["ContactFormComponent"];
                        }
                        else if (element.url.indexOf("search") > -1) {
                            comp = _search_search_component__WEBPACK_IMPORTED_MODULE_14__["SearchComponent"];
                        }
                        else if ((element.url.indexOf("/") > -1 && element.url.length == 1) ||
                            element.url.indexOf("index/") > -1 ||
                            element.url.indexOf("home") > -1) {
                            comp = _home_home_component__WEBPACK_IMPORTED_MODULE_3__["HomeComponent"];
                        }
                        else {
                            comp = _page_page_component__WEBPACK_IMPORTED_MODULE_5__["PageComponent"];
                        }
                        router.config.push({
                            path: "" + element.url,
                            component: comp,
                            data: {
                                path: element.url,
                                lable: element.label,
                                visible: element.visible,
                                view: element.view
                            }
                        });
                        //router.config.push({ path: '/index', component: HomeComponent, pathMatch: 'full', data : {title: 'Rawnaq'} });
                    });
                    resolve(true);
                }, function (err) {
                    console.log(err);
                    reject(false);
                });
            });
        });
    };
    RoutesService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"], _api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"]])
    ], RoutesService);
    return RoutesService;
}());



/***/ }),

/***/ "./src/app/api/site.service.ts":
/*!*************************************!*\
  !*** ./src/app/api/site.service.ts ***!
  \*************************************/
/*! exports provided: SiteService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SiteService", function() { return SiteService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SiteService = /** @class */ (function () {
    function SiteService(apiService) {
        this.apiService = apiService;
    }
    SiteService.prototype.getSiteSetting = function () {
        return this.apiService.get('default/get-site-settings').toPromise();
    };
    SiteService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"]])
    ], SiteService);
    return SiteService;
}());



/***/ }),

/***/ "./src/app/api/social.service.ts":
/*!***************************************!*\
  !*** ./src/app/api/social.service.ts ***!
  \***************************************/
/*! exports provided: SocialMediaService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SocialMediaService", function() { return SocialMediaService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SocialMediaService = /** @class */ (function () {
    function SocialMediaService(apiService) {
        this.apiService = apiService;
    }
    SocialMediaService.prototype.getSocialMedia = function () {
        return this.apiService.get('default/get-social-media').toPromise();
    };
    SocialMediaService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"]])
    ], SocialMediaService);
    return SocialMediaService;
}());



/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<block-ui>\r\n    <nav id=\"navbarMain\" class=\"navbar navbar-expand-lg fixed-top navbar-transparent\">\r\n        <div class=\"container\">\r\n            <div class=\"navbar-translate\">\r\n                <a class=\"navbar-brand\" [routerLink]=\"['/']\">\r\n                    <img [src]=\"imgURL\" width=\"auto\" height=\"120\" alt=\"\">\r\n                </a>\r\n                <button class=\"d-lg-none navbar-toggle navbar-toggler navbar-burger\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarToggler\" aria-controls=\"navbarTogglerDemo02\" aria-expanded=\"false\" aria-label=\"Toggle navigation\"  (click)=\"sidebarToggle()\" >\r\n                    <span class=\"navbar-toggler-bar\"></span>\r\n                    <span class=\"navbar-toggler-bar\"></span>\r\n                    <span class=\"navbar-toggler-bar\"></span>\r\n                </button>\r\n                \r\n            </div>\r\n            <div class=\"collapse navbar-collapse\" id=\"navbarToggler\">\r\n                \r\n\r\n                <ul class=\"navbar-nav ml-auto\">\r\n                    <li class=\"pr-5 text-left nav-item d-lg-none\">\r\n                        <button  type=\"button\" class=\"d-lg-none close\" data-toggle=\"collapse\" data-target=\"#navbarToggler\" aria-controls=\"navbarTogglerDemo02\" aria-expanded=\"false\" aria-label=\"Toggle navigation\"  (click)=\"sidebarToggle()\">\r\n                            <span>&times;</span><span class=\"sr-only\">Close</span>\r\n                        </button>\r\n                    </li>\r\n                    <ng-container *ngFor=\"let r of router.config\">\r\n                        <li id=\"link\" class=\"nav-item\" *ngIf=\"r.data.visible===1\"><a (click)=\"linkClicked()\" class=\"nav-link\" [routerLink]=\"r.path\">{{r.data.lable}}</a></li>\r\n                    </ng-container>\r\n                \r\n                      <li class=\"nav-item\">\r\n                          <a class=\"nav-link\" rel=\"tooltip\" title=\"Follow us on Twitter\" data-placement=\"bottom\" href=\"https://www.twitter.com/rawnaq_tour/\" target=\"_blank\">\r\n                              <i class=\"fa fa-twitter\"></i>\r\n                              <p class=\"d-lg-none\">Twitter</p>\r\n                          </a>\r\n                      </li>\r\n                      <li class=\"nav-item\">\r\n                          <a class=\"nav-link\" rel=\"tooltip\" title=\"Follow us on Instagram\" data-placement=\"bottom\" href=\"https://www.instagram.com/rawnaq_tourism/\" target=\"_blank\">\r\n                              <i class=\"fa fa-instagram\"></i>\r\n                              <p class=\"d-lg-none\">Instagram</p>\r\n                          </a>\r\n                      </li>\r\n                      <li class=\"nav-item\">\r\n                          <a class=\"px-2 nav-search nav-link\" rel=\"tooltip\" title=\"Search\" data-placement=\"bottom\" (click)=\"openBackDropCustomClass(content)\">\r\n                              <i class=\"fa fa-search\"></i>\r\n                          </a>\r\n                      </li>\r\n                </ul>\r\n            </div>\r\n                \r\n        </div>\r\n    </nav>\r\n    <!--search-->\r\n    <ng-template #content let-modal>\r\n        <div class=\"modal-body\" style=\" background-color: rgba(0,0,0,.0001) !important;\">\r\n            <input class=\"search\" #searchBox type=\"text\" placeholder=\"Start Typing...\" (keyup.enter)=\"onSearcEnter(searchBox.value)\" class=\"ui-autocomplete-input\" autocomplete=\"\">\r\n        </div>           \r\n    </ng-template>    \r\n    <!--/search-->\r\n    \r\n\r\n   \r\n\r\n    <router-outlet></router-outlet>\r\n  \r\n \r\n\r\n    \r\n\r\n    <footer class=\"footer footer-gray\">\r\n     \r\n        <div class=\"container-fluid\">\r\n\r\n            \r\n       \r\n                <div class=\"row\" id=\"instafeed\">\r\n                </div>\r\n\r\n            <!-- Backup shown if the intagram did not send response -->\r\n            <div class=\"row\" id=\"instafeed_\">\r\n                <a class=\"m-0 p-0 col-md-1 col-sm-1 col-xs-1 img-inasta\" target=\"_blank\" href=\"https://www.instagram.com/p/BrFcfJygm6w/\"><img class=\"imge-mobile img-responsive\" src=\"./assets/insta-gal/insta(1).png\" /></a>\r\n                <a class=\"m-0 p-0 col-md-1 col-sm-1 col-xs-1 img-inasta\" target=\"_blank\" href=\"https://www.instagram.com/p/Bq4Zxdjh-92/\"><img class=\"imge-mobile img-responsive\" src=\"./assets/insta-gal/insta(2).png\" /></a>\r\n                <a class=\"m-0 p-0 col-md-1 col-sm-1 col-xs-1 img-inasta\" target=\"_blank\" href=\"https://www.instagram.com/p/Bqrg77dBb95/\"><img class=\"imge-mobile img-responsive\" src=\"./assets/insta-gal/insta(3).png\" /></a>\r\n                <a class=\"m-0 p-0 col-md-1 col-sm-1 col-xs-1 img-inasta\" target=\"_blank\" href=\"https://www.instagram.com/p/Bqk0cPOh3Iq/\"><img class=\"imge-mobile img-responsive\" src=\"./assets/insta-gal/insta(4).png\" /></a>\r\n                <a class=\"m-0 p-0 col-md-1 col-sm-1 col-xs-1 img-inasta\" target=\"_blank\" href=\"https://www.instagram.com/p/BqWg2h4BWdc/\"><img class=\"imge-mobile img-responsive\" src=\"./assets/insta-gal/insta(5).png\" /></a>\r\n                <a class=\"m-0 p-0 col-md-1 col-sm-1 col-xs-1 img-inasta\" target=\"_blank\" href=\"https://www.instagram.com/p/BqR7f_2BbMQ/\"><img class=\"imge-mobile img-responsive\" src=\"./assets/insta-gal/insta(6).png\" /></a>\r\n                <a class=\"m-0 p-0 col-md-1 col-sm-1 col-xs-1 img-inasta\" target=\"_blank\" href=\"https://www.instagram.com/p/BqFheiZh7EE/\"><img class=\"imge-mobile img-responsive\" src=\"./assets/insta-gal/insta(7).png\" /></a>\r\n                <a class=\"m-0 p-0 col-md-1 col-sm-1 col-xs-1 img-inasta\" target=\"_blank\" href=\"https://www.instagram.com/p/Bp3cfJ2h-b7/\"><img class=\"imge-mobile img-responsive\" src=\"./assets/insta-gal/insta(8).png\" /></a>\r\n                <a class=\"m-0 p-0 col-md-1 col-sm-1 col-xs-1 img-inasta\" target=\"_blank\" href=\"https://www.instagram.com/p/BprU1R-gqF-/\"><img class=\"imge-mobile img-responsive\" src=\"./assets/insta-gal/insta(9).png\" /></a>\r\n                <a class=\"m-0 p-0 col-md-1 col-sm-1 col-xs-1 img-inasta\" target=\"_blank\" href=\"https://www.instagram.com/p/BpdtWq6B9Zr/\"><img class=\"imge-mobile img-responsive\" src=\"./assets/insta-gal/insta(10).png\" /></a>\r\n                <a class=\"m-0 p-0 col-md-1 col-sm-1 col-xs-1 img-inasta\" target=\"_blank\" href=\"https://www.instagram.com/p/BpW0SqVhMao/\"><img class=\"imge-mobile img-responsive\" src=\"./assets/insta-gal/insta(11).png\" /></a>\r\n                <a class=\"m-0 p-0 col-md-1 col-sm-1 col-xs-1 img-inasta\" target=\"_blank\" href=\"https://www.instagram.com/p/Bo6qVl_B9dz/\"><img class=\"imge-mobile img-responsive\" src=\"./assets/insta-gal/insta(12).png\" /></a>\r\n            </div>\r\n    </div>\r\n        <div class=\"container\">\r\n            <div class=\"row mt-3 text-center\">\r\n                <div class=\"col-md-12 col-sm-6 mr-auto ml-auto\">\r\n                    <a _ngcontent-c5=\"\" target=\"_blank\" href=\"https://www.instagram.com/rawnaq_tourism/\" class=\"btn btn-primary btn-round\"> <i class=\"fa fa-instagram\"></i> Follow @Rawnaq_Tourism</a>\r\n                </div>\r\n            </div>\r\n            <div class=\"row mb-4 pb-4 text-center\">\r\n                <div class=\"col-md-6 mr-auto ml-auto \">\r\n                        <a _ngcontent-c5=\"\" target=\"_blank\" href=\"https://www.twitter.com/rawnaq_tour/\" class=\"btn btn-primary btn-round mt-4\"> <i class=\"fa fa-twitter\"></i> @Rawnaq_Tour</a>\r\n                        <a _ngcontent-c5=\"\" target=\"_blank\" href=\"https://www.twitter.com/Rawnaq_Maldives/\" class=\"btn btn-primary btn-round mt-4\"> <i class=\"fa fa-twitter\"></i> @Rawnaq_Maldives</a>\r\n\r\n\r\n                </div>\r\n                \r\n            </div> \r\n\r\n            <div class=\"row  py-4 my-4\">\r\n                <div class=\"col-md-4 text-justified text-xs-center py-4\">\r\n                    <h6 class=\"title-uppercase\">USEFUL LINKS</h6> \r\n                    <div class=\"links\">\r\n                        <ul class=\"stacked-links\">\r\n                            <li><a href=\"https://www.mofa.gov.sa/sites/mofaen/pages/default.aspx\" target=\"_blank\">Ministry Of Foreign Affairs</a></li>\r\n                            <li><a href=\"https://scth.gov.sa/en/Pages/default.aspx\" target=\"_blank\">Saudi Commission for Tourism</a></li>\r\n                            <li><a href=\"https://stta.org.sa/\" target=\"_blank\">Saudi Travel and Tourism Association</a></li>\r\n                            <li><a href=\"https://www.saudia.com/\" target=\"_blank\">SAUDIA Airlines</a></li>       \r\n                        </ul>\r\n                    </div>\r\n                </div>\r\n                <div class=\"col-md-4 text-left text-xs-center py-4\">\r\n                    <h6 class=\"title-uppercase\">ADDRESS</h6> \r\n                    <p class=\"description\">\r\n                            3072 Al Samer, As Samir District\r\n                            <br /> Jeddah 23462 6083\r\n                            <br /> Tel :\r\n                            <a class=\"text-primary\" href=\"tel:+966126285888\">+966 12 6285888</a>\r\n                            <br /> Mobile :\r\n                            <a class=\"text-primary\" href=\"tel:+966544038879\">+966 544038879</a>\r\n                            <br /> Email :​\r\n                            <a class=\"text-primary\" href=\"mailto:info@rawnaqtourism.com\">info@rawnaqtourism.com</a>\r\n                    </p>\r\n                </div>\r\n                <div class=\"col-md-4 py-sm-3 text-xm-center py-4\">\r\n                    <h6 class=\"title-uppercase\">STAY CONNECTED</h6> \r\n                    <p class=\"description\">Sign up for our mailing list to get latest updates and offers!</p>\r\n                    <div class=\"subscribe-line\">\r\n                        <form (ngSubmit)=\"onSend()\">\r\n\r\n                            <div _ngcontent-c5=\"\" class=\"form-group\" (ngSubmit)=\"onSend()\">\r\n                                <input _ngcontent-c5=\"\" maxlength=\"50\" [(ngModel)]=\"f.email\" class=\"form-control\" required  placeholder=\"Your email\" type=\"text\">\r\n                                <button _ngcontent-c5=\"\" class=\"btn btn-primary btn-round\" type=\"button\">Submit</button>\r\n                            </div>\r\n\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <hr>\r\n            <div class=\"row\">\r\n                <div class=\"credits mr-auto\">\r\n                    <span class=\"copyright\">\r\n                        © {{test | date: 'yyyy'}}, Rawnaq Tourism. All Rights Reserved.\r\n                    </span>\r\n                </div>\r\n                <nav class=\"footer-nav\">\r\n                    <ul>\r\n                        <li>\r\n                            <a title=\"Follow us on Instagram\" data-placement=\"bottom\" href=\"https://www.instagram.com/rawnaq_tourism/\" target=\"_blank\">\r\n                                <img src=\"assets/img/instagram-icon.png\"/>\r\n                                <p class=\"d-lg-none\">Instagram</p>\r\n                            </a>\r\n                        </li>\r\n                        <li>\r\n                            <a title=\"Follow us on Twitter\" data-placement=\"bottom\" href=\"https://www.twitter.com/rawnaq_tour/\" target=\"_blank\">\r\n                                <img src=\"assets/img/twitter-icon.png\"/>\r\n                                <p class=\"d-lg-none\">Twitter</p>\r\n                            </a>\r\n                        </li>\r\n                        \r\n                        <!-- <li>\r\n                            <a title=\"Contact us on Whatsapp\" data-placement=\"bottom\" href=\"https://api.whatsapp.com/send?phone=00966544038879\" target=\"_blank\">\r\n                                <img src=\"assets/img/whatsapp-icon.png\"/>\r\n                                <p class=\"d-lg-none\">Whatsapp</p>\r\n                            </a>\r\n                        </li> -->\r\n\r\n                        <!-- <li>\r\n                            <a title=\"See our certificate on Ma3roof\" data-placement=\"bottom\" href=\"https://maroof.sa/29935\" target=\"_blank\">\r\n                                <img src=\"assets/img/ma3roof-icon.png\"/>\r\n                                <p class=\"d-lg-none\">Ma3roof</p>\r\n                            </a>\r\n                        </li>\r\n                         -->\r\n                    </ul>\r\n                </nav>\r\n            </div>\r\n        </div>\r\n    </footer>\r\n  \r\n  </block-ui>\r\n  "

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ng-block-ui */ "./node_modules/ng-block-ui/index.js");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ng_block_ui__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _injector_url_injector__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./injector/url.injector */ "./src/app/injector/url.injector.ts");
/* harmony import */ var _api_routes_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./api/routes.service */ "./src/app/api/routes.service.ts");
/* harmony import */ var _api_meta_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./api/meta.service */ "./src/app/api/meta.service.ts");
/* harmony import */ var _api_social_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./api/social.service */ "./src/app/api/social.service.ts");
/* harmony import */ var _api_site_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./api/site.service */ "./src/app/api/site.service.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var _api_page_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./api/page.service */ "./src/app/api/page.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};















var AppComponent = /** @class */ (function () {
    function AppComponent(page, routesService, router, activatedRoute, titleService, meta, urlInjector, metaService, renderer, socialMedia, site, location, element, modalService) {
        this.page = page;
        this.routesService = routesService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.titleService = titleService;
        this.meta = meta;
        this.urlInjector = urlInjector;
        this.metaService = metaService;
        this.renderer = renderer;
        this.socialMedia = socialMedia;
        this.site = site;
        this.location = location;
        this.element = element;
        this.modalService = modalService;
        this.test = new Date();
        this.imgURL = 'assets/img/logo-colored.png';
        this.isVisible = true;
        this.modelAlertContent = "";
        this.f = {
            email: ""
        };
        this.currentPage = "";
        this.logos = { headerLogo: "", footerLogo: "" };
        this.siteSetting = {
            title: "",
            description: "",
            email: "",
            timezone: "",
            dateformat: "",
            timeformat: "",
            footerdesc: ""
        };
        this.socialLinks = { fb: "", tw: "", yt: "", ld: "", in: "" };
        this.href = "";
        this.sidebarVisible = false;
        console.log(router);
    }
    AppComponent.prototype.openBackDropCustomClass = function (content) {
        this.sidebarClose();
        this.modalRef = this.modalService.open(content, {
            windowClass: 'search-modal three',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
    };
    AppComponent.prototype.close = function (event) {
        event.stopPropagation();
        this.modalRef.close();
    };
    AppComponent.prototype.ngOnInit = function () {
        var navbar = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        //this.toggleLink = navbar.getElementsByClassName('nav-link')[0];
        // this.pageSetting();
        // this.href = this.router.url;
        //   console.log(this.router.url);
    };
    AppComponent.prototype.sidebarOpen = function () {
        var toggleButton = this.toggleButton;
        var html = document.getElementsByTagName('html')[0];
        // console.log(html);
        // console.log(toggleButton, 'toggle');
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);
        html.classList.add('nav-open');
        this.sidebarVisible = true;
    };
    ;
    AppComponent.prototype.sidebarClose = function () {
        var html = document.getElementsByTagName('html')[0];
        // console.log(html);
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    ;
    AppComponent.prototype.sidebarToggle = function () {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        }
        else {
            this.sidebarClose();
        }
    };
    ;
    AppComponent.prototype.linkClicked = function () {
        //const toggleLink = this.toggleLink;
        this.sidebarClose();
        //   setTimeout(function(){
        //     toggleLink.classList.remove('toggled');
        // }, 500);
    };
    ;
    // jQuery(window).scroll(function() {
    //   var nav = jQuery('#navbarMain');
    //   var top = 200;
    //   if (jQuery(window).scrollTop() >= top) {
    //       nav.removeClass('navbar-transparent');
    //       jQuery('.navbar-translate .navbar-brand img').attr('src', 'assets/img/logo-white.png');
    //   } else {
    //       nav.addClass('navbar-transparent');
    //       jQuery('.navbar-translate .navbar-brand img ').attr('src', 'assets/img/logo-colored.png');
    //   }
    // });
    AppComponent.prototype.onWindowScroll = function () {
        //const navbar: HTMLElement = this.element.nativeElement;
        var navbar_ = document.getElementsByTagName('nav')[0];
        var number = window.scrollY;
        if (number >= 150 || window.pageYOffset >= 150) {
            this.imgURL = 'assets/img/logo-white.png';
            navbar_.classList.remove('navbar-transparent');
        }
        else {
            this.imgURL = 'assets/img/logo-colored.png';
            navbar_.classList.add('navbar-transparent');
        }
    };
    AppComponent.prototype.pageSetting = function () {
        var _this = this;
        this.router.events
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["filter"])(function (event) { return event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_1__["NavigationEnd"]; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function () { return _this.activatedRoute; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (route) {
            while (route.firstChild)
                route = route.firstChild;
            return route;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["filter"])(function (route) { return route.outlet === "primary"; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])(function (route) { return route.data; }))
            .subscribe(function (event) {
            //const params = this.urlInjector.getCurrentPage((event as NavigationEnd).url);
            _this.currentPage = event.path;
            var currentUrl = _this.router.url;
            if (typeof _this.currentPage !== "undefined" &&
                _this.currentPage.substring(_this.currentPage.lastIndexOf("/") + 1, _this.currentPage.length) === ":slug") {
                _this.activatedRoute.params.subscribe(function (params) {
                    _this.slug = params["slug"];
                    if (typeof _this.slug == "undefined") {
                        _this.currentPage =
                            currentUrl.substring(currentUrl.lastIndexOf("/") + 1, 0) +
                                currentUrl.substring(currentUrl.lastIndexOf("/") + 1, currentUrl.length);
                    }
                });
            }
            console.log("Event: ");
            console.log(event);
            if (_this.currentPage == "how-we-work") {
                // Scroll to How We Work Section
                var howWeWorkSection = document.getElementById("how-we-work");
                if (howWeWorkSection !== null) {
                    howWeWorkSection.scrollIntoView();
                }
            }
            else {
                // Scroll Page to Top
                window.scroll(0, 0);
            }
            _this.titleService.setTitle(event.lable);
            _this.blockUI.start(""); // Start blocking
            _this.site.getSiteSetting().then(function (res) {
                console.log("Site Setting: ", res);
                if (res["success"]) {
                    var site = res["response"];
                    _this.logos = {
                        headerLogo: _environments_environment__WEBPACK_IMPORTED_MODULE_11__["environment"].site_url + site["headerlogo"],
                        footerLogo: _environments_environment__WEBPACK_IMPORTED_MODULE_11__["environment"].site_url + site["footerlogo"]
                    };
                    _this.siteSetting.title = site["title"];
                    _this.siteSetting.description = site["description"];
                    _this.siteSetting.email = site["email"];
                    _this.siteSetting.timezone = site["timezone"];
                    _this.siteSetting.dateformat = site["dateformat"];
                    _this.siteSetting.timeformat = site["timeformat"];
                    _this.siteSetting.footerdesc = site["footerdesc"];
                }
                _this.metaService.createMeta(_this.currentPage).then(function (res) {
                    console.log("Meta: ", res);
                    if (res["success"]) {
                        var pageMeta = res["response"];
                        if (pageMeta.description)
                            _this.meta.addTag({
                                name: "description",
                                content: pageMeta.description
                            });
                        if (pageMeta.author)
                            _this.meta.addTag({
                                name: "author",
                                content: pageMeta.author
                            });
                        if (pageMeta.keywords)
                            _this.meta.addTag({
                                name: "keywords",
                                content: pageMeta.keywords
                            });
                        _this.meta.addTag({
                            name: "robots",
                            content: pageMeta.index + ", " + pageMeta.follow
                        });
                        if (pageMeta.title)
                            _this.titleService.setTitle(pageMeta.title);
                    }
                    _this.socialMedia.getSocialMedia().then(function (res) {
                        console.log("Social Media: ", res);
                        if (res["success"]) {
                            var socialMedia = res["response"];
                            _this.socialLinks = {
                                fb: socialMedia["fb_link"],
                                tw: socialMedia["tw_link"],
                                yt: socialMedia["yt_link"],
                                ld: socialMedia["ld_link"],
                                in: socialMedia["in_link"]
                            };
                        }
                        _this.blockUI.stop();
                    }, function (reject) {
                        console.log("error: ", reject);
                        _this.blockUI.stop();
                    });
                }, function (reject) {
                    console.log("error: ", reject);
                });
            }, function (reject) {
                console.log("error: ", reject);
            });
            //for Home
            if (typeof _this.currentPage === "undefined" ||
                _this.currentPage === "" ||
                _this.currentPage === "index" ||
                _this.currentPage === "home") {
                _this.currentPage = "home";
                _this.renderer.addClass(document.body, "homepg");
            }
            else if (_this.currentPage === "login") {
                _this.renderer.addClass(document.body, "loginpg");
            }
            else if (event.view === "page") {
                _this.renderer.addClass(document.body, "aboutpg");
            }
            else if (event.view === "destinations" ||
                _this.currentPage.indexOf("hotel/") > -1) {
                _this.renderer.addClass(document.body, "destinationpg");
            }
            else {
                _this.renderer.addClass(document.body, "aboutpg");
            }
        });
    };
    AppComponent.prototype.removeFooterAndHeader = function () {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        titlee = titlee.slice(1);
        if (titlee === 'login') {
            return false;
        }
        else {
            return true;
        }
    };
    AppComponent.prototype.onSend = function () {
        var _this = this;
        if (this.f.email === "") {
            //this.alerts.setMessage('All the fields are required','error');
            this.modelAlertContent = "All the fields are required";
            return false;
        }
        this.blockUI.start("");
        this.page.sendContact(this.f).then(function (res) {
            if (res["success"]) {
                _this.blockUI.stop();
                _this.modelAlertContent =
                    "<span class='fc-primary'>Contact form has sent successfully.</span>";
                _this.resetForm();
            }
        }, function (reject) {
            console.log("error: ", reject);
            _this.blockUI.stop();
        });
    };
    AppComponent.prototype.resetForm = function () {
        this.f = {
            email: ""
        };
    };
    AppComponent.prototype.onSearcEnter = function (value) {
        this.router.navigateByUrl("/search?keyword=" + value);
        this.modalRef.close();
    };
    __decorate([
        Object(ng_block_ui__WEBPACK_IMPORTED_MODULE_4__["BlockUI"])(),
        __metadata("design:type", Object)
    ], AppComponent.prototype, "blockUI", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"])("window:scroll", []),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], AppComponent.prototype, "onWindowScroll", null);
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "app-root",
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        }),
        __metadata("design:paramtypes", [_api_page_service__WEBPACK_IMPORTED_MODULE_13__["PageService"],
            _api_routes_service__WEBPACK_IMPORTED_MODULE_7__["RoutesService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Title"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Meta"],
            _injector_url_injector__WEBPACK_IMPORTED_MODULE_6__["UrlInjector"],
            _api_meta_service__WEBPACK_IMPORTED_MODULE_8__["MetaService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"],
            _api_social_service__WEBPACK_IMPORTED_MODULE_9__["SocialMediaService"],
            _api_site_service__WEBPACK_IMPORTED_MODULE_10__["SiteService"],
            _angular_common__WEBPACK_IMPORTED_MODULE_5__["Location"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"],
            _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_12__["NgbModal"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: initRoutes, AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initRoutes", function() { return initRoutes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ng-block-ui */ "./node_modules/ng-block-ui/index.js");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ng_block_ui__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _ngu_carousel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngu/carousel */ "./node_modules/@ngu/carousel/fesm5/ngu-carousel.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-infinite-scroll */ "./node_modules/ngx-infinite-scroll/modules/ngx-infinite-scroll.es5.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _home_home_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./home/home.component */ "./src/app/home/home.component.ts");
/* harmony import */ var _api_api_module__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./api/api.module */ "./src/app/api/api.module.ts");
/* harmony import */ var _pipe_pipe_module__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./pipe/pipe.module */ "./src/app/pipe/pipe.module.ts");
/* harmony import */ var _injector_injector_module__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./injector/injector.module */ "./src/app/injector/injector.module.ts");
/* harmony import */ var _api_routes_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./api/routes.service */ "./src/app/api/routes.service.ts");
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./login/login.component */ "./src/app/login/login.component.ts");
/* harmony import */ var _destinations_destinations_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./destinations/destinations.component */ "./src/app/destinations/destinations.component.ts");
/* harmony import */ var _page_page_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./page/page.component */ "./src/app/page/page.component.ts");
/* harmony import */ var _explore_explore_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./explore/explore.component */ "./src/app/explore/explore.component.ts");
/* harmony import */ var _hotel_hotel_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./hotel/hotel.component */ "./src/app/hotel/hotel.component.ts");
/* harmony import */ var _room_room_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./room/room.component */ "./src/app/room/room.component.ts");
/* harmony import */ var _quote_form_quote_form_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./quote-form/quote-form.component */ "./src/app/quote-form/quote-form.component.ts");
/* harmony import */ var _contact_form_contact_form_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./contact-form/contact-form.component */ "./src/app/contact-form/contact-form.component.ts");
/* harmony import */ var _how_we_work_how_we_work_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./how-we-work/how-we-work.component */ "./src/app/how-we-work/how-we-work.component.ts");
/* harmony import */ var _enquiry_form_enquiry_form_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./enquiry-form/enquiry-form.component */ "./src/app/enquiry-form/enquiry-form.component.ts");
/* harmony import */ var ngx_gallery__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ngx-gallery */ "./node_modules/ngx-gallery/bundles/ngx-gallery.umd.js");
/* harmony import */ var ngx_gallery__WEBPACK_IMPORTED_MODULE_25___default = /*#__PURE__*/__webpack_require__.n(ngx_gallery__WEBPACK_IMPORTED_MODULE_25__);
/* harmony import */ var _about_us_about_us_component__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./about-us/about-us.component */ "./src/app/about-us/about-us.component.ts");
/* harmony import */ var _bank_details_bank_details_component__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./bank-details/bank-details.component */ "./src/app/bank-details/bank-details.component.ts");
/* harmony import */ var _online_booking_online_booking_component__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./online-booking/online-booking.component */ "./src/app/online-booking/online-booking.component.ts");
/* harmony import */ var ngx_masonry_gallery__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ngx-masonry-gallery */ "./node_modules/ngx-masonry-gallery/fesm5/ngx-masonry-gallery.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _ngx_meta_core__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! @ngx-meta/core */ "./node_modules/@ngx-meta/core/fesm5/ngx-meta-core.js");
/* harmony import */ var _search_search_component__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./search/search.component */ "./src/app/search/search.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

































function initRoutes(routesService) {
    return function () { return routesService.createNavigation(); };
}
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_9__["AppComponent"],
                _home_home_component__WEBPACK_IMPORTED_MODULE_10__["HomeComponent"],
                _login_login_component__WEBPACK_IMPORTED_MODULE_15__["LoginComponent"],
                _destinations_destinations_component__WEBPACK_IMPORTED_MODULE_16__["DestinationsComponent"],
                _page_page_component__WEBPACK_IMPORTED_MODULE_17__["PageComponent"],
                _explore_explore_component__WEBPACK_IMPORTED_MODULE_18__["ExploreComponent"],
                _hotel_hotel_component__WEBPACK_IMPORTED_MODULE_19__["HotelComponent"],
                _room_room_component__WEBPACK_IMPORTED_MODULE_20__["RoomComponent"],
                _quote_form_quote_form_component__WEBPACK_IMPORTED_MODULE_21__["QuoteFormComponent"],
                _contact_form_contact_form_component__WEBPACK_IMPORTED_MODULE_22__["ContactFormComponent"],
                _how_we_work_how_we_work_component__WEBPACK_IMPORTED_MODULE_23__["HowWeWorkComponent"],
                _enquiry_form_enquiry_form_component__WEBPACK_IMPORTED_MODULE_24__["EnquiryFormComponent"],
                _about_us_about_us_component__WEBPACK_IMPORTED_MODULE_26__["AboutUsComponent"],
                _bank_details_bank_details_component__WEBPACK_IMPORTED_MODULE_27__["BankDetailsComponent"],
                _online_booking_online_booking_component__WEBPACK_IMPORTED_MODULE_28__["OnlineBookingComponent"],
                _search_search_component__WEBPACK_IMPORTED_MODULE_32__["SearchComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                //AppRoutingModule,
                _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"],
                ng_block_ui__WEBPACK_IMPORTED_MODULE_4__["BlockUIModule"].forRoot(),
                _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_8__["NgbModule"].forRoot(),
                _ngu_carousel__WEBPACK_IMPORTED_MODULE_5__["NguCarouselModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ReactiveFormsModule"],
                ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_7__["InfiniteScrollModule"],
                //RouterModule,
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forRoot([]),
                _api_api_module__WEBPACK_IMPORTED_MODULE_11__["ApiModule"],
                _injector_injector_module__WEBPACK_IMPORTED_MODULE_13__["InjectorModule"],
                _pipe_pipe_module__WEBPACK_IMPORTED_MODULE_12__["PipeModule"],
                ngx_gallery__WEBPACK_IMPORTED_MODULE_25__["NgxGalleryModule"],
                ngx_masonry_gallery__WEBPACK_IMPORTED_MODULE_29__["MasonryGalleryModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_30__["BrowserAnimationsModule"],
                //RouterModule.forRoot(routes),
                _ngx_meta_core__WEBPACK_IMPORTED_MODULE_31__["MetaModule"].forRoot()
            ],
            entryComponents: [
                _home_home_component__WEBPACK_IMPORTED_MODULE_10__["HomeComponent"],
                _login_login_component__WEBPACK_IMPORTED_MODULE_15__["LoginComponent"],
                _page_page_component__WEBPACK_IMPORTED_MODULE_17__["PageComponent"],
                _destinations_destinations_component__WEBPACK_IMPORTED_MODULE_16__["DestinationsComponent"],
                _explore_explore_component__WEBPACK_IMPORTED_MODULE_18__["ExploreComponent"],
                _hotel_hotel_component__WEBPACK_IMPORTED_MODULE_19__["HotelComponent"],
                _contact_form_contact_form_component__WEBPACK_IMPORTED_MODULE_22__["ContactFormComponent"],
                _how_we_work_how_we_work_component__WEBPACK_IMPORTED_MODULE_23__["HowWeWorkComponent"],
                _about_us_about_us_component__WEBPACK_IMPORTED_MODULE_26__["AboutUsComponent"],
                _bank_details_bank_details_component__WEBPACK_IMPORTED_MODULE_27__["BankDetailsComponent"],
                _online_booking_online_booking_component__WEBPACK_IMPORTED_MODULE_28__["OnlineBookingComponent"],
                _search_search_component__WEBPACK_IMPORTED_MODULE_32__["SearchComponent"]
            ],
            providers: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["Title"],
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["Meta"],
                {
                    provide: _angular_core__WEBPACK_IMPORTED_MODULE_1__["APP_INITIALIZER"],
                    useFactory: initRoutes,
                    deps: [_api_routes_service__WEBPACK_IMPORTED_MODULE_14__["RoutesService"]],
                    multi: true
                }
            ],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_9__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/bank-details/bank-details.component.html":
/*!**********************************************************!*\
  !*** ./src/app/bank-details/bank-details.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"wrapper\">\r\n  <div\r\n    data-aos-duration=\"1200\"\r\n    data-aos=\"fade\" \r\n    class=\"page-header background  page-header-sm\" \r\n    data-parallax=\"true\"\r\n    style=\"background-image: url('./assets/img/Bank_Details.jpg');\"\r\n  >\r\n    <div class=\"filter\"></div>\r\n    <div class=\"container mt-4 pt-4 \">\r\n      <div class=\"mt-4 pt-4 motto text-left\">\r\n        <h3 class=\"title-uppercase py-4 mt-4\">Bank Details</h3>\r\n        <!--\r\n          <p class=\"description text-white\">\r\n          some text\r\n          </p>\r\n        -->\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"section sm profile-content\">\r\n    <div class=\"container\">\r\n      <div class=\"sub-page-content\">\r\n        <div class=\"row \">\r\n          <!-- <div class=\"col-md-12 mr-auto ml-auto\"> -->\r\n\r\n          <br /><br />\r\n          <br /><br />\r\n\r\n          <div class=\"my-2 card card-bank-info\">\r\n            <img\r\n              class=\"card-avatar\"\r\n              src=\"http://rawnaqtourism.com/uploads/2018/10/sambabank.png\"\r\n              alt=\"sambabank.png\"\r\n              width=\"300\"\r\n              height=\"70\"\r\n            />\r\n            <h4 class=\"title\">Samba Bank</h4>\r\n            <div class=\"sub-title\">\r\n              <h6>Account Name: <br /></h6>\r\n              International Rawnaq <br />\r\n              Tourism Agency <br />\r\n              <h6>Swift Code:<br /></h6>\r\n              SAMBSARI<br />\r\n              <h6>Account Number:<br /></h6>\r\n              125015429<br />\r\n              <h6>IBAN Number:<br /></h6>\r\n              SA0740000000000125015429\r\n            </div>\r\n          </div>\r\n          <br /><br />\r\n          <br /><br />\r\n          <div class=\"my-2  card card-bank-info\">\r\n            <img\r\n              class=\"card-avatar\"\r\n              src=\"http://nebula.wsimg.com/5bf0e29612cc04c9e9d5f492d3cbd083?AccessKeyId=0A1BEB9D109D2B8291AC&amp;disposition=0&amp;alloworigin=1\"\r\n              alt=\"*\"\r\n              width=\"300\"\r\n              height=\"70\"\r\n            />\r\n            <h4 class=\"title\">Riyad Bank</h4>\r\n            <div class=\"sub-title\">\r\n              <h6>Account Name: <br /></h6>\r\n              International Rawnaq <br />\r\n              Tourism Agency <br />\r\n              <h6>Swift Code:<br /></h6>\r\n              RIBLSARI<br />\r\n              <h6>Account Number:<br /></h6>\r\n              1170621089940<br />\r\n              <h6>IBAN Number:<br /></h6>\r\n              SA8820000001170621089940\r\n            </div>\r\n          </div>\r\n          <br /><br />\r\n          <br /><br />\r\n          <div class=\"my-2 card card-bank-info\">\r\n            <img\r\n              class=\"card-avatar\"\r\n              src=\"http://rawnaqtourism.com/uploads/2018/10/aljazirabank.png\"\r\n              alt=\"aljazirabank.png\"\r\n              width=\"300\"\r\n              height=\"70\"\r\n            />\r\n            <h4 class=\"title\">Aljazira Bank</h4>\r\n            <div class=\"sub-title\">\r\n              <h6>Account Name: <br /></h6>\r\n              International Rawnaq <br />\r\n              Tourism Agency <br />\r\n              <h6>Swift Code:<br /></h6>\r\n              BJAZSAJE<br />\r\n              <h6>Account Number:<br /></h6>\r\n              002295006736001<br />\r\n              <h6>IBAN Number:<br /></h6>\r\n              SA0960100002295006736001\r\n            </div>\r\n          </div>\r\n          <br /><br />\r\n          <br /><br />\r\n          <div class=\"my-2  card card-bank-info\">\r\n            <img\r\n              class=\"card-avatar\"\r\n              src=\"http://nebula.wsimg.com/cb8fbc3e755275a77a584c56016bf10b?AccessKeyId=0A1BEB9D109D2B8291AC&amp;disposition=0&amp;alloworigin=1\"\r\n              alt=\"*\"\r\n              width=\"300\"\r\n              height=\"70\"\r\n            />\r\n            <h4 class=\"title\">National Commercial Bank</h4>\r\n            <div class=\"sub-title\">\r\n              <h6>Account Name: <br /></h6>\r\n              International Rawnaq EST. <br />\r\n              <h6>Swift Code:<br /></h6>\r\n              NCBKSAJE<br />\r\n              <h6>Account Number:<br /></h6>\r\n              12461838000102<br />\r\n              <h6>IBAN Number:<br /></h6>\r\n              SA1410000012461838000102\r\n            </div>\r\n          </div>\r\n          <br /><br />\r\n          <br /><br />\r\n          <div class=\"my-2  card card-bank-info\">\r\n            <img\r\n              class=\"card-avatar\"\r\n              src=\"http://www.rawnaqtourism.com/uploads/2019/01/1200px-alrajhibanklogosvg.png\"\r\n              alt=\"*\"\r\n              width=\"300\"\r\n              height=\"70\"\r\n            />\r\n            <h4 class=\"title\">Al Rajhi Bank</h4>\r\n            <div class=\"sub-title\">\r\n              <h6>Account Name: <br /></h6>\r\n              Rawnaq International<br />\r\n              Travel and Tourism <br />\r\n              <h6>Swift Code:<br /></h6>\r\n              RJHISARI<br />\r\n              <h6>Account Number:<br /></h6>\r\n              189608010000191<br />\r\n              <h6>IBAN Number:<br /></h6>\r\n              SA4480000189608010000191\r\n            </div>\r\n          </div>\r\n          \r\n        </div>\r\n        <!-- </div> -->\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n<!-- End of section -->\r\n<!-- About us page -->\r\n\r\n<!--\r\n  <div class=\"card\">\r\n          <img class=\"d-inline\" src=\"http://nebula.wsimg.com/5bf0e29612cc04c9e9d5f492d3cbd083?AccessKeyId=0A1BEB9D109D2B8291AC&amp;disposition=0&amp;alloworigin=1\" alt=\"*\" />\r\n          <p>Bank Name: <br /> Account Name: Rawnaq International Travel and Tourism<br /> Swift Code: ‏RIBLSARI<br /> Account Number: 1170621089940<br /> IBAN Number : </p>\r\n          </div>\r\n      </div>\r\n  </div>\r\n  <div class=\"card\">\r\n      <img class=\"d-inline\" src=\"http://rawnaq.grassflorist.com/uploads/2018/10/aljazirabank.png\" alt=\"aljazirabank.png\" width=\"314\" height=\"70\" />\r\n      <p>Bank Name: Aljazira Bank<br /> Account Name: Rawnaq International Travel and Tourism<br /> Swift Code: BJAZSAJE<br /> Account Number: 002295006736001<br /> IBAN Number: SA0960100002295006736001</p>\r\n  </div>\r\n  <div class=\"card\">\r\n      <img class=\"d-inline\" src=\"http://rawnaq.grassflorist.com/uploads/2018/10/sambabank.png\" alt=\"sambabank.png\" width=\"257\" height=\"70\" />\r\n      <p>Bank Name: Samba Bank<br /> Account Name: Rawnaq International Travel and Tourism<br /> Swift Code: SAMBSARI<br /> Account Number: 125015429<br /> IBAN Number : ‏SA740000000000125015429</p>\r\n  </div>\r\n-->\r\n"

/***/ }),

/***/ "./src/app/bank-details/bank-details.component.scss":
/*!**********************************************************!*\
  !*** ./src/app/bank-details/bank-details.component.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/bank-details/bank-details.component.ts":
/*!********************************************************!*\
  !*** ./src/app/bank-details/bank-details.component.ts ***!
  \********************************************************/
/*! exports provided: BankDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BankDetailsComponent", function() { return BankDetailsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/animations */ "./node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! aos */ "./node_modules/aos/dist/aos.js");
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(aos__WEBPACK_IMPORTED_MODULE_4__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var BankDetailsComponent = /** @class */ (function () {
    function BankDetailsComponent(title, router) {
        this.title = title;
        this.router = router;
        this.title.setTitle('RAWNAQ Tourism | Bank Details');
    }
    BankDetailsComponent.prototype.ngOnInit = function () {
        aos__WEBPACK_IMPORTED_MODULE_4___default.a.init({
            once: true, disable: 'mobile'
        });
        // start the page from the top
        this.router.events.subscribe(function (evt) {
            if (!(evt instanceof _angular_router__WEBPACK_IMPORTED_MODULE_3__["NavigationEnd"])) {
                return;
            }
            window.scrollTo(0, 0);
        });
    };
    BankDetailsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-bank-details',
            template: __webpack_require__(/*! ./bank-details.component.html */ "./src/app/bank-details/bank-details.component.html"),
            styles: [__webpack_require__(/*! ./bank-details.component.scss */ "./src/app/bank-details/bank-details.component.scss")],
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["trigger"])('fadeInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["state"])('void', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["style"])({
                        opacity: 0
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["transition"])('void <=> *', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["animate"])(1000)),
                ])
            ]
        }),
        __metadata("design:paramtypes", [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Title"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]])
    ], BankDetailsComponent);
    return BankDetailsComponent;
}());



/***/ }),

/***/ "./src/app/contact-form/contact-form.component.css":
/*!*********************************************************!*\
  !*** ./src/app/contact-form/contact-form.component.css ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/contact-form/contact-form.component.html":
/*!**********************************************************!*\
  !*** ./src/app/contact-form/contact-form.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<block-ui>\r\n  <div class=\"wrapper\">\r\n      <div  data-aos-duration=\"1200\" data-aos=\"fade\" class=\"page-header background  page-header-sm\" data-parallax=\"true\" style=\"background-image: url('./assets/img/contact_us.jpg');\">\r\n          <div class=\"filter\"></div>\r\n          <div class=\"container mt-4 pt-4 \">\r\n        <div class=\"mt-4 pt-4 motto text-left\">\r\n          <h3 class=\"title-uppercase py-4 mt-4\">Say hi !</h3>\r\n          <p class=\"description text-white\">\r\n              We Love to Hear From You. \r\n              </p>\r\n          </div>\r\n      </div>\r\n  </div>\r\n\r\n  <div  data-aos-duration=\"1000\" data-aos=\"fade\" data-aos-delay=\"300\" data-aos-easing=\"ease-out-bounce\"   class=\"section sm profile-content\">\r\n    <div class=\"container\">\r\n      <div class=\"row\">\r\n\r\n        <div class=\"col-md-8\">\r\n\r\n          <div class=\"container\">\r\n            <h4 class=\"description text-primary mb-4\">\r\n               Let us know your request & we’ll call you!\r\n            </h4>\r\n            <form class=\"form-horizontal\" (ngSubmit)=\"onSend()\">\r\n              <div class=\"form-group\">\r\n                <label for=\"clientName\">Name</label>\r\n                <input type=\"text\" [(ngModel)]=\"f.clientName\" name=\"clientName\" required class=\"form-control\" />\r\n              </div>\r\n              <div class=\"form-group\">\r\n                <label for=\"clientEmail\">Contact Number</label>\r\n                <input type=\"text\" [(ngModel)]=\"f.clientContact\" placeholder=\"Kindly use the country code\" name=\"clientContact\" required class=\"form-control\" />\r\n              </div>\r\n              <div class=\"form-group\">\r\n                <label for=\"clientEmail\">Email</label>\r\n                <input type=\"text\" [(ngModel)]=\"f.clientEmail\" name=\"clientEmail\" required class=\"form-control\" />\r\n              </div>\r\n              <div class=\"form-group\">\r\n                <label for=\"clientSubject\">Subject</label>\r\n                <input type=\"text\" [(ngModel)]=\"f.clientSubject\" name=\"clientSubject\" required class=\"form-control\" />\r\n              </div>\r\n              <div class=\"form-group\">\r\n                <label for=\"clientContent\">Message</label>\r\n                <textarea [(ngModel)]=\"f.clientContent\" name=\"clientContent\" required class=\"form-control\" maxlength=\"300\"></textarea>\r\n              </div>\r\n              <br />\r\n\r\n              <div class=\"row\">\r\n                <div class=\"col-md-12\">\r\n                  <div class=\"form-group\">\r\n                    <button type=\"submit\" class=\"btn --btn-primary\">Submit</button>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n              <div class=\"row\">\r\n                <div class=\"col-md-12\"><strong [innerHTML]=\"modelAlertContent\"></strong></div>\r\n              </div>\r\n            </form>\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"col-md-4\">\r\n            <div class=\"container\">\r\n              <div class=\"contact-address\">\r\n                <h4 class=\"description mb-4\">\r\n                  You can Reach Us\r\n                </h4>\r\n                <p class=\"description\">\r\n                  3072 Al Samer, As Samir District\r\n                  <br /> Jeddah 23462 6083\r\n                  <br /> Tel :\r\n                  <a class=\"text-primary\" href=\"tel:+966126285888\">+966 12 6285888</a>\r\n                  <br /> Mobile :\r\n                  <a class=\"text-primary\" href=\"tel:+966544038879\">+966 544038879</a>\r\n                  <br /> Email :​\r\n                  <a class=\"text-primary\" href=\"mailto:info@rawnaqtourism.com\">info@rawnaqtourism.com</a>\r\n                </p>\r\n              </div>\r\n            </div>\r\n          </div>\r\n\r\n\r\n      </div>\r\n    </div>\r\n    <div class=\"container\">\r\n\r\n    </div>\r\n  </div>\r\n</div>\r\n</block-ui>\r\n"

/***/ }),

/***/ "./src/app/contact-form/contact-form.component.ts":
/*!********************************************************!*\
  !*** ./src/app/contact-form/contact-form.component.ts ***!
  \********************************************************/
/*! exports provided: ContactFormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContactFormComponent", function() { return ContactFormComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ng-block-ui */ "./node_modules/ng-block-ui/index.js");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ng_block_ui__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _api_page_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../api/page.service */ "./src/app/api/page.service.ts");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/animations */ "./node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! aos */ "./node_modules/aos/dist/aos.js");
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(aos__WEBPACK_IMPORTED_MODULE_7__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var ContactFormComponent = /** @class */ (function () {
    function ContactFormComponent(page, title_, router) {
        this.page = page;
        this.title_ = title_;
        this.router = router;
        this.modelAlertContent = "";
        this.f = {
            clientName: "",
            clientContact: "",
            clientEmail: "",
            clientSubject: "",
            clientContent: ""
        };
        this.bannerImg = "assets/images/about-banner.jpg";
        this.title = "Contact us";
        this.contentText = "";
        this.apiUrl = "";
        this.title_.setTitle('RAWNAQ Tourism | Contact us');
    }
    ContactFormComponent.prototype.ngOnInit = function () {
        aos__WEBPACK_IMPORTED_MODULE_7___default.a.init({
            once: true, disable: 'mobile'
        });
        this.apiUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].site_url;
        this.router.events.subscribe(function (evt) {
            if (!(evt instanceof _angular_router__WEBPACK_IMPORTED_MODULE_6__["NavigationEnd"])) {
                return;
            }
            window.scrollTo(0, 0);
        });
    };
    ContactFormComponent.prototype.onSend = function () {
        var _this = this;
        if (this.f.clientName === "" ||
            this.f.clientContact === "" ||
            this.f.clientEmail === "" ||
            this.f.clientSubject === "" ||
            this.f.clientContent === "") {
            //this.alerts.setMessage('All the fields are required','error');
            this.modelAlertContent = "All the fields are required";
            return false;
        }
        this.blockUI.start("");
        this.page.sendContact(this.f).then(function (res) {
            if (res["success"]) {
                _this.blockUI.stop();
                _this.modelAlertContent =
                    "<span class='fc-primary'>Contact form has sent successfully.</span>";
                _this.resetForm();
            }
        }, function (reject) {
            console.log("error: ", reject);
            _this.blockUI.stop();
        });
    };
    ContactFormComponent.prototype.resetForm = function () {
        this.f = {
            clientName: "",
            clientContact: "",
            clientEmail: "",
            clientSubject: "",
            clientContent: ""
        };
    };
    __decorate([
        Object(ng_block_ui__WEBPACK_IMPORTED_MODULE_2__["BlockUI"])(),
        __metadata("design:type", Object)
    ], ContactFormComponent.prototype, "blockUI", void 0);
    ContactFormComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "app-contact-form",
            template: __webpack_require__(/*! ./contact-form.component.html */ "./src/app/contact-form/contact-form.component.html"),
            styles: [__webpack_require__(/*! ./contact-form.component.css */ "./src/app/contact-form/contact-form.component.css")],
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_4__["trigger"])('fadeInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_4__["state"])('void', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_4__["style"])({
                        opacity: 0
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_4__["transition"])('void <=> *', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_4__["animate"])(1000)),
                ])
            ]
        }),
        __metadata("design:paramtypes", [_api_page_service__WEBPACK_IMPORTED_MODULE_3__["PageService"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__["Title"], _angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"]])
    ], ContactFormComponent);
    return ContactFormComponent;
}());



/***/ }),

/***/ "./src/app/destinations/destinations.component.css":
/*!*********************************************************!*\
  !*** ./src/app/destinations/destinations.component.css ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/destinations/destinations.component.html":
/*!**********************************************************!*\
  !*** ./src/app/destinations/destinations.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\r\n  <block-ui>\r\n    <section class=\"hero-banner --inner-banner\" [ngStyle]=\"{'background-image': 'url('+bannerImg+')'}\">\r\n      <div class=\"content\">\r\n        <h4 class=\"title\"><span class=\"\">{{title}}</span></h4>\r\n      </div>\r\n    </section>\r\n    <section class=\"destination-section page-border\">\r\n      <div class=\"container\">\r\n        <div class=\"titlesection\" [innerHTML]=\"contentText\"></div>\r\n\r\n        <div class=\"box --destination-box\" infinite-scroll [infiniteScrollDistance]=\"scrollDistance\"\r\n          [infiniteScrollUpDistance]=\"scrollUpDistance\" [infiniteScrollThrottle]=\"throttle\" (scrolled)=\"loadMoreDestination()\">\r\n          <ng-container *ngFor=\"let destination of displayDestinations; let rIndex = index;\">\r\n            <div class=\"col-md-4\" *ngIf=\"destination['slug']!=='maldives'\">\r\n              <div class=\"inner-box\">\r\n                <a href='' [routerLink]=\"['/explore',destination['slug']]\">\r\n                  <figure [ngStyle]=\"{'background-image': 'url('+apiUrl+destination['thumbnail']+')'}\"></figure>\r\n                </a>\r\n                <h6 class=\"desc\">\r\n                  <a href=\"\" [routerLink]=\"['/explore',destination['slug']]\">\r\n                    {{destination['title']}} <small>{{destination['sub_description']}}</small>\r\n                  </a>\r\n                </h6>\r\n              </div>\r\n            </div>\r\n          </ng-container>\r\n        </div>\r\n      </div>\r\n    </section>\r\n  </block-ui>\r\n-->\r\n\r\n<block-ui>\r\n  <div class=\"wrapper\">\r\n    <div\r\n      data-aos-duration=\"1200\"\r\n      data-aos=\"fade\"\r\n      class=\"page-header background  page-header-sm\"\r\n      data-parallax=\"true\"\r\n      style=\"background-image: url('./assets/img/destinations.jpg');\"\r\n    >\r\n      <div class=\"filter\"></div>\r\n      <div class=\"container mt-4 pt-4 \">\r\n        <div class=\"mt-4 pt-4 motto text-left\">\r\n          <h3 class=\"title-uppercase py-4 mt-4\">{{ title }}</h3>\r\n          <p class=\"description text-white\">\r\n            Popular Tourist Destinations Around The Globe <br />Explore Your\r\n            Favorite Destination !\r\n          </p>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"destination-section\">\r\n      <div class=\"container\">\r\n        <!-- <div class=\"titlesection\" [innerHTML]=\"contentText\"></div> -->\r\n\r\n        <form class=\"form-horizontal\" (ngSubmit)=\"search()\">\r\n          <div class=\"row\">\r\n            <div class=\"col-md-4 offset-md-3\">\r\n              <div class=\"form-group\">\r\n                <input\r\n                  type=\"text\"\r\n                  [(ngModel)]=\"search_destination\"\r\n                  name=\"search_destination\"\r\n                  required\r\n                  class=\"form-control\"\r\n                  placeholder=\"Search Destination\"\r\n                />\r\n              </div>\r\n            </div>\r\n            <div class=\"col-md-2\">\r\n              <div class=\"form-group\">\r\n                <button type=\"submit\" class=\"btn --btn-primary\">Search</button>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </form>\r\n\r\n        <div class=\"row box --destination-box\">\r\n          <p *ngIf=\"!displayDestinations\" class=\"text-center\">\r\n            No Destination Found\r\n          </p>\r\n          <ng-container\r\n            *ngFor=\"let destination of displayDestinations; let rIndex = index\"\r\n          >\r\n            <div class=\"col-md-4\" *ngIf=\"destination['slug'] !== 'maldives'\">\r\n              <div class=\"inner-box\">\r\n                <a href=\"\" [routerLink]=\"['/explore', destination['slug']]\">\r\n                  <figure\r\n                    class=\"img-thumbnail img-responsive\"\r\n                    [ngStyle]=\"{\r\n                      'background-image':\r\n                        'url(' + apiUrl + destination['thumbnail'] + ')'\r\n                    }\"\r\n                  ></figure>\r\n                </a>\r\n                <p class=\"desc\">\r\n                  <a href=\"\" [routerLink]=\"['/explore', destination['slug']]\">\r\n                    <h6>\r\n                      {{ destination[\"title\"] }}\r\n                      <p class=\"description\">\r\n                        {{ destination[\"sub_description\"] }}\r\n                      </p>\r\n                    </h6>\r\n                  </a>\r\n                </p>\r\n              </div>\r\n            </div>\r\n          </ng-container>\r\n        </div>\r\n        <div class=\"row\" *ngIf=\"displayDestinations\">\r\n          <div class=\"col-md-12 text-center\">\r\n            <ng-container *ngFor=\"let page of totalPages; let rIndex = index\">\r\n              <button\r\n                (click)=\"loadDestinationsPage(12, 0, page + 1)\"\r\n                [ngClass]=\"{ 'btn-primary': page == currentPage, btn: true }\"\r\n              >\r\n                {{ page + 1 }}\r\n              </button>\r\n            </ng-container>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</block-ui>\r\n\r\n<!--\r\n  <div class=\"row\">\r\n    <div class=\"col-md-8 mr-auto ml-auto\">\r\n      <div class=\"card page-carousel\">\r\n        <ngb-carousel class=\"carousel slide\" tabindex=\"0\" style=\"display: block;\">\r\n          <ol class=\"carousel-indicators\">\r\n            <li id=\"ngb-slide-0\" class=\"active\"></li>\r\n            <li id=\"ngb-slide-1\" class=\"\"></li><li id=\"ngb-slide-2\" class=\"\"></li>\r\n          </ol><div class=\"carousel-inner\"><div class=\"carousel-item active\">\r\n            <img alt=\"Random first slide\" src=\"./assets/img/soroush-karimi.jpg\">\r\n            <div class=\"carousel-caption\">\r\n              <p>Somewhere</p></div>\r\n            </div>\r\n            <div class=\"carousel-item\">\r\n              <img alt=\"Random second slide\" src=\"./assets/img/federico-beccari.jpg\">\r\n              <div class=\"carousel-caption\">\r\n                <p>Somewhere else</p>\r\n              </div>\r\n            </div>\r\n            <div class=\"carousel-item\">\r\n              <img alt=\"Random third slide\" src=\"./assets/img/joshua-stannard.jpg\">\r\n              <div class=\"carousel-caption\">\r\n                <p>Here it is</p>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <a class=\"carousel-control-prev\" role=\"button\">\r\n            <span aria-hidden=\"true\" class=\"carousel-control-prev-icon\"></span>\r\n            <span class=\"sr-only\">Previous</span>\r\n          </a>\r\n          <a class=\"carousel-control-next\" role=\"button\">\r\n            <span aria-hidden=\"true\" class=\"carousel-control-next-icon\"></span>\r\n            <span class=\"sr-only\">Next</span>\r\n          </a>\r\n        </ngb-carousel>\r\n      </div>\r\n    </div>\r\n  </div>\r\n-->\r\n"

/***/ }),

/***/ "./src/app/destinations/destinations.component.ts":
/*!********************************************************!*\
  !*** ./src/app/destinations/destinations.component.ts ***!
  \********************************************************/
/*! exports provided: DestinationsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DestinationsComponent", function() { return DestinationsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _api_page_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../api/page.service */ "./src/app/api/page.service.ts");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ng-block-ui */ "./node_modules/ng-block-ui/index.js");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ng_block_ui__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/animations */ "./node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! aos */ "./node_modules/aos/dist/aos.js");
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(aos__WEBPACK_IMPORTED_MODULE_7__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};








var DestinationsComponent = /** @class */ (function () {
    function DestinationsComponent(activatedRoute, page, title_, router) {
        this.activatedRoute = activatedRoute;
        this.page = page;
        this.title_ = title_;
        this.router = router;
        this.bannerImg = "assets/images/about-banner.jpg";
        this.title = "Destination";
        this.apiUrl = "";
        this.scrollDistance = 1;
        this.scrollUpDistance = 2;
        this.throttle = 0;
        this.perPage = 12;
        this.destinations = [];
        this.displayDestinations = [];
        this.contentText = "";
        this.totalPages = [];
        this.currentPage = 0;
        this.search_destination = "";
        this.title_.setTitle("RAWNAQ Tourism | Destinations");
    }
    DestinationsComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var currentUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        aos__WEBPACK_IMPORTED_MODULE_7___default.a.init({
                            once: true,
                            disable: "mobile"
                        });
                        this.apiUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].site_url;
                        this.blockUI.start("");
                        currentUrl = this.router.url;
                        this.router.events.subscribe(function (evt) {
                            if (!(evt instanceof _angular_router__WEBPACK_IMPORTED_MODULE_1__["NavigationEnd"])) {
                                return;
                            }
                            window.scrollTo(0, 0);
                        });
                        return [4 /*yield*/, this.page.getPageContent(currentUrl.replace("/", "")).then(function (res) {
                                console.log("Page " + currentUrl + ": ", res);
                                if (res["success"]) {
                                    var pageData = res["response"];
                                    _this.title = pageData["title"];
                                    _this.contentText = pageData["content"];
                                    if (pageData["banner_img"] !== "")
                                        _this.bannerImg = _environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].site_url + pageData["banner_img"];
                                    _this.blockUI.stop();
                                }
                            }, function (reject) {
                                console.log("error: ", reject);
                                _this.blockUI.stop();
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadDestinationsPage(12, 0, 0)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DestinationsComponent.prototype.loadDestinationsPage = function (limit, show_on_home, page) {
        var _this = this;
        if (limit === void 0) { limit = 12; }
        if (show_on_home === void 0) { show_on_home = 0; }
        if (page === void 0) { page = 0; }
        var search_string = "";
        if (this.search_destination.trim() !== "") {
            search_string = this.search_destination.trim();
        }
        this.page.getAllDestination(limit, show_on_home, page, search_string).then(function (res) {
            console.log("All Destination: ", res);
            if (res["success"]) {
                _this.destinations = res["response"];
                _this.displayDestinations = [];
                _this.currentPage = res["current_page"];
                // console.log(res);
                _this.totalPages = Array(res["total_pages"])
                    .fill(0)
                    .map(function (x, i) { return i; });
                var BreakException_1 = {};
                try {
                    _this.destinations.forEach(function (s, i) {
                        if (_this.perPage < i + 1) {
                            throw BreakException_1;
                        }
                        _this.displayDestinations.push(_this.destinations[i]);
                    });
                }
                catch (e) {
                    if (e !== BreakException_1) {
                        throw e;
                    }
                }
                _this.blockUI.stop();
            }
            else {
                _this.displayDestinations = [];
            }
        }, function (reject) {
            console.log("error: ", reject);
            _this.blockUI.stop();
        });
    };
    DestinationsComponent.prototype.search = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadDestinationsPage(12, 0, 0)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DestinationsComponent.prototype.loadMoreDestination = function () {
        var _this = this;
        if (this.destinations && this.destinations.length > 0) {
            this.destinations.forEach(function (s, i) {
                var offSet = _this.displayDestinations.length;
                var BreakException = {};
                try {
                    if (_this.displayDestinations.length - 1 < i &&
                        _this.perPage + offSet > i) {
                        _this.displayDestinations.push(_this.destinations[i]);
                    }
                    else if (_this.perPage + offSet <= i + 1 ||
                        (_this.perPage + offSet > _this.destinations.length &&
                            i + _this.perPage > _this.destinations.length)) {
                        throw BreakException;
                    }
                }
                catch (e) {
                    if (e !== BreakException) {
                        throw e;
                    }
                }
            });
        }
    };
    __decorate([
        Object(ng_block_ui__WEBPACK_IMPORTED_MODULE_3__["BlockUI"])(),
        __metadata("design:type", Object)
    ], DestinationsComponent.prototype, "blockUI", void 0);
    DestinationsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "app-destinations",
            template: __webpack_require__(/*! ./destinations.component.html */ "./src/app/destinations/destinations.component.html"),
            styles: [__webpack_require__(/*! ./destinations.component.css */ "./src/app/destinations/destinations.component.css")],
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_5__["trigger"])("fadeInOut", [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_5__["state"])("void", Object(_angular_animations__WEBPACK_IMPORTED_MODULE_5__["style"])({
                        opacity: 0
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_5__["transition"])("void <=> *", Object(_angular_animations__WEBPACK_IMPORTED_MODULE_5__["animate"])(1000))
                ])
            ]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _api_page_service__WEBPACK_IMPORTED_MODULE_2__["PageService"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__["Title"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], DestinationsComponent);
    return DestinationsComponent;
}());



/***/ }),

/***/ "./src/app/enquiry-form/enquiry-form.component.css":
/*!*********************************************************!*\
  !*** ./src/app/enquiry-form/enquiry-form.component.css ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/enquiry-form/enquiry-form.component.html":
/*!**********************************************************!*\
  !*** ./src/app/enquiry-form/enquiry-form.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<block-ui>\r\n  <ng-template #enquiryContent let-c=\"close\" let-d=\"dismiss\">\r\n    <div class=\"modal-header\">\r\n      <h4 class=\"modal-title\">Request a Quote</h4>\r\n      <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"close($event)\">\r\n        <span aria-hidden=\"true\">&times;</span>\r\n      </button>\r\n    </div>\r\n    <div class=\"modal-body\">\r\n      <form class=\"form-horizontal\" (ngSubmit)=\"onSend()\">\r\n        <fieldset>\r\n          <div class=\"row\">\r\n            <div class=\"col-md-6\">\r\n              <div class=\"form-group\">\r\n                <label>Name</label>\r\n                <input name=\"firstName\" type=\"text\" class=\"form-control\" [(ngModel)]=\"customerName\" required />\r\n              </div>\r\n            </div>\r\n            <div class=\"col-md-6\">\r\n              <div class=\"form-group\">\r\n                <label>Email</label>\r\n                <input name=\"email\" type=\"email\" class=\"form-control\" [(ngModel)]=\"customerEmail\" required />\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <div class=\"row\">\r\n            <div class=\"col-md-6\">\r\n              <div class=\"form-group\">\r\n                <label>Contact Number</label>\r\n                <input name=\"contact_no\" type=\"text\" class=\"form-control\" [(ngModel)]=\"customerContact\" required />\r\n              </div>\r\n            </div>\r\n            <div class=\"col-md-6\">\r\n              <div class=\"form-group\">\r\n                <label>No. of Passengers</label>\r\n                <select name=\"totalPassengers\" [(ngModel)]=\"totalPassengers\" required class=\"form-control\">\r\n                  <option value=\"{{i}}\" *ngFor=\"let i of totalPassengersArray;\">{{ i }}</option>\r\n                </select>\r\n              </div>\r\n            </div>\r\n          </div>\r\n\r\n          <div class=\"row\">\r\n            <div class=\"col-md-12\">\r\n              <legend>Travel Dates</legend>\r\n            </div>\r\n            <div class=\"col-md-6\">\r\n              <div class=\"form-group\">\r\n                <label>Arrival</label>\r\n                <div class=\"input-group date-input-group\">\r\n                  <input name=\"arrivalDate\" placeholder=\"yyyy-mm-dd\" class=\"form-control\" [(ngModel)]=\"arrivalDate\"\r\n                    type=\"text\" ngbDatepicker #a=\"ngbDatepicker\" readonly required (click)=\"a.toggle()\" />\r\n                  <div class=\"input-group-append\">\r\n                    <button name=\"arrival-date-btn\" class=\"btn btn-outline-default calendar\" (click)=\"a.toggle()\"\r\n                      type=\"button\"></button>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n            <div class=\"col-md-6\">\r\n              <div class=\"form-group\">\r\n                <label>Departure</label>\r\n                <div class=\"input-group date-input-group\">\r\n                  <input name=\"departureDate\" placeholder=\"yyyy-mm-dd\" class=\"form-control\" [(ngModel)]=\"departureDate\"\r\n                    type=\"text\" ngbDatepicker #d=\"ngbDatepicker\" readonly required (click)=\"d.toggle()\" />\r\n                  <div class=\"input-group-append\">\r\n                    <button name=\"departure-date-btn\" class=\"btn btn-outline-default calendar\" (click)=\"d.toggle()\"\r\n                      type=\"button\"></button>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <div class=\"row\">\r\n            <div class=\"col-md-12\">\r\n              <div class=\"form-group\">\r\n                <label>Any Other Details</label>\r\n                <textarea class=\"form-control\"  name=\"offerDetail\" [(ngModel)]=\"customerQuery\"></textarea>\r\n              </div>\r\n            </div>\r\n          </div>\r\n\r\n          <div class=\"row mtpx-20\">\r\n            <div class=\"col-md-12\">\r\n              <div class=\"form-group\">\r\n                <button  name=\"\" type=\"submit\" class=\"btn --btn-primary mrpx-10\">Submit</button>\r\n                <button  name=\"\" type=\"button\" class=\"btn --btn-secondary\" (click)=\"close($event)\">Close</button>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <div class=\"row\">\r\n            <div class=\"col-md-12\"><strong [innerHTML]=\"modelAlertContent\"></strong></div>\r\n          </div>\r\n        </fieldset>\r\n\r\n      </form>\r\n    </div>\r\n    <div class=\"modal-footer\"></div>\r\n  </ng-template>\r\n</block-ui>\r\n"

/***/ }),

/***/ "./src/app/enquiry-form/enquiry-form.component.ts":
/*!********************************************************!*\
  !*** ./src/app/enquiry-form/enquiry-form.component.ts ***!
  \********************************************************/
/*! exports provided: EnquiryFormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EnquiryFormComponent", function() { return EnquiryFormComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ng-block-ui */ "./node_modules/ng-block-ui/index.js");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ng_block_ui__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _api_page_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../api/page.service */ "./src/app/api/page.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var EnquiryFormComponent = /** @class */ (function () {
    //constructor(private modalService: NgbModal, private page: PageService) {}
    function EnquiryFormComponent(modalService, page, config, calendar) {
        this.modalService = modalService;
        this.page = page;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        // if(dd<10) {
        //     dd = '0'+dd
        // } 
        // if(mm<10) {
        //     mm = '0'+mm
        // } 
        // today = mm + '/' + dd + '/' + yyyy;
        // document.write(today);
        // customize default values of datepickers used by this component tree
        config.minDate = { year: yyyy, month: mm, day: dd };
        config.maxDate = { year: 2099, month: 12, day: 31 };
        // days that don't belong to current month are not visible
        config.outsideDays = 'hidden';
        // weekends are disabled
        //config.markDisabled = (date: NgbDate) => calendar.getWeekday(date) >= 6;
    }
    EnquiryFormComponent.prototype.show = function (destinationId, title) {
        this.title = title;
        this.destinationId = destinationId;
        this.modalRef = this.modalService.open(this.content, {
            windowClass: "xlModal",
            size: "lg",
            backdrop: "static"
        });
    };
    EnquiryFormComponent.prototype.close = function (event) {
        event.stopPropagation();
        this.modalRef.close();
    };
    EnquiryFormComponent.prototype.ngOnInit = function () {
        this.rangeSettings = {
            display: "center",
            controls: ["calendar"],
            startInput: "#departureDateInp",
            endInput: "#arrivalDateInp",
            min: new Date(),
            dateFormat: "ddd, M yy"
        };
        this.resetForm();
        this.totalPassengersArray = [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30
        ];
    };
    EnquiryFormComponent.prototype.onSend = function () {
        var _this = this;
        if (this.customerEmail === "" ||
            this.customerName === "" ||
            this.customerQuery === "" ||
            this.customerContact === "") {
            this.modelAlertContent = "All fields are required";
            return false;
        }
        this.blockUI.start("");
        this.page
            .sendEnquiry({
            email: this.customerEmail,
            name: this.customerName,
            contact_no: this.customerContact,
            query: this.customerQuery,
            destinationId: this.destinationId,
            destinationTitle: this.title,
            arrivalDate: this.arrivalDate,
            departureDate: this.departureDate,
            totalPassengers: this.totalPassengers
        })
            .then(function (res) {
            if (res["success"]) {
                _this.blockUI.stop();
                _this.modelAlertContent =
                    "<span class='fc-primary'>Enquiry has sent successfully.</span>";
                _this.resetForm();
                //this.alerts.setMessage('Quote has sent successfuly','success');
                // this.modalRef.close();
            }
        }, function (reject) {
            console.log("error: ", reject);
            _this.blockUI.stop();
        });
    };
    EnquiryFormComponent.prototype.resetForm = function () {
        this.customerName = "";
        this.customerContact = "";
        this.customerEmail = "";
        this.customerQuery = "";
        this.arrivalDate = "";
        this.departureDate = "";
        this.totalPassengers = "1";
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])("enquiryContent"),
        __metadata("design:type", Object)
    ], EnquiryFormComponent.prototype, "content", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])("returnDateRange"),
        __metadata("design:type", Object)
    ], EnquiryFormComponent.prototype, "returnDateRange", void 0);
    __decorate([
        Object(ng_block_ui__WEBPACK_IMPORTED_MODULE_2__["BlockUI"])(),
        __metadata("design:type", Object)
    ], EnquiryFormComponent.prototype, "blockUI", void 0);
    EnquiryFormComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "app-enquiry-form",
            template: __webpack_require__(/*! ./enquiry-form.component.html */ "./src/app/enquiry-form/enquiry-form.component.html"),
            styles: [__webpack_require__(/*! ./enquiry-form.component.css */ "./src/app/enquiry-form/enquiry-form.component.css")]
        }),
        __metadata("design:paramtypes", [_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NgbModal"], _api_page_service__WEBPACK_IMPORTED_MODULE_3__["PageService"], _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NgbDatepickerConfig"], _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NgbCalendar"]])
    ], EnquiryFormComponent);
    return EnquiryFormComponent;
}());



/***/ }),

/***/ "./src/app/explore/explore.component.css":
/*!***********************************************!*\
  !*** ./src/app/explore/explore.component.css ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/explore/explore.component.html":
/*!************************************************!*\
  !*** ./src/app/explore/explore.component.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<block-ui>\r\n  <div class=\"wrapper\">\r\n    <ng-container *ngIf=\"slug == 'maldives'\">\r\n      <div\r\n        data-aos-duration=\"1200\"\r\n        data-aos=\"fade\"\r\n        class=\"page-header background  page-header-sm\"\r\n        data-parallax=\"true\"\r\n        style=\"background-image: url('./assets/img/Explore_Maldives.jpg');\"\r\n      >\r\n        <div class=\"filter\"></div>\r\n        <div class=\"container mt-4 pt-4 \">\r\n          <div class=\"mt-4 pt-4 motto text-left\">\r\n            <h3 class=\"title-uppercase py-4 mt-4\">Welcome to Maldives</h3>\r\n            <p class=\"description text-white\">\r\n              Incredibly indulgent luxury. Private villas, private beaches.\r\n              <br />\r\n              Spas, food, boat rides, sunsets. Relaxing, colorful, a\r\n              disconnection like no other.\r\n            </p>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </ng-container>\r\n    <ng-container *ngIf=\"slug !== 'maldives'\">\r\n      <div\r\n        data-aos-duration=\"1200\"\r\n        data-aos=\"fade\"\r\n        class=\"page-header background  page-header-sm\"\r\n        data-parallax=\"true\"\r\n        style=\"background-image: url('./assets/img/destinations.jpg');\"\r\n      >\r\n        <div class=\"filter\"></div>\r\n        <div class=\"container mt-4 pt-4 \">\r\n          <div class=\"mt-4 pt-4 motto text-left\">\r\n            <h3 class=\"title-uppercase py-4 mt-4\">\r\n              Explore Your Favorite Destination\r\n            </h3>\r\n            <p class=\"description text-white\">\r\n              Popular Tourist Destinations Around The Globe.\r\n            </p>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </ng-container>\r\n\r\n    <!-- Start of page section -->\r\n    <section class=\"destination-section\">\r\n      <!-- Start of page container -->\r\n      <div class=\"container\">\r\n        <!-- The Destinations Info Starts from here -->\r\n        <ng-container *ngIf=\"slug !== 'maldives'\">\r\n          <div class=\"row\">\r\n            <div class=\"col-lg-6 text-justify\">\r\n              <!--\r\n                <img class=\"primary-thumbnail\" src=\"{{apiUrl}}{{destinationThumb}}\">\r\n              -->\r\n              <div *ngIf=\"galleryImages && galleryImages.length > 0\">\r\n                <ngx-gallery\r\n                  [options]=\"galleryOptions\"\r\n                  [images]=\"galleryImages\"\r\n                ></ngx-gallery>\r\n              </div>\r\n\r\n              <!--\r\n                <div id=\"hotel_image\" *ngIf=\"!(galleryImages && galleryImages.length > 0) && destinationThumb != ''\">\r\n                  <img src=\"{{apiUrl}}{{destinationThumb}}\" class=\"img-thumbnail img-responsive\" />\r\n                </div>\r\n              -->\r\n            </div>\r\n            <div class=\"col-lg-6\">\r\n              <h3 class=\"py-3\">{{ destinationTitle }}</h3>\r\n              <p class=\"py-2 description\" [innerHTML]=\"contentText\"></p>\r\n\r\n              <div class=\"\">\r\n                <a\r\n                  href=\"#\"\r\n                  (click)=\"\r\n                    showEnquiryForm(destinationId, destinationTitle, $event)\r\n                  \"\r\n                  class=\"my-4 btn btn-primary btn-round\"\r\n                  >Request Quote</a\r\n                >\r\n\r\n                <a\r\n                  [routerLink]=\"['/destinations']\"\r\n                  class=\"my-4 btn btn-defult btn-round\"\r\n                  >Back</a\r\n                >\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <div class=\"text-center mtpx-60\">\r\n            <h4 class=\"title-uppercase\">Related Destination</h4>\r\n            <div\r\n              class=\"box --destination-box home-destination-slider related-destinations\"\r\n            >\r\n              <ngu-carousel\r\n                [inputs]=\"destinationCarousel\"\r\n                *ngIf=\"destinations && destinations.length > 0\"\r\n              >\r\n                <ngu-item\r\n                  NguCarouselItem\r\n                  *ngFor=\"let destination of destinations\"\r\n                  class=\"item\"\r\n                >\r\n                  <div class=\"inner-box\">\r\n                    <a href=\"\" [routerLink]=\"['/explore', destination['slug']]\">\r\n                      <figure\r\n                        class=\"img-rounded img-thumbnail img-responsive\"\r\n                        [ngStyle]=\"{\r\n                          'background-image':\r\n                            'url(' + apiUrl + destination['thumbnail'] + ')'\r\n                        }\"\r\n                      ></figure>\r\n                    </a>\r\n                    <a href=\"\" [routerLink]=\"['/explore', destination['slug']]\">\r\n                      <h3>{{ destination[\"title\"] }}</h3>\r\n                    </a>\r\n                    <a href=\"\" [routerLink]=\"['/explore', destination['slug']]\">\r\n                      <p class=\"description\">\r\n                        {{ destination[\"sub_description\"] }}\r\n                      </p>\r\n                    </a>\r\n                  </div>\r\n                </ngu-item>\r\n                <button\r\n                  NguCarouselPrev\r\n                  class=\"leftRs fa fa-arrow-circle-left\"\r\n                ></button>\r\n                <button\r\n                  NguCarouselNext\r\n                  class=\"rightRs fa fa-arrow-circle-right\"\r\n                ></button>\r\n              </ngu-carousel>\r\n            </div>\r\n          </div>\r\n        </ng-container>\r\n        <!-- The Destinations Info Ends here -->\r\n\r\n        <!-- The Hotels Info starts from here -->\r\n        <ng-container *ngIf=\"slug === 'maldives'\">\r\n          <!-- <div class=\"titlesection\" [innerHTML]=\"contentText\"></div> -->\r\n          <!-- --Search-- -->\r\n          <div class=\"titlesection\">\r\n            <form class=\"form-horizontal\" (ngSubmit)=\"search()\">\r\n              <div class=\"row mbpx-40\">\r\n                <div class=\"col-lg-4 col-md-4\">\r\n                  <div class=\"control-group\">\r\n                    <input\r\n                      type=\"text\"\r\n                      class=\"mt-3 form-control\"\r\n                      [(ngModel)]=\"searchByHotel\"\r\n                      placeholder=\"Search by Hotel Name\"\r\n                      [ngModelOptions]=\"{ standalone: true }\"\r\n                    />\r\n                  </div>\r\n                </div>\r\n                <div class=\"col-lg-3 col-md-3\">\r\n                  <div class=\"control-group\">\r\n                    <select\r\n                      [(ngModel)]=\"sortBy\"\r\n                      (change)=\"sortOrder = '0'\"\r\n                      class=\"mt-3 form-control\"\r\n                      [ngModelOptions]=\"{ standalone: true }\"\r\n                    >\r\n                      <option value=\"0\">Filter By</option>\r\n                      <option value=\"star\">Star Rating</option>\r\n                      <option value=\"rec\">Recommended For</option>\r\n                    </select>\r\n                  </div>\r\n                </div>\r\n                <div class=\"col-lg-3 col-md-3\">\r\n                  <div class=\"control-group\">\r\n                    <select\r\n                      *ngIf=\"sortBy === 'star'\"\r\n                      [(ngModel)]=\"sortOrder\"\r\n                      class=\"mt-3 form-control\"\r\n                      [ngModelOptions]=\"{ standalone: true }\"\r\n                    >\r\n                      <option value=\"0\">All</option>\r\n                      <option value=\"5\">5 Star</option>\r\n                      <option value=\"4\">4 Star</option>\r\n                      <option value=\"3\">3 Star</option>\r\n                      <option value=\"2\">2 Star</option>\r\n                      <option value=\"1\">1 Star</option>\r\n                    </select>\r\n                    <select\r\n                      *ngIf=\"sortBy === 'rec'\"\r\n                      [(ngModel)]=\"sortOrder\"\r\n                      class=\"form-control\"\r\n                      [ngModelOptions]=\"{ standalone: true }\"\r\n                    >\r\n                      <option value=\"0\">All</option>\r\n                      <option *ngFor=\"let option of recomArr\" [value]=\"option\">\r\n                        {{ option }}\r\n                      </option>\r\n                    </select>\r\n                  </div>\r\n                </div>\r\n                <div class=\"col-md-2\">\r\n                  <div class=\"form-group\">\r\n                    <button type=\"submit\" class=\"mt-3 btn --btn-primary\">\r\n                      Search\r\n                    </button>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </form>\r\n          </div>\r\n          <!-- --Search-- -->\r\n\r\n          <!-- --Hotels View-- -->\r\n          <div class=\"box --hotel-category-box row mtpx-40\">\r\n            <p *ngIf=\"!displayHotels.length\" class=\"text-center\">\r\n              No Hotel Found\r\n            </p>\r\n            <ng-container\r\n              *ngFor=\"let hotel of displayHotels; let rIndex = index\"\r\n            >\r\n              <!-- Condition -->\r\n              <div class=\"col-md-4\">\r\n                <!-- Start of Hotel Card -->\r\n                <div class=\"card-hotel-info text-center\">\r\n                  <a\r\n                    href=\"#\"\r\n                    [routerLink]=\"['/hotel', hotel['slug']]\"\r\n                    class=\"hotel-logo\"\r\n                  >\r\n                    <!--\r\n                      <img *ngIf=\"!hotel['logo'] || hotel['logo'] ==='' \" src=\"assets/images/hotel-logo-1.jpg\" alt=\"{{hotel['title']}}\"\r\n                      class=\"m-auto\">\r\n                    -->\r\n                    <img\r\n                      *ngIf=\"hotel['logo'] !== ''\"\r\n                      src=\"{{apiUrl}}{{hotel['logo']}}\"\r\n                      alt=\"{{hotel['title']}}\"\r\n                      class=\"hotel-card-logo img-no-padding img-responsive\"\r\n                    />\r\n                  </a>\r\n                  <a href=\"#\" [routerLink]=\"['/hotel', hotel['slug']]\">\r\n                    <figure\r\n                      class=\"img-thumbnail img-responsive\"\r\n                      *ngIf=\"!hotel['thumbnail'] || hotel['thumbnail'] === ''\"\r\n                      [ngStyle]=\"{\r\n                        'background-image': 'url(assets/images/hotel-1.jpg)'\r\n                      }\"\r\n                    ></figure>\r\n                    <figure\r\n                      class=\"img-thumbnail img-responsive\"\r\n                      *ngIf=\"hotel['thumbnail'] !== ''\"\r\n                      [ngStyle]=\"{\r\n                        'background-image':\r\n                          'url(' + apiUrl + hotel['thumbnail'] + ')'\r\n                      }\"\r\n                    ></figure>\r\n                  </a>\r\n\r\n                  <div class=\"desc\">\r\n                    <ng-container\r\n                      *ngFor=\"let star of (5 | fill); let z = index\"\r\n                    >\r\n                      <img\r\n                        *ngIf=\"star + 1 <= hotel['starRating']\"\r\n                        src=\"assets/images/star-on.png\"\r\n                        style=\"display:inline-block; margin:5px;\"\r\n                      />\r\n                      <img\r\n                        *ngIf=\"star + 1 > hotel['starRating']\"\r\n                        src=\"assets/images/star-off.png\"\r\n                        style=\"display:inline-block; margin:5px;\"\r\n                      /> </ng-container\r\n                    ><br />\r\n                    <a href=\"\" [routerLink]=\"['/hotel', hotel['slug']]\">{{\r\n                      hotel[\"title\"]\r\n                    }}</a\r\n                    ><br />\r\n                    <small\r\n                      ><strong>Location: </strong>{{ hotel[\"location\"] }}</small\r\n                    ><br />\r\n                    <small\r\n                      ><strong>Number of Rooms: </strong\r\n                      >{{ hotel[\"no_of_rooms\"] }}</small\r\n                    ><br />\r\n                    <small\r\n                      ><strong>Distance from Airport: </strong\r\n                      >{{ hotel[\"distance\"] }}Km</small\r\n                    >\r\n                  </div>\r\n                </div>\r\n                <!-- End of Hotel Card -->\r\n              </div>\r\n              <!-- Condition -->\r\n            </ng-container>\r\n          </div>\r\n          <!-- --Hotels View-- -->\r\n        </ng-container>\r\n        <!-- The Hotels Info ends here -->\r\n      <div class=\"row mt-4\" *ngIf=\"displayHotels\">\r\n        <div class=\"mt-5 col-md-12 text-center\">\r\n          <ng-container *ngFor=\"let page of totalPages; let rIndex = index\">\r\n            <button\r\n              (click)=\"loadHotelsPage(slug, 12, page + 1)\"\r\n              [ngClass]=\"{ 'btn-primary': page == currentPage, btn: true }\"\r\n            >\r\n              {{ page + 1 }}\r\n            </button>\r\n          </ng-container>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <!-- End of page container -->\r\n    </section>\r\n    <!-- End of page section -->\r\n  </div>\r\n  <!-- End of page wrapper -->\r\n</block-ui>\r\n<app-enquiry-form #EnquiryContent></app-enquiry-form>\r\n"

/***/ }),

/***/ "./src/app/explore/explore.component.ts":
/*!**********************************************!*\
  !*** ./src/app/explore/explore.component.ts ***!
  \**********************************************/
/*! exports provided: ExploreComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExploreComponent", function() { return ExploreComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _api_page_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../api/page.service */ "./src/app/api/page.service.ts");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ng-block-ui */ "./node_modules/ng-block-ui/index.js");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ng_block_ui__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var rxjs_add_operator_switchMap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/add/operator/switchMap */ "./node_modules/rxjs-compat/_esm5/add/operator/switchMap.js");
/* harmony import */ var _enquiry_form_enquiry_form_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../enquiry-form/enquiry-form.component */ "./src/app/enquiry-form/enquiry-form.component.ts");
/* harmony import */ var ngx_gallery__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-gallery */ "./node_modules/ngx-gallery/bundles/ngx-gallery.umd.js");
/* harmony import */ var ngx_gallery__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(ngx_gallery__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! hammerjs */ "./node_modules/hammerjs/hammer.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var cheerio__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! cheerio */ "./node_modules/cheerio/index.js");
/* harmony import */ var cheerio__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(cheerio__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/animations */ "./node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! aos */ "./node_modules/aos/dist/aos.js");
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(aos__WEBPACK_IMPORTED_MODULE_12__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};













var ExploreComponent = /** @class */ (function () {
    function ExploreComponent(router, activatedRoute, page, title_, meta) {
        var _this = this;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.page = page;
        this.title_ = title_;
        this.meta = meta;
        this.bannerImg = "";
        this.title = "";
        this.apiUrl = "";
        this.contentText = "";
        this.scrollDistance = 1;
        this.scrollUpDistance = 2;
        this.throttle = 0;
        this.perPage = 16;
        this.hotels = [];
        this.displayHotels = [];
        this.currentUrl = "";
        this.slug = "";
        this.destinations = [];
        this.destinationThumb = "";
        this.destinationTitle = "";
        this.galleries = [];
        this.sortBy = "0";
        this.sortOrder = "0";
        this.searchByHotel = "";
        this.recomArr = [
            "Business",
            "Diving",
            "Families",
            "Honeymooners",
            "Meetings",
            "Wellness",
            "Young Couples"
        ];
        this.bannerImages = [
            "assets/images/banners/maldives-banner-1.jpg",
            "assets/images/banners/maldives-banner-2.jpg",
            "assets/images/banners/maldives-banner-3.jpg",
            "assets/images/banners/maldives-banner-4.jpg"
        ];
        this.currentBanner = 0;
        this.bannerStyle = {};
        this.bannerClass = "hero-banner";
        this.totalPages = [];
        this.currentPage = 0;
        this.title_.setTitle("Rawnaq Tourism Maldives | Luxury Resorts in Maldives | Honeymoon and Tour Package");
        this.meta.updateTag({ name: 'description', content: 'Best Deals for Maldives Tour Package, Honeymoon packages, Maldives Holidays Package, Luxury Resorts, Hotels, Resorts for Family with best Maldives Offers by best Travel agency Rawnaq Tourism Maldives.' });
        this.activatedRoute.params.subscribe(function (val) {
            _this.ngOnInit();
        });
    }
    ExploreComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        aos__WEBPACK_IMPORTED_MODULE_12___default.a.init({
                            once: true,
                            disable: "mobile"
                        });
                        // start the page from the top
                        this.router.events.subscribe(function (evt) {
                            if (!(evt instanceof _angular_router__WEBPACK_IMPORTED_MODULE_1__["NavigationEnd"])) {
                                return;
                            }
                            window.scrollTo(0, 0);
                        });
                        this.apiUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].site_url;
                        this.blockUI.start("");
                        this.currentUrl = this.router.url;
                        this.bannerCarousel = {
                            grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
                            slide: 4,
                            speed: 2000,
                            interval: 8000,
                            point: {
                                visible: false
                            },
                            load: 2,
                            touch: false,
                            loop: true
                        };
                        this.galleryOptions = [
                            {
                                width: "100%",
                                // height: "400px",
                                thumbnailsColumns: 4,
                                imageAnimation: ngx_gallery__WEBPACK_IMPORTED_MODULE_7__["NgxGalleryAnimation"].Slide,
                                imageInfinityMove: true,
                                imageArrowsAutoHide: true
                            }
                            // max-width 800
                            // {
                            //   breakpoint: 800,
                            //   width: "100%",
                            //   height: "600px",
                            //   imagePercent: 80,
                            //   thumbnailsPercent: 20,
                            //   thumbnailsMargin: 20,
                            //   thumbnailMargin: 20
                            // },
                            // // max-width 400
                            // {
                            //   breakpoint: 400,
                            //   preview: false
                            // }
                        ];
                        this.destinationCarousel = {
                            grid: { xs: 1, sm: 1, md: 3, lg: 3, all: 0 },
                            slide: 1,
                            speed: 400,
                            interval: 4000,
                            point: {
                                visible: false
                            },
                            load: 2,
                            touch: true,
                            loop: true
                        };
                        this.activatedRoute.params.subscribe(function (params) {
                            _this.slug = params["slug"];
                            if (typeof _this.slug == "undefined") {
                                _this.slug = _this.currentUrl.substring(_this.currentUrl.lastIndexOf("/") + 1, _this.currentUrl.length);
                            }
                        });
                        console.log("Current Slug : ", this.slug);
                        if (!this.slug)
                            return [2 /*return*/, false];
                        if (!(this.slug !== "maldives")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.page.getAllDestination().then(function (res) {
                                console.log("All Destination: ", res);
                                if (res["success"]) {
                                    _this.destinations = res["response"];
                                    _this.blockUI.stop();
                                    var destinationIndex = _this.destinations.findIndex(function (item) { return item["slug"].indexOf(_this.slug) !== -1; });
                                    if (destinationIndex > -1) {
                                        _this.destinations.splice(destinationIndex, 1);
                                    }
                                    _this.destinations.splice(9, _this.destinations.length - 1);
                                }
                            }, function (reject) {
                                console.log("error: ", reject);
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: 
                    // await this.page.getAllHotels(this.slug).then(
                    //   res => {
                    //     if (res["success"]) {
                    //       const pageData = res["response"];
                    //       this.hotels = pageData["hotels"];
                    //       this.bannerStyle = {
                    //         "background-image":
                    //           "url(" + this.apiUrl + "assets/images/about-banner.jpg" + ")"
                    //       };
                    //       if (pageData["banner"] != "") {
                    //         this.bannerImg = this.apiUrl + pageData["banner"];
                    //         this.bannerStyle = {
                    //           "background-image":
                    //             "url(" + this.apiUrl + pageData["banner"] + ")"
                    //         };
                    //       }
                    //       this.title = pageData["title"];
                    //       //this.contentText = pageData["content"];
                    //       console.log(pageData);
                    //       var Cheerio = cheerio.load(pageData["content"]);
                    //       //console.log(Cheerio("p.details").html());
                    //       this.contentText = Cheerio("p.details").html();
                    //       this.destinationThumb = "assets/images/amsterdam.jpg";
                    //       this.destinationTitle =
                    //         pageData["title"] + ", " + pageData["description"];
                    //       var destinationGallery = [];
                    //       if (pageData["thumbnail"] != "") {
                    //         this.destinationThumb = pageData["thumbnail"];
                    //         destinationGallery.push({
                    //           small: this.apiUrl + pageData["thumbnail"],
                    //           medium: this.apiUrl + pageData["thumbnail"],
                    //           big: this.apiUrl + pageData["thumbnail"]
                    //         });
                    //       }
                    //       if (pageData["galleries"] && pageData["galleries"].length > 0) {
                    //         pageData["galleries"].forEach(gallery => {
                    //           destinationGallery.push({
                    //             small: this.apiUrl + gallery["img"],
                    //             medium: this.apiUrl + gallery["img"],
                    //             big: this.apiUrl + gallery["img"]
                    //           });
                    //         });
                    //       }
                    //       this.galleryImages = destinationGallery;
                    //       console.log(destinationGallery);
                    //       // console.log(pageData);
                    //       this.displayHotels = [];
                    //       const BreakException = {};
                    //       try {
                    //         this.hotels.forEach((s, i) => {
                    //           if (this.perPage < i + 1) {
                    //             throw BreakException;
                    //           }
                    //           this.displayHotels.push(this.hotels[i]);
                    //           const rec = this.hotels[i]["recommended_for"].split(",");
                    //           rec.forEach(ss => {
                    //             ss = ss.trim();
                    //             if (ss != "" && this.recomArr.indexOf(ss) === -1) {
                    //               this.recomArr.push(ss);
                    //             }
                    //           });
                    //         });
                    //       } catch (e) {
                    //         if (e !== BreakException) {
                    //           throw e;
                    //         }
                    //       }
                    //       this.blockUI.stop();
                    //     }
                    //   },
                    //   reject => {
                    //     console.log("error: ", reject);
                    //     this.blockUI.stop();
                    //   }
                    // );
                    return [4 /*yield*/, this.loadHotelsPage(this.slug, 12, 0)];
                    case 3:
                        // await this.page.getAllHotels(this.slug).then(
                        //   res => {
                        //     if (res["success"]) {
                        //       const pageData = res["response"];
                        //       this.hotels = pageData["hotels"];
                        //       this.bannerStyle = {
                        //         "background-image":
                        //           "url(" + this.apiUrl + "assets/images/about-banner.jpg" + ")"
                        //       };
                        //       if (pageData["banner"] != "") {
                        //         this.bannerImg = this.apiUrl + pageData["banner"];
                        //         this.bannerStyle = {
                        //           "background-image":
                        //             "url(" + this.apiUrl + pageData["banner"] + ")"
                        //         };
                        //       }
                        //       this.title = pageData["title"];
                        //       //this.contentText = pageData["content"];
                        //       console.log(pageData);
                        //       var Cheerio = cheerio.load(pageData["content"]);
                        //       //console.log(Cheerio("p.details").html());
                        //       this.contentText = Cheerio("p.details").html();
                        //       this.destinationThumb = "assets/images/amsterdam.jpg";
                        //       this.destinationTitle =
                        //         pageData["title"] + ", " + pageData["description"];
                        //       var destinationGallery = [];
                        //       if (pageData["thumbnail"] != "") {
                        //         this.destinationThumb = pageData["thumbnail"];
                        //         destinationGallery.push({
                        //           small: this.apiUrl + pageData["thumbnail"],
                        //           medium: this.apiUrl + pageData["thumbnail"],
                        //           big: this.apiUrl + pageData["thumbnail"]
                        //         });
                        //       }
                        //       if (pageData["galleries"] && pageData["galleries"].length > 0) {
                        //         pageData["galleries"].forEach(gallery => {
                        //           destinationGallery.push({
                        //             small: this.apiUrl + gallery["img"],
                        //             medium: this.apiUrl + gallery["img"],
                        //             big: this.apiUrl + gallery["img"]
                        //           });
                        //         });
                        //       }
                        //       this.galleryImages = destinationGallery;
                        //       console.log(destinationGallery);
                        //       // console.log(pageData);
                        //       this.displayHotels = [];
                        //       const BreakException = {};
                        //       try {
                        //         this.hotels.forEach((s, i) => {
                        //           if (this.perPage < i + 1) {
                        //             throw BreakException;
                        //           }
                        //           this.displayHotels.push(this.hotels[i]);
                        //           const rec = this.hotels[i]["recommended_for"].split(",");
                        //           rec.forEach(ss => {
                        //             ss = ss.trim();
                        //             if (ss != "" && this.recomArr.indexOf(ss) === -1) {
                        //               this.recomArr.push(ss);
                        //             }
                        //           });
                        //         });
                        //       } catch (e) {
                        //         if (e !== BreakException) {
                        //           throw e;
                        //         }
                        //       }
                        //       this.blockUI.stop();
                        //     }
                        //   },
                        //   reject => {
                        //     console.log("error: ", reject);
                        //     this.blockUI.stop();
                        //   }
                        // );
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ExploreComponent.prototype.loadHotelsPage = function (slug, limit, page) {
        var _this = this;
        if (limit === void 0) { limit = 12; }
        if (page === void 0) { page = 0; }
        console.log("Searched");
        var search_string = "";
        if (this.searchByHotel.toLowerCase().trim() !== "") {
            search_string = this.searchByHotel.toLowerCase().trim();
        }
        if (this.sortBy.trim() !== "" && this.sortOrder.trim() !== "") {
            var filter_type = this.sortBy.trim();
            var filter_value = this.sortOrder.trim();
        }
        else {
            var filter_type = "";
            var filter_value = "";
        }
        this.page
            .getAllHotels(slug, limit, page, search_string, filter_type, filter_value)
            .then(function (res) {
            if (res["success"]) {
                var pageData = res["response"];
                _this.hotels = pageData["hotels"];
                _this.currentPage = res["current_page"];
                console.log(res);
                _this.totalPages = Array(res["total_pages"])
                    .fill(0)
                    .map(function (x, i) { return i; });
                _this.bannerStyle = {
                    "background-image": "url(" + _this.apiUrl + "assets/images/about-banner.jpg" + ")"
                };
                if (pageData["banner"] != "") {
                    _this.bannerImg = _this.apiUrl + pageData["banner"];
                    _this.bannerStyle = {
                        "background-image": "url(" + _this.apiUrl + pageData["banner"] + ")"
                    };
                }
                _this.title = pageData["title"];
                //this.contentText = pageData["content"];
                console.log(pageData);
                var Cheerio = cheerio__WEBPACK_IMPORTED_MODULE_9__["load"](pageData["content"]);
                //console.log(Cheerio("p.details").html());
                _this.contentText = Cheerio("p.details").html();
                _this.destinationThumb = "assets/images/amsterdam.jpg";
                _this.destinationTitle =
                    pageData["title"] + ", " + pageData["description"];
                var destinationGallery = [];
                if (pageData["thumbnail"] != "") {
                    _this.destinationThumb = pageData["thumbnail"];
                    destinationGallery.push({
                        small: _this.apiUrl + pageData["thumbnail"],
                        medium: _this.apiUrl + pageData["thumbnail"],
                        big: _this.apiUrl + pageData["thumbnail"]
                    });
                }
                if (pageData["galleries"] && pageData["galleries"].length > 0) {
                    pageData["galleries"].forEach(function (gallery) {
                        destinationGallery.push({
                            small: _this.apiUrl + gallery["img"],
                            medium: _this.apiUrl + gallery["img"],
                            big: _this.apiUrl + gallery["img"]
                        });
                    });
                }
                _this.galleryImages = destinationGallery;
                console.log(destinationGallery);
                // console.log(pageData);
                _this.displayHotels = [];
                var BreakException_1 = {};
                try {
                    _this.hotels.forEach(function (s, i) {
                        if (_this.perPage < i + 1) {
                            throw BreakException_1;
                        }
                        _this.displayHotels.push(_this.hotels[i]);
                        // console.log(this.hotels[i]["title"]);
                        var rec = _this.hotels[i]["recommended_for"].split(",");
                    });
                }
                catch (e) {
                    if (e !== BreakException_1) {
                        throw e;
                    }
                }
                _this.blockUI.stop();
            }
            else {
                _this.displayHotels = [];
            }
        }, function (reject) {
            console.log("error: ", reject);
            _this.blockUI.stop();
        });
    };
    ExploreComponent.prototype.search = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadHotelsPage(this.slug, 12, 0)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_enquiry_form_enquiry_form_component__WEBPACK_IMPORTED_MODULE_6__["EnquiryFormComponent"]),
        __metadata("design:type", _enquiry_form_enquiry_form_component__WEBPACK_IMPORTED_MODULE_6__["EnquiryFormComponent"])
    ], ExploreComponent.prototype, "enquiryModal", void 0);
    __decorate([
        Object(ng_block_ui__WEBPACK_IMPORTED_MODULE_3__["BlockUI"])(),
        __metadata("design:type", Object)
    ], ExploreComponent.prototype, "blockUI", void 0);
    ExploreComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "app-explore",
            template: __webpack_require__(/*! ./explore.component.html */ "./src/app/explore/explore.component.html"),
            styles: [__webpack_require__(/*! ./explore.component.css */ "./src/app/explore/explore.component.css")],
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["trigger"])("fadeInOut", [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["state"])("void", Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["style"])({
                        opacity: 0
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["transition"])("void <=> *", Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["animate"])(1000))
                ])
            ]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _api_page_service__WEBPACK_IMPORTED_MODULE_2__["PageService"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_11__["Title"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_11__["Meta"]])
    ], ExploreComponent);
    return ExploreComponent;
}());



/***/ }),

/***/ "./src/app/home/home.component.css":
/*!*****************************************!*\
  !*** ./src/app/home/home.component.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n"

/***/ }),

/***/ "./src/app/home/home.component.html":
/*!******************************************!*\
  !*** ./src/app/home/home.component.html ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div data-aos-duration=\"1200\" data-aos=\"fade\" class=\"page-header background\" data-parallax=\"true\" style=\"background-image: url('./assets/img/1.jpg');\">\r\n  <div class=\"container my-4\">\r\n      <div class=\"mt-4 motto text-center title-uppercase\">\r\n          <h2  data-aos-duration=\"2500\" data-aos=\"fade-up\" data-aos-easing=\"ease-out-bounce\"  class=\"pt-4 mt-4\">Spend Quality Holidays With Us</h2>\r\n          <h6 data-aos-duration=\"2000\" data-aos=\"fade\" data-aos-delay=\"1000\" data-aos-easing=\"ease-out-bounce\" >We’re helping people to travel smart within their budget</h6>\r\n          <br />\r\n          <a data-aos-duration=\"2000\" data-aos=\"fade\" data-aos-delay=\"2000\" data-aos-easing=\"ease-out-bounce\" href=\"/destinations\" class=\"my-2 mr-2 btn btn-primary\">Destnations</a>\r\n          <a data-aos-duration=\"2000\" data-aos=\"fade\" data-aos-delay=\"2500\" data-aos-easing=\"ease-out-bounce\" href=\"/explore/maldives\" class=\"my-2 ml-2 btn btn-outline-neutral\">Explore Maldives</a>\r\n      </div>\r\n  </div>\r\n</div>\r\n<div class=\"main\">\r\n  <div class=\"section section-gray text-center\">\r\n  <div class=\"container\">\r\n      <div class=\"row\">\r\n          <div data-aos-duration=\"1200\" data-aos=\"fade-up\" data-aos-easing=\"ease-out-bounce\" class=\"text-justify col-md-12 mr-auto ml-auto\">\r\n              <h5 class=\"description\">\r\n                  At Rawnaq you can find a variety of specialized tourism services with just one stop such as Ticketing, Hotels Booking \r\n                  and Tourism Packages for the luxury destinations all over the world.\r\n              \r\n                  This is allowed us to be one of the most admired and accepted corporations in the tourism field in GCC, serving more than 500,000 \r\n                  followers in our social media channels and numerous corporate clients as well.\r\n              </h5>\r\n              <br>\r\n          </div>\r\n      </div>\r\n      <br/><br/>\r\n      <div class=\"row \">\r\n          <div data-aos-duration=\"1200\" data-aos=\"fade-up\" data-aos-delay=\"300\" data-aos-easing=\"ease-out-bounce\" class=\"col-md-3\">\r\n              <img src=\"assets/img/about_us.jpeg\" class=\"img-thumbnail img-responsive\" alt=\"Rounded Image\">\r\n              <div class=\"img-details\">\r\n                  <div class=\"details\">\r\n                       <a href=\"/about-us\"><span _ngcontent-c5=\"\" class=\"label-extra label-primary\">About us</span></a>\r\n                  </div>\r\n              </div>\r\n          </div>\r\n          <div data-aos-duration=\"1200\" data-aos=\"fade-up\" data-aos-delay=\"500\" data-aos-easing=\"ease-out-bounce\" class=\"col-md-3\">\r\n              <img src=\"assets/img/how_we_work.jpeg\" class=\"img-thumbnail img-responsive\" alt=\"Rounded Image\">\r\n              <div class=\"img-details\">\r\n                  <div class=\"details\">\r\n                      <a href=\"/how-we-work\"><span _ngcontent-c5=\"\" class=\"label-extra label-primary\">How we work</span></a>\r\n                  </div>\r\n              </div>\r\n          </div>\r\n          <div data-aos-duration=\"1200\" data-aos=\"fade-up\" data-aos-delay=\"700\" data-aos-easing=\"ease-out-bounce\" class=\"col-md-3\">\r\n              <img src=\"assets/img/destinations.jpg\" class=\"img-thumbnail img-responsive\" alt=\"Rounded Image\">\r\n              <div class=\"img-details\">\r\n                  <div class=\"details\">\r\n                        <a href=\"/destinations\"><span _ngcontent-c5=\"\" class=\"label-extra label-primary\">Destinations</span></a>\r\n                  </div>\r\n              </div>\r\n          </div>\r\n          <div data-aos-duration=\"1200\" data-aos=\"fade-up\" data-aos-delay=\"900\" data-aos-easing=\"ease-out-bounce\" class=\"col-md-3\">\r\n              <img src=\"assets/img/Explore_Maldives.jpg\" class=\"img-thumbnail img-responsive\" alt=\"Rounded Image\">\r\n              <div class=\"img-details\">\r\n                  <div class=\"details\">\r\n                       <a href=\"/explore/maldives\"><span _ngcontent-c5=\"\" class=\"label-extra label-primary\">Explore maldives</span></a>\r\n                  </div>\r\n              </div>\r\n          </div>\r\n      </div>\r\n  </div>\r\n</div>\r\n\r\n\r\n\r\n<div class=\"section text-center\">\r\n  <div class=\"container\">\r\n      <div class=\"row\">\r\n          <div class=\"col-md-12 mr-auto ml-auto\">\r\n              <h2 data-aos-duration=\"1200\" data-aos=\"fade\" data-aos-delay=\"300\" data-aos-easing=\"ease-out-bounce\" class=\"mb-4 pb-4 title-uppercase\"> Core Competencies</h2> \r\n              <div class=\"row text-center py-4 my-4\">\r\n\r\n                  <div data-aos-duration=\"1200\" data-aos=\"fade-up\" data-aos-delay=\"300\" data-aos-easing=\"ease-out-bounce\" class=\"col-md-3\">\r\n                      <div class=\"values\">\r\n                            <i class=\"fa fa-dollar\"></i>\r\n                            <h6 class=\"description\" >Reasonable rates</h6>\r\n                      </div>\r\n                  </div>\r\n          \r\n                  \r\n                    <div data-aos-duration=\"1200\" data-aos=\"fade-up\" data-aos-delay=\"500\" data-aos-easing=\"ease-out-bounce\" class=\"col-md-3\">\r\n                            <div class=\"values\">\r\n                                    <i class=\"fa fa-bed\"> </i>\r\n                                    <h6 class=\"description\" >reliable hotels</h6>\r\n                            </div>\r\n                        </div>\r\n                \r\n        \r\n                    <div data-aos-duration=\"1200\" data-aos=\"fade-up\" data-aos-delay=\"700\" data-aos-easing=\"ease-out-bounce\" class=\"col-md-3\">\r\n                            <div class=\"values\">\r\n                                    <i class=\"fa fa-diamond\"></i>\r\n                                    <h6 class=\"description\" >honyemoores preferd</h6>\r\n                            </div>\r\n                        </div>\r\n                \r\n    \r\n                    <div data-aos-duration=\"1200\" data-aos=\"fade-up\" data-aos-delay=\"900\" data-aos-easing=\"ease-out-bounce\" class=\"col-md-3\">\r\n                            <div class=\"values\">\r\n                                    <i class=\"fa fa-phone\"></i>\r\n                                    <h6 class=\"description\" >24/7 assistance</h6>\r\n                            </div>\r\n                        </div>\r\n                    \r\n          \r\n\r\n                  \r\n              </div>\r\n          </div>\r\n      </div>\r\n  </div>\r\n</div>\r\n\r\n\r\n<!-- <section class=\"destination-section\">\r\n        <div class=\"container\">\r\n          <div class=\"titlesection\">\r\n            <h2 class=\"maintitle\">Popular Tourist Destinations Around The Globe</h2>\r\n            <p class=\"subtitle\">Explore Your Favorite Destination</p>\r\n          </div>\r\n    \r\n          <div class=\"box --destination-box home-destination-slider related-destinations\">\r\n            <ngu-carousel [inputs]=\"destinationCarousel\" *ngIf=\"destinations.length>0\">\r\n              <ngu-item NguCarouselItem *ngFor=\"let destination of destinations\" class=\"item\">\r\n                <div class=\"inner-box\">\r\n                  <a href=\"\" [routerLink]=\"['/explore',destination['slug']]\">\r\n                    <a href='' [routerLink]=\"['/explore',destination['slug']]\">\r\n                      <figure [ngStyle]=\"{'background-image': 'url('+apiUrl+destination['thumbnail']+')'}\"></figure>\r\n                    </a>\r\n                    <h6 class=\"desc\">{{destination['title']}}\r\n                      <small>{{destination['sub_description']}}</small>\r\n                    </h6>\r\n                  </a>\r\n                </div>\r\n    \r\n              </ngu-item>\r\n              <button NguCarouselPrev class='leftRs  fa fa-arrow-circle-left'></button>\r\n              <button NguCarouselNext class='rightRs fa fa-arrow-circle-right'></button>\r\n            </ngu-carousel>\r\n          </div>\r\n        </div>\r\n      </section> -->\r\n\r\n<div class=\"container-fluid\">\r\n    <!-- <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n            <h2 class=\"mb-4 pb-4 title-uppercase text-center\"> Our Best Destinations</h2> \r\n        </div>\r\n    </div> -->\r\n    <div class=\"row\">\r\n        <ng-container *ngFor=\"let destination of destinations\" >\r\n            <div class=\"p-0 m-0 col-md-4 col-sm-12 col-xs-12\">\r\n                <div class=\"hovereffect\">\r\n                    <a class=\"none\" [routerLink]=\"['/explore',destination['slug']]\">\r\n                        <img class=\"img-responsive\" src=\"{{apiUrl+destination['thumbnail']}}\"  height=350px width=250px alt=\"\">\r\n                    </a>\r\n                    <div class=\"overlay\">\r\n                        <a class=\"none\" [routerLink]=\"['/explore',destination['slug']]\">\r\n                            <h2>{{destination['title']}}</h2>\r\n                        </a>\r\n                        <p>\r\n                            <a [routerLink]=\"['/explore',destination['slug']]\">Explore</a>\r\n                        </p>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </ng-container>\r\n    </div>\r\n</div>\r\n    \r\n\r\n    \r\n\r\n\r\n<div class=\"section text-center\">\r\n    <div class=\"container\">\r\n        <div class=\"row\">\r\n\r\n            <div  data-aos-duration=\"1200\" data-aos=\"fade-up\" data-aos-delay=\"300\" data-aos-easing=\"ease-out-bounce\" class=\"col-md-3\">\r\n                <h2 class=\"text-primary\"><strong>500K</strong></h2>\r\n                <p>Social Media Followers</p>\r\n            </div>\r\n    \r\n            <div  data-aos-duration=\"1200\" data-aos=\"fade-up\" data-aos-delay=\"500\" data-aos-easing=\"ease-out-bounce\" class=\"col-md-3\">\r\n                <h2 class=\"text-primary\"><strong>100+</strong></h2>\r\n                <p>Maldive Hotels</p>\r\n            </div>\r\n\r\n            <div  data-aos-duration=\"1200\" data-aos=\"fade-up\" data-aos-delay=\"700\" data-aos-easing=\"ease-out-bounce\" class=\"col-md-3\">\r\n                <h2 class=\"text-primary\"><strong>10K</strong></h2>\r\n                <p>Vacation Packages</p>\r\n            </div>\r\n\r\n            <div  data-aos-duration=\"1200\" data-aos=\"fade-up\" data-aos-delay=\"900\" data-aos-easing=\"ease-out-bounce\" class=\"col-md-3\">\r\n                <h2 class=\"text-primary\"><strong>100+</strong></h2>\r\n                <p>Destinations</p>\r\n            </div>\r\n                 \r\n         </div>\r\n    </div>\r\n</div>\r\n\r\n\r\n<!-- \r\n<div class=\"row\">\r\n    <div class=\"col-md-8  p-0\" style=\"height:500px;background-color:green;\">\r\n        <img class=\"img-responsive\" src=\"./assets/gal/about-img1.jpg\" alt=\"\">\r\n      <div class=\"row\" style=\"height:50%;background-color:red;\">\r\n        <div class=\"col-md-12  p-0\">\r\n            <img class=\"img-responsive\" src=\"./assets/gal/about-img1.jpg\" alt=\"\">\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-lg-6  p-0\">\r\n            <img class=\"img-responsive\" src=\"./assets/gal/about-img1.jpg\" alt=\"\">\r\n        </div>\r\n        <div class=\"col-lg-6  p-0\" >\r\n            <img class=\"img-responsive\" src=\"./assets/gal/about-img1.jpg\" alt=\"\">\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"col-md-4 p-0\" style=\"height:500px;background-color:black\">\r\n        <img class=\"img-responsive\" src=\"./assets/gal/about-img1.jpg\" alt=\"\">\r\n    </div>\r\n  </div> -->\r\n\r\n<div class=\"container-fluid\">\r\n    <!-- <div class=\"row\">\r\n        <div class=\"col-md-12 text-center\">\r\n            <h2 class=\"mb-4 pb-4 title-uppercase\"> Maldives Luxary Resorts</h2> \r\n        </div>\r\n    </div> -->\r\n    <div class=\"row\">\r\n    <ng-container *ngFor=\"let resort of resorts\" >\r\n    <div class=\"p-0 m-0 col-md-3 col-sm-12 col-xs-12\">\r\n        <div class=\"hovereffect\">\r\n            <a class=\"none\" [routerLink]=\"['/hotel',resort['slug']]\"> \r\n                <img class=\"img-responsive hotel-img\" src=\"{{apiUrl+resort['thumbnail']}}\" alt=\"\">\r\n            </a>\r\n\r\n            <div class=\"overlay\">\r\n                    <a class=\"none\" [routerLink]=\"['/hotel',resort['slug']]\"> \r\n                        <h2>{{resort['title']}}</h2>\r\n                    </a>\r\n                    <p>\r\n                        <a class=\"info\" [routerLink]=\"['/hotel',resort['slug']]\">{{resort['location']}}<br/>\r\n\r\n                        <!-- <ng-container *ngFor=\"let star of 5 |fill; let z = index;\">\r\n                            <img *ngIf=\"((star+1) <= (resort['starRating']))\" src=\"assets/images/star-on.png\" style=\"display:inline-block; margin:5px;\" />\r\n                            <img *ngIf=\"( (star+1) > (resort['starRating']))\" src=\"assets/images/star-off.png\" style=\"display:inline-block; margin:5px;\" />\r\n                        </ng-container> -->\r\n                        </a>\r\n                    </p>\r\n            </div>\r\n            <!-- <div class=\"overlay_\">\r\n                <h2>{{resort['title']}}</h2>\r\n\r\n                <a class=\"info\" [routerLink]=\"['/hotel',resort['slug']]\">{{resort['location']}}<br/>\r\n        \r\n                <ng-container *ngFor=\"let star of 5 |fill; let z = index;\">\r\n                    <img *ngIf=\"((star+1) <= (resort['starRating']))\" src=\"assets/images/star-on.png\" style=\"display:inline-block; margin:5px;\" />\r\n                    <img *ngIf=\"( (star+1) > (resort['starRating']))\" src=\"assets/images/star-off.png\" style=\"display:inline-block; margin:5px;\" />\r\n                </ng-container>\r\n                </a>\r\n            </div> -->\r\n        </div>\r\n    </div>\r\n</ng-container>\r\n   \r\n</div> \r\n\r\n</div>\r\n\r\n<div class=\"section\">            \r\n    <div class=\"container\">\r\n        <div data-aos-duration=\"1200\" data-aos=\"fade-up\" data-aos-delay=\"300\" data-aos-easing=\"ease-out-bounce\" class=\"row text-center\">\r\n            <div class=\"ml-auto mr-0 col-md-3\">\r\n                <img src=\"./assets/img/awards-1.png\" height=\"150\" width=\"250\"/> \r\n            </div>\r\n            <div class=\"ml-0 mr-0 col-md-3\">\r\n                <a title=\"See our certificate on Ma3roof\" data-placement=\"bottom\" href=\"https://maroof.sa/29935\" target=\"_blank\">\r\n                    <img class=\"img-awards\" src=\"./assets/img/awards-2.png\" height=\"150\" width=\"220\"/> \r\n                </a>\r\n            </div>\r\n            <div class=\"ml-0 mr-auto col-md-3\">\r\n                <img src=\"./assets/img/awards-3.png\" height=\"150\" width=\"250\"/> \r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "./src/app/home/home.component.ts":
/*!****************************************!*\
  !*** ./src/app/home/home.component.ts ***!
  \****************************************/
/*! exports provided: HomeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomeComponent", function() { return HomeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _api_page_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api/page.service */ "./src/app/api/page.service.ts");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ng-block-ui */ "./node_modules/ng-block-ui/index.js");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ng_block_ui__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/animations */ "./node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! aos */ "./node_modules/aos/dist/aos.js");
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(aos__WEBPACK_IMPORTED_MODULE_7__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};








var HomeComponent = /** @class */ (function () {
    function HomeComponent(page, title, meta, router) {
        this.page = page;
        this.title = title;
        this.meta = meta;
        this.router = router;
        ///
        this.urls = [
            './assets/gal/about-img1.jpg',
            './assets/gal/dest_ams.png',
            './assets/gal/about-img2.jpg',
            './assets/gal/dest_bal.png'
        ];
        this.bannerHeading = "Spend Quality Holidays With Us";
        this.bannerDescription = "We’re helping people to travel smart within their budget";
        this.bannerImg = "assets/images/banners/home-banner-1.jpg";
        this.bannerPageLink = "#";
        this.contentText = "";
        this.destinations = [];
        this.resorts = [];
        this.testimonials = [];
        this.apiUrl = "";
        this.bannerImages = [
            "assets/images/banners/home-banner-1.jpg",
            "assets/images/banners/home-banner-2.jpg"
        ];
        this.title.setTitle('Rawnaq Tourism - Plan Your Best Holidays Trip, Family and Honeymoon Tour Packages');
        this.meta.updateTag({ name: 'description', content: 'Make your Holiday Special with Rawnaq Tourism Book our Luxury travel Tour, Honeymoon Tour Package, Family and Couple Tour Package at best destination in the world.' });
    }
    Object.defineProperty(HomeComponent.prototype, "images", {
        get: function () {
            return this.urls.map(function (m) { return ({
                imageUrl: m
            }); });
        },
        enumerable: true,
        configurable: true
    });
    HomeComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        aos__WEBPACK_IMPORTED_MODULE_7___default.a.init({
                            once: true, disable: 'mobile'
                        });
                        this.apiUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].site_url;
                        this.bannerCarousel = {
                            grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
                            slide: 4,
                            speed: 2000,
                            interval: 8000,
                            point: {
                                visible: false
                            },
                            load: 2,
                            touch: false,
                            loop: true
                        };
                        this.testimonialCarousel = {
                            grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
                            slide: 1,
                            speed: 400,
                            interval: 4000,
                            point: {
                                visible: false
                            },
                            load: 2,
                            touch: true,
                            loop: true
                        };
                        this.destinationCarousel = {
                            grid: { xs: 1, sm: 1, md: 3, lg: 3, all: 0 },
                            slide: 1,
                            speed: 400,
                            interval: 4000,
                            point: {
                                visible: false
                            },
                            load: 2,
                            touch: true,
                            loop: true
                        };
                        this.resortCarousel = {
                            grid: { xs: 1, sm: 1, md: 3, lg: 3, all: 0 },
                            slide: 1,
                            speed: 400,
                            interval: 4000,
                            point: {
                                visible: false
                            },
                            load: 2,
                            touch: true,
                            loop: true
                        };
                        this.blockUI.start(""); // Start blocking
                        return [4 /*yield*/, this.page.getHomePage().then(function (res) {
                                console.log("Home Page: ", res);
                                if (res["success"]) {
                                    var page = res["response"];
                                    if (page["banner_heading"] !== "")
                                        _this.bannerHeading = page["banner_heading"];
                                    if (page["banner_description"] !== "")
                                        _this.bannerDescription = page["banner_description"];
                                    if (page["banner_img"] !== "")
                                        _this.bannerImg = _environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].site_url + page["banner_img"];
                                    if (page["banner_page_link"] !== "")
                                        _this.bannerPageLink = page["banner_page_link"];
                                    _this.contentText = page["content_text"];
                                    _this.blockUI.stop();
                                }
                            }, function (reject) {
                                console.log("error: ", reject);
                                _this.blockUI.stop();
                            })];
                    case 1:
                        _a.sent();
                        this.blockUI.start(""); // Start blocking
                        return [4 /*yield*/, this.page.getAllDestination(6, 1).then(function (res) {
                                console.log("All Destination: ", res);
                                if (res["success"]) {
                                    _this.destinations = res["response"];
                                    _this.blockUI.stop();
                                }
                            }, function (reject) {
                                console.log("error: ", reject);
                                _this.blockUI.stop();
                            })];
                    case 2:
                        _a.sent();
                        this.blockUI.start(""); // Start blocking
                        return [4 /*yield*/, this.page.getTopResorts(10).then(function (res) {
                                console.log("Top Resorts: ", res);
                                if (res["success"]) {
                                    _this.resorts = res["response"];
                                    _this.blockUI.stop();
                                }
                            }, function (reject) {
                                console.log("error: ", reject);
                                _this.blockUI.stop();
                            })];
                    case 3:
                        _a.sent();
                        this.blockUI.start(""); // Start blocking
                        return [4 /*yield*/, this.page.getTestimonials(5).then(function (res) {
                                console.log("All Testimonials: ", res);
                                if (res["success"]) {
                                    _this.testimonials = res["response"];
                                    _this.blockUI.stop();
                                }
                            }, function (reject) {
                                console.log("error: ", reject);
                                _this.blockUI.stop();
                            })];
                    case 4:
                        _a.sent();
                        // start the page from the top
                        this.router.events.subscribe(function (evt) {
                            if (!(evt instanceof _angular_router__WEBPACK_IMPORTED_MODULE_6__["NavigationEnd"])) {
                                return;
                            }
                            window.scrollTo(0, 0);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(ng_block_ui__WEBPACK_IMPORTED_MODULE_2__["BlockUI"])(),
        __metadata("design:type", Object)
    ], HomeComponent.prototype, "blockUI", void 0);
    HomeComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "app-home",
            template: __webpack_require__(/*! ./home.component.html */ "./src/app/home/home.component.html"),
            styles: [__webpack_require__(/*! ./home.component.css */ "./src/app/home/home.component.css")],
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_4__["trigger"])('fadeInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_4__["state"])('void', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_4__["style"])({
                        opacity: 0
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_4__["transition"])('void <=> *', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_4__["animate"])(1000)),
                ])
            ]
        }),
        __metadata("design:paramtypes", [_api_page_service__WEBPACK_IMPORTED_MODULE_1__["PageService"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__["Title"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__["Meta"],
            _angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"]])
    ], HomeComponent);
    return HomeComponent;
}());



/***/ }),

/***/ "./src/app/hotel/hotel.component.css":
/*!*******************************************!*\
  !*** ./src/app/hotel/hotel.component.css ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/hotel/hotel.component.html":
/*!********************************************!*\
  !*** ./src/app/hotel/hotel.component.html ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<block-ui>\r\n\r\n  <div class=\"wrapper\">\r\n    <div  data-aos-duration=\"1200\" data-aos=\"fade\" class=\"page-header background  page-header-sm\" data-parallax=\"true\" style=\"background-image: url('./assets/img/Explore_Maldives.jpg');\">\r\n      <div class=\"filter\"></div>\r\n      <div class=\"container mt-4 pt-4 \">\r\n        <!-- <div class=\"ml-4 pl-4 mt-4 pt-4 motto text-left\">\r\n                  <h3 class=\"title-uppercase py-4 mt-4\">Welcome to Maldives</h3>\r\n                  <p class=\"description text-white\">Incredibly indulgent luxury. Private villas, private beaches. \r\n                    <br> Spas, food, boat rides, sunsets. Relaxing, colorful, a disconnection like no other.</p>\r\n              </div> -->\r\n      </div>\r\n    </div>\r\n    <div class=\"section destination-section\">\r\n      <div class=\"container\">\r\n        <div class=\"owner\">\r\n          <div class=\"avatar\">\r\n\r\n            <!-- <div class=\"hotel-logo\">\r\n                            <figure> -->\r\n            <!-- <img  alt=\"Circle Image\"  *ngIf=\"!logo || logo ==='' \" src=\"assets/images/hotel-logo-1.jpg\" alt=\"{{title}}\" class=\"m-auto\"> -->\r\n            <img class=\"img-circle img-no-padding img-responsive\" *ngIf=\"logo !==''\" src=\"{{apiUrl}}{{logo}}\" alt=\"{{title}}\">\r\n            <!-- </figure>\r\n                          </div> -->\r\n            <!-- <img src=\"./assets/img/faces/joe-gardner-2.jpg\" alt=\"Circle Image\" class=\"img-circle img-no-padding img-responsive\"> -->\r\n          </div>\r\n          <div class=\"name\">\r\n            <h3 class=\"title\">{{title}}<br /></h3>\r\n            <ng-container *ngFor=\"let star of 5 |fill; let z = index;\">\r\n              <img *ngIf=\"((star+1) <= (starRating))\" src=\"assets/images/star-on.png\" style=\"display:inline-block; margin:5px;\" />\r\n              <img *ngIf=\"( (star+1) > (starRating))\" src=\"assets/images/star-off.png\" style=\"display:inline-block; margin:5px;\" />\r\n            </ng-container>\r\n            <h5 class=\"description\">{{address}}</h5>\r\n\r\n          </div>\r\n        </div>\r\n        <div class=\"pt-4 mt-4 row\">\r\n          <div class=\"col-md-10 ml-auto mr-auto text-justify\">\r\n            <small>\r\n              <p class=\"description\">Distance from Airport: <strong>{{ distance }}Km</strong></p>\r\n              <p class=\"description\">Number of Rooms: <strong>{{ no_of_rooms }}</strong></p>\r\n              <p class=\"description\">Travel to Destination: <strong>{{ travel }}</strong></p>\r\n              <p class=\"description\">Recommended for: <strong>{{ recommended_for }}</strong></p>\r\n            </small>\r\n            <!-- <p>An artist of considerable range, Jane Faker — the name taken by Melbourne-raised, Brooklyn-based Nick Murphy — writes, performs and records all of his own music, giving it a warm, intimate feel with a solid groove structure. </p> -->\r\n            <br />\r\n            <a href=\"#\" (click)=\"showQuoteForm(hotelId, title, rooms, 0, $event)\" class=\"btn btn-primary btn-round\">Request\r\n              Quote</a>  \r\n              <a  [routerLink]=\"['/explore/maldives']\" class=\"my-4 btn btn-defult btn-round\">Back</a>\r\n            <br /> <br />\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"pt-4 mt-4 container\">\r\n        <div class=\"row\">\r\n          <div class=\"col-md-10 mb-4 pb-4 ml-auto mr-auto\">\r\n\r\n\r\n            <div *ngIf=\"hotelGalleryImages && hotelGalleryImages.length > 0\">\r\n              <ngx-gallery [options]=\"hotelGalleryOptions\" [images]=\"hotelGalleryImages\"></ngx-gallery>\r\n            </div>\r\n\r\n            \r\n          </div>\r\n        </div>\r\n        <!--End of the row-->\r\n        <div class=\"row mtpx-40 brd-btm\" [hidden]=\"contentHeadings.length == 0\">\r\n          <div class=\"col-md-10 ml-auto mr-auto\">\r\n            <div class=\"nav-tabs-navigation\">\r\n              <div class=\"nav-tabs-wrapper\">\r\n                <ngb-tabset [justify]=\"'center'\">\r\n                  <div *ngFor=\"let heading of contentHeadings; let rIndex=index;\"> {{ heading }}\r\n                    <ngb-tab [title]=\"heading\">\r\n                      <ng-template ngbTabContent>\r\n                        <p class=\"text-justify description\" [innerHtml]=\"contentDescriptions[rIndex]\"></p>\r\n                      </ng-template>\r\n                    </ngb-tab>\r\n                  </div>\r\n                </ngb-tabset>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        \r\n        <!--End of the row-->\r\n        <div class=\"row\">\r\n          <div class=\"col-md-10 mb-2 pb-2 ml-auto mr-auto\">\r\n\r\n            <h3 class=\" text-center title-uppercase pb-2 mb-2\">Room Options</h3>\r\n            <ngb-accordion  [closeOthers]=\"true\"  class=\"nav-accordion-primary\">\r\n              <h3 [hidden]=\"rooms.length > 0\">No Room Option on this Hotel</h3>\r\n              <div class=\"hotel-room-block\" [class.brd-btm]=\"rIndex + 1 != rooms.length\" *ngFor=\"let room of rooms; let\r\n                              rIndex=index;\">\r\n                <ngb-panel [title]=\"room['title']\">\r\n                  <ng-template ngbPanelContent>\r\n                    <div class=\"row\">\r\n                      <div class=\"box --hotel-room-box col-md-6\">\r\n\r\n\r\n                        <div *ngIf=\"galleryImages[room['id']] && galleryImages[room['id']].length > 0\">\r\n                          <ngx-gallery [options]=\"galleryOptions\" [images]=\"galleryImages[room['id']]\"></ngx-gallery>\r\n                        </div> \r\n\r\n                        <!-- <div id=\"hotel_image\" *ngIf=\" !(galleryImages[room['id']] && galleryImages[room['id']].length > 0) && room['thumbnail'] != ''\">\r\n                          <img src=\"{{apiUrl}}{{room['thumbnail']}}\" style=\"width: 100%\" />\r\n                        </div> -->\r\n                      </div>\r\n\r\n                      <div class=\"box --hotel-room-box col-md-6 text-left\">\r\n                        <h5 class=\"title-uppercase mtpx-0 d-inline-block\">{{room['title']}} </h5>\r\n                        <p class=\"text-justify mtpx-10 description\" [innerHTML]=\"room['content']\"></p>\r\n\r\n                        <div class=\"row\" *ngFor=\"let service of Object.keys(room['services'])\">\r\n                          <div class=\"col-md-12 text-left mtpx-10\">\r\n                            <h6 class=\"title-uppercase\">{{service}}</h6>\r\n                            <div class=\"row\">\r\n                              <div class=\"description col-lg-6\" *ngFor=\"let s of room['services'][service];\">\r\n                                {{s['roomServiceTitle']}}\r\n                              </div>\r\n                            </div>\r\n                          </div>\r\n                        </div>\r\n                        <a href=\"#\" (click)=\"showQuoteForm(hotelId, title, rooms, room['id'], $event)\" class=\"my-4 btn btn-primary btn-round\">Request\r\n                          Quote</a>\r\n                      </div>\r\n\r\n                    </div>\r\n                  </ng-template>\r\n                </ngb-panel>\r\n              </div>\r\n            </ngb-accordion>\r\n\r\n          </div>\r\n        </div>\r\n        <!--End of the row-->\r\n      </div>\r\n      <!--End of the container-->\r\n    </div>\r\n  </div>\r\n\r\n  <!-- <section class=\"hero-banner --destinations\" [ngStyle]=\"{'background-image': 'url('+bannerImg+')'}\">\r\n  </section>\r\n  <section class=\"destination-section --hotels\">\r\n    <div class=\"container\">\r\n      <div class=\"hotel-logo\">\r\n        <figure>\r\n          <img *ngIf=\"!logo || logo ==='' \" src=\"assets/images/hotel-logo-1.jpg\" alt=\"{{title}}\" class=\"m-auto\">\r\n          <img *ngIf=\"logo !==''\" src=\"{{apiUrl}}{{logo}}\" alt=\"{{title}}\" class=\"m-auto\">\r\n        </figure>\r\n      </div>\r\n\r\n      <div class=\"hotel-description\">\r\n        <div class=\"row\">\r\n          <div class=\"col-md-9\">\r\n            <h2 class=\"title mtpx-0\">{{title}}</h2>\r\n          </div>\r\n          <div class=\"col-md-3\">\r\n            <a href=\"#\" (click)=\"showQuoteForm(hotelId, title, rooms, 0, $event)\" class=\"btn --btn-primary float-md-right fw-bold\">Request\r\n              Quote</a>\r\n          </div>\r\n        </div>\r\n        <ng-container *ngFor=\"let star of 5 |fill; let z = index;\">\r\n          <img *ngIf=\"((star+1) <= (starRating))\" src=\"assets/images/star-on.png\" style=\"display:inline-block; margin:5px;\" />\r\n          <img *ngIf=\"( (star+1) > (starRating))\" src=\"assets/images/star-off.png\" style=\"display:inline-block; margin:5px;\" />\r\n        </ng-container>\r\n        <h5 class=\"address\">{{address}}</h5>\r\n        <p class=\"detail\">Distance from Airport: <strong>{{ distance }}Km</strong></p>\r\n        <p class=\"detail\">Number of Rooms: <strong>{{ no_of_rooms }}</strong></p>\r\n        <p class=\"detail\">Travel to Destination: <strong>{{ travel }}</strong></p>\r\n        <p class=\"detail\">Recommended for: <strong>{{ recommended_for }}</strong></p>\r\n\r\n        <div class=\"row\">\r\n          <div class=\"col-md-8 offset-md-2 mtpx-40 mbpx-40\">\r\n            <div *ngIf=\"hotelGalleryImages && hotelGalleryImages.length > 0\">\r\n              <ngx-gallery [options]=\"hotelGalleryOptions\" [images]=\"hotelGalleryImages\"></ngx-gallery>\r\n            </div>\r\n          </div>\r\n        </div>\r\n\r\n        <p class=\"detail\" [innerHTML]=\"contentText\"></p>\r\n\r\n\r\n        <!--div class=\"hotel-price\">From\r\n              <strong>{{price}}</strong>\r\n            </div-->\r\n  <!-- </div>\r\n    </div>\r\n  </section> -->\r\n\r\n  <!-- <section class=\"hotel-services page-border\" *ngIf=\"false && galleries.length > 0\">\r\n    <div class=\"container\">\r\n      <div class=\"titlesection\">\r\n        <h2 class=\"maintitle tt-uppercase\">Gallery</h2>\r\n      </div>\r\n\r\n      <div class=\"row\">\r\n        <ngu-carousel [inputs]=\"destinationCarousel\" *ngIf=\"galleries.length>0\">\r\n          <ngu-item NguCarouselItem *ngFor=\"let gallery of galleries\" class=\"item\">\r\n            <div class=\"inner-box\">\r\n              <figure>\r\n                <img *ngIf=\"gallery['hotelGalleryImg'] !==''\" src=\"{{apiUrl}}{{gallery['hotelGalleryImg']}}\" alt=\"{{destination['title']}}\">\r\n              </figure>\r\n            </div>\r\n          </ngu-item>\r\n          <button NguCarouselPrev class='leftRs  fa fa-arrow-circle-left'></button>\r\n          <button NguCarouselNext class='rightRs fa fa-arrow-circle-right'></button>\r\n        </ngu-carousel>\r\n      </div>\r\n    </div>\r\n  </section> -->\r\n\r\n  <!-- <section class=\"hotel-room-options page-border\">\r\n    <div class=\"container\">\r\n      <div class=\"titlesection mbpx-20\">\r\n        <h2 class=\"maintitle tt-uppercase\">Room\r\n          <br> Options</h2>\r\n      </div>\r\n      <h3 [hidden]=\"rooms.length > 0\">No Room Option on this Hotel</h3>\r\n      <div class=\"hotel-room-block\" [class.brd-btm]=\"rIndex + 1 != rooms.length\" *ngFor=\"let room of rooms; let\r\n        rIndex=index;\">\r\n        <div class=\"row\">\r\n          <div class=\"box --hotel-room-box col-md-6\"> -->\r\n  <!--figure>\r\n              <img *ngIf=\"!room['thumbnail'] || room['thumbnail'] ==='' \" src=\"assets/images/sunset.jpg\" alt=\"{{room['title']}}\">\r\n              <img *ngIf=\"room['thumbnail'] !==''\" src=\"{{apiUrl}}{{room['thumbnail']}}\" alt=\"{{room['title']}}\">\r\n            </figure-->\r\n  <!-- <div *ngIf=\"galleryImages[room['id']] && galleryImages[room['id']].length > 0\">\r\n              <ngx-gallery [options]=\"galleryOptions\" [images]=\"galleryImages[room['id']]\"></ngx-gallery>\r\n            </div>\r\n\r\n            <div id=\"hotel_image\" *ngIf=\" !(galleryImages[room['id']] && galleryImages[room['id']].length > 0) && room['thumbnail'] != ''\">\r\n              <img src=\"{{apiUrl}}{{room['thumbnail']}}\" style=\"width: 100%\" />\r\n            </div> -->\r\n  <!--ng-container *ngIf=\"room.galleries && room.galleries.length > 0\">\r\n            <div class=\"mini-image\" *ngFor=\"let room_gallery of room['galleries']; let rgIndex=index;\">\r\n              <img src=\"{{apiUrl}}{{room_gallery['roomGalleryImg']}}\" (click)=\"change_thumbnail(room, room_gallery['roomGalleryImg'])\"\r\n                title=\"{{room_gallery['roomGalleryDescription']}}\">\r\n            </div>\r\n            </ng-container-->\r\n  <!-- </div>\r\n          <div class=\"box --hotel-room-box col-md-6 text-left\">\r\n            <h4 class=\"title mtpx-0 d-inline-block\">{{room['title']}} </h4>\r\n            <p class=\"text-justify mtpx-10\" [innerHTML]=\"room['content']\"></p>\r\n            <div class=\"row\" *ngFor=\"let service of Object.keys(room['services'])\">\r\n              <div class=\"col-md-12 text-left mtpx-10\">\r\n                <b>{{service}}</b>\r\n                <div class=\"row\">\r\n                  <div class=\"col-lg-6\" *ngFor=\"let s of room['services'][service];\">\r\n                    {{s['roomServiceTitle']}}\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n            <a href=\"#\" (click)=\"showQuoteForm(hotelId, title, rooms, room['id'], $event)\" class=\"d-block mtpx-20 btn request-btn-small --btn-primary fw-bold\">Request\r\n              Quote</a>\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n    </div>\r\n  </section>\r\n\r\n  <section class=\"hotel-services page-border\" *ngIf=\"Object.keys(services).length > 0\">\r\n    <div class=\"container\">\r\n      <div class=\"titlesection\">\r\n        <h2 class=\"maintitle tt-uppercase\">Services & Amenities</h2>\r\n      </div> -->\r\n  <!--h3 [hidden]=\"services.length>0\">No Service Option on this Hotel</h3-->\r\n  <!-- <div class=\"row\" *ngFor=\"let service of Object.keys(services)\">\r\n        <div class=\"col-md-3\">\r\n          <div class=\"box --hotel-service-box\">\r\n            <h3 class=\"title\">{{service}}</h3>\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"col-md-8 offset-md-1\">\r\n          <div class=\"box --hotel-service-box\">\r\n            <ng-container *ngFor=\"let s of services[service];\">\r\n              <h4 class=\"subtitle\">{{s['hotelServiceTitle']}}</h4>\r\n\r\n              <div class=\"row\">\r\n                <div class=\"col-md-6\">\r\n                  <p class=\"detail\" [innerHTML]=\"s['hotelServiceDescription']\"></p>\r\n                </div>\r\n              </div>\r\n            </ng-container>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </section> -->\r\n</block-ui>\r\n\r\n<app-room #roomModal></app-room>\r\n<app-quote-form #quoteModal></app-quote-form>\r\n"

/***/ }),

/***/ "./src/app/hotel/hotel.component.ts":
/*!******************************************!*\
  !*** ./src/app/hotel/hotel.component.ts ***!
  \******************************************/
/*! exports provided: HotelComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HotelComponent", function() { return HotelComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _api_page_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../api/page.service */ "./src/app/api/page.service.ts");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ng-block-ui */ "./node_modules/ng-block-ui/index.js");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ng_block_ui__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _room_room_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../room/room.component */ "./src/app/room/room.component.ts");
/* harmony import */ var _quote_form_quote_form_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../quote-form/quote-form.component */ "./src/app/quote-form/quote-form.component.ts");
/* harmony import */ var ngx_gallery__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-gallery */ "./node_modules/ngx-gallery/bundles/ngx-gallery.umd.js");
/* harmony import */ var ngx_gallery__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(ngx_gallery__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! hammerjs */ "./node_modules/hammerjs/hammer.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var cheerio__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! cheerio */ "./node_modules/cheerio/index.js");
/* harmony import */ var cheerio__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(cheerio__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! aos */ "./node_modules/aos/dist/aos.js");
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(aos__WEBPACK_IMPORTED_MODULE_10__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var HotelComponent = /** @class */ (function () {
    function HotelComponent(router, activatedRoute, page) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.page = page;
        // bannerImg = "assets/images/banner.jpg";
        this.bannerImages = [
            "assets/images/banners/maldives-banner-1.jpg",
            "assets/images/banners/maldives-banner-2.jpg",
            "assets/images/banners/maldives-banner-3.jpg",
            "assets/images/banners/maldives-banner-4.jpg"
        ];
        this.bannerImg = this.bannerImages[Math.floor(Math.random() * this.bannerImages.length)];
        this.logo = "assets/images/hotel-logo-1.jpg";
        this.title = "Hotel";
        this.hotelId = 0;
        this.contentText = "";
        this.contentHeadings = [];
        this.contentDescriptions = [];
        this.address = "";
        this.starRating = "0";
        this.distance = "0";
        this.no_of_rooms = "0";
        this.travel = "";
        this.recommended_for = "";
        this.destination = "";
        this.price = "";
        this.rooms = [];
        this.services = [];
        this.galleries = [];
        this.currentUrl = "";
        this.Object = Object;
        this.apiUrl = "";
        this.slug = "";
    }
    HotelComponent.prototype.ngOnInit = function () {
        var _this = this;
        aos__WEBPACK_IMPORTED_MODULE_10___default.a.init({
            once: true, disable: 'mobile'
        });
        // start the page from the top
        this.router.events.subscribe(function (evt) {
            if (!(evt instanceof _angular_router__WEBPACK_IMPORTED_MODULE_1__["NavigationEnd"])) {
                return;
            }
            window.scrollTo(0, 0);
        });
        this.apiUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].site_url;
        this.blockUI.start("");
        this.currentUrl = this.router.url;
        this.galleryOptions = [
            {
                width: "100%",
                // height: "400px",
                thumbnailsColumns: 4,
                imageAnimation: ngx_gallery__WEBPACK_IMPORTED_MODULE_7__["NgxGalleryAnimation"].Slide,
                preview: false,
                imageInfinityMove: true,
                previewZoom: true,
                imageArrowsAutoHide: true,
                thumbnailsArrowsAutoHide: true
            }
            // max-width 800
            // {
            //   breakpoint: 800,
            //   width: "100%",
            //   height: "600px",
            //   imagePercent: 80,
            //   thumbnailsPercent: 20,
            //   thumbnailsMargin: 20,
            //   thumbnailMargin: 20
            // },
            // // max-width 400
            // {
            //   breakpoint: 400,
            //   preview: false
            // }
        ];
        this.hotelGalleryOptions = [
            {
                width: "100%",
                height: "600px",
                thumbnailsColumns: 6,
                imageAnimation: ngx_gallery__WEBPACK_IMPORTED_MODULE_7__["NgxGalleryAnimation"].Slide,
                //previewForceFullscreen: true,
                previewCloseOnClick: true,
                //preview: false,
                imageInfinityMove: true,
                imageArrowsAutoHide: true,
                thumbnailsArrowsAutoHide: true
            }
            // max-width 800
            // {
            //   breakpoint: 1200,
            //   thumbnailsPercent: 20,
            //   thumbnailsColumns: 5
            // },
            // {
            //   breakpoint: 991,
            //   width: "100%",
            //   height: "600px",
            //   //imagePercent: 80,
            //   thumbnailsPercent: 20,
            //   //thumbnailsMargin: 20,
            //   //thumbnailMargin: 20,
            //   thumbnailsColumns: 4
            // },
            // max-width 400
            // {
            //   breakpoint: 400,
            //   preview: false
            // }
        ];
        this.destinationCarousel = {
            grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
            slide: 1,
            speed: 400,
            interval: 4000,
            point: {
                visible: false
            },
            load: 1,
            touch: true,
            loop: true
        };
        this.activatedRoute.params.subscribe(function (params) {
            _this.slug = params["slug"];
            if (typeof _this.slug == "undefined") {
                _this.slug = _this.currentUrl.substring(_this.currentUrl.lastIndexOf("/") + 1, _this.currentUrl.length);
            }
        });
        console.log("Current Slug : ", this.slug);
        console.log("SAAD");
        if (!this.slug)
            return false;
        this.page.getHotel(this.slug).then(function (res) {
            if (res["success"]) {
                var pageData = res["response"];
                _this.rooms = pageData["rooms"];
                _this.services = pageData["services"];
                _this.galleries = pageData["galleries"];
                _this.title = pageData["title"];
                _this.hotelId = pageData["id"];
                if (pageData["banner"]) {
                    _this.bannerImg = _this.apiUrl + pageData["banner"];
                }
                _this.logo = pageData["logo"];
                _this.contentText = pageData["content"];
                _this.contentHeadings = [];
                var Cheerio = cheerio__WEBPACK_IMPORTED_MODULE_9__["load"](_this.contentText);
                var contentHeadings = [];
                Cheerio("h3.title").each(function () {
                    contentHeadings.push(Cheerio(this).html());
                });
                _this.contentHeadings = contentHeadings;
                var contentDescriptions = [];
                Cheerio("p.detail").each(function () {
                    contentDescriptions.push(Cheerio(this).html());
                });
                _this.contentDescriptions = contentDescriptions;
                // console.log(this.contentHeadings);
                // console.log(this.contentDescriptions);
                _this.address = pageData["address"];
                _this.starRating = pageData["starRating"];
                _this.destination = pageData["destinationTitle"];
                _this.price = pageData["price"];
                _this.distance = pageData["distance"];
                _this.no_of_rooms = pageData["no_of_rooms"];
                _this.travel = pageData["travel"];
                _this.recommended_for = pageData["recommended_for"];
                var roomGallery = [];
                var hotelGalleryImages = [];
                if (_this.rooms.length > 0) {
                    _this.rooms.forEach(function (room) {
                        if (room.galleries && room.galleries.length > 0) {
                            // Clear Array
                            var gallery = [];
                            room.galleries.forEach(function (room_gallery) {
                                gallery.push({
                                    small: _this.apiUrl + room_gallery["roomGalleryImg"],
                                    medium: _this.apiUrl + room_gallery["roomGalleryImg"],
                                    big: _this.apiUrl + room_gallery["roomGalleryImg"]
                                });
                                // this.galleryImages.push({
                                //   small: this.apiUrl + room_gallery["roomGalleryImg"],
                                //   medium: this.apiUrl + room_gallery["roomGalleryImg"],
                                //   big: this.apiUrl + room_gallery["roomGalleryImg"]
                                // });
                            });
                            roomGallery[room.id] = gallery;
                            hotelGalleryImages = hotelGalleryImages.concat(gallery);
                        }
                    });
                }
                // console.log(roomGallery);
                _this.galleryImages = roomGallery;
                _this.hotelGalleryImages = hotelGalleryImages;
                console.log("Gallery Images: ");
                console.log(_this.galleryImages);
                _this.blockUI.stop();
            }
        }, function (reject) {
            console.log("error: ", reject);
            _this.blockUI.stop();
        });
    };
    HotelComponent.prototype.change_thumbnail = function (room, img) {
        room.thumbnail = img;
    };
    HotelComponent.prototype.showQuoteForm = function (hotelId, title, rooms, roomId, $event) {
        $event.preventDefault();
        this.quoteModal.show(hotelId, title, rooms, roomId);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_room_room_component__WEBPACK_IMPORTED_MODULE_5__["RoomComponent"]),
        __metadata("design:type", _room_room_component__WEBPACK_IMPORTED_MODULE_5__["RoomComponent"])
    ], HotelComponent.prototype, "roomModal", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_quote_form_quote_form_component__WEBPACK_IMPORTED_MODULE_6__["QuoteFormComponent"]),
        __metadata("design:type", _quote_form_quote_form_component__WEBPACK_IMPORTED_MODULE_6__["QuoteFormComponent"])
    ], HotelComponent.prototype, "quoteModal", void 0);
    __decorate([
        Object(ng_block_ui__WEBPACK_IMPORTED_MODULE_3__["BlockUI"])(),
        __metadata("design:type", Object)
    ], HotelComponent.prototype, "blockUI", void 0);
    HotelComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "app-hotel",
            template: __webpack_require__(/*! ./hotel.component.html */ "./src/app/hotel/hotel.component.html"),
            styles: [__webpack_require__(/*! ./hotel.component.css */ "./src/app/hotel/hotel.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _api_page_service__WEBPACK_IMPORTED_MODULE_2__["PageService"]])
    ], HotelComponent);
    return HotelComponent;
}());



/***/ }),

/***/ "./src/app/how-we-work/how-we-work.component.css":
/*!*******************************************************!*\
  !*** ./src/app/how-we-work/how-we-work.component.css ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/how-we-work/how-we-work.component.html":
/*!********************************************************!*\
  !*** ./src/app/how-we-work/how-we-work.component.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<block-ui>\r\n    <div class=\"wrapper\">\r\n        <div data-aos-duration=\"1200\" data-aos=\"fade\" class=\"page-header background  page-header-sm\" data-parallax=\"true\" style=\"background-image: url('./assets/img/how_we_work.jpeg');\">\r\n            <div class=\"filter\"></div>\r\n            <div class=\"container mt-4 pt-4 \">\r\n                <div class=\"mt-4 pt-4 motto text-left\">\r\n                    <h3 class=\"title-uppercase py-4 mt-4\">how we work</h3>\r\n                    <p class=\"description text-white\">Easy steps to travel your dream destination.</p>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"section sm profile-content\">\r\n            <div class=\"container\">\r\n                <div class=\"sub-page-content\">\r\n                    <div class=\"row\">\r\n                        <div data-aos-duration=\"1200\" data-aos=\"fade\" data-aos-delay=\"300\" data-aos-easing=\"ease-out-bounce\"  class=\"mx-4 col-md-12\" style=\"background-image: url('./assets/img/how-we-work.png'); background-size: 100%;\r\n                        background-position: center center; background-repeat: no-repeat; \">\r\n                            <br/><br/>\r\n                            <br/><br/>\r\n                            <br/><br/>\r\n                            <br/><br/>\r\n                            <br/><br/>\r\n                            <br/><br/>\r\n                            <br/><br/>\r\n                            <br/><br/>\r\n                            <br/><br/>\r\n                            <br/><br/>\r\n                            <br/><br/>\r\n                            <br/><br/>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    \r\n</block-ui>"

/***/ }),

/***/ "./src/app/how-we-work/how-we-work.component.ts":
/*!******************************************************!*\
  !*** ./src/app/how-we-work/how-we-work.component.ts ***!
  \******************************************************/
/*! exports provided: HowWeWorkComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HowWeWorkComponent", function() { return HowWeWorkComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/animations */ "./node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! aos */ "./node_modules/aos/dist/aos.js");
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(aos__WEBPACK_IMPORTED_MODULE_4__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var HowWeWorkComponent = /** @class */ (function () {
    function HowWeWorkComponent(title, router) {
        this.title = title;
        this.router = router;
        this.title.setTitle('RAWNAQ Tourism | How We Work');
    }
    HowWeWorkComponent.prototype.ngOnInit = function () {
        aos__WEBPACK_IMPORTED_MODULE_4___default.a.init({
            once: true, disable: 'mobile'
        });
        // start the page from the top
        this.router.events.subscribe(function (evt) {
            if (!(evt instanceof _angular_router__WEBPACK_IMPORTED_MODULE_3__["NavigationEnd"])) {
                return;
            }
            window.scrollTo(0, 0);
        });
    };
    HowWeWorkComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "app-how-we-work",
            template: __webpack_require__(/*! ./how-we-work.component.html */ "./src/app/how-we-work/how-we-work.component.html"),
            styles: [__webpack_require__(/*! ./how-we-work.component.css */ "./src/app/how-we-work/how-we-work.component.css")],
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["trigger"])('fadeInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["state"])('void', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["style"])({
                        opacity: 0
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["transition"])('void <=> *', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["animate"])(1000)),
                ])
            ]
        }),
        __metadata("design:paramtypes", [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Title"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]])
    ], HowWeWorkComponent);
    return HowWeWorkComponent;
}());



/***/ }),

/***/ "./src/app/injector/dom.injector.ts":
/*!******************************************!*\
  !*** ./src/app/injector/dom.injector.ts ***!
  \******************************************/
/*! exports provided: DomInjector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DomInjector", function() { return DomInjector; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DomInjector = /** @class */ (function () {
    function DomInjector(componentFactoryResolver, appRef, injector) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.appRef = appRef;
        this.injector = injector;
    }
    DomInjector.prototype.appendComponentToBody = function (component) {
        var _this = this;
        // 1. Create a component reference from the component 
        var componentRef = this.componentFactoryResolver
            .resolveComponentFactory(component)
            .create(this.injector);
        // 2. Attach component to the appRef so that it's inside the ng component tree
        this.appRef.attachView(componentRef.hostView);
        // 3. Get DOM element from component
        var domElem = componentRef.hostView
            .rootNodes[0];
        // 4. Append DOM element to the body
        document.body.appendChild(domElem);
        // 5. Wait some time and remove it from the component tree and from the DOM
        setTimeout(function () {
            _this.appRef.detachView(componentRef.hostView);
            componentRef.destroy();
        }, 3000);
    };
    DomInjector = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ApplicationRef"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"]])
    ], DomInjector);
    return DomInjector;
}());

//this.domService.appendComponentToBody(MyComponent);


/***/ }),

/***/ "./src/app/injector/injector.module.ts":
/*!*********************************************!*\
  !*** ./src/app/injector/injector.module.ts ***!
  \*********************************************/
/*! exports provided: InjectorModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InjectorModule", function() { return InjectorModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _url_injector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./url.injector */ "./src/app/injector/url.injector.ts");
/* harmony import */ var _dom_injector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dom.injector */ "./src/app/injector/dom.injector.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var InjectorModule = /** @class */ (function () {
    function InjectorModule() {
    }
    InjectorModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"]],
            declarations: [],
            providers: [
                _url_injector__WEBPACK_IMPORTED_MODULE_2__["UrlInjector"],
                _dom_injector__WEBPACK_IMPORTED_MODULE_3__["DomInjector"]
            ]
        })
    ], InjectorModule);
    return InjectorModule;
}());



/***/ }),

/***/ "./src/app/injector/url.injector.ts":
/*!******************************************!*\
  !*** ./src/app/injector/url.injector.ts ***!
  \******************************************/
/*! exports provided: UrlInjector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UrlInjector", function() { return UrlInjector; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var UrlInjector = /** @class */ (function () {
    function UrlInjector() {
    }
    UrlInjector.prototype.getParmas = function () {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        var query_string = {};
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            var key = decodeURIComponent(pair[0]);
            var value = decodeURIComponent(pair[1]);
            // If first entry with this name
            if (typeof query_string[key] === 'undefined') {
                query_string[key] = decodeURIComponent(value);
                // If second entry with this name
            }
            else if (typeof query_string[key] === 'string') {
                var arr = [query_string[key], decodeURIComponent(value)];
                query_string[key] = arr;
                // If third or later entry with this name
            }
            else {
                query_string[key].push(decodeURIComponent(value));
            }
        }
        return query_string;
    };
    UrlInjector.prototype.getCurrentPage = function (routes) {
        var vars = routes.split('?');
        return vars[0];
    };
    UrlInjector = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], UrlInjector);
    return UrlInjector;
}());



/***/ }),

/***/ "./src/app/login/login.component.css":
/*!*******************************************!*\
  !*** ./src/app/login/login.component.css ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".login-section{\r\n    background-color: #e9ecef;\r\n}\r\n\r\nform input[type=text], form input[type=number], form input[type=email], form input[type=password]{\r\n    background: #efefef;\r\n    color:#333;\r\n}\r\n\r\nform{\r\n    margin: 10px 0;\r\n}\r\n\r\n.form-group{\r\n    padding: 10px 0;\r\n}"

/***/ }),

/***/ "./src/app/login/login.component.html":
/*!********************************************!*\
  !*** ./src/app/login/login.component.html ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<block-ui>\r\n\r\n  <div class=\"section-login\">\r\n    <div class=\"container mtpx-50\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-2 offset-md-5 text-center\">\r\n          <a [routerLink]=\"['/']\" class=\"header-logo d-inline-block\">\r\n            <img src=\"http://www.rawnaqtourism.com/uploads/2018/07/header-logo.png\" alt=\"*\" />\r\n          </a>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-md-4 offset-md-4 login-box\">\r\n          <!-- <h3 class=\"text-center\">Dashboard Login</h3> -->\r\n          <form [formGroup]=\"loginForm\" (ngSubmit)=\"onSubmit()\">\r\n            <div class=\"form-group\">\r\n              <label for=\"username\">Username</label>\r\n              <input type=\"text\" formControlName=\"username\" class=\"form-control\" [ngClass]=\"{ 'is-invalid': submitted && f.username.errors }\"\r\n              />\r\n              <div *ngIf=\"submitted && f.username.errors\" class=\"invalid-feedback\">\r\n                <div *ngIf=\"f.username.errors.required\">Username is required</div>\r\n              </div>\r\n            </div>\r\n            <div class=\"form-group\">\r\n              <label for=\"password\">Password</label>\r\n              <input type=\"password\" formControlName=\"password\" class=\"form-control\" [ngClass]=\"{ 'is-invalid': submitted && f.password.errors }\"\r\n              />\r\n              <div *ngIf=\"submitted && f.password.errors\" class=\"invalid-feedback\">\r\n                <div *ngIf=\"f.password.errors.required\">Password is required</div>\r\n              </div>\r\n            </div>\r\n            <div class=\"form-group\" style=\"text-align: center\">\r\n              <button [disabled]=\"loading\" class=\"btn --btn-primary\">Login</button>\r\n              <img *ngIf=\"loading\" src=\"data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==\"\r\n              />\r\n            </div>\r\n          </form>\r\n        </div>\r\n\r\n      </div>\r\n    </div>\r\n  </div>\r\n</block-ui>\r\n"

/***/ }),

/***/ "./src/app/login/login.component.ts":
/*!******************************************!*\
  !*** ./src/app/login/login.component.ts ***!
  \******************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _api_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../api/auth.service */ "./src/app/api/auth.service.ts");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ng-block-ui */ "./node_modules/ng-block-ui/index.js");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ng_block_ui__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};






var LoginComponent = /** @class */ (function () {
    function LoginComponent(auth, formBuilder, route, router) {
        this.auth = auth;
        this.formBuilder = formBuilder;
        this.route = route;
        this.router = router;
        this.loading = false;
        this.submitted = false;
        this.apiUrl = "";
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.apiUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].site_url;
        this.loginForm = this.formBuilder.group({
            username: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required],
            password: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]
        });
    };
    Object.defineProperty(LoginComponent.prototype, "f", {
        // convenience getter for easy access to form fields
        get: function () { return this.loginForm.controls; },
        enumerable: true,
        configurable: true
    });
    LoginComponent.prototype.onSubmit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.submitted = true;
                // stop here if form is invalid
                if (this.loginForm.invalid) {
                    return [2 /*return*/];
                }
                this.loading = true;
                this.auth.login({ 'username': this.f.username.value, 'password': this.f.password.value, 'rememberMe': 1 })
                    .then(function (res) {
                    console.log("Login: ", res);
                    if (res['success']) {
                        var page = res['response'];
                        window.location.href = _this.apiUrl + "admin";
                        _this.blockUI.stop();
                    }
                    _this.loading = false;
                }, function (reject) {
                    console.log('error: ', reject);
                    _this.blockUI.stop();
                    _this.loading = false;
                });
                return [2 /*return*/];
            });
        });
    };
    __decorate([
        Object(ng_block_ui__WEBPACK_IMPORTED_MODULE_3__["BlockUI"])(),
        __metadata("design:type", Object)
    ], LoginComponent.prototype, "blockUI", void 0);
    LoginComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-login',
            template: __webpack_require__(/*! ./login.component.html */ "./src/app/login/login.component.html"),
            styles: [__webpack_require__(/*! ./login.component.css */ "./src/app/login/login.component.css")]
        }),
        __metadata("design:paramtypes", [_api_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormBuilder"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "./src/app/online-booking/online-booking.component.html":
/*!**************************************************************!*\
  !*** ./src/app/online-booking/online-booking.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"wrapper\">\r\n    <div  data-aos-duration=\"1200\" data-aos=\"fade\" class=\"page-header background  page-header-sm\" data-parallax=\"true\" style=\"background-image: url('./assets/img/online-booking.jpg');\">\r\n        <div class=\"filter\"></div>\r\n        <div class=\"container mt-4 pt-4 \">\r\n            <div class=\"mt-4 pt-4 motto text-left\">\r\n                    <h3 class=\"title-uppercase py-4 mt-4\">Online booking</h3>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <section data-aos-duration=\"1200\" data-aos=\"fade-up\" data-aos-delay=\"300\" data-aos-easing=\"ease-out-bounce\" class=\"my-4 py-4 section text-center\">\r\n            <br>\r\n            <br>\r\n           \r\n\r\n            <h2 my-4 py-4>  Coming Soon</h2>\r\n            <br>\r\n            <br>\r\n\r\n        </section>\r\n    </div>"

/***/ }),

/***/ "./src/app/online-booking/online-booking.component.scss":
/*!**************************************************************!*\
  !*** ./src/app/online-booking/online-booking.component.scss ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/online-booking/online-booking.component.ts":
/*!************************************************************!*\
  !*** ./src/app/online-booking/online-booking.component.ts ***!
  \************************************************************/
/*! exports provided: OnlineBookingComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OnlineBookingComponent", function() { return OnlineBookingComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/animations */ "./node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! aos */ "./node_modules/aos/dist/aos.js");
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(aos__WEBPACK_IMPORTED_MODULE_4__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var OnlineBookingComponent = /** @class */ (function () {
    function OnlineBookingComponent(title, router) {
        this.title = title;
        this.router = router;
        this.title.setTitle('RAWNAQ Tourism | Online Booking');
    }
    OnlineBookingComponent.prototype.ngOnInit = function () {
        aos__WEBPACK_IMPORTED_MODULE_4___default.a.init({
            once: true, disable: 'mobile'
        });
        // start the page from the top
        this.router.events.subscribe(function (evt) {
            if (!(evt instanceof _angular_router__WEBPACK_IMPORTED_MODULE_3__["NavigationEnd"])) {
                return;
            }
            window.scrollTo(0, 0);
        });
    };
    OnlineBookingComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-online-booking',
            template: __webpack_require__(/*! ./online-booking.component.html */ "./src/app/online-booking/online-booking.component.html"),
            styles: [__webpack_require__(/*! ./online-booking.component.scss */ "./src/app/online-booking/online-booking.component.scss")],
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["trigger"])('fadeInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["state"])('void', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["style"])({
                        opacity: 0
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["transition"])('void <=> *', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["animate"])(1000)),
                ])
            ]
        }),
        __metadata("design:paramtypes", [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Title"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]])
    ], OnlineBookingComponent);
    return OnlineBookingComponent;
}());



/***/ }),

/***/ "./src/app/page/page.component.css":
/*!*****************************************!*\
  !*** ./src/app/page/page.component.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/page/page.component.html":
/*!******************************************!*\
  !*** ./src/app/page/page.component.html ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<block-ui>\r\n        \r\n    <!-- <div class=\"wrapper\">\r\n        <div class=\"page-header background  page-header-md\" data-parallax=\"true\" style=\"background-image: url('./assets/img/fabio-mangione.jpg');\">\r\n            <div class=\"filter\"></div>\r\n            <div class=\"container\">\r\n                <div class=\"ml-4 pl-4 mt-4 motto text-left title-uppercase\">\r\n                    <h3 class=\"pt-4 mt-4\"><span [class.about]=\"title.toLowerCase() === 'about'\">{{title}}</span></h3>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <section class=\"my-4 py-4 section text-center\">\r\n            <br>\r\n            <br>\r\n           \r\n\r\n            <div [innerHTML]=\"contentText\"></div>\r\n            <br>\r\n            <br>\r\n            <br>\r\n            <br>\r\n            <br>\r\n            <br>\r\n            <br>\r\n            <br>\r\n            <br>\r\n            <br>\r\n\r\n        </section>\r\n    </div>\r\n    </div> -->\r\n\r\n\r\n    <!-- About us page -->\r\n\r\n   <!-- About us page -->\r\n\r\n\r\n        \r\n   <div class=\"wrapper\">\r\n        <div class=\"page-header background  page-header-sm\" data-parallax=\"true\" style=\"background-image: url('./assets/img/fabio-mangione.jpg'); \">\r\n            <div class=\"filter\"></div>\r\n            <div class=\"container mt-4 pt-4 \">\r\n                <div class=\"mt-4 pt-4 motto text-left\">\r\n                        <h3 class=\"pt-4 mt-4\"><span [class.about]=\"title.toLowerCase() === 'about'\">{{title}}</span></h3>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n    \r\n            <section class=\"my-4 py-4 section text-center\">\r\n                <br>\r\n                <br>\r\n               \r\n    \r\n                <div [innerHTML]=\"contentText\"></div>\r\n                <br>\r\n                <br>\r\n                <br>\r\n                <br>\r\n                <br>\r\n                <br>\r\n                <br>\r\n                <br>\r\n                <br>\r\n                <br>\r\n    \r\n            </section>\r\n        </div>\r\n    \r\n    \r\n        <!-- About us page -->\r\n    \r\n        \r\n\r\n    \r\n</block-ui>"

/***/ }),

/***/ "./src/app/page/page.component.ts":
/*!****************************************!*\
  !*** ./src/app/page/page.component.ts ***!
  \****************************************/
/*! exports provided: PageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageComponent", function() { return PageComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _api_page_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../api/page.service */ "./src/app/api/page.service.ts");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ng-block-ui */ "./node_modules/ng-block-ui/index.js");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ng_block_ui__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var PageComponent = /** @class */ (function () {
    function PageComponent(router, activatedRoute, page) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.page = page;
        this.bannerImg = "assets/images/about-banner.jpg";
        this.title = "";
        this.contentText = "";
        this.apiUrl = "";
    }
    PageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.apiUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].site_url;
        var currentUrl = this.router.url;
        this.page.getPageContent(currentUrl.replace("/", "")).then(function (res) {
            console.log("Page " + currentUrl + ": ", res);
            if (res["success"]) {
                var pageData = res["response"];
                _this.title = pageData["title"];
                _this.contentText = pageData["content"];
                if (pageData["banner_img"] !== "") {
                    _this.bannerImg = _environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].site_url + pageData["banner_img"];
                }
                if (pageData["title"] == "About") {
                    setTimeout(function () {
                        // step 1: find all the child elements with the selected class name
                        var childrens = document.getElementsByClassName("matchheight");
                        // console.log(console.log(childrens));
                        if (!childrens)
                            return;
                        // step 2a: get all the child elements heights
                        var itemHeights = Array.from(childrens).map(function (x) { return x.getBoundingClientRect().height; });
                        // step 2b: find out the tallest
                        var maxHeight = itemHeights.reduce(function (prev, curr) {
                            return curr > prev ? curr : prev;
                        }, 0);
                        // step 3: update all the child elements to the tallest height
                        Array.from(childrens).forEach(function (x) { return (x.style.height = maxHeight + "px"); });
                    }, 200);
                }
                _this.blockUI.stop();
            }
        }, function (reject) {
            console.log("error: ", reject);
            _this.blockUI.stop();
        });
    };
    __decorate([
        Object(ng_block_ui__WEBPACK_IMPORTED_MODULE_3__["BlockUI"])(),
        __metadata("design:type", Object)
    ], PageComponent.prototype, "blockUI", void 0);
    PageComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "app-page",
            template: __webpack_require__(/*! ./page.component.html */ "./src/app/page/page.component.html"),
            styles: [__webpack_require__(/*! ./page.component.css */ "./src/app/page/page.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _api_page_service__WEBPACK_IMPORTED_MODULE_2__["PageService"]])
    ], PageComponent);
    return PageComponent;
}());



/***/ }),

/***/ "./src/app/pipe/array.fill.pipe.ts":
/*!*****************************************!*\
  !*** ./src/app/pipe/array.fill.pipe.ts ***!
  \*****************************************/
/*! exports provided: ArrayPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ArrayPipe", function() { return ArrayPipe; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ArrayPipe = /** @class */ (function () {
    function ArrayPipe() {
    }
    ArrayPipe.prototype.transform = function (value) {
        return new Array(value).fill(null).map(function (x, i) { return i; });
    };
    ArrayPipe = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Pipe"])({
            name: 'fill'
        })
    ], ArrayPipe);
    return ArrayPipe;
}());



/***/ }),

/***/ "./src/app/pipe/keyvalue.pipe.ts":
/*!***************************************!*\
  !*** ./src/app/pipe/keyvalue.pipe.ts ***!
  \***************************************/
/*! exports provided: KeysPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KeysPipe", function() { return KeysPipe; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var KeysPipe = /** @class */ (function () {
    function KeysPipe() {
    }
    KeysPipe.prototype.transform = function (value, args) {
        if (args === void 0) { args = null; }
        //return Object.keys(value)//.map(key => value[key]);
        var keys = [];
        for (var key in value) {
            keys.push({ key: key, value: value[key] });
        }
        return keys;
    };
    KeysPipe = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Pipe"])({
            name: 'keyvalue',
            pure: false
        })
    ], KeysPipe);
    return KeysPipe;
}());



/***/ }),

/***/ "./src/app/pipe/pipe.module.ts":
/*!*************************************!*\
  !*** ./src/app/pipe/pipe.module.ts ***!
  \*************************************/
/*! exports provided: PipeModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PipeModule", function() { return PipeModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _keyvalue_pipe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./keyvalue.pipe */ "./src/app/pipe/keyvalue.pipe.ts");
/* harmony import */ var _array_fill_pipe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./array.fill.pipe */ "./src/app/pipe/array.fill.pipe.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var PipeModule = /** @class */ (function () {
    function PipeModule() {
    }
    PipeModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [],
            declarations: [
                _keyvalue_pipe__WEBPACK_IMPORTED_MODULE_2__["KeysPipe"],
                _array_fill_pipe__WEBPACK_IMPORTED_MODULE_3__["ArrayPipe"]
            ],
            exports: [
                _keyvalue_pipe__WEBPACK_IMPORTED_MODULE_2__["KeysPipe"],
                _array_fill_pipe__WEBPACK_IMPORTED_MODULE_3__["ArrayPipe"]
            ],
            providers: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["DecimalPipe"]]
        })
    ], PipeModule);
    return PipeModule;
}());



/***/ }),

/***/ "./src/app/quote-form/quote-form.component.css":
/*!*****************************************************!*\
  !*** ./src/app/quote-form/quote-form.component.css ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/quote-form/quote-form.component.html":
/*!******************************************************!*\
  !*** ./src/app/quote-form/quote-form.component.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<block-ui>\r\n  <ng-template #quoteContent let-c=\"close\" let-d=\"dismiss\">\r\n    <div class=\"modal-header\">\r\n      <h4 class=\"modal-title\">Request a Quote</h4>\r\n      <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"close($event)\">\r\n        <span aria-hidden=\"true\">&times;</span>\r\n      </button>\r\n    </div>\r\n    <div class=\"modal-body\">\r\n      <form class=\"form-horizontal\" (ngSubmit)=\"onSend()\" name=\"quote-form\">\r\n        <fieldset>\r\n          <div class=\"row\">\r\n            <div class=\"col-md-6\">\r\n              <div class=\"form-group\">\r\n                <label for=\"noOfRoom\">No. Of Rooms</label>\r\n                <select name=\"noOfRoom\" [(ngModel)]=\"noOfRoom\" required class=\"form-control\" (change)=\"addNRemoveRooms()\">\r\n                  <option value=\"0\">0</option>\r\n                  <option value=\"1\">1</option>\r\n                  <option value=\"2\">2</option>\r\n                  <option value=\"3\">3</option>\r\n                  <option value=\"4\">4</option>\r\n                  <option value=\"5\">5</option>\r\n                </select>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <legend></legend>\r\n          <table class=\"table tablestrip\">\r\n            <tr *ngIf=\"noOfRoom>0\">\r\n              <th>Room #</th>\r\n              <th>Room Type</th>\r\n              <th>Pax Adult</th>\r\n              <th>Pax Child</th>\r\n              <th>Meal Plan</th>\r\n            </tr>\r\n            <tr *ngFor=\"let item of f.adults; let i = index\">\r\n              <td>Room {{i+1}}</td>\r\n              <td>\r\n                <div class=\"form-group\">\r\n                  <select name=\"room_{{i}}\" [(ngModel)]=\"f.room[i]\" required (change)=\"roomChange(i)\" class=\"form-control\">\r\n                    <option value=\"0\">Select Room</option>\r\n                    <option value=\"{{room.id}}\" *ngFor=\"let room of rooms; let rIndex = index;\">{{room['title']}}</option>\r\n                  </select>\r\n                  <input type=\"hidden\" [(ngModel)]=\"f.roomTitle[i]\" name=\"roomTitle\" />\r\n                </div>\r\n              </td>\r\n              <td>\r\n                <div class=\"form-group\">\r\n                  <select name=\"adults_{{i}}\" [(ngModel)]=\"f.adults[i]\" required class=\"form-control\">\r\n                    <option value=\"\">0</option>\r\n                    <option value=\"1\">1</option>\r\n                    <option value=\"2\">2</option>\r\n                    <option value=\"3\">3</option>\r\n                    <option value=\"4\">4</option>\r\n                    <option value=\"5\">5</option>\r\n                  </select>\r\n                </div>\r\n              </td>\r\n              <td>\r\n                <div class=\"form-group\">\r\n                  <select name=\"kids_{{i}}\" [(ngModel)]=\"f.kids[i]\" required class=\"form-control\">\r\n                    <option value=\"\">0</option>\r\n                    <option value=\"1\">1</option>\r\n                    <option value=\"2\">2</option>\r\n                    <option value=\"3\">3</option>\r\n                    <option value=\"4\">4</option>\r\n                    <option value=\"5\">5</option>\r\n                  </select>\r\n                </div>\r\n              </td>\r\n              <td>\r\n                <div class=\"form-group\">\r\n                  <select name=\"meal_{{i}}\" [(ngModel)]=\"f.meal[i]\" class=\"form-control\">\r\n                    <option value=\"\">Select Meal</option>\r\n                    <option value=\"BB\">BB</option>\r\n                    <option value=\"HB\">HB</option>\r\n                    <option value=\"FB\">FB</option>\r\n                  </select>\r\n                </div>\r\n              </td>\r\n            </tr>\r\n          </table>\r\n          <legend>Travel Dates</legend>\r\n          <div class=\"row\">\r\n            <div class=\"col-md-6\">\r\n              <div class=\"form-group\">\r\n                <label>Arrival</label>\r\n                <div class=\"input-group date-input-group\">\r\n                  <input name=\"arrivalDate\" placeholder=\"yyyy-mm-dd\" class=\"form-control\" [(ngModel)]=\"f.arrivalDate\"\r\n                    type=\"text\" ngbDatepicker #a=\"ngbDatepicker\" readonly required (click)=\"a.toggle()\" />\r\n                  <div class=\"input-group-append\">\r\n                    <button name=\"arrival-date-btn\" class=\"btn btn-outline-secondary calendar\" (click)=\"a.toggle()\"\r\n                      type=\"button\"></button>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n            <div class=\"col-md-6\">\r\n              <div class=\"form-group\">\r\n                <label>Departure</label>\r\n                <div class=\"input-group date-input-group\">\r\n                  <input name=\"departureDate\" placeholder=\"yyyy-mm-dd\" class=\"form-control\" [(ngModel)]=\"f.departureDate\"\r\n                    type=\"text\" ngbDatepicker #d=\"ngbDatepicker\" readonly required (click)=\"d.toggle()\" />\r\n                  <div class=\"input-group-append\">\r\n                    <button name=\"departure-date-btn\" class=\"btn btn-outline-secondary calendar\" (click)=\"d.toggle()\"\r\n                      type=\"button\"></button>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n\r\n\r\n          <input type=\"hidden\" [(ngModel)]=\"f.offerType\" value=\"\" />\r\n          <br />\r\n          <div class=\"form-group\">\r\n            <label>Any Special Request</label>\r\n            <textarea name=\"offerDetail\" class=\"form-control\" [(ngModel)]=\"f.offerDetail\"></textarea>\r\n          </div>\r\n          <legend>Personal Details</legend>\r\n          <div class=\"row\">\r\n            <div class=\"col-md-6\">\r\n              <div class=\"form-group\">\r\n                <label>Name</label>\r\n                <input name=\"customer_name\" type=\"text\" class=\"form-control\" [(ngModel)]=\"f.name\" required />\r\n              </div>\r\n            </div>\r\n            <div class=\"col-md-6\">\r\n              <div class=\"form-group\">\r\n                <label>Contact #</label>\r\n                <input name=\"contact_no\" type=\"text\" class=\"form-control\" [(ngModel)]=\"f.contact_no\" required />\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <div class=\"row\">\r\n            <div class=\"col-md-6\">\r\n              <div class=\"form-group\">\r\n                <label>Email</label>\r\n                <input name=\"email\" type=\"email\" class=\"form-control\" [(ngModel)]=\"f.email\" required />\r\n              </div>\r\n            </div>\r\n            <div class=\"col-md-6\">\r\n              <div class=\"form-group\">\r\n                <label>Nationality</label>\r\n                <select [(ngModel)]=\"f.nationality\" required name=\"nationality\" class=\"form-control\">\r\n                  <option value=\"\">Select your country</option>\r\n                  <option value=\"United States\">United States</option>\r\n                  <option value=\"United Kingdom\">United Kingdom</option>\r\n                  <option value=\"Afghanistan\">Afghanistan</option>\r\n                  <option value=\"Albania\">Albania</option>\r\n                  <option value=\"Algeria\">Algeria</option>\r\n                  <option value=\"American Samoa\">American Samoa</option>\r\n                  <option value=\"Andorra\">Andorra</option>\r\n                  <option value=\"Angola\">Angola</option>\r\n                  <option value=\"Anguilla\">Anguilla</option>\r\n                  <option value=\"Antarctica\">Antarctica</option>\r\n                  <option value=\"Antigua and Barbuda\">Antigua and Barbuda</option>\r\n                  <option value=\"Argentina\">Argentina</option>\r\n                  <option value=\"Armenia\">Armenia</option>\r\n                  <option value=\"Aruba\">Aruba</option>\r\n                  <option value=\"Australia\">Australia</option>\r\n                  <option value=\"Austria\">Austria</option>\r\n                  <option value=\"Azerbaijan\">Azerbaijan</option>\r\n                  <option value=\"Bahamas\">Bahamas</option>\r\n                  <option value=\"Bahrain\">Bahrain</option>\r\n                  <option value=\"Bangladesh\">Bangladesh</option>\r\n                  <option value=\"Barbados\">Barbados</option>\r\n                  <option value=\"Belarus\">Belarus</option>\r\n                  <option value=\"Belgium\">Belgium</option>\r\n                  <option value=\"Belize\">Belize</option>\r\n                  <option value=\"Benin\">Benin</option>\r\n                  <option value=\"Bermuda\">Bermuda</option>\r\n                  <option value=\"Bhutan\">Bhutan</option>\r\n                  <option value=\"Bolivia\">Bolivia</option>\r\n                  <option value=\"Bosnia and Herzegovina\">Bosnia and Herzegovina</option>\r\n                  <option value=\"Botswana\">Botswana</option>\r\n                  <option value=\"Bouvet Island\">Bouvet Island</option>\r\n                  <option value=\"Brazil\">Brazil</option>\r\n                  <option value=\"British Indian Ocean Territory\">British Indian Ocean Territory</option>\r\n                  <option value=\"Brunei Darussalam\">Brunei Darussalam</option>\r\n                  <option value=\"Bulgaria\">Bulgaria</option>\r\n                  <option value=\"Burkina Faso\">Burkina Faso</option>\r\n                  <option value=\"Burundi\">Burundi</option>\r\n                  <option value=\"Cambodia\">Cambodia</option>\r\n                  <option value=\"Cameroon\">Cameroon</option>\r\n                  <option value=\"Canada\">Canada</option>\r\n                  <option value=\"Cape Verde\">Cape Verde</option>\r\n                  <option value=\"Cayman Islands\">Cayman Islands</option>\r\n                  <option value=\"Central African Republic\">Central African Republic</option>\r\n                  <option value=\"Chad\">Chad</option>\r\n                  <option value=\"Chile\">Chile</option>\r\n                  <option value=\"China\">China</option>\r\n                  <option value=\"Christmas Island\">Christmas Island</option>\r\n                  <option value=\"Cocos (Keeling) Islands\">Cocos (Keeling) Islands</option>\r\n                  <option value=\"Colombia\">Colombia</option>\r\n                  <option value=\"Comoros\">Comoros</option>\r\n                  <option value=\"Congo\">Congo</option>\r\n                  <option value=\"Cook Islands\">Cook Islands</option>\r\n                  <option value=\"Costa Rica\">Costa Rica</option>\r\n                  <option value=\"Croatia\">Croatia</option>\r\n                  <option value=\"Cuba\">Cuba</option>\r\n                  <option value=\"Cyprus\">Cyprus</option>\r\n                  <option value=\"Czech Republic\">Czech Republic</option>\r\n                  <option value=\"Denmark\">Denmark</option>\r\n                  <option value=\"Djibouti\">Djibouti</option>\r\n                  <option value=\"Dominica\">Dominica</option>\r\n                  <option value=\"Dominican Republic\">Dominican Republic</option>\r\n                  <option value=\"Ecuador\">Ecuador</option>\r\n                  <option value=\"Egypt\">Egypt</option>\r\n                  <option value=\"El Salvador\">El Salvador</option>\r\n                  <option value=\"Equatorial Guinea\">Equatorial Guinea</option>\r\n                  <option value=\"Eritrea\">Eritrea</option>\r\n                  <option value=\"Estonia\">Estonia</option>\r\n                  <option value=\"Ethiopia\">Ethiopia</option>\r\n                  <option value=\"Falkland Islands (Malvinas)\">Falkland Islands (Malvinas)</option>\r\n                  <option value=\"Faroe Islands\">Faroe Islands</option>\r\n                  <option value=\"Fiji\">Fiji</option>\r\n                  <option value=\"Finland\">Finland</option>\r\n                  <option value=\"France\">France</option>\r\n                  <option value=\"French Guiana\">French Guiana</option>\r\n                  <option value=\"French Polynesia\">French Polynesia</option>\r\n                  <option value=\"French Southern Territories\">French Southern Territories</option>\r\n                  <option value=\"Gabon\">Gabon</option>\r\n                  <option value=\"Gambia\">Gambia</option>\r\n                  <option value=\"Georgia\">Georgia</option>\r\n                  <option value=\"Germany\">Germany</option>\r\n                  <option value=\"Ghana\">Ghana</option>\r\n                  <option value=\"Gibraltar\">Gibraltar</option>\r\n                  <option value=\"Greece\">Greece</option>\r\n                  <option value=\"Greenland\">Greenland</option>\r\n                  <option value=\"Grenada\">Grenada</option>\r\n                  <option value=\"Guadeloupe\">Guadeloupe</option>\r\n                  <option value=\"Guam\">Guam</option>\r\n                  <option value=\"Guatemala\">Guatemala</option>\r\n                  <option value=\"Guinea\">Guinea</option>\r\n                  <option value=\"Guinea-bissau\">Guinea-bissau</option>\r\n                  <option value=\"Guyana\">Guyana</option>\r\n                  <option value=\"Haiti\">Haiti</option>\r\n                  <option value=\"Heard Island and Mcdonald Islands\">Heard Island and Mcdonald Islands</option>\r\n                  <option value=\"Holy See (Vatican City State)\">Holy See (Vatican City State)</option>\r\n                  <option value=\"Honduras\">Honduras</option>\r\n                  <option value=\"Hong Kong\">Hong Kong</option>\r\n                  <option value=\"Hungary\">Hungary</option>\r\n                  <option value=\"Iceland\">Iceland</option>\r\n                  <option value=\"India\">India</option>\r\n                  <option value=\"Indonesia\">Indonesia</option>\r\n                  <option value=\"Iran, Islamic Republic of\">Iran, Islamic Republic of</option>\r\n                  <option value=\"Iraq\">Iraq</option>\r\n                  <option value=\"Ireland\">Ireland</option>\r\n                  <option value=\"Israel\">Israel</option>\r\n                  <option value=\"Italy\">Italy</option>\r\n                  <option value=\"Jamaica\">Jamaica</option>\r\n                  <option value=\"Japan\">Japan</option>\r\n                  <option value=\"Jordan\">Jordan</option>\r\n                  <option value=\"Kazakhstan\">Kazakhstan</option>\r\n                  <option value=\"Kenya\">Kenya</option>\r\n                  <option value=\"Kiribati\">Kiribati</option>\r\n                  <option value=\"North Korea\">North Korea</option>\r\n                  <option value=\"South Korea\">South Korea</option>\r\n                  <option value=\"Kuwait\">Kuwait</option>\r\n                  <option value=\"Kyrgyzstan\">Kyrgyzstan</option>\r\n                  <option value=\"Lao\">Lao</option>\r\n                  <option value=\"Latvia\">Latvia</option>\r\n                  <option value=\"Lebanon\">Lebanon</option>\r\n                  <option value=\"Lesotho\">Lesotho</option>\r\n                  <option value=\"Liberia\">Liberia</option>\r\n                  <option value=\"Libya\">Libya</option>\r\n                  <option value=\"Liechtenstein\">Liechtenstein</option>\r\n                  <option value=\"Lithuania\">Lithuania</option>\r\n                  <option value=\"Luxembourg\">Luxembourg</option>\r\n                  <option value=\"Macao\">Macao</option>\r\n                  <option value=\"Macedonia\">Macedonia</option>\r\n                  <option value=\"Madagascar\">Madagascar</option>\r\n                  <option value=\"Malawi\">Malawi</option>\r\n                  <option value=\"Malaysia\">Malaysia</option>\r\n                  <option value=\"Maldives\">Maldives</option>\r\n                  <option value=\"Mali\">Mali</option>\r\n                  <option value=\"Malta\">Malta</option>\r\n                  <option value=\"Marshall Islands\">Marshall Islands</option>\r\n                  <option value=\"Martinique\">Martinique</option>\r\n                  <option value=\"Mauritania\">Mauritania</option>\r\n                  <option value=\"Mauritius\">Mauritius</option>\r\n                  <option value=\"Mayotte\">Mayotte</option>\r\n                  <option value=\"Mexico\">Mexico</option>\r\n                  <option value=\"Micronesia\">Micronesia</option>\r\n                  <option value=\"Moldova\">Moldova</option>\r\n                  <option value=\"Monaco\">Monaco</option>\r\n                  <option value=\"Mongolia\">Mongolia</option>\r\n                  <option value=\"Montserrat\">Montserrat</option>\r\n                  <option value=\"Morocco\">Morocco</option>\r\n                  <option value=\"Mozambique\">Mozambique</option>\r\n                  <option value=\"Myanmar\">Myanmar</option>\r\n                  <option value=\"Namibia\">Namibia</option>\r\n                  <option value=\"Nauru\">Nauru</option>\r\n                  <option value=\"Nepal\">Nepal</option>\r\n                  <option value=\"Netherlands\">Netherlands</option>\r\n                  <option value=\"Netherlands Antilles\">Netherlands Antilles</option>\r\n                  <option value=\"New Caledonia\">New Caledonia</option>\r\n                  <option value=\"New Zealand\">New Zealand</option>\r\n                  <option value=\"Nicaragua\">Nicaragua</option>\r\n                  <option value=\"Niger\">Niger</option>\r\n                  <option value=\"Nigeria\">Nigeria</option>\r\n                  <option value=\"Niue\">Niue</option>\r\n                  <option value=\"Norfolk Island\">Norfolk Island</option>\r\n                  <option value=\"Northern Mariana Islands\">Northern Mariana Islands</option>\r\n                  <option value=\"Norway\">Norway</option>\r\n                  <option value=\"Oman\">Oman</option>\r\n                  <option value=\"Pakistan\">Pakistan</option>\r\n                  <option value=\"Palau\">Palau</option>\r\n                  <option value=\"Palestine\">Palestine</option>\r\n                  <option value=\"Panama\">Panama</option>\r\n                  <option value=\"Papua New Guinea\">Papua New Guinea</option>\r\n                  <option value=\"Paraguay\">Paraguay</option>\r\n                  <option value=\"Peru\">Peru</option>\r\n                  <option value=\"Philippines\">Philippines</option>\r\n                  <option value=\"Pitcairn\">Pitcairn</option>\r\n                  <option value=\"Poland\">Poland</option>\r\n                  <option value=\"Portugal\">Portugal</option>\r\n                  <option value=\"Puerto Rico\">Puerto Rico</option>\r\n                  <option value=\"Qatar\">Qatar</option>\r\n                  <option value=\"Reunion\">Reunion</option>\r\n                  <option value=\"Romania\">Romania</option>\r\n                  <option value=\"Russian Federation\">Russian Federation</option>\r\n                  <option value=\"Rwanda\">Rwanda</option>\r\n                  <option value=\"Saint Helena\">Saint Helena</option>\r\n                  <option value=\"Saint Kitts and Nevis\">Saint Kitts and Nevis</option>\r\n                  <option value=\"Saint Lucia\">Saint Lucia</option>\r\n                  <option value=\"Saint Pierre and Miquelon\">Saint Pierre and Miquelon</option>\r\n                  <option value=\"Saint Vincent and The Grenadines\">Saint Vincent and The Grenadines</option>\r\n                  <option value=\"Samoa\">Samoa</option>\r\n                  <option value=\"San Marino\">San Marino</option>\r\n                  <option value=\"Sao Tome and Principe\">Sao Tome and Principe</option>\r\n                  <option value=\"Saudi Arabia\">Saudi Arabia</option>\r\n                  <option value=\"Senegal\">Senegal</option>\r\n                  <option value=\"Serbia and Montenegro\">Serbia and Montenegro</option>\r\n                  <option value=\"Seychelles\">Seychelles</option>\r\n                  <option value=\"Sierra Leone\">Sierra Leone</option>\r\n                  <option value=\"Singapore\">Singapore</option>\r\n                  <option value=\"Slovakia\">Slovakia</option>\r\n                  <option value=\"Slovenia\">Slovenia</option>\r\n                  <option value=\"Solomon Islands\">Solomon Islands</option>\r\n                  <option value=\"Somalia\">Somalia</option>\r\n                  <option value=\"South Africa\">South Africa</option>\r\n                  <option value=\"South Georgia\">South Georgia</option>\r\n                  <option value=\"Spain\">Spain</option>\r\n                  <option value=\"Sri Lanka\">Sri Lanka</option>\r\n                  <option value=\"Sudan\">Sudan</option>\r\n                  <option value=\"Suriname\">Suriname</option>\r\n                  <option value=\"Svalbard and Jan Mayen\">Svalbard and Jan Mayen</option>\r\n                  <option value=\"Swaziland\">Swaziland</option>\r\n                  <option value=\"Sweden\">Sweden</option>\r\n                  <option value=\"Switzerland\">Switzerland</option>\r\n                  <option value=\"Syrian Arab Republic\">Syrian Arab Republic</option>\r\n                  <option value=\"Taiwan, Province of China\">Taiwan, Province of China</option>\r\n                  <option value=\"Tajikistan\">Tajikistan</option>\r\n                  <option value=\"Tanzania, United Republic of\">Tanzania, United Republic of</option>\r\n                  <option value=\"Thailand\">Thailand</option>\r\n                  <option value=\"Timor-leste\">Timor-leste</option>\r\n                  <option value=\"Togo\">Togo</option>\r\n                  <option value=\"Tokelau\">Tokelau</option>\r\n                  <option value=\"Tonga\">Tonga</option>\r\n                  <option value=\"Trinidad and Tobago\">Trinidad and Tobago</option>\r\n                  <option value=\"Tunisia\">Tunisia</option>\r\n                  <option value=\"Turkey\">Turkey</option>\r\n                  <option value=\"Turkmenistan\">Turkmenistan</option>\r\n                  <option value=\"Turks and Caicos Islands\">Turks and Caicos Islands</option>\r\n                  <option value=\"Tuvalu\">Tuvalu</option>\r\n                  <option value=\"Uganda\">Uganda</option>\r\n                  <option value=\"Ukraine\">Ukraine</option>\r\n                  <option value=\"United Arab Emirates\">United Arab Emirates</option>\r\n                  <option value=\"United Kingdom\">United Kingdom</option>\r\n                  <option value=\"United States\">United States</option>\r\n                  <option value=\"United States Minor Outlying Islands\">United States Minor Outlying Islands</option>\r\n                  <option value=\"Uruguay\">Uruguay</option>\r\n                  <option value=\"Uzbekistan\">Uzbekistan</option>\r\n                  <option value=\"Vanuatu\">Vanuatu</option>\r\n                  <option value=\"Venezuela\">Venezuela</option>\r\n                  <option value=\"Viet Nam\">Viet Nam</option>\r\n                  <option value=\"Virgin Islands, British\">Virgin Islands, British</option>\r\n                  <option value=\"Virgin Islands, U.S.\">Virgin Islands, U.S.</option>\r\n                  <option value=\"Wallis and Futuna\">Wallis and Futuna</option>\r\n                  <option value=\"Western Sahara\">Western Sahara</option>\r\n                  <option value=\"Yemen\">Yemen</option>\r\n                  <option value=\"Zambia\">Zambia</option>\r\n                  <option value=\"Zimbabwe\">Zimbabwe</option>\r\n                </select>\r\n              </div>\r\n            </div>\r\n          </div>\r\n\r\n          <div class=\"row\">\r\n            <div class=\"col-md-12\">\r\n              <div class=\"form-group\">\r\n                <button type=\"submit\" class=\"btn --btn-primary mrpx-10\">Submit</button>\r\n                <button type=\"button\" class=\"btn --btn-secondary\" (click)=\"close($event)\">Close</button>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <div class=\"row\">\r\n            <div class=\"col-md-12\"><strong [innerHTML]=\"modelAlertContent\"></strong></div>\r\n          </div>\r\n\r\n        </fieldset>\r\n\r\n      </form>\r\n    </div>\r\n    <div class=\"modal-footer\"></div>\r\n  </ng-template>\r\n</block-ui>\r\n"

/***/ }),

/***/ "./src/app/quote-form/quote-form.component.ts":
/*!****************************************************!*\
  !*** ./src/app/quote-form/quote-form.component.ts ***!
  \****************************************************/
/*! exports provided: QuoteFormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QuoteFormComponent", function() { return QuoteFormComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ng-block-ui */ "./node_modules/ng-block-ui/index.js");
/* harmony import */ var ng_block_ui__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ng_block_ui__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _api_page_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../api/page.service */ "./src/app/api/page.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var QuoteFormComponent = /** @class */ (function () {
    function QuoteFormComponent(modalService, page, config, calendar) {
        var _this = this;
        this.modalService = modalService;
        this.page = page;
        this.selectSettings = {
            display: "center"
        };
        this.formSettings = {
            onInit: function (e, ins) {
                _this.quoteForm = ins;
            }
        };
        this.modelAlertContent = "";
        this.apiUrl = "";
        this.title = "";
        this.hotelId = "";
        this.currentImage = "assets/images/sunset.jpg";
        this.Object = Object;
        this.noOfRoom = 0;
        this.f = {
            adults: [],
            kids: [],
            room: [],
            roomTitle: [],
            meal: [],
            name: "",
            contact_no: "",
            email: "",
            nationality: "",
            offerType: "",
            offerDetail: "",
            arrivalDate: "",
            departureDate: "",
            hotel_name: ""
        };
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        // if(dd<10) {
        //     dd = '0'+dd
        // } 
        // if(mm<10) {
        //     mm = '0'+mm
        // } 
        // today = mm + '/' + dd + '/' + yyyy;
        // document.write(today);
        // customize default values of datepickers used by this component tree
        config.minDate = { year: yyyy, month: mm, day: dd };
        config.maxDate = { year: 2099, month: 12, day: 31 };
        // days that don't belong to current month are not visible
        config.outsideDays = 'hidden';
    }
    QuoteFormComponent.prototype.show = function (hotelId, title, rooms, roomId) {
        var _this = this;
        this.apiUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].site_url;
        this.rooms = rooms;
        this.title = title;
        this.f.hotel_name = title;
        this.hotelId = hotelId;
        this.modalRef = this.modalService.open(this.content, {
            windowClass: "xlModal",
            size: "lg",
            backdrop: "static"
        });
        console.log(rooms);
        console.log(roomId);
        if (roomId !== 0) {
            this.noOfRoom = 1;
            this.f.adults[0] = 2;
            this.f.room[0] = roomId;
            this.f.kids[0] = "";
            this.f.meal[0] = "FB";
            this.rooms.forEach(function (r) {
                if (r.id == roomId) {
                    _this.f.roomTitle[0] = r.title;
                }
            });
        }
    };
    QuoteFormComponent.prototype.close = function (event) {
        event.stopPropagation();
        this.modalRef.close();
    };
    QuoteFormComponent.prototype.ngOnInit = function () {
        this.apiUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].site_url;
        this.rangeSettings = {
            display: "center",
            controls: ["calendar"],
            startInput: "#departureDateInp",
            endInput: "#arrivalDateInp",
            min: new Date(),
            dateFormat: "ddd, M yy"
        };
    };
    QuoteFormComponent.prototype.addNRemoveRooms = function (event) {
        if (typeof event !== "undefined") {
            var inst = event.inst;
            inst.hide();
        }
        var tmpF = Object.assign({}, this.f);
        this.f.adults = [];
        this.f.kids = [];
        this.f.room = [];
        this.f.meal = [];
        for (var i = 0; i < this.noOfRoom; i++) {
            this.f.adults.push(typeof tmpF.adults[i] !== "undefined" ? tmpF.adults[i] : 0);
            this.f.kids.push(typeof tmpF.kids[i] !== "undefined" ? tmpF.kids[i] : 0);
            this.f.room.push(typeof tmpF.room[i] !== "undefined" ? tmpF.room[i] : 0);
            this.f.meal.push(typeof tmpF.meal[i] !== "undefined" ? tmpF.meal[i] : "");
        }
    };
    QuoteFormComponent.prototype.onSend = function () {
        var _this = this;
        console.log(this.f.offerDetail);
        if (this.f.adults.length === 0 ||
            this.f.adults[0] === "" ||
            this.f.adults[0] === "0" ||
            this.f.nationality === "" ||
            this.f.email === "" ||
            this.f.name === "" ||
            this.f.contact_no === "") {
            //this.alerts.setMessage('All the fields are required','error');
            this.modelAlertContent = "All fields are required";
            return false;
        }
        this.blockUI.start("");
        this.page.sendQuote(this.f).then(function (res) {
            if (res["success"]) {
                _this.blockUI.stop();
                _this.modelAlertContent =
                    "<span class='fc-primary'>Quote has sent successfully.</span>";
                _this.resetForm();
                //this.alerts.setMessage('Quote has sent successfuly','success');
                //this.modalRef.close();
            }
        }, function (reject) {
            console.log("error: ", reject);
            _this.blockUI.stop();
        });
    };
    QuoteFormComponent.prototype.roomChange = function (i) {
        this.f.roomTitle[i] = this.rooms[i]["title"];
    };
    QuoteFormComponent.prototype.resetForm = function () {
        this.noOfRoom = 0;
        this.f = {
            adults: [],
            kids: [],
            room: [],
            roomTitle: [],
            meal: [],
            name: "",
            contact_no: "",
            email: "",
            nationality: "",
            offerType: "",
            offerDetail: "",
            arrivalDate: "",
            departureDate: "",
            hotel_name: ""
        };
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])("quoteContent"),
        __metadata("design:type", Object)
    ], QuoteFormComponent.prototype, "content", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])("returnDateRange"),
        __metadata("design:type", Object)
    ], QuoteFormComponent.prototype, "returnDateRange", void 0);
    __decorate([
        Object(ng_block_ui__WEBPACK_IMPORTED_MODULE_3__["BlockUI"])(),
        __metadata("design:type", Object)
    ], QuoteFormComponent.prototype, "blockUI", void 0);
    QuoteFormComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "app-quote-form",
            template: __webpack_require__(/*! ./quote-form.component.html */ "./src/app/quote-form/quote-form.component.html"),
            styles: [__webpack_require__(/*! ./quote-form.component.css */ "./src/app/quote-form/quote-form.component.css")]
        }),
        __metadata("design:paramtypes", [_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NgbModal"], _api_page_service__WEBPACK_IMPORTED_MODULE_4__["PageService"], _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NgbDatepickerConfig"], _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NgbCalendar"]])
    ], QuoteFormComponent);
    return QuoteFormComponent;
}());



/***/ }),

/***/ "./src/app/room/room.component.css":
/*!*****************************************!*\
  !*** ./src/app/room/room.component.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/room/room.component.html":
/*!******************************************!*\
  !*** ./src/app/room/room.component.html ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ng-template #roomContent let-c=\"close\" let-d=\"dismiss\">\r\n    <div class=\"modal-body\">\r\n        <div class=\"col-md-8\">\r\n            <div id=\"hotel_image\" >\r\n                <img src=\"{{apiUrl}}{{currentImage}}\" style=\"width: 100%\"/>\r\n            </div>\r\n            <div class=\"mini-image\">\r\n                <img *ngFor=\"let g of room['galleries']\" src=\"{{apiUrl}}{{g['roomGalleryImg']}}\" (click)=\"showImg(g['roomGalleryImg'])\" title=\"{{g['roomGalleryDescription']}}\">\r\n            </div>\r\n        </div>\r\n        <div class=\"col-md-4\">\r\n            <h3 class=\"titleroom\">{{room['title']}}</h3>\r\n            <hr/>\r\n            <div class=\"row\" *ngFor=\"let service of Object.keys(room['services'])\">\r\n                <div class=\"col-md-12\">\r\n                    <b>{{service}}</b>\r\n                    <div class=\"row\">\r\n                        <div class=\"col-md-6\" *ngFor=\"let s of room['services'][service];\">\r\n                            {{s['roomServiceTitle']}}\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                 <hr/>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"modal-footer\">\r\n        <button type=\"button\" class=\"btn btn-green\" (click)=\"close($event)\">Close</button>\r\n    </div>\r\n</ng-template>"

/***/ }),

/***/ "./src/app/room/room.component.ts":
/*!****************************************!*\
  !*** ./src/app/room/room.component.ts ***!
  \****************************************/
/*! exports provided: RoomComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RoomComponent", function() { return RoomComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var RoomComponent = /** @class */ (function () {
    function RoomComponent(modalService) {
        this.modalService = modalService;
        this.apiUrl = "";
        this.currentImage = "assets/images/sunset.jpg";
        this.Object = Object;
    }
    RoomComponent.prototype.show = function (room) {
        this.apiUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].site_url;
        this.room = room;
        if (typeof room['galleries'] !== 'undefined' && room['galleries'].length > 0) {
            this.currentImage = room['galleries'][0]['roomGalleryImg'];
        }
        else {
            room['galleries'] = [];
            this.currentImage = room['thumbnail'];
        }
        this.modalRef = this.modalService.open(this.content, { windowClass: 'xlModal', size: 'lg', backdrop: 'static' });
    };
    RoomComponent.prototype.close = function (event) {
        event.stopPropagation();
        this.modalRef.close();
    };
    RoomComponent.prototype.showImg = function (img) {
        this.currentImage = img;
    };
    RoomComponent.prototype.ngOnInit = function () {
        this.apiUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].site_url;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('roomContent'),
        __metadata("design:type", Object)
    ], RoomComponent.prototype, "content", void 0);
    RoomComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-room',
            template: __webpack_require__(/*! ./room.component.html */ "./src/app/room/room.component.html"),
            styles: [__webpack_require__(/*! ./room.component.css */ "./src/app/room/room.component.css")]
        }),
        __metadata("design:paramtypes", [_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NgbModal"]])
    ], RoomComponent);
    return RoomComponent;
}());



/***/ }),

/***/ "./src/app/search/search.component.css":
/*!*********************************************!*\
  !*** ./src/app/search/search.component.css ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/search/search.component.html":
/*!**********************************************!*\
  !*** ./src/app/search/search.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<block-ui>\r\n    <div class=\"wrapper\">\r\n      <div\r\n        data-aos-duration=\"1200\"\r\n        data-aos=\"fade\"\r\n        class=\"page-header background  page-header-sm\"\r\n        data-parallax=\"true\"\r\n        style=\"background-image: url('./assets/img/destinations.jpg');\"\r\n      >\r\n        <div class=\"filter\"></div>\r\n        <div class=\"container mt-4 pt-4 \">\r\n          <div class=\"mt-4 pt-4 motto text-left\">\r\n            <h3 class=\"title-uppercase py-4 mt-4\">{{ title }}</h3>\r\n            <p class=\"description text-white\">\r\n              Popular Tourist Destinations Around The Globe <br />Explore Your Favorite Destination !\r\n            </p>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"destination-section\">\r\n        <div class=\"container\">\r\n          <div class=\"row box --destination-box\">\r\n            <p *ngIf=\"!result || result.length === 0\" class=\"text-center\">\r\n              No Search Result\r\n            </p>\r\n            <ng-container *ngFor=\"let destination of result; let rIndex = index\">\r\n              <div class=\"col-md-4\" *ngIf=\"destination['slug'] !== 'maldives'\">\r\n                <div class=\"inner-box\">\r\n                  <a href=\"\" [routerLink]=\"['/explore', destination['slug']]\">\r\n                    <figure class=\"img-thumbnail img-responsive\" [ngStyle]=\"{'background-image':'url(' + apiUrl + destination['thumbnail'] + ')'}\"></figure>\r\n                  </a>\r\n                  <p class=\"desc\">\r\n                    <a href=\"\" [routerLink]=\"['/explore', destination['slug']]\">\r\n                      <h6>\r\n                        {{ destination[\"title\"] }}\r\n                        <p class=\"description\">\r\n                          {{ destination[\"sub_description\"] }}\r\n                        </p>\r\n                      </h6>\r\n                    </a>\r\n                  </p>\r\n                </div>\r\n              </div>\r\n            </ng-container>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </block-ui>"

/***/ }),

/***/ "./src/app/search/search.component.ts":
/*!********************************************!*\
  !*** ./src/app/search/search.component.ts ***!
  \********************************************/
/*! exports provided: SearchComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SearchComponent", function() { return SearchComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/animations */ "./node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! aos */ "./node_modules/aos/dist/aos.js");
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(aos__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _api_page_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../api/page.service */ "./src/app/api/page.service.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};







var SearchComponent = /** @class */ (function () {
    function SearchComponent(activatedRoute, page, title_, router) {
        var _this = this;
        this.activatedRoute = activatedRoute;
        this.page = page;
        this.title_ = title_;
        this.router = router;
        // @BlockUI()
        // blockUI: NgBlockUI;  
        this.result = [];
        this.title = "Search DESTINATIONS";
        this.apiUrl = "";
        this.scrollDistance = 1;
        this.scrollUpDistance = 2;
        this.throttle = 0;
        this.perPage = 12;
        this.destinations = [];
        this.displayDestinations = [];
        this.contentText = "";
        this.totalPages = [];
        this.currentPage = 0;
        this.search_destination = "";
        this.title_.setTitle("RAWNAQ Tourism | Search");
        activatedRoute.queryParams.subscribe(function (p) {
            _this.search_destination = p.keyword ? p.keyword : '';
            _this.loadDestinationsPage(1000, 0, 0);
        });
    }
    SearchComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                aos__WEBPACK_IMPORTED_MODULE_4___default.a.init({
                    once: true, disable: 'mobile'
                });
                // start the page from the top
                this.router.events.subscribe(function (evt) {
                    if (!(evt instanceof _angular_router__WEBPACK_IMPORTED_MODULE_1__["NavigationEnd"])) {
                        return;
                    }
                    window.scrollTo(0, 0);
                });
                this.apiUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_6__["environment"].site_url;
                return [2 /*return*/];
            });
        });
    };
    SearchComponent.prototype.loadDestinationsPage = function (limit, show_on_home, page) {
        var _this = this;
        if (limit === void 0) { limit = 12; }
        if (show_on_home === void 0) { show_on_home = 0; }
        if (page === void 0) { page = 0; }
        var search_string = "";
        if (this.search_destination.trim() !== "") {
            search_string = this.search_destination.trim();
        }
        this.page.getAllDestination(limit, show_on_home, page, search_string).then(function (res) {
            console.log("All Destination: ", res);
            if (res["success"]) {
                _this.destinations = res["response"];
                _this.result = [];
                _this.currentPage = res["current_page"];
                // console.log(res);
                _this.totalPages = Array(res["total_pages"])
                    .fill(0)
                    .map(function (x, i) { return i; });
                var BreakException_1 = {};
                try {
                    _this.destinations.forEach(function (s, i) {
                        if (_this.perPage < i + 1) {
                            throw BreakException_1;
                        }
                        _this.result.push(_this.destinations[i]);
                    });
                }
                catch (e) {
                    if (e !== BreakException_1) {
                        throw e;
                    }
                }
                // this.blockUI.stop();
            }
            else {
                _this.result = [];
            }
        }, function (reject) {
            console.log("error: ", reject);
            // this.blockUI.stop();
        });
    };
    SearchComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-search',
            template: __webpack_require__(/*! ./search.component.html */ "./src/app/search/search.component.html"),
            styles: [__webpack_require__(/*! ./search.component.css */ "./src/app/search/search.component.css")],
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["trigger"])('fadeInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["state"])('void', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({
                        opacity: 0
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["transition"])('void <=> *', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["animate"])(1000)),
                ])
            ]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _api_page_service__WEBPACK_IMPORTED_MODULE_5__["PageService"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["Title"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], SearchComponent);
    return SearchComponent;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false,
    api_url: "http://www.rawnaqtourism.com/api/v1/",
    site_url: "http://www.rawnaqtourism.com/",
    DEV: true
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\dell\desktop\rawnaq-fronted-repo\rawnaq-frontend\src\main.ts */"./src/main.ts");


/***/ }),

/***/ 1:
/*!*********************************!*\
  !*** readable-stream (ignored) ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map