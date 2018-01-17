import {CreateRouterC} from './CreateRouter';
import { Router } from 'dva/router';
import Menu from './routes/menu';

function RouterConfig({history,app}){                         //仅仅此处的参数能拿到app，其余地方为传进去的histort,match,location
	const routers=[                                           //路由数组,内部元素为多个数组，每个数组["path必填","component必填","models选填","exact选填:默认第一个为true,其余false"]
		["/",Menu],
		["/menu",Menu],
	];
	
	return (
		<Router history={history}>
			<CreateRouterC {...{routers,app}} />
		</Router>
	)
}

export default RouterConfig;
