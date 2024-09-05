import React,{useState,useEffect} from 'react'
import {Button,TextField,FormControl,InputLabel,OutlinedInput,MenuItem,Select,
    FormHelperText,FormControlLabel,Checkbox,Table,TableHead,TableRow,TableCell,TableBody} from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles } from '@material-ui/core/styles'
import Select1 from 'react-select'
import moment from 'moment'
import MomentUtils from '@date-io/moment';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import { useDispatch, useSelector } from "react-redux";
import {modalToggle} from 'redux/actions/general'
import {
    DatePicker,
    TimePicker,
    DateTimePicker,
    MuiPickersUtilsProvider,
  } from '@material-ui/pickers';
import { setProposal } from 'redux/actions/pipeline'
const themeField = createMuiTheme({  
    palette: {  
        primary: {
            main:'#afe597',
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
export default function Payment_period(props) {

    const [state,setState]=useState({
        invoiceDate:moment().format('YYYY-MM-DD'),
        invoiceAmount:0,
        remarks:''
    })
    useEffect(() => {
        if(props.modal_data!==null){
            setState({
                ...state,
                invoiceDate:props.modal_data.invoiceDate,
                invoiceAmount:props.modal_data.invoiceAmount,
                remarks:props.modal_data.remarks
            })
        }
    }, [])
    const classes=useStyles()
    const dispatch=useDispatch()
    const pipeline=useSelector(state=>state.pipeline)
    const onChange=(e)=>{
        let {name,value}=e.target
        setState({
            ...state,
            [name]:value
        })
    }
    const onClickSave=()=>{
        if(props.modal_action==='add_payment_period'){

            let length=pipeline.proposal.invoices.length
            let newId=pipeline.proposal.invoices[length-1]
            let data=[
                ...pipeline.proposal.invoices,
                {
                    id:length>0?newId.id+1:length+1,
                    invoiceDate:moment(state.invoiceDate).format('YYYY-MM-DD'),
                    invoiceAmount:state.invoiceAmount,
                    remarks:state.remarks
                }
            ]
            dispatch(setProposal({invoices:data}))
            dispatch(modalToggle({
                modal_open: true,
                modal_title: "Upload Proposal for Company Name",
                modal_component: "proposal",
                modal_data:{id:props.modal_data.id,id:props.modal_data.id,dealId:props.modal_data.dealId}  ,
                modal_size:550,
                modal_action:props.modal_data.proposal_action,
                modal_type:'multi'
            }))
        }else{
            let data=[
                {
                    id:props.modal_data.index,
                    invoiceDate:moment(state.invoiceDate).format('YYYY-MM-DD'),
                    invoiceAmount:state.invoiceAmount,
                    remarks:state.remarks
                }
            ]
            console.log('data ahihi', data,props.modal_data)
            pipeline.proposal.invoices.splice(props.modal_data.index, 1);
            pipeline.proposal.invoices.splice(props.modal_data.index, 0, ...data);
            
           
            dispatch(modalToggle({
                modal_open: true,
                modal_title: "Upload Proposal for Company Name",
                modal_component: "proposal",
                modal_data:{id:props.modal_data.id,id:props.modal_data.id,dealId:props.modal_data.dealId}  ,
                modal_size:550,
                modal_action:props.modal_data.proposal_action,
                modal_type:'multi'
            }))

        }
    }
    return (
        <div>
             <MuiThemeProvider theme={themeField}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    {/* <DatePicker value={state.invoiceDate} onChange={(data)=>setState({...state,invoiceDate:data})} views={['month']}   className={classes.textField}  label='Period' clearable={true} size='small' inputVariant='outlined'  /> */}
                    <DatePicker disablePast={false} value={state.invoiceDate} onChange={(data)=>setState({...state,invoiceDate:data})}   className={classes.textField}  label='Period' clearable={true} size='small' inputVariant='outlined'  />
                </MuiPickersUtilsProvider>
                <CurrencyTextField
                    className={classes.textField}
                    label="Value"
                    variant="outlined"
                    value={state.invoiceAmount}
                    currencySymbol="IDR"
                    size='small'
                    outputFormat="string"
                    decimalCharacter="."
                    digitGroupSeparator=","
                    name='invoiceAmount'
                    onChange={(event, value)=>setState({...state,invoiceAmount:value})}
                />
                <TextField
                    label='Remark'
                    type='text'
                    value={state.remarks}
                    name='remarks'
                    onChange={onChange}
                    variant='outlined'
                    size='small'
                    className={classes.textField}
                    multiline
                />
            </MuiThemeProvider>
            <MuiThemeProvider theme={themeButton}>
                <div className='modal-footer'>
                    <Button onClick={onClickSave}  size='small' color='secondary' variant='contained' className='btn-remove-capital btn-rounded' style={{width:120,height:30}}>Save</Button>
                </div>
            </MuiThemeProvider>
        </div>
    )
}
