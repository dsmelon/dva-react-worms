import { player,tipS,tipE,tip,dot,sound,sTip,sTipC,sDot,sTipS,sNum,grow } from "./index.css";

let timer,timer1;//视频时间监听,鼠标悬停

const timeFormat=(value)=>{//时间格式化
    let val=parseInt(value);
    return (val<3600?"":(val/3600>=10?"":"0")+parseInt(val/3600)+":")+(val%3600/60>=10?"":"0")+parseInt(val%3600/60)+":"+(val%60>=10?"":"0")+val%60;
}

const objToArr=(value={})=>{//对象键转数组
    let arr=[];
    for(let i in value) arr.push(i);
    return arr;
}

export default class Video extends React.Component{
    constructor(props){
        super(props);
        this.state={
            src:["https://media.w3.org/2010/05/sintel/trailer_hd.mp4"], //资源
            controls:true,                                              //控制器
            sus:true,                                                   //控制器是否悬浮
            wait:5000,                                                  //控制器悬浮时，鼠标悬停多少秒后消失
            paused:(props.autoPlay==undefined)?true:props.autoPlay,     //是否暂停状态
            time:0,                                                     //已播放时间
            allTime:0.1,                                                //总时间
            buffer:[0,0],                                               //已经缓冲的时间
            sound:50,                                                   //声音大小
            offset:8,                                                   //进度条上下偏移，初始化的是ul的padding
            num:1,                                                      //第几集
            allNum:12,                                                  //总共多少集
            addTime:"auto",                                             //全屏时按左右键时快进快退的秒数,auto分割成100份
            addSound:5,                                                 //全屏时按上下键时声音加大的量
            ctrl:true,                                                  //悬浮是控制的变量，不需要改动
            layout:{                                                    //按钮布局
                play:{
                    component:["播放","暂停"],
                    size:1
                },
                pre:{
                    component:"上一集",
                    size:1
                },
                next:{
                    component:"下一集",
                    size:1
                },
                time:{
                    size:1
                },
                tip:{
                    size:10
                },
                allTime:{
                    size:1
                },
                quality:{
                    component:["蓝光","超清","高清","标准","极速"],
                    index:2,
                    size:1
                },
                speed:{
                    component:[
                        {
                            comp:"10",
                            value:10
                        },
                        {
                            comp:"2.5",
                            value:2.5
                        },
                        {
                            comp:"2.0",
                            value:2
                        },
                        {
                            comp:"1.5",
                            value:1.5
                        },
                        {
                            comp:"1.0",
                            value:1
                        },
                        {
                            comp:"0.5",
                            value:0.5
                        }
                    ],
                    index:3,
                    size:1
                },
                sound:{
                    component:[
                        {
                            comp:"静音",
                            range:[0,0]
                        },
                        {
                            comp:"声音小",
                            range:[1,20]
                        },
                        {
                            comp:"声音中",
                            range:[21,49]
                        },
                        {
                            comp:"声音大",
                            range:[50,99]
                        },
                        {
                            comp:"声音满",
                            range:[100,100]
                        }
                    ],
                    size:1
                },
                fullWeb:{
                    component:["网页全屏","不网页全屏"],
                    size:2
                },
                fullScreen:{
                    component:["全屏","不全屏"],
                    size:1
                },
                loop:{
                    component:["循环","不循环"],
                    size:1
                },
                download:{
                    component:"下载",
                    size:1
                },
                light:{
                    component:["关灯","开灯"],
                    size:1,
                    deg:0.5
                },
            },
            grow:[
                {
                    comp:"50%",
                    value:50
                },
                {
                    comp:"75%",
                    value:75
                },
                {
                    comp:"100%",
                    value:100
                },
                {
                    comp:"125%",
                    value:125
                }
            ],
            ...props
        };
    }
    componentDidMount(){
        let {core,tip={},ul={},sTip={}}=this.refs;
        core.onloadedmetadata=()=>{
            this.setState({allTime:core.duration,offset:ul.offsetHeight-this.state.offset,sCompIndex:this.getSoundComp(this.state.sound)});
            timer=setInterval(()=>{
                this.setState({time:core.currentTime,buffer:this.getBuffer(core)});
            },500);
            tip.onmousedown=(e)=>{
                !this.state.paused&&core.pause();
                this.onCurrentChange(e);
                window.onmousemove=(es)=>this.onCurrentChange(es);
            }
            sTip.onmousedown=(e)=>{
                this.onSoundChange(e);
                window.onmousemove=(es)=>this.onSoundChange(es);
            }
            window.onmouseup=()=>{
                !this.state.paused&&core.play();
                window.onmousemove=null;
            }
            core.onmousemove=()=>{
                if(!this.state.sus&&!this.state.fullWeb&&!this.state.fullScreen) return false;
                clearTimeout(timer1);
                this.setState({ctrl:true})
                timer1=setTimeout(()=>{
                    this.setState({ctrl:false})
                },this.state.wait);
            }
        }
    }
    componentWillReceiveProps(nextProps){
        let change={};
        for(let i in this.props){
            if(JSON.stringify(this.props[i])!=JSON.stringify(nextProps[i])) change[i]=this.props[i]
        }
        this.setState(change);
    }
    componentWillUnmount(){
        let {tip={},sTip={}}=this.refs;
        clearInterval(timer);
        window.onmousemove=window.onmouseup=tip.onmousedown=sTip.onmousedown=window.onkeydown=null;
    }
    onCurrentChange(e){
        let {core,tip={}}=this.refs;
        let current=(e.x-tip.getBoundingClientRect().left)/tip.offsetWidth*this.state.allTime;
        if(current<0) current=0;
        else if(current>this.state.allTime) current=this.state.allTime;
        core.currentTime=current;
        this.setState({time:current});
    }
    onSoundChange(e){
        let {core,sTipC={}}=this.refs;
        let sound=(sTipC.getBoundingClientRect().bottom-e.y)/sTipC.offsetHeight;
        if(sound<0) sound=0;
        else if(sound>1) sound=1;
        core.volume=sound;
        this.setState({sound:parseInt(sound*100),sCompIndex:this.getSoundComp(parseInt(sound*100))});
    }
    playAndPause(target,state){
        if(target.matches("video")||/data-play/.test(target.id)){
            state?this.refs.core.play():this.refs.core.pause();
            this.setState({paused:!state});
        }
    }
    fullWeb(){
        this.setKeyDown(!this.state.fullWeb);
        this.setState({fullWeb:!this.state.fullWeb});
    }
    fullScreen(){
        let {core}=this.refs;
        this.state.fullScreen?
            core.webkitExitFullscreen&&!core.webkitExitFullscreen()||
            core.exitFullscreen&&!core.exitFullscreen()||
            core.msExitFullscreen&&!core.msExitFullscreen()||
            core.mozCancelFullScreen&&!core.mozCancelFullScreen()||
            core.oRequestFullscreen&&!core.oRequestFullscreen()
        :
            core.webkitRequestFullScreen&&!core.webkitRequestFullScreen()||
            core.requestFullscreen&&!core.requestFullscreen()||
            core.msRequestFullscreen&&!core.msRequestFullscreen()||
            core.mozRequestFullScreen&&!core.mozRequestFullScreen()||
            core.oRequestFullscreen&&!core.oRequestFullscreen();
        this.setKeyDown(!this.state.fullScreen);
        this.setState({fullScreen:!this.state.fullScreen});
    }
    setKeyDown(bol){
        if(bol){
            let {core}=this.refs;
            let addTime=this.state.addTime=="auto"?this.state.allTime/100:this.state.addTime;
            window.onkeydown=(e)=>{
                switch(e.keyCode){
                    case 37:{
                        let sub=core.currentTime-addTime<=0?0:core.currentTime-addTime;
                        core.currentTime=sub;
                        this.setState({time:sub})
                        break;
                    }
                    case 39:{
                        let sub=core.currentTime+addTime>=this.state.allTime?this.state.allTime:core.currentTime+addTime;
                        core.currentTime=sub;
                        this.setState({time:sub})
                        break;
                    }
                    case 38:{
                        let sound=this.state.sound+this.state.addSound>=100?100:this.state.sound+this.state.addSound;
                        core.volume=sound/100;
                        this.setState({sound});
                        break;
                    }
                    case 40:{
                        let sound=this.state.sound-this.state.addSound<=0?0:this.state.sound-this.state.addSound;
                        core.volume=sound/100;
                        this.setState({sound})
                        break;
                    }
                }
            }
        }
        else window.onkeydown=null;
    }
    getBuffer(core){
        let {currentTime,buffered}=core;
        for(let i=0;i<buffered.length;i++){
            let [start,end]=[buffered.start(i),buffered.end(i)];
            if((currentTime>=start)&&(currentTime<=end)){
                if(start<0) start=0;
                if(end>this.state.allTime) end=this.state.allTime;
                return [start,end]
            };
        }
        return [0,0];
    }
    getSoundComp(val){
        let {component=[]}=this.state.layout.sound;
        for(let i=0;i<component.length;i++) if((val>=component[i].range[0])&&(val<=component[i].range[1])) return i;
    }
    offLight(){
        let {deg=100}=this.state.layout.light;
        this.setState({light:!this.state.light&&(1-deg/100)});
    }
    preAndNext(bol){
        let {preAndNext=()=>{}}=this.props;
        preAndNext(this.state.num,bol);
        this.setState({num:bol?++this.state.num:--this.state.num});
    }
    onChangeQuality(Qindex){
        let {onChangeQuality=()=>{}}=this.props;
        this.setState({Qindex,changeQuality:false});
        onChangeQuality(Qindex);
    }
    onChangeSpeed(val){
        let {core}=this.refs;
        core.playbackRate=val.value;
        this.setState({Svalue:val,changeSpeed:false});
    }
    onLoop(){
        let {core}=this.refs;
        core.loop=!this.state.loop
        this.setState({loop:!this.state.loop});
    }
    onMuted(e){
        if(/data-mark/.test(e.target.id)){
            let {core}=this.refs;
            core.muted=!core.muted;
            this.setState({muted:core.muted});
        }
    }
    onGrow(growValue){
        this.setState({growValue})
    }
    render(){
        let {layout}=this.state;
        return <div className={player} style={{boxShadow:this.state.light&&`0 0 0 10000px rgba(0,0,0,${this.state.light})`,position:this.state.fullWeb&&"fixed",width:this.state.fullWeb&&"100vw",height:this.state.fullWeb&&"100vh"}} onMouseLeave={()=>this.setState({ctrl:false})}>
            <video preload="auto" ref="core" onClick={(e)=>this.playAndPause(e.target,this.state.paused)} style={{width:this.state.fullWeb&&this.state.growValue&&`${this.state.growValue}%`,transform:this.state.fullWeb&&this.state.growValue&&`translateX(${5000/this.state.growValue-50}%)`}}>
            {
                this.state.src.map((value,key)=>{
                    return <source src={value} type={`video/${value.split(".").pop()}`} key={key}/>
                })
            }
            </video>
            <ul ref="ul" style={{position:(this.state.sus||this.state.fullWeb||this.state.fullScreen)&&"absolute",display:!(this.state.controls&&this.state.ctrl||!this.state.sus&&!this.state.fullWeb&&!this.state.fullScreen)&&"none"}} onMouseEnter={()=>clearTimeout(timer1)}>
            {
                objToArr(layout).map((value,key)=>{
                    switch(value){
                        case "play":return layout[value]&&<li id="data-play" key={value} style={{flex:layout[value].size}} onClick={(e)=>this.playAndPause(e.target,this.state.paused)}>{this.state.paused?layout.play.component[0]:layout[value].component[1]}</li>;
                        case "pre":return layout[value]&&(this.state.num>1)&&<li key={value} style={{flex:layout[value].size}} onClick={()=>this.preAndNext(false)}>{layout[value].component}</li>
                        case "next":return layout[value]&&(this.state.num<this.state.allNum)&&<li key={value} style={{flex:layout[value].size}} onClick={()=>this.preAndNext(true)}>{layout[value].component}</li>;
                        case "time":return layout[value]&&<li key={value} style={{flex:layout[value].size}}>{timeFormat(this.state.time)}</li>;
                        case "tip":return layout[value]&&<li key={value} style={{flex:layout[value].size,padding:`${Math.ceil(this.state.offset/2)-8}px 10px`}}>
                                            <div className={tip} ref="tip">
                                                <div className={dot} style={{left:`calc(${this.state.time/this.state.allTime*100}% - 10px)`}}></div>
                                                <div className={tipS} style={{left:`${this.state.buffer[0]/this.state.allTime*100}%`,width:`${(this.state.time-this.state.buffer[0])/this.state.allTime*100}%`}}></div>
                                                <div className={tipE} style={{left:`${this.state.time/this.state.allTime*100}%`,width:`${(this.state.buffer[1]-this.state.time)/this.state.allTime*100}%`}}></div>
                                            </div>
                                        </li>;
                        case "allTime":return layout[value]&&<li key={value} style={{flex:layout[value].size}}>{timeFormat(this.state.allTime)}</li>;
                        case "quality":return   layout[value]&&<li key={value} style={{flex:layout[value].size,position:"relative"}} onMouseEnter={()=>this.setState({changeQuality:true})} onMouseLeave={()=>this.setState({changeQuality:false})}>
                                                    <div>{layout[value].component[this.state.Qindex==undefined?layout[value].index:this.state.Qindex]}</div>
                                                    {
                                                        this.state.changeQuality&&<ul style={{bottom:`${this.state.offset}px`}}>
                                                        {
                                                            layout[value].component.map((v,k)=>{
                                                                return <li key={k} onClick={()=>this.onChangeQuality(k)}>{v}</li>
                                                            })
                                                        }
                                                        </ul>
                                                    }
                                                </li>;
                        case "speed":return layout[value]&&<li key={value} style={{flex:layout[value].size,position:"relative"}} onMouseEnter={()=>this.setState({changeSpeed:true})} onMouseLeave={()=>this.setState({changeSpeed:false})}>
                                                <div>{this.state.Svalue==undefined?layout[value].component[layout[value].index].comp:this.state.Svalue.comp}</div>
                                                {
                                                    this.state.changeSpeed&&<ul style={{bottom:`${this.state.offset}px`}}>
                                                    {
                                                        layout[value].component.map((v,k)=>{
                                                            return <li key={k} onClick={()=>this.onChangeSpeed(v)}>{v.comp}</li>
                                                        })
                                                    }
                                                    </ul>
                                                }
                                            </li>;
                        case "sound":return layout[value]&&<li key={value} style={{flex:layout[value].size,position:"relative"}} onMouseEnter={()=>this.setState({changeSound:true})} onMouseLeave={()=>this.setState({changeSound:false})} onClick={(e)=>this.onMuted(e)}>
                                                <div id="data-mark">{layout[value].component[(this.state.muted?0:this.state.sCompIndex)||0].comp}</div>
                                                <div className={sound} style={{bottom:`${this.state.offset}px`,display:!this.state.changeSound&&"none"}}>
                                                    <div className={sTip} ref="sTip">
                                                        <div className={sTipC} ref="sTipC">
                                                            <div className={sTipS} style={{height:`calc(${this.state.sound}% + 12px)`,boxShadow:this.state.muted&&"0 0 10px 2px #004038 inset"}}></div>
                                                            <div className={sDot} style={{bottom:`calc(${this.state.sound}% - 6px)`}}></div>
                                                        </div>
                                                    </div>
                                                    <div className={sNum}>{`${this.state.muted?0:this.state.sound}%`}</div>
                                                </div>
                                            </li>;
                        case "fullWeb":return layout[value]&&<li key={value} style={{flex:layout[value].size}} onClick={()=>this.fullWeb()}>{this.state.fullWeb?layout[value].component[1]:layout[value].component[0]}</li>;
                        case "fullScreen":return layout[value]&&<li key={value} style={{flex:layout[value].size}} onClick={()=>this.fullScreen()}>{this.state.fullScreen?layout[value].component[1]:layout[value].component[0]}</li>;
                        case "loop":return layout[value]&&<li key={value} style={{flex:layout[value].size}} onClick={()=>this.onLoop()}>{this.state.loop?this.state.layout.loop.component[1]:this.state.layout.loop.component[0]}</li>
                        case "download":return  layout[value]&&<li key={value}  style={{flex:layout[value].size}}>
                                                    <a href={this.state.src} download>{layout[value].component}</a>
                                                </li>;
                        case "light":return layout[value]&&<li key={value} style={{flex:layout[value].size}} onClick={()=>this.offLight()}>{this.state.light?layout[value].component[1]:layout[value].component[0]}</li>;
                    }
                })
            }
            </ul>
            <div className={grow}>
            {
                this.state.grow&&this.state.fullWeb&&this.state.grow.map((value,key)=>{
                    return <div key={key} onClick={()=>this.onGrow(value.value)}>{value.comp}</div>
                })
            }
            </div>
        </div>
    }
}