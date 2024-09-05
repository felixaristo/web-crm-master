import React,{useState,useEffect} from 'react'
import {Button,Modal,TextField,FormControl,InputLabel,OutlinedInput,MenuItem,Select,
    FormHelperText,FormControlLabel,RadioGroup,Radio,Table,TableHead,TableRow,TableCell,TableBody } from '@material-ui/core'
import { useDispatch, useSelector } from "react-redux";
import { SignalCellularNull } from '@material-ui/icons';
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles
} from '@material-ui/core/styles'
import {
    DatePicker,
    TimePicker,
    DateTimePicker,
    MuiPickersUtilsProvider,
  } from '@material-ui/pickers';
  import MomentUtils from '@date-io/moment';
import AutoCompleteSelect from 'components/Select'
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import moment from 'moment'
import {debounce,isEmpty} from 'lodash'
import {getClient ,getContact,tabToggle} from 'redux/actions/master'
import {viewFile} from 'redux/actions/pipeline'
import {getDeals,putInvoice,postToBeInvoice,putToBeInvoice,postToInvoice,getInvoice,addInvoice, setInvoiceAction} from 'redux/actions/invoices'
import {handleFile,getBase64} from 'components/handleFile'
import Close from 'assets/icon/close.svg'
import Edit from 'assets/icon/edit.png'
import upload from 'assets/icon/Upload.svg'
import Loader2 from 'components/Loading/loader2'
import {getClient as getForClient,setClientAction,clearState} from 'redux/actions/client'
import {modalToggleReset,modalToggle as modalToggles} from 'redux/actions/general'
import ModalContact from 'components/Modal/src/add_contact_deal'
import ReactNumberFormat from 'react-number-format'

