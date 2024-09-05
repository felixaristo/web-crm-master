import React,{useState, useEffect} from 'react'
import {Button,TextField,FormControl,InputLabel,OutlinedInput,MenuItem,Select,
    FormHelperText,Modal,FormControlLabel,Checkbox} from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles } from '@material-ui/core/styles'
import Select1 from 'react-select'
import moment from 'moment'
import MomentUtils from '@date-io/moment';
import ModalContact from './add_contact_deal'
import Close from 'assets/icon/close.svg'
import {addSalesVisit,setSalesVisit, updateSalesVisit} from 'redux/actions/pipeline'
import {modalToggleReset} from 'redux/actions/general'
import { useDispatch, useSelector } from "react-redux";

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
            main:'#70BF4E',
            contrastText: '#FFFFFF',

        },
        secondary:{
            main:'#70BF4E',
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
            main:'#FFB100',
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
  },
    textField2: {
      [`& fieldset`]: {
        borderRadius: 10,
      },
      width:'100%',
    //   marginBottom:15
  }
  
}));
const AddContact=({modal_open,modalToggle,clientId,token,profile})=>{
    return(
        <Modal
            className='modal'
            open={modal_open}
            onClose={modalToggle}
        >
            <div className='modal-content' style={{width:1100}}>
                <div className='modal-header'>
                        <h2>Add Contact</h2>
                        <img src={Close} style={{width:20}} onClick={modalToggle}/>
                </div>
                <div className='modal-body' >
                    <ModalContact modalToggle={modalToggle} clientId={clientId} token={token} profile={profile}/>
                </div>
            </div>
            
        </Modal>
    )
}
export default function Sales_visit(props) {
    const classes=useStyles()
    const [state, setState] = useState({
        visitDate:moment().format('YYYY-MM-DD'),
        startTime:null,
        endTime:null,
        contacts:[],
        rms:[],
        consultants:[],
        location:'',
        objective:'',
        nextStep:'',
        remark:''

    })

    useEffect(() => {
    //    console.log('props.modal_data', props.modal_data)
      
    }, [])
    const dispatch=useDispatch()

    const master=useSelector(state=>state.master)
    const pipeline=useSelector(state=>state.pipeline)
    const {sales_visit}=pipeline

    const {contact,rm,employee,tribes}=master
    const [modal_open,setModalOpen]=useState(false)
    const modalToggle=()=>{
        setModalOpen(!modal_open)
    }
    const onChange=(e)=>{
        let {value,name}=e.target
        dispatch(setSalesVisit({[name]:value}))
    }
    const onChangeSelect=(data,name)=>{
        setState({
            ...state,
            [name]:data
        })
    }
    const handleDisable=()=>{
        if(props.modal_action==='see_sales_visit'){
            return true
        }else{
            return false
        }
    }
    const onClickSave=()=>{
        let new_contacts=[]
        let new_rms=[]
        let new_consultants=[]
        let new_tribes=[]
        sales_visit.contacts.map((data)=>{
            new_contacts.push(data.id)
        })
        sales_visit.rms.map((data)=>{
            new_rms.push(data.value)
        })
        sales_visit.consultants.map((data)=>{
            new_consultants.push(data.value)
        })
        sales_visit.tribes.map((data)=>{
            new_tribes.push(data.id)
        })
        let data={
            id:0,
            dealId:parseInt(props.modal_data.dealId),
            userId:props.profile.id,
            visitDate:sales_visit.visitDate,
            startTime:moment(sales_visit.startTime).format('HH:mm'),
            endTime:moment(sales_visit.endTime).format('HH:mm'),
            contacts:new_contacts,
            rms:new_rms,
            consultants:new_consultants,
            location:sales_visit.location,
            objective:sales_visit.objective,
            nextStep:sales_visit.nextStep,
            remark:sales_visit.remark,
            tribes:new_tribes
        }
        let data_edit={
            id:sales_visit.id,
            dealId:parseInt(props.modal_data.dealId),
            userId:props.profile.id,
            visitDate:moment(sales_visit.visitDate).format('YYYY-MM-DD'),
            startTime:moment(sales_visit.startTime).format('HH:mm'),
            endTime:moment(sales_visit.endTime).format('HH:mm'),
            contacts:new_contacts,
            rms:new_rms,
            consultants:new_consultants,
            location:sales_visit.location,
            objective:sales_visit.objective,
            nextStep:sales_visit.nextStep,
            remark:sales_visit.remark,
            tribes:new_tribes
        }
        dispatch(modalToggleReset())
        if(props.modal_action==='edit_sales_visit'){
            dispatch(updateSalesVisit(props.token,data_edit))
        }else{
            dispatch(addSalesVisit(props.token,data))
        }
        
    }
    // console.log('pipeline.sales_visit', pipeline.sales_visit)
    return (
        <div className='sales-visit-wrapper' >
            <AddContact modal_data={props.modal_data} modal_open={modal_open} modalToggle={modalToggle} token={props.token} profile={props.profile}/>
            <MuiThemeProvider theme={themeField}>
            <div style={{display:'flex',marginTop:10}}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker disabled={handleDisable()} name='visitDate' onChange={(e)=>dispatch(setSalesVisit({visitDate:e}))} value={sales_visit.visitDate} className={classes.textField}  label='Visit Date' clearable={true} size='small' inputVariant='outlined'  />
                    &nbsp;
                    <TimePicker disabled={handleDisable()}name='startTime' onChange={(e)=>dispatch(setSalesVisit({startTime:e}))}  value={sales_visit.startTime} className={classes.textField}  label='Start Time' clearable={true} size='small' inputVariant='outlined'  />
                    &nbsp;
                    <TimePicker disabled={handleDisable()}name='endTime' onChange={(e)=>dispatch(setSalesVisit({endTime:e}))} value={sales_visit.endTime} className={classes.textField} label='End Time' clearable={true} size='small' inputVariant='outlined' />
                </MuiPickersUtilsProvider>
                   
            </div>
            <div style={{display:'flex',marginBottom:10,justifyContent:'space-between'}}>
                <div style={{width:'70%'}}>
                <AutoCompleteSelect
                    multiple
                    onChange={(event,value)=>dispatch(setSalesVisit({contacts:value}))}
                    options={contact}
                    getOptionLabel={(option) => option.text}
                    label={<>Client contact</>}
                    value={sales_visit.contacts}
                    disabled={handleDisable()}
                />
                </div>
                <Button disabled={handleDisable()} onClick={modalToggle} className='remove-capital' color='primary' variant='text' size='small'>Add new contact</Button>
            </div>
            <TextField
                label='Location'
                type='text'
                name='location'
                value={sales_visit.location}
                onChange={onChange}
                variant='outlined'
                size='small'
                className={classes.textField}
                disabled={handleDisable()}

            />
             <AutoCompleteSelect
                    multiple
                    onChange={(event,value)=>dispatch(setSalesVisit({tribes:value}))}
                    options={tribes}
                    getOptionLabel={(option) => option.text}
                    label={<>Tribes</>}
                    value={sales_visit.tribes}
                    disabled={handleDisable()}
                />
             <AutoCompleteSelect
                    multiple
                    onChange={(event,value)=>dispatch(setSalesVisit({rms:value}))}
                    options={rm}
                    getOptionLabel={(option) => option.label}
                    label={<>Relationship manager</>}
                    value={sales_visit.rms}
                    disabled={handleDisable()}
                />
            
            <AutoCompleteSelect
                multiple
                onChange={(event,value)=>dispatch(setSalesVisit({consultants:value}))}
                options={employee}
                getOptionLabel={(option) => option.label}
                label={<>Consultant</>}
                value={sales_visit.consultants}
                disabled={handleDisable()}
            />
           
            <TextField
                label='Visit objective'
                type='text'
                value={sales_visit.objective}
                onChange={onChange}
                variant='outlined'
                name='objective'
                size='small'
                className={classes.textField2}
                multiline
                disabled={handleDisable()}
                inputProps={{maxLength: 200}}
                helperText={<div style={{display:'flex',justifyContent:'flex-end'}}>{`${sales_visit.objective.length}/200`}</div>}
            />
            <TextField
                label='Next step'
                type='text'
                value={sales_visit.nextStep}
                onChange={onChange}
                variant='outlined'
                size='small'
                name='nextStep'
                disabled={handleDisable()}
                className={classes.textField2}
                multiline
                inputProps={{maxLength: 200}}
                helperText={<div style={{display:'flex',justifyContent:'flex-end'}}>{`${sales_visit.nextStep.length}/200`}</div>}
            />
            <TextField
                label='Remark '
                type='text'
                value={sales_visit.remark}
                onChange={onChange}
                variant='outlined'
                size='small'
                name='remark'
                disabled={handleDisable()}
                className={classes.textField2}
                multiline
                inputProps={{maxLength: 200}}
                helperText={<div style={{margin:0,display:'flex',justifyContent:'flex-end'}}>{`${sales_visit.remark.length}/200`}</div>}
            />
            
            </MuiThemeProvider>
            <MuiThemeProvider theme={themeButton}>
                <div className='modal-footer'>
                    {/* <FormControlLabel
                        color='secondary'
                        control={<Checkbox checked={false} onChange={null} name="checkedA" />}
                        label={<p style={{color:'#777777',margin:0}}>Mark as done</p>}
                    />
                    &nbsp;&nbsp; */}
                    {props.modal_action!=='see_sales_visit'&&<Button onClick={onClickSave}  size='small' color='secondary' variant='contained' className='btn-remove-capital btn-rounded' style={{width:120,height:30}}>Save</Button>}
                </div>
            </MuiThemeProvider>
        </div>
    )
}
