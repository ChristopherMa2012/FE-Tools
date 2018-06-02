/*
 * @Author: chris 
 * @Date: 2018-05-31 19:59:22 
 * @Last Modified by:   chris 
 * @Last Modified time: 2018-05-31 19:59:22 
 */
//使用方法:  需要引入js-utils.js
(function (window, document) {

  window.Toucher =  function Toucher () {
    this.tarDom = null;
    this.sliderWidth = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.startX = 0;
    this.startY = 0;
    this.temX = 0;
    this.temY = 0;
  }

  Toucher.prototype.startAction = function (e) {
    var self = e.paramObj.self;
    self.startX = e.targetTouches[0].pageX;
  }

  Toucher.prototype.moveAction = function (e) {
    var self = e.paramObj.self;
    if (e.targetTouches.length == 1) {
      var touch = e.targetTouches[0];
      self.temX = self.currentX + touch.pageX - self.startX;
      self.tarDom.style.transform = 'translateX(' + self.temX + 'px)';
    }
  }

  Toucher.prototype.endAction = function (e) {
    var self = e.paramObj.self;
    var conLen = document.documentElement.offsetWidth;
    var handler = function (moveDistance) {
      self.currentX = moveDistance;
      self.tarDom.style.transition = 'transform  0.3s  ease';
      self.tarDom.style.transform = 'translateX(' + self.currentX + 'px)'
      setTimeout(function () {
        self.tarDom.style.transition = '';
      }, 300)
      return;
    }
    if (self.sliderWidth < conLen + Math.abs(self.temX)) {
      handler(conLen - self.sliderWidth)
    } else if (self.temX > 0) {
      handler(0);
    } else {
      self.currentX = self.temX;
    }
  }

  //opts = {
  // selector: 选择器
  // sliderWidth: 滑动对象的宽度
  // }
  Toucher.prototype.init = function (opts) {
    var dom = $(opts.selector);
    this.tarDom = dom.length > 0 ? dom[0] : dom;
    this.currentX = opts.left || this.tarDom.offsetLeft;
    this.currentY = opts.top || this.tarDom.offsetTop;
    this.sliderWidth = opts.sliderWidth || this.tarDom.offsetWidth;

    this.tarDom.on('touchstart', this.startAction, { self: this });
    this.tarDom.on('touchmove', this.moveAction, { self: this });
    this.tarDom.on('touchend', this.endAction, { self: this });
  }


})(window, document)