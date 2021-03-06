
import { routerRedux } from 'dva/router';
import { stringify } from 'query-string';
export default {
	namespace: 'global',
	state:{},
	reducers: {

	},
	effects: {
		*jump({ query={},isPath=false }, { call, put }) {        //跳转链接，isPath参数是否出现在地址栏
			if(isPath){
				yield put(routerRedux.push(query.pathname+"?"+stringify(query.query)));
				return false;
			}
			yield put(routerRedux.push(query));
		},
	},
	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(({ pathname }) => {
				if (pathname === '/') {
				  dispatch({
					type: 'jump',
					query:{pathname:"/menu"}
				  });
				}
			});
		}
	}
};