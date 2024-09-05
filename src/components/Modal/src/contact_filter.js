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
import {getContact,exportContact,setContactFilter} from 'redux/actions/client'
import * as actionType from 'redux/constants/client'
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
    const client=useSelector(state=>state.client)
    // const {tribe,segment,rm,probability,periode,rangeValue,textPeriode}=pipeline.filter
    const [filter,stateFilter]=useState({
        industry:{label:'All industry',value:0},
        periode:{year: parseInt(moment().format('YYYY')), month:parseInt(moment().format('MM'))},
        textPeriode:'All Period'
    })
    const {industry,periode,textPeriode}=client.contact_filter
    
    useEffect(()=>{
        stateFilter({
            industry:industry,
            periode:periode,
            textPeriode:textPeriode
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
        stateFilter({...filter,industry:e})
    }
    const onClickSave=async ()=>{
       
        dispatch(modalToggleReset())
        const {contact_filter}=client
        // let fromMonth=filter.periode.month>9?filter.periode.month:`0${filter.periode.month}`
        let res=await dispatch(getContact(props.token,`/${filter.periode.year}${filter.periode.month}/${filter.industry.value}/1/5/*`))
        let res2=await dispatch(exportContact(props.token,`/${filter.periode.year}${filter.periode.month}/${filter.industry.value}`))
        if(res&&res2){
            // alert('asdf')
            dispatch({
                type:actionType.SET_FILTER_CONTACT,
                payload:filter
            })
        }
        
        
        
    }
    const onReset=()=>{
        stateFilter({
            industry:{label:'All industry',value:0},
            periode:{year: moment().format('YYYY'), month:moment().format('MM')},
            textPeriode:`${moment().format('MMM')}. ${moment().year()}`
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
       
        let fromMonth=value.month>9?value.month:`0${value.month}`
        // let toMonth=value.to.month>9?`${value.to.year}${value.to.month}`:`${value.to.year}0${value.to.month}`
        stateFilter({
            ...filter,
            periode:{year:value.year,month:fromMonth},
            // rangeValue:value,
            textPeriode:pickerLang.months[value.month-1] + '. ' + value.year 
        })
        
    }
    const max=moment().add(10,'year').format('YYYY')
    const min=moment().subtract(10,'year').format('YYYY')
    return (
        <div>
             <MuiThemeProvider theme={themeField}>
                <Picker
                    ref={pickRange}
                    years={{min: {year:parseInt(min),month:12},max:{year:parseInt(max),month:12}}}
                    value={filter.periode}
                    lang={pickerLang}
                    theme="light"
                    onChange={handleRangeChange}
                    onDismiss={handleRangeDissmis}
                >
                    <MonthBox textPeriode={filter.textPeriode} value={makeText(filter.periode.from) + ' - ' + makeText(filter.periode.to)} onClick={_handleClickRangeBox} />
                </Picker>
                <AutoCompleteSelect
                    onChange={(event,value)=>onChangeSelet(value)}
                    options={[{label:'All Industry',value:0},...client.list_industries]}
                    getOptionLabel={(option) => option.label}
                    label={<>Industry</>}
                    value={filter.industry}
                    disableClearable={true}

                />
                
               
                
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
