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
import {setFilter,getInvoice} from 'redux/actions/invoices'
import { isEmpty,debounce } from "lodash";
import 'react-month-picker/css/month-picker.css';
import Picker from 'react-month-picker'

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
    const pipeline=useSelector(state=>state.pipeline)
    const master=useSelector(state=>state.master)
    const invoices=useSelector(state=>state.invoices)
    // const {tribe,segment,rm,probability,periode,rangeValue,textPeriode}=pipeline.filter
    const [filter,stateFilter]=useState({
        tribe:0,
        segment:0,
        rm:{label:'All RM',value:0},
        periode:{fromMonth:0,toMonth:0},
        probability:[],
        rangeValue:{from: {year: parseInt(moment().format('YYYY')), month:parseInt(moment().format('M'))}, to: {year: parseInt(moment().format('YYYY')), month: parseInt(moment().format('M'))}},
        textPeriode:'All Period'
    })
    const {tribe,segment,rm,probability,periode,rangeValue,textPeriode}=filter

    useEffect(()=>{
        stateFilter({
            tribe:invoices.filter.tribe,
            segment:invoices.filter.segment,
            rm:invoices.filter.rm,
            periode:invoices.filter.periode,
            probability:invoices.filter.probability,
            rangeValue:invoices.filter.rangeValue,
            textPeriode:invoices.filter.textPeriode
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
        let length=probability.length
        let map=probability.map((data,index)=>{
            return `${data.id}`
        })
        // if(master.tab_active==='pipeline'){
            let res=await dispatch( getInvoice(props.token,`${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/${props.modal_action==='to_beinvoice'?1:0}`,props.modal_action))
            if(res){
                dispatch(setFilter({tribe:tribe}))
                dispatch(setFilter({segment:segment}))
                dispatch(setFilter({rm:rm}))
                dispatch(setFilter({periode:periode}))
                dispatch(setFilter({probability:probability}))
                dispatch(setFilter({rangeValue:rangeValue}))
                dispatch(setFilter({textPeriode:textPeriode}))
            }
        // }
        
    }
    const onReset=()=>{
        stateFilter({
            tribe:0,
            segment:0,
            rm:{label:'All RM',value:0},
            periode:{fromMonth:0,toMonth:0},
            probability:[],
            rangeValue:{from: {year: parseInt(moment().format('YYYY')), month:parseInt(moment().format('M'))}, to: {year: parseInt(moment().format('YYYY')), month: parseInt(moment().format('M'))}},
            textPeriode:'All Period'
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
       
        let fromMonth=value.from.month>9?`${value.from.year}${value.from.month}`:`${value.from.year}0${value.from.month}`
        let toMonth=value.to.month>9?`${value.to.year}${value.to.month}`:`${value.to.year}0${value.to.month}`
        stateFilter({
            ...filter,
            periode:{fromMonth:fromMonth,toMonth:toMonth},
            rangeValue:value,
            textPeriode:pickerLang.months[value.from.month-1] + '. ' + value.from.year + ' - '+pickerLang.months[value.to.month-1] + '. ' + value.to.year
        })
        
        
    }
    const max=moment().add(10,'year').format('YYYY')
    const min=moment().subtract(10,'year').format('YYYY')
    return (
        <div>
             <MuiThemeProvider theme={themeField}>
                <FormControl variant="outlined" size="small" className='add-proposal__field' >
                    <InputLabel  htmlFor="category">Year</InputLabel>
                    <Select name='tribe' value={tribe}  onChange={onChange} labelId="label" id="select"  labelWidth={40} className='field-radius'>
                        <MenuItem value={0}>2020</MenuItem>
                        <MenuItem value={0}>RM</MenuItem>
                        <MenuItem value={0}>Segment</MenuItem>
                        <MenuItem value={0}>Branch</MenuItem>
                        
                        
                    </Select>
                </FormControl>
                <Picker
                    ref={pickRange}
                    years={{min: {year:parseInt(min),month:12},max:{year:parseInt(max),month:12}}}
                    value={filter.rangeValue}
                    lang={pickerLang}
                    theme="light"
                    onChange={handleRangeChange}
                    onDismiss={handleRangeDissmis}
                >
                    <MonthBox textPeriode={filter.textPeriode} value={makeText(filter.rangeValue.from) + ' - ' + makeText(filter.rangeValue.to)} onClick={_handleClickRangeBox} />
                </Picker>
                
                </MuiThemeProvider>
                <MuiThemeProvider theme={themeButton}>
                    <div style={{display:'flex',padding:'15px 5px 20px 5px',justifyContent:'space-between'}}>
                        <Button onClick={onReset}  size='small' color='primary' variant='text' className='btn-remove-capital' >Reset filter</Button>
                        <Button onClick={onClickSave}  size='small' color='secondary' variant='contained' className='btn-remove-capital btn-rounded' style={{width:120,height:30}}>Save</Button>
                    </div>
                </MuiThemeProvider>
        </div>
    )
}
