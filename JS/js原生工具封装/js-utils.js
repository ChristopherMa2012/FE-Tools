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
  window.$ = function(selector) {
    var selectorArr = selector.split(" ");
    //判断是否元素选择器
    var regReslut = tagsStr.indexOf(selectorArr[selectorArr.length - 1]) > 0;
    if(regReslut){
      return document.getElementsByTagName(selector);
    }
    var selectorType = selector.substr(0,1);
    //id选择器
    if (selectorType === '#') {
      return document.getElementById(selector.substr(1))
    }
    //类选择器
    if(selectorType === '.'){
      return document.getElementsByClassName(selector.substr(1))
    }
    console.error('"' + selector + '"' + ' selector is not right');
  }
  
  //元素到文档顶部左侧的距离对象
  Element.prototype.getDistanceToDocObj = function(){
    var self = this;
    var top = 0;
    var left = 0;
    while(!!self){
      top += self.offsetTop;
      left += self.offsetLeft;
      self = self.offsetParent;
    }
    return  this.distanceToDocObj = {
      toTop: top,
      toLeft: left
    }
  }

  //元素到浏览器窗口顶部的距离
  Element.prototype.getDistanceToWinObj = function(){
    var self = this;
    var top = document.body.scrollTop || document.documentElement.scrollTop;
    var left = document.body.scrollLeft || document.documentElement.scrollLeft;
    return self.distanceToWinObj = {
       toTop: self.getDistanceToDocObj().toTop - top,
       toLeft: self.getDistanceToDocObj().toLeft -  left
    }
  }
})(window, document)