const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#FFB100',
            contrastText: '#FFFFFF',
        },
        secondary: {
            // main:'#FF7165',
            main:'#eeeeee',
            contrastText: '#ff7165',
            // contrastText: '#777777',
        }
    } 
})
const themeButton2 = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#3B99EB',
            contrastText: '#FFFFFF',
        },
        secondary: {
            // main:'#FF7165',
            main:'#ffb100',
            // contrastText: '#ff7165',
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
      marginBottom:15
  }
  
}));
const AddRmModal=({modal_open,modalToggle,setState,state,selected_rm,setSelected,rmsharepercent})=>{
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
        // console.log('ahihihi',state.modal_data)
        if(modal_open&&state.modal_data!==null){
            setSelected(state.rms)
            // console.log('hello', modal_open,state.modal_data)
            setRm({
                ...rm,
                // userId:{label:state.modal_data.full_user.name,value:state.modal_data.full_user.userId},
                userId:state.modal_data.userId,
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
            if(selected_rm.length>0){
                selected_rm.map((map,index)=>{
                    let new_selected={
                        userId:data,
                        full_user:{userId:s[0].userId,email:s[0].email,name:s[0].name}
                    }
                    if(rm.userId!==null){
                        if(map.userId.value===rm.userId.value){
                            selected_rm.splice(index,1,new_selected)
                        }else{
        
                            setSelected([
                                ...selected_rm,
                                {
                                    userId:data,
                                    full_user:{userId:s[0].userId,email:s[0].email,name:s[0].name}
                                }
                            ])
                        }
                    }else{
                        setSelected([
                            ...selected_rm,
                            {
                                userId:data,
                                full_user:{userId:s[0].userId,email:s[0].email,name:s[0].name}
                            }
                        ])
                    }
                    
                })
            }else{
                setSelected([
                    ...selected_rm,
                    {
                        userId:data,
                        full_user:{userId:s[0].userId,email:s[0].email,name:s[0].name}
                    }
                ])
            }
            

            
        }
        
        
        // console.log('hello  ', data)
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
            console.log('asdf', rm)
            setState({
                ...state,
                rms:[...state.rms,rm]
            })
        //    setRm({
        //        ...rm,
        //        percent:null,
        //        full_user:null,
        //        userId:null
        //    })
            modalToggle()
        }
        
    }
    const renderRmOption=()=>{
        // master.rm
        let new_rm_opt=[]
        master.rm.map((data)=>{
            let filter=selected_rm.filter((filter)=>{
                return filter.userId.value===data.value
            })
            if(filter.length<1){
                new_rm_opt.push(data)
            }
        })
        return new_rm_opt
    }
    const onChangeValue=(e)=>{
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
                            options={renderRmOption()}
                            getOptionLabel={(option) => option.label}
                            label={<>Name</>}
                            value={rm.userId}

                        />
                        
                        <TextField
                            label={rmsharepercent?"Percentage (%)":"Nominal (IDR)"}
                            type='number'
                            value={rmsharepercent?rm.percent:rm.nominal}
                            onChange={(e)=>onChangeValue(e)}
                            variant='outlined'
                            size='small'
                            className={classes.textField}

                        />
                    </MuiThemeProvider>
                    <MuiThemeProvider theme={themeButton2}>
                        <div className='modal-footer'>
                            <Button disabled={renderDisable()} onClick={onClickSave}  size='small' color='secondary' variant='contained' className='btn-remove-capital btn-rounded' style={{width:120,height:30}}>Save</Button>
                        </div>
                    </MuiThemeProvider>
                </div>

            </div>
        </Modal>
    )
}
const AddTribeModal=({modal_open_tribe,modalToggleTribe,setState,state,selected_tribe,setSelectedTribe,tribesharepercent})=>{
    const classes=useStyles()
    const [tribe, setTribe] = useState({
        tribeId:null,
        percent:0,
        nominal:0,
        usePercent:true
    })
    const master=useSelector(state=>state.master)

    useEffect(()=>{
        // console.log('ahihihi',tribe)

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
    // console.log('tribe.tribeId', tribe.tribeId)
    const renderDisable=()=>{
        if(tribe.tribeId!==null){
            // alert('hello')
            return false
        }else{
            return true
        }
    }
    const onChange=(id)=>{
        // console.log('id', id)
        setTribe({...tribe,tribeId:id})
    
        if(selected_tribe.length>0){
            selected_tribe.map((map,index)=>{
                if(tribe.tribeId!==null){
                    if(map.tribeId===tribe.tribeId.id){
                        selected_tribe.splice(index,1,{tribeId:id})
                    }else{
    
                        setSelectedTribe([
                            ...selected_tribe,
                            {
                                tribeId:id,
                            }
                        ])
                    }
                }else{
                    setSelectedTribe([
                        ...selected_tribe,
                        {
                            tribeId:id,
                        }
                    ])
                }
                
            })
        }else{
            setSelectedTribe([
                ...selected_tribe,
                {
                    tribeId:id,
                }
            ])
        }
    }
    const renderTribeOption=()=>{
        let new_tribe_opt=[]
        master.tribes.map((data)=>{
            let filter=selected_tribe.filter((filter)=>{
                return filter.tribeId.id===data.id
            })
            if(filter.length<1){
                new_tribe_opt.push(data)
            }
        })
        return new_tribe_opt
    }
    const onChangeValue=(e)=>{
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
                            onChange={(event,value)=>onChange(value)}
                            options={renderTribeOption()}
                            getOptionLabel={(option) => option.text}
                            label={<>Tribe</>}
                            value={tribe.tribeId}

                        />
                        
                        <TextField
                           label={tribesharepercent?"Percentage (%)":"Nominal (IDR)"}
                           type='text'
                           value={tribesharepercent?tribe.percent:tribe.nominal}
                           onChange={(e)=>onChangeValue(e)}
                           variant='outlined'
                           size='small'
                           className={classes.textField}

                        />
                    </MuiThemeProvider>
                    <MuiThemeProvider theme={themeButton2}>
                        <div className='modal-footer'>
                            <Button disabled={renderDisable()} onClick={onClickSave}  size='small' color='secondary' variant='contained' className='btn-remove-capital btn-rounded' style={{width:120,height:30}}>Save</Button>
                        </div>
                    </MuiThemeProvider>
                </div>

            </div>
        </Modal>
    )
}
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

export default function Add_invoice(props) {
    const dispatch=useDispatch()
    const classes=useStyles()
    const [search,setSearch]=useState('')
    const [loading,setLoading]=useState(false)
    const [textSelect,setTextSelect]=useState('Type company name')
    const [modal_open,setModalOpen]=useState(false)
    const [modal_open_contact,setModalOpenContact]=useState(false)
    const [modal_open_tribe,setModalOpenTribe]=useState(false)
    const [selected_rm,setSelected]=useState([])
    const [selected_tribe,setSelectedTribe]=useState([])

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
        branchId:null,
        dealName:'',
        pic:null
    })

    const [tribesharepercent, settribesharepercent] = useState(false)
    const [rmsharepercent, setrmsharepercent] = useState(false)

    const pipeline=useSelector(state=>state.pipeline)
    const invoices=useSelector(state=>state.invoices)
    const master=useSelector(state=>state.master)
    const {detail_invoice}=invoices
    useEffect(()=>{
        // console.log('detail_invoice', detail_invoice)
        if(detail_invoice!==null){
            // console.log('detail_invoice', detail_invoice);
            let new_tribes=[]
            let new_rms=[]
            let new_selected_rm=[]
            let new_selected_tribe=[]
            detail_invoice.tribes.map((data)=>{
                settribesharepercent(data.usePercent)

                new_tribes.push({
                    tribeId:{id:data.id,text:data.text},
                    percent:data.percent,
                    nominal:data.nominal,
                    usePercent:data.usePercent,
                })
                new_selected_tribe.push({
                    tribeId:{id:data.id,text:data.text},
                    percent:data.percent,
                    nominal:data.nominal,
                    usePercent:data.usePercent,
                })
            })
            detail_invoice.rms.map((data)=>{
                setrmsharepercent(data.usePercent)

                new_rms.push({
                    percent:data.percent,
                    userId:{label:data.text,value:data.id},
                    full_user:{name:data.text,id:data.id,percent:data.percent},
                    nominal:data.nominal,
                    usePercent:data.usePercent,
                })
                new_selected_rm.push({
                    percent:data.percent,
                    userId:{label:data.text,value:data.id},
                    full_user:{name:data.text,id:data.id,percent:data.percent},
                    nominal:data.nominal,
                    usePercent:data.usePercent,
                })
            })
            setSelected(new_selected_rm)
            setSelectedTribe(new_selected_tribe)
            setState({
                ...state,
                clientId:detail_invoice.client,
                dealName:detail_invoice.deal.text,
                periode:moment(detail_invoice.invoiceDate),
                value:detail_invoice.value,
                remark:detail_invoice.remarks,
                id:detail_invoice.id,
                file_name:detail_invoice.filename,
                contactId:detail_invoice.contact,
                rms:new_rms,
                tribes:new_tribes,
                branchId:detail_invoice.branch,
                dealId:detail_invoice.deal.id,
                pic:detail_invoice.pic
            })

        }else{
            setState({
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
                branchId:null,
                dealName:'',
                pic:null
            })
        }
    },[])
    const selectClient=(data)=>{
        setState({...state,clientId:data,dealId:null})
        // setState({...state,})
        dispatch(getDeals(props.token,`/${data.value}/2`))
        dispatch(getContact(props.token,data.value))
        

    }
    const searchToggle=debounce(async (value)=>{
        setSearch(value)
        // setTextSelect('No options')
        if(value!==search&&value.length>0){
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
        selected_rm.splice(data,1)
        setSelected(selected_rm)
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
        selected_tribe.splice(data,1)
        setSelectedTribe(selected_tribe)
        setState({
            ...state,
            tribes:state.tribes
        })
    }
    const onChangeFile=(evt)=>{
        let handle=handleFile(evt)
        // if(handle)
        if(handle.file_error===null){
            // setState({...state,})
            console.log('handle', handle)
            getBase64(handle.file,(result)=>{
                setState({...state,file:result,file_name:handle.file_name})
            })
        }else{
            // alert('hell')
            setState({...state,error:handle.file_error})
        }
    }
    const modalToggle=()=>{
        setModalOpen(!modal_open)
    }
    const onClickSave=async ()=>{
        let {tribe,segment,rm,probability,periode,textPeriode}=pipeline.filter
        let new_rm=[]
        state.rms.map((data)=>{
            new_rm.push({userId:data.userId.value,percent:data.percent,nominal:data.nominal,usePercent:data.usePercent})
        })
        let new_tribe=[]
        state.tribes.map((data)=>{
            new_tribe.push({tribeId:data.tribeId.id,percent:data.percent,nominal:data.nominal,usePercent:data.usePercent})
        })
        let data={
            id:state.id,
            clientId:state.clientId!==null?state.clientId.value:null,
            // dealId:state.dealId!==null?state.dealId:null,
            dealName:state.dealName,
            userId:props.profile.id,
            invoiceDate:moment(state.periode).format('YYYY-MM-DD'),
            amount:parseInt(state.value),
            remarks:state.remark,
            contactId:state.contactId!==null?state.contactId.id:0,
            fileBase64:state.file!==null?state.file.split(',')[1]:null,
            filename:state.file_name,
            rms:new_rm,
            tribes:new_tribe,
            branchId:state.branchId!==null?state.branchId.id:0,
            picId:state.pic?state.pic.id:0

        }
        if(invoices.invoice_action==='add_invoice'){
            await dispatch(addInvoice(props.token,data,`${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/0`))
        }
        if(invoices.invoice_action==='edit_invoice'){
            let data_edit={
                id:state.id,
                clientId:state.clientId!==null?state.clientId.value:null,
                dealId:state.dealId!==null?state.dealId:null,
                dealName:state.dealName,
                userId:props.profile.id,
                invoiceDate:moment(state.periode).format('YYYY-MM-DD'),
                amount:parseInt(state.value),
                remarks:state.remark,
                contactId:state.contactId!==null?state.contactId.id:0,
                fileBase64:state.file!==null?state.file.split(',')[1]:null,
                filename:state.file_name,
                rms:new_rm,
                tribes:new_tribe,
                branchId:state.branchId!==null?state.branchId.id:0,
                picId:state.pic?state.pic.id:0
    
            }
            // console.log('data_edit', data_edit)
            await dispatch(putInvoice(props.token,data_edit,`${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/0`))
        }
        if(invoices.invoice_action==='detail_invoice'){
            dispatch(setInvoiceAction('edit_invoice'))
           
        }
       
    }
    const addClient=async ()=>{
        dispatch(clearState())
        dispatch(setClientAction('add_client'))
        await dispatch(getForClient(props.token,`/0/0/0/1/10/*`))
        dispatch(tabToggle('client','invoice'))
        dispatch(modalToggleReset())
        
    }
    const deleteInvoice=(invoicesId)=>{
        dispatch(modalToggles({ 
            modal_open: true,
            modal_title: `Are you sure delete this payment?`,
            modal_component: "confirm2",
            modal_size:400,
            modal_type:'confirm',
            modal_data:{
                invoicesId:invoicesId,
                tab:props.tab_invoice,
                msg:`<p></p>`,
                title_cancel:'No, Cancel',
                title_yes:'Yes, Delete'
            },
            modal_action:'delete_invoice'
        }))
    }
    const renderDisable=()=>{
        if(invoices.invoice_action==='detail_invoice'||invoices.invoice_action==='see_invoice'){
            return true
        }else{
            return false
        }
    }
    const onClickView=(url)=>{
        dispatch(viewFile(props.token,`3/${state.id}/${props.profile.id}`))
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
    // console.log('first', state.rms,state.tribes);
    return (
        <div>
            <Loader2/>
                <AddRmModal rmsharepercent={rmsharepercent} selected_rm={selected_rm} setSelected={setSelected}  setState={setState} state={state} modal_open={modal_open} modalToggle={modalToggle}/>
                <AddTribeModal tribesharepercent={tribesharepercent} selected_tribe={selected_tribe} setSelectedTribe={setSelectedTribe} setState={setState} state={state} modal_open_tribe={modal_open_tribe} modalToggleTribe={modalToggleTribe}/>
                <AddContact clientId={state.clientId} modal_open={modal_open_contact} modalToggle={()=>setModalOpenContact(!modal_open_contact)} token={props.token} profile={props.profile}/>
            <MuiThemeProvider theme={themeField}></MuiThemeProvider>
            <div className='head-section'>
                    <div>
                        <h4>{invoices.invoice_action==='detail_invoice'||invoices.invoice_action==='edit_invoice'?'Detail Invoice':'Add new Invoices'}</h4>
                    </div>
                    <div>
                        <MuiThemeProvider theme={themeButton}>
                            <Button onClick={()=>props.tabToggle('invoice')} size='small' color='primary' variant='outlined' className='head-section__btn'>Back</Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {invoices.invoice_action!=='add_invoice'&&invoices.invoice_action!=='see_invoice'&&
                             <>
                            <Button  onClick={()=>deleteInvoice(state.id)} size='small' color='secondary' variant='contained' className='head-section__btn'>
                                Delete
                            </Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            </> }
                            {invoices.invoice_action!=='see_invoice'&&
                            <Button disabled={state.tribes.length>0?false:true}  onClick={onClickSave} size='small' color='primary' variant='contained' className='head-section__btn'>
                                {invoices.invoice_action==='add_invoice'||invoices.invoice_action==='edit_invoice'?'Save':'Edit'}
                            </Button>}
                        </MuiThemeProvider>
                    </div>
                </div>
                <div className='card-content'>
                    <div style={{paddingLeft:20,paddingTop:20}}>
                    <p className='bold'>Invoice information</p>
                    </div>
                    <br/>
                    <div className='card-invoice-grid'>
                        <div style={{width:'90%'}}>
                            
                            <MuiThemeProvider theme={themeField}>
                                {invoices.invoice_action==='add_invoice'&&<div style={{display:'flex',justifyContent:'flex-end'}}><Button disabled={renderDisable()} onClick={addClient} className='remove-capital' color='secondary' variant='text' size='small'>Add new company</Button></div>}
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
                                    disabled={renderDisable()}

                                />
                                
                                {/* <AutoCompleteSelect
                                    onChange={(event,value)=>setState({...state,dealId:value})}
                                    options={invoices.list_deals}
                                    value={state.dealId}
                                    getOptionLabel={(option) => option.text}
                                    label={<>Deal name</>}

                                /> */}
                                <TextField
                                    label='Deal name '
                                    type='text'
                                    value={state.dealName}
                                    onChange={(e)=>setState({...state,dealName:e.target.value})}
                                    variant='outlined'
                                    size='small'
                                    name='remark'
                                    className={classes.textField}
                                    multiline
                                    disabled={renderDisable()}
                                />
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <DatePicker disabled={renderDisable()} format={'DD MMM YYYY'} disablePast={false} value={state.periode} onChange={(data)=>setState({...state,periode:data})}   className={classes.textField}  label='Period' clearable={true} size='small' inputVariant='outlined'  />
                                </MuiPickersUtilsProvider>
                                <AutoCompleteSelect
                                    onChange={(event,value)=>setState({...state,branchId:value})}
                                    options={master.branches}
                                    value={state.branchId}
                                    getOptionLabel={(option) => option.text}
                                    label={<>Branch</>}
                                    disabled={renderDisable()}

                                />
                                <AutoCompleteSelect
                                    onChange={(event,value)=>setState({...state,pic:value})}
                                    options={master.rm_text}
                                    value={state.pic}
                                    getOptionLabel={(option) => option.text}
                                    label={<>Person in Charge</>}
                                    disabled={renderDisable()}

                                />
                                {invoices.invoice_action==='add_invoice'&&<div style={{display:'flex',justifyContent:'flex-end'}}><Button disabled={state.clientId!==null&&renderDisable()===false?false:true} onClick={()=>setModalOpenContact(!modal_open_contact)} className='remove-capital' color='secondary' variant='text' size='small'>Add new contact</Button></div>}
                                <AutoCompleteSelect
                                    onChange={(event,value)=>setState({...state,contactId:value})}
                                    options={master.contact}
                                    value={state.contactId}
                                    getOptionLabel={(option) => option.text}
                                    label={<>Receiver client</>}
                                    disabled={renderDisable()}
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
                                    disabled={renderDisable()}
                                    
                                />
                            </MuiThemeProvider>

                        </div>
                        <div>
                        <MuiThemeProvider theme={themeButton2}>
                        <>
                        <div style={{display:'flex',justifyContent:'space-between'}}>
                            <p className='semi-bold'>Tribe</p>
                            <Button disabled={renderDisable()} onClick={addTribe} className='remove-capital' color='primary' variant='text' size='small'>Add Tribe</Button>
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
                                            <img src={Edit} onClick={()=>renderDisable()?null:editTribe({...data,index:i})} className='icon-action'/>
                                            <img src={Close} onClick={()=>renderDisable()?null:deleteTribe(i)} className='icon-action'/>
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
                            <p className='semi-bold'>Relationship Manager</p>
                            <Button  disabled={renderDisable()} onClick={addRm} className='remove-capital' color='primary' variant='text' size='small'>Add RM</Button>
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
                                            <img src={Edit} onClick={()=>renderDisable()?null:editRm({...data,index:i})} className='icon-action'/>
                                            <img src={Close} onClick={()=>renderDisable()?null:deleteRm(i)} className='icon-action'/>
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
                        </>
                        </MuiThemeProvider>
                        <br/>
                        <p className='semi-bold'>Invoice</p>
                        <div style={{position:'relative',display:'flex',justifyContent:'space-between'}}>
                            {state.file_name!==''?
                            <>
                            <div style={{width:300}}>
                            <p onClick={invoices.invoice_action!=='add_invoice'&&onClickView} className={`semi-bold ${invoices.invoice_action!=='add_invoice'&&'click-view'}`}>{state.file_name}</p>
                            </div>
                            {/* <input
                                type={renderDisable()?'text':'file'}
                                style={{ opacity: 0,cursor:'pointer',position:'absolute',width:'100%' }}
                                onChange={onChangeFile}
                            /> */}
                            <MuiThemeProvider theme={themeButton}>
                            <Button disabled={renderDisable()} style={{marginBottom:10}} component='label' className='remove-capital' color='primary' variant='text' size='small'>
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
                                type={renderDisable()?'text':'file'}
                                style={{ opacity: 0,cursor:'pointer',position:'absolute',width:'100%' }}
                                onChange={onChangeFile}
                            />
                            <img src={upload} style={{width:20}}/>
                            
                            </>
                            }
                        </div>
                        <br/>
                        <CurrencyTextField
                            disabled={renderDisable()}
                            className={classes.textField}
                            label="Value"
                            variant="outlined"
                            value={state.value}
                            currencySymbol="IDR"
                            size='small'
                            outputFormat="string"
                            decimalCharacter="."
                            digitGroupSeparator=","
                            onChange={(event, value)=>onChangeValue(value)}
                        />
                        </div>
                    </div>
                </div>
                <br/>
                <div className='head-section'>
                    <div>
                        {/* <h4>Add new Invoice</h4> */}
                    </div>
                    <div>
                    <MuiThemeProvider theme={themeButton}>
                            <Button onClick={()=>props.tabToggle('invoice')} size='small' color='primary' variant='outlined' className='head-section__btn'>Back</Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {invoices.invoice_action!=='add_invoice'&&invoices.invoice_action!=='see_invoice'&&
                             <>
                            <Button  onClick={()=>deleteInvoice(state.id)} size='small' color='secondary' variant='contained' className='head-section__btn'>
                                Delete
                            </Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            </> }
                            {invoices.invoice_action!=='see_invoice'&&
                            <Button disabled={state.tribes.length>0?false:true}  onClick={onClickSave} size='small' color='primary' variant='contained' className='head-section__btn'>
                                {invoices.invoice_action==='add_invoice'||invoices.invoice_action==='edit_invoice'?'Save':'Edit'}
                            </Button>}
                        </MuiThemeProvider>
                    </div>
                </div>
        </div>
    )
}
