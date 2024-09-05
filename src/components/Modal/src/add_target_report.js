import React,{useState} from 'react'
import AutoCompleteSelect from 'components/Select'
import {Button,TextField,FormControl,InputLabel,OutlinedInput,MenuItem,Select,
FormHelperText,FormControlLabel,Checkbox,Table,TableHead,TableRow,TableCell,TableBody} from '@material-ui/core'
import { useDispatch, useSelector } from "react-redux";
import {modalToggle,modalToggleReset} from 'redux/actions/general'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles } from '@material-ui/core/styles'
import {
    DatePicker,
    TimePicker,
    DateTimePicker,
    MuiPickersUtilsProvider,
  } from '@material-ui/pickers';
  import moment from 'moment'
import MomentUtils from '@date-io/moment';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import {addTarget,getChart} from 'redux/actions/report'

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
export default function Add_target_report(props) {
    const classes=useStyles()
    const dispatch=useDispatch()
    const master=useSelector((state)=>state.master)
    const [id,setId]=useState('')
    const [target,setTarget]=useState([
        {
            id:1,
            periode:null,
            month:null,
            year:null,
            targets:[
                {
                    id:1,
                    amount:0
                },
                {
                    id:2,
                    amount:0
                },
                {
                    id:3,
                    amount:0
                },
                {
                    id:4,
                    amount:0
                },
            ]
        }
    ])
    const renderOption=()=>{
        const {modal_data}=props
        let new_rm=[]
        if(master.rm.length>0){
            master.rm.map((data)=>{
                new_rm.push({text:data.label,id:data.value})
            })
        }
        switch (modal_data.target) {
            case 'Tribe':
                return master.tribes
                break;
            case 'Relationship manager':
                return new_rm
                break;
            case 'Segment':
                return master.segments
                break;
            case 'Branch':
                return master.branches
                break;
        
            default:
                break;
        }
    }
    const onFocus=()=>{
        let dummy={
            id:target.length+1,
            periode:null,
            month:null,
            year:null,
            targets:[
                {
                    id:1,
                    amount:0
                },
                {
                    id:2,
                    amount:0
                },
                {
                    id:3,
                    amount:0
                },
                {
                    id:4,
                    amount:0
                },
            ]
        }
        let new_target=[
            ...target,
            dummy
        ]
        let length=target.length
        let tar=target[length-1]
        // let last=target.pop()
        if(tar.month!==null&&tar.year!==null){
            setTarget(new_target)
        }
        
    }
    const onChange=(index,e)=>{
        let {id,value}=e.target
        target[index].targets[id].amount=parseInt(value)
        // console.log('data', data)
    }
    const onChange2=(index,value,id)=>{
        // console.log('event,value', event,value)
        // let {id,value}=e.target
        target[index].targets[id].amount=parseInt(value)
        // console.log('data', data)
    }
    const onChangeDate=(index,data)=>{
        let month=moment(data).format('M')
        let year=moment(data).format('YYYY')
        target[index].periode=data
        target[index].month=month
        target[index].year=year
        setTarget([...target])
        // console.log('month,year', target[index].periode.format('M YYYY'))

    }
    const onClickSave=async ()=>{
        let new_target=[]
        let last=target.pop()

        let afterCleareEmpty=target.filter((target)=>{
            return target.id!==last.id
        })
        afterCleareEmpty.map((data)=>{
            new_target.push({month:data.month,targets:data.targets,year:data.year})
        })
        let data={
            id,
            type:props.modal_data.target.toLowerCase(),
            userId:props.profile.id,
            items:[...new_target]
        }
        // console.log('target', afterCleareEmpty)
        // console.log('data', data)
        await dispatch(addTarget(props.token,data))
        dispatch(getChart(props.token,props.modal_data.slug))
    }
    // console.log('target', target)
    return (
        <div>
            <MuiThemeProvider theme={themeField}>
                <AutoCompleteSelect
                    onChange={(event,value)=>setId(value.id)}
                    options={renderOption()}
                    getOptionLabel={(option) => option.text}
                    label={props.modal_data.target}
                    // value={rm}
                />
                <p className='semi-bold'>Target per month</p>
                {target.map((data,i)=>(
                    <div style={{display:'flex'}} index={i}>
                    <div>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <DatePicker value={target[i].periode} onChange={(data)=>onChangeDate(i,data)} disablePast={false}    className={classes.textField} views={['month','year']}  label='Month' clearable={true} size='small' inputVariant='outlined'  />
                        </MuiPickersUtilsProvider>
                    </div>
                    &nbsp;&nbsp;
                    <div>
                        <TextField
                            label='Target No. Proposal'
                            type='number'
                            // value={state.remarks}
                            name='remarks'
                            id={0}
                            onChange={(e)=>onChange(i,e)}
                            variant='outlined'
                            size='small'
                            className={classes.textField}
                        />
                    </div>
                    &nbsp;&nbsp;

                    <div>
                        <TextField
                            label='Target Sales visit'
                            type='number'
                            // value={state.remarks}
                            name='remarks'
                            id={2}
                            onChange={(e)=>onChange(i,e)}
                            variant='outlined'
                            size='small'
                            className={classes.textField}
                        />
                    </div>
                    &nbsp;&nbsp;

                    <div>
                    <CurrencyTextField
                        className={classes.textField}
                        label="Proposal value "
                        variant="outlined"
                        // value={pipeline.proposal.proposalValue}
                        currencySymbol="IDR"
                        id={1}

                        size='small'
                        outputFormat="string"
                        decimalCharacter="."
                        digitGroupSeparator=","
                        onChange={(event,value)=>onChange2(i,value,1)}
                    />
                    </div>
                    &nbsp;&nbsp;

                    <div>
                    <CurrencyTextField
                        className={classes.textField}
                        label="Sales "
                        variant="outlined"
                        id={3}

                        // value={pipeline.proposal.proposalValue}
                        currencySymbol="IDR"
                        size='small'
                        outputFormat="string"
                        decimalCharacter="."
                        digitGroupSeparator=","
                        onFocus={onFocus}
                        onChange={(event,value)=>onChange2(i,value,3)}
                    />
                    </div>
                </div>

                ))}
                <div className='modal-footer'>
                    <MuiThemeProvider theme={themeButton}>
                        <Button onClick={onClickSave}  size='small' color='secondary' style={{width:100}} variant='contained' className='btn-remove-capital btn-rounded'>Save</Button>
                        </MuiThemeProvider>
                    </div>
                </MuiThemeProvider>
        </div>
    )
}
