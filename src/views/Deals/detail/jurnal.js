import React from 'react'
import Edit from 'assets/icon/edit.png'
import Building from 'assets/icon/Building.svg'
import User from 'assets/icon/User.svg'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles
} from '@material-ui/core/styles'
import {Button,TextField,Table,TableHead,TableRow,TableCell,TableBody,
InputLabel,Select,MenuItem,FormControl,Stepper,Step,StepLabel,StepContent} from '@material-ui/core'
import Select1 from 'react-select'
import Add from 'assets/icon/Add.svg'
import EyeWhite from 'assets/icon/EyeWhite.svg'
import {modalToggle} from 'redux/actions/general'
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment'
import ReactNumberFormat from 'react-number-format'
import {getContact,getEmployee} from 'redux/actions/master'
import {setProposal,setSalesVisit,viewFile} from 'redux/actions/pipeline'
import * as actionType from 'redux/constants/pipeline'
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
const themeButton3 = createMuiTheme({ 
    palette: { 
        primary:{
            main:'#FFFFFF',
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
      marginBottom:15
  }
  
}));
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
const Status=()=>{
    return(
        <div className='jurnal-item-content-default'>
            <p className='semi-bold'>
                Status: Open → <span style={{color:'#70bf4e'}}>Won</span><br/>
                <span className='sub-jurnal-item-content-default'>
                    at 25 Mei 2020 | 09:00 &nbsp;&nbsp;
                    <div style={{width:3,height:3,borderRadius:'50%',backgroundColor:'#cccccc'}}></div>&nbsp;&nbsp;
                    Peppy
                </span>
            </p>
            <Button onClick={null}  size='small' color='primary' variant='contained' className='btn-remove-capital btn-rounded btn-jurnal-invoice' >Invoice</Button>
        </div>
    )
}
const Probability=(data)=>{
    return(
        <div className='jurnal-item-content-default'>
            <p className='semi-bold'>
                Probability: <span className='text-jurnal-green'>{getProbability(parseInt(data.data.data.header2.text))}</span> → <span className='text-jurnal-green'>{getProbability(parseInt(data.data.data.header3.text))}</span><br/>
                <span className='sub-jurnal-item-content-default'>
                    at {moment(data.data.data.updateTime).format('DD MMM YYYY | HH:mm')} &nbsp;&nbsp;
                    <div style={{width:3,height:3,borderRadius:'50%',backgroundColor:'#cccccc'}}></div>&nbsp;&nbsp;
                    {data.data.data.updateBy.text}
                </span>
            </p>
        </div>
    )
}
const Stage=(data)=>{
    return(
        <div className='jurnal-item-content-default'>
            <p className='semi-bold'>
                {data.data.data.header1.text} <span style={{color:data.data.data.header2.text==='Won'?'#70bf4e':data.data.data.header2.text==='Lost'?'#ff7165':'#777777'}}>{data.data.data.header2.text}</span> → <span style={{color:data.data.data.header3.text==='Won'?'#70bf4e':data.data.data.header3.text==='Lost'?'#ff7165':'#777777'}}>{data.data.data.header3.text}</span><br/>
                <span className='sub-jurnal-item-content-default'>
                    at {moment(data.data.data.updateTime).format('DD MMM YYYY | HH:mm')} &nbsp;&nbsp;
                    <div style={{width:3,height:3,borderRadius:'50%',backgroundColor:'#cccccc'}}></div>&nbsp;&nbsp;
                    {data.data.data.updateBy.text}
                </span>
            </p>
        </div>
    )
}
const ToBeDate=(data)=>{
    return(
        <div className='jurnal-item-content-default'>
            <p className='card-content-item-jurnal-text'>
                {data.data.data.header1.text} {moment(data.data.data.header2.text).format('DD MMMM YYYY')} → {moment(data.data.data.header3.text).format('DD MMMM YYYY')}<br/>
            </p>
            <p className='card-content-item-jurnal-text'>
                Remark {data.data.data.info.remarks} <br/>
                <span className='sub-jurnal-item-content-default'>
                    at {moment(data.data.data.updateTime).format('DD MMM YYYY | HH:mm')} &nbsp;&nbsp;
                    <div style={{width:3,height:3,borderRadius:'50%',backgroundColor:'#cccccc'}}></div>&nbsp;&nbsp;
                    {data.data.data.updateBy.text}
                </span>
            </p>
        </div>
    )
}
const Created=(data)=>{
    return(
        <div className='jurnal-item-content-default'>
            <p className='semi-bold'>
                {data.data.data.header1.text}<br/>
                <span className='sub-jurnal-item-content-default'>
                    at {moment(data.data.data.info.dateCreated).format('DD MMM YYYY | HH:mm')} &nbsp;&nbsp;
                    <div style={{width:3,height:3,borderRadius:'50%',backgroundColor:'#cccccc'}}></div>&nbsp;&nbsp;
                    {data.data.data.updateBy.text}
                </span>
            </p>
        </div>
    )
}
const ProposalCard=(props)=>{
    const dispatch=useDispatch()

    const onClickView=(url)=>{
        dispatch(viewFile(props.token,`1/${props.data.data.info.id}/${props.profile.id}`))
    }
    return(
        <div className='jurnal-item-proposal'>
            <div className='card-header-item-jurnal'>
                <p className='semi-bold'>Proposal</p>
                <p className='card-header-item-jurnal-subtitle'>
                    Upload at {moment(props.data.data.updateTime).format('DD MMM YYYY | HH:mm')}
                </p>
            </div>
            <div className='card-content-item-jurnal'>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <p className='card-content-item-jurnal-text'>Proposal file &nbsp;&nbsp;&nbsp;{props.data.data.info.filename!==null&&props.data.data.info.filename.length>59?`${props.data.data.info.filename.substring(0,35)}...`:props.data.data.info.filename}</p>
                    <MuiThemeProvider theme={themeButton2}>
                        {props.data.data.info.filename!==""&&<Button onClick={onClickView} size='small' variant='text' color='secondary' className='btn-remove-capital' style={{fontWeight:'bold'}}>View</Button>}
                    </MuiThemeProvider>
                    
                </div>
                {/* <p className='card-content-item-jurnal-text'>Receiver client :  <span style={{color:'#3B99EB',cursor:'pointer'}}>{data.data.data.info.clientName}</span></p> */}
                <Table  size="small" aria-label="a dense table" style={{color:'#777777',marginTop:10}}>
                    <TableHead>
                    <TableRow >
                        <TableCell style={{width:150}} className='card-content-item-jurnal-text'>Period</TableCell>
                        <TableCell style={{width:150}} className='card-content-item-jurnal-text'>Value</TableCell>
                        <TableCell className='card-content-item-jurnal-text'>Remark</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.data.data.info.invoices.map((data,i)=>(
                            <TableRow >
                                <TableCell className='card-content-item-jurnal-text-without-weight'>
                                    {moment(data.invoiceDate).format('MMMM YYYY')}
                                </TableCell>
                                <TableCell className='card-content-item-jurnal-text-without-weight'>
                                    IDR <ReactNumberFormat value={data.invoiceAmount} displayType={'text'} thousandSeparator={true} />
                                </TableCell>
                                <TableCell className='card-content-item-jurnal-text-without-weight'>
                                    {data.remarks}
                                </TableCell>
                            </TableRow>
                        ))}
                        
                    </TableBody>
                </Table>
            </div>
            <br/>
            <div className='card-footer-item-jurnal'>
                <p>Proposal value: &nbsp;&nbsp;IDR <ReactNumberFormat value={props.data.data.info.proposalValue} displayType={'text'} thousandSeparator={true} /></p>
            </div>
        </div>
    )
}
const ToBeamount=(props)=>{
    const dispatch=useDispatch()

    const onClickView=(url)=>{
        dispatch(viewFile(props.token,`1/${props.data.data.info.id}/${props.profile.id}`))
    }
    return(
        <div className='jurnal-item-proposal'>
            <div className='card-header-item-jurnal'>
            <p className='semi-bold'>{props.data.data.header1.text} {moment(props.data.data.header2.text).format('DD MMMM YYYY')}</p>
            </div>
            <div className='card-content-item-jurnal'>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <p className='card-content-item-jurnal-text'>Remark : {props.data.data.info.remarks}
                        <span className='sub-jurnal-item-content-default'>
                            at {moment(props.data.data.info.updateTime).format('DD MMM YYYY | HH:mm')} &nbsp;&nbsp;
                            <div style={{width:3,height:3,borderRadius:'50%',backgroundColor:'#cccccc'}}></div>&nbsp;&nbsp;
                            {props.data.data.updateBy.text}
                        </span>
                    </p>
                </div>
               
            </div>
            <br/>
            <div className='card-footer-item-jurnal'>
                <p>Value: &nbsp;&nbsp;IDR <ReactNumberFormat value={props.data.data.info.amount} displayType={'text'} thousandSeparator={true} /></p>
            </div>
        </div>
    )
}
const ToBe=(props)=>{
    const dispatch=useDispatch()

    const onClickView=(url)=>{
        dispatch(viewFile(props.token,`1/${props.data.data.info.id}/${props.profile.id}`))
    }
    return(
        <div className='jurnal-item-proposal'>
            <div className='card-header-item-jurnal'>
            <p className='semi-bold'>{props.data.data.header1.text} </p>
            <p className='card-header-item-jurnal-subtitle'>
                Update at {moment(props.data.data.updateTime).format('DD MMM YYYY | HH:mm')}
            </p>
            </div>
            <div className='card-content-item-jurnal'>
                <div >
                    <p className='card-content-item-jurnal-text'>Invoice Date :  {moment(props.data.data.info.invoiceDate).format('DD MMM YYYY')}</p>
                    <p className='card-content-item-jurnal-text'>Remark </p>
                    <p className='card-header-item-jurnal-subtitle'>
                        {props.data.data.info.remarks}
                    </p>
                </div>
               
            </div>
            <div className='card-footer-item-jurnal'>
                <p>Value: &nbsp;&nbsp;IDR <ReactNumberFormat value={props.data.data.info.amount} displayType={'text'} thousandSeparator={true} /></p>
               
            </div>
        </div>
    )
}
const Invoiced=(props)=>{
    const dispatch=useDispatch()

    const onClickView=(url)=>{
        dispatch(viewFile(props.token,`3/${props.data.data.info.invoiceId}/${props.profile.id}`))
    }
    return(
        <div className='jurnal-item-proposal'>
            <div className='card-header-item-jurnal'>
            <p className='semi-bold'>{props.data.data.header1.text} </p>
            <p className='card-header-item-jurnal-subtitle'>
                Update at {moment(props.data.data.updateTime).format('DD MMM YYYY | HH:mm')}
            </p>
            </div>
            <div className='card-content-item-jurnal'>
                <div >
                    <p className='card-content-item-jurnal-text'>Invoice Date :  {moment(props.data.data.info.invoiceDate).format('DD MMM YYYY')}</p>
                    <p className='card-content-item-jurnal-text'>Receiver client :  <span style={{color:'#3B99EB',cursor:'pointer'}}>{props.data.data.info.contactName}</span></p>
                    <p className='card-content-item-jurnal-text'>Remark </p>
                    <p className='card-header-item-jurnal-subtitle'>
                        {props.data.data.info.remarks}
                    </p>
                </div>
               
            </div>
            <div className='card-footer-item-jurnal'>
                <p>Value: &nbsp;&nbsp;IDR <ReactNumberFormat value={props.data.data.info.amount} displayType={'text'} thousandSeparator={true} /></p>
                {props.data.data.info.filename!==''&&
                <MuiThemeProvider theme={themeButton3}>
                    <Button onClick={onClickView} size='small' variant='text' color='primary' className='btn-remove-capital' >Invoice {props.data.data.info.filename.length>35?`${props.data.data.info.filename.substring(0,35)}...`:props.data.data.info.filename}&nbsp; <img onClick={onClickView} src={EyeWhite} style={{width:15}}/></Button>
                </MuiThemeProvider>
                }
            </div>
        </div>
    )
}
const PricingCard=(props)=>{
    const dispatch=useDispatch()

    const onClickView=(url)=>{
        dispatch(viewFile(props.token,`2/${props.data.data.info.id}/${props.profile.id}`))
    }
    return(
        <div className='jurnal-item-proposal'>
            <div className='card-header-item-jurnal'>
                <p className='semi-bold'>{props.data.data.header1.text}</p>
                <p className='card-header-item-jurnal-subtitle'>
                    Upload at {moment(props.data.data.updateTime).format('DD MMM YYYY | HH:mm')}
                </p>
            </div>
            <div className='card-content-item-jurnal'>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <p className='card-content-item-jurnal-text'>{props.data.data.header2.text} File &nbsp;&nbsp;&nbsp;{props.data.data.info.filename!==null&&props.data.data.info.filename}</p>
                    <MuiThemeProvider theme={themeButton2}>
                        <Button onClick={onClickView} size='small' variant='text' color='secondary' className='btn-remove-capital'>View</Button>
                    </MuiThemeProvider>
                    
                </div>
            </div>
            <br/>
        </div>
    )
}
const SalesMeeting=(data)=>{
    let {editSalesVisit}=data
    return(
        <div className='jurnal-item-proposal'>
            <div className='card-header-item-jurnal'>
                <p className='semi-bold'>Sales Meeting</p>
    <p className='card-header-item-jurnal-subtitle'>{moment(data.data.data.info.fromTime).format('DD MMM YYYY | HH:mm')}&nbsp;&nbsp;{handle_access(data.profile.id,data.profile.roleId,[],data.new_rms_for_access)&&<img src={Edit} style={{width:15,cursor:'pointer'}} onClick={()=>editSalesVisit(data.data.data.info)}/>}</p>
            </div>
            <div className='card-content-item-jurnal'>
                <div style={{display:'flex'}}>
                    <p className='card-content-item-jurnal-text' style={{width:70}}>Client:</p>
                    <p className='card-content-item-jurnal-text'><span style={{color:'#3B99EB',cursor:'pointer'}}>{data.data.data.info.clientName}</span></p>
                </div>
                <div style={{display:'flex'}}>
                    <p className='card-content-item-jurnal-text' style={{width:70}}>Location:</p>
                    <p className='card-content-item-jurnal-text'>{data.data.data.info.location}</p>
                </div>
                <div style={{display:'flex'}}>
                    <p className='card-content-item-jurnal-text' style={{width:70}}>PIC:</p>
                    <p className='card-content-item-jurnal-text'>
                         {data.data.data.info.rms.map((data)=>(
                            <span onClick={null} style={{color:'#3B99EB',cursor:'pointer'}}>{data.text},</span>
                         ))}
                        
                    </p>
                </div>
                <div style={{display:'flex'}}>
                    <p className='card-content-item-jurnal-text' style={{width:70}}>Tribes:</p>
                    <p className='card-content-item-jurnal-text'>{data.data.data.info.tribes.map((d)=>{return d.text}).join(' , ')}</p>
                </div>
            </div>
            <br/>
            <div className='card-footer-item-jurnal-meeting'>
                <div>
                <p className='card-content-item-jurnal-text'><b>Visit objective</b></p>
                <p >{data.data.data.info.objective} </p>
                </div>
                <div>
                <p className='card-content-item-jurnal-text'><b>Next step</b></p>
                <p >{data.data.data.info.nextStep} </p>
                </div>
                <div>
                <p className='card-content-item-jurnal-text'><b>Remark</b></p>
                <p >{data.data.data.info.remark} </p>
                </div>

            </div>
        </div>
    )
}

