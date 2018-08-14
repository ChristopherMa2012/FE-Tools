
//异步请求工具函数
/*opts = {
  method: '',  // get/post
  mode: '',
  credentials: '',
  cache:'',
  headers:{

  },
  或者headers: new Headers()
  body: FormData 或者json对象
}*/
// let data = null, error = null;
export default async opts => {
  let optsData = Object.create(null);
  // optsData.mode = 'cors';
  // optsData.credentials = 'inlucde';
  // optsData.cache = 'no-cache';

  //get请求方式
  if (opts.method && opts.method.toUpperCase() === 'GET') {
    optsData.method = 'GET';
    if (opts.body !== undefined) {
      opts.url += '?';
      opts.body && Object.keys(opts.body).forEach(item => {
        opts.url += `${item}=${opts.body[item]}&`
      })
      opts.url = opts.url.slice(0, -1)
    }
  }
  //post请求方式
  if (opts.method && opts.method.toUpperCase() === 'POST') {
    optsData.method = 'POST';
    //json数据
    if (Object.prototype.toString.call(opts.body) !== "[object FormData]") {
      optsData.body = JSON.stringify(opts.body);
      optsData.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
      //form表单
    } else {
      optsData.body = opts.body;
      optsData.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  }

  // try {
  const res = await fetch(opts.url, {
    mode: 'cors',
    credentials: 'include',
    method: optsData.method || 'GET',
    headers: optsData.headers,
    body: optsData.body || undefined
  });
  let errLabel = true;
  let data = null;
  try {
    data = await res.json()
  } catch (err) {
    errLabel = false;
    /**
     * 请求失败处理操作
     */
  } finally {
    if (errLabel) return data;
  }
}

