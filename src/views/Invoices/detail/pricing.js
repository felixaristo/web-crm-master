import React,{useState,useEffect} from 'react'
import Edit from 'assets/icon/edit.png'
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
import {setProposal,viewFile} from 'redux/actions/pipeline'
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
    useEffect(()=>{
        if(pipeline.detail_deal.pricing!==null){
            setFileName(pipeline.detail_deal.pricing.filename)
        }
        if(pipeline.detail_deal.agreement!==null){
            setAgreementName(pipeline.detail_deal.agreement.filename)
        }

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
    const new_rms_for_access=[]
     rms.map((data)=>{
         new_rms_for_access.push({id:data.userId,text:data.name})
     })
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
                            disabled={handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)?false:true}
                                type="file"
                                style={{ display: "none" }}
                                onChange={onChangeFile}
                            />
                        </Button>}
                        
                        </MuiThemeProvider>
                        <MuiThemeProvider theme={themeButton2}>
                        <Button disabled={handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)?false:true} style={{fontWeight:'bold',marginBottom:10,}} onClick={()=>onClickView(pipeline.detail_deal.pricing.id)} size='small' variant='text' color='secondary' className='remove-capital'>
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
                            Upload Pricing
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
                {file_agreement_name!==''||pipeline.detail_deal.agreement!==null?
                <>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <p className='semi-bold'>Agreement file</p>&nbsp;&nbsp;&nbsp;&nbsp;
                        <div>
                        <MuiThemeProvider theme={themeButton}>
                        {handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)&&
                        <Button style={{marginBottom:10,fontWeight:'bold'}} component='label' className='remove-capital' color='secondary' variant='text' size='small'>
                            Change file
                            <input
                                type="file"
                                style={{ display: "none" }}
                                onChange={onChangeFileAgreement}
                            />
                        </Button>}
                        
                        </MuiThemeProvider>
                        <MuiThemeProvider theme={themeButton2}>
                        <Button style={{fontWeight:'bold',marginBottom:10,}} onClick={()=>onClickView(pipeline.detail_deal.agreement.id)} size='small' variant='text' color='secondary' className='remove-capital'>
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
                        <Button style={{marginBottom:10,fontWeight:'bold'}} component='label' className='remove-capital' color='secondary' variant='text' size='small'>
                            Upload
                            &nbsp;
                            <img src={upload} style={{width:15}}/>

                            <input
                                type="file"
                                style={{ display: "none" }}
                                onChange={onChangeFileAgreement}
                            />
                        </Button>}
                        </MuiThemeProvider>
                    </div>
                }
                </div>
                
            </div>
        </div>
    )
}
