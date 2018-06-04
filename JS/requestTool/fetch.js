/*
 * @Author: chris 
 * @Date: 2018-05-31 19:58:30 
 * @Last Modified by: chris
 * @Last Modified time: 2018-06-05 01:28:48
 */
(function (window) {
  var obtain = {};
  //请求初始设置
  obtain.setting = {
    xhrDefaultInitCount: 2,
    timeout: 8000
  };
  //执行环境
  obtain.isXdr = window.navigator.userAgent.indexOf('MSIE 9.0') > 0 || window.navigator.userAgent.indexOf('MSIE 8.0') > 0;
  //xhr对象池
  obtain.xhrPool = [];
  //空闲xhr对象索引
  obtain.freeXhrIndexArr = [];

  //xhr对象池初始化 
  xhrPoolInit();

  //xhr对象池初始化
  function xhrPoolInit () {
    var len = obtain.setting.xhrDefaultInitCount;
    for (var i = 0; i < len; i++) {
      obtain.xhrPool.push(getXhr());
      obtain.freeXhrIndexArr.push(i);
    }
  }

  //从xhr池获取空闲xhr对象
  function getFreeXhrFromXhrPool () {
    if (obtain.freeXhrIndexArr.length > 0) {
      var xhrObj = obtain.xhrPool[obtain.freeXhrIndexArr[0]];
      obtain.freeXhrIndexArr.shift();
      return xhrObj;
    }
    var newXhr = getXhr();
    obtain.xhrPool.push(newXhr);
    return newXhr;
  }

  //获取xhr或xdr对象 
  function getXhr () {
    //ie8、ie9  XDomainRequest
    if (obtain.isXdr) {
      var xdr = new XDomainRequest();
      xdr.timeout = obtain.setting.timeout;
      xdr.ontimeout = function () {
        console.error('请求超时');
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

  //使用xdr发起请求
  function xdrOpen (opts) {
    var xdr = getFreeXhrFromXhrPool();
    xdr.onload = function () {
      opts.callback(JSON.parse(xdr.responseText));
      obtain.freeXhrIndexArr.push(obtain.xhrPool.indexOf(xdr));
      console.log(obtain.xhrPool.indexOf(xdr));
    };
    xdr.open(opts.method, opts.url + '?random=' + Math.random());
    setTimeout(function () {
      xdr.send(opts.data);
    }, 0);
  }

  //使用xhr发起请求
  function xhrOpen (opts) {
    var xhr = getFreeXhrFromXhrPool();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        opts.callback(JSON.parse(xhr.responseText));
        obtain.freeXhrIndexArr.push(obtain.xhrPool.indexOf(xhr));
        console.log(obtain.xhrPool.indexOf(xhr));
      }
    };
    xhr.open(opts.method, opts.url + '?random=' + Math.random());
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(opts.data);
  }

  //请求方法request
  obtain.request = function (opts) {
    this.isXdr ? xdrOpen(opts) : xhrOpen(opts);
  };

  //请求方法request
  obtain.get = function (url) {
    var opts = {
      method: 'get',
      url: url
    };
    this.isXdr ? xdrOpen(opts) : xhrOpen(opts);
  };

  window.obtain = obtain;
})(window);