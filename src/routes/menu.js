import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import CreateRouter from './../CreateRouter';
import {Menu1,Menu2,Menu3,Menu4,Menu5} from './menu/';

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
		const {match:{path}}=this.props;
		const routers=[
			[`${path}`,Menu1,[import("../models/example")]],
			[`${path}/menu2`,Menu2],
			[`${path}/menu3`,Menu3],
			[`${path}/menu4`,Menu4],
			[`${path}/menu5`,Menu5],
		];
		return <div>
			<div style={{display:"inline-block",textAlign:"center",verticalAlign:"middle"}}>
				<div style={{margin:"20px"}}><Button type="primary" size="large" onClick={()=>this.jump(`${path}`)}>菜单一</Button></div>
				<div style={{margin:"20px"}}><Button type="primary" size="large" onClick={()=>this.jump(`${path}/menu2`)}>菜单二</Button></div>
				<div style={{margin:"20px"}}><Button type="primary" size="large" onClick={()=>this.jump(`${path}/menu3`)}>菜单三</Button></div>
				<div style={{margin:"20px"}}><Button type="primary" size="large" onClick={()=>this.jump(`${path}/menu4`)}>菜单四</Button></div>
				<div style={{margin:"20px"}}><Button type="primary" size="large" onClick={()=>this.jump(`${path}/menu5`)}>菜单五</Button></div>
			</div>
			<div style={{display:"inline-block",textAlign:"center",height:"320px",verticalAlign:"middle"}}>
				<CreateRouter {...{routers}} />
			</div>
		</div>
	}
}


export default connect()(Menu);
