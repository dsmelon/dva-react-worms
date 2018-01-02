import request from '../utils/request';//引入封装的请求方法
import {interface1} './interface';  //引入接口数据

export async function add(val) {    //导出异步函数，不阻塞进程
  return request(interface1.add,{   //utils里封装的request方法
    method:"post",                  //定义请求方式，可以是post，也可以是get或者其他方法
    body:val,                       //请求携带的参数
  });
}
