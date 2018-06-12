/*
 * @Author: chris 
 * @Date: 2018-05-31 19:58:30 
 * @Last Modified by: chris
 * @Last Modified time: 2018-06-12 21:50:38
 */
(function (window) {
  var ajax = {};
  ajax.setting = {};

  function defineProSetting (callback) {
    return {
      enumerable: true,
      set: function (newVal) {
        this.value = newVal;
        callback && callback();
      },
      get: function () {
        return this.value;
      }
    };
  }
  Object.defineProperties(ajax.setting, {
    xhrDefaultInitCount: defineProSetting(xhrPoolInit),
    timeout: defineProSetting()
  });

  //执行环境
  ajax.isXdr = window.navigator.userAgent.indexOf('MSIE 9.0') > 0 || window.navigator.userAgent.indexOf('MSIE 8.0') > 0;
  //xhr对象池
  ajax.xhrPool = [];
  //空闲xhr对象索引
  ajax.freeXhrIndexArr = [];

  //请求初始设置 - 初始化xhr池
  ajax.setting.xhrDefaultInitCount = 2;
  ajax.setting.timeout = 8000;
  window.navigator.userAgent.indexOf('MSIE 8.0') > 0 && xhrPoolInit();


  //xhr对象池初始化
  function xhrPoolInit () {
    var len = ajax.setting.xhrDefaultInitCount;
    ajax.xhrPool = [];
    ajax.freeXhrIndexArr = [];
    for (var i = 0; i < len; i++) {
      ajax.xhrPool.push(getXhr());
      ajax.freeXhrIndexArr.push(i);
    }
  }

  //从xhr池获取空闲xhr对象
  function getFreeXhrFromXhrPool () {
    if (ajax.freeXhrIndexArr.length > 0) {
      var xhrObj = ajax.xhrPool[ajax.freeXhrIndexArr[0]];
      ajax.freeXhrIndexArr.shift();
      return xhrObj;
    }
    var newXhr = getXhr();
    ajax.xhrPool.push(newXhr);
    return newXhr;
  }

  //获取xhr或xdr对象 
  function getXhr () {
    //ie8、ie9  XDomainRequest
    if (ajax.isXdr) {
      var xdr = new XDomainRequest();
      xdr.timeout = ajax.setting.timeout;
      xdr.ontimeout = function () {
        console.error('请求超时');
        xdr.abort();
      };
      xdr.onprogress = function (res) {
        console.log(res);
      };
      xdr.onerror = function () {
        console.error('请求错误--onerror');
      };
      return xdr;
    } else if ('XMLHttpRequest' in window) {
      var xhr = new XMLHttpRequest();
      return xhr;
    } else {
      throw new Error('不存在XMLHttpRequest或XDomainRequest');
    }
  }

  function objToStr (data) {
    if (data == null || data == undefined) return;
    var str = '';
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        str += key + '=' + data[key] + '&';
      }
    }
    return str.slice(0, -1);
  }

  //使用xdr发起请求
  function xdrOpen (opts) {
    if (opts.method === 'post') {
      console.error('XDomainRequest 不支持post请求方式传递参数！');
      return;
    }
    var xdr = getFreeXhrFromXhrPool();
    xdr.onload = function () {
      opts.success(JSON.parse(xdr.responseText));
      ajax.freeXhrIndexArr.push(ajax.xhrPool.indexOf(xdr));
    };
    opts.url += opts.data == undefined ? '' : '?' + encodeURIComponent(objToStr(opts.data));
    console.log(opts.url);
    xdr.open(opts.method, opts.url);
    setTimeout(function () {
      xdr.send();
    }, 0);
  }

  //使用xhr发起请求
  function xhrOpen (opts) {
    var xhr = getFreeXhrFromXhrPool();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        opts.success(JSON.parse(xhr.responseText));
        ajax.freeXhrIndexArr.push(ajax.xhrPool.indexOf(xhr));
        console.log(ajax.xhrPool.indexOf(xhr));
      }
    };
    xhr.open(opts.method, opts.url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(objToStr(opts.data));
  }

  //请求方法request
  ajax.request = function (opts) {
    this.isXdr ? xdrOpen(opts) : xhrOpen(opts);
  };

  //请求方法request
  ajax.get = function (url, data, successCB, failCB) {
    var opts = {
      method: 'get',
      url: url,
      data: data,
      success: successCB,
      fail: failCB
    };
    this.isXdr ? xdrOpen(opts) : xhrOpen(opts);
  };

  ajax.post = function (url, data, successCB, failCB) {
    var opts = {
      method: 'post',
      url: url,
      data: data,
      success: successCB,
      fail: failCB
    };
    this.isXdr ? xdrOpen(opts) : xhrOpen(opts);
  };
  window.ajax = ajax;
})(window);