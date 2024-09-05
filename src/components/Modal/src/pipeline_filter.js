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
import {setFilter,getPipeline,getProject,getSummary} from 'redux/actions/pipeline'
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
      console.log('props', props)
    return(
        <TextField
            label='Deal period'
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
            tribe:pipeline.filter.tribe,
            segment:pipeline.filter.segment,
            rm:pipeline.filter.rm,
            periode:pipeline.filter.periode,
            probability:pipeline.filter.probability,
            rangeValue:pipeline.filter.rangeValue,
            textPeriode:pipeline.filter.textPeriode
        })
    },[])
    
    // const [rangeValue,setRangeValue]=useState({from: {year: parseInt(moment().format('YYYY')), month:parseInt(moment().format('M'))}, to: {year: parseInt(moment().format('YYYY')), month: parseInt(moment().format('M'))}})
    // const [rangeValue,setRangeValue]=useState({from: {year: 0, month:0}, to: {year: 0, month: 0}})
    // const [textPeriode,setTextPeriode]=useState('All Period')
    const pickRange=useRef(null)
    const onChange=(e)=>{
        let {name,value}=e.target
        stateFilter({
            ...filter,
            [name]:value
        })
        // dispatch(setFilter({[name]:value}))
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
        if(master.tab_active==='pipeline'){
            let res=await dispatch(getPipeline(props.token,`${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/${probability.length>0?map:0}`))
            if(res){
                dispatch(setFilter({tribe:tribe}))
                dispatch(setFilter({segment:segment}))
                dispatch(setFilter({rm:rm}))
                dispatch(setFilter({periode:periode}))
                dispatch(setFilter({probability:probability}))
                dispatch(setFilter({rangeValue:rangeValue}))
                dispatch(setFilter({textPeriode:textPeriode}))
            }
        }else if(master.tab_active==='projection'){
            let res=await dispatch( getProject(props.token,`${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/${probability.length>0?map:0}`))
            if(res){
                dispatch(setFilter({tribe:tribe}))
                dispatch(setFilter({segment:segment}))
                dispatch(setFilter({rm:rm}))
                dispatch(setFilter({periode:periode}))
                dispatch(setFilter({probability:probability}))
                dispatch(setFilter({rangeValue:rangeValue}))
                dispatch(setFilter({textPeriode:textPeriode}))
            }
        }else{
            let res=await dispatch(getSummary(props.token,`${periode.fromMonth}/${periode.toMonth}/10,20/30,40,50/70,80/${tribe}/${segment}/${rm.value}`))
            if(res){
                dispatch(setFilter({tribe:tribe}))
                dispatch(setFilter({segment:segment}))
                dispatch(setFilter({rm:rm}))
                dispatch(setFilter({periode:periode}))
                dispatch(setFilter({probability:probability}))
                dispatch(setFilter({rangeValue:rangeValue}))
                dispatch(setFilter({textPeriode:textPeriode}))
            }
        }
        
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
        // dispatch(setFilter({ tribe:0}))
        // dispatch(setFilter({ segment:0}))
        // dispatch(setFilter({ rm:{label:'All RM',value:0}}))
        // dispatch(setFilter({ probability:[]}))
        // dispatch(setFilter({ periode:{fromMonth:0,toMonth:0}}))
        // dispatch(setFilter({ rangeValue:{from: {year: parseInt(moment().format('YYYY')), month:parseInt(moment().format('M'))}, to: {year: parseInt(moment().format('YYYY')), month: parseInt(moment().format('M'))}}}))
        // dispatch(setFilter({ textPeriode:'All Period'}))
    }
    const data_prob=[
        {id:10,text:'Lead (0.1)'},
        {id:20,text:'Contact (0.2)'},
        {id:30,text:'Meeting & Needs Collected (0.3)'},
        {id:40,text:'Proposal Submitted (0.4)'},
        {id:50,text:'Proposal Presentation (0.5)'},
        {id:60,text:'Like the proposal (0.6)'},
        {id:70,text:'Negotiation (0.7)'},
        {id:80,text:'Verbally agree (0.8)'},
        // {id:90,text:'0.9 - Agreement'},
    ]
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
        // if( JSON.stringify(value) !== JSON.stringify(rangeValue) ){
            // setTextPeriode(pickerLang.months[value.from.month-1] + '. ' + value.from.year + ' - '+pickerLang.months[value.to.month-1] + '. ' + value.to.year)
        // }
        // console.log('value', value)
        let fromMonth=value.from.month>9?`${value.from.year}${value.from.month}`:`${value.from.year}0${value.from.month}`
        let toMonth=value.to.month>9?`${value.to.year}${value.to.month}`:`${value.to.year}0${value.to.month}`
        // console.log('fromMonth,toMonth', fromMonth,toMonth)
        stateFilter({
            ...filter,
            periode:{fromMonth:fromMonth,toMonth:toMonth},
            rangeValue:value,
            textPeriode:pickerLang.months[value.from.month-1] + '. ' + value.from.year + ' - '+pickerLang.months[value.to.month-1] + '. ' + value.to.year
        })
        // stateFilter({...filter,rangeValue:value})
        // stateFilter({...filter,textPeriode:pickerLang.months[value.from.month-1] + '. ' + value.from.year + ' - '+pickerLang.months[value.to.month-1] + '. ' + value.to.year})
        
    }
    const max=moment().add(10,'year').format('YYYY')
    const min=moment().subtract(10,'year').format('YYYY')
    console.log('max,min', max,min)
    return (
        <div>
             <MuiThemeProvider theme={themeField}>
                <FormControl variant="outlined" size="small" className='add-proposal__field' >
                    <InputLabel  htmlFor="category">Tribe</InputLabel>
                    <Select name='tribe' value={tribe}  onChange={onChange} labelId="label" id="select"  labelWidth={40} className='field-radius'>
                        <MenuItem value={0}>All Tribe</MenuItem>
                        {master.tribes.map((data,i)=>(
                            <MenuItem value={data.id}>{data.text}</MenuItem>
                        ))}
                        
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
                <FormControl variant="outlined" size="small" className='add-proposal__field' >
                    <InputLabel  htmlFor="category">Segment</InputLabel>
                    <Select name='segment'  value={segment}  onChange={onChange} labelId="label" id="select"  labelWidth={70} className='field-radius'>
                        <MenuItem value={0}>All segment</MenuItem>
                        {master.segments.map((data,i)=>(
                            <MenuItem value={data.id}>{data.text}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <AutoCompleteSelect
                    onChange={(event,value)=>onChangeSelet(value)}
                    options={[{label:'All RM',value:0},...master.rm]}
                    getOptionLabel={(option) => option.label}
                    label={<>Relationship manager</>}
                    value={rm}
                    disableClearable={true}
                />
                
                {master.tab_active!=='summary'&&<AutoCompleteSelect
                    multiple
                    onChange={(event,value)=>stateFilter({...filter,probability:value})}
                    options={data_prob}
                    getOptionLabel={(option) => option.text}
                    label={<>Probability</>}
                    value={probability}
                />
                }
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
