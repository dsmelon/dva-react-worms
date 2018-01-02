import dva from 'dva';
import createHistory from 'history/createBrowserHistory';

// 1. Initialize
const app = dva({
  history:new createHistory(),
  // initialState,                    //全局state,默认{}
  // onError((err,dispatch)=>{}),     //全局出错监听
  // onAction,                        //执行action时出发，可用于输出日志
  // onStateChange,                   //全局上state改变时触发
  // onReducer,                       //执行radruce时触发
  // onEffect,                        //封装effect执行，处理loading状态
  // onHmr,                           //热替换
  // extraReducers,                   //指定额外的 reducer
  // extraEnhances,                   //指定额外的 StoreEnhancer
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/global'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
