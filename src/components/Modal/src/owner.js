import React,{useState, useEffect} from 'react'
import {Button,TextField,FormControl,InputLabel,OutlinedInput,MenuItem,Select,
    FormHelperText,Modal,RadioGroup,Radio,FormControlLabel,Checkbox,Table,TableHead,TableRow,TableCell,TableBody} from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles } from '@material-ui/core/styles'
import Select1 from 'react-select'
import { useDispatch, useSelector } from "react-redux";
import Close from 'assets/icon/close.svg'
import Edit from 'assets/icon/edit.png'
import {addOwner} from 'redux/actions/pipeline'
import {modalToggleReset} from 'redux/actions/general'
import AutoCompleteSelect from 'components/Select'
import ReactNumberFormat from 'react-number-format'

const themeField = createMuiTheme({  
    palette: {  
        primary: {
            main:'#70bf4e',
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
  },
    textField2: {
      [`& fieldset`]: {
        borderRadius: 10,
      },
      width:'100%',
    //   marginBottom:15
  }
  
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
            let nominal = (e.target.value/100)*state.proposalValue
            if (e.target.value>0) {
                setRm({...rm,percent:e.target.value,nominal})
            } else {
                setRm({...rm,percent:e.target.value})
            }
        } else {
            let percent = (e.target.value/state.proposalValue)*100
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
            let nominal = (e.target.value/100)*state.proposalValue
            if (e.target.value>0) {
                setTribe({...tribe,percent:e.target.value,nominal})
            } else {
                setTribe({...tribe,percent:e.target.value})
            }
        } else {
            let percent = (e.target.value/state.proposalValue)*100
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
                    <br/>
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
                            type='number'
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
export default function Owner(props) {
    const classes=useStyles()
    const [modal_open,setModalOpen]=useState(false)
    const [modal_open_tribe,setModalOpenTribe]=useState(false)
    const dispatch=useDispatch()
    const [state, setState] = useState({
        tribes:[],
        segmentId:0,
        branchId:0,
        consultans:[],
        rms:[],
        modal_data:null,
        proposalValue:null,
        pic:null
    })
    const [tribesharepercent, settribesharepercent] = useState(false)
    const [rmsharepercent, setrmsharepercent] = useState(false)
    useEffect(()=>{
        if(props.modal_data!==null){
            let new_consultants=[]
            let new_tribe=[]
            
            props.modal_data.rms.map((d)=>{
                setrmsharepercent(d.usePercent)
            })
            props.modal_data.tribe.map((d)=>{
                settribesharepercent(d.usePercent)
            })

            props.modal_data.consultants.map((data)=>{
                new_consultants.push({label:data.text,value:data.id})
            })
            props.modal_data.tribe.map((data)=>{
                new_tribe.push({...data,tribeId:{id:data.id,text:data.text},percent:data.percent})
            })
            setState({
                ...state,
                tribes:new_tribe,
                segmentId:props.modal_data.segment.id,
                branchId:props.modal_data.branch.id,
                consultans:new_consultants,
                rms:props.modal_data.rms,
                proposalValue:props.modal_data.proposalValue,
                pic:props.modal_data.pic
            })
        }
    },[])
    // console.log('state', state);

    const master=useSelector(state=>state.master)
    const modalToggle=()=>{
        setModalOpen(!modal_open)
    }
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
    const onChange=(e)=>{
        let {name,value}=e.target
        setState({
            ...state,
            [name]:value
        })
    }
    const onClickSave=()=>{
        let new_consultants=[]
        let new_rms=[]
        let new_tribes=[]
        state.consultans.map((data)=>{
            new_consultants.push(data.value)
        })
        state.rms.map((data)=>{
            if (data.usePercent) {
                let percent = data.percent
                let nominal = (percent/100)*state.proposalValue
                new_rms.push({...data,userId:data.full_user.userId,percent:isNaN(percent)?0:percent,nominal:isNaN(nominal)?0:nominal})
            } else {
                let nominal = data.nominal
                let percent = (nominal/state.proposalValue)*100
                new_rms.push({...data,userId:data.full_user.userId,percent:isNaN(percent)?0:percent,nominal:isNaN(nominal)?0:nominal})

            }
        })
        state.tribes.map((data)=>{
            if (data.usePercent) {
                let percent = data.percent
                let nominal = (percent/100)*state.proposalValue
                new_tribes.push({...data,tribeId:data.tribeId.id,percent:isNaN(percent)?0:percent,nominal:isNaN(nominal)?0:nominal})
            } else {
                let nominal = data.nominal
                let percent = (nominal/state.proposalValue)*100
                new_tribes.push({...data,tribeId:data.tribeId.id,percent:isNaN(percent)?0:percent,nominal:isNaN(nominal)?0:nominal})
            }
        })
        let data={
            dealId:props.modal_data.dealId,
            userId:props.profile.id,
            segmentId:state.segmentId,
            branchId:state.branchId,
            consultants:new_consultants,
            rms:new_rms,
            tribes:new_tribes,
            picId:state.pic?state.pic.id:0
        }
        // console.log('data', data);
        dispatch(addOwner(props.token,data))
    }
    const onChangePercentToggleTribes=(value)=>{
        settribesharepercent(value==='percentage')
        let new_tribe=[]
        state.tribes.map((d)=>{
            if(value==='percentage'){
                let percent=(d.nominal/state.proposalValue)*100
                let nominal = (percent/100)*state.proposalValue
                new_tribe.push({...d,usePercent:true,percent:percent,nominal:nominal})
            }else{
                let nominal = (d.percent/100)*state.proposalValue
                let percent=(nominal/state.proposalValue)*100
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
                let percent = (d.nominal/state.proposalValue) * 100;
                let nominal = (percent/100)*state.proposalValue
                new_rm.push({...d,usePercent:true,percent:percent,nominal:nominal})
            } else {
                let nominal = (d.percent/100)*state.proposalValue;
                let percent = (nominal/state.proposalValue)*100
                new_rm.push({...d,usePercent:false,percent:percent,nominal:nominal})
            }
        })
        setState({...state,rms:new_rm})
    }
    return (
        <div>
            <AddRmModal rmsharepercent={rmsharepercent} setState={setState} state={state} modal_open={modal_open} modalToggle={modalToggle}/>
            <AddTribeModal tribesharepercent={tribesharepercent} setState={setState} state={state} modal_open_tribe={modal_open_tribe} modalToggleTribe={modalToggleTribe}/>
            <MuiThemeProvider theme={themeField}>
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
                    <p className='semi-bold'style={{margin:0}}>Relationship Manager</p>
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
                        <TableCell className='card-content-item-jurnal-text' style={{width:215}}>Name</TableCell>
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
                
                <div style={{display:'flex',marginTop:10}}>
                    <FormControl variant="outlined" size="small" className='add-proposal__field' >
                        <InputLabel  htmlFor="category">Segment</InputLabel>
                        <Select name='segmentId' value={state.segmentId}  onChange={onChange} labelId="label" id="select"  labelWidth={65} className='field-radius'>
                            {master.segments.map((data,i)=>(
                                <MenuItem value={data.id}>{data.text}</MenuItem>
                            ))}
                            
                        </Select>
                    </FormControl>
                    &nbsp;&nbsp;
                    <FormControl variant="outlined" size="small" className='add-proposal__field' >
                        <InputLabel  htmlFor="category">Branch</InputLabel>
                        <Select name='branchId' value={state.branchId}  onChange={onChange} labelId="label" id="select"  labelWidth={65} className='field-radius'>
                            {master.branches.map((data,i)=>(
                                <MenuItem value={data.id}>{data.text}</MenuItem>
                            ))}
                            
                        </Select>
                    </FormControl>
                </div>
                <AutoCompleteSelect
                    // multiple
                    onChange={(event,value)=>setState({...state,pic:value})}
                    options={master.rm_text}
                    getOptionLabel={(option) => option.text}
                    label={<>Person in Charge</>}
                    value={state.pic}

                /> 
                <AutoCompleteSelect
                    multiple
                    onChange={(event,value)=>setState({...state,consultans:value})}
                    options={master.employee}
                    getOptionLabel={(option) => option.label}
                    label={<>Consultant</>}
                    value={state.consultans}

                /> 
                
                
            </MuiThemeProvider>
            <MuiThemeProvider theme={themeButton}>
                <div className='modal-footer'>
                    <Button onClick={onClickSave}  size='small' color='secondary' variant='contained' className='btn-remove-capital btn-rounded' style={{width:120,height:30}}>Save</Button>
                </div>
            </MuiThemeProvider>
        </div>
    )
}