export default function Detail(props) {
    const classes=useStyles()
    const dispatch=useDispatch()
    const pipeline=useSelector(state=>state.pipeline)
    const {rms}=pipeline.detail_deal
    const master=useSelector(state=>state.master)
    const addToBeInvoice=()=>{
        dispatch(modalToggle({
            modal_open: true,
            modal_title: "Add To Be Invoice",
            modal_component: "add_invoice",
            modal_data:null ,
            modal_size:450,
            modal_action:'add_invoice'
        }))
    }
    const addSalesVisit=(data)=>{
        dispatch(modalToggle({
            modal_open: true,
            modal_title: `Sales Visit to ${pipeline.detail_deal.clientCompany.text}`,
            modal_component: "sales_visit",
            modal_data:{
                dealId:pipeline.detail_deal.id,
            } ,
            modal_size:500,
            modal_action:'add_sales_visit'
        }))
    }
    const editSalesVisit=(data)=>{
        let new_rm=[]
        let new_consultan=[]
        data.rms.map((data)=>{
            new_rm.push({label:data.text,value:data.id})
        })
        data.consultants.map((data)=>{
            new_consultan.push({label:data.text,value:data.id})
        })
        dispatch(setSalesVisit({visitDate:data.fromTime}))
        dispatch(setSalesVisit({startTime:data.fromTime}))
        dispatch(setSalesVisit({endTime:data.toTime}))
        dispatch(setSalesVisit({contacts:data.contacts}))
        dispatch(setSalesVisit({rms:new_rm}))
        dispatch(setSalesVisit({tribes:data.tribes}))
        dispatch(setSalesVisit({consultants:new_consultan}))
        dispatch(setSalesVisit({location:data.location}))
        dispatch(setSalesVisit({objective:data.objective}))
        dispatch(setSalesVisit({nextStep:data.nextStep}))
        dispatch(setSalesVisit({remark:data.remark}))
        dispatch(setSalesVisit({id:data.visitId}))
        dispatch(modalToggle({
            modal_open: true,
            modal_title: `Sales Visit to ${pipeline.detail_deal.clientCompany.text}`,
            modal_component: "sales_visit",
            modal_data:{
                dealId:pipeline.detail_deal.id,
                ...data
            } ,
            modal_size:500,
            modal_action:'edit_sales_visit'
        }))
    }
    const addProposal=async (clientId,dealId)=>{
        dispatch(setProposal({
            dealId:dealId
        }))
        console.log('dealId', dealId)
        // if(master.contact.length>0&&master.employee.length>0){
            dispatch({
                type:actionType.RESET_PROPOSAL
            })
           dispatch(modalToggle({
                modal_open: true,
                modal_title: `Upload Proposal to ${pipeline.detail_deal.clientCompany.text}`,
                modal_component: "proposal",
                modal_data:{clientId:clientId,dealId:dealId} ,
                modal_size:550,
                modal_action:'add_proposal',
                modal_type:'multi'
            }))
            
        // }else{
        //     await dispatch(getContact(props.token,clientId))
        //     await dispatch(getEmployee(props.token))
        //     dispatch({
        //         type:actionType.RESET_PROPOSAL
        //     })
        //     dispatch(modalToggle({
        //         modal_open: true,
        //         modal_title: "Upload Proposal",
        //         modal_component: "proposal",
        //         modal_data:{clientId:clientId,dealId:dealId} ,
        //         modal_size:550,
        //         modal_action:'add_proposal',
        //         modal_type:'multi'
        //     }))
        // }
        
    }
    const new_rms_for_access=[]
     rms.map((data)=>{
         new_rms_for_access.push({id:data.userId,text:data.name})
     })
    const renderJurnal=()=>{
        let {history}=pipeline.detail_deal
        let map=history.map((data,i)=>{
            if(data.type==='prop'){
                return(
                    <div className='jurnal-item'>
                        <div className='jurnal-item-content'>
                            <ProposalCard new_rms_for_access={new_rms_for_access} data={data} profile={props.profile} token={props.token}/>
                        </div>
                    </div>
                )
            }else if(data.type==='stage'||data.type==='invoice'){
                return(
                    <div className='jurnal-item'>
                        <div className='jurnal-item-content'>
                            <Stage new_rms_for_access={new_rms_for_access} data={data}/>
                        </div>
                    </div>
                )
            }else if(data.type==='created'){
                return(
                    <div className='jurnal-item'>
                        <div className='jurnal-item-content'>
                            <Created new_rms_for_access={new_rms_for_access} data={data}/>
                        </div>
                    </div>
                )
            }else if(data.type==='meeting'){
                return(
                    <div className='jurnal-item'>
                        <div className='jurnal-item-content'>
                            <SalesMeeting new_rms_for_access={new_rms_for_access} profile={props.profile}  data={data} editSalesVisit={editSalesVisit}/>
                        </div>
                    </div>
                )
            }else if(data.type==='prob'){
                return(
                    <div className='jurnal-item'>
                        <div className='jurnal-item-content'>
                            <Probability new_rms_for_access={new_rms_for_access} profile={props.profile} data={data} editSalesVisit={editSalesVisit}/>
                        </div>
                    </div>
                )
            }else if(data.type==='pnl'){
                return(
                    <div className='jurnal-item'>
                        <div className='jurnal-item-content'>
                            <PricingCard new_rms_for_access={new_rms_for_access}  data={data}  data={data} profile={props.profile} token={props.token}/>
                        </div>
                    </div>
                )
            
            }else if(data.type==='tobeamount'){
                return(
                    <div className='jurnal-item'>
                        <div className='jurnal-item-content'>
                            <ToBeamount new_rms_for_access={new_rms_for_access} data={data}  data={data} profile={props.profile} token={props.token}/>
                        </div>
                    </div>
                )
            
            }else if(data.type==='tobe'){
                return(
                    <div className='jurnal-item'>
                        <div className='jurnal-item-content'>
                            <ToBe new_rms_for_access={new_rms_for_access} data={data}  data={data} profile={props.profile} token={props.token}/>
                        </div>
                    </div>
                )
            
            }else if(data.type==='invoiced'){
                return(
                    <div className='jurnal-item'>
                        <div className='jurnal-item-content'>
                            <Invoiced new_rms_for_access={new_rms_for_access} profile={props.profile} data={data}  data={data} profile={props.profile} token={props.token}/>
                        </div>
                    </div>
                )
            }else if(data.type==='tobedate'){
                return(
                    <div className='jurnal-item'>
                        <div className='jurnal-item-content'>
                            <ToBeDate new_rms_for_access={new_rms_for_access} data={data}  data={data} profile={props.profile} token={props.token}/>
                        </div>
                    </div>
                )
            }
        })
        return map
    }
    
    console.log('pipeline.detail_deal.stage', pipeline.detail_deal.stage)
    return (
        <div>
            <div className='jurnal-header'>
                <h3>Deal Journal</h3>
                <div style={{display:'flex'}}>
                {handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)&&
                pipeline.detail_deal.state.text==='Won'&&<Button
                    onClick={()=>addToBeInvoice()}
                    className='btn-remove-capital'
                    style={{textTransform:'none',fontWeight:'bold',color:'#777777'}}
                    variant="text"
                    color="default"
                    size="medium"
                    className={classes.button}
                    startIcon={<img src={Add} className='icon-size'/>}
                >
                    Add To be Invoice
                </Button>}
                &nbsp;
                {handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)&&
                pipeline.detail_deal.state.text!=='Lost'&&pipeline.detail_deal.state.text!=='Won'&&<Button
                    onClick={()=>addSalesVisit(pipeline.detail_deal.clientId,pipeline.detail_deal.id)}
                    className='btn-remove-capital'
                    style={{textTransform:'none',fontWeight:'bold',color:'#777777'}}
                    variant="text"
                    color="default"
                    size="medium"
                    className={classes.button}
                    startIcon={<img src={Add} className='icon-size'/>}
                >
                    Add sales visit
                </Button>}
                &nbsp;
                {handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)&&
                pipeline.detail_deal.stage.text!=='Lead in'&&pipeline.detail_deal.state.text!=='Lost'&&pipeline.detail_deal.state.text!=='Won'&&
                <Button
                    onClick={()=>addProposal(pipeline.detail_deal.clientId,pipeline.detail_deal.id)}

                    className='btn-remove-capital'
                    style={{textTransform:'none',fontWeight:'bold',color:'#777777'}}
                    variant="text"
                    color="default"
                    size="medium"
                    className={classes.button}
                    startIcon={<img src={Add} className='icon-size'/>}
                >
                    Upload Proposal
                </Button>
                }
                </div>
            </div>
            <br/>
            <div className='jurnal-wrapper'>
                {renderJurnal()}
                {/* <div className='jurnal-item'>
                    <div className='jurnal-item-content'>
                        <Status/>
                    </div>
                </div>
                <div className='jurnal-item'>
                    <div className='jurnal-item-content'>
                        <Probability/>
                    </div>
                </div>
                <div className='jurnal-item'>
                    <div className='jurnal-item-content'>
                        <Stage/>
                    </div>
                </div>
                <div className='jurnal-item'>
                    <div className='jurnal-item-content'>
                        <ProposalCard/>
                    </div>
                </div>
                <div className='jurnal-item'>
                    <div className='jurnal-item-content'>
                        <SalesMeeting detailEmployee={props.detailEmployee}/>
                    </div>
                </div> */}
            </div>
        </div>
    )
}
