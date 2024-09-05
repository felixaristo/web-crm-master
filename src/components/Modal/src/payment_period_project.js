import React,{useState,useEffect} from 'react'
import {Button,TextField,FormControl,InputLabel,OutlinedInput,MenuItem,Select,
    FormHelperText,FormControlLabel,Checkbox,Table,TableHead,TableRow,TableCell,TableBody} from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles } from '@material-ui/core/styles'
import Select1 from 'react-select'
import moment from 'moment'
import MomentUtils from '@date-io/moment';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import { useDispatch, useSelector } from "react-redux";
import {modalToggle,modalToggleReset} from 'redux/actions/general'
import {
    DatePicker,
    TimePicker,
    DateTimePicker,
    MuiPickersUtilsProvider,
  } from '@material-ui/pickers';
import { setProposal,postInvoice } from 'redux/actions/pipeline'
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
export default function Payment_period_project(props) {

    const [state,setState]=useState({
        invoiceDate:moment().format('YYYY-MM-DD'),
        invoiceAmount:0,
        remarks:''
    })
    useEffect(() => {
        // console.log('props.modal_data', props.modal_data)
        if(props.modal_data!==null){
            setState({
                ...state,
                invoiceDate:props.modal_data.invoiceDate,
                invoiceAmount:props.modal_data.value,
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
        // console.log('name,value', name,value)
    }
    const onClickSave=()=>{
        console.log('hello')
        let data={
            dealId:props.modal_data.dealId,
            invoiceId:props.modal_data.id,
            userId:props.profile.id,
            month:props.modal_data.month,
            year:props.modal_data.year,
            amount:state.invoiceAmount,
            remarks:state.remarks,
            invoiceDate:moment(state.invoiceDate).format('YYYY-MM-DD')
        }
        console.log('data heho', data)
        dispatch(modalToggleReset())
        dispatch(postInvoice(props.token,data,props.modal_data.clientId))
    }

    console.log('state', state)
    return (
        <div>
             <MuiThemeProvider theme={themeField}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    {/* <DatePicker value={state.invoiceDate} onChange={(data)=>setState({...state,invoiceDate:data})} views={['month']}   className={classes.textField}  label='Period' clearable={true} size='small' inputVariant='outlined'  /> */}
                    <DatePicker value={state.invoiceDate} onChange={(data)=>setState({...state,invoiceDate:data})}   className={classes.textField}  label='Period' clearable={true} size='small' inputVariant='outlined'  />
                </MuiPickersUtilsProvider>
                <CurrencyTextField
                    className={classes.textField}
                    label="Value (IDR)"
                    variant="outlined"
                    value={state.invoiceAmount}
                    currencySymbol="Rp"
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
