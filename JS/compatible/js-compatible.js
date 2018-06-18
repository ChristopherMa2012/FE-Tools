/*
 * @Author: chris 
 * @Date: 2018-05-31 19:59:15 
 * @Last Modified by: chris
 * @Last Modified time: 2018-06-18 23:41:31
 */
(function (window, document) {
  window.tagsStr = 'html,head,body,title,meta,style,script,link,div,span,img,a,abbr,acronym,'
    + 'applet,address,area,article,aside,audio,b,base,basefont,bdi,bdo,big,'
    + 'blockquote,br,button,canvas,caption,center,cite,code,col,colgroup,'
    + 'command,datalist,dd,del,details,dfn,dialog,dir,dl,dt,em,embed,fieldset,'
    + 'figcaption,figure,font,footer,form,frame,frameset,h1,h2,h3,h4,h5,h6,header,'
    + 'hr,i,iframe,input,ins,kbd,keygen,label,legend,li,main,map,mark,menu,menuitem,'
    + 'meter,nav,noframes,noscript,object,ol,optgroup,option,output,p,param,pre,progress,'
    + 'q,rp,rt,ruby,s,samp,section,select,small,source,strike,strong,sub,table,tbody,td,'
    + 'textarea,tfoot,th,thead,time,tr,track,tt,u,ul,var,video,wbr';

  var arrProto = Array.prototype;
  var objProto = Object.prototype;

  // 数组实例 indexOf方法兼容
  !arrProto.indexOf && (arrProto.indexOf = function (targetEle, fromIndex) {
    console.warn('使用的是Array.indexOf兼容版本');
    var k;
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    var O = Object(this);
    var len = O.length >>> 0;
    if (len === 0) {
      return -1;
    }
    var n = +fromIndex || 0;
    if (Math.abs(n) === Infinity) {
      n = 0;
    }
    if (n >= len) {
      return -1;
    }
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
    while (k < len) {
      if (k in O && O[k] === targetEle) {
        return k;
      }
      k++;
    }
    return -1;
  });

  //  数组实例 forEach方法兼容
  !arrProto.forEach && (arrProto.forEach = function (callback) {
    console.warn('使用的是Array.forEach兼容版本');
    for (var i = 0; i < this.length; i++) {
      callback(this[i], i, this);
    }
  });

  // 数组实例 includes方法兼容
  !arrProto.includes && (arrProto.includes = function (targetEle) {
    console.warn('使用的是Array.includes兼容版本');
    return arrProto.indexOf.call(this, targetEle) > 0 ? true : false;
  });

  //数组Array.from方法兼容
  !Array.from && (Array.from = function (param) {
    console.warn('使用的是Array.from兼容版本');
    return arrProto.slice.call(param);
  });

  //数组Array.of方法兼容
  !Array.of && (Array.of = function () {
    console.warn('使用的是Array.of兼容版本');
    return Array.from(arguments);
  });

  //数组Array.isArray兼容
  !Array.isArray && (Array.isArray = function (target) {
    console.warn('使用的是Array.of兼容版本');
    return objProto.toString.call(target) === '[object Array]' ? true : false;
  });

  //Object.keys兼容
  if (typeof Object.keys !== 'function') {
    Object.keys = function (targetObj) {
      console.warn('使用的是Object.keys兼容版本');
      var temArr = [];
      for (var key in targetObj) {
        if (targetObj.hasOwnProperty(key)) {
          temArr.push(key);
        }
      }
      return temArr;
    };
  }

  //Object.defineProerties兼容
  if (typeof Object.defineProerties !== 'function') {
    Object.defineProperties = function (obj, properties) {
      console.warn('使用的是Object.defineProerties兼容版本');
      function convertToDescriptor (desc) {
        function hasProperty (obj, prop) {
          return objProto.hasOwnProperty.call(obj, prop);
        }

        function isCallable (v) {
          // NB: modify as necessary if other values than functions are callable.
          return typeof v === 'function';
        }

        if (typeof desc !== 'object' || desc === null)
          throw new TypeError('bad desc');

        var d = {};

        if (hasProperty(desc, 'enumerable'))
          d.enumerable = !!desc.enumerable;
        if (hasProperty(desc, 'configurable'))
          d.configurable = !!desc.configurable;
        if (hasProperty(desc, 'value'))
          d.value = desc.value;
        if (hasProperty(desc, 'writable'))
          d.writable = !!desc.writable;
        if (hasProperty(desc, 'get')) {
          var g = desc.get;

          if (!isCallable(g) && typeof g !== 'undefined')
            throw new TypeError('bad get');
          d.get = g;
        }
        if (hasProperty(desc, 'set')) {
          var s = desc.set;
          if (!isCallable(s) && typeof s !== 'undefined')
            throw new TypeError('bad set');
          d.set = s;
        }

        if (('get' in d || 'set' in d) && ('value' in d || 'writable' in d))
          throw new TypeError('identity-confused descriptor');

        return d;
      }

      if (typeof obj !== 'object' || obj === null)
        throw new TypeError('bad obj');

      properties = Object(properties);

      var keys = Object.keys(properties);
      var descs = [];

      for (var i = 0; i < keys.length; i++)
        descs.push([keys[i], convertToDescriptor(properties[keys[i]])]);

      for (var i = 0; i < descs.length; i++)
        Object.defineProperty(obj, descs[i][0], descs[i][1]);

      return obj;
    };
  }

  //Object.create兼容
  if (typeof Object.create !== 'function') {
    Object.create = function (proto, propertiesObject) {
      console.warn('使用的是Object.create兼容版本');
      if (typeof proto !== 'object' && typeof proto !== 'function') {
        throw new TypeError('Object prototype may only be an Object: ' + proto);
      }
      else if (proto === null) {
        throw new Error('This browser\'s implementation of Object.create is a shim and doesn\'t support \'null\' as the first argument.');
      }
      if (typeof propertiesObject != 'undefined') {
        throw new Error('This browser\'s implementation of Object.create is a shim and doesn\'t support a second argument.');
      }

      function F () { }
      F.prototype = proto;

      return new F();
    };
  }

  //Object.assign 兼容
  if (typeof Object.assign !== 'function') {
    Object.assign = function (target, source1, source2) {
      console.warn('使用的是Object.assign兼容版本，注意：该版本中，不包含操作目标对象的symbol属性')
      var args = arguments;
      var len = args.length;
      if (len < 2) {
        throw new TypeError('The function need at least two params');
      }
      // Object.keys(target)返回的是只包含可枚举的target自身的属性，不包含可枚举的Symbol属性。
      // 但ES6标准Object.assign是包含操作对象的Symbol属性的。
      for (var i = 1; i < len; i++) {
        Object.keys(args[i]).forEach(function (item) {
          target[item] = args[i][item];
        })
      }
      return target;
    }
  }

  //bind兼容
  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }

      var aArgs = arrProto.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () { },
        fBound = function () {
          return fToBind.apply(this instanceof fNOP
            ? this
            : oThis,
            // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
            aArgs.concat(arrProto.slice.call(arguments)));
        };

      // 维护原型关系
      if (this.prototype) {
        // Function.prototype doesn't have a prototype property
        fNOP.prototype = this.prototype;
      }
      fBound.prototype = new fNOP();

      return fBound;
    };
  }
})(window, document);
