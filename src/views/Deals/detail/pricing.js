import React,{useState,useEffect} from 'react'
import Edit from 'assets/icon/edit.png'
import Close from 'assets/icon/close.svg'
import Building from 'assets/icon/Building.svg'
import User from 'assets/icon/User.svg'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles
} from '@material-ui/core/styles'
import {Button,TextField,Table,TableHead,TableRow,TableCell,TableBody,
InputLabel,Select,MenuItem,FormControl,} from '@material-ui/core'
import Select1 from 'react-select'
import moment from 'moment'
import ReactNumberFormat from 'react-number-format'
import {modalToggle} from 'redux/actions/general'
import {setProposal,viewFile, getStatusUpdate, deleteUpdateStatus} from 'redux/actions/pipeline'
import { useDispatch, useSelector } from "react-redux";
import {postPricing} from 'redux/actions/pipeline'
import {postAgreement} from 'redux/actions/invoices'
import {handleFile,getBase64} from 'components/handleFile'
import upload from 'assets/icon/Upload.svg'
import {handle_access} from 'service/handle_access'
const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#70bf4e',
            contrastText: '#FFFFFF',
        },
        secondary: {
            // main:'#FF7165',
            main:'#ffb100',
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
      marginBottom:15
  }
  
}));
export default function Pricing(props) {
    const classes=useStyles()
    const dispatch=useDispatch()
    const master=useSelector(state=>state.master)
    const pipeline=useSelector(state=>state.pipeline)
    const {rms}=pipeline.detail_deal
    const [error,setError]=useState('')
    const [file,setFile]=useState(null)
    const [agreementFile,setAgreementFile]=useState(null)
    const [file_name,setFileName]=useState('')
    const [file_agreement_name,setAgreementName]=useState('')

    const [dataUpdateStatus,setUpdateStatusData]=useState('')
    useEffect(()=>{
        if(pipeline.detail_deal.pricing!==null){
            setFileName(pipeline.detail_deal.pricing.filename)
        }
        if(pipeline.detail_deal.agreement!==null){
            setAgreementName(pipeline.detail_deal.agreement.filename)
        }

        dispatch(getStatusUpdate(props.token, pipeline.detail_deal.id))

    },[])
    const onChangeFile=(evt)=>{
        let handle=handleFile(evt)
        if(handle.file_error===null){
            setFileName(handle.file_name)
            let fd=new FormData()
            fd.append('id',0)
            fd.append('userId',props.profile.id)
            fd.append('dealId',pipeline.detail_deal.id)
            fd.append('DocumentType',1)
            fd.append('files',handle.file)
            dispatch(postPricing(props.token,fd))

        }else{
            setError(handle.file_error)
        }
    }
    const onChangeFileAgreement=(evt)=>{
        let handle=handleFile(evt)
        if(handle.file_error===null){
            setAgreementName(handle.file_name)
            let fd=new FormData()
            fd.append('id',0)
            fd.append('userId',props.profile.id)
            fd.append('dealId',pipeline.detail_deal.id)
            fd.append('DocumentType',2)
            fd.append('files',handle.file)
            dispatch(postAgreement(props.token,fd))

        }else{
            setError(handle.file_error)
        }
    }
    const onClickView=(id)=>{
        // let {proposal}=pipeline.detail_deal
        // console.log('proposal', proposal.proposalType.id,proposal.id)
        // console.log('pipeline.detail_deal', pipeline.detail_deal)
        dispatch(viewFile(props.token,`2/${id}/${props.profile.id}`))
    }

    const deleteAction=(data)=>{
        let send = {
            id: data.id,
            userId: data.userId,
            dealId: pipeline.detail_deal.id,
        }
        dispatch(deleteUpdateStatus(props.token, send))
    }
    const deleteStatus=(data)=>{
        dispatch(modalToggle({
            modal_open: true,
            modal_title: "Delete ",
            modal_component: "confirm_delete",
            modal_size:400,
            modal_type:'confirm',
            modal_data:{
                title:'Status',
                modalAction:()=>deleteAction(data),
                msg:`<p>Are you sure Delete <b>${data.status}</b> ?</p>`
            }
        }))
    }

    const editStatus=(data)=>{
        dispatch(modalToggle({
            modal_open: true,
            modal_title: "Update Status",
            modal_component: "update_status",
            modal_data:{
                id: data.id,
                dealId: pipeline.detail_deal.id,
                status: data.status
            },
            modal_size:350,
            modal_action:'edit_status'
        }))
    }

    const new_rms_for_access=[]
     rms.map((data)=>{
         new_rms_for_access.push({id:data.userId,text:data.name})
     })
     console.log(pipeline.data_status_update);

    const addStatus=()=>{
        dispatch(modalToggle({
            modal_open: true,
            modal_title: "Add Status",
            modal_component: "update_status",
            modal_data:{
                id: 0,
                dealId: pipeline.detail_deal.id,
                status: ''
            },
            modal_size:350,
            modal_action:'add_status'
        }))
    }
    return (
        <div>
           <div className='detail-card-wrapper'>
                <div className='detail-card-header'>
                    <h3>Document</h3>
                    
                </div>
                <div className='detail-card-body'>
                {file_name!==''||pipeline.detail_deal.pricing!==null?
                <>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <p className='semi-bold'>Pricing file</p>&nbsp;&nbsp;&nbsp;&nbsp;
                        <div>
                        <MuiThemeProvider theme={themeButton}>
                        {handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)&&
                        <Button disabled={handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)?false:true} style={{marginBottom:10,fontWeight:'bold'}} component='label' className='remove-capital' color='secondary' variant='text' size='small'>
                            Change file
                            <input
                            // disabled={?false:true}
                                type="file"
                                style={{ display: "none" }}
                                onChange={onChangeFile}
                            />
                        </Button>
                        }
                        </MuiThemeProvider>
                        <MuiThemeProvider theme={themeButton2}>
                        <Button  style={{fontWeight:'bold',marginBottom:10,}} onClick={()=>onClickView(pipeline.detail_deal.pricing.id)} size='small' variant='text' color='secondary' className='remove-capital'>
                            View
                        </Button>
                        </MuiThemeProvider>
                        </div>
                    </div>
                    <p className='semi-bold'>{file_name}</p>
                    
                    </>
                :
                    <div style={{textAlign:'center'}}>
                        {pipeline.detail_deal.state.text!=='Lost'&&handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)&&<Button component='label' size='small' color='primary' variant='contained' className='head-add-section__btn remove-boxshadow' style={{width:180}}>
                            Upload Pricings
                            <input
                            disabled={handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)?false:true}
                                type="file"
                                style={{ display: "none" }}
                                onChange={onChangeFile}
                            />
                        </Button>}
                    </div>
                } 
                <br/>
                <div style={{height:1.2,marginBottom:10,width:'100%',backgroundColor:'#777777'}}></div>
                {pipeline.detail_deal.stage.text==='Won'||pipeline.detail_deal.stage.text==='Lost'&&
                <>
                {file_agreement_name!==''&&pipeline.detail_deal.agreement!==null?
                <>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <p className='semi-bold'>Agreement file</p>&nbsp;&nbsp;&nbsp;&nbsp;
                        <div>
                        <MuiThemeProvider theme={themeButton}>
                        {handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)&&
                        <Button  style={{marginBottom:10,fontWeight:'bold'}} component='label' className='remove-capital' color='secondary' variant='text' size='small'>
                            Change file
                            <input
                            disabled={handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)?false:true}
                                type="file"
                                style={{ display: "none" }}
                                onChange={onChangeFileAgreement}
                            />
                        </Button>
                        }
                        </MuiThemeProvider>
                        <MuiThemeProvider theme={themeButton2}>
                        <Button  style={{fontWeight:'bold',marginBottom:10,}} onClick={()=>onClickView(pipeline.detail_deal.agreement.id)} size='small' variant='text' color='secondary' className='remove-capital'>
                            View
                        </Button>
                        
                        </MuiThemeProvider>
                        </div>
                       
                    </div>
                    <p className='semi-bold'>{file_agreement_name}</p>
                    
                    </>
                :
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <p className='semi-bold'>Agreement file</p>
                        <MuiThemeProvider theme={themeButton2}>
                        {handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)&&
                        <Button disabled={handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)?false:true} style={{marginBottom:10,fontWeight:'bold'}} component='label' className='remove-capital' color='secondary' variant='text' size='small'>
                            Upload
                            &nbsp;
                            <img src={upload} style={{width:15}}/>

                            <input
                            disabled={handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)?false:true}
                                type="file"
                                style={{ display: "none" }}
                                onChange={onChangeFileAgreement}
                            />
                        </Button>
                        }
                        </MuiThemeProvider>
                    </div>
                }
                </>
                }
                </div>
                
            </div>

            <div className='detail-card-wrapper'>
                <div className='detail-card-header'>
                    <h3>Status Update</h3>
                    <div style={{display:'flex'}}>
                        <MuiThemeProvider theme={themeButton2}>
                            {/* <Button onClick={detailProposal} size='small' variant='text' color='secondary' className='btn-remove-capital'>Detail Proposal</Button>
                            &nbsp;&nbsp;&nbsp;&nbsp; */}
                            {<img onClick={addStatus} src={Edit} className='card-header-icon' />}
                        </MuiThemeProvider>
                    </div>
                </div>
                <div className='detail-card-body'>

                            <Table  size="small" aria-label="a dense table" style={{color:'#777777',marginTop:10}}>
                                <TableHead>
                                    <TableRow >
                                        <TableCell style={{width:100}} className='card-content-item-jurnal-text'>Status</TableCell>
                                        <TableCell style={{width:110}} className='card-content-item-jurnal-text'>Date</TableCell>
                                        <TableCell style={{width:110}} className='card-content-item-jurnal-text'>By</TableCell>
                                        <TableCell style={{width:110}} className='card-content-item-jurnal-text'>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pipeline.data_status_update?.map((data,i)=>(
                                        <TableRow >
                                            <TableCell className='card-content-item-jurnal-text-without-weight'>
                                                {data.status}
                                            </TableCell>
                                            <TableCell className='card-content-item-jurnal-text-without-weight'>
                                                {moment(data.lastUpdated).format('DD-MM-YYYY')}
                                            </TableCell>
                                            <TableCell className='card-content-item-jurnal-text-without-weight'>
                                                {data.firstname}
                                            </TableCell>
                                            <TableCell className='card-content-item-jurnal-text-without-weight'>
                                                <img src={Edit} onClick={()=>editStatus(data)} className='icon-action'/>
                                                <img src={Close} onClick={()=>deleteStatus(data)} className='icon-action'/>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                </div>
            </div>
            <br/>
        </div>
    )
}
