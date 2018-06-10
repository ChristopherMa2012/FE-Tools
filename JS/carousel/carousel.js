(function (window) {

  function Carousel () {
    this.carouselContainer = null;
    this.carousel = null;
    this.duration = 3000;
    this.image = null;
    this.imageArr = [];
    this.lastimage = null;
    this.imageNum = 0;
    this.imageWidth = 0;
    this.curIndex = 1;
    //下标
    this.subLabelCon = null;
    this.subLabelArr = [];

    //定时器句柄
    this.interHandler = null;
    //是否反方向
    this.negative = false;
    //动画是否完成
    this.isTransitionFinish = true;
    //定时器句柄
    this.timeoutHandler = null;
  }


  Carousel.prototype.subLabelStyleStr = 'display: inline;width: 10px;height: 10px;border-radius: 50%;background-color: lightgrey;opacity: 0.6;float: left;margin-right: 5px;transition:all 2s ease;';
  Carousel.prototype.picSwitch = function () {

  };
  Carousel.prototype.setInter = function (duration) {
    var _self = this;
    return setInterval(function () {
      // if(_self.curIndex > _self.imageNum){
      //   console.log('大于3' + _self.curIndex);          
      //   _self.curIndex = 1;
      // }
      _self.getCurIndex();
      _self.transitionFun();
      _self.curIndex++;
    }, duration);
  };
  Carousel.prototype.getCurIndex = function () {
    return this.curIndex = this.curIndex <= 0 ? this.imageNum : (this.curIndex > this.imageNum ? 0 : this.curIndex);
  };
  Carousel.prototype.getPreIndex = function () {
    if (!this.negative) {
      return this.curIndex <= 0 ? this.imageNum - 1 : this.curIndex - 1;
    } else {
      return this.curIndex >= this.imageNum - 1 ? 1 : this.curIndex + 1;
    }
  };
  Carousel.prototype.getNextIndex = function () {
    if (!this.negative) {
      return this.curIndex >= this.imageNum ? 1 : this.curIndex + 1;
    } else {
      return this.curIndex <= 1 ? this.imageNum : this.curIndex - 1;
    }
  };
  Carousel.prototype.getDisplaymentDistance = function () {
    return !this.negative ? this.imageWidth * (this.curIndex + 1) : this.imageWidth * (this.curIndex - 1);
  };
  Carousel.prototype.transitionFun = function () {
    this.imageArr[this.curIndex].style = 'opacity:0;transition:all 2s ease;';
    this.imageArr[this.getNextIndex()].style = 'opacity:1;transition:all 2s ease;';
    this.subLabelArr[this.curIndex - 1].style = this.subLabelStyleStr;
    this.subLabelArr[this.getNextIndex() - 1].style = this.subLabelStyleStr + 'background-color:red';
    this.carousel.style = 'left:-' + this.getDisplaymentDistance() + 'px;background:black;transition:left  2s ease-in-out;position:absolute';
  };
  Carousel.prototype.transitionEnd = function (e) {
    if(e.propertyName !== 'left'){
      return;
    }
    var _self = e.paramObj.carousel;
    _self.isTransitionFinish = true;          
    if (_self.interHandler || !_self.negative ) {
      if(!_self.interHandler && !_self.negative){
        _self.timeoutHandler =  setTimeout(function(){
          _self.interHandler = _self.setInter(_self.duration);
        },1000);
      }
      if (_self.curIndex < _self.imageNum + 1) {
        return;
      }
      _self.curIndex = 1;
      _self.carousel.style = 'left:-' + _self.imageWidth + 'px;position:absolute';
      _self.imageArr[0].style = 'opacity:1;';
      return;
    }
    _self.negative = false;    
    _self.timeoutHandler = setTimeout(function(){
      _self.interHandler =  _self.setInter(_self.duration);
    },1000);    
    if (_self.curIndex >= 1) {
      return;
    }
    _self.curIndex = _self.imageNum;
    _self.carousel.style = 'left:-' + _self.imageWidth * _self.imageNum + 'px;position:absolute';
    _self.imageArr[_self.imageNum - 1].style = 'opacity:1;';

    return;
  };
  Carousel.prototype.start = function () {
    var _self = this;
    _self.carousel.on('transitionend', _self.transitionEnd, { carousel: _self });
    _self.interHandler = _self.setInter(_self.duration);

  };
  Carousel.prototype.createSubLabel = function () {
    var con = document.createElement('div');
    con.style = 'position: absolute;overflow: hidden;clear: both;left: 50%;bottom: 15px;transform: translateX(-50%);';
    var point = document.createElement('i');
    point.style = this.subLabelStyleStr;
    for (var i = 0; i < this.imageNum; i++) {
      con.appendChild(point.cloneNode(true));
    }
    this.carouselContainer.appendChild(con);
    this.subLabelCon = con;
    this.subLabelArr = con.children;
    // var _self = this;
    // con.on('click',function(e){
    //   var iDom = e.target;
    //   var temArr = Array.prototype.slice.call(_self.subLabelArr);
    //   var index = temArr.indexOf(iDom);
    //   this.imageArr[this.curIndex].style = 'opacity:0;transition:all 2s ease;';
    //   this.imageArr[index + 1].style = 'opacity:1;transition:all 2s ease;';
    //   this.subLabelArr[this.curIndex - 1].style = this.subLabelStyleStr;
    //   this.subLabelArr[index].style = this.subLabelStyleStr + 'background-color:red';
    //   this.carousel.style = 'left:-' + _self.imageWidth * (index + 1) + 'px;background:black;transition:left  2s ease-in-out;position:absolute';  
    //   _self.curIndex = index + 1;
    // });    
    this.subLabelArr[0].style = this.subLabelStyleStr + 'background-color:red';
    con = null;
  };
  Carousel.prototype.createArrow = function () {
    var _self = this;
    var leftArrow = document.createElement('div');
    var styleStr = 'width:60px;height:100px;line-height:100px;cursor:pointer;opacity:0.4;background-color:'
      + 'lightgrey;font-size:24px;position:absolute;top:50%;transform:translateY(-50%);text-align:center;';
    leftArrow.style = styleStr + 'left:0;';
    leftArrow.innerText = '<';
    var rightArrow = document.createElement('div');
    rightArrow.style = styleStr + 'right:0';
    rightArrow.innerText = '>';
    leftArrow.on('click', function () {
      if(!_self.isTransitionFinish) return;    
      _self.timeoutHandler && clearTimeout(_self.timeoutHandler);
      _self.timeoutHandler = null;  
      _self.interHandler && clearInterval(_self.interHandler);
      _self.interHandler = null;
      _self.negative = true;
      _self.isTransitionFinish = false;         
      _self.transitionFun();
      _self.curIndex--;
    });
    rightArrow.on('click',function(){
      if(!_self.isTransitionFinish) return;
      // _self.negative = false;
      _self.timeoutHandler && clearTimeout(_self.timeoutHandler);
      _self.timeoutHandler = null;        
      _self.interHandler && clearInterval(_self.interHandler);
      _self.interHandler = null;
      _self.negative = false;
      _self.isTransitionFinish = false;      
      _self.transitionFun();
      _self.curIndex++;    
    });
    this.carouselContainer.appendChild(leftArrow);
    this.carouselContainer.appendChild(rightArrow);
    leftArrow = null;
    rightArrow = null;
  };
  Carousel.prototype.init = function (opts) {
    this.carouselContainer = $(opts.selector);
    this.carousel = this.carouselContainer.children[0];
    this.imageArr = this.carousel.children;
    this.image = this.imageArr[0];
    this.imageNum = this.imageArr.length;
    this.lastimage = this.imageArr[this.imageNum - 1];
    this.imageWidth = this.image.offsetWidth;
    var lastImageIndex = this.imageArr.length - 1;
    this.carousel.insertBefore(this.imageArr[lastImageIndex].cloneNode(true), this.imageArr[0]);
    this.carousel.appendChild(this.image.cloneNode(true));
    this.carousel.style = 'left:-' + this.imageWidth + 'px;background:black;transition:left  2s ease-in-out;position:absolute';
    this.createSubLabel();
    this.createArrow();
    this.start();
  };

  window.Carousel = Carousel;
})(window);