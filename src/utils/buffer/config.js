
const open=false,                        //是否启用缓存
      time=3600000;                     //缓存的保留时间。 0:退出后清除；1：永不清除；其它数字为时长（毫秒）

export default {
    setBuffer:(key,value)=>{            //设置缓存数据，用于插入，更新，删除
        if(open){
            window.localStorage[`${window.location.pathname}_${key}`]=JSON.stringify(value);
        }
    },
    getBuffer:(key)=>{                  //读取缓存数据
        return open&&JSON.parse(window.localStorage[`${window.location.pathname}_${key}`]||"false");//避免未定义无法被JSON.parse解析
    },
    bufferStart:()=>{                   //启动缓存清除计时器
        if(open&&time!==1){
            setInterval(()=>{
                window.localStorage.clear();
            },time)
        }
    }
}
//注意：此缓存对于静态的列表有较好的支持；当有可操作的动态列表时，若要加入缓存，建议封装统一方法，管理分散在项目各处的yield put之后的setBuffer。