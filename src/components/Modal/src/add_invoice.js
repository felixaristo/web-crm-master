import React,{useState, useEffect} from 'react'
import {Button,Modal,TextField,FormControl,InputLabel,OutlinedInput,MenuItem,Select,
    FormHelperText,FormControlLabel,RadioGroup,Radio,Table,TableHead,TableRow,TableCell,TableBody } from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles } from '@material-ui/core/styles'
import Select1 from 'react-select'
import moment from 'moment'
import { useDispatch, useSelector } from "react-redux";
import { isEmpty,debounce } from "lodash";
import {getClient ,getContact,tabToggle} from 'redux/actions/master'
import {getDeals,postToBeInvoice,putToBeInvoice,postToInvoice,getInvoice,setTabInvoice} from 'redux/actions/invoices'
import {modalToggleReset} from 'redux/actions/general'
import ModalContact from './add_contact_deal'
import Close from 'assets/icon/close.svg'
import Edit from 'assets/icon/edit.png'
import Loader2 from 'components/Loading/loader2'
import AutoCompleteSelect from 'components/Select'
import upload from 'assets/icon/Upload.svg'
import {
    DatePicker,
    TimePicker,
    DateTimePicker,
    MuiPickersUtilsProvider,
  } from '@material-ui/pickers';
import ReactNumberFormat from 'react-number-format'

  import MomentUtils from '@date-io/moment';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import {handleFile,getBase64} from 'components/handleFile'
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

const useStyles = makeStyles(theme => ({
    textField: {
      [`& fieldset`]: {
        borderRadius: 10,

      },
      width:'100%',
      marginBottom:15,
  },
 
  
}));

