import React,{useState,useEffect} from 'react'
import Edit from 'assets/icon/edit.png'
import Building from 'assets/icon/Building.svg'
import User from 'assets/icon/User.svg'
import Probability from 'assets/icon/Probability.svg'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles
} from '@material-ui/core/styles'
import {Button,TextField,Table,TableHead,TableRow,TableCell,TableBody,
InputLabel,Select,MenuItem,FormControl,} from '@material-ui/core'
import Select1 from 'react-select'
import Add from 'assets/icon/Add.svg'
import ClientInformation from './information'
import Owners from './owners'
import Proposal from './proposal'
import Jurnal from './jurnal'
import Pricing from './pricing'
import { useDispatch, useSelector } from "react-redux";
import {modalToggle,modalToggleReset} from 'redux/actions/general'
import {tabToggle,getContact} from 'redux/actions/master'
import {updateDeal,updateProbability} from 'redux/actions/pipeline'
import moment from 'moment'
import {handle_access} from 'service/handle_access'

const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#70bf4e',
            contrastText: '#FFFFFF',
        },
        secondary: {
            // main:'#FF7165',
            main:'#ff7165',
            contrastText: '#FFFFFF',
            // contrastText: '#777777',
        },
        warning:{
            main:'#ffb100',
            contrastText: '#FFFFFF',
        }
    } 
})
const themeButton2 = createMuiTheme({ 
    palette: { 
        primary:{
            main:'#ffb100',
            contrastText: '#FFFFFF',
        },
        secondary:{
            main:'#3B99EB',
            contrastText: '#FFFFFF',
        },

    } 
})
const useStyles = makeStyles(theme => ({
    textField: {
      [`& fieldset`]: {
        borderRadius: 10,
      },
      width:'100%',
    //   marginBottom:15
  }
  
}));
export default function Detail(props) {
    const pipeline=useSelector(state=>state.pipeline)

    const {id,name,clientCompany,clientContact,probability,age,stages,rms}=pipeline.detail_deal

    const [name_edit,setName]=useState(name)
    const [probability_edit,setProbability]=useState(probability)
    const [backdrop,openBackdrop]=useState(false)
    const [modal,setModal]=useState('')

    const classes=useStyles()
    const dispatch=useDispatch()
    const master=useSelector(state=>state.master)
    useEffect(() => {
        // if(master.detail_client===null){
            dispatch(getContact(props.token,pipeline.detail_deal.clientCompany.id))
        // }
        
    }, [])
    const detailEmployee=()=>{
        dispatch(modalToggle({
            modal_open: true,
            modal_title: "Employee Detail",
            modal_component: "employee",
            modal_data:null ,
            modal_size:650,
            modal_action:'detail_employee'
        }))
    }
    const editClient=()=>{
        let fetch= new Promise((resolve,reject)=>{
            // resolve(dispatch(getClient(props.token,`/0/0/0/1/10/*`)))
        })
        fetch.then(()=>{
            console.log('master', master)
            // dispatch(tabToggle('client','pipeline'))
            dispatch(tabToggle('client',master.tab_active==='pipeline'?'pipeline':'detail'))
        })
        
    }
    const getProbability=(key)=>{
        switch (key) {
            case 10:
                return 0.1
                break;
            case 20:
                return 0.2
                break;
            case 30:
                return 0.3
                break;
            case 40:
                return 0.4
                break;
            case 50:
                return 0.5
                break;
            case 60:
                return 0.6
                break;
            case 70:
                return 0.7
                break;
            case 80:
                return 0.8
                break;
            case 90:
                return 0.9
                break;
            case 100:
                return 1
            default:
                break;
        }
    }
    const wonDeal=(dealId)=>{
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: `Yeaah!! did we win it?`,
            modal_component: "confirm2",
            modal_size:400,
            modal_type:'confirm',
            modal_data:{
                dealId:dealId,
                title:`Yeaah!! did we win it?`,
                msg:`<p>Congratulations on your achievement this time, thank you for giving your best.</p>`,
                title_cancel:'No, Cancel',
                title_yes:'Yes, Won it'
            },
            modal_action:'won_deal'
        }))
    }
    const deleteDeal=(dealId)=>{
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: `Are you sure delete this deal?`,
            modal_component: "confirm2",
            modal_size:400,
            modal_type:'confirm',
            modal_data:{
                dealId:dealId,
                msg:`<p>This action will make deal delete permanent from our system</p>`,
                title_cancel:'No, Cancel',
                title_yes:'Yes, Delete deal'
            },
            modal_action:'delete_deal'
        }))
    }
    const lostDeal=(dealId)=>{
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: `Are you sure this deal is losing?`,
            modal_component: "confirm2",
            modal_size:400,
            modal_type:'confirm',
            modal_data:{
                dealId:dealId,
                msg:`<p>never mind, keep your spirits up. This offer will be on the <b>Lost Deal</b> list if at any time there are changes</p>`,
                title_cancel:'No, Cancel',
                title_yes:'Yes, lost it'
            },
            modal_action:'lost_deal'
        }))
    }
    const reopenDeal=(dealId)=>{
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: `Are you sure reopen this deal?`,
            modal_component: "confirm2",
            modal_size:400,
            modal_type:'confirm',
            modal_data:{
                dealId:dealId,
                msg:`<p>Deal will appear in pipeline</p>`,
                title_cancel:'No, Cancel',
                title_yes:'Yes, reopen deal'
            },
            modal_action:'reopen_deal'
        }))
    }
    const dealUpdate=()=>{
        let filter=pipeline.detail_deal.history.filter((data)=>{
            return data.type==='created'
        })
        console.log('filter', filter)
        let data={
            name:name_edit,
            id:pipeline.detail_deal.id,
            userId:props.profile.id,
            clientId:pipeline.detail_deal.clientCompany.id,
            contactId:pipeline.detail_deal.clientContact.id,
            dealDate:moment(filter[0].data.updateTime).format('YYYY-MM-DD'),
            // tribeId:pipeline.detail_deal.tribes.id,
            segmentId:pipeline.detail_deal.segment.id,
            branchId:pipeline.detail_deal.branch.id,
            stageId:pipeline.detail_deal.stage.id,
            probability:pipeline.detail_deal.probability
        }
        dispatch(updateDeal(props.token,data))
    }
    const probabilityUpdate=()=>{
        let data={
            dealId:pipeline.detail_deal.id,
            userId:props.profile.id,
            probability:probability_edit
        }
        dispatch(updateProbability(props.token,data))
    }
    const modalsToggle=(key)=>{
        if(modal!==key){
            setModal(key)
            openBackdrop(!backdrop)
        }else{
            setModal('')
            openBackdrop(!backdrop)
        }
    }
    const backdropToggle=()=>{
        openBackdrop(!backdrop)
        setModal('')
     }
     const new_rms_for_access=[]
     rms.map((data)=>{
         new_rms_for_access.push({id:data.userId,text:data.name})
     })
    return (
        <div>
            
            <div className='detail-header'>
            <div onClick={backdropToggle} style={{zIndex:2,width:'100%',height:700,position:'absolute',top:0,left:0,display:backdrop?'block':'none'}}></div>
                <div className='modal-title-change' style={{display:modal==='name'?'flex':'none'}}>
                    <TextField
                        label={<>Deal name</>}
                        type='text'
                        // disabled={edit?false:true}
                        value={name_edit}
                        onChange={(e)=>setName(e.target.value)}
                        variant='outlined'
                        size='small'
                        className={classes.textField}
                    />
                    <Button onClick={()=>dealUpdate()} size='small' color='primary' variant='contained' className='head-add-section__btn'>save</Button>

                </div>
                <div className='modal-probability-change' style={{display:modal==='probability'?'flex':'none'}}>
                <FormControl variant="outlined" size="small" className='add-deals__field'>
                    <InputLabel id="demo-simple-select-label">Probability</InputLabel>
                        <Select
                            color='primary'
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={probability_edit}
                            onChange={(e)=>setProbability(e.target.value)}
                            className='field-radius'
                            labelWidth={80}
                        >
                            <MenuItem value={10}>Lead (0.1)</MenuItem>
                            <MenuItem value={20}>Contact (0.2)</MenuItem>
                            <MenuItem value={30}>Meeting & Needs Collected (0.3)</MenuItem>
                            <MenuItem value={40}>Proposal Submitted (0.4)</MenuItem>
                            <MenuItem value={50}>Proposal Presentation (0.5)</MenuItem>
                            <MenuItem value={60}>Like the proposal (0.6)</MenuItem>
                            <MenuItem value={70}>Negotiation (0.7)</MenuItem>
                            <MenuItem value={80}>Verbally agree (0.8)</MenuItem>
                            {/* <MenuItem value={90}>0.9 - Agreement</MenuItem> */}
                        </Select>
                    </FormControl>
                   
                    <Button onClick={()=>probabilityUpdate()} size='small' color='primary' variant='contained' className='head-add-section__btn'>save</Button>

                </div>
                <p className='header-title'>{name}&nbsp; {handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)&&<img onClick={()=>modalsToggle('name')} src={Edit} className='icon-action'/>}</p>
                <div className='header-menu'>
                    <div className='header-data'>
                        <div className='div-flex' style={{maxWidth:270}}>
                            <img src={Building} className='header-data-icon' />&nbsp;&nbsp;
                            <p>{clientCompany.text}</p>
                        </div>
                        <div className='div-flex'>
                            <img src={User} className='header-data-icon' />&nbsp;
                            <p>{clientContact.text}</p>
                        </div>
                        <div className='div-flex' style={{cursor:'pointer'}} onClick={()=>handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)&&modalsToggle('probability')}>
                            <img src={Probability} className='header-data-icon' />&nbsp;
                            <p>Probability: &nbsp;<span style={{color:'#70bf4e'}}>{getProbability(probability)}</span></p>
                        </div>
                        <div className='div-flex'>
                            <p>Deal age:&nbsp; <span style={{color:'#777777'}}>{age} day</span></p>
                        </div>
                        {/* <p><img src={Building} className='header-data-icon' />&nbsp;{clientCompany.text}</p>
                        <p><img src={User} className='header-data-icon' />&nbsp;{clientContact.text}</p>
                        <p style={{cursor:'pointer'}} onClick={()=>modalsToggle('probability')}><img src={Probability}  className='header-data-icon' />&nbsp;Probability: &nbsp;<span style={{color:'#70bf4e'}}>{getProbability(probability)}</span></p>
                        <p>Deal age:&nbsp; <span style={{color:'#777777'}}>{age} day</span></p> */}
                    </div>
                    <div className='header-btn'>
                            {pipeline.detail_deal.state.text==='Lost'?
                            <MuiThemeProvider theme={themeButton2}>
                            <Button onClick={()=>props.tabToggle(master.tab_back)} size='small' color='primary' variant='outlined' className='head-add-section__btn remove-boxshadow' >Back</Button>
                            {handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)&&<Button onClick={()=>reopenDeal(id)} size='small' color='secondary' variant='contained' className='head-add-section__btn remove-boxshadow' >Reopen</Button>}
                        </MuiThemeProvider>
                            :
                            <>
                            <MuiThemeProvider theme={themeButton2}>
                                <Button onClick={()=>props.tabToggle(master.tab_back,master.tab_active,)} size='small' color='primary' variant='outlined' className='head-add-section__btn remove-boxshadow' >Back</Button>
                            </MuiThemeProvider>
                            <MuiThemeProvider theme={themeButton}>
                            {pipeline.detail_deal.state.text!=='Won'&&handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)&&
                            <>
                            <Button onClick={()=>wonDeal(id)} size='small' color='primary' variant='contained' className='head-add-section__btn remove-boxshadow'>Won</Button>
                            <Button onClick={()=>lostDeal(id)} size='small' color='secondary' variant='contained' className='head-add-section__btn remove-boxshadow'>Lost</Button>
                            </>}
                            {handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)&&<Button onClick={()=>deleteDeal(id)} size='small' color='secondary' variant='text' className='head-add-section__btn remove-boxshadow' style={{backgroundColor:'#eeeeee'}}>Delete</Button>}
                            
                        </MuiThemeProvider>
                        </>
                        }
                    </div>
                    
                </div>
                <div className='header-step-wrapper'>
                        <div className='header-step'>
                          <p>Lead In Age: {stages[0]} day</p> 
                        </div>
                        <div className='header-step'>
                          <p>Proposal Development Age: {stages[1]} day</p> 
                        </div>
                        <div className='header-step'>
                          <p>Proposal Sent Age: {stages[2]} day</p> 
                        </div>
                        <div className='header-step'>
                          <p>Presentation Age: {stages[3]} day</p> 
                        </div>
                        <div className='header-step'>
                          <p>Negotiation Age: {stages[4]} day</p>
                        </div>
                    </div>
            </div>
            <div className='detail-content'>
                <div className='detail-card'>
                    <ClientInformation tabToggle={props.tabToggle} token={props.token} profile={props.profile}/>
                    <Owners detailEmployee={detailEmployee} profile={props.profile} token={props.token}/>
                    <Proposal token={props.token} profile={props.profile}/>
                    <Pricing token={props.token} profile={props.profile}/>
                </div>
                <div className='detail-jurnal'>
                    <Jurnal detailEmployee={detailEmployee} token={props.token} profile={props.profile}/>
                </div>
            </div>
        </div>
    )
}
