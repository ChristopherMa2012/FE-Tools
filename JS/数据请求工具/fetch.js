/*
 * @Author: chris 
 * @Date: 2018-05-31 19:58:30 
 * @Last Modified by:   chris 
 * @Last Modified time: 2018-05-31 19:58:30 
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
       }
    }
})(window)