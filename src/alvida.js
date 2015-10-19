// 一个练习项目,按照underscore的api文档说明,自己去实现出接口
// 只考虑在Broswer环境下执行

(function(gobal) {

    var root = gobal,

        //获取几个原生对象的原型对象
        arrayProto = Array.prototype,
        objProto = Object.prototype,
        funProto = Function.prototype,

        //常用的原型方法的引用
        hasOwn = objProto.hasOwnProperty,
        toString = objProto.toString,
        slice = arrayProto.slice;

    // Create a safe reference to the Underscore object for use below.
    var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
    };

    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object.
    if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
    } else {
    root._ = _;
    }

    var nativeForEach = arrayProto.forEach;

    var bindFunContext = function(func, context) {
        if(context === void 0) return func;
        return function() {
            return func.apply(context, arguments);
        }
    }

    var isArrayLike = function(collection) {
        var length = collection && collection.length;
        return typeof length == 'number' && length >= 0;
    };

    //Collections Functions

    _.each = function(obj, iteratee, context) {
        iteratee = bindFunContext(iteratee, context);
        var i, length;
        if(isArrayLike(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
                iteratee(obj[i], i, obj);
            };
        }else {
            var keys = _.keys(obj);
            for (var i = 0, length = keys.length; i < length; i++) {
                iteratee(obj[keys[i]], keys[i], obj);
            };
        }
        // 根据api要求返回obj,可以进行链式调用
        return obj;
    };

    _.map = function(list, iteratee, context) {
        iteratee = bindFunContext(iteratee, context);
        var i, length, result = {};
        if(isArrayLike(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
                result[i] = iteratee(obj[i], i, obj);
            };
        }else {
            var keys = _.keys(obj);
            for (var i = 0, length = keys.length; i < length; i++) {
                result[i] = iteratee(obj[keys[i]], keys[i], obj);
            };
        }
        return result;
    };

    // 返回第一个符合要求的元素/属性值,没有的话返回undefined
    _.find = function(obj, predicate, context) {
        predicate = bindFunContext(predicate, context);
        var i, keys, length;
        if(isArrayLike(obj)) {
            keys = obj;
        }else {
            keys = _.keys(obj);
        }
        for (i = 0, length = keys.length; i < length; i++) {
            if(predicate(obj[i], i, obj)) {
                return obj[i]
            }
        };
    };

    // 返回一个数组,包括所有通过检验的值,predicate有可能是函数,数组和对象
    _.filter = function(obj, predicate, context) {
        var result = [];
        // predicate
    };

    // Object Functions

    // 返回obj的所有key值数组,如果obj不是object类型,返回空数组
    // 这里在IE < 9 会有一个bug,暂时先忽略
    _.keys = function(obj) {
        if(!_.isObject(obj)) return [];
        if(Object.keys && typeof Object.keys === "function") {
            return Object.keys(obj);
        }
        var result = []
        for (var key in obj) {
            if(hasOwn.call(obj, key)) { // 排除继承而来的属性
                result.push(key);
            }
        };

        return result;
    };

    // 继承而来的属性也包含进来
    _.allKeys = function(obj) {
        if(!_.isObject(obj)) return [];
        if(Object.keys && typeof Object.keys === "function") {
            return Object.keys(obj);
        }
        var result = []
        for (var key in obj) {
            result.push(key);
        };

        return result;
    };

    // 返回自身属性的所有值
    _.values = function(obj) {
        var result = [];
        if(!_.isObject(obj)) return result;
        for (var key in obj) {
            if(hasOwn.call(obj, key)) {
                result.push(obj[key]);
            }
        };

        return result;
    };

    // 遍历一个对象的所有自身的属性,返回处理值过后的对象
    _.mapObject = function(obj, iteratee, context) {
        iteratee = bindFunContext(iteratee, context);
        var result = {},
            key;
        for(key in obj) {
            if(hasOwn.call(obj, key)) {
                result[key] = iteratee(obj[key], key, obj)
            }
        }
        return result;
    };

    _.pairs = function(obj) {
        var keys = _.keys(obj),
            length = keys.length,
            result = new Array(keys.length);

        for (var i = length - 1; i >= 0; i--) {
            result[i] = [keys[i], obj[keys[i]]]
        };
        return result;
    };

    // 把对象的 key 和 value 反转,value成为key,key成为value
    _.invert = function(obj) {
        var result = {},
            keys = _.keys(obj);

        for (var i = keys.length - 1; i >= 0; i--) {
            result[obj[keys[i]]] = keys[i];
        };
        return result;
    };

    // 返回一个经过排序的数组,数组元素是所有obj的方法的名字.
    _.functions = function(obj) {
        var keys = _.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            if(_.isFunction(keys[i])) {
                keys.splice(i, 1);
            }
        };
        return keys.sort();
    };

    // 找出obj中符合要求第一个属性,返回属性key值
    _.findKey = function(obj, predicate, context) {
        predicate = bindFunContext(predicate, context);
        var keys = _.keys(obj),
            key;
        for (var i = keys.length - 1; i >= 0; i--) {
            key = keys[i];//把key值缓存起来,就算key在predicate函数中被改变了也能正确返回
            if(predicate(obj[key], key, obj)) return key;
        };
    };

    // 把null当成空对象,如果dest是null但是source存在,也能返回合并后的对象
    _.extend = function(dest) {
        if(dest == null && arguments.length < 2) return {};//形参只有一个null,返回空对象{}
        dest = (dest == null)? {} : dest;
        for (var i = 1; i < arguments.length; i++) {
            var keys = _.allKeys(arguments[i]),
                source = arguments[i];
            for (var j = 0; j < keys.length; j++) {
                dest[keys[j]] = source[j];
            };
        };
        return dest;
    };

    // 同extend,但是只复制自身的属性
    _.extendOwn = function(dest) {
        if(dest == null && arguments.length < 2) return {};
        dest = (dest == null)? {} : dest;
        for (var i = 1; i < arguments.length; i++) {
            var keys = _.keys(arguments[i]),
                source = arguments[i];
            for (var j = 0; j < keys.length; j++) {
                dest[keys[j]] = source[j];
            };
        };
        return dest;
    };

    // 选出经过白名单或者方法过滤的属性
    _.pick = function() {
        var args = slice.call(arguments),
            source = args.shift(),
            result = {},
            whiteList = [];
        if(_.isEmpty(source) || source == null) return {};

        // 如果是通过"属性白名单/数组"筛选
        if(_.isArray(args[0]) || args.length >= 1) {
            // 如果是数组取第一个元素合并,否则直接合并args
            if(_.isArray(args[0])) {
                whiteList = whiteList.concat(args[0]);
            }else {
                whiteList.concat(args);
            }
            for (var i = whiteList.length - 1; i >= 0; i--) {
                var key = whiteList[i]
                if(source[key]) {
                    result[key] = source[key]
                }
            };
            return result;
        }

        // 通过函数返回值筛选
        if(_.isFunction(args[0])) {
            var keys = _.keys(source),
                cb = args[0];
            for (var i = keys.length - 1; i >= 0; i--) {
                var key = keys[i]
                if(cb(source[key], key, source)) {
                    result[key] = source[key]
                }
            };
            return result;
        }
        return result;
    };

    // 和pick方法相反,用黑名单来筛选对象的属性
    // 这个写法改变了传进来的source对象,不能用
    _.omit1 = function() {
        var args = slice.call(arguments),
            source = args.shift(),
            result = {},
            whiteList = [];
        if(_.isEmpty(source) || source == null) return {};

        // 如果是通过"属性白名单/数组"筛选
        if(_.isArray(args[0]) || _.isString(args[0])) {
            // 如果是数组取第一个元素合并,否则直接合并args
            if(_.isArray(args[0])) {
                whiteList = whiteList.concat(args[0]);
            }else {
                whiteList.concat(args);
            }
            for (var i = whiteList.length - 1; i >= 0; i--) {
                var key = whiteList[i]
                if(source[key]) {
                    delete source[key]
                }
            };
            return source;
        }

        // 通过函数返回值筛选
        if(_.isFunction(args[0])) {
            var keys = _.keys(source),
                cb = args[0];
            for (var i = keys.length - 1; i >= 0; i--) {
                var key = keys[i]
                if(cb(source[key], key, source)) {
                    delete source[key]
                }
            };
            return source;
        }
        return source;
    };

    _.omit = function() {

    };

    // _.defaults(object, *defaults)
    // 类似extend,但是只会把object不存在的属性复制过来
    _.defaults = function(dest) {
        if(dest == null && arguments.length < 2) return {};//形参只有一个null,返回空对象{}
        dest = (dest == null)? {} : dest;
        for (var i = 1; i < arguments.length; i++) {
            var keys = _.allKeys(arguments[i]),
                source = arguments[i];
            for (var j = 0; j < keys.length; j++) {
                if(dest[keys[j]] === void 0) {
                    dest[keys[j]] = source[j];
                }
            };
        };
        return dest;
    };

    // 一个浅复制,包括数组对象
    _.clone = function(obj) {
        if(!_.isObject(obj)) return obj;
        return (_.isArray(obj))? obj.slice() : _.extend({}, obj);
    };

    // 用curry化处理过的,根据key和obj返回obj[key]的值
    _.property = function(key) {
        return function(obj) {
            return (obj == null)? void 0 : obj[key];
        };
    };

    _.propertyOf = function(obj) {
        return obj == null ? function(){} : function(key) {
          return obj[key];
        };
    };

    // 官网写着这是一个对hasOwnProperty的安全引用,不太清楚什么意思
    // 先考虑普通的是实现
    _.has = function(obj, key) {
        return obj !== null && hasOwn.call(obj, key);
    };

    // Tells you if the keys and values in properties are contained in object.
    _.isMatch = function(obj, prop) {
        if(obj == null) return false;
        for (var key in prop) {
            if(hasOwn.call(prop, key)) {
                return prop[key] === obj[key] && obj[key] !== "undefined";
            }
        };
    };

    // 判断一个可枚举的对象是否是空的,包括字符串、类数组、对象和数组
    _.isEmpty = function(obj) {
        if(obj.length && obj.length === 0) return true;
        for (var i in obj) {
            return false;
        };
        return true;
    };

    // 判断对象是否是一个dom节点
    // fixed:经过测试,nodeType的类型必须是 数字1~12
    _.isElement = function(obj) {
        return obj && obj.nodeType === 1;
    };

    // 如果对象是数组,则返回true
    _.isArray = function(obj) {
        return toString.call(obj) === '[object Array]';
    };

    // 判断obj是否是一个对象,注意在js里面Array和Function是对象
    _.isObject = function(obj) {
        return _.isArray(obj) || _.isFunction(obj) || toString.call(obj) === '[object Object]'
    };

    // 检测是否obj是否是arguments对象,在IE < 9 里不能通过Object的toString方法检测,
    // 因为IE < 9没有[object Arguments]
    // 此时要通过arguments特有的属性callee来检查
    _.isArguments = function(obj) {
        return toString.call(obj) === '[object Arguments]' || !!obj.callee;
    };

    // 判断obj是否是一个方法
    _.isFunction = function(obj) {
        return toString.call(obj) === '[object Function]';
    };

    // 如果obj是否是字符串,则返回true
    _.isString = function(obj) {
        return toString.call(obj) === '[object String]';
    };

    // 如果obj是否是数字,则返回true
    _.isNumber = function(obj) {
        return toString.call(obj) === '[object Number]';
    };

    // 判断obj是否是有限的数字
    _.isFinite = function(obj) {
        return isFinite(obj);
    };

    _.isBoolean = function(obj) {
        return toString.call(obj) === '[object Boolean]';
    };

    _.isDate = function(obj) {
        return toString.call(obj) === '[object Date]';
    };

    _.isRegExp = function(obj) {
        return toString.call(obj) === '[object RegExp]';
    };

    _.isError = function(obj) {
        return toString.call(obj) === '[object Error]';
    };

    // 按照文档描述,这个原生的isNaN方法不一样,只会在obj真正是NaN的时候返回true
    // 而原生的isNaN方法会把undefined也返回true
    _.isNaN = function(obj) {
        // 思路是先用原生判断isNaN,再判断obj不是undefined
        return isNaN(obj) && typeof obj !== "undefined";
    };

    _.isNull = function(obj) {
        return obj === null;
    };

    // 利用void 0  来获取纯正的 undefined
    _.isUndefined = function(obj) {
        return obj === void 0;
    };


})(window);