/*
 * @Author: Chris
 * @Date:   2017-12-13 17:35:24
 * @Last Modified by:   Chris
 * @Last Modified time: 2017-12-13 17:56:27
 */
(function(document, window) {
	const setFontSize = () =>{
		var html = document.documentElement;
		if(!html) {
			console.log('document.documentElement: undefined');
			return;
		}
        html.style.fontSize = html.clientWidth / 720 * 100 + 'px';
	}
	setFontSize();
	var event = 'orientationchange' in window? 'orientationchange' : 'resize';
	window.addEventListener(event,setFontSize);
	window.addEventListener('DOMcontentLoaded',setFontSize);
})(document, window)
