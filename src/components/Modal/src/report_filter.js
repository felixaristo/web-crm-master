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
       periode2:{year:parseInt(moment().format('YYYY')),month:parseInt(moment().format('M'))},
       periode:{from: {year: parseInt(moment().format('YYYY')), month:parseInt(moment().month(0).format('M')) }, to: {year: parseInt(moment().format('YYYY')), month: parseInt(moment().format('M'))}},
       textPeriode:'All Period'
    })
    const {unit,year,month,periode}=report.filter
    console.log('report.filter', report.filter)
    useEffect(()=>{
        stateFilter({
            ...filter,
            unit,
            periode:periode,
            textPeriode:makeText(filter.periode.from) + ' - ' + makeText(filter.periode.to)
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
        let year1=moment().subtract('2','years').format('YYYY')
        let year2=moment().subtract('1','years').format('YYYY')
        let year3=moment().format('YYYY')
        console.log('filter', filter)
        // let fromMonth=filter.periode.from.month
        let fromMonth=moment().month(0).format('M')
        // console.log('filter.periode2', filter.periode2)
        let toMonth=filter.periode2.month
        let res=await dispatch(getReportInvoice(props.token,`/${filter.unit}/${year1}/${year2}/${year3}/${fromMonth}/${toMonth}`))
        if(res){
            dispatch({
                type:actionType.SET_TABLE_TITLE,
                payload:`Invoice in ${pickerLang.months[0]} to ${pickerLang.months[filter.periode2.month-1]} ${filter.periode2.year}`
            })
           dispatch(reportFilter({unit:filter.unit}))
           dispatch(reportFilter({year:filter.periode2.year}))
           dispatch(reportFilter({periode:filter.periode2}))
        }
        
    }
    const onReset=()=>{
        stateFilter({
            unit:'tribe',
            periode:{from: {year: parseInt(moment().format('YYYY')), month:parseInt(moment().format('M')) }, to: {year: parseInt(moment().format('YYYY')), month: parseInt(moment().format('M'))}},
            periode2:{year:parseInt(moment().format('YYYY')),month:parseInt(moment().month(0).format('M'))},
            textPeriode:moment().month(0).format('MMM')+ '. ' + year + ' - ' + pickerLang.months[month-1] + '. ' + year
        })
       
    }
    
    const makeText = m => {
        if (m && m.year && m.month) return (pickerLang.months[m.month-1] )
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
            // periode:{from: {year: value.from.year, month:value.from.month }, to: {year: value.to.year, month: value.to.month}},
            // textPeriode:pickerLang.months[value.from.month-1] + '. ' + value.from.year + ' - '+pickerLang.months[value.to.month-1] + '. ' + value.to.year,
            periode2:{year:value.year,month:value.month},
            textPeriode:moment().month(0).format('MMM')+ '. ' + value.year + ' - ' + pickerLang.months[value.month-1] + '. ' + value.year 
        })
        
    }
    const max=moment().format('YYYY')
    const min=moment().format('YYYY')
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
                    months={{min:{month:1},max:{month:7}}}
                    years={{min: {year:parseInt(min),month:1},max:{year:parseInt(max),month:parseInt(moment().format('M'))}}}
                    value={filter.periode2}
                    lang={pickerLang}
                    theme="light"
                    onChange={handleRangeChange}
                    onDismiss={handleRangeDissmis}
                >
                    <MonthBox textPeriode={filter.textPeriode} value={makeText(filter.periode.from) + ' - ' + makeText(filter.periode.to)} onClick={_handleClickRangeBox} />
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
