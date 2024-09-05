import React,{useState, useEffect} from 'react'
import {Button,TextField,FormControl,InputLabel,OutlinedInput,MenuItem,Select,
    Modal,FormHelperText,FormControlLabel,Checkbox,Table,TableHead,TableRow,TableCell,TableBody} from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles } from '@material-ui/core/styles'
import Select1 from 'react-select'
import moment from 'moment'
import MomentUtils from '@date-io/moment';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import { useDispatch, useSelector } from "react-redux";
import {
    DatePicker,
    TimePicker,
    DateTimePicker,
    MuiPickersUtilsProvider,
  } from '@material-ui/pickers';
import {modalToggle} from 'redux/actions/general'
import {setProposal,addProposal,updateProposal} from 'redux/actions/pipeline'
import ModalContact from './add_contact_deal'
import Close from 'assets/icon/close.svg'
import Edit from 'assets/icon/edit.png'
import {handleFile,getBase64} from 'components/handleFile'
import AutoCompleteSelect from 'components/Select'
import NumberFormat from 'react-number-format'
const themeField = createMuiTheme({  
    palette: {  
        primary: {
            main:'#70BF4E',
            contrastText: '#FFFFFF',

        },
        secondary:{
            main:'#3B99EB',
            contrastText: '#FFFFFF',

        }
    } 
})
const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#70bf4e',
        },
        secondary:{
            main:'#ffb100',
            contrastText: '#FFFFFF',

        }
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
const AddContact=({modal_open,modalsToggle,modal_data,token,profile})=>{
    return(
        <Modal
            className='modal'
            open={modal_open}
            onClose={modalsToggle}
        >
            <div className='modal-content' style={{width:1100}}>
                <div className='modal-header'>
                        <h2>Add Contact</h2>
                        <img src={Close} style={{width:20}} onClick={modalsToggle}/>
                </div>
                <div className='modal-body' >
                    <ModalContact modalToggle={modalsToggle} modal_data={modal_data} token={token} profile={profile}/>
                </div>
            </div>
            
        </Modal>
    )
}
export default function Proposal(props) {
    const classes=useStyles()
    const dispatch=useDispatch()
    const [dealId,setDealId]=useState('')
    
    const [error,setError]=useState('')
    const master=useSelector(state=>state.master)
    console.log('master', master)
    const pipeline=useSelector(state=>state.pipeline)
    const {contact,rm,employee,proposalTypes}=master
    const [modal_open,setModalOpen]=useState(false)
    const modalsToggle=()=>{
        setModalOpen(!modal_open)
    }
    const onChange=(e)=>{
        let {name,value}=e.target
        dispatch(setProposal({[name]:value}))
    }
    const onChangeFile=(evt)=>{
        let handle=handleFile(evt)
        if(handle.file_error===null){
            dispatch(setProposal({filename:handle.file_name}))
            getBase64(handle.file,(result)=>{
                dispatch(setProposal({fileBase64:result}))
            })
        }else{
            setError(handle.file_error)
        }
    }
    const addPaymentPeriod=(data)=>{
        dispatch(modalToggle({
            modal_open: true,
            modal_title: "Add Invoice Period",
            modal_component: "payment_period",
            modal_data:{proposal_action:props.modal_action,id:pipeline.proposal.invoices.length+1,dealId:props.modal_data.dealId} ,
            modal_size:300,
            modal_action:'add_payment_period',
            modal_type:'multi'
        }))
        console.log('hello', props.modal_data)
    }
    const editPaymentPeriod=(data,index)=>{
        console.log('ahuhu', props.modal_data)
        dispatch(modalToggle({
            modal_open: true,
            modal_title: "Edit Invoice Period",
            modal_component: "payment_period",
            modal_data:{...data,index,proposal_action:props.modal_action,id:props.modal_data.id,dealId:props.modal_data.dealId} ,
            modal_size:300,
            modal_action:'edit_payment_period',
            modal_type:'multi'
        }))
    }
    const deletePaymentPeriod=(index,id)=>{
        console.log('pipeline.proposal.invoices,id', pipeline.proposal.invoices,id)
        pipeline.proposal.invoices.splice(index, 1);
        // let new_invoice=pipeline.proposal.invoices.filter((data)=>{
        //     return data.id!==id
        // })
        // dispatch(setProposal({invoices:new_invoice}))

        dispatch(modalToggle({
            modal_open: true,
            modal_title: "Upload Proposal for Company Name",
            modal_component: "proposal",
            modal_data:{proposal_action:props.modal_action,id:props.modal_data.id,dealId:props.modal_data.dealId} ,
            modal_size:550,
            modal_action:'add_proposal',
            modal_type:'multi'
        }))
       
    }
    const renderDisable=()=>{
        if(pipeline.proposal.sentById!==null&&pipeline.proposal.invoices.length>0){
            return false
        }else{
            return true
        }
    }
    const handleDisable=()=>{
        if(props.modal_action==='see_proposal'){
            return true
        }else{
            return false
        }
    }
    const onClickSave=()=>{

        let new_contact=[]
        let new_invoices=[]
        let {dealId,sentById,typeId,sendDate,contactIds,filename,fileBase64,proposalValue,invoices}=pipeline.proposal
        contactIds.map((data)=>{
            new_contact.push(data.id)
        })
        invoices.map((data)=>{
            new_invoices.push({id:0,invoiceDate:data.invoiceDate,invoiceAmount:data.invoiceAmount,remarks:data.remarks})
        })
        let {tribe,segment,rm,textPeriode,periode}=pipeline.filter
        let map=pipeline.filter.probability.map((data,index)=>{
            return `${data.id}`
        })
        if(props.modal_action==='edit_proposal'){
            let data_edit={
                id:props.modal_data.id,
                userId:props.profile.id,
                dealId:props.modal_data.dealId,
                sentById:sentById.value,
                typeId,
                sentDate:moment(sendDate).format('YYYY-MM-DD'),
                contactIds:new_contact,
                filename,
                fileBase64,
                proposalValue:parseInt(proposalValue),
                invoices:new_invoices
            }
            dispatch(updateProposal(props.token,data_edit,pipeline.proposal.dealId,`${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/${pipeline.filter.probability.length>0?map:0}`))
        }else{
            if(fileBase64!==null){
                let split=fileBase64.split(',')[1]
                let data={
                    userId:props.profile.id,
                    dealId,
                    sentById:sentById.value,
                    typeId,
                    sentDate:moment(sendDate).format('YYYY-MM-DD'),
                    contactIds:new_contact,
                    filename,
                    fileBase64:fileBase64!==null?split:null,
                    proposalValue:parseInt(proposalValue),
                    invoices:new_invoices
                }
                dispatch(addProposal(props.token,data,pipeline.proposal.dealId,`${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/${pipeline.filter.probability.length>0?map:0}`))
            }else{
                let data={
                    userId:props.profile.id,
                    dealId,
                    sentById:sentById.value,
                    typeId,
                    sentDate:moment(sendDate).format('YYYY-MM-DD'),
                    contactIds:new_contact,
                    filename,
                    fileBase64:null,
                    proposalValue,
                    invoices:new_invoices
                }
                dispatch(addProposal(props.token,data,pipeline.proposal.dealId,`${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/${pipeline.filter.probability.length>0?map:0}`))
            }
            
        }
        
    }

    return (
        <div className='proposal-wrapper'>
            <AddContact modal_open={modal_open} modalsToggle={modalsToggle} modal_data={props.modal_data}  token={props.token} profile={props.profile}/>
            <MuiThemeProvider theme={themeField}>

            <FormControl style={{marginTop:15}} variant="outlined" size="small" className='add-proposal__field' >
            <InputLabel  htmlFor="category">Deal type</InputLabel>
            <Select disabled={handleDisable()} value={pipeline.proposal.typeId} name='typeId'  onChange={onChange} labelId="label" id="select"  labelWidth={80} className='field-radius'>
                {proposalTypes.map((data,i)=>(
                    <MenuItem key={i} value={data.id}>{data.text}</MenuItem>
                ))}
                
            </Select>
            </FormControl>
            <div style={{display:'flex',justifyContent:'space-between'}}>
                <div style={{width:'50%'}}>
                <AutoCompleteSelect
                    onChange={(event,value)=>dispatch(setProposal({sentById:value}))}
                    options={rm}
                    value={pipeline.proposal.sentById}
                    getOptionLabel={(option) => option.label}
                    label={<>Send by</>}
                    disabled={handleDisable()}
                />
                
                </div>
                &nbsp;&nbsp;
                <div style={{width:'50%'}}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker disabled={handleDisable()} disablePast={false} value={pipeline.proposal.sendDate} onChange={(data)=>dispatch(setProposal({sendDate:data}))}  className={classes.textField}  label='Delivery date' clearable={true} size='small' inputVariant='outlined'  />
                </MuiPickersUtilsProvider>
                </div>
            </div>
            <div style={{display:'flex',marginBottom:10,justifyContent:'space-between'}}>
                <div style={{width:'70%'}}>
                <AutoCompleteSelect
                    multiple
                    onChange={(event,value)=>dispatch(setProposal({contactIds:value}))}
                    options={contact}
                    value={pipeline.proposal.contactIds}
                    getOptionLabel={(option) => option.text}
                    label={<>Receiver client</>}
                    disabled={handleDisable()}
                />
                
                </div>
                <Button disabled={handleDisable()} onClick={modalsToggle} className='remove-capital' color='secondary' variant='text' size='small'>Add new contact</Button>
            </div>
            <p className='semi-bold'>Proposal</p>
            {pipeline.proposal.filename!==''?
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <div style={{width:300}}>
                    <p className='semi-bold'><b>{pipeline.proposal.filename}</b></p>&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                    <MuiThemeProvider theme={themeButton}>
                    <Button disabled={handleDisable()} style={{marginBottom:10}} component='label' className='remove-capital' color='secondary' variant='text' size='small'>
                        Change file
                        <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={onChangeFile}
                        />
                    </Button>
                    </MuiThemeProvider>
                </div>
                
            :
            <Button disabled={handleDisable()} style={{marginBottom:10}} component='label' className='remove-capital' color='secondary' variant='text' size='small'>
                Upload file
                <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={onChangeFile}
                />
            </Button>
            }
            <CurrencyTextField
                className={classes.textField}
                label="Proposal value"
                variant="outlined"
                value={pipeline.proposal.proposalValue}
                currencySymbol="IDR"
                size='small'
                outputFormat="string"
                decimalCharacter="."
                digitGroupSeparator=","
                disabled={handleDisable()}
                onChange={(event, value)=>dispatch(setProposal({proposalValue:value}))}
            />
            <div style={{display:'flex',justifyContent:'space-between'}}>
                <p className='semi-bold'>Invoice period</p>
                <Button disabled={handleDisable()} onClick={()=>addPaymentPeriod()} className='remove-capital' color='secondary' variant='text' size='small'>Add period</Button>
            </div>
            <Table  size="small" aria-label="a dense table" style={{color:'#777777'}}>
                <TableHead>
                <TableRow >
                    <TableCell>Period</TableCell>
                    <TableCell >Value</TableCell>
                    <TableCell >Remark</TableCell>
                    <TableCell >Action</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    
                {pipeline.proposal.invoices.length>0?pipeline.proposal.invoices.map((invoices,i)=>(
                    <TableRow key={i}>
                        <TableCell>{moment(invoices.invoiceDate).format('MMM YYYY')}</TableCell>
                        <TableCell><NumberFormat value={invoices.invoiceAmount} displayType={'text'} thousandSeparator={true}  /></TableCell>
                        <TableCell>{invoices.remarks}</TableCell>
                        <TableCell>
                            <img src={Edit} onClick={()=>handleDisable()?null:editPaymentPeriod(invoices,i)} className='icon-action'/>
                            <img src={Close} onClick={()=>handleDisable()?null:deletePaymentPeriod(i,invoices.id)} className='icon-action'/>
                        </TableCell>

                    </TableRow>
                )):
                    <TableRow >
                        <TableCell style={{textAlign:'center'}} colSpan={4} >No invoice period</TableCell>
                    </TableRow>
                }
                </TableBody>
            </Table>
            </MuiThemeProvider>
            <MuiThemeProvider theme={themeButton}>
                <div className='modal-footer'>
                    {props.modal_action!=='see_proposal'&&<Button disabled={renderDisable()} onClick={onClickSave}  size='small' color='secondary' variant='contained' className='btn-remove-capital btn-rounded' style={{width:120,height:30}}>Save</Button>}
                </div>
            </MuiThemeProvider>
        </div>
    )
}
