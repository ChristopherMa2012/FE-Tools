(function (window, document) {
  // 数组去重
  Array.prototype.removDuplicate = function () {
    var newArr = []
    for (var i = 0; i < this.length; i++) {
      newArr.indexOf(this[i]) < 0 && newArr.push(this[i])
    }
    return newArr
  }

  //Dom选择器
  window.$ = function (selector) {
    var selectorArr = selector.split(" ");
    //判断是否元素选择器
    var tarSelector = selectorArr[selectorArr.length - 1];
    var regReslut = tagsStr.indexOf(tarSelector) > 0;
    if (regReslut && selectorArr.length == 1) {
      return document.getElementsByTagName(selector);
    }
    var selectorType = tarSelector.substr(0, 1);
    //id选择器
    if (selectorType === '#' && selectorArr.length == 1) {
      return document.getElementById(tarSelector.substr(1))
    }
    //类选择器
    if (selectorType === '.') {
      return document.getElementsByClassName(tarSelector.substr(1))
    }
    console.error('"' + selector + '"' + ' selector is not right');
  }

  //事件绑定
  Element.prototype.on = function (eventType, callback, callbackParam) {
    if (!!Element.prototype.addEventListener) {
      Element.prototype.addEventListener.call(this, eventType, cb);
      return;
    }
    if (!!Element.prototype.attachEvent) {
      Element.prototype.attachEvent.call(this, 'on' + eventType, cb);
      return;
    }
    function cb (e) {
      //参数挂载
      e.paramObj = callbackParam
      callback(e);
    }
    Element.prototype.on = undefined;
    console.error('"on" function is not define');
  }

  //事件绑定
  HTMLCollection.prototype.on = function (eventType, callback, callbackParam) {
    if (!!Element.prototype.addEventListener) {
      Array.prototype.forEach.call(this, function (item) {
        Element.prototype.addEventListener.call(item, eventType, cb);
      })
      return;
    }
    if (!!Element.prototype.attachEvent) {
      Array.prototype.forEach.call(this, function (item) {
        Element.prototype.attachEvent.call(item, eventType, cb);
      })
      return;
    }
    function cb (e) {
      //参数挂载
      e.paramObj = callbackParam
      callback(e);
    }
    HTMLCollection.prototype.on = undefined;
    console.error('"on" function is not define');
  }

  //事件移除
  Element.prototype.rmon = function (eventType) {
    if (!!Element.prototype.removeEventListener) {
      if (this instanceof HTMLCollection) {
        Array.prototype.forEach.call(this, function (item) {
          Element.prototype.removeEventListener.call(item, eventType, cb);
        })
      } else {
        Element.prototype.removeEventListener.call(this, eventType, cb);
      }
    }
    if (!!Element.prototype.detachEvent) {
      if (this instanceof HTMLCollection) {
        Array.prototype.forEach.call(this, function (item) {
          Element.prototype.detachEvent.call(item, eventType, cb);
        })
      } else {
        Element.prototype.detachEvent.call(this, 'on' + eventType, cb);
      }
      return;
    }
    Element.prototype.rmon = undefined;
    console.error('"rmon" function is not define');

  }

  //元素到文档顶部左侧的距离对象
  Element.prototype.getDistanceToDocObj = function () {
    var self = this;
    var top = 0;
    var left = 0;
    while (!!self) {
      top += self.offsetTop;
      left += self.offsetLeft;
      self = self.offsetParent;
    }
    return this.distanceToDocObj = {
      toTop: top,
      toLeft: left
    }
  }

  //元素到浏览器窗口顶部的距离
  Element.prototype.getDistanceToWinObj = function () {
    var self = this;
    var top = document.body.scrollTop || document.documentElement.scrollTop;
    var left = document.body.scrollLeft || document.documentElement.scrollLeft;
    return self.distanceToWinObj = {
      toTop: self.getDistanceToDocObj().toTop - top,
      toLeft: self.getDistanceToDocObj().toLeft - left
    }
  }

  //DOM节点插入
  Element.prototype.domInsert = function (domStr) {
    var temDom = document.createElement('div');
    temDom.innerHTML = domStr;
    Element.prototype.appendChild.call(this,temDom.children[0]);
    temDom =  null;
  }
})(window, document)