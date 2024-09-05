import React,{useState,useRef,useEffect} from 'react'
import {Button,TextField,FormControl,InputLabel,OutlinedInput,MenuItem,Select,
    FormHelperText,FormControlLabel,Checkbox,Table,TableHead,TableRow,TableCell,TableBody} from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles } from '@material-ui/core/styles'
import Select1 from 'react-select'
import moment from 'moment'
import MomentUtils from '@date-io/moment';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import { useDispatch, useSelector } from "react-redux";
import {modalToggle,modalToggleReset} from 'redux/actions/general'
import {reportFilter,getReportProjected,getReportInvoice} from 'redux/actions/report'
import { isEmpty,debounce } from "lodash";
import 'react-month-picker/css/month-picker.css';
import Picker from 'react-month-picker'
import * as actionType from 'redux/constants/report'
import {
    DatePicker,
    TimePicker,
    DateTimePicker,
    MuiPickersUtilsProvider,
  } from '@material-ui/pickers';

import AutoCompleteSelect from 'components/Select'

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
            main:'#3B99EB',
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
const MonthBox=(props)=>{
    const classes=useStyles()

    const _handleClick=(e)=> {
        props.onClick && props.onClick(e);
      }
      console.log('props', props)
    return(
        <TextField
            label='Period'
            // type='text'
            value={props.textPeriode}
            onFocus={_handleClick}
            // onChange={onChange}
            color='primary'
            variant='outlined'
            size='small'
            name='name'
            className={classes.textField}

        />
    )
    // return <p onClick={_handleClick}>{props.value}</p>
}
export default function Payment_period(props) {
    const [search,setSearch]=useState('*')
    const classes=useStyles()
    const dispatch=useDispatch()
    const report=useSelector(state=>state.report)
    const [filter,stateFilter]=useState({
       unit:'',
       periode:{year:parseInt(moment().format('YYYY')),month:parseInt(moment().format('M'))},
    //    periode:{from: {year: parseInt(moment().subtract('2','years').format('YYYY')), month:parseInt(moment().format('M')) }, to: {year: parseInt(moment().format('YYYY')), month: parseInt(moment().format('M'))}},
       textPeriode:''
    })
    const {unit,year,month}=report.filter

    useEffect(()=>{
        stateFilter({
            unit,
            periode:{year,month},
            textPeriode:pickerLang.months[month-1] + '. ' + year
        })
    },[])
    
    
    const pickRange=useRef(null)
    const onChange=(e)=>{
        let {name,value}=e.target
        stateFilter({
            ...filter,
            [name]:value
        })
    }
    const onChangeSelet=(e)=>{
        stateFilter({...filter,rm:e})
    }
    const onClickSave=async ()=>{
       
        dispatch(modalToggleReset())
        console.log('props.modal_action', props.modal_action)
        if(props.modal_action==='invoice_1month'){
            let year1=moment().subtract('2','years').format('YYYY')
            let year2=moment().subtract('1','years').format('YYYY')
            let year3=moment().format('YYYY')
            
            let res=await dispatch(getReportInvoice(props.token,`/${filter.unit}/${year1}/${year2}/${year3}/${filter.periode.month}/${filter.periode.month}`))
            if(res){
                dispatch({
                    type:actionType.SET_TABLE_TITLE,
                    payload:`Invoice in ${pickerLang.months[filter.periode.month-1]} ${filter.periode.year}`
                })
            dispatch(reportFilter({unit:filter.unit}))
            dispatch(reportFilter({year:filter.periode.year}))
            dispatch(reportFilter({month:filter.periode.month}))
            }
        }else{
            let res=await dispatch( getReportProjected(props.token,`/${filter.unit}/${filter.periode.month}/${filter.periode.year}`))
            if(res){
                dispatch({
                    type:actionType.SET_TABLE_TITLE,
                    payload:`Projected Revenue in ${pickerLang.months[filter.periode.month-1]} ${filter.periode.year}`
                })
            dispatch(reportFilter({unit:filter.unit}))
            dispatch(reportFilter({year:filter.periode.year}))
            dispatch(reportFilter({month:filter.periode.month}))
            }
        }
    }
    const onReset=()=>{
        stateFilter({
           unit:'tribe',
           periode:{year:parseInt(moment().format('YYYY')),month:parseInt(moment().format('M'))},
           textPeriode:pickerLang.months[month-1] + '. ' + year
        })
       
    }
    
    const makeText = m => {
        if (m && m.year && m.month) return (pickerLang.months[m.month-1] + '. ' + m.year)
        return '?'
    }
    const pickerLang = {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        from: 'From', to: 'To',
    }
    const _handleClickRangeBox=(e)=>{
        pickRange.current.show()
    }
    const handleRangeChange=(value, text, listIndex)=> {
       
    }
    const handleRangeDissmis=(value)=> {
       
        stateFilter({
            ...filter,
            periode:{year:value.year,month:value.month},
            textPeriode:pickerLang.months[value.month-1] + '. ' + value.year 
        })
        // console.log('value hihi', value)
        
    }
    const max=moment().add(10,'year').format('YYYY')
    const min=moment().subtract(10,'year').format('YYYY')
    return (
        <div>
             <MuiThemeProvider theme={themeField}>
                <FormControl variant="outlined" size="small" className='add-proposal__field' >
                    <InputLabel  htmlFor="category">Unit</InputLabel>
                    <Select name='unit' value={filter.unit}  onChange={onChange} labelId="label" id="select"  labelWidth={40} className='field-radius'>
                        <MenuItem value='tribe'>Tribe</MenuItem>
                        <MenuItem value='rm'>Relationship Manager</MenuItem>
                        <MenuItem value='segment'>Segment</MenuItem>
                        <MenuItem value='branch'>Branch</MenuItem>
                        
                        
                    </Select>
                </FormControl>
                <Picker
                    ref={pickRange}
                    years={{min: {year:parseInt(min),month:12},max:{year:parseInt(max),month:12}}}
                    value={filter.periode}
                    lang={pickerLang}
                    theme="light"
                    onChange={handleRangeChange}
                    onDismiss={handleRangeDissmis}
                >
                    <MonthBox textPeriode={filter.textPeriode} value={makeText(filter.periode)} onClick={_handleClickRangeBox} />
                </Picker>
                
                </MuiThemeProvider>
                <MuiThemeProvider theme={themeButton}>
                    <div style={{display:'flex',padding:'15px 5px 20px 5px',justifyContent:'space-between'}}>
                        <Button onClick={onReset}  size='small' color='primary' variant='text' className='remove-capital' >Reset filter</Button>
                        <Button onClick={onClickSave}  size='small' color='secondary' variant='contained' className='btn-remove-capital btn-rounded' style={{width:120,height:30}}>Save</Button>
                    </div>
                </MuiThemeProvider>
        </div>
    )
}
