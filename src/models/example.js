import { routerRedux } from 'dva/router'
export default {
  namespace: 'example',
  state: {a:"b"},
  reducers: {
	save(state,{payload}) {
	  return { ...state, ...payload };
	},
  },
  effects: {
		*fetch({ payload }, { call, put }) {  // eslint-disable-line
			// yield put({type:"set",payload:{loading:true}});
			// const {data,code} = yield call(chats.comm,query);
			// yield put({type:"set",payload:{loading:false}});
			// if(code==SUCCESS)
			// {
			//     const comm = data;
			//     yield put({type:"set",payload:{comm}});
			// }
		},
		*takee({query},{take,select}){

			
			console.log(a,"bbb");
			let a=yield take('b',10);
			console.log(a,"aaa");
			
		}
  },
  subscriptions: {

  }
};
