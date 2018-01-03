import dynamic from 'dva/dynamic'
import { Route, Switch } from 'dva/router';
let APP;

function CreateRouter({routers,app}){
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

export default CreateRouter;
