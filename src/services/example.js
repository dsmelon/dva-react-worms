import request from '../utils/request';//引入封装的请求方法
import {interface1} from './interface';  //引入接口数据

export async function add(val) {    //导出异步函数，不阻塞进程
  return request(interface1.add,{   //utils里封装的request方法
    method:"post",                  //定义请求方式，可以是post，也可以是get或者其他方法
    body:val,                       //请求携带的参数
  },"add"+val.type);                //第三个参数：如果此条数据不缓存,不传第三个参数，如果此条数据需要缓存，无分页传自定义的keyname即可，有分页要加入分页标识value["标识"]，取的时候规则也是如此
                                    //推荐键名和函数名相关联
}
