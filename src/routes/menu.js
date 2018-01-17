import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import {CreateRouterC} from './../CreateRouter';
import {Menu1,Menu2,Menu3,Menu4,Menu5} from './menu/';
import Video from './../components/video/';

class Menu extends Component {
	jump(pathname,query,isPath){
		const {dispatch}=this.props;
		dispatch({
			type:"global/jump",
			query:{pathname,query},
			isPath
		})
	}
	render(){
		const {match:{path},dispatch}=this.props;
		const routers=[
			[`${path}`,Menu1,[import("../models/example")]],
			[`${path}/menu2`,Menu2],
			[`${path}/menu3`,Menu3],
			[`${path}/menu4`,Menu4],
			[`${path}/menu5`,Menu5],
		];
		return <div>
			<div>
				<div style={{margin:"20px"}}><Button type="primary" size="large" onClick={()=>this.jump(`${path}`)}>菜单一</Button></div>
				<div style={{margin:"20px"}}><Button type="primary" size="large" onClick={()=>this.jump(`${path}/menu2`)}>菜单二</Button></div>
				<div style={{margin:"20px"}}><Button type="primary" size="large" onClick={()=>this.jump(`${path}/menu3`)}>菜单三</Button></div>
				<div style={{margin:"20px"}}><Button type="primary" size="large" onClick={()=>this.jump(`${path}/menu4`)}>菜单四</Button></div>
				<div style={{margin:"20px"}}><Button type="primary" size="large" onClick={()=>this.jump(`${path}/menu5`)}>菜单五</Button></div>
			</div>
			<div style={{display:"inline-block",textAlign:"center",height:"320px",verticalAlign:"middle"}}>
				<CreateRouterC {...{routers}} />
			</div>

			<Video />

			<a onClick={()=>{//点击此按钮时，会触发takee
				dispatch({
					type:"example/takee"
				})
			}}>监听</a>

			<a onClick={()=>{//点击此按钮时，会触发b
				dispatch({
					type:"example/b"
				})
			}}>bbb</a>

			<a onClick={()=>{//点击此按钮时，会触发a
				dispatch({
					type:"example/a"
				})
			}}>aaa</a>

		</div>
	}
}


export default connect()(Menu);
