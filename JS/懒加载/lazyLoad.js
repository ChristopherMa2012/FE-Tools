function delayload(option){
            //读取参数
            //图片未加载时显示的图片
            var src = option.src ? option.src : '',
            //指定那些id下的img元素使用延迟显示
                id = option.id ? option.id : [];
            //图片列表
            var imgs = [];
            //获得所有的图片元素
            for(var i=0 ; i < id.length ; i++){
                var idbox = document.getElementById(id[i]),_imgs;
                if(idbox && (_imgs = idbox.getElementsByTagName('img'))){
                    for(var t=0 ; t < _imgs.length ; t++){
                        imgs.push(_imgs[t]);
                    }
                }
            }
            //将所有的图片设置为指定的loading图片
            for(var i=0 ; i < imgs.length ; i++){
                //图片本来的图片路径放入_src中
                imgs[i].setAttribute('_src',imgs[i].src);
                imgs[i].src = src;
            }
            //取元素的页面绝对 X位置
            var getLeft = function(El){
                var left = 0;
                do{
                    left += El.offsetLeft;
                }while((El = El.offsetParent).nodeName != 'BODY');
                return left;
            };
            //取元素的页面绝对 Y位置
            var getTop = function(El){
                var top = 0;
                do{
                    top += El.offsetTop;
                }while((El = El.offsetParent).nodeName != 'BODY');
                return top;
            };
            //是否为ie，并读出ie版本
            var isIE = !!navigator.userAgent.match(/MSIE\b\s*([0-9]\.[0-9]);/img);
            isIE && (isIE = RegExp.$1);
            //是否为chrome
            var isGoo = !!navigator.userAgent.match(/AppleWebKit\b/img);
            //获得可以触发scroll事件的对象
            var box = isIE ? document.documentElement : document;
            //body元素的scroll事件
            var onscroll = box.onscroll = function(){
                //读取滚动条的位置和浏览器窗口的显示大小
                var top = isGoo ? document.body.scrollTop : document.documentElement.scrollTop,
                    left = isGoo ? document.body.scrollLeft :document.documentElement.scrollLeft,
                    width = document.documentElement.clientWidth,
                    height = document.documentElement.clientHeight;
                //对所有图片进行批量判断是否在浏览器显示区域内
                for(var i=0 ; i < imgs.length; i++){
                    var _top = getTop(imgs[i]),_left = getLeft(imgs[i]);
                    //判断图片是否在显示区域内
                    if( _top >= top &&
                        _left >= left &&
                        _top <= top+height &&
                        _left <= left+width){
                        var _src = imgs[i].getAttribute('_src');
                        //如果图片已经显示，则取消赋值
                        if(imgs[i].src !== _src){
                            imgs[i].src = _src;
                        }
                    }
                }
            };
            var load = new Image();
            load.src = src;
            load.onload = function(){
                onscroll();
            };
        }
        delayload({id:['out1','out2'],src:'http://files.jb51.net/file_images/article/201307/2013072210300234.jpg'});