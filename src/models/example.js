import { routerRedux } from 'dva/router';
import request from '../utils/request';
export default {
  namespace: 'example',
  state: {},
  reducers: {
	save(state,{payload}) {
	  return { ...state, ...payload };
	},
  },
  effects: {
		*a({},{put}){
				console.log("aaa");
		},
		*b({},{call}){	//运行此函数是会被刚才发起的监听检测到
			  console.log("bbb");
			  let bb=yield call(()=>request("www.baidu.com"));
				console.log(bb);
		},
		*takee({query},{put,take}){
			console.log("开始监听");
			let t=yield take("b");//此时发起监听，会阻断代码向下运行,当动作发起时就会被检测到
			//检测到时继续向下执行，同时销毁监听，不在生效
			console.log("我监听到你了");
			//若想要一直监听，可以在此处递归，也即在此处
			yield put({type:"takee"});
		}
  },
  subscriptions: {

  }
};


//结果输出顺序为："开始监听"，"aaa","我监听到你了"，bb(接口返回的数据);
//如果接口返回速度非常快，结果可能会不同，限制网速会得到预期结果