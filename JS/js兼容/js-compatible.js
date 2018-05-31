/*
 * @Author: chris 
 * @Date: 2018-05-31 19:59:15 
 * @Last Modified by:   chris 
 * @Last Modified time: 2018-05-31 19:59:15 
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
    
  // 数组indexOf方法兼容
  !Array.prototype.indexOf && (Array.prototype.indexOf = function (targetEle, fromIndex) {
    var k
    if (this == null) {
      throw new TypeError('"this" is null or not defined')
    }
    var O = Object(this)
    var len = O.length >>> 0
    if (len === 0) {
      return -1
    }
    var n = +fromIndex || 0
    if (Math.abs(n) === Infinity) {
      n = 0
    }
    if (n >= len) {
      return -1
    }
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0)
    while (k < len) {
      if (k in O && O[k] === targetEle) {
        return k
      }
      k++
    }
    return -1
  })

  //  数组forEach方法兼容
  !Array.prototype.forEach && (Array.prototype.forEach = function (callback) {
    for (var i = 0; i < this.length; i++) {
      callback(this[i], i, this)
    }
  })

  // 数组includes方法兼容
  !Array.prototype.includes && (Array.prototype.includes = function (targetEle) {
    return Array.prototype.indexOf.call(this,targetEle) > 0 ? true : false;
  })


})(window, document)
