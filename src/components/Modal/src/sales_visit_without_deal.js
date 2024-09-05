import React,{useState, useEffect} from 'react'
import {Button,TextField,FormControl,InputLabel,OutlinedInput,MenuItem,Select,
    FormHelperText,Modal,FormControlLabel,Checkbox} from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles } from '@material-ui/core/styles'
import Select1 from 'react-select'
import moment from 'moment'
import MomentUtils from '@date-io/moment';
import ModalContact from './add_contact_deal'
import Close from 'assets/icon/close.svg'
import {addSalesVisitWithoutDeal,setSalesVisit, updateSalesVisit,} from 'redux/actions/pipeline'
import {getClient as getForClient,setClientAction,clearState} from 'redux/actions/client'
import {modalToggleReset} from 'redux/actions/general'
import {getClient,getContact,tabToggle} from 'redux/actions/master'
import { useDispatch, useSelector } from "react-redux";
import { isEmpty,debounce } from "lodash";

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
export default function Sales_visit_without_deal(props) {
    const classes=useStyles()
    const [state, setState] = useState({
        visitDate:moment().format('YYYY-MM-DD'),
        startTime:null,
        endTime:null,
        contacts:null,
        rms:[],
        consultants:[],
        location:'',
        objective:'',
        nextStep:'',
        remark:'',
        clientId:null
    })
    const [search,setSearch]=useState('')
    const [loading,setLoading]=useState(false)
    useEffect(() => {
    //    console.log('props.modal_data', props.modal_data)
      
    }, [])
    const dispatch=useDispatch()

    const master=useSelector(state=>state.master)
    const pipeline=useSelector(state=>state.pipeline)
    const {sales_visit}=pipeline
    // console.log('state', state)

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
    const selectClient=(data)=>{
        setState({
            ...state,
            clientId:data,
        })
        dispatch(setSalesVisit({contacts:[]}))
        dispatch(getContact(props.token,data.value))
    }
    const searchToggle=debounce(async (value)=>{
        setSearch(value)
        if(value!==search&&value.length>0){
            // console.log('value eh', value,value.length)
            setLoading(true)
            await dispatch(getClient(props.token,value))
            setLoading(false)
        }
        // console.log('value.value,search', value)
        
    },1000)
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
            dealId:0,
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
            clientId:state.clientId.value,
            tribes:new_tribes

        }
        
        dispatch(modalToggleReset())
        dispatch(addSalesVisitWithoutDeal(props.token,data))
        
    }
    const addClient=async ()=>{
        // dispatch(clearState())
        // dispatch(setClientAction('add_client'))
        // dispatch(tabToggle('client',master.tab_active==='pipeline'?'pipeline':'detail'))
        // dispatch(modalToggleReset())
        window.location.assign('/clientsfrommodalvisit')
    }
    // console.log('pipeline.sales_visit', pipeline.sales_visit)
    return (
        <div className='sales-visit-wrapper' >
            <AddContact modal_data={props.modal_data} modal_open={modal_open} modalToggle={modalToggle} token={props.token} profile={props.profile}/>
            <MuiThemeProvider theme={themeField}>
            <div style={{display:'flex',marginTop:10}}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker name='visitDate' onChange={(e)=>dispatch(setSalesVisit({visitDate:e}))} value={sales_visit.visitDate} className={classes.textField}  label='Visit Date' clearable={true} size='small' inputVariant='outlined'  />
                    &nbsp;
                    <TimePicker name='startTime' onChange={(e)=>dispatch(setSalesVisit({startTime:e}))}  value={sales_visit.startTime} className={classes.textField}  label='Start Time' clearable={true} size='small' inputVariant='outlined'  />
                    &nbsp;
                    <TimePicker name='endTime' onChange={(e)=>dispatch(setSalesVisit({endTime:e}))} value={sales_visit.endTime} className={classes.textField} label='End Time' clearable={true} size='small' inputVariant='outlined' />
                </MuiPickersUtilsProvider>
                   
            </div>
            <div style={{display:'flex',justifyContent:'space-between'}}>
                <div style={{width:'70%'}}>
                
                <AutoCompleteSelect
                    color='primary'
                    loading={loading}
                    disableClearable={true}
                    onChange={(event,value)=>selectClient(value)}
                    options={master.client}
                    getOptionLabel={(option) => option.label}
                    onInputChange={(event,e)=>searchToggle(e)}
                    label={<>Client company name<span style={{color:'red'}}>*</span></>}
                />
                
                </div>
                <Button onClick={addClient} className='remove-capital' color='secondary' variant='text' size='small'>Add new company</Button>
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
                />
                </div>
                <Button disabled={state.clientId!==null?false:true} onClick={modalToggle} className='remove-capital' color='secondary' variant='text' size='small'>Add new contact</Button>
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

            />
             <AutoCompleteSelect
                    multiple
                    onChange={(event,value)=>dispatch(setSalesVisit({tribes:value}))}
                    options={tribes}
                    getOptionLabel={(option) => option.text}
                    label={<>Tribes</>}
                    value={sales_visit.tribes}

                />
             <AutoCompleteSelect
                    multiple
                    onChange={(event,value)=>dispatch(setSalesVisit({rms:value}))}
                    options={rm}
                    getOptionLabel={(option) => option.label}
                    label={<>Relationship manager</>}
                    value={sales_visit.rms}

                />
            
            <AutoCompleteSelect
                multiple
                onChange={(event,value)=>dispatch(setSalesVisit({consultants:value}))}
                options={employee}
                getOptionLabel={(option) => option.label}
                label={<>Consultant</>}
                value={sales_visit.consultants}

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
                inputProps={{maxLength: 200}}
                helperText={<div style={{display:'flex',justifyContent:'flex-end'}}>{`${state.objective.length}/200`}</div>}
            />
            <TextField
                label='Next step'
                type='text'
                value={sales_visit.nextStep}
                onChange={onChange}
                variant='outlined'
                size='small'
                name='nextStep'
                className={classes.textField2}
                multiline
                inputProps={{maxLength: 200}}
                helperText={<div style={{display:'flex',justifyContent:'flex-end'}}>{`${state.nextStep.length}/200`}</div>}
            />
            <TextField
                label='Remark'
                type='text'
                value={sales_visit.remark}
                onChange={onChange}
                variant='outlined'
                size='small'
                name='remark'
                className={classes.textField2}
                multiline
                inputProps={{maxLength: 200}}
                helperText={<div style={{margin:0,display:'flex',justifyContent:'flex-end'}}>{`${state.remark.length}/200`}</div>}
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
                    <Button disabled={state.clientId!==null?false:true} onClick={onClickSave}  size='small' color='secondary' variant='contained' className='btn-remove-capital btn-rounded' style={{width:120,height:30}}>Save</Button>
                </div>
            </MuiThemeProvider>
        </div>
    )
}
