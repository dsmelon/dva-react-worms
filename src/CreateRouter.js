import dynamic from 'dva/dynamic'
import { Route, Switch } from 'dva/router';
let APP;

function CreateRouterC({routers,app}){      //组件型路由：["path","component","models","exact"]
    app&&(APP=app);
    return  <Switch>
                {
                    routers.map((value,key)=>{
                        return  <Route key={key} path={value[0]} exact={value[3]!=undefined?value[3]:(key==0)} component={
                                    dynamic({
                                        app:APP,//用于注册model，由于之后不好获取，需要保存起来，router.js里携带app参数，之后的二级路由里无法得到app参数
                                        models:()=>value[2]||[],
                                        component:()=>value[1]
                                    })}
                                />
                    })
                }
            </Switch>
}

function CreateRouterR({routers}){          //函数型路由：["path","component","exact"]
    return  <Switch>
                {
                    routers.map((value,key)=>{
                        return  <Route key={key} path={value[0]} exact={value[2]!=undefined?value[2]:(key==0)} render={()=>value[1]}/>
                    })
                }
            </Switch>
}

export default { CreateRouterC,CreateRouterR };