const AddRmModal=({modal_open,modalToggle,setState,state,rmsharepercent})=>{
    const classes=useStyles()
    const [rm, setRm] = useState({
        userId:null,
        full_user:null,
        percent:0,
        nominal:0,
        usePercent:true
    })
    const master=useSelector(state=>state.master)

    useEffect(()=>{
        if(modal_open&&state.modal_data!==null){
            setRm({
                ...rm,
                userId:{label:state.modal_data.full_user.name,value:state.modal_data.full_user.userId},
                full_user:state.modal_data.full_user,
                percent:state.modal_data.percent,
                nominal:state.modal_data.nominal,
                usePercent:state.modal_data.usePercent
            })
        }else{
    
            setRm({
                ...rm,
                full_user:null,
                userId:null,
                percent:null,
                nominal:0,
                usePercent:rmsharepercent,
            })
        }
    },[state])
    const renderDisable=()=>{
        if(rm.full_user!==null){
            // alert('hello')
            return false
        }else{
            return true
        }
    }
    const onChangeSelect=(data)=>{
        if(data!==null){
            let s=filterRm(data.value)
            setRm({
                ...rm,
                userId:data,
                full_user:{userId:s[0].userId,email:s[0].email,name:s[0].name}
            })
        }
        
        
    }
    const filterRm=(id)=>{
        let m=master.rm_full.filter((data)=>{
            return data.userId===id
        })
        return m
    }
    const onClickSave=()=>{
        if(state.modal_data!==null){
            state.rms.splice(state.modal_data.index, 1);
            state.rms.splice(state.modal_data.index, 0, rm);
            modalToggle()

        }else{
            setState({
                ...state,
                rms:[...state.rms,rm]
            })
       
            modalToggle()
        }
        
    }
    const onChange=(e)=>{
        if (rmsharepercent) {
            let nominal = (e.target.value/100)*state.value
            if (e.target.value>0) {
                setRm({...rm,percent:e.target.value,nominal})
            } else {
                setRm({...rm,percent:e.target.value})
            }
        } else {
            let percent = (e.target.value/state.value)*100
            if (e.target.value>0) {
                setRm({...rm,nominal:e.target.value,percent})
            } else {
                setRm({...rm,nominal:e.target.value})
            }
        }
    }
    return(
        <Modal
            className='modal'
            open={modal_open}
            onClose={modalToggle}
        >
            <div className='modal-content' style={{width:400}}>
                <div className='modal-body' >
                    <MuiThemeProvider theme={themeField}>
                        <AutoCompleteSelect
                            // multiple
                            onChange={(event,value)=>onChangeSelect(value)}
                            options={master.rm}
                            getOptionLabel={(option) => option.label}
                            label={<>Name</>}
                            value={rm.userId}

                        />
                        
                        <TextField
                            label={rmsharepercent?"Percentage (%)":"Nominal (IDR)"}
                            type='number'
                            value={rmsharepercent?rm.percent:rm.nominal}
                            onChange={(e)=>onChange(e)}
                            variant='outlined'
                            size='small'
                            className={classes.textField}

                        />
                    </MuiThemeProvider>
                    <MuiThemeProvider theme={themeButton}>
                        <div className='modal-footer'>
                            <Button disabled={renderDisable()} onClick={onClickSave}  size='small' color='secondary' variant='contained' className='btn-remove-capital btn-rounded' style={{width:120,height:30}}>Save</Button>
                        </div>
                    </MuiThemeProvider>
                </div>

            </div>
        </Modal>
    )
}
const AddTribeModal=({modal_open_tribe,modalToggleTribe,setState,state,tribesharepercent})=>{
    const classes=useStyles()
    const [tribe, setTribe] = useState({
        tribeId:null,
        percent:0,
        nominal:0,
        usePercent:true
    })
    const master=useSelector(state=>state.master)

    useEffect(()=>{

        if(modal_open_tribe&&state.modal_data!==null){
            setTribe({
                ...tribe,
                tribeId:state.modal_data.tribeId,
                percent:state.modal_data.percent,
                nominal:state.modal_data.nominal,
                usePercent:state.modal_data.usePercent
            })
        }else{
    
            setTribe({
                ...tribe,
                percent:0,
                nominal:0,
                usePercent:tribesharepercent,
                tribeId:null
            })
        }
    },[state])
    
   
    
    const onClickSave=()=>{
        if(state.modal_data!==null){
            state.tribes.splice(state.modal_data.index, 1);
            state.tribes.splice(state.modal_data.index, 0, tribe);
            modalToggleTribe()
        }else{
            setState({
                ...state,
                tribes:[...state.tribes,tribe]
            })
            
            modalToggleTribe()
        }
        
    }
    const renderDisable=()=>{
        if(tribe.tribeId!==null){
            return false
        }else{
            return true
        }
    }
    const onChange=(e)=>{
        if (tribesharepercent) {
            let nominal = (e.target.value/100)*state.value
            if (e.target.value>0) {
                setTribe({...tribe,percent:e.target.value,nominal})
            } else {
                setTribe({...tribe,percent:e.target.value})
            }
        } else {
            let percent = (e.target.value/state.value)*100
            if (e.target.value>0) {
                setTribe({...tribe,nominal:e.target.value,percent})
            } else {
                setTribe({...tribe,nominal:e.target.value})
            }
        }
    }
    return(
        <Modal
            className='modal'
            open={modal_open_tribe}
            onClose={modalToggleTribe}
        >
            <div className='modal-content' style={{width:400}}>
                <div className='modal-body' >
                    <MuiThemeProvider theme={themeField}>
                         <AutoCompleteSelect
                            // multiple
                            onChange={(event,value)=>setTribe({...tribe,tribeId:value})}
                            options={master.tribes}
                            getOptionLabel={(option) => option.text}
                            label={<>Tribe</>}
                            value={tribe.tribeId}

                        />
                        
                        <TextField
                            label={tribesharepercent?"Percentage (%)":"Nominal (IDR)"}
                            type='text'
                            value={tribesharepercent?tribe.percent:tribe.nominal}
                            onChange={(e)=>onChange(e)}
                            variant='outlined'
                            size='small'
                            className={classes.textField}

                        />
                    </MuiThemeProvider>
                    <MuiThemeProvider theme={themeButton}>
                        <div className='modal-footer'>
                            <Button disabled={renderDisable()} onClick={onClickSave}  size='small' color='secondary' variant='contained' className='btn-remove-capital btn-rounded' style={{width:120,height:30}}>Save</Button>
                        </div>
                    </MuiThemeProvider>
                </div>

            </div>
        </Modal>
    )
}
export default function Add_invoice(props) {
    const [search,setSearch]=useState('')
    const [loading,setLoading]=useState(false)
    const [textSelect,setTextSelect]=useState('Type company name')
    const [modal_open,setModalOpen]=useState(false)
    const [modal_open_tribe,setModalOpenTribe]=useState(false)

    const [state,setState]=useState({
        clientId:null,
        dealId:null,
        periode:moment(),
        value:null,
        remark:'',
        invoiceFile:null,
        file_name:'',
        file:null,
        id:0,
        error:null,
        contactId:null,
        modal_data:null,
        rms:[],
        tribes:[],
        pic:null
    })
    const [tribesharepercent, settribesharepercent] = useState(false)
    const [rmsharepercent, setrmsharepercent] = useState(false)
    useEffect(()=>{
        if(props.modal_data!==null){
            // console.log('props._modal_data', props.modal_data);
            let new_rms=[]
            let new_tribe=[]
            props.modal_data.rms.map((data)=>{
                new_rms.push({
                    full_user:{userId:data.id,email:null,name:data.text},
                    userId:{label:data.text,value:data.id},
                    percent:data.percent,
                    ...data
                })
                setrmsharepercent(data.usePercent)

            })
            props.modal_data.tribes.map((data)=>{
                new_tribe.push({
                    percent:data.percent,
                    tribeId:{id:data.id,text:data.text},
                    ...data
                })
                settribesharepercent(data.usePercent)

            })
            setState({
                ...state,

                clientId:props.modal_data.client,
                dealId:props.modal_data.deal,
                periode:moment(props.modal_data.invoiceDate),
                value:props.modal_data.value,
                remark:props.modal_data.remarks,
                id:props.modal_data.id,
                tribes:new_tribe,
                rms:new_rms,
                pic:props.modal_data.pic
            })
        }
    },[])
    const classes=useStyles()
    const dispatch=useDispatch()
    
    const master=useSelector(state=>state.master)
    const pipeline=useSelector(state=>state.pipeline)
    const general=useSelector(state=>state.general)
    const invoices=useSelector(state=>state.invoices)
    
    
    const modalToggleTribe=()=>{
        setModalOpenTribe(!modal_open_tribe)
    }
    const addRm=()=>{
        setState({
            ...state,
            modal_data:null
        })
        modalToggle()
    }
    const editRm=(data)=>{
        setState({
            ...state,
            modal_data:data
        })
        modalToggle()
    }
    const deleteRm=(data)=>{
        state.rms.splice(data, 1);
        setState({
            ...state,
            rms:state.rms
        })
    }
    const addTribe=()=>{
        setState({
            ...state,
            modal_data:null
        })
        modalToggleTribe()
    }
    const editTribe=(data)=>{
        setState({
            ...state,
            modal_data:data
        })
        modalToggleTribe()
    }
    const deleteTribe=(data)=>{
        state.tribes.splice(data, 1);
        setState({
            ...state,
            tribes:state.tribes
        })
    }
    const onClickSave=async ()=>{
        let data={
            id:state.id,
            clientId:state.clientId!==null?state.clientId.value:null,
            dealId:state.dealId!==null?state.dealId.id:null,
            userId:props.profile.id,
            invoiceDate:moment(state.periode).format('YYYY-MM-DD'),
            amount:state.value,
            remarks:state.remark,
            picId:state.pic?state.pic.id:0
        }
        let {tribe,segment,rm,probability,periode,textPeriode}=pipeline.filter
        if(props.modal_action==='add_invoice'){
            dispatch(postToBeInvoice(props.token,data,`${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/1`))
        }
        if(props.modal_action==='edit_invoice'){
            dispatch(putToBeInvoice(props.token,data,`${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/1`))
        }
        if(props.modal_action==='to_invoice'){
            let new_rm=[]
            state.rms.map((data)=>{
                new_rm.push({userId:data.userId.value,percent:data.percent,nominal:data.nominal,usePercent:data.usePercent})
            })
            let new_tribe=[]
            state.tribes.map((data)=>{
                new_tribe.push({tribeId:data.tribeId.id,percent:data.percent,nominal:data.nominal,usePercent:data.usePercent})
            })
            // let split=state.file.split(',')[1]
            let data={
                id:state.id,
                clientId:state.clientId!==null?state.clientId.value:null,
                dealId:state.dealId!==null?state.dealId.id:null,
                userId:props.profile.id,
                invoiceDate:moment(state.periode).format('YYYY-MM-DD'),
                amount:state.value,
                remarks:state.remark,
                contactId:state.contactId!==null?state.contactId.id:0,
                fileBase64:state.file!==null?state.file.split(',')[1]:null,
                rms:new_rm,
                tribes:new_tribe,
                filename:state.file_name,
                picId:state.pic?state.pic.id:0
            }
            // let fd=new FormData()
            // fd.append('id',state.id)
            // fd.append('clientId',state.clientId!==null?state.clientId.value:null)
            // fd.append('dealId',state.dealId!==null?state.dealId.id:null)
            // fd.append('userId',props.profile.id)
            // fd.append('invoiceDate',moment(state.periode).format('YYYY-MM-DD'))
            // fd.append('amount',state.value)
            // fd.append('remarks',state.remark)
            // fd.append('contactId',state.contactId!==null?state.contactId.id:null)
            // fd.append('files',state.file)

            await dispatch(postToInvoice(props.token,data,`${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/0`))
            dispatch(setTabInvoice('invoiced'))
            dispatch(getInvoice(props.token,`${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/1`,'to_beinvoice'))
        }
       
    }
    const selectClient=(data)=>{
        setState({...state,clientId:data,dealId:null})
        // setState({...state,})
        dispatch(getDeals(props.token,`/${data.value}/2`))
        dispatch(getContact(props.token,data.value))

    }
    const searchToggle=debounce(async (value)=>{
        setSearch(value)
        if(value!==search&&value.length>0){
            setLoading(true)
            let res=await dispatch(getClient(props.token,value))
            if(isEmpty(res)){
                setTextSelect('No options')
            }
            setLoading(false)
        }
        
    },1000)
   
    const onChangeFile=(evt)=>{
        let handle=handleFile(evt)
        if(handle.file_error===null){
            // setState({...state,})
            getBase64(handle.file,(result)=>{
                setState({...state,file:result,file_name:handle.file_name})
            })
        }else{
            setState({...state,error:handle.file_error})
        }
    }
    const renderDisable=()=>{
        if(state.clientId!==null&&state.dealId!==null&&state.value!==null){
            return false
        }else{
            return true
        }
    }
    const renderDisable2=()=>{
        if(state.clientId!==null&&state.dealId!==null&&state.value!==null){
            return false
        }else{
            return true
        }
    }
    const handleDisable=()=>{
        if(props.modal_action!=='see_invoice'){
            return false
        }else{
            return true
        }
    }
    const modalToggle=()=>{
        setModalOpen(!modal_open)
    }
    const onChangePercentToggleTribes=(value)=>{
        settribesharepercent(value==='percentage')
        let new_tribe=[]
        state.tribes.map((d)=>{
            if(value==='percentage'){
                let percent=(d.nominal/state.value)*100
                let nominal = (percent/100)*state.value
                new_tribe.push({...d,usePercent:true,percent:percent,nominal:nominal})
            }else{
                let nominal = (d.percent/100)*state.value
                let percent=(nominal/state.value)*100
                new_tribe.push({...d,usePercent:false,percent:percent,nominal:nominal})
            }
        })
        setState({...state,tribes:new_tribe})
    }
    const onChangePercentToggleRm=(value)=>{
        setrmsharepercent(value==='percentage')
        let new_rm=[]
        state.rms.map((d)=>{
            if (value === 'percentage') {
                let percent = (d.nominal/state.value) * 100;
                let nominal = (percent/100)*state.value
                new_rm.push({...d,usePercent:true,percent:percent,nominal:nominal})
            } else {
                let nominal = (d.percent/100)*state.value;
                let percent = (nominal/state.value)*100
                new_rm.push({...d,usePercent:false,percent:percent,nominal:nominal})
            }
        })
        setState({...state,rms:new_rm})
    }
    const onChangeValue=(value)=>{
        let new_rms=[]
        let new_tribes=[]
        state.rms.map((data)=>{
            let percent = data.percent
            let nominal = (percent/100)*value
            new_rms.push({...data,nominal,percent})
        })
        state.tribes.map((data)=>{
            // if (data.usePercent) {
            //     let percent = (data.nominal/value)*100
            //     let nominal = (percent/100)*value
            //     new_tribes.push({...data,percent,nominal})
            // } else {
            //     let nominal = (data.percent/100)*value
            //     let percent = (nominal/value)*100
                // new_tribes.push({...data,nominal,percent})
            // }
            let percent = data.percent
            let nominal = (percent/100)*value
            new_tribes.push({...data,nominal,percent})

        })
        if(value>0){
            setState({...state,value:value,rms:new_rms,tribes:new_tribes})
        }else{
            setState({...state,value:value})
        }
    }
     return (
        <div className='deals-wrapper'>
            <Loader2/>
            <AddRmModal  rmsharepercent={rmsharepercent} setState={setState} state={state} modal_open={modal_open} modalToggle={modalToggle}/>
            <AddTribeModal tribesharepercent={tribesharepercent} setState={setState} state={state} modal_open_tribe={modal_open_tribe} modalToggleTribe={modalToggleTribe}/>
            <MuiThemeProvider theme={themeField}>
                
            {props.modal_action!=='to_beinvoice'&&
            <>
                <AutoCompleteSelect
                    value={state.clientId}
                    color='primary'
                    noOptionsText={textSelect}
                    loading={loading}
                    disableClearable={true}
                    onChange={(event,value)=>selectClient(value)}
                    options={master.client}
                    getOptionLabel={(option) => option.label}
                    onInputChange={(event,e)=>searchToggle(e)}
                    label={<>Client company name</>}
                    multiline
                    disabled={handleDisable()}
                />
                
                <AutoCompleteSelect
                    onChange={(event,value)=>setState({...state,dealId:value})}
                    options={invoices.list_deals}
                    value={state.dealId}
                    getOptionLabel={(option) => option.text}
                    label={<>Deal name</>}
                    disabled={handleDisable()}
                />
                </>
            }
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker disabled={handleDisable()} format={'DD MMM YYYY'} disablePast={false} value={state.periode} onChange={(data)=>setState({...state,periode:data})}   className={classes.textField}  label='Period' clearable={true} size='small' inputVariant='outlined'  />
                </MuiPickersUtilsProvider>
                {props.modal_action==='to_invoice'&&
                    <AutoCompleteSelect
                        onChange={(event,value)=>setState({...state,contactId:value})}
                        options={master.contact}
                        value={state.contactId}
                        getOptionLabel={(option) => option.text}
                        label={<>Receiver client</>}
                    />
                }
                <AutoCompleteSelect
                    onChange={(event,value)=>setState({...state,pic:value})}
                    options={master.rm_text}
                    value={state.pic}
                    getOptionLabel={(option) => option.text}
                    label={<>Person in Charge</>}
                    disabled={handleDisable()}
                />
                <CurrencyTextField
                    className={classes.textField}
                    label="Value"
                    variant="outlined"
                    value={state.value}
                    currencySymbol="IDR"
                    size='small'
                    outputFormat="string"
                    decimalCharacter="."
                    digitGroupSeparator=","
                    disabled={handleDisable()}
                    onChange={(event, value)=>onChangeValue(value)}
                />
                <TextField
                    label='Remark '
                    type='text'
                    value={state.remark}
                    onChange={(e)=>setState({...state,remark:e.target.value})}
                    variant='outlined'
                    size='small'
                    name='remark'
                    className={classes.textField}
                    multiline
                    disabled={handleDisable()}
                />

                {props.modal_action==='to_invoice'&&
                <>
                
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <p className='semi-bold' style={{margin:0}}>Tribe</p>
                    <Button onClick={addTribe} className='remove-capital' color='secondary' variant='text' size='small'>Add Tribe</Button>
                </div>
                <FormControl  component="fieldset">
                    <RadioGroup onChange={(e)=>onChangePercentToggleTribes(e.target.value)} value={tribesharepercent?"percentage":'nominal'} row aria-label="gender" name="row-radio-buttons-group">
                        <FormControlLabel labelPlacement="end" value="percentage" control={<Radio size='small'/>} label={<p className='card-content-item-jurnal-text' style={{margin:0}}>Using percentage</p>} />
                        <FormControlLabel labelPlacement="end" value="nominal" control={<Radio size='small'/>} label={<p className='card-content-item-jurnal-text' style={{margin:0}}>Using nominal</p>} />
                        
                    </RadioGroup>
                </FormControl>
                <Table  size="small" aria-label="a dense table" style={{color:'#777777'}}>
                    <TableHead>
                    <TableRow >
                        <TableCell className='card-content-item-jurnal-text'>Tribe name</TableCell>
                        <TableCell align='center' className='card-content-item-jurnal-text'>Share</TableCell>
                        <TableCell align='right' className='card-content-item-jurnal-text'>Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.tribes.length>0?state.tribes.map((data,i)=>(
                            <TableRow >
                                <TableCell align='left'  className='card-content-item-jurnal-text-without-weight'>{data.tribeId.text}</TableCell>
                                <TableCell align='center' className='card-content-item-jurnal-text-without-weight'>
                                    {tribesharepercent?`${data.percent}%`:<ReactNumberFormat prefix='Rp ' value={data.nominal} displayType={'text'} thousandSeparator={true} />}
                                </TableCell>
                                <TableCell align='right' className='card-content-item-jurnal-text-without-weight'>
                                    <img src={Edit} onClick={()=>editTribe({...data,index:i})} className='icon-action'/>
                                    <img src={Close} onClick={()=>deleteTribe(i)} className='icon-action'/>
                                </TableCell>
                            </TableRow>
                        ))
                        :
                        <TableRow >
                            <TableCell  style={{textAlign:'center'}} colSpan={4} >No tribe</TableCell>
                        </TableRow>
                        }
                   
                    </TableBody>
                </Table>
                <br/>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <p style={{margin:0}} className='semi-bold'>Relationship Manager</p>
                    <Button onClick={addRm} className='remove-capital' color='secondary' variant='text' size='small'>Add RM</Button>
                </div>
                <FormControl  component="fieldset">
                    <RadioGroup onChange={(e)=>onChangePercentToggleRm(e.target.value)} value={rmsharepercent?"percentage":'nominal'} row aria-label="gender" name="row-radio-buttons-group">
                        <FormControlLabel labelPlacement="end" value="percentage" control={<Radio size='small'/>} label={<p className='card-content-item-jurnal-text' style={{margin:0}}>Using percentage</p>} />
                        <FormControlLabel labelPlacement="end" value="nominal" control={<Radio size='small'/>} label={<p className='card-content-item-jurnal-text' style={{margin:0}}>Using nominal</p>} />
                        
                    </RadioGroup>
                </FormControl>
                <Table  size="small" aria-label="a dense table" style={{color:'#777777'}}>
                    <TableHead>
                    <TableRow >
                        <TableCell className='card-content-item-jurnal-text' >Name</TableCell>
                        <TableCell  align='center' className='card-content-item-jurnal-text'>Share</TableCell>
                        <TableCell align='right' className='card-content-item-jurnal-text'>Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.rms.length>0?state.rms.map((data,i)=>(
                            <TableRow >
                                <TableCell align='left'  className='card-content-item-jurnal-text-without-weight'>{data.full_user.name}</TableCell>
                                <TableCell align='center' className='card-content-item-jurnal-text-without-weight'>
                                {rmsharepercent?`${data.percent}%`:<ReactNumberFormat prefix='Rp ' value={data.nominal} displayType={'text'} thousandSeparator={true} />}
                                </TableCell>
                                <TableCell align='right' className='card-content-item-jurnal-text-without-weight'>
                                    <img src={Edit} onClick={()=>editRm({...data,index:i})} className='icon-action'/>
                                    <img src={Close} onClick={()=>deleteRm(i)} className='icon-action'/>
                                </TableCell>
                            </TableRow>
                        ))
                        :
                        <TableRow >
                            <TableCell  style={{textAlign:'center'}} colSpan={4} >No relationship manager</TableCell>
                        </TableRow>
                        }
                   
                    </TableBody>
                </Table>
                <br/>
                <p className='semi-bold'>Invoice</p>
                <div style={{cursor:'pointer',position:'relative',display:'flex',justifyContent:'space-between'}}>
                    {state.file!==null?
                    <>
                     <p className='semi-bold'>{state.file_name}</p>
                    <input
                        type="file"
                        style={{ opacity: 0,cursor:'pointer',position:'absolute',width:'100%' }}
                        onChange={onChangeFile}
                    />
                    <MuiThemeProvider theme={themeButton}>
                    <Button style={{marginBottom:10}} component='label' className='remove-capital' color='secondary' variant='text' size='small'>
                        Change file
                        <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={onChangeFile}
                        />
                    </Button>
                    </MuiThemeProvider>
                    </>
                    :
                    <>
                    <p className='semi-bold'>Upload invoice file</p>
                    <input
                        type="file"
                        style={{ opacity: 0,cursor:'pointer',position:'absolute',width:'100%' }}
                        onChange={onChangeFile}
                    />
                    <img src={upload} style={{width:20}}/>
                    
                    </>
                    }
                </div>
                </>}
                <div className='modal-footer'>
                    {props.modal_action!=='see_invoice'&&<Button disabled={props.modal_action==='to_invoice'?renderDisable2():renderDisable()} onClick={onClickSave}  size='small' color='primary' variant='contained' className='btn-remove-capital btn-rounded' style={{width:120}}>Save</Button>}
                </div>
            </MuiThemeProvider>
        </div>
    )
}
