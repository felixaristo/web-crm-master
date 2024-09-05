import React,{useState, useEffect} from 'react'
import {Button,Modal,TextField,FormControl,InputLabel,OutlinedInput,MenuItem,Select,
    FormHelperText } from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles } from '@material-ui/core/styles'
import Select1 from 'react-select'
import moment from 'moment'
import { useDispatch, useSelector } from "react-redux";
import { isEmpty,debounce } from "lodash";
import {getClient ,getContact,tabToggle} from 'redux/actions/master'
import {addDeal} from 'redux/actions/pipeline'
import {getClient as getForClient,setClientAction,clearState} from 'redux/actions/client'
import {modalToggleReset,modalToggle} from 'redux/actions/general'
import ModalContact from './add_contact_deal'
import Close from 'assets/icon/close.svg'
import Loader2 from 'components/Loading/loader2'
import AutoCompleteSelect from 'components/Select'
import {
    DatePicker,
    TimePicker,
    DateTimePicker,
    MuiPickersUtilsProvider,
  } from '@material-ui/pickers';
  import MomentUtils from '@date-io/moment';
const themeField = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#70BF4E',
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
            contrastText: '#FFFFFF',

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
      marginBottom:15,
  },
 
  
}));
const pipeline_stage=[
    {
        id:10,
        label:'Lead in',
        active:true
    },
    {
        id:20,
        label:'Proposal Development',
        active:false
    },
    {
        id:30,
        label:'Proposal Sent',
        active:false

    },
    {
        id:50,
        label:'Presentation',
        active:false

    },
    {
        id:80,
        label:'Negotiations',
        active:false

    },
]
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
export default function Add_deal(props) {
    const [probability,setProbability]=useState(10)
    const [stageId,setStageId]=useState(0)
    const [search,setSearch]=useState('')
    const [loading,setLoading]=useState(false)
    const [textSelect,setTextSelect]=useState('Type company name')
    const [state,setState]=useState({
        clientId:null,
        contactId:null,
        dealDate:moment(),
        tribeId:props.profile.tribeId!==0?props.profile.tribeId:null,
        segmentId:props.profile.segmentId!==0?props.profile.segmentId:'',
        branchId:props.profile.branchId!==0?props.profile.branchId:'',
        rmId:null,
        name:'',
        picId:null
    })
    const [stage, setStage] = useState([
        {
            id:10,
            label:'Lead in',
            active:true
        },
        {
            id:20,
            label:'Proposal Development',
            active:false
        },
        {
            id:30,
            label:'Proposal Sent',
            active:false
    
        },
        {
            id:50,
            label:'Presentation',
            active:false
    
        },
        {
            id:80,
            label:'Negotiations',
            active:false
    
        },
    ])
    const [modal_open,setModalOpen]=useState(false)
    const master=useSelector(state=>state.master)
    const pipeline=useSelector(state=>state.pipeline)
    const general=useSelector(state=>state.general)
    useEffect(() => {
        if(props.modal_data!==null){
            handleChangeStage(props.modal_data)
        }
     }, [])
    const classes=useStyles()
    const dispatch=useDispatch()
    
  
    
    const modalToggles=()=>{
        setModalOpen(!modal_open)
    }
    const getIndex=(key)=>{
        switch (key) {
            case 10:
                return 0
                break;
            case 20:
                return 1
                break;
            case 30:
                return 1
                break;
            case 40:
                return 2
                break;
            case 50:
                return 3
                break;
            case 60:
                return 3
                break;
            case 70:
                return 4
                break;
            case 80:
                return 4
                break;
            case 90:
                return 4
                break;
        
            default:
                break;
        }
    }
    const renderDisable=()=>{
        if(state.clientId!==null&&state.name.length>0&&state.rmId&&state.picId){
            return false
        }else{
            return true
        }
    }
    const handleChangeStage=async(value)=>{
        // const value=e.target.value
        let active_stage=[]
        let inactive_stage=[]
        setProbability(value)

        let index_stage=getIndex(value)
        setStageId(index_stage)
        for (let index = 0; index <= index_stage; index++) {
            active_stage.push(index)
        }
        for (let index = index_stage+1; index <= pipeline_stage.length-1; index++) {
            inactive_stage.push(index)
        }
        
        inactive_stage.map((data,index)=>{
            stage[data].active=false
        })
        active_stage.map((data,index)=>{
            stage[data].active=true
        })
        // console.log('inactive_state,active_stage', inactive_stage,active_stage)
    }
    const onClickSave=async ()=>{
        let {clientId,rmId,contactId,dealDate,tribeId,segmentId,branchId,name,picId}=state
        let data={
            userId:props.profile.id,
            clientId:clientId.value,
            contactId:contactId!==null?contactId.id:0,
            dealDate:moment(dealDate).format('YYYY-MM-DD'),
            tribeId:tribeId.id,
            segmentId,
            branchId,
            userIdRM:rmId.id,
            name,
            stageId:stageId+1,
            probability,
            picId:picId?picId.id:0
        }
        let {tribe,segment,rm,textPeriode,periode}=pipeline.filter
        let map=pipeline.filter.probability.map((data,index)=>{
            return `${data.id}`
        })
        dispatch(modalToggleReset())
        
        let res= await dispatch(addDeal(props.token,data,`${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/${pipeline.filter.probability.length>0?map:0}`))
        if(res){
            if(stageId>0){
                dispatch(modalToggle({
                    modal_open: true,
                    modal_title: "Add new deal",
                    modal_component: "direct_proposal",
                    modal_data:{
                        clientId:res.data.clientId,
                        dealId:res.data.id,
                        
                    } ,
                    modal_type:'confirm',
                    modal_size:400,
                    modal_action:'add_deal'
                }))
            }
            
        }
        setStage(pipeline_stage)
    }
    const onChange=(e)=>{
        let {name,value}=e.target
        setState({...state,[name]:value})
    }
    
    const searchToggle=debounce(async (value)=>{
        setSearch(value)
        // setTextSelect('No options')

        if(value!==search&&value.length>0){
            // console.log('value eh', value,value.length)
            setLoading(true)
            let res=await dispatch(getClient(props.token,value))
            if(isEmpty(res)){
                setTextSelect('No options')
                // console.log('res', res)
            }
            setLoading(false)
        }
        // console.log('value.value,search', value)
        
    },1000)
   
    const selectClient=(data)=>{
        // setState({
        //     ...state,
        // })
        // console.log('halloooo', data)
        setState({
            ...state,
            clientId:data,
            contactId:null

        })
        dispatch(getContact(props.token,data.value))
        
    }
    const addClient=async ()=>{
        dispatch(clearState())
        dispatch(setClientAction('add_client'))
        await dispatch(getForClient(props.token,`/0/0/0/1/10/*`))
        dispatch(tabToggle('client',master.tab_active==='pipeline'?'pipeline':'detail'))
        dispatch(modalToggleReset())
        
    }
    // console.log('stage', stageId)
    // console.log('props.profile', props.profile)
     return (
        <div className='deals-wrapper'>
            <Loader2/>
            <AddContact clientId={state.clientId} modal_open={modal_open} modalToggle={modalToggles} token={props.token} profile={props.profile}/>
            <p className='semi-bold'>Client information</p>
            <MuiThemeProvider theme={themeField}>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                <div style={{width:'70%'}}>
                
                <AutoCompleteSelect
                    color='primary'
                    noOptionsText={textSelect}
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
                <div style={{display:'flex',justifyContent:'space-between'}}>
                <div style={{width:'70%'}}>
                <AutoCompleteSelect
                    onChange={(event,value)=>setState({...state,contactId:value})}
                    options={master.contact}
                    value={state.contactId}
                    getOptionLabel={(option) => option.text}
                    label={<>Client contact</>}

                />
                
                </div>
                <Button disabled={state.clientId!==null?false:true} onClick={modalToggles} className='remove-capital' color='secondary' variant='text' size='small'>Add new contact</Button>
                </div>
                <p className='semi-bold'>Deal information</p>
               
                <div style={{width:'100%'}}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker format={'DD MMM YYYY'} color='primary' value={state.dealDate} onChange={(data)=>setState({...state,dealDate:data})}  className={classes.textField}  label='Deal date' clearable={true} size='small' inputVariant='outlined'  />
                </MuiPickersUtilsProvider>
                </div>
                <AutoCompleteSelect
                    onChange={(event,value)=>setState({...state,picId:value})}
                    options={master.rm_text}
                    value={state.picId}
                    getOptionLabel={(option) => option.text}
                    label={<>Person In Charge</>}

                />
                <AutoCompleteSelect
                    onChange={(event,value)=>setState({...state,tribeId:value})}
                    options={master.tribes}
                    value={state.tribeId}
                    getOptionLabel={(option) => option.text}
                    label={<>Tribe<span style={{color:'red'}}>*</span></>}

                />
                <AutoCompleteSelect
                    onChange={(event,value)=>setState({...state,rmId:value})}
                    options={master.rm_text}
                    value={state.rmId}
                    getOptionLabel={(option) => option.text}
                    label={<>Relationship manager <span style={{color:'red'}}>*</span></>}

                />
                <div style={{display:'flex'}}>
                    <FormControl variant="outlined" size="small" className='add-proposal__field' >
                        <InputLabel  htmlFor="segment">Segment<span style={{color:'red'}}>*</span></InputLabel>
                        <Select  color='primary' name='segmentId'  value={state.segmentId}  onChange={onChange} labelId="segment" id="segment"  labelWidth={70} className='field-radius'>
                            {master.segments.map((data,i)=>(
                                <MenuItem key={i} value={data.id}>{data.text}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    &nbsp;&nbsp;
                    <FormControl variant="outlined" size="small" className='add-proposal__field' >
                        <InputLabel  htmlFor="branch">Branch<span style={{color:'red'}}>*</span></InputLabel>
                        <Select color='primary' name='branchId'  value={state.branchId}  onChange={onChange} labelId="branch" id="branch"  labelWidth={55} className='field-radius'>
                            {master.branches.map((data,i)=>(
                                <MenuItem key={i} value={data.id}>{data.text}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                </div>
                <TextField
                    label={<p style={{marginTop:-2}}>Deals name<span style={{color:'red'}}>*</span></p>}
                    // type='text'
                    // value={event.address}
                    multiline
                    
                    onChange={onChange}
                    color='primary'
                    variant='outlined'
                    size='small'
                    name='name'
                    className={classes.textField}

                />
                <p className='semi-bold'>Pipeline Stage</p>
                <div className='add-deals-wrapper'>
                    <div className={`add-deals-step${stage[0].active?'-active':''}`}>
                        <p>Lead in</p>
                    </div>
                    <div className={`add-deals-step${stage[1].active?'-active':''}`}>
                        <p>Proposal<br/> Development</p>

                    </div>
                    <div className={`add-deals-step${stage[2].active?'-active':''}`}>
                        <p>Proposal Sent</p>

                    </div>
                    <div className={`add-deals-step${stage[3].active?'-active':''}`}>
                        <p>Presentation</p>

                    </div>
                    <div className={`add-deals-step${stage[4].active?'-active':''}`}>
                        <p>Negotiations</p>

                    </div>
                </div>
                <br/>
                <FormControl variant="outlined" size="small" className='add-deals__field'>
                    <InputLabel id="prob">Probability</InputLabel>
                    <Select
                        color='primary'
                        labelId="prob"
                        id="demo-simple-select"
                        value={probability}
                        onChange={(e)=>handleChangeStage(e.target.value)}
                        className='field-radius'
                        labelWidth={80}
                    >
                            <MenuItem value={10}>Lead (0.1)</MenuItem>
                            <MenuItem value={20}>Contact (0.2)</MenuItem>
                            <MenuItem value={30}>Meeting & Needs Collected (0.3)</MenuItem>
                            <MenuItem value={40}>Proposal Submitted (0.4)</MenuItem>
                            <MenuItem value={50}>Proposal Presentation (0.5)</MenuItem>
                            <MenuItem value={60}>Like the proposal (0.6)</MenuItem>
                            <MenuItem value={70}>Negotiation (0.7)</MenuItem>
                            <MenuItem value={80}>Verbally agree (0.8)</MenuItem>
                        {/* <MenuItem value={90}>0.9 - Agreement</MenuItem> */}
                    </Select>
                </FormControl>
                <div className='modal-footer'>
                    <MuiThemeProvider theme={themeButton}>
                    <Button disabled={renderDisable()} onClick={onClickSave}  size='small' color='secondary' variant='contained' className='btn-remove-capital btn-rounded' style={{width:120}}>Save</Button>
                    </MuiThemeProvider>
                </div>
            </MuiThemeProvider>
        </div>
    )
}
