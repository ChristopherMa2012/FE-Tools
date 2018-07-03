
/*
 * @Author: chris 
 * @Date: 2018-05-31 19:49:36 
 * @Last Modified by: chris
 * @Last Modified time: 2018-06-20 16:54:08
 */
(function (window, document) {

  var arrayProto = Array.prototype;
  var eleProto = Element.prototype;

  function Query (originDom) {
    this.originDom = originDom;
    this.type = eleProto.toString.call(originDom);
  }

  Query.prototype = {
    //事件绑定
    on: function (eventType, callback, callbackParam) {
      var originDom = this.originDom;
      var eventListener = originDom.addEventListener || originDom.attachEvent;
      if (eventListener) {
        if (this.type === '[object HTMLCollection]' || this.type === '[object NodeList]') {
          arrayProto.forEach.call(originDom, function (item) {
            eventListener.call(item, eventType, cb);
          });
          return;
        }
        eventListener.call(originDom, eventType, cb);
        return;
      }
      function cb (e) {
        //参数挂载
        e.paramObj = callbackParam;
        callback(e);
      }
      originDom.on = undefined;
      console.error('"on" function is not define');
    },
    //移除事件绑定
    rmon: function (eventType, callback, callbackParam) {
      var originDom = this.originDom;
      var removeListener = eleProto.removeEventListener || eleProto.detachEvent;
      if (removeListener) {
        if (this.type === '[object HTMLCollection]' || this.type === '[object NodeList]') {
          arrayProto.forEach.call(originDom, function (item) {
            removeListener.call(item, eventType, cb);
          });
          return;
        }
        removeListener.call(originDom, eventType, cb);
      }
      function cb (e) {
        //参数挂载
        e.paramObj = callbackParam;
        callback(e);
      }
      eleProto.rmon = undefined;
      console.error('"rmon" function is not define');
    },
    //获取当前节点的子元素
    getChildren: function () {
      var self = this.originDom;
      var childrenArr = arrayProto.slice.call(self.children);
      return childrenArr.map(function (curItem) {
        return new Query(curItem);
      });
    },
    //克隆dom元素
    cloneNode: function (isDeepClone) {
      return new Query(this.originDom.cloneNode(isDeepClone));
    },
    //dom元素插入
    insertBefore: function (newDom, referrenceDom) {
      newDom = isQueryObj(newDom) ? newDom.originDom : newDom;
      referrenceDom = isQueryObj(referrenceDom) ? referrenceDom.originDom : referrenceDom;
      this.originDom.insertBefore(newDom,referrenceDom);
    },
    appendChild: function(dom){
      this.originDom.appendChild(isQueryObj(dom) ? dom.originDom : dom);
    },
    //元素到文档顶部左侧的距离对象    
    getDistanceToDocObj: function () {
      var self = this.originDom;
      var top = 0;
      var left = 0;
      while (self) {
        top += self.offsetTop;
        left += self.offsetLeft;
        self = self.offsetParent;
      }
      return this.distanceToDocObj = {
        toTop: top,
        toLeft: left
      };
    },
    //元素到浏览器窗口顶部的距离    
    getDistanceToWinObj: function () {
      var self = this.originDom;
      var top = document.body.scrollTop || document.documentElement.scrollTop;
      var left = document.body.scrollLeft || document.documentElement.scrollLeft;
      return self.distanceToWinObj = {
        toTop: self.getDistanceToDocObj().toTop - top,
        toLeft: self.getDistanceToDocObj().toLeft - left
      };
    },
    //DOM节点插入    
    domInsert: function (domStr) {
      var temDom = document.createElement('div');
      temDom.innerHTML = domStr;
      eleProto.appendChild.call(this.originDom, temDom.children[0]);
      temDom = null;
    },
    //当前元素的其他兄弟元素    
    sibling: function () {
      var _self = this.originDom;
      var childrens = null;
      if ('parentNode' in eleProto) {
        childrens = _self.parentNode.children;
      } else {
        childrens = _self.parentElement.children;
      }
      childrens = arrayProto.slice.call(childrens);
      childrens.splice(childrens.indexOf(_self), 1);
      return childrens;
    },
    //模拟点击事件
    click:function(){
      var event = document.createEvent('MouseEvents');
      event.initMouseEvent('click',true,true,document.defaultView,0,0,0,0,0,false,false,false,false,0,null);
      this.originDom.dispatchEvent(event);
    }
  };

  //Dom选择器
  window.$ = function (selector) {
    if( typeof selector === 'object'){
      return new Query(selector);
    }
    var selectorArr = selector.split(' ');
    //判断是否元素选择器
    var tarSelector = selectorArr[selectorArr.length - 1];
    var regReslut = tagsStr.indexOf(tarSelector) > 0;
    var originDom = null;
    if (regReslut && selectorArr.length == 1) {
      originDom = document.getElementsByTagName(selector);
      return new Query(originDom);
    }
    var selectorType = tarSelector.substr(0, 1);
    //id选择器
    if (selectorType === '#' && selectorArr.length == 1) {
      originDom = document.getElementById(tarSelector.substr(1));
      return new Query(originDom);
    }
    //类选择器
    if (selectorType === '.') {
      originDom = document.getElementsByClassName(tarSelector.substr(1));
      return new Query(originDom);
    }
    console.error('"' + selector + '"' + ' selector is not right');
  };

  //判断是否Query对象
  function isQueryObj (dom) {
    return dom instanceof Query;
  }

  // 数组去重
  arrayProto.removDuplicate = function () {
    var newArr = [];
    for (var i = 0; i < this.length; i++) {
      newArr.indexOf(this[i]) < 0 && newArr.push(this[i]);
    }
    return newArr;
  };


})(window, document);