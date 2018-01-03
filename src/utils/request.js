import fetch from 'dva/fetch';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {        //定义请求头
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {//如果是post或者put方法，需加上下面两条请求头
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body); //参数当做JSON格式传递，如需别的格式，需自己转格式
  }
  return fetch(url, newOptions)   //真正发起请求的地方
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data }))     //此处的data里包含类型码，可根据类型码进行额外操作，比如登录验证，抛出提示等
    .catch(err => ({ err }));
}
