/*
 * @Author: chris 
 * @Date: 2018-05-31 19:58:30 
 * @Last Modified by: chris
 * @Last Modified time: 2018-05-31 20:38:45
 */
(function(window){
  // opts = {
  //   url: '',
  //   method: '',
  //   type:'',//Async或sync
  //   withCredentials:''
  // }
    window.fetch = function(opts){
      
       if( !!window.XMLHttpRequest){
         var xhr = new XMLHttpRequest();
         xhr.withCredentials = opts.withCredentials;
         xhr.open(opts.method,opts.url,opts.type);
         xhr.onreadystatechange = function(){

         }
         xhr.send();
       }
    }
})(